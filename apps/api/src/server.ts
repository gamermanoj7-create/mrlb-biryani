import Fastify from "fastify";
import cors from "@fastify/cors";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const app=Fastify({logger:true});
const db=new PrismaClient();
await app.register(cors,{origin:true});

app.get("/health",async()=>({ok:true,service:"mrlb-biryani-api"}));

app.get("/products",async()=>db.product.findMany({
  where:{active:true},
  include:{category:true,variants:{where:{active:true}},addons:{where:{active:true}}},
  orderBy:{createdAt:"desc"}
}));

app.get("/products/:id",async(req:any,reply)=>{
  const p=await db.product.findUnique({
    where:{id:req.params.id},
    include:{category:true,variants:true,addons:true}
  });
  if(!p)return reply.code(404).send({error:"Product not found"});
  return p;
});

/* Customer: no login, OTP or account required. */
app.post("/orders",async(req,reply)=>{
  const b=z.object({
    customerName:z.string().min(2).max(100),
    phone:z.string().min(8).max(20),
    address:z.string().min(5).max(500),
    items:z.array(z.object({
      productId:z.string().optional(),
      productName:z.string().min(1),
      variantName:z.string().min(1),
      quantity:z.number().int().positive().max(50),
      unitPrice:z.number().int().nonnegative()
    })).min(1),
    deliveryCharge:z.number().int().nonnegative().default(0),
    paymentMethod:z.enum(["COD","UPI"]).default("COD")
  }).parse(req.body);

  const subtotal=b.items.reduce((sum,i)=>sum+i.quantity*i.unitPrice,0);
  const total=subtotal+b.deliveryCharge;

  // Guest customer record; no password/OTP/authentication.
  const customer=await db.user.upsert({
    where:{phone:b.phone},
    update:{name:b.customerName},
    create:{name:b.customerName,phone:b.phone}
  });

  let addr=await db.address.findFirst({where:{userId:customer.id,line1:b.address}});
  if(!addr) addr=await db.address.create({
    data:{userId:customer.id,label:"Delivery",line1:b.address,city:"",state:"West Bengal",postalCode:"000000"}
  });

  const order=await db.order.create({
    data:{
      orderNumber:"MRLB-"+Date.now().toString().slice(-8),
      idempotencyKey:"guest-"+Date.now()+"-"+Math.random().toString(36).slice(2),
      userId:customer.id,
      addressId:addr.id,
      paymentMethod:b.paymentMethod,
      subtotal,
      deliveryCharge:b.deliveryCharge,
      tax:0,
      discount:0,
      total,
      status:"RECEIVED",
      paymentStatus:b.paymentMethod==="COD"?"COD_PENDING":"PENDING",
      items:{create:b.items.map(i=>({
        productId:i.productId,
        productName:i.productName,
        variantName:i.variantName,
        quantity:i.quantity,
        unitPrice:i.unitPrice
      }))},
      payment:{create:{amount:total,status:b.paymentMethod==="COD"?"COD_PENDING":"PENDING"}},
      delivery:{create:{status:"UNASSIGNED"}}
    },
    include:{user:true,address:true,items:true,payment:true,delivery:true}
  });
  return reply.code(201).send(order);
});

/* Admin panel uses a simple server-side admin key. No customer OTP. */
const admin=async(req:any,reply:any)=>{
  const key=process.env.ADMIN_KEY;
  if(!key || req.headers["x-admin-key"]!==key)
    return reply.code(401).send({error:"Admin access denied"});
};

app.get("/admin/orders",{preHandler:admin},async()=>{
  return db.order.findMany({
    include:{user:true,address:true,items:true,payment:true,delivery:true},
    orderBy:{createdAt:"desc"},
    take:1000
  });
});

app.patch("/admin/orders/:id/status",{preHandler:admin},async(req:any,reply)=>{
  const b=z.object({status:z.enum([
    "RECEIVED","ACCEPTED","PREPARING","READY","OUT_FOR_DELIVERY","DELIVERED","CANCELLED"
  ])}).parse(req.body);
  try{
    return await db.order.update({where:{id:req.params.id},data:{status:b.status}});
  }catch{
    return reply.code(404).send({error:"Order not found"});
  }
});

app.get("/admin/dashboard",{preHandler:admin},async()=>{
  const [orders,customers,revenue]=await Promise.all([
    db.order.count(),
    db.user.count(),
    db.order.aggregate({_sum:{total:true}})
  ]);
  return {orders,customers,revenue:revenue._sum.total||0};
});

app.setErrorHandler((err:any,_req,reply)=>{
  reply.code(err.statusCode||400).send({error:err.message||"Request failed"});
});
app.addHook("onClose",async()=>{await db.$disconnect()});
await app.listen({port:Number(process.env.PORT||4000),host:"0.0.0.0"});

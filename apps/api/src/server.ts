import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import bcrypt from "bcryptjs";
import { PrismaClient, OrderStatus, PaymentStatus } from "@prisma/client";
import { z } from "zod";

const app = Fastify({ logger: true });
const db = new PrismaClient();

await app.register(cors, { origin: true });
await app.register(jwt, { secret: process.env.JWT_SECRET || "dev-secret-change-me" });

const auth = async (req:any, reply:any) => {
  try { await req.jwtVerify(); } catch { return reply.code(401).send({error:"Unauthorized"}); }
};

app.get("/health", async () => ({ ok:true, service:"mrlb-biryani-api" }));

app.post("/auth/register", async (req, reply) => {
  const body = z.object({name:z.string().min(2), phone:z.string().optional(), email:z.string().email().optional(), password:z.string().min(6)}).parse(req.body);
  const passwordHash = await bcrypt.hash(body.password, 12);
  const user = await db.user.create({data:{...body,passwordHash}});
  return reply.send({token: app.jwt.sign({sub:user.id,role:user.role}), user:{id:user.id,name:user.name,role:user.role}});
});

app.post("/auth/login", async (req, reply) => {
  const body = z.object({email:z.string().email().optional(), phone:z.string().optional(), password:z.string()}).parse(req.body);
  const user = await db.user.findFirst({where: body.email ? {email:body.email} : {phone:body.phone}});
  if (!user?.passwordHash || !(await bcrypt.compare(body.password,user.passwordHash))) return reply.code(401).send({error:"Invalid credentials"});
  return {token:app.jwt.sign({sub:user.id,role:user.role}),user:{id:user.id,name:user.name,role:user.role}};
});

app.get("/products", async () => db.product.findMany({where:{active:true},include:{category:true,variants:true,addons:true},orderBy:{createdAt:"desc"}}));

app.get("/products/:id", async req => db.product.findUnique({where:{id:(req.params as any).id},include:{category:true,variants:true,addons:true}}));

app.get("/orders", {preHandler:auth}, async (req:any) =>
  db.order.findMany({where:{userId:req.user.sub},include:{items:true,payment:true,delivery:true,address:true},orderBy:{createdAt:"desc"}})
);

app.get("/orders/:id", {preHandler:auth}, async (req:any, reply) => {
  const order = await db.order.findFirst({where:{id:req.params.id,userId:req.user.sub},include:{items:true,payment:true,delivery:true,address:true}});
  if(!order) return reply.code(404).send({error:"Order not found"});
  return order;
});

app.post("/orders", {preHandler:auth}, async (req:any, reply) => {
  const body = z.object({
    addressId:z.string(),
    items:z.array(z.object({productName:z.string(),variantName:z.string(),quantity:z.number().int().positive(),unitPrice:z.number().int().nonnegative(),addonTotal:z.number().int().nonnegative().default(0)})),
    deliveryCharge:z.number().int().nonnegative().default(0),
    tax:z.number().int().nonnegative().default(0),
    discount:z.number().int().nonnegative().default(0),
    paymentMethod:z.enum(["UPI","CARD","NETBANKING","COD"]),
    agreementVersion:z.string()
  }).parse(req.body);
  const subtotal=body.items.reduce((s,i)=>s+i.quantity*i.unitPrice+i.addonTotal,0);
  const total=Math.max(0,subtotal+body.deliveryCharge+body.tax-body.discount);
  const order=await db.order.create({
    data:{orderNumber:`MRLB-${Date.now().toString().slice(-8)}`,userId:req.user.sub,addressId:body.addressId,subtotal,deliveryCharge:body.deliveryCharge,tax:body.tax,discount:body.discount,total,agreementVersion:body.agreementVersion,
      items:{create:body.items},
      payment:{create:{amount:total,status:body.paymentMethod==="COD"?PaymentStatus.COD_PENDING:PaymentStatus.PENDING}},
      delivery:{create:{status:"UNASSIGNED"}}
    },include:{items:true,payment:true,delivery:true}
  });
  return reply.code(201).send(order);
});

app.patch("/orders/:id/status", {preHandler:auth}, async (req:any, reply) => {
  if(req.user.role!=="ADMIN" && req.user.role!=="DRIVER") return reply.code(403).send({error:"Forbidden"});
  const body=z.object({status:z.nativeEnum(OrderStatus)}).parse(req.body);
  return db.order.update({where:{id:req.params.id},data:{status:body.status}});
});

app.get("/admin/dashboard",{preHandler:auth},async(req:any,reply)=>{
  if(req.user.role!=="ADMIN") return reply.code(403).send({error:"Forbidden"});
  const [orders,customers,revenue]=await Promise.all([
    db.order.count(), db.user.count({where:{role:"CUSTOMER"}}),
    db.order.aggregate({where:{paymentStatus:"PAID"},_sum:{total:true}})
  ]);
  return {orders,customers,revenue:revenue._sum.total||0};
});

app.get("/policies", async()=>db.policy.findMany({where:{active:true},orderBy:{createdAt:"desc"}}));

app.setErrorHandler((err,_,reply)=>{ app.log.error(err); reply.code((err as any).statusCode||400).send({error:err.message||"Request failed"}); });

app.listen({port:Number(process.env.PORT||4000),host:"0.0.0.0"});

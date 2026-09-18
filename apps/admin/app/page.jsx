export default function Admin(){
 const cards=[["Orders","1,284"],["Pending","37"],["Active deliveries","18"],["Revenue","₹3,84,920"],["Customers","2,641"],["Cancelled","24"]];
 return <main style={{fontFamily:"Arial",background:"#f7f4ef",minHeight:"100vh",padding:30}}>
  <header style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:28}}>
   <img src="/mrlb-logo.png" style={{width:150,height:70,objectFit:"contain"}}/>
   <strong>MRLB Biryani • Admin</strong>
  </header>
  <h1>Dashboard</h1><p>Orders, revenue, delivery and product operations</p>
  <section style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:16}}>
   {cards.map(([a,b])=><div key={a} style={{background:"#fff",padding:20,borderRadius:18,boxShadow:"0 2px 10px #0001"}}><small>{a}</small><h2>{b}</h2></div>)}
  </section>
  <section style={{background:"#fff",marginTop:24,padding:22,borderRadius:18}}>
   <h2>Operations</h2>
   <div style={{display:"grid",gap:10}}>
    {["Orders & status","Products / variants / add-ons","Delivery zones & drivers","Charges / taxes / coupons","Customers & support","Payments & refunds","Policies & agreements","Reports & audit logs"].map(x=><div key={x} style={{padding:14,border:"1px solid #eee",borderRadius:12}}>{x} →</div>)}
   </div>
  </section>
 </main>
}
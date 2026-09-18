import React,{useEffect,useState} from "react";
import {View,Text,Image,TouchableOpacity,FlatList,StyleSheet,SafeAreaView,TextInput,Alert} from "react-native";
import {NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";

const API=process.env.EXPO_PUBLIC_API_URL||"http://localhost:4000";
const logo=require("./assets/mrlb-logo.png");
const demo=[
 {id:"1",name:"Chicken Biryani",description:"Aromatic basmati rice with tender chicken.",price:169,variantName:"Regular",image:"https://images.unsplash.com/photo-1563379091339-03246963d96c?auto=format&fit=crop&w=900&q=80"},
 {id:"2",name:"Mutton Biryani",description:"Slow-cooked mutton with fragrant basmati rice.",price:249,variantName:"Regular",image:"https://images.unsplash.com/photo-1701579231373-6b5b8b1b2f1f?auto=format&fit=crop&w=900&q=80"}
];

function Splash({navigation}){useEffect(()=>{const t=setTimeout(()=>navigation.replace("Home"),1000);return()=>clearTimeout(t)},[]);return <View style={s.splash}><Image source={logo} style={s.logo}/><Text style={s.tag}>BIRYANI • DELIVERED HOT</Text></View>}

function Home({navigation}){
 const [cart,setCart]=useState([]);
 return <SafeAreaView style={s.page}><View style={s.header}><Image source={logo} style={s.headerLogo}/><TouchableOpacity onPress={()=>navigation.navigate("Cart",{cart})}><Text style={s.cart}>Cart ({cart.length})</Text></TouchableOpacity></View>
 <Text style={s.hero}>Chicken & Mutton{"\n"}Biryani at your doorstep</Text>
 <FlatList data={demo} keyExtractor={x=>x.id} renderItem={({item})=><View style={s.card}><Image source={{uri:item.image}} style={s.food}/><View style={{padding:12}}><Text style={s.name}>{item.name}</Text><Text style={s.desc}>{item.description}</Text><Text style={s.price}>₹{item.price}</Text><TouchableOpacity style={s.btn} onPress={()=>setCart(c=>[...c,item])}><Text style={s.btnText}>ADD TO CART</Text></TouchableOpacity></View></View>}/>
 </SafeAreaView>
}

function Cart({route,navigation}){const cart=route.params.cart||[];const subtotal=cart.reduce((a,x)=>a+x.price,0);return <SafeAreaView style={s.page}><Text style={s.title}>Your Cart</Text>{cart.map((x,i)=><View style={s.row} key={i}><Text style={s.name}>{x.name}</Text><Text>₹{x.price}</Text></View>)}<View style={s.total}><Text>Total</Text><Text style={s.grand}>₹{subtotal}</Text></View><TouchableOpacity style={s.btnBig} onPress={()=>navigation.navigate("Checkout",{cart})}><Text style={s.btnText}>CONTINUE</Text></TouchableOpacity></SafeAreaView>}

function Checkout({route,navigation}){
 const cart=route.params.cart||[]; const total=cart.reduce((a,x)=>a+x.price,0);
 const [name,setName]=useState("");const [phone,setPhone]=useState("");const [address,setAddress]=useState("");
 const [payment,setPayment]=useState("COD");const [busy,setBusy]=useState(false);
 const place=async()=>{if(!name||!phone||!address||!cart.length)return Alert.alert("Please fill all details");
 setBusy(true);try{const r=await fetch(API+"/orders",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({customerName:name,phone,address,paymentMethod:payment,deliveryCharge:0,items:cart.map(x=>({productId:x.id,productName:x.name,variantName:x.variantName,quantity:1,unitPrice:x.price}))})});const data=await r.json();if(!r.ok)throw new Error(data.error||"Order failed");navigation.replace("Success",{order:data});}catch(e){Alert.alert("Order failed",e.message)}finally{setBusy(false)}};
 return <SafeAreaView style={s.page}><Text style={s.title}>Delivery Details</Text><TextInput placeholder="Customer name" value={name} onChangeText={setName} style={s.input}/><TextInput placeholder="Phone number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" style={s.input}/><TextInput placeholder="Full delivery address" value={address} onChangeText={setAddress} multiline style={[s.input,{height:90}]}/><Text style={s.label}>Payment</Text><View style={s.payRow}><TouchableOpacity style={[s.option,payment==="COD"&&s.selected]} onPress={()=>setPayment("COD")}><Text>Cash on Delivery</Text></TouchableOpacity><TouchableOpacity style={[s.option,payment==="UPI"&&s.selected]} onPress={()=>setPayment("UPI")}><Text>UPI</Text></TouchableOpacity></View><Text style={s.grand}>Payable: ₹{total}</Text><TouchableOpacity disabled={busy} style={s.btnBig} onPress={place}><Text style={s.btnText}>{busy?"PLACING...":"PLACE ORDER"}</Text></TouchableOpacity></SafeAreaView>
}

function Success({route,navigation}){const o=route.params.order;return <View style={s.splash}><Text style={s.check}>✓</Text><Text style={s.title}>Order Confirmed!</Text><Text>Order {o.orderNumber}</Text><Text style={s.muted}>Your order has been sent to the admin panel.</Text><TouchableOpacity style={s.btnBig} onPress={()=>navigation.replace("Home")}><Text style={s.btnText}>ORDER AGAIN</Text></TouchableOpacity></View>}

const Stack=createNativeStackNavigator();
export default function App(){return <NavigationContainer><Stack.Navigator screenOptions={{headerShown:false}}><Stack.Screen name="Splash" component={Splash}/><Stack.Screen name="Home" component={Home}/><Stack.Screen name="Cart" component={Cart}/><Stack.Screen name="Checkout" component={Checkout}/><Stack.Screen name="Success" component={Success}/></Stack.Navigator></NavigationContainer>}
const s=StyleSheet.create({page:{flex:1,backgroundColor:"#fff8ef",padding:18},splash:{flex:1,backgroundColor:"#fff",alignItems:"center",justifyContent:"center",padding:20},logo:{width:220,height:220,resizeMode:"contain"},tag:{fontWeight:"800"},header:{flexDirection:"row",justifyContent:"space-between",alignItems:"center"},headerLogo:{width:100,height:55,resizeMode:"contain"},cart:{fontWeight:"800"},hero:{fontSize:28,fontWeight:"900",marginVertical:22},card:{backgroundColor:"#fff",borderRadius:18,overflow:"hidden",marginBottom:18},food:{width:"100%",height:190},name:{fontSize:18,fontWeight:"900"},desc:{color:"#756b61",marginVertical:6},price:{fontSize:19,fontWeight:"900",marginVertical:5},btn:{backgroundColor:"#c98516",padding:12,borderRadius:12,alignItems:"center"},btnBig:{backgroundColor:"#c98516",padding:16,borderRadius:14,alignItems:"center",marginTop:18},btnText:{color:"#fff",fontWeight:"900"},title:{fontSize:28,fontWeight:"900",marginBottom:18},row:{flexDirection:"row",justifyContent:"space-between",paddingVertical:14,borderBottomWidth:1,borderBottomColor:"#eadfd4"},total:{flexDirection:"row",justifyContent:"space-between",paddingVertical:15},grand:{fontSize:20,fontWeight:"900",marginVertical:10},input:{backgroundColor:"#fff",borderRadius:12,padding:14,borderWidth:1,borderColor:"#ead8c2",marginBottom:10},label:{fontWeight:"900",marginVertical:8},payRow:{gap:8},option:{backgroundColor:"#fff",padding:15,borderRadius:12,marginVertical:4},selected:{borderWidth:2,borderColor:"#c98516"},muted:{color:"#756b61",marginTop:8},check:{fontSize:80,fontWeight:"900"}});

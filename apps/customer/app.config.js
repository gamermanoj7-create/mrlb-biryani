export default ({config}) => ({
  ...config,
  name:"MRLB Biryani",
  slug:"mrlb-biryani",
  version:"1.0.0",
  orientation:"portrait",
  icon:"./assets/mrlb-logo.png",
  splash:{image:"./assets/mrlb-logo.png",resizeMode:"contain",backgroundColor:"#ffffff"},
  android:{package:"com.mrlb.biryani",permissions:["ACCESS_FINE_LOCATION","ACCESS_COARSE_LOCATION","POST_NOTIFICATIONS"]},
  ios:{bundleIdentifier:"com.mrlb.biryani",infoPlist:{
    NSLocationWhenInUseUsageDescription:"Location is used to select and deliver to your address and to show delivery tracking when available."
  }},
  extra:{apiUrl:process.env.EXPO_PUBLIC_API_URL||"http://localhost:4000"}
});
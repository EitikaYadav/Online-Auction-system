const mongoose= require("mongoose");

const electronicSchema=mongoose.Schema({
   
Brand:{
    type:String,
    required:true
},

Title:{
    type:String,
    required:true
},

Description:{
    type:String,
    required:true
},
Price:{
    type:String,
    required:true
},
image:{
  type:String,
  default:''
}

})




const AuctionItems=mongoose.model("AuctionItems",electronicSchema)
module.exports=AuctionItems;
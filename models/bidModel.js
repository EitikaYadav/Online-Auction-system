const mongoose=require('mongoose');

const bidSchema=mongoose.Schema({
   ammount:{
        type:String,
        
    },
    userid:{
        type:String
        
    },
    productid:{
        type:String
    },
    productname:{
        type:String
    }

   
    
    
})
module.exports=mongoose.model('bid',bidSchema);  
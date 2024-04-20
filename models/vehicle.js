const mongoose= require("mongoose");


const vehicalSchema=mongoose.Schema({
    Model:{
        type:String,
        required:true
    },

    YOM:{
    type:Number,
    required:true

    },

KilometersDriven:{
    type:Number,
    required:true
},

Location:{
    type:String,
    required:true
},

Ownership:{
    type:Number,
    required:true
},

Color:{
    type:String,
    required:true
},

FuelType:{
    type:String,
    required:true
}
});

module.exports=mongoose.model('vehical',vehicalSchema);

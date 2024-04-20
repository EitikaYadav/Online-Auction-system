const mongoose=require('mongoose');

const userSchema=mongoose.Schema({
   name:{
        type:String,
        required:true
    },

    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    is_admin:{
        type:String,
        default:1
    },
    token:{
        type:String,
        default:""
    } 
    
})
module.exports=mongoose.model('admin',userSchema);  
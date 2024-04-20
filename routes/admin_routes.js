const express = require("express");
const mongoose = require("mongoose");
const adminroutes = express();
const bodyparser = require("body-parser");
const bcrypt=require('bcrypt');
const multer=require('multer');
const path=require('path')
const adminloginAuth=require('../middleware/adminlogin');
const session=require('express-session');
const config=require('../config/userconfig');
adminroutes.use(session({secret:config.sessionsecret,
  resave:true,
  saveUninitialized:true
  }));

  const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname,'../public/images'))
    },
    filename:function(req,file,cb){
        const name=Date.now()+"-"+file.originalname;
        cb(null,name)
    }
})
const upload=multer({storage:storage})

adminroutes.use(bodyparser.json());
adminroutes.use(bodyparser.urlencoded({ extended: true }));

adminroutes.set("view engine", "ejs");
adminroutes.set("views", "./views");
adminroutes.use(express.static('public'))

const Admin = require("../models/adminModel");

adminroutes.get("/adminregister", async (req, res) => {
  res.render("admin/signup");
});
adminroutes.get("/login",adminloginAuth.islogout, async (req, res) => {
  res.render("admin/login");
});
const securepassword=async(password)=>{
  const passhash=await bcrypt.hash(password,10);
  return passhash;
}


adminroutes.post("/adminregister", adminloginAuth.islogout,async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password
  const phone = req.body.mobile;
  const spassword= await securepassword(password);
  const userr = new Admin({
    name: name,
    email: email,
    password:spassword,
    phone:phone,
    is_admin: 1,
  });

  const userdata = await userr.save();
  if (userdata) {
    res.render("admin/signup", {
      message: "your account is created login to enter",
    });
  } else {
    res.render("admin/signup", { message: "try again!" });
  }
});

adminroutes.get('/dashboard',adminloginAuth.islogin,(req,res)=>{
    res.render('admin/dashboard');
})
 
adminroutes.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const userdata = await Admin.findOne({ email: email });
  const passmatch=bcrypt.compare(password,userdata.password);
  if (passmatch) {
    req.session.user_id=userdata._id;
    req.session.user_isadmin=userdata.is_admin;
    if (userdata.is_admin == 1) { 
    res.redirect('/dashboard');
   
  }  }
   else {
    res.render("admin/login", {
      message: "email id or password is incorrect!",
    });
  }
});
const vehical=require('../models/vehicle');
adminroutes.get('/vehical',(req,res)=>{
  res.send('vehical form');
})

adminroutes.post('/vehical',async(req,res)=>{
   const {Model,YOM,KilometersDriven,Location,Ownership,Color,FuelType}=req.body;
   
   if( !Model || !YOM || !KilometersDriven || !Location || !Color || !FuelType || !Ownership){
    res.json({error:"please fill the required parameter"});
   }
   const user= await vehical.create({
    Model,
    YOM,
    KilometersDriven,
    Location,
    Ownership,
    Color,
    FuelType
})


if(user){
    res.json({
      Model:user.Model,
      YOM:user.YOM,
      KilometersDriven:user.KilometersDriven,
      Location:user.Location,
      Ownership:user.Ownership,
      Color:user.Color,
      FuelType:user.FuelType

    })
}

});

const electronic=require('../models/AddItemsModel');

adminroutes.post('/upload-post-image',upload.single('image'),async(req,res)=>{
  var imagepath='/images'
   imagepath=imagepath+'/'+req.file.filename;
   res.send({success:true,msg:'post image uploaded',path:imagepath})
  })

adminroutes.post("/AddItems",async(req,res)=>{
  const{Brand,Title,Description,Price}=req.body;
   
  var image='';
   if(req.body.image !== undefined){
       image=req.body.image;
   }
  if(!Brand || !Title || !Description){
     res.json({error:"please fill all the field"});
  }

   const elect= await electronic.create({
    Brand,
    Title,
    Description,
    Price,
    image:image
   }) 
   if(elect){
    res.render('admin/AddItems',{message:"successfully Added!"});
   }
})
  
adminroutes.get('/AddItems',adminloginAuth.islogin,(req,res)=>{
  res.render('admin/AddItems')
}) 
adminroutes.get('/vehicle',adminloginAuth.islogin,(req,res)=>{
  res.render('admin/vehicle');
}) 
 
adminroutes.get('/logout',adminloginAuth.islogin,(req,res)=>{
  req.session.destroy();
  res.redirect('/login')
  })
  

 
module.exports = adminroutes;
 
  
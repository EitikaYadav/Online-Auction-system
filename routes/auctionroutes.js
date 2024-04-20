const express=require('express');
const auction=express()
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const bcrypt=require('bcrypt');
auction.use(bodyparser.json());
auction.use(bodyparser.urlencoded({ extended: true }));
auction.set("view engine", "ejs");
auction.set("views", "./views");
auction.use(express.static('public'))
const items=require('../models/AddItemsModel');

const userloginAuth=require('../middleware/userlogin');
const session=require('express-session');
const config=require('../config/user2config');
auction.use(session({secret:config.sessionsecret,
  resave:true,
  saveUninitialized:true
  }));
  const User=require('../models/userModel'); 

var session_id='';


auction.get('/',async(req,res)=>{
     const data= await items.find({Brand:"Apple"});
    res.render('client/index',{data:data});
})
auction.get('/account2',userloginAuth.islogin,async(req,res)=>{
    const id=req.session.user_id
    session_id=id;
    const data=await User.findOne({"_id":id});
res.render('client/account2',{data:data});
})

auction.get('/products',async(req,res)=>{
    const data=await items.find({});
    res.render('client/products',{data:data});
})
var postdata='';

auction.get('/post/:id',async(req,res)=>{
    try {
        const id=req.params.id;
       
        const data= await items.findOne({"_id":id})
         postdata=data;
        
         res.render('client/post',{data:data})
    } catch (error) {
        console.log(error.message);
    }
})


auction.get('/account',userloginAuth.islogout,(req,res)=>{
    res.render('client/account')
  })

  auction.post('/user-registration',userloginAuth.islogout,async(req,res)=>{
    try {
        const{name,email,password}=req.body;
        if(!name|| !email || !password){
            res.json({error:"please fill all the field"});
        }
        
           const user= await User.create({
           name,
           email,
           password,
          })
           if(user){
           res.render('client/account'); 
          } 
        
         

         


    } catch (error) {
        console.log(error.message)
    }
}) 

auction.post("/user-login",userloginAuth.islogout,async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const userdata = await User.findOne({ email: email });
    const passmatch=bcrypt.compare(password,userdata.password);
    if (passmatch) {
      req.session.user_id=userdata._id;
      req.session.user_isadmin=userdata.is_admin;
      if (userdata.is_admin == 1) { 
      res.redirect('/account2');
     
    }  }
     else {
     res.render()
    } 
  });

auction.get('/logout-user',userloginAuth.islogin,(req,res)=>{
    req.session.destroy();
    res.redirect('/account')
    })

   auction.get('/cart/:id',userloginAuth.islogin,async(req,res)=>{
    try {
        const id=req.params.id;
        const data= await items.findOne({"_id":id})
        res.render('client/cart',{data:data});

    } catch (error) {
        console.log(error.message) 
    }
})

const bid=require('../models/bidModel');

auction.post('/bid',userloginAuth.islogin,async(req,res)=>{
   const value= req.body.value;
   const productid=req.body.Productid;
   const productname=req.body.name;

const bidvalue= await bid.create({ 
   ammount:value,
   userid:session_id,
   productid:productid,
   productname:productname
   })
   const data= await items.findOne({"_id":productid});
   if(bidvalue){
    res.render('client/cartAfterBid',{message:"Bid Placed!",data:data,bids:bidvalue.ammount});
   }
  })
  
  auction.get('/userinsights',userloginAuth.islogin,async(req,res)=>{
   const data=await bid.find({userid:session_id});
   if(data){
     res.render('client/userinsights',{data:data});
   }
  
  }) 
module.exports = auction; 
   
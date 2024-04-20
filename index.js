const express=require('express');

const mongoose=require('mongoose');
mongoose.connect("mongodb://localhost:27017/Auction");

const app=express();
const port= process.env.PORT || 80;

app.use(express.json());

const adminroutes=require('./routes/admin_routes');
app.use('/',adminroutes);


const auctionroutes=require('./routes/auctionroutes');
app.use('/',auctionroutes);



app.listen(port,()=>{
    console.log(`server is running on port ${port} `);
})

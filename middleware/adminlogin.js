const islogin=async(req,res,next)=>{
    try {
        if (req.session.user_id && req.session.user_isadmin==1) {
           
        } else {
            res.redirect('/login')
        }
        next();
    }
     catch (error) {
        console.log(error.message)
    }
    }
    
    const islogout=async(req,res,next)=>{
        try {
            if (req.session.user_id && req.session.user_isadmin==1) {
                res.redirect('/dashboard')
            } 
            next();
        } 
         catch (error) {
            console.log(error.message) 
        } 
        }
    
        module.exports={islogin,islogout}
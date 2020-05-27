let express= require("express")
const router = express.Router();
const User= require("../models/user")
const auth = require('../middlewares/auth')
const cookieParser= require('cookie-parser')
router.use(cookieParser())
const products = require("../models/product")
const Emails = require("../middlewares/email")
const jwt = require("jsonwebtoken")
var flash = require('express-flash')
var session = require('express-session')
  router.use(session({
       secret:'Hello',
       resave:false,
       saveUninitialized:true
   }))
 router.use(flash())

router.get("/signup",(req,res)=>
{
  res.render("signup");
})
router.get("/login",(req,res)=>
{
  req.flash('info', 'Flash Message Added');
  res.render("login");
})
router.get("/products", (req,res)=>
{
  res.render("product")
})
router.get("/profile", auth , async (req,res)=>
{

//   await req.user.populate({
//     path:"tasks",
//     options:
//     {
//         limit:parseInt(req.query.limit),
//         skip:parseInt(req.query.skip),
//     }
// }).execPopulate()

//         console.log(req.user.tasks)
let prod=undefined;
if(req.user.type ==='Customer')
{
  const product= products.find({owner : req.user._id ,confirmed:true},(err,resu)=>
  {
    
    
      const data = {
        name  : req.user.name ,
        age :req.user.age  ,
        phone : req.user.phone ,
        email : req.user.email,
        cid : req.user.cid, 
        products:resu
      }
       res.render('profile',data)
  })
  
}
else 
{
  const cust= products.find({agent_id : req.user.cid} , (err , ress)=>
  {
    const data = {
      name  : req.user.name ,
      age :req.user.age  ,
      phone : req.user.phone ,
      email : req.user.email,
      cid : req.user.cid, 
      customers:ress
    }
     res.render('agents_pro',data)
  })

}


})

router.get("/confirm-user/:id", auth , async (req, res)=>
{
   const id= req.params.id;
   console.log(id)
  const user= products.findOne({_id:id} , (err , ress)=>
  {
    ress.confirmed= true
    ress.save()
  })

   res.redirect("/profile");
})

router.get("/apply",auth, async (req,res)=>
{
  res.render("apply")
})

router.post("/apply",auth,  async (req,res)=>
{

    
  let tp= Math.floor(100000 + Math.random() * 900000);
  let id="";
       id= 'PD' + tp;
    req.body.product_id= id;
  const Product=await new products(
    {
        ...req.body,
        owner:req.user._id
    }
);
  console.log(req.body)
const today = new Date();
const dt = today.getDate()+'/'+(today.getMonth()+1)+'/'+today.getFullYear();
    Product.date=dt;
   Product.save()
 
    res.redirect("/profile")
})


router.get("/logout", async  (req,res)=>{
  res.cookie('auth-key',undefined)
  res.redirect('/')
})

router.get("/confirm/:id", async (req,res)=>
{
    try{
      const token= req.params.id
    const data=jwt.verify(token,process.env.SECRET)
    const user=await User.findOne({_id:data._id, "tokens.token":token})
     if(user)
     {
       user.confirmed= true;
       user.save()
       res.redirect("/login")
     }
     else 
     {
       res.send({"error " : "Invalid Requests "})
     }

    }
    catch(e)
    {
    res.send({"ERROR":"Error Occured in Loading"})
    }
})

router.get("/delete-product/:id",auth , async (req,res)=>
{
        if(req.user.type != "Agent")
          res.redirect("/profile")
   const id= req.params.id;
   const cust= await products.findOneAndRemove({_id:id})
   res.redirect("/profile")
})

router.get("/edit-plan/:id" , auth , async(req, res)=>
{
  if(req.user.type != "Agent")
    res.redirect("/profile")
    const id= req.params.id;
    
})

router.post("/login",async (req,res)=>
{

  try{
    console.log(req.body)
  const user=await User.findByCredentials(req.body.email,req.body.password);
    if(user.confirmed===false)
      {
      
        req.flash('error','Please Verify your Email')
         res.redirect("/login")
      }
      else if(user) {
        const token=await user.generateToken();
        res.cookie('auth-key',token)
         res.redirect('/profile')
      }
  }
  catch(e)
  {
    console.log(e)
     req.flash('error',(""+e).replace('Error:',''))
     res.redirect("/login")
  }
})

router.post("/signup",async (req,res)=>
{
   try{
    
    let tp= Math.floor(100000 + Math.random() * 900000);
   let id="";
    if(req.body.type==='Agent')
      id= 'AG' + tp;
    else 
     id= 'CU' + tp;
     req.body.cid= id;
    const user= new User(req.body)
    const token=await user.generateToken();
    const url =  process.env.URL +  token 
    Emails.sendEmail(user.email, url )
       res.cookie('auth-key',token)  
       res.render("welcome")
   }
   catch(e)
   {
     console.log(e)
    req.flash('error',"User Already Have a Account")
    res.redirect("/signup")
   }
})

router.get("/logout",async (req,res)=>
{
  res.cookie('auth-key','')
    rews.redirect('/')
})

router.get("/agents",async (req, res)=>
{
     const ag= "Agent";
     const agents= User.find({type :ag} , (err, ress)=>{

       res.render("agents",{agents:ress})
     });

    
})
router.get('/edit', async (req, res)=>
{
  res.render("edit");
})
module.exports= router
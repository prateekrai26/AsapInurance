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
  const product= products.find({owner : req.user._id},(err,resu)=>
  {
    const data = {
      name  : req.user.name ,
      age :req.user.age  ,
      phone : req.user.phone ,
      email : req.user.email,
      products:resu
    }

    res.render('profile',data)

  })
  
    
})

router.get("/apply", async (req,res)=>
{
  res.render("apply")
})

router.post("/apply",auth,  async (req,res)=>
{

  const Product=await new products(
    {
        ...req.body,
        owner:req.user._id
    }
);
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

module.exports= router
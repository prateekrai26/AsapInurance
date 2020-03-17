const mongoose= require("mongoose")

const jwt = require("jsonwebtoken")

const bcrypt=require('bcrypt')

const userSchema = new mongoose.Schema({
      name:{
          type:String,
          required:true,
          trim:true
      },
      email:
      {
       type:String,
        required:true,
       unique:true,
       trim:true,
       lowercase:true
      },
      password:
      {
        type:String,
        required:true,
        trim:true,
        minlengtth: 7
      },
      tokens:[
         {
             token:{
                 type:String ,
                 required:true
             }
         }
      ],
      phone :
      {
        type:Number,
        required:true,
        trim:true
      },
      confirmed:
      {
        type:Boolean,
        default:false
      }
},
{
    timestamps:true
})
userSchema.statics.findByCredentials=async (email,password)=>
{  
  
    const user=await User.findOne({email})
    if(!user)
    {
      
        throw new Error("Unable to find User");
    }

    const isMatch=await bcrypt.compare(password,user.password);

    if(!isMatch)
    {
        throw new Error("Wrong Password")
    }
    return user
}


userSchema.methods.generateToken=async function()
{
  const user=this
    const token=jwt.sign({_id: user._id.toString()},process.env.SECRET)
   user.tokens=user.tokens.concat({token})
    await user.save()
    return token
}


userSchema.pre('save',async function(next){
  const user=this;

  if(user.isModified("password"))
  {
      user.password= await bcrypt.hash(user.password,8)
  }
  next();
})
const User= mongoose.model("User",userSchema);
module.exports= User;
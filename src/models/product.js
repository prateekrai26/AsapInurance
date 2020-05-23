const mongoose  = require ('mongoose')
const productSchema = new mongoose.Schema(
    {
         name:{
            type:String,
            required:true,
            trim:true
        },
        bday:
        {
            type:Date,
            required:true,
            trim:true,
  
        },
        sex:
        {
            type:String,
            required:true,
            trim:true,
  
        },
        address:
        {
            type:String,
            required:true,
            trim:true,
  
        },
        email:
        {
            type:String,
            required:true,
            trim:true,
  
        },
        phone:
        {
            type:Number,
            required:true,
            trim:true,
  
        },
        adhar:
        {
            type:Number,
            required:true,
            trim:true,
  
        },
        insurance_type :
        {
           
        },
        date:
        {
           
        },
        owner:
        {
            type:mongoose.Schema.Types.ObjectId,
            required:true,
            ref:"User"
        },
        plan:
        {
             type:Number,
            required:true,
            trim:true
        } ,
        premium:
        {
            type:Number,
            required:true,
            trim:true
        }
    },
    {
        timestamps:true
    }
)

const  product = mongoose.model("Product", productSchema)


module.exports= product
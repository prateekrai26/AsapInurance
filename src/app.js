const express= require("express");
const app= express();
const path = require('path')
require("./db/mongoose")
const User= require("./models/user");
const hbs= require("hbs")
const userRoute= require("./routes/user");
const bodyParser= require("body-parser")
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json());
app.use(userRoute);
app.set("view engine" , ".hbs")
const publicDirectoryPath = path.join(__dirname,'../')
const nodemailer= require('nodemailer')
const port=process.env.PORT || 3000
var session = require('express-session')
var flash = require('express-flash')
const cookieParser= require("cookie-parser")
app.use(cookieParser())
const multer= require("multer")
const upload= multer({dest:'/uploads'})
app.use(express.static(publicDirectoryPath))
app.use(session({
    secret : 'sfdgvgfsdugvyu fdsgvdfhbvjk',
    resave :false ,
    saveUninitialized :true
}))
app.use(flash());

app.get("/",(req,res)=>
{
   
    res.render("index")

})

app.get("/user",(req,res)=>
{
    res.render("index")
})



app.listen(port,()=>
{
    console.log("started at ", 3000 );
})


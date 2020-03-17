

// const sgMail=require("@sendgrid/mail")
// sgMail.setApiKey("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")

// const sendWelcomeEmail= (email,url)=>
// {
//     console.log(email , url)
//     sgMail.send({
//         to: email,
//         from: 'cprateekrai@gmail.com',
//         subject: 'WelCome',
//         text: "Please Click on the below link to verify your account ",
//        html:'Please Click here to confirm your email ' + url ,
//       })
// }

// // const sendExitEmail= (email,name)=>
// // {
// //     sgMail.send({
// //         to: email,
// //         from: 'cprateekrai@gmail.com',
// //         subject: 'Exit',
// //         text: "Thanks "+name+" for Using our App"
// //        // html: '<strong>and easy to do anywhere, even with Node.js</strong>',
// //       })
// // }



const email='asapinsurance527@gmail.com'
const pass= 'qwerty12345@'
var nodemailer = require('nodemailer');

const sendEmail= (user, url)=>
{

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: email,
          pass:  pass
        }
      });
      
      var mailOptions = {
        from: email,
        to: user,
        subject: 'Email Confirmation',
        text: 'Confirm Your Email Address',
        html:'Please Click here to confirm your email ' + url
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } 
      });
      


}

const Emails={
    sendEmail,
}


module.exports=Emails
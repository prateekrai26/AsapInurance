
var nodemailer = require('nodemailer');

const sendEmail= (user, url)=>
{

    var transporter = nodemailer.createTransport({
        service: 'outlook',
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD
        }
      });
    
      var mailOptions = {
        from: process.env.username,
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
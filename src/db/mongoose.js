let mongoose = require("mongoose");

mongoose.connect('mongodb+srv://asapinsurance:qwerty123@cluster0-vlfvz.mongodb.net/test', {
    useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex:true,
  useFindAndModify:false
})

module.exports =mongoose;
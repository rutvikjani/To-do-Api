const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/To-DoList",{ useNewUrlParser: true,  useUnifiedTopology: true, })
.then(() => console.log( 'Your Database is Connected' ))
.catch(err => console.log("Your Database is not Connected" ,err));

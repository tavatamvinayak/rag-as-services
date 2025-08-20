const mongoose = require('mongoose');

const Users = new mongoose.Schema({
    userFirstName:{
        type:String,
        required : true,
    },
    userLastName:{
        type:String,
        required : true,
    },
    email:{
        type:String,
        required : true,
    },
    clerk_userId : {
        type:String,
        required : true,
    },
   
});

module.exports = mongoose.model('users' ,Users);
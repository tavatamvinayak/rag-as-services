const mongoose = require('mongoose')

const Modelkeys = mongoose.Schema({
    OpenAI_key:{
        type:String,  
    },
    Gemini_key:{
        type:String,
        
    },
    Antripic_key:{
        type:String,
        
    },
    Grok_key:{
        type:String,
        
    },
    email:{
         type:String,
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:true
    },
    clerk_userId : {
        type:String,
        required : true,
    },
})

module.exports = mongoose.model('modelkeys' , Modelkeys);
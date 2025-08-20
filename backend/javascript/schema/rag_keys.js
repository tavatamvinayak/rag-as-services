const mongoose = require('mongoose')

const Rag_keys = mongoose.Schema({
    LLM_model_name:{
        type:String,
        default:"OpenAI",
    },
    Name_rag_application:{
        type:String,  
    },
    File_upload_id:{
        type:String,
    },
    email:{
         type:String,
    },
    clerk_userId : {
        type:String,
        required : true,
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:true
    },
})

module.exports = mongoose.model('rag_keys' , Rag_keys);
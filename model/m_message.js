const mongoose = require("mongoose")

const Schema = new mongoose.Schema({
    conversationId : String ,
    sender :  {type:mongoose.Schema.Types.ObjectId , ref:"user"} ,
    text:String
},{timestamps:true})


module.exports = mongoose.model("message" , Schema)
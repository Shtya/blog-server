const mongoose = require("mongoose")

const Schema = new mongoose.Schema({
    email: { type: String, required: [true, 'Please set your email'], unique: [true, 'Email already in use']},
    password : {type : String , require:true },
    profilePicture : String ,
    name:String

},{timestamps:true})

module.exports = mongoose.model("user" , Schema)
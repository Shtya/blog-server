const mongoose = require("mongoose")

const Schema = new mongoose.Schema({
    user  : { type:mongoose.Schema.ObjectId , ref:"user" , required:true},
    desc  :String ,
    image : String ,
    content:String,
    title:String

},{timestamps:true})


Schema.pre(/^find/, function (next) {
    this.populate("user" , "email firstname lastname  profilePicture" )
    next()
  } )

  Schema.post("save", (e) => {
    if (e.image) {e.image = `${process.env.BASE_URL}/posts/${e.image}`}})
    
    
    Schema.post("init", (e) => {
    if (e.image) {e.image = `${process.env.BASE_URL}/posts/${e.image}`}})
    

module.exports = mongoose.model("post" , Schema)
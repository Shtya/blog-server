const m_user = require("../model/m_auth")
const ASync = require("express-async-handler")
const bcrypt = require("bcryptjs")
const Jwt = require("jsonwebtoken")

const sharp            = require("sharp")
const multer           = require("multer")
const { v4: uuidv4 }   = require("uuid")


const memory = multer.memoryStorage({})
const filter = (req, file, next) => file.mimetype.startsWith("image")? next(null , true): next(new Error("Allow Upload Image") , false)

const Upload = multer({ storage: memory, fileFilter: filter })

exports.IMG = Upload.single("profilePicture")

exports.Resize = ASync(async (req, res, next) => {
  const filename =`profile${uuidv4()}.jpeg`
  if (req.file) {
    await sharp(req.file.buffer)
      .toFormat("jpeg").jpeg({ quality: 100 })
      .toFile(`uploads/posts/${filename}`)
  }
  req.body.profilePicture = filename
  next()
})


const {JWT_EXPIRE_KEY , JWT_SECRET_KEY} = process.env

exports. Register = ASync(async(req , res)=>{
       req.body.password = await bcrypt.hash(req.body.password , 12)
        const data = await m_user.create(req.body)
        res.status(201).json(data)
})

exports. Login = ASync(async(req , res , next)=>{
        const data = await m_user.findOne({email : req.body.email})
    if(!data) return next(new Error ("User does not exist"))

    const Incorrect = await bcrypt.compare(req.body.password , data.password)
    if(!Incorrect) return next(new Error("Password Incorrect"))

    res.status(201).json(data)
    
})



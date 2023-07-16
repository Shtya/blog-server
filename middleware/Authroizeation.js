const ASync = require("express-async-handler")
const m_user = require("../model/m_auth")
const JWT = require("jsonwebtoken")
const {JWT_EXPIRE_KEY , JWT_SECRET_KEY} = process.env


exports.protect = ASync(async (req, res, next) => {
    let token = ""
    req.headers.authorization ? token = req.headers.authorization.split(" ")[1]:null
  if (!token) return next(new Error("You are not Login , please Login to get access this route"))
  

  const Decoded = JWT.verify(token, JWT_SECRET_KEY)


  const user = await m_user.findById(Decoded.userId )
  if (!user) return next(new Error("The user that belong to this token does no longer exist"))

  req.user = user
  next()

})
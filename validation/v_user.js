const { check, validationResult } = require("express-validator")
const m_user = require("../model/m_auth")
const bcrypt = require("bcryptjs")

const v_layer = (req, res, next) => {
  const err = validationResult(req)
  if (!err.isEmpty()) {
    return res.status(400).json({Error : err.array()})
  }
  next()
}

exports. V_Create = [
    check("name").notEmpty().withMessage(" Name Is Required"),
    check("email")
    .isEmail().withMessage("E-mail Invalid")
    .notEmpty().withMessage("E-mail Is Required")
    .custom(async val => {
      const data = await m_user.findOne({ email: val })
      if (data) return Promise.reject(new Error("This E-mail is Already used"))
    }),
  
    check("password")
    .notEmpty().withMessage("password is required")
    .custom(async(val, { req }) => {
      req.body.password = await bcrypt.hash(val , 12)
      if(val !== req.body.passwordConfirm) return Promise.reject(new Error ("password not Confirm"))
    }
    ),
  v_layer
]

exports.V_login = [
  check('email')
    .notEmpty()
    .withMessage('E-mail Is Required')
    .isEmail()
    .withMessage('Invalid E-mail Formate'),

  check('password').notEmpty().withMessage('Password Is required'),

  v_layer,
];
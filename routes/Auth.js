const express = require("express")
const { IMG , Resize , Register, Login } = require("../controllers/c_auth")
const { V_Create, V_login } = require("../validation/v_user")
const router = express.Router()


router.post("/register",IMG , Resize , Register)
router.post("/login" ,V_login , Login)

module.exports = router
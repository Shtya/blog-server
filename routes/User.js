const express = require("express")
const {  GET_ID, PUT, DELETE, GET} = require("../controllers/c_user")
const router = express.Router()
const {protect} =require("../middleware/Authroizeation")

router.get("/"             , GET)
router.get("/:id"          , GET_ID)
router.put("/:id"          , PUT)
router.delete("/:id"       , DELETE)




module.exports = router
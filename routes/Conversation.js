const express = require("express")
const router = express.Router()
const {createConver , GetConver , addMessage , getMessage , GetUsersInConvesation } = require("../controllers/c_conversation")

router.post("/" , createConver)
router.get("/:userId" , GetConver)

router.post("/message" , addMessage)
router.get("/message/:conversationId" , getMessage)
router.get("/user/:userId" , GetUsersInConvesation)




module.exports = router
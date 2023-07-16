const express = require("express")
const { Post, GetID, Delete, IMG, Resize, Get  } = require("../controllers/c_post")
const router = express.Router()


router.post("/" ,IMG ,Resize , Post )
router.get("/" , Get )
router.get("/:id" , GetID )
router.delete("/:id" , Delete )


module.exports = router
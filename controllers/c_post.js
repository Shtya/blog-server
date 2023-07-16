const m_post           = require("../model/m_post")
const m_user           = require("../model/m_auth")
const ASync            = require("express-async-handler")
const sharp            = require("sharp")
const multer           = require("multer")
const { v4: uuidv4 }   = require("uuid")


const memory = multer.memoryStorage({})
const filter = (req, file, next) => file.mimetype.startsWith("image")? next(null , true): next(new Error("Allow Upload Image") , false)

const Upload = multer({ storage: memory, fileFilter: filter })
exports.IMG = Upload.single("image")

exports.Resize = ASync(async (req, res, next) => {
  const filename =`post1${uuidv4()}.jpeg`
  if (req.file) {
    await sharp(req.file.buffer)
      .toFormat("jpeg").jpeg({ quality: 100 })
      .toFile(`uploads/posts/${filename}`)
  }
  req.body.image = filename
  next()
})


exports. Post = ASync(async(req , res)=>{
    const data = await (await m_post.create(req.body)).populate("user")
    res.status(201).json(data)
})

exports. Get = ASync(async(req , res)=>{
    let obj = {}
    const {search} = req.query
    if(search){ obj = {user : search}}

    const data = await m_post.find(obj)
    res.status(200).json({result : data.length ,data})
})

exports. GetID = ASync(async(req , res)=>{
    const data = await m_post.findById(req.params.id)
    if(!data) return res.status(400).json("This Id No Exist")
    res.status(200).json(data)
})

exports. Update = ASync(async(req , res)=>{
    const data = await m_post.findByIdAndUpdate(req.params.id , req.body , {new : true})
    if(!data) return res.status(400).json("This Id No Exist")
    res.status(200).json(data)

})


exports. Delete = ASync(async(req , res)=>{
    const data = await m_post.findByIdAndDelete(req.params.id )
    if(!data) return res.status(400).json("This Id No Exist")
    res.status(200).json(data)

})

exports. AddComment = ASync(async(req , res)=>{
    const post = await m_post.findById(req.params.id).populate("comments.user")
    if(!post) return res.status(400).json("This Id No Exist")

    post.comments.push({user : req.body.user , comment : req.body.comment})
     await post.save()

    res.status(200).json(post)

})


exports. like = ASync(async(req , res)=>{
    const {user} = req.body
    const post = await m_post.findById(req.params.id)

    post.comments.map(e => e.populate("user"))
    if(!post) return res.status(404).json("This Id No Exist")

    !post.likes.includes(user) 
    ?  post.likes.push(user)
    :  post.likes.pop(user)



    await post.save()
    
    res.status(201).json(post)
})


exports. GetPostBasedOnUserFollowing = ASync(async(req , res,next)=>{
   const userId = req.params.id

   try{
       let objFollowing;
       await m_user.findById(userId).then(res => objFollowing = res.following) 
        console.log(objFollowing);
        const currentUserPostsFollowing = 
        await m_post.find({user: {$in : [userId , ...objFollowing ]}})
        .sort("-createdAt").populate('comments.user' , "firstname lastname profilePicture ")

    res.status(200).json({results : currentUserPostsFollowing.length , data :currentUserPostsFollowing })
}
catch(err){res.status(500).json(err)}
})


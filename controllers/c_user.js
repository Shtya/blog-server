const m_user = require("../model/m_auth")
const ASync = require("express-async-handler")
const bcrypt = require("bcryptjs")
const multer = require("multer")
const Jwt = require("jsonwebtoken")

const storage =multer.diskStorage({
    destination:function (req , file , cb) { return  cb(null , "uploads/users")},
    filename:function (req , file , cb) { return  cb(null , file.originalname)},
})
exports. upload = multer({storage})


exports.Seggestion = ASync(async(req , res , next)=>{
    const users = await m_user.find()
    const data = await m_user.findById(req.params.id)
    if(!data) return next(res.status(404).json({Error : "No such user exist"}))
    console.log(users);
    const SuggestionFrineds = users.filter(e => !data.following.includes(e?._id) && e?._id.toString() !== data?._id.toString())
    res.status(201).json({reasults : SuggestionFrineds.length , data : SuggestionFrineds})
})


exports. GET = ASync(async(req , res ,next)=>{
    let Query = m_user.find().populate("following" , "firstname lastname profilePicture")
    if(req.query.user){
        const filt = req.query.user.split(",")
         Query = Query.find({_id :filt})
        }

    if(req.query.keyword){
        const query ={}
        query.$or = [
            {firstname: {$regex : req.query.keyword,$options:"i" }},
            {lastname: {$regex : req.query.keyword,$options:"i" }},
        ];
        Query=Query.find(query)
    }


        const data = await Query
    res.status(201).json({result :data.length ,data})
})

exports. GETFollowing = ASync(async(req , res ,next)=>{

    const data = await  m_user.findById(req.params.userId).populate("following","firstname lastname profilePicture")
    res.status(201).json({result :data.following})
})

exports. GET_ID = ASync(async(req , res ,next)=>{
    const data = await m_user.findById(req.params.id).populate("following" , "firstname lastname profilePicture")
    if(!data) return next(res.status(404).json({Error : "No such user exist"}))
    res.status(201).json(data)
})


exports. PUT = ASync(async(req , res ,next)=>{
    const {currentUserId  , password}= req.body 
    if(req.params.id === currentUserId ){
        if(req.body.password) req.body.password =  await bcrypt.hash(req.body.password , 12)

        const user = await m_user.findByIdAndUpdate(req.params.id , req.body , {new : true})
        res.status(200).json(user)
    }else{
        res.status(400).json({Error : "Access Denied! you can only update your own profile"})
    }
})


exports. DELETE = ASync(async(req , res ,next)=>{
    const {currentUserId  , password}= req.body 

    if(req.params.id === currentUserId ){
        const user = await m_user.findByIdAndDelete(req.params.id )
        res.status(200).json({status : "Success Deleted"})
    }else{
        res.status(400).json({Error : "Access Denied! you can only delete your own profile"})
    }
})

exports. FOLLOW = ASync(async(req , res ,next)=>{
    const {id} = req.params
    const {WannaFollowThisId} = req.body
    
    if(WannaFollowThisId === id) res.status(403).json("Action forbidden")
    else{
        const user = await m_user.findById(req.params.id)
        if(!user) return next(new Error("This Id Not Exist"))

        const FollowingThisId = await m_user.findById(WannaFollowThisId)
        if(!user.following.includes(WannaFollowThisId)){
            await user.following.push(WannaFollowThisId)
            await FollowingThisId.followers.push(id)

            await user.save()
            await FollowingThisId.save()
            res.status(201).json("user Followed!")
        }else {
            await user.following.pop(WannaFollowThisId)
            await FollowingThisId.followers.pop(id)

            await user.save()
            await FollowingThisId.save()
            res.status(201).json("user UnFollowed!")
        }
    }
    
})


exports. UNFOLLOW = ASync(async(req , res ,next)=>{
    const {id} = req.params
    const {WannaFollowThisId} = req.body

    if(WannaFollowThisId === id) res.status(403).json("Action forbidden")
    else{
        const followUser = await m_user.findById(id)
        const WannaUserFollowThisId = await m_user.findById(WannaFollowThisId)

        if(!followUser.followers.includes(WannaFollowThisId)){
            await m_user.updateOne({$pull : {followers : WannaFollowThisId}})
            await WannaUserFollowThisId.updateOne({$pull : {following : id}})
            res.status(201).json("user Unfollowed!")
        }else res.status(403).json("User is follow by you ")
    }
    
})


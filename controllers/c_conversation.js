const m_conversation           = require("../model/m_conversation")
const m_message = require("../model/m_message");
const ASync            = require("express-async-handler");

exports. createConver  = ASync(async(req , res)=>{
    console.log(req.body.sender);
    const newConver = await m_conversation.create({ members : [req.body.sender , req.body.receiver]})
    try{
        res.status(200).json(newConver)
    }catch(err) {res.status(500).json(err)}
})

exports. GetUsersInConvesation = ASync(async(req , res , next)=>{

  const data = await m_conversation.find({members: req.params.userId}).populate("members" , "firstname lastname profilePicture createdAt")
  if(!data) return next(new Error("This ConversationId not exist"))

  let returnUsers = []
  data.map(e => e.members.filter(e => e._id.toString() !== req.params.userId && returnUsers.push(e) ))

  res.status(200).json({usersMembers : returnUsers})

 })




exports. GetConver =ASync(async(req , res)=>{
    try{
        const Conver = await m_conversation.find({ members : {$in : [req.params.userId] }})
        res.status(200).json(Conver)
    }catch(err) {res.status(500).json(err)}
})


exports. addMessage =ASync(async(req , res)=>{
      try{
        const Message = await (await m_message.create(req.body)).populate("sender" , 'firstname lastname profilePicture createdAt')
        res.status(200).json(Message)

      }catch(err){res.status(500).json(err)}
})


exports. getMessage =ASync(async(req , res)=>{
      try{
        const Message = await m_message.find({conversationId : req.params.conversationId}).populate("sender" , 'firstname lastname profilePicture createdAt')
        res.status(200).json(Message)
      }catch(err){res.status(500).json(err)}
})






// exports. findChat =ASync(async(req , res)=>{
//       try{
//         const chat = await m_conversation.findOne({members : { $all : [req.params.firstId , req.params.secondId]} })
//         res.status(200).json(chat)
//       }catch(err){res.status(500).json(err)}
// })

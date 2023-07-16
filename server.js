require("dotenv").config({path:".env"})
const express  = require("express") 
const mongoose = require("mongoose")

const path = require("path")
const app = express()
const cors = require("cors")
const morgan = require("morgan")
const { globalError } = require("./middleware/GlobalError")
mongoose.connect(process.env.mongodb).then(res => console.log(res.connection.host)).catch(err=> console.log(err))




app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(morgan("dev"))
app.use(cors())
app.options("*", cors())
app.enable("trust proxy")


// Middle ware 
app.use("/api/v1/auth" , require("./routes/Auth"))
app.use("/api/v1/post" , require("./routes/Post"))
app.use(express.static(path.join(__dirname, "uploads")))



app.all("*" , (req ,res) => res.status(404).json({Error:"This routes is not exists"}))

app.use((err , req , res ,next)=>{
    next(res.status(400).json({Error :{
        message : err.message,
        stack : err.stack
    }}))
})

app.use(globalError)
app.listen( 4000 , _=> console.log("connection on port 4000"))

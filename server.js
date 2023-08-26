const express = require('express')
const app = express()
const dotenv = require('dotenv')
dotenv.config()
const cors = require('cors')
//database connect
const database = require('./database/database')

const apiError = require('./utilis/apiError')
const globalError = require('./middleware/errorMiddleware')
database()
app.use(express.json())

app.use(cors({
    origin:"*"
}))

//middleware router
app.use('/api/v1/auth',require('./routes/authRouter'));
app.use('/api/v1/users',require('./routes/userRouter'));
app.use('/api/v1/chats',require('./routes/chatRouter'));


app.use('*',(req,res,next)=>{
    next(new apiError(`Can't find this router : ${req.originalUrl}`,400))
})

app.use(globalError)
const PORT = process.env.PORT
app.listen(PORT, () => console.log(`server raning with port ${PORT}`))
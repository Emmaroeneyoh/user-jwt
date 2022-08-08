const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser');
const  methodOverride = require('method-override');
const {Server } = require('socket.io')
const http = require('http')
const cors = require('cors')

const router = require('./route/router');
const {user_check} = require('./route/auth');




const app = express()

//conecting mongoose
const base = 'mongodb+srv://emmaro:1234@tutorial.klpqo.mongodb.net/reactblog?retryWrites=true&w=majority'

mongoose.connect(base)
.then((result) => console.log('rose-base has connected'))
.catch((err) => console.log(err, 'error has ocured in rose-base'))
//end

app.set('view engine', 'ejs')
const server = http.createServer(app)

//

const io = new Server(server, {
    cors:{
        origin: "http://localhost:3000",
        methods:["GET", "POST"]
    }
})



//midleware
app.use(cors())
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: false}))
app.use(methodOverride('_method'));
app.get('*', user_check)
app.use(router)

io.on("connection", (socket) => {

    socket.on("joinroom", (data) => {
        socket.join(data)
    })
 
socket.on("send", (data) => {
    console.log(data)
   socket.to(data.room).emit("out", data)
})
});


server.listen(5000, () => {
    console.log('server started')
})
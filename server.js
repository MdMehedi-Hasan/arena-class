const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const {v4: uuidV4} =require('uuid')

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.redirect(`/${uuidV4()}`)
})
app.get('/:room',(req,res) =>{
    res.render('room',{ roomId: req.params.room }) /* This is comming directly from the browser url */
})

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId)
        socket.to(roomId).emit('user-connected', userId) /* Here we emmited the broadcast to remove the error we were getting from the server */
        socket.on('disconnect',() =>{
            socket.to(roomId).emit('user-disconnected', userId)
        })
    })
})

server.listen(3001)
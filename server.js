const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const formatMessage = require('./utility/messages')
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utility/users')

const app = express()

//need http to access socket.io, make sure to use server.listen for creating server
const server = http.createServer(app)
const io = socketio(server)

//set static folder
app.use(express.static(path.join(__dirname, 'public')))

const botName = 'ChatCord Bot'
// Run when a client connects
io.on('connection', socket => {

    //On joining a room, welcome current user and broadcast to other users
    socket.on('joinRoom', ({ username, room }) => {

        //Create a new user and store it somewhere, using memory here and not a DB
        const user = userJoin(socket.id, username, room)
        socket.join(user.room)

        //Welcome current user
        socket.emit('message', formatMessage(botName, `Welcome to ChatCord ${user.username}!`))

        //Broadcasting the message to other users inside the room
        socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} has joined the chat`))

        //Send users and room info so that we can maintain side bar to show who is present in the room
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        })
    })

    //Listen for chat messages
    socket.on('chatMessage', msg => {
        // We can log this message here to see, but we need to emit it back to clients on front end
        // console.log(msg)

        //get current user
        const user = getCurrentUser(socket.id)

        //Emit it to everyone inside the room
        io.to(user.room).emit('message', formatMessage(user.username, msg))
    })

    //On disconnect, emit message to all
    socket.on('disconnect', () => {
        //get current user
        const user = userLeave(socket.id)

        if (user) {
            io.to(user.room).emit('message', formatMessage(botName, `${user.username} has left the chat`))

            //Send users and room info so that we can maintain side bar to show who is present in the room
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            })
        }
    })
})

const PORT = process.env.PORT || 5000

server.listen(PORT, () => console.log(`Server started on port ${PORT}`))
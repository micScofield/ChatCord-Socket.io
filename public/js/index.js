const chatForm = document.getElementById('chat-form')
const chatMessages = document.querySelector('.chat-messages')

//Get userrname and room from URL and emit it to server
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })
console.log(username, room)

const socket = io()

//Join Chatroom, emit username and room name, catch it on server.js
socket.emit('joinRoom', { username, room })

//Get room and users emitted from server
socket.on('roomUsers', ({ room, users }) => {
  console.log(room)
  console.log(users)
  //Output room name for sidebar
  outputRoomName(room)

  //Output room users for sidebar
  outputRoomUsers(users)
})

//Message from server (connections, disconnects, chats)
socket.on('message', message => {
  console.log(message)

  //Output the message to the DOM
  outputMessage(message)

  //Scroll down to bottom
  chatMessages.scrollTop = chatMessages.scrollHeight
})

// Message Submit
chatForm.addEventListener('submit', e => {
  e.preventDefault(); //prevent default behaviour to redirect to action page

  // Get message text. We have an id of 'msg' on the input field
  const msg = e.target.elements.msg.value

  //Emitting message to server
  socket.emit('chatMessage', msg)

  //After emitting, clear the input box and focus
  e.target.elements.msg.value = ''
  e.target.elements.msg.focus()
})

//Output message to DOM
function outputMessage(message) {
  const div = document.createElement('div')
  div.classList.add('message')
  div.innerHTML = `
    <p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">${message.text}</p>
  `
  document.querySelector('.chat-messages').appendChild(div)
}

//Output room name to DOM / sidebar
function outputRoomName(room) {
  const roomname = document.getElementById('room-name')
  roomname.innerText = room
}

//Output room users to DOM / sidebar
function outputRoomUsers(users) {
  const userlist = document.getElementById('users')
  userlist.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
  `
}

//Prompt the user before leave chat room
document.getElementById('leave-btn').addEventListener('click', () => {
  const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
  if (leaveRoom) {
    window.location = '../index.html';
  } else {
  }
});
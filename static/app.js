const socket = io();
// const socket = io.connect('http://localhost:3000', {_query:"?username=abc"});

// Pull elements from html
const message = document.getElementById('message');
const send = document.getElementById('chat-form');
const output = document.getElementById('output');
const feedback = document.getElementById('feedback');
const chatWindow = document.getElementById('chat-window');
const userList = document.getElementById('users');

const { username } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
})

socket.emit('connected', username);
console.log(username);

// Send messages to server
send.addEventListener('submit', e => {
  e.preventDefault();
  socket.emit('chat', message.value)
  message.value = "";
  message.focus();
})

// Listens for messages from server
socket.on('chat', data => {
  output.innerHTML += data;
  feedback.innerHTML = "";

  // Scroll down
  chatWindow.scrollTop = chatWindow.scrollHeight;
})

message.addEventListener('keypress', () => {
  socket.emit('typing', username);
})

socket.on('typing', username => {
  console.log(username);
  feedback.innerHTML = '<p><em>' + username + ' is typing a message</em></p>'
})

socket.on('users', users => {
  userList.innerHTML = "";
  users.forEach( user=> {
    const li = document.createElement('li');
    li.innerText = user;
    userList.appendChild(li);
  })
})

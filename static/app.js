// const socket = io.connect('http://localhost:3000');
const socket = io();

// Pull elements from html
const message = document.getElementById('message');
const send = document.getElementById('chat-form');
const output = document.getElementById('output');
const feedback = document.getElementById('feedback');
const chatWindow = document.getElementById('chat-window');

const { username } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
})

// Send messages to server
send.addEventListener('submit', e => {
  e.preventDefault();
  console.log(message.value);
  socket.emit('chat', message.value)
  message.value = "";
  message.focus();
})

// Listens for users entering the room
socket.on('connected', socketid => {
  output.innerHTML += '<p><em>' + username + ' has joined the room</em></p>';
})

// Listens for messages from server
socket.on('chat', data => {
  output.innerHTML += '<p><strong>' + data[0] + ':</strong> ' + data[1] + '</p>';
  feedback.innerHTML = "";

  // Scroll down
  chatWindow.scrollTop = chatWindow.scrollHeight;
})

message.addEventListener('keypress', () => {
  
  socket.emit('typing', socket.id.value);
})

socket.on('typing', data => {
  feedback.innerHTML = '<p><em>' + data + ' is typing a message</em></p>'
})

socket.on('disconnect', message => {
  output.innerHTML += '<p><em>' + message + '</em></p>';
})
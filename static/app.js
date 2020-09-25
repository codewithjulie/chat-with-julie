const socket = io();
// const socket = io.connect('http://localhost:3000', {_query:"?username=abc"});

// Pull elements from html
const message = document.getElementById('message');
const send = document.getElementById('chat-form');
const output = document.getElementById('output');
const feedback = document.getElementById('feedback');
const chatWindow = document.getElementById('chat-window');

const { username } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
})

console.log(username);

// Send messages to server
send.addEventListener('submit', e => {
  e.preventDefault();
  socket.emit('chat', [username, message.value])
  message.value = "";
  message.focus();
})

// Listens for users entering the room
socket.on('connect', username => {
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
  socket.emit('typing', username);
})

socket.on('typing', username => {
  feedback.innerHTML = '<p><em>' + username + ' is typing a message</em></p>'
})

socket.on('disconnect', message => {
  output.innerHTML += '<p><em>' + message + '</em></p>';
})
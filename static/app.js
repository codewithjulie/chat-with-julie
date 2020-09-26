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

socket.emit('connected', username);
console.log(username);

// Send messages to server
send.addEventListener('submit', e => {
  e.preventDefault();
  socket.emit('chat', [username, message.value])
  message.value = "";
  message.focus();
})

// Listens for users entering the room
socket.on('arrived', user => {
  console.log(user);
  output.innerHTML += '<p><em>' + user + ' has entered the room</em></p>';
  chatWindow.scrollTop = chatWindow.scrollHeight; 
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
  console.log(username);
  feedback.innerHTML = '<p><em>' + username + ' is typing a message</em></p>'
})

// Listening to when users leave the room
socket.on('disconnect', message => {
  output.innerHTML += '<p><em>' + message + '</em></p>';
  chatWindow.scrollTop = chatWindow.scrollHeight;
})
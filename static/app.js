// const socket = io.connect('http://localhost:3000');
const socket = io();

const socketid = socket.id;
const message = document.getElementById('message');
const send = document.getElementById('chat-form');
const output = document.getElementById('output');
const feedback = document.getElementById('feedback');

console.log(socketid);

send.addEventListener('submit', e => {
  e.preventDefault();
  console.log(message.value);
  socket.emit('chat', message.value)
  message.value = "";
  message.focus();
})

socket.on('connected', socketid => {
  output.innerHTML += '<p><em>' + socketid + ' has joined the room</em></p>';
})

socket.on('chat', data => {
  output.innerHTML += '<p><strong>' + data[0] + ':</strong> ' + data[1] + '</p>';
  feedback.innerHTML = "";
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
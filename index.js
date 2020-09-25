const path = require('path');
const express = require('express');
const http = require('http');
const socket = require('socket.io');

const app = express();
const server = http.createServer(app);


// Socket setup
const io = socket(server);


// Set static folder
app.use(express.static(path.join(__dirname, 'static')));


io.on('connection', socket => {
  socket.broadcast.emit('connected', socket.id)

  socket.on('chat', message => {
    io.emit('chat', [socket.id, message]);
  })

  socket.on('typing', () => {
    socket.broadcast.emit('typing', socket.id);
  })

  socket.on('disconnect', () => {
    io.emit('message', 'A user has left the chat');
  })
})

const port = process.env.port || 3000;

server.listen(port, () => {
  console.log(`listening on port ${port}`);
});
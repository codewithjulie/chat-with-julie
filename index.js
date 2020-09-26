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
  socket.on('connected', username => {
    console.log(username);
    socket.broadcast.emit('arrived', username);

    socket.on('chat', data => {
      io.emit('chat', data);
    })
  
    socket.on('typing', username => {
      socket.broadcast.emit('typing', username);
    })
  
    socket.on('disconnect', message => {
      console.log('someone has disconnected');
      io.emit('disconnect', username + ' has left the chat');
    })
  })


})

const port = process.env.port || 3000;

server.listen(port, () => {
  console.log(`listening on port ${port}`);
});
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

let users = [];

io.on('connection', socket => {
  socket.on('connected', username => {
    console.log(username);
    users.push(username);
    socket.broadcast.emit('chat', '<p><em>' + username + ' has joined the chat</em><p>');

    socket.on('chat', message => {
      io.emit('chat', '<p><strong>' + username + '</strong>: ' + message + '</p>');
    })
  
    socket.on('typing', username => {
      socket.broadcast.emit('typing', username);
    })

    io.emit('users', users)
  
    socket.on('disconnect', message => {
      const index = users.findIndex(user => user === username);
      console.log(index);
      // delete users[username];
      // console.log(users.username);
      // console.log(users);
      users.splice(index, 1);
      io.emit('chat', ('<p><em>' + username + ' has left the chat</em></p>'));
      io.emit('users', users)
    })
  })
})

const port = process.env.port || 3000;

server.listen(port, () => {
  console.log(`listening on port ${port}`);
});
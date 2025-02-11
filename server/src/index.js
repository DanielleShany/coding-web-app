const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', // Allow requests from the React app
    methods: ['GET', 'POST'],
  },
});

let codeBlocks = {}; // To store code temporarily in memory

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('joinRoom', ({ roomId }) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);

    // Send the current code to the new user
    if (codeBlocks[roomId]) {
      socket.emit('loadCode', codeBlocks[roomId]);
    }
  });

  socket.on('codeChange', ({ roomId, code }) => {
    codeBlocks[roomId] = code; // Save the code
    socket.to(roomId).emit('codeUpdate', code); // Broadcast to others in the room
  });

  socket.on('mentorLeft', (roomId) => {
    delete codeBlocks[roomId]; // Clear code when mentor leaves
    io.to(roomId).emit('redirectToLobby'); // Redirect all students
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(4000, () => {
  console.log('Server running on http://localhost:4000');
});

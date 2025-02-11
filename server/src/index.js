const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const mentors = {}; // Tracks the mentor for each room

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('joinRoom', ({ roomId }) => {
    socket.join(roomId);

    const room = io.sockets.adapter.rooms.get(roomId);
    const numberOfUsers = room ? room.size : 0;
    const role = numberOfUsers === 1 ? 'mentor' : 'student';

    if (role === 'mentor') {
      mentors[roomId] = socket.id;
    }

    io.to(socket.id).emit('assignRole', role);

    console.log(`User ${socket.id} joined ${roomId} as ${role}`);
  });

  // ✅ Handle real-time code sync
  socket.on('codeChange', ({ roomId, code }) => {
    socket.to(roomId).emit('codeUpdate', code);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);

    for (const roomId in mentors) {
      if (mentors[roomId] === socket.id) {
        delete mentors[roomId];
        io.to(roomId).emit('redirectToLobby');
        console.log(`Mentor left room ${roomId}, students redirected.`);
      }
    }
  });
});

server.listen(4000, () => {
  console.log('Server is running on http://localhost:4000');
});

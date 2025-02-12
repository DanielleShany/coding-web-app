// server/src/services/roomManager.js

const mentors = {};        // Tracks mentors by room
const roomCode = {};       // Tracks current code per room
const studentCount = {};   // Tracks student count per room

const CodeBlock = require('../models/CodeBlock'); // ✅ Mongoose Model

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // ✅ Join Room Logic
    socket.on("joinRoom", ({ roomId }) => {
      console.log(`User ${socket.id} is joining room: ${roomId}`);

      socket.join(roomId);
      socket.roomId = roomId;

      const room = io.sockets.adapter.rooms.get(roomId);
      const numberOfUsers = room ? room.size : 0;

      const role = numberOfUsers === 1 ? "mentor" : "student";

      if (role === "mentor") {
        mentors[roomId] = socket.id;
        console.log(`Assigned MENTOR role to ${socket.id}`);
      } else {
        studentCount[roomId] = (studentCount[roomId] || 0) + 1;
        console.log(`Assigned STUDENT role to ${socket.id}`);
        console.log(`Student Count in Room ${roomId}: ${studentCount[roomId]}`);
      }

      // ✅ Send the current code to the new client (if exists)
      if (roomCode[roomId]) {
        socket.emit("codeUpdate", roomCode[roomId]);
      }

      io.to(socket.id).emit("assignRole", role);
      io.to(roomId).emit("studentCount", studentCount[roomId] || 0);
    });

    // ✅ Handle Code Block Creation (Mongoose)
    socket.on('createCodeBlock', async ({ name }) => {
      try {
        const newBlock = new CodeBlock({ name });
        await newBlock.save(); // ✅ Save to MongoDB

        io.emit('newCodeBlock', newBlock); // Broadcast to all clients
        console.log(`New code block created: ${name}`);
      } catch (error) {
        console.error('❌ Error creating code block:', error);
      }
    });

    // ✅ Send All Code Blocks When a Client Connects
    socket.on('getCodeBlocks', async () => {
      try {
        const codeBlocks = await CodeBlock.find(); // ✅ Fetch from MongoDB
        socket.emit('codeBlocks', codeBlocks);     // Send to the client
      } catch (error) {
        console.error('❌ Error fetching code blocks:', error);
      }
    });

    // ✅ Handle Real-Time Code Changes
    socket.on("codeChange", ({ roomId, code }) => {
      roomCode[roomId] = code;                 // Store the latest code
      socket.to(roomId).emit("codeUpdate", code); // Broadcast to others
    });

    // ✅ Handle Disconnections
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);

      const roomId = socket.roomId;

      if (!roomId) return; // Skip if the user wasn't in a room

      // Handle Mentor Disconnection
      if (mentors[roomId] === socket.id) {
        delete mentors[roomId];
        delete roomCode[roomId];
        io.to(roomId).emit('redirectToLobby');
        console.log(`Mentor left room ${roomId}, students redirected.`);
      }

      // Handle Student Disconnection
      if (studentCount[roomId] > 0) {
        studentCount[roomId]--;
        io.to(roomId).emit('studentCount', studentCount[roomId]);
      }
    });
  });
};

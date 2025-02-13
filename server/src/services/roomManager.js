const { initializeCodeBlocks } = require('./codeBlocksService');
const { handleSocketEvents } = require('./socketHandler');

const mentors = {};        // Stores mentor socket IDs per room
const roomCode = {};       // Stores live code changes per room
const studentCount = {};   // Tracks number of students in each room

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Handle all socket events
    handleSocketEvents(io, socket, mentors, roomCode, studentCount);
  });
};

// Initialize the database with predefined code blocks
module.exports.initializeCodeBlocks = initializeCodeBlocks;

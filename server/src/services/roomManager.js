// server/src/services/roomManager.js

const mentors = {};    // Tracks mentors by room
const roomCode = {};   // Tracks current code per room
const studentCount = {}; // Tracks student count per room
const codeBlocks = [
    { id: "1", name: "Async Case" },
    { id: "2", name: "Promises" },
    { id: "3", name: "Loops" },
    { id: "4", name: "Functions" },
  ]; // ✅ Store code blocks on the server (initially in memory)
  
module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

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
      
        // ✅ Send the current code to the new client
        if (roomCode[roomId]) {
          socket.emit("codeUpdate", roomCode[roomId]);
        }
      
        io.to(socket.id).emit("assignRole", role);
        io.to(roomId).emit("studentCount", studentCount[roomId] || 0);
      });
      
      
      socket.on("codeChange", ({ roomId, code }) => {
        roomCode[roomId] = code; // ✅ Store the latest code
        socket.to(roomId).emit("codeUpdate", code); // Broadcast to others
      });
      

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      
        const roomId = socket.roomId; // ✅ Get the user's room directly
      
        if (!roomId) return; // If the user wasn't in a room, skip the rest
      
        // ✅ Handle Mentor Disconnection
        if (mentors[roomId] === socket.id) {
          delete mentors[roomId];
          delete roomCode[roomId];
          io.to(roomId).emit('redirectToLobby');
          console.log(`Mentor left room ${roomId}, students redirected.`);
        }
      
        // ✅ Handle Student Disconnection
        if (studentCount[roomId] > 0) {
          studentCount[roomId]--;
          io.to(roomId).emit('studentCount', studentCount[roomId]);
        }
      });   
     // Handle code block creation
    socket.on('createCodeBlock', ({ name }) => {
        const newBlock = { id: Date.now().toString(), name }; // Generate unique ID
        codeBlocks.push(newBlock); // Add to in-memory list

        // ✅ Broadcast the new block to all connected clients
        io.emit("newCodeBlock", newBlock);
    });
  });
}; 


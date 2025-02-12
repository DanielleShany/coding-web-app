// server/src/services/roomManager.js

const mentors = {};        // Tracks mentors by room
const roomCode = {};       // Tracks current code per room
const studentCount = {};   // Tracks student count per room

const CodeBlock = require('../models/CodeBlock'); 
const initializeCodeBlocks = async () => {
    const existingBlocks = await CodeBlock.find();
  
    if (existingBlocks.length === 0) {
      const initialBlocks = [
        { name: "Async Case", code: "", solution: "async function fetchData() { /* solution */ }" },
        { name: "Promises", code: "", solution: "function simulateTask(success) { /* solution */ }" },
        { name: "Loops", code: "", solution: "function printNumbersWithFor() { /* solution */ }" },
        { name: "Functions", code: "", solution: "function greet(name) { /* solution */ }" },
      ];
      await CodeBlock.insertMany(initialBlocks);
      console.log("✅ Database initialized with 4 code blocks.");
    } else {
      console.log("ℹ️ Code blocks already exist. Skipping initialization.");
    }
  };
      


module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // ✅ Join Room Logic
    socket.on("joinRoom", async ({ roomId }) => {
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

      const codeBlock = await CodeBlock.findById(roomId);
      if (codeBlock) {
        socket.emit("codeUpdate", codeBlock.code);  // ✅ Send saved code
      }
    });

    // ✅ Handle Code Block Creation (Mongoose)
    socket.on("createCodeBlock", async ({ name }) => {
        const newBlock = new CodeBlock({ name, solution: "" }); // ✅ Ensure solution exists
        await newBlock.save();
        io.emit("newCodeBlock", newBlock); // ✅ Real-time update for all clients
      });

    // Send All Code Blocks When a Client Connects
    socket.on("getCodeBlocks", async () => {
        const codeBlocks = await CodeBlock.find();
        console.log("📦 Sending code blocks to client:", codeBlocks);  // ✅ Debug log
        socket.emit("codeBlocks", codeBlocks);
      });
      
      
    //Handle real-time updates in code blocks
    socket.on("codeChange", async ({ roomId, code }) => {
        try {
          // ✅ Save code to MongoDB
          await CodeBlock.findByIdAndUpdate(roomId, { code });
          
          // ✅ Broadcast the code to others
          socket.to(roomId).emit("codeUpdate", code);
      
          // ✅ Check for solution match
          const codeBlock = await CodeBlock.findById(roomId);
          if (codeBlock && code.trim() === codeBlock.solution.trim()) {
            io.to(roomId).emit("showSmiley");
          }
        } catch (error) {
          console.error("❌ Error saving code:", error);
        }
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
module.exports.initializeCodeBlocks = initializeCodeBlocks; 

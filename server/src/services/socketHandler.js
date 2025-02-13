const { getCodeBlockById, updateCode, getAllCodeBlocks, createCodeBlock } = require('./codeBlocksService');

const handleSocketEvents = (io, socket, mentors, roomCode, studentCount) => {

    // Handle user jouning a room
  socket.on("joinRoom", async ({ roomId }) => {
    console.log(`User ${socket.id} is joining room: ${roomId}`);

    socket.join(roomId);
    socket.roomId = roomId;

    //Gets the student count and assigns the role
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
    // Sends the code to the client
    if (roomCode[roomId]) {
      socket.emit("codeUpdate", roomCode[roomId]);
    }
    // Sends the role and student count to the client
    io.to(socket.id).emit("assignRole", role);
    io.to(roomId).emit("studentCount", studentCount[roomId] || 0);

    // Sends the code block data to the client
    const codeBlock = await getCodeBlockById(roomId);
    if (codeBlock) {
      socket.emit("codeBlockData", codeBlock);
    }
  });
  //Creates a new code block
  socket.on("createCodeBlock", async ({ name }) => {
    const newBlock = await createCodeBlock(name);
    io.emit("newCodeBlock", newBlock);
  });
    //Gets the code blocks
  socket.on('getCodeBlocks', async () => {
    try {
      const codeBlocks = await getAllCodeBlocks();
      console.log("📦 Sending code blocks to client:", codeBlocks);
      socket.emit('codeBlocks', codeBlocks);
    } catch (error) {
      console.error('❌ Error fetching code blocks:', error);
    }
  });
    //Handles the code change, showing a smiley face if the code is correct
  socket.on("codeChange", async ({ roomId, code }) => {
    try {
      await updateCode(roomId, code);
      socket.to(roomId).emit("codeUpdate", code);

      const codeBlock = await getCodeBlockById(roomId);
      if (codeBlock && code.trim() === codeBlock.solution.trim()) {
        io.to(roomId).emit("showSmiley");
      }
    } catch (error) {
      console.error("❌ Error updating code:", error);
    }
  });
  //Handle user disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    const roomId = socket.roomId;

    if (!roomId) return;

    if (mentors[roomId] === socket.id) {
      delete mentors[roomId];
      delete roomCode[roomId];
      io.to(roomId).emit('redirectToLobby'); //redirect students to lobby when mentor leaves
      console.log(`Mentor left room ${roomId}, students redirected.`);
    }

    if (studentCount[roomId] > 0) {
      studentCount[roomId]--;
      io.to(roomId).emit('studentCount', studentCount[roomId]);
    }
  });
};

module.exports = { handleSocketEvents };

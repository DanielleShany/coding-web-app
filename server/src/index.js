const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const roomManager = require("./services/roomManager.js");
const mongoose = require("mongoose");
const cors = require("cors");
const { initializeCodeBlocks } = require('./services/codeBlocksService');

const app = express();

// Load environment variables
const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ Missing MONGODB_URI. Set it in the environment variables.");
  process.exit(1); // Exit process if DB URL is missing
}

// Enable CORS for all origins (Public API)
app.use(
  cors({
    origin: "*", 
    methods: ["GET", "POST"], 
    credentials: true, 
  })
);

const server = http.createServer(app);

// ✅ Set up WebSockets with unrestricted access
const io = new Server(server, {
  cors: {
    origin: "*", // Public WebSocket connections
    methods: ["GET", "POST"],
  },
});

roomManager(io);

// Connect to MongoDB using a secure environment variable
mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB');
    await initializeCodeBlocks();  // ✅ Ensure the new structured code blocks are inserted
  })
  .catch((err) => console.error('❌ MongoDB connection error:', err));


// Start the server
server.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});

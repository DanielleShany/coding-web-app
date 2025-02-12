const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const roomManager = require('./services/roomManager.js');
const mongoose = require('mongoose');
const cors = require("cors");

const app = express();
const allowedOrigins = [
  "https://coding-web-app-danielleshanys-projects.vercel.app",
  "https://coding-web-app-git-main-danielleshanys-projects.vercel.app",
  "http://localhost:3000", 
  "https://coding-web-pw4jdr9v8-danielleshanys-projects.vercel.app"
];
// ✅ CORS for both Express & Socket.io
app.use(cors({
  origin: allowedOrigin,
  methods: ["GET", "POST"],
  credentials: true
}));

app.use(cors({
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true); // ✅ Allow requests from listed origins
    } else {
      callback(new Error("❌ Not allowed by CORS")); // 🚫 Block unknown origins
    }
  },
  methods: ["GET", "POST"],
  credentials: true,
}));

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
  },
});
roomManager(io);

// ✅ MongoDB connection
mongoose
  .connect('mongodb+srv://tomsClassroom:Thailand123@codingwebapp.y6l4x.mongodb.net/codingWebApp?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// ✅ Server start
server.listen(4000, () => {
  console.log('✅ Server is running on https://coding-web-app-yx33.onrender.com');
});

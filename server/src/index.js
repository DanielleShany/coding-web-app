const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const roomManager = require('./services/roomManager.js');
const mongoose = require('mongoose');
const cors = require("cors");

const app = express();
const allowedOrigin = 
["https://coding-web-app-danielleshanys-projects.vercel.app",
  "http://localhost:3000"
];

// ✅ CORS for both Express & Socket.io
app.use(cors({
  origin: allowedOrigin,
  methods: ["GET", "POST"],
  credentials: true
}));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: allowedOrigin,  // ✅ Use the same allowed origin
    methods: ["GET", "POST"]
  }
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

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const roomManager = require('./services/roomManager.js');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
  //{
//   origin: "http://localhost:3000", // Allow requests from your React app
//   methods: ["GET", "POST"],        // Allow GET and POST methods
//   credentials: true                // Allow credentials (optional)
// }));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

roomManager(io);

mongoose
  .connect('mongodb+srv://tomsClassroom:Thailand123@codingwebapp.y6l4x.mongodb.net/codingWebApp?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

server.listen(4000, () => {
  console.log('✅ Server is running on http://localhost:4000');
});

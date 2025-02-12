const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const roomManager = require('./services/roomManager.js');

const app = express();
app.use(cors());

// ✅ Connect to MongoDB Atlas using Mongoose
mongoose
  .connect('mongodb+srv://tomsClassroom:Thailand123@codingwebapp.y6l4x.mongodb.net/codingWebApp?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // Optional: Faster error detection
  })
  .then(() => console.log('✅ Connected to MongoDB Atlas via Mongoose'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

const server = http.createServer(app);
const io = new Server(server);

roomManager(io); // ✅ Pass Socket.io to the room manager

server.listen(4000, () => {
  console.log('🚀 Server is running on http://localhost:4000');
});

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const roomManager = require('./services/roomManager.js');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server);

roomManager(io); 

server.listen(4000, () => {
  console.log('Server is running on http://localhost:4000');
});

// client/src/socket.ts
import { io, Socket } from 'socket.io-client';

const socket: Socket = io('https://coding-web-app-yx33.onrender.com', { transports: ['websocket'] });

socket.on('connect', () => {
    console.log(`✅ Connected to server with socket ID: ${socket.id}`);
  });

export default socket;



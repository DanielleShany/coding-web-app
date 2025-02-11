// client/src/socket.ts
import { io, Socket } from 'socket.io-client';

const socket: Socket = io('http://localhost:4000', { transports: ['websocket'] });

socket.on('connect', () => {
    console.log(`✅ Connected to server with socket ID: ${socket.id}`);
  });

export default socket;



import { io } from "socket.io-client";

// Singleton pattern for WebSocket connection
const socket = io("https://coding-web-app-yx33.onrender.com");

/* Request all code blocks */
export const fetchCodeBlocks = (callback: (blocks: any[]) => void) => {
  socket.emit("getCodeBlocks");
  socket.on("codeBlocks", callback);
};

/* Listen for new code block creation */
export const listenForNewBlocks = (callback: (newBlock: any) => void) => {
  socket.on("newCodeBlock", callback);
};

/* Create a new code block */
export const createCodeBlock = (name: string) => {
  socket.emit("createCodeBlock", { name });
};

/* Cleanup listeners to avoid memory leaks */
export const removeSocketListeners = () => {
  socket.off("codeBlocks");
  socket.off("newCodeBlock");
};

export default socket;

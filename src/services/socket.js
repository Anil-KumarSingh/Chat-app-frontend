import { io } from 'socket.io-client';

// Base URL of the backend Socket.IO server
const SOCKET_URL = "https://chat-app-backend-3-ou4r.onrender.com";

let socket = null;

// Create and connect a socket instance, authenticated with the JWT token
export const initSocket = (token) => {
  socket = io(SOCKET_URL, {
    auth: { token },
    transports: ['websocket'],
  });
  return socket;
};

// Get the currently active socket instance
export const getSocket = () => socket;

// Disconnect and clear the socket (e.g. on logout)
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

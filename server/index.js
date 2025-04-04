const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:1234",
    methods: ["GET", "POST"]
  }
});

// Store messages for each room (in-memory storage)
const roomMessages = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
    
    // Send existing messages to the user
    if (roomMessages.has(roomId)) {
      socket.emit('previousMessages', roomMessages.get(roomId));
    }
  });

  socket.on('leaveRoom', (roomId) => {
    socket.leave(roomId);
    console.log(`User ${socket.id} left room ${roomId}`);
  });

  socket.on('message', (messageData) => {
    // Store the message
    if (!roomMessages.has(messageData.room)) {
      roomMessages.set(messageData.room, []);
    }
    roomMessages.get(messageData.room).push(messageData);

    // Limit stored messages to last 100
    if (roomMessages.get(messageData.room).length > 100) {
      roomMessages.get(messageData.room).shift();
    }

    // Broadcast the message to the room
    io.to(messageData.room).emit('message', messageData);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 
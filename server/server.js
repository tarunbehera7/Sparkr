const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/community-chat', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Message Schema
const messageSchema = new mongoose.Schema({
  discussionId: String,
  sender: String,
  text: String,
  timestamp: { type: Date, default: Date.now },
  avatar: String
});

const Message = mongoose.model('Message', messageSchema);

// Socket.IO Connection
io.on('connection', (socket) => {
  console.log('New client connected');

  // Join a discussion room
  socket.on('joinDiscussion', (discussionId) => {
    socket.join(discussionId);
    console.log(`Client joined discussion: ${discussionId}`);

    // Load previous messages
    Message.find({ discussionId })
      .sort({ timestamp: 1 })
      .then(messages => {
        socket.emit('previousMessages', messages);
      })
      .catch(err => console.error('Error loading messages:', err));
  });

  // Handle new messages
  socket.on('sendMessage', async (data) => {
    try {
      const { discussionId, sender, text, avatar } = data;
      const newMessage = new Message({
        discussionId,
        sender,
        text,
        avatar
      });

      await newMessage.save();
      io.to(discussionId).emit('newMessage', newMessage);
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// API Routes
app.get('/api/discussions/:id/messages', async (req, res) => {
  try {
    const messages = await Message.find({ discussionId: req.params.id })
      .sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching messages' });
  }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 
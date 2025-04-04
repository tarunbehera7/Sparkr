import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import io from 'socket.io-client';
import '../styles/GroupChat.css';

function GroupChat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [rooms, setRooms] = useState([
    { id: 'general', name: 'General' },
    { id: 'environment', name: 'Environment' },
    { id: 'education', name: 'Education' },
    { id: 'healthcare', name: 'Healthcare' }
  ]);
  const [currentRoom, setCurrentRoom] = useState('general');
  const { user } = useAuth();
  const socketRef = useRef();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Connect to Socket.io server
    socketRef.current = io('http://localhost:3001', {
      query: { roomId: currentRoom }
    });

    // Listen for incoming messages
    socketRef.current.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Join room
    socketRef.current.emit('joinRoom', currentRoom);

    return () => {
      socketRef.current.disconnect();
    };
  }, [currentRoom]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && user) {
      const messageData = {
        content: newMessage,
        sender: user.name,
        avatar: user.avatar,
        room: currentRoom,
        timestamp: new Date().toISOString()
      };

      socketRef.current.emit('message', messageData);
      setNewMessage('');
    }
  };

  const handleRoomChange = (roomId) => {
    socketRef.current.emit('leaveRoom', currentRoom);
    setCurrentRoom(roomId);
    setMessages([]); // Clear messages when changing rooms
  };

  return (
    <div className="group-chat">
      <div className="chat-sidebar">
        <h3>Chat Rooms</h3>
        <ul className="room-list">
          {rooms.map((room) => (
            <li
              key={room.id}
              className={`room-item ${currentRoom === room.id ? 'active' : ''}`}
              onClick={() => handleRoomChange(room.id)}
            >
              {room.name}
            </li>
          ))}
        </ul>
      </div>

      <div className="chat-main">
        <div className="chat-header">
          <h2>{rooms.find(room => room.id === currentRoom)?.name} Room</h2>
        </div>

        <div className="messages-container">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message ${message.sender === user?.name ? 'own-message' : ''}`}
            >
              <img src={message.avatar} alt={message.sender} className="message-avatar" />
              <div className="message-content">
                <div className="message-header">
                  <span className="sender-name">{message.sender}</span>
                  <span className="timestamp">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p>{message.content}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form className="message-form" onSubmit={handleSendMessage}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="message-input"
          />
          <button type="submit" className="send-button">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default GroupChat; 
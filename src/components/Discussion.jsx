import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import io from 'socket.io-client';
import '../styles/Discussion.css';

const Discussion = ({ onClose, initialRoom }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const { user } = useAuth();
  const socketRef = useRef();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Connect to Socket.io server
    socketRef.current = io(import.meta.env.VITE_API_URL ? `http://localhost:${import.meta.env.VITE_API_URL}` : 'http://localhost:3001', {
      query: { room: initialRoom }
    });

    // Listen for incoming messages
    socketRef.current.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [initialRoom]);

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
        id: Date.now(),
        content: newMessage,
        sender: user.name || 'Anonymous',
        avatar: user.name ? user.name.split(' ').map(n => n[0]).join('') : 'A',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        room: initialRoom
      };
      socketRef.current.emit('message', messageData);
      setNewMessage('');
    }
  };

  return (
    <div className="discussion-modal">
      <div className="discussion-header">
        <h2>Discussion: {initialRoom}</h2>
        <button onClick={onClose} className="close-button">×</button>
      </div>
      <div className="messages-container">
        {messages.map((message) => (
          <div key={message.id} className="message">
            <div className="message-avatar">{message.avatar}</div>
            <div className="message-content">
              <div className="message-header">
                <span className="message-sender">{message.sender}</span>
                <span className="message-time">{message.timestamp}</span>
              </div>
              <p className="message-text">{message.content}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="message-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Discussion; 
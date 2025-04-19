import React, { useState, useEffect, useRef } from 'react';
import { ref, push, onValue, query, limitToLast, orderByChild, get, update, serverTimestamp, set } from 'firebase/database';
import { database } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import '../styles/GroupChat.css';

const CHAT_ROOMS = [
  { id: 'general', name: 'General' },
  { id: 'tech', name: 'Technology' },
  { id: 'health', name: 'Healthcare' },
  { id: 'education', name: 'Education' },
  { id: 'environment', name: 'Environment' }
];

// Preloaded messages for each room based on user interests
const PRELOADED_MESSAGES = {
  general: [
    {
      id: 'g1',
      content: "Hello everyone! Excited to be part of this community!",
      sender: "Sarah Johnson",
      avatar: "https://ui-avatars.com/api/?name=Sarah+Johnson&background=random",
      timestamp: Date.now() - 86400000 // 1 day ago
    },
    {
      id: 'g2',
      content: "Welcome Sarah! Great to have you here.",
      sender: "Michael Chen",
      avatar: "https://ui-avatars.com/api/?name=Michael+Chen&background=random",
      timestamp: Date.now() - 85400000
    }
  ],
  tech: [
    {
      id: 't1',
      content: "Has anyone explored the potential of AI in social impact projects?",
      sender: "Michael Chen",
      avatar: "https://ui-avatars.com/api/?name=Michael+Chen&background=random",
      timestamp: Date.now() - 82400000
    },
    {
      id: 't2',
      content: "Yes! I'm currently working on an AI-driven solution for accessible education.",
      sender: "Aisha Patel",
      avatar: "https://ui-avatars.com/api/?name=Aisha+Patel&background=random",
      timestamp: Date.now() - 81400000
    }
  ],
  health: [
    {
      id: 'h1',
      content: "Looking to collaborate on a mental health awareness campaign.",
      sender: "Emma Wilson",
      avatar: "https://ui-avatars.com/api/?name=Emma+Wilson&background=random",
      timestamp: Date.now() - 76400000
    },
    {
      id: 'h2',
      content: "I'd love to help! Healthcare accessibility is so important.",
      sender: "Aisha Patel",
      avatar: "https://ui-avatars.com/api/?name=Aisha+Patel&background=random",
      timestamp: Date.now() - 75400000
    }
  ],
  education: [
    {
      id: 'e1',
      content: "Working on a project to provide free educational resources to underserved communities.",
      sender: "Sarah Johnson",
      avatar: "https://ui-avatars.com/api/?name=Sarah+Johnson&background=random",
      timestamp: Date.now() - 66400000
    },
    {
      id: 'e2',
      content: "That's amazing! I can help with content development.",
      sender: "Aisha Patel",
      avatar: "https://ui-avatars.com/api/?name=Aisha+Patel&background=random",
      timestamp: Date.now() - 65400000
    }
  ],
  environment: [
    {
      id: 'ev1',
      content: "Just started a local tree-planting initiative. Anyone interested in joining?",
      sender: "Sarah Johnson",
      avatar: "https://ui-avatars.com/api/?name=Sarah+Johnson&background=random",
      timestamp: Date.now() - 56400000
    },
    {
      id: 'ev2',
      content: "Count me in! We need more green initiatives in our community.",
      sender: "David Rodriguez",
      avatar: "https://ui-avatars.com/api/?name=David+Rodriguez&background=random",
      timestamp: Date.now() - 55400000
    }
  ]
};

const GroupChat = ({ initialUser }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [currentRoom, setCurrentRoom] = useState('general');
  const [newMessage, setNewMessage] = useState('');
  const [userConnections, setUserConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [showPrivateChats, setShowPrivateChats] = useState(false);
  const [privateChats, setPrivateChats] = useState([]);
  const [activePrivateChat, setActivePrivateChat] = useState(null);
  const [showRoomSelector, setShowRoomSelector] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Add a useEffect to log when the component mounts
  useEffect(() => {
    console.log('GroupChat component mounted');
    // Force a re-render to ensure visibility
    document.body.style.overflow = 'auto';
  }, []);

  // Reset state when user changes
  useEffect(() => {
    if (user) {
      setMessages([]);
      setCurrentRoom('general');
      setNewMessage('');
      setUserConnections([]);
      setLoading(true);
      setError(null);
      setSearchQuery('');
      setFilteredRooms([]);
      setShowPrivateChats(false);
      setPrivateChats([]);
      setActivePrivateChat(null);
      setShowRoomSelector(false);
      
      // Load user connections
      loadUserConnections();
    }
  }, [user]);

  // Define the loadUserConnections function
  const loadUserConnections = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      console.log('Loading connections for user:', user.uid);
      
      // Get all connections for the current user
      const connectionsRef = ref(database, `connections/${user.uid}`);
      
      return onValue(connectionsRef, (snapshot) => {
        const data = snapshot.val();
        console.log('Raw connections data:', data);
        
        if (data) {
          // Convert connections object to array
          const connectionsList = Object.entries(data)
            .map(([userId, connection]) => ({
              userId,
              name: connection.name,
              avatar: connection.avatar,
              roomId: connection.roomId,
              timestamp: connection.timestamp,
              isExplicitlyConnected: connection.isExplicitlyConnected || false
            }))
            .filter(connection => connection.isExplicitlyConnected); // Only include explicit connections

          // Sort by most recent connection
          connectionsList.sort((a, b) => {
            // Handle cases where timestamp might be null or undefined
            const timestampA = a.timestamp || 0;
            const timestampB = b.timestamp || 0;
            return timestampB - timestampA;
          });
          
          console.log('Processed connections list:', connectionsList);
          setUserConnections(connectionsList);
        } else {
          console.log('No connections found for user');
          setUserConnections([]);
        }
        setLoading(false);
      });
    } catch (error) {
      console.error('Error loading user connections:', error);
      setError('Failed to load connections. Please try again.');
      setLoading(false);
    }
  };

  // Handle initialUser parameter
  useEffect(() => {
    if (initialUser) {
      const roomId = `private-${[user?.uid, initialUser.id].sort().join('-')}`;
      setCurrentRoom(roomId);
      setPrivateChat(initialUser);
      loadPrivateChatMessages(roomId);
    }
  }, [initialUser, user]);

  useEffect(() => {
    if (user) {
      loadUserConnections();
    }
  }, [user]);

  // const scrollToBottom = () => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  // };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() && user) {
      const messageData = {
        content: newMessage.trim(),
        sender: user.displayName || user.name || 'Anonymous',
        senderEmail: user.email,
        avatar: user.photoURL || user.avatar || `https://ui-avatars.com/api/?name=${user.displayName || user.name || 'Anonymous'}&background=random`,
        timestamp: Date.now()
      };

      try {
        // Determine if this is a private chat or group chat
        const messagesPath = currentRoom.includes('private_') 
          ? `privateMessages/${currentRoom.split('private_')[1]}`  // Extract the actual room ID
          : `messages/${currentRoom}`;
        const roomMessagesRef = ref(database, messagesPath);
        
        await push(roomMessagesRef, messageData);
        setNewMessage('');
        // scrollToBottom();
      } catch (error) {
        console.error('Error sending message:', error);
        alert('Failed to send message. Please try again.');
      }
    } else if (!user) {
      alert('Please sign in to send messages.');
    }
  };

  useEffect(() => {
    setLoading(true);
    
    // If not logged in and trying to access private chat, redirect to general
    if (currentRoom?.includes('private_') && !user) {
      setCurrentRoom('general');
      return;
    }

    if (!currentRoom) return;

    // Clear previous messages when changing rooms
    setMessages([]);

    // Determine if this is a private chat
    const isPrivate = currentRoom.includes('private_');
    
    // If it's a private chat but doesn't belong to current user, reset to general
    if (isPrivate && user) {
      const roomParts = currentRoom.split('_');
      if (roomParts.length > 1 && !roomParts.includes(user.uid)) {
        setCurrentRoom('general');
        return;
      }
    }

    // Load preloaded messages for group chats only
    const preloadedMessages = !isPrivate ? (PRELOADED_MESSAGES[currentRoom] || []) : [];
    
    // Subscribe to messages for the current room
    const messagesPath = isPrivate 
      ? `privateMessages/${currentRoom.replace('private_', '')}` // Remove 'private_' prefix for storage
      : `messages/${currentRoom}`;
    const messagesRef = query(
      ref(database, messagesPath),
      orderByChild('timestamp'),
      limitToLast(100)
    );
    
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      try {
        const messagesData = snapshot.val();
        if (messagesData) {
          const messagesList = Object.entries(messagesData).map(([key, value]) => ({
            id: key,
            ...value
          }));
          // Only combine with preloaded messages for group chats
          const allMessages = isPrivate 
            ? messagesList 
            : [...preloadedMessages, ...messagesList];
          
          setMessages(allMessages.sort((a, b) => a.timestamp - b.timestamp));
        } else {
          setMessages(isPrivate ? [] : preloadedMessages);
        }
      } catch (error) {
        console.error('Error loading messages:', error);
        setMessages(isPrivate ? [] : preloadedMessages);
      } finally {
        setLoading(false);
        // scrollToBottom();
      }
    });

    return () => unsubscribe();
  }, [currentRoom, user]);

  const handleRoomChange = (roomId, event) => {
    // Prevent default behavior to stop page scrolling
    if (event) {
      event.preventDefault();
    }
    
    if (!roomId) return;
    
    // Verify that private chats can only be accessed by the current user
    if (roomId.includes('private_') && !user) {
      setCurrentRoom('general');
      return;
    }
    
    // Clear previous messages before changing room
    setMessages([]);
    setCurrentRoom(roomId);
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      month: 'short',
      day: 'numeric'
    });
  };

  // Get the current room name with null checks
  const getCurrentRoomName = () => {
    if (!currentRoom) return 'Chat Room';
    
    if (currentRoom.includes('private_')) { // Check if it's a private chat
      const connection = userConnections.find(c => c.roomId === currentRoom);
      return connection ? ` ${connection.name}` : 'Private Chat';
    }
    const room = CHAT_ROOMS.find(room => room.id === currentRoom);
    return room ? `${room.name} Room` : 'Chat Room';
  };

  const loadPrivateChatMessages = async (chatId) => {
    setLoading(true);
    try {
      const chatRef = ref(database, `privateMessages/${chatId}`);
      const unsubscribe = onValue(chatRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          // Convert messages object to array and sort by timestamp
          const messagesList = Object.entries(data)
            .filter(([key]) => key !== 'initialized' && key !== 'participants' && key !== 'createdAt')
            .map(([id, message]) => ({
              id,
              ...message,
              timestamp: message.timestamp || Date.now()
            }))
            .sort((a, b) => a.timestamp - b.timestamp);
          
          setMessages(messagesList);
        } else {
          setMessages([]);
        }
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error('Error loading private chat messages:', error);
      setError('Failed to load messages');
      setLoading(false);
    }
  };

  const handlePrivateChatClick = (connection) => {
    if (!user) {
      alert('Please log in to access private chats');
      return;
    }

    console.log('Opening private chat with:', connection);
    
    // Set active private chat
    setActivePrivateChat(connection);
    
    // Set current room to the private chat room ID
    setCurrentRoom(connection.roomId);
    
    // Load messages for this private chat
    loadPrivateChatMessages(connection.roomId);
    
    // Show private chats section
    setShowPrivateChats(true);
  };

  const sendPrivateMessage = async (messageText) => {
    if (!messageText.trim() || !activePrivateChat || !user) return;

    try {
      const messageRef = ref(database, `privateMessages/${activePrivateChat.roomId}`);
      const newMessageRef = push(messageRef);
      
      const messageData = {
        text: messageText,
        senderId: user.uid,
        senderName: user.displayName || 'Anonymous',
        senderAvatar: user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || 'Anonymous'}&background=random`,
        timestamp: serverTimestamp()
      };

      await set(newMessageRef, messageData);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending private message:', error);
      setError('Failed to send message');
    }
  };

  return (
    <div className="group-chat">
      <div className="chat-sidebar">
        <h3>Chat Rooms</h3>
        <div className="room-list">
          {CHAT_ROOMS.map((room) => (
            <button
              key={`room-${room.id}`}
              className={`room-button ${currentRoom === room.id ? 'active' : ''}`}
              onClick={(e) => handleRoomChange(room.id, e)}
            >
              {room.name}
            </button>
          ))}
          
          {user && userConnections.length > 0 && (
            <>
              <div className="private-chats-divider">Private Chats</div>
              {userConnections.map((connection) => (
                <button
                  key={`private-${connection.roomId}`}
                  className={`room-button private ${currentRoom === connection.roomId ? 'active' : ''}`}
                  onClick={(e) => handleRoomChange(connection.roomId, e)}
                >
                  <div 
                    className="private-chat-avatar"
                    style={{ 
                      // width: '40px', 
                      // height: '40px', 
                      backgroundColor: 'var(--primary-color)',
                      color: 'white',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.2rem',
                      border: '1px solid var(--border-color)'
                    }}
                  >
                    {connection.name.charAt(0)}
                  </div>
                  <span className="private-chat-name">{connection.name}</span>
                </button>
              ))}
            </>
          )}
        </div>
      </div>

      <div className="chat-main">
        <div className="chat-header">
          <h2>{getCurrentRoomName()}</h2>
          {currentRoom.includes('private_') && (
            <div className="chat-header-status">
              <span className="status-indicator online"></span>
              <span>Online</span>
            </div>
          )}
        </div>

        <div className="messages-container" ref={chatContainerRef}>
          {loading ? (
            <div className="loading-messages">
              <p>Loading messages...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="no-messages">
              <p>No messages in this chat yet. Be the first to send one!</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={message.id || `msg-${index}`}
                className={`message ${message.senderEmail === user?.email ? 'own-message' : ''}`}
              >
                <img 
                  src={message.avatar} 
                  alt={message.sender} 
                  className="message-avatar"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${message.sender}&background=random`;
                  }}
                />
                <div className="message-content">
                  <div className="message-header">
                    <span className="sender-name">{message.sender}</span>
                    <span className="timestamp">{formatTimestamp(message.timestamp)}</span>
                  </div>
                  <p>{message.content}</p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <form className="message-form" onSubmit={handleSendMessage}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={user ? `Type your message in ${getCurrentRoomName()}...` : 'Please sign in to send messages'}
            className="message-input"
            disabled={!user}
          />
          <button 
            type="submit" 
            className="send-button" 
            disabled={!newMessage.trim() || !user}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default GroupChat; 
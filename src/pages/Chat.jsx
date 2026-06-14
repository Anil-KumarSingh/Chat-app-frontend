import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import { useAuth } from '../context/AuthContext';
import { getUsers, getMessages } from '../services/api';
import { initSocket, getSocket, disconnectSocket } from '../services/socket';

const Chat = () => {
  const { user } = useAuth();

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUserId, setTypingUserId] = useState(null);

  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState('');

  // Controls sidebar visibility on small screens
  const [showSidebar, setShowSidebar] = useState(true);

  // --- Setup Socket.IO connection once when the user is available ---
  useEffect(() => {
    if (!user) return;

    const socket = initSocket(user.token);

    // Join personal room for receiving direct messages
    socket.emit('join');

    // New message received from server (either sent by me or to me)
    socket.on('receiveMessage', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    // Another user came online
    socket.on('userOnline', (userId) => {
      setOnlineUsers((prev) => (prev.includes(userId) ? prev : [...prev, userId]));
    });

    // Another user went offline
    socket.on('userOffline', (userId) => {
      setOnlineUsers((prev) => prev.filter((id) => id !== userId));
    });

    // Someone is typing to me
    socket.on('typing', ({ senderId }) => {
      setTypingUserId(senderId);
    });

    // Someone stopped typing
    socket.on('stopTyping', ({ senderId }) => {
      setTypingUserId((prev) => (prev === senderId ? null : prev));
    });

    socket.on('connect_error', (err) => {
      setError('Could not connect to chat server: ' + err.message);
    });

    // Cleanup on unmount / logout
    return () => {
      disconnectSocket();
    };
  }, [user]);

  // --- Fetch list of users for the sidebar ---
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await getUsers();
        setUsers(data);
      } catch (err) {
        setError('Failed to load user list');
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, []);

  // --- Fetch chat history whenever a new user is selected ---
  useEffect(() => {
    if (!selectedUser) return;

    const fetchMessages = async () => {
      setLoadingMessages(true);
      try {
        const { data } = await getMessages(selectedUser._id);
        setMessages(data);
      } catch (err) {
        setError('Failed to load conversation history');
      } finally {
        setLoadingMessages(false);
      }
    };
    fetchMessages();
  }, [selectedUser]);

  // Handle selecting a user from the sidebar
  const handleSelectUser = (u) => {
    setSelectedUser(u);
    setMessages([]);
    setShowSidebar(false); // collapse sidebar on mobile after selection
  };

  // Emit a new chat message over the socket
  const handleSendMessage = (text) => {
    const socket = getSocket();
    if (!socket || !selectedUser) return;
    socket.emit('sendMessage', { receiverId: selectedUser._id, message: text });
  };

  const handleTyping = () => {
    const socket = getSocket();
    if (!socket || !selectedUser) return;
    socket.emit('typing', { receiverId: selectedUser._id });
  };

  const handleStopTyping = () => {
    const socket = getSocket();
    if (!socket || !selectedUser) return;
    socket.emit('stopTyping', { receiverId: selectedUser._id });
  };

  // Only show messages that belong to the currently open conversation
  const filteredMessages = messages.filter(
    (m) =>
      selectedUser &&
      ((m.senderId === user._id && m.receiverId === selectedUser._id) ||
        (m.senderId === selectedUser._id && m.receiverId === user._id))
  );

  return (
    <div className="flex flex-col h-screen">
      <Navbar />

      {error && (
        <p className="bg-red-100 text-red-600 text-sm p-2 text-center shrink-0">{error}</p>
      )}

      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* Sidebar - full width on mobile, fixed width on larger screens */}
        <div className={`${showSidebar ? 'block' : 'hidden'} sm:block h-full`}>
          <Sidebar
            users={users}
            selectedUser={selectedUser}
            onSelectUser={handleSelectUser}
            onlineUsers={onlineUsers}
            loading={loadingUsers}
          />
        </div>

        {/* Chat window */}
        <div className={`${showSidebar ? 'hidden' : 'flex'} sm:flex flex-1 flex-col min-h-0`}>
          {selectedUser && (
            <button
              onClick={() => setShowSidebar(true)}
              className="sm:hidden p-2 text-indigo-600 text-sm border-b border-gray-200 bg-white text-left shrink-0"
            >
              ← Back to users
            </button>
          )}
          <ChatWindow
            selectedUser={selectedUser}
            messages={filteredMessages}
            currentUserId={user._id}
            onSendMessage={handleSendMessage}
            onTyping={handleTyping}
            onStopTyping={handleStopTyping}
            isTyping={typingUserId === selectedUser?._id}
            loading={loadingMessages}
          />
        </div>
      </div>
    </div>
  );
};

export default Chat;

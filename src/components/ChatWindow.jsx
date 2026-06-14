import { useEffect, useRef, useState } from 'react';
import Message from './Message';
import TypingIndicator from './TypingIndicator';

// Main chat panel: shows messages with the selected user and a message input
const ChatWindow = ({
  selectedUser,
  messages,
  currentUserId,
  onSendMessage,
  onTyping,
  onStopTyping,
  isTyping,
  loading,
}) => {
  const [text, setText] = useState('');
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Auto-scroll to the latest message whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Handle input change - emits "typing" and resets a timer to emit "stopTyping"
  const handleChange = (e) => {
    setText(e.target.value);
    onTyping();

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      onStopTyping();
    }, 1500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSendMessage(text.trim());
    setText('');
    onStopTyping();
  };

  // Placeholder shown before any user is selected
  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400 bg-gray-50">
        Select a user from the sidebar to start chatting
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50 min-h-0">
      {/* Chat header */}
      <div className="p-3 border-b border-gray-200 bg-white flex items-center gap-3 shrink-0">
        <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center font-semibold">
          {selectedUser.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-semibold text-gray-800">{selectedUser.name}</p>
          <p className="text-xs text-gray-500">{selectedUser.email}</p>
        </div>
      </div>

      {/* Messages list */}
      <div className="flex-1 overflow-y-auto p-4 min-h-0">
        {loading ? (
          <div className="text-center text-gray-400 text-sm mt-4">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-400 text-sm mt-4">No messages yet. Say hi!</div>
        ) : (
          messages.map((msg) => (
            <Message key={msg._id} message={msg} isOwn={msg.senderId === currentUserId} />
          ))
        )}
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-gray-200 bg-white flex gap-2 shrink-0">
        <input
          type="text"
          value={text}
          onChange={handleChange}
          placeholder="Type a message..."
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full text-sm transition disabled:opacity-50"
          disabled={!text.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;

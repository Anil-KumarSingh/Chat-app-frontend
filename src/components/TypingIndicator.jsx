// Animated "..." bubble shown when the other user is typing
const TypingIndicator = () => {
  return (
    <div className="flex justify-start mb-2">
      <div className="bg-white px-3 py-2 rounded-lg shadow flex gap-1 items-center rounded-bl-none">
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
      </div>
    </div>
  );
};

export default TypingIndicator;

// A single chat message bubble - styled differently for sent vs received messages
const Message = ({ message, isOwn }) => {
  const time = new Date(message.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={`flex mb-2 ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[75%] sm:max-w-xs px-3 py-2 rounded-lg text-sm shadow ${
          isOwn
            ? 'bg-indigo-600 text-white rounded-br-none'
            : 'bg-white text-gray-800 rounded-bl-none'
        }`}
      >
        <p className="break-words whitespace-pre-wrap">{message.message}</p>
        <span className={`block text-[10px] mt-1 text-right ${isOwn ? 'text-indigo-200' : 'text-gray-400'}`}>
          {time}
        </span>
      </div>
    </div>
  );
};

export default Message;

// Sidebar listing all registered users with their online/offline status
const Sidebar = ({ users, selectedUser, onSelectUser, onlineUsers, loading }) => {
  return (
    <div className="w-full sm:w-64 bg-white border-r border-gray-200 h-full overflow-y-auto shrink-0">
      <div className="p-3 border-b border-gray-200">
        <h2 className="text-gray-700 font-semibold">Users</h2>
      </div>

      {loading ? (
        <div className="p-4 text-center text-gray-400 text-sm">Loading users...</div>
      ) : users.length === 0 ? (
        <div className="p-4 text-center text-gray-400 text-sm">No other users yet</div>
      ) : (
        users.map((u) => (
          <div
            key={u._id}
            onClick={() => onSelectUser(u)}
            className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-indigo-50 transition border-b border-gray-100 ${
              selectedUser?._id === u._id ? 'bg-indigo-100' : ''
            }`}
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center font-semibold">
                {u.name.charAt(0).toUpperCase()}
              </div>
              {/* Green/gray dot indicating online status */}
              <span
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                  onlineUsers.includes(u._id) ? 'bg-green-500' : 'bg-gray-400'
                }`}
              ></span>
            </div>
            <div className="overflow-hidden">
              <p className="font-medium text-gray-800 truncate">{u.name}</p>
              <p className="text-xs text-gray-500">
                {onlineUsers.includes(u._id) ? 'Online' : 'Offline'}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Sidebar;

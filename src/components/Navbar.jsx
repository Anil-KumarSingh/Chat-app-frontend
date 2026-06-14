import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { disconnectSocket } from '../services/socket';

// Top navigation bar shown on the chat page
const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    disconnectSocket();
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-indigo-600 text-white px-4 py-3 flex justify-between items-center shadow-md shrink-0">
      <h1 className="text-lg font-bold">Real-Time Chat</h1>
      {user && (
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-sm">Hi, {user.name}</span>
          <button
            onClick={handleLogout}
            className="bg-indigo-800 hover:bg-indigo-900 text-sm px-3 py-1 rounded transition"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

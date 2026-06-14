import { createContext, useState, useEffect, useContext } from 'react';

// Context to hold authentication state across the whole app
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On first load, check localStorage for a saved session
  useEffect(() => {
    const storedUser = localStorage.getItem('chatUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        localStorage.removeItem('chatUser');
      }
    }
    setLoading(false);
  }, []);

  // Save user data (including JWT token) after login/register
  const login = (userData) => {
    localStorage.setItem('chatUser', JSON.stringify(userData));
    setUser(userData);
  };

  // Clear user session
  const logout = () => {
    localStorage.removeItem('chatUser');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy access to auth context
export const useAuth = () => useContext(AuthContext);

import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('fc_token'));
  const [loading, setLoading] = useState(true);

  // axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'https://famconnect.onrender.com';
  if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  useEffect(() => {
    if (token) {
      axios.get('/api/auth/me')
        .then(res => setUser(res.data.user))
        .catch(() => logout())
        .finally(() => setLoading(false));
    } else { setLoading(false); }
  }, [token]);

  const login = async (email, password) => {
    const res = await axios.post('/api/auth/login', { email, password });
    const { token: t, user: u } = res.data;
    localStorage.setItem('fc_token', t);
    setToken(t);
    setUser(u);
    axios.defaults.headers.common['Authorization'] = `Bearer ${t}`;
    return u;
  };

  const register = async (data) => {
    const res = await axios.post('/api/auth/register', data);
    const { token: t, user: u } = res.data;
    localStorage.setItem('fc_token', t);
    setToken(t);
    setUser(u);
    axios.defaults.headers.common['Authorization'] = `Bearer ${t}`;
    return u;
  };

  const logout = () => {
    localStorage.removeItem('fc_token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  const updateUser = (newData) => setUser(prev => ({ ...prev, ...newData }));

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

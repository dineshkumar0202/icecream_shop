import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    const userBranch = localStorage.getItem('userBranch');
    const username = localStorage.getItem('username');
    return token ? { token, role: userRole, branch: userBranch, username } : null;
  });

  const login = (token, role, branch, username) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userRole', role);
    localStorage.setItem('userBranch', branch);
    localStorage.setItem('username', username);
    setUser({ token, role, branch, username });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userBranch');
    localStorage.removeItem('username');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

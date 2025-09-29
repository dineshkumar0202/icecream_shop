import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { user } = useAuth();
  const role = user?.role || 'guest';

  return (
    <div className="sidebar">
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/branches">Branches</Link></li>
          <li><Link to="/ingredients">Ingredients</Link></li>
          {role === 'admin' && <li><Link to="/sales">Sales</Link></li>}
          {role === 'admin' && <li><Link to="/admin">Admin Panel</Link></li>}
        </ul>
      </nav>
    </div>
  );
}

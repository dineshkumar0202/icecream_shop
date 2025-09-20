import React from 'react';
import { useAuth } from '../context/AuthContext';
import AdminHome from '../pages/AdminHome';
import UserHome from '../pages/UserHome';

export default function HomeRouter() {
  const { user } = useAuth();

  if (user?.role === 'admin') {
    return <AdminHome />;
  }

  return <UserHome />;
}

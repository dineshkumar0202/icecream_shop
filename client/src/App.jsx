import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth, AuthProvider } from "./context/AuthContext"; // fixed import
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminHome from "./pages/AdminHome";
import UserHome from "./pages/UserHome";
import Dashboard from "./pages/Dashboard"; // keep only one Dashboard
import Branches from "./pages/Branches";
import Sales from "./pages/Sales";
import Ingredients from "./pages/Ingredients";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import UserBranches from "./pages/UserBranches";

function AppContent() {
  const { user } = useAuth();

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {user && <Navbar />}
      <div className="flex-1 overflow-hidden">
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                {user?.role === "admin" ? <AdminHome /> : <UserHome />}
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/branches"
            element={
              <ProtectedRoute>
                <Branches />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sales"
            element={
              <ProtectedRoute>
                <Sales />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ingredients"
            element={
              <ProtectedRoute>
                <Ingredients />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user-branches"
            element={
              <ProtectedRoute>
                <UserBranches />
              </ProtectedRoute>
            }
          />

          <Route
            path="/login"
            element={user ? <Navigate to="/" replace /> : <Login />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}

// ✅ Wrap everything with AuthProvider
export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

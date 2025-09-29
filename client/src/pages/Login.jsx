import React, { useState } from "react";
import { login as apiLogin, register as apiRegister } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ 
    username: "", 
    password: "", 
    branch: "",
    confirmPassword: "" 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        console.log("Attempting login with:", form);
        const res = await apiLogin(form);
        console.log("Login response:", res);
        login(res.token, res.role, res.branch, res.username);
        nav("/");
      } else {
        if (form.password !== form.confirmPassword) {
          setError("Passwords do not match");
          return;
        }
        console.log("Attempting registration with:", form);
        const res = await apiRegister(form);
        console.log("Registration response:", res);
        login(res.token, res.role, res.branch, res.username);
        nav("/");
      }
    } catch (e) {
      console.error("Auth error:", e);
      setError(e.response?.data?.message || (isLogin ? "Login failed" : "Registration failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-pink-100 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-10 left-10 text-6xl opacity-10 animate-float">🍦</div>
      <div className="absolute top-32 right-20 text-4xl opacity-15 animate-wave">🍨</div>
      <div className="absolute bottom-40 left-20 text-5xl opacity-12 animate-float">🧁</div>
      <div className="absolute bottom-20 right-10 text-3xl opacity-10 animate-wave">🍰</div>
      
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 w-full max-w-md relative z-10 animate-fadeIn">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 animate-bounce">🍦</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isLogin ? 'Welcome Back!' : 'Join Our Family!'}
          </h1>
          <p className="text-gray-600">
            {isLogin 
              ? 'Sign in to manage your ice cream business' 
              : 'Create your account to get started'
            }
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              placeholder="Enter your username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all duration-300 text-black"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all duration-300 text-black"
              required
              minLength={8}
            />
          </div>

          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="Confirm your password"
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all duration-300 text-black"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Branch Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your branch name"
                  value={form.branch}
                  onChange={(e) => setForm({ ...form, branch: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all duration-300 text-black"
                  required
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                {isLogin ? 'Signing In...' : 'Creating Account...'}
              </div>
            ) : (
              isLogin ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setForm({ username: "", password: "", branch: "", confirmPassword: "" });
              setError("");
            }}
            className="text-rose-600 hover:text-rose-700 font-medium transition-colors duration-300"
          >
            {isLogin 
              ? "Don't have an account? Sign up" 
              : "Already have an account? Sign in"
            }
          </button>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Admin access: Contact system administrator</p>
        </div>
      </div>
    </div>
  );
}

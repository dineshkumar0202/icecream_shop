import React, { useEffect, useState } from 'react';
import { getBranches, createBranch, updateBranch, deleteBranch } from '../services/branchService';
import { useAuth } from '../context/AuthContext';

export default function Branches() {
  const { user } = useAuth();
  const [branches, setBranches] = useState([]);
  const [form, setForm] = useState({ name: '', city: '', area: '' });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      setLoading(true);
      const data = await getBranches();
      setBranches(data);
    } catch (error) {
      console.error('Error fetching branches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.city || !form.area) return;

    try {
      setLoading(true);
      if (editingId) {
        await updateBranch(editingId, form);
        setEditingId(null);
      } else {
        await createBranch(form);
      }
      setForm({ name: '', city: '', area: '' });
      setShowForm(false);
      await fetchBranches();
    } catch (error) {
      console.error('Error saving branch:', error);
      alert('Error saving branch');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (branch) => {
    setForm({ name: branch.name, city: branch.city, area: branch.area });
    setEditingId(branch._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this branch?')) return;

    try {
      setLoading(true);
      await deleteBranch(id);
      await fetchBranches();
    } catch (error) {
      console.error('Error deleting branch:', error);
      alert('Error deleting branch');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setForm({ name: '', city: '', area: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const filteredBranches = user?.role === 'branch' 
    ? branches.filter(branch => branch.name === user.branch)
    : branches;

  return (
    <div className="h-full bg-gradient-to-br from-rose-50 to-pink-100 relative overflow-y-auto">
      {/* Background Decorations */}
      <div className="absolute top-10 left-10 text-6xl opacity-10 animate-float">🏪</div>
      <div className="absolute top-32 right-20 text-4xl opacity-15 animate-wave">🍦</div>
      <div className="absolute bottom-40 left-20 text-5xl opacity-12 animate-float">🏢</div>
      <div className="absolute bottom-20 right-10 text-3xl opacity-10 animate-wave">🏬</div>
      
      <div className="container mx-auto px-6 py-8 relative z-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 flex items-center animate-fadeIn">
              Branch Management <span className="text-4xl animate-bounce ml-2">🏪</span>
            </h1>
            <p className="text-gray-600 mt-2 animate-fadeIn delay-200">
              {user?.role === 'admin' 
                ? 'Manage all branches across the network' 
                : `Viewing branch: ${user?.branch || 'your branch'}`
              }
            </p>
          </div>
          {user?.role === 'admin' && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg animate-bounceIn"
            >
              {showForm ? 'Cancel' : '+ Add Branch'}
            </button>
          )}
        </div>

        {/* Add/Edit Form - Admin Only */}
        {showForm && user?.role === 'admin' && (
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-8 animate-fadeIn">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              {editingId ? 'Edit Branch' : 'Add New Branch'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Branch Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter branch name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-black"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    placeholder="Enter city"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-black"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Area
                  </label>
                  <input
                    type="text"
                    placeholder="Enter area"
                    value={form.area}
                    onChange={(e) => setForm({ ...form, area: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-black"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : (editingId ? 'Update Branch' : 'Add Branch')}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Branches List */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900">
              {user?.role === 'admin' ? 'All Branches' : 'Your Branch'}
            </h3>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredBranches.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏪</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Branches Found</h3>
              <p className="text-gray-600">
                {user?.role === 'admin' ? 'Add your first branch to get started!' : 'No branch information available.'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredBranches.map((branch, index) => (
                <div
                  key={branch._id}
                  className="px-6 py-4 hover:bg-gray-50 transition-all duration-300 transform hover:scale-[1.02]"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {branch.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{branch.name}</h4>
                        <p className="text-gray-600">{branch.city} - {branch.area}</p>
                      </div>
                    </div>
                    {user?.role === 'admin' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(branch)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(branch._id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

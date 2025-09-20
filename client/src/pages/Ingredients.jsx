import React, { useEffect, useState } from "react";
import {
  requestIngredient,
  getRequests,
  updateRequest,
  updateRequestStatus,
  deleteRequest,
} from "../services/ingredientService";
import { getBranches } from "../services/branchService";
import { useAuth } from "../context/AuthContext";

export default function Ingredients() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [branches, setBranches] = useState([]);
  const [form, setForm] = useState({
    branch: "",
    city: "",
    flavor: "",
    ingredient: "",
    qty: 0,
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const flavors = [
    "Vanilla",
    "Chocolate",
    "Strawberry",
    "Mint",
    "Cookies & Cream",
    "Rocky Road",
    "Neapolitan",
    "Pistachio",
    "Mango",
    "Coconut",
  ];

  const ingredients = [
    "Milk",
    "Cream",
    "Sugar",
    "Vanilla Extract",
    "Cocoa Powder",
    "Strawberry Puree",
    "Mint Leaves",
    "Cookie Pieces",
    "Nuts",
    "Chocolate Chips",
    "Food Coloring",
    "Stabilizers",
    "Eggs",
  ];

  useEffect(() => {
    fetchRequests();
    fetchBranches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await getRequests();
      setRequests(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching ingredient requests:", error);
      alert(
        "Error fetching ingredient requests: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchBranches = async () => {
    try {
      const data = await getBranches();
      setBranches(Array.isArray(data) ? data : []);

      // Set default branch for branch users
      if (user?.role === "branch" && user?.branch) {
        setForm((prev) => ({ ...prev, branch: user.branch }));
      }
    } catch (error) {
      console.error("Error fetching branches:", error);
    }
  };

  
  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!form.branch || !form.city || !form.flavor || !form.ingredient || !form.qty) {
    alert("Please fill in all fields");
    return;
  }

  try {
    setLoading(true);
    const requestData = {
      ...form,
      requestedBy: user?.username || "Unknown",  // 👈 Save requester
      date: new Date().toISOString(),           // 👈 Save timestamp
      status: "pending",                        // 👈 Always pending at first
    };

    if (editingId) {
      await updateRequest(editingId, requestData);
      setEditingId(null);
    } else {
      await requestIngredient(requestData);
    }

    setForm({
      branch: user?.role === "branch" ? user.branch : "",
      city: "",
      flavor: "",
      ingredient: "",
      qty: 0,
    });
    setShowForm(false);
    await fetchRequests();
  } catch (error) {
    console.error("Error saving ingredient request:", error);
    alert("Error saving ingredient request: " + (error.response?.data?.message || error.message));
  } finally {
    setLoading(false);
  }
};


  const handleStatusUpdate = async (id, status) => {
    try {
      setLoading(true);
      await updateRequestStatus(id, status);
      await fetchRequests();
    } catch (error) {
      console.error("Error updating status:", error);
      alert(
        "Error updating status: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (request) => {
    setForm({
      branch: request.branch,
      city: request.city,
      flavor: request.flavor,
      ingredient: request.ingredient,
      qty: request.qty,
    });
    setEditingId(request._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this request?"))
      return;

    try {
      setLoading(true);
      await deleteRequest(id);
      await fetchRequests();
    } catch (error) {
      console.error("Error deleting request:", error);
      alert(
        "Error deleting request: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setForm({
      branch: user?.role === "branch" ? user.branch : "",
      city: "",
      flavor: "",
      ingredient: "",
      qty: 0,
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleAddRequest = () => {
    setForm({
      branch: user?.role === "branch" ? user.branch : "",
      city: "",
      flavor: "",
      ingredient: "",
      qty: 1,
    });
    setEditingId(null);
    setShowForm(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return "✅";
      case "rejected":
        return "❌";
      default:
        return "⏳";
    }
  };

  return (
    <div className="h-full bg-gradient-to-br from-orange-50 to-amber-100 relative overflow-y-auto">
      <div className="absolute top-10 left-10 text-6xl opacity-10 animate-float">
        🧊
      </div>
      <div className="absolute top-32 right-20 text-4xl opacity-15 animate-wave">
        🍦
      </div>
      <div className="absolute bottom-40 left-20 text-5xl opacity-12 animate-float">
        🥛
      </div>
      <div className="absolute bottom-20 right-10 text-3xl opacity-10 animate-wave">
        🍓
      </div>

      <div className="container mx-auto px-6 py-8 relative z-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 flex items-center animate-fadeIn">
              Ingredient Requests{" "}
              <span className="text-4xl animate-bounce ml-2">🧊</span>
            </h1>
            <p className="text-gray-600 mt-2 animate-fadeIn delay-200">
              {user?.role === "admin"
                ? "Manage all ingredient requests across branches"
                : "Request ingredients for your branch"}
            </p>
          </div>

          {user?.role !== "admin" && (
            <button
              onClick={handleAddRequest}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg animate-bounceIn"
            >
              {showForm ? "Cancel" : "+ New Request"}
            </button>
          )}
        </div>

        {showForm && user?.role !== "admin" && (
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-8 animate-fadeIn">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              {editingId ? "Edit Request" : "New Ingredient Request"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Branch
                  </label>
                  <select
                    value={form.branch}
                    onChange={(e) =>
                      setForm({ ...form, branch: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                    required
                    disabled={user?.role === "branch"}
                  >
                    <option value="">Select Branch</option>
                    {branches.map((branch) => (
                      <option key={branch._id} value={branch.name}>
                        {branch.name}
                      </option>
                    ))}
                  </select>
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Flavor
                  </label>
                  <select
                    value={form.flavor}
                    onChange={(e) =>
                      setForm({ ...form, flavor: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                    required
                  >
                    <option value="">Select Flavor</option>
                    {flavors.map((flavor) => (
                      <option key={flavor} value={flavor}>
                        {flavor}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ingredient
                  </label>
                  <select
                    value={form.ingredient}
                    onChange={(e) =>
                      setForm({ ...form, ingredient: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                    required
                  >
                    <option value="">Select Ingredient</option>
                    {ingredients.map((ingredient) => (
                      <option key={ingredient} value={ingredient}>
                        {ingredient}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity (kg/liters)
                </label>
                <input
                  type="number"
                  min="1"
                  placeholder="Enter quantity"
                  value={form.qty}
                  onChange={(e) =>
                    setForm({ ...form, qty: parseInt(e.target.value) || 1 })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                  required
                />
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
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
                >
                  {loading
                    ? "Saving..."
                    : editingId
                    ? "Update Request"
                    : "Submit Request"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">
                  Total Requests
                </p>
                <p className="text-3xl font-bold">{requests.length}</p>
              </div>
              <div className="text-4xl opacity-80">📋</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm font-medium">Pending</p>
                <p className="text-3xl font-bold">
                  {requests.filter((r) => r.status === "pending").length}
                </p>
              </div>
              <div className="text-4xl opacity-80">⏳</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Approved</p>
                <p className="text-3xl font-bold">
                  {requests.filter((r) => r.status === "approved").length}
                </p>
              </div>
              <div className="text-4xl opacity-80">✅</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm font-medium">Rejected</p>
                <p className="text-3xl font-bold">
                  {requests.filter((r) => r.status === "rejected").length}
                </p>
              </div>
              <div className="text-4xl opacity-80">❌</div>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900">
              {user?.role === "admin"
                ? "All Ingredient Requests"
                : "Your Requests"}
            </h3>
          </div>

          <div className="divide-y divide-gray-200">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
              </div>
            ) : requests.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🧊</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Requests Found
                </h3>
                <p className="text-gray-600">
                  {user?.role === "admin"
                    ? "No ingredient requests have been made yet."
                    : "Create your first ingredient request!"}
                </p>
              </div>
            ) : (
              requests.map((request, index) => (
                <div
                  key={request._id}
                  className="px-6 py-4 hover:bg-gray-50 transition-all duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {(request.ingredient
                          ? request.ingredient.charAt(0)
                          : "?"
                        ).toUpperCase()}
                      </div>

                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">
                          {request.ingredient} for {request.flavor}
                        </h4>
                        <p className="text-gray-600">
                          {request.branch} - {request.city} • Qty: {request.qty}{" "}
                          kg/L
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                          <span>Requested by: {request.requestedBy}</span>
                          <span>•</span>
                          <span>
                            {new Date(request.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          request.status
                        )}`}
                      >
                        {getStatusIcon(request.status)}{" "}
                        {request.status.charAt(0).toUpperCase() +
                          request.status.slice(1)}
                      </span>

                      <div className="flex space-x-2">
                        {user?.role === "admin" &&
                          request.status === "pending" && (
                            <>
                              <button
                                onClick={() =>
                                  handleStatusUpdate(request._id, "approved")
                                }
                                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm font-medium transition-all duration-300 transform hover:scale-105"
                                disabled={loading}
                              >
                                ✅ Approve
                              </button>
                              <button
                                onClick={() =>
                                  handleStatusUpdate(request._id, "rejected")
                                }
                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-medium transition-all duration-300 transform hover:scale-105"
                                disabled={loading}
                              >
                                ❌ Reject
                              </button>
                            </>
                          )}

                        {user?.role !== "admin" &&
                          request.status === "pending" && (
                            <button
                              onClick={() => handleEdit(request)}
                              className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm font-medium transition-all duration-300 transform hover:scale-105"
                            >
                              ✏️ Edit
                            </button>
                          )}

                        {((user?.role !== "admin" &&
                          request.status === "pending") ||
                          user?.role === "admin") && (
                          <button
                            onClick={() => handleDelete(request._id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-medium transition-all duration-300 transform hover:scale-105"
                          >
                            🗑️ Delete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

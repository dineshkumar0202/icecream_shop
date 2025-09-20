import React, { useEffect, useState } from "react";
import { getSales, addSale, deleteSale, updateSale } from "../services/salesService";
import { useAuth } from "../context/AuthContext";
import { getBranches } from "../services/branchService";

export default function Sales() {
  const { user } = useAuth();
  const [sales, setSales] = useState([]);
  const [branches, setBranches] = useState([]);
  const [form, setForm] = useState({
    branch: user?.branch || "",
    city: "",
    flavor: "",
    units: 0,
    amount: 0,
  });
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingSale, setEditingSale] = useState(null); // track editing

  useEffect(() => {
    fetchSales();
    if (user?.role === "admin") {
      getBranches().then(setBranches);
    }
  }, []);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const data = await getSales();
      setSales(data);
    } catch (error) {
      console.error("Error fetching sales:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.branch || !form.city || !form.flavor || !form.units || !form.amount) return;

    try {
      setLoading(true);
      if (editingSale) {
        await updateSale(editingSale._id, form);
        setEditingSale(null);
      } else {
        await addSale(form);
      }
      setForm({
        branch: user?.branch || "",
        city: "",
        flavor: "",
        units: 0,
        amount: 0,
      });
      setShowForm(false);
      await fetchSales();
    } catch (error) {
      console.error("Error saving sale:", error);
      alert("Error saving sale");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this sale?")) return;
    try {
      setLoading(true);
      await deleteSale(id);
      await fetchSales();
    } catch (error) {
      console.error("Error deleting sale:", error);
      alert("Error deleting sale");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (sale) => {
    setForm({
      branch: typeof sale.branch === "object" ? sale.branch._id : sale.branch,
      city: sale.city,
      flavor: sale.flavor,
      units: sale.units,
      amount: sale.amount,
    });
    setEditingSale(sale);
    setShowForm(true);
  };

  const filteredSales =
    user?.role === "branch"
      ? sales.filter((sale) => {
          const saleBranchId = typeof sale.branch === "object" ? sale.branch._id : sale.branch;
          return saleBranchId === user.branch;
        })
      : sales;

  return (
    <div className="h-full bg-gradient-to-br from-rose-50 to-pink-100 relative overflow-y-auto">
      <div className="container mx-auto px-6 py-8 relative z-10">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 flex items-center">
              Sales Management <span className="text-4xl animate-bounce ml-2">🍦</span>
            </h1>
            <p className="text-gray-600 mt-2">
              {user?.role === "admin"
                ? "View and manage all sales across branches"
                : `Track sales for ${user?.username || "your account"}`}
            </p>
          </div>
          {user?.role === "admin" && (
            <button
              onClick={() => {
                setShowForm(!showForm);
                setEditingSale(null);
                setForm({
                  branch: user?.branch || "",
                  city: "",
                  flavor: "",
                  units: 0,
                  amount: 0,
                });
              }}
              className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              {showForm ? "Cancel" : "+ Add Sale"}
            </button>
          )}
        </div>

        {/* Add/Edit Sale Form */}
        {showForm && user?.role === "admin" && (
          <div className="bg-white rounded-xl shadow-lg p-6 animate-fadeIn mt-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              {editingSale ? "Edit Sale" : "Add New Sale"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Branch / City / Flavor / Units / Amount */}
              {/* ... keep same form fields as before ... */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingSale(null);
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
                >
                  {loading ? "Saving..." : editingSale ? "Update Sale" : "Add Sale"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Sales List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mt-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900">
              {user?.role === "admin" ? "All Sales" : "Your Sales"}
            </h3>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
          ) : filteredSales.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">💰</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Sales Found</h3>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredSales.map((sale) => (
                <div
                  key={sale._id}
                  className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-all"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {sale.flavor.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">
                        {sale.flavor} - {sale.units} units
                      </h4>
                      <p className="text-gray-600">
                        {typeof sale.branch === "object"
                          ? sale.branch.name
                          : branches.find((b) => b._id === sale.branch)?.name || "Unknown Branch"}
                        - {sale.city} • {new Date(sale.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {user?.role === "admin" && (
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleEdit(sale)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(sale._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

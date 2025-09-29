import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getSales } from "../services/salesService";
import { getRequests } from "../services/ingredientService";

export default function UserHome() {
  const { user } = useAuth();
  const [sales, setSales] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const [salesData, requestsData] = await Promise.all([
        getSales().catch(() => []),
        getRequests().catch(() => [])
      ]);

      const userSales = salesData.filter(sale => sale.branch === user?.branch);
      const userRequests = requestsData.filter(req => req.branch === user?.branch);

      setSales(userSales);
      setRequests(userRequests);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setSales([]);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const totalIngredients = requests.length;
  const approvedIngredients = requests.filter(req => req.status === "approved").length;
  const rejectedIngredients = requests.filter(req => req.status === "rejected").length;

  return (
    <div className="w-full h-full min-h-screen flex flex-col items-center justify-start 
      bg-gradient-to-br from-rose-50 to-pink-100 animate-fadeIn relative overflow-hidden p-8">

      {/* Background Floating Emojis */}
      <div className="absolute top-10 left-10 text-6xl opacity-20 animate-bounce">🍦</div>
      <div className="absolute top-32 right-20 text-5xl opacity-15 animate-pulse">🍨</div>
      <div className="absolute bottom-40 left-20 text-6xl opacity-20 animate-spin-slow">🧁</div>
      <div className="absolute bottom-20 right-10 text-4xl opacity-15 animate-float">🍰</div>

      {/* Hero Section */}
      <div className="text-center max-w-4xl mx-auto relative z-10 flex flex-col items-center">
        <h1 className="text-6xl font-extrabold text-rose-800 mb-6 animate-fadeIn drop-shadow-lg">
          🍦 Welcome to Our Ice Cream Shop! 🍦
        </h1>
        <p className="text-xl text-rose-700 mb-8 animate-fadeIn delay-200">
          Discover the best ice cream flavors and franchising opportunities with our company. 
          Experience premium quality and exceptional taste at every branch.
        </p>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12 w-full animate-fadeIn delay-400">
          <div className="bg-white rounded-xl p-6 shadow-lg transform hover:scale-105 transition duration-300">
            <div className="text-3xl font-bold text-rose-800 animate-pulse">
              {totalIngredients}
            </div>
            <div className="text-sm text-rose-600">Total Ingredients</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg transform hover:scale-105 transition duration-300">
            <div className="text-3xl font-bold text-rose-800 animate-bounce">
              {approvedIngredients}
            </div>
            <div className="text-sm text-rose-600">Approved Ingredients ✅</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg transform hover:scale-105 transition duration-300">
            <div className="text-3xl font-bold text-rose-800 animate-pulse">
              {rejectedIngredients}
            </div>
            <div className="text-sm text-rose-600">Rejected Ingredients ❌</div>
          </div>
        </div>
      </div>

      {/* Ingredient Requests Table */}
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-lg p-6 relative z-10 animate-fadeIn delay-500">
        <h2 className="text-2xl font-bold text-rose-800 mb-4">📋 Ingredient Requests</h2>
        {requests.length === 0 ? (
          <p className="text-rose-600 italic">No ingredient requests found for your branch.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-rose-100 text-rose-800">
                  <th className="p-3 text-left">Ingredient</th>
                  <th className="p-3 text-left">Quantity</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Request Date</th>
                  <th className="p-3 text-left">Approved Date</th>
                  <th className="p-3 text-left">Rejected Date</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req, idx) => (
                  <tr
                    key={req._id || idx}
                    className="border-b hover:bg-rose-50 transition duration-200"
                  >
                    <td className="p-3 font-medium">{req.name}</td>
                    <td className="p-3">{req.quantity}</td>
                    <td
                      className={`p-3 font-semibold ${
                        req.status === "approved"
                          ? "text-green-600"
                          : req.status === "rejected"
                          ? "text-red-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {req.status}
                    </td>
                    <td className="p-3 text-sm text-gray-500">
                      {req.createdAt ? new Date(req.createdAt).toLocaleString() : "-"}
                    </td>
                    <td className="p-3 text-sm text-green-600">
                      {req.approvedAt ? new Date(req.approvedAt).toLocaleString() : "-"}
                    </td>
                    <td className="p-3 text-sm text-red-600">
                      {req.rejectedAt ? new Date(req.rejectedAt).toLocaleString() : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Call to Action Button */}
      <div className="mt-10 relative z-10">
        <button className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white px-10 py-5 rounded-2xl text-xl font-semibold transition-all duration-500 transform hover:scale-110 shadow-xl animate-pulse">
          🍧 Join Now
        </button>
      </div>
    </div>
  );
}
  
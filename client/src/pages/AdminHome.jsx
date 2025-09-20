import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getTotals, getTopFlavors } from "../services/dashboardService";
import { getBranches } from "../services/branchService";
import { getSales } from "../services/salesService";
import { getRequests } from "../services/ingredientService";
import Chart from "../components/Chart";

export default function AdminHome() {
  const { user } = useAuth();
  const [totals, setTotals] = useState({
    totalOutlets: 0,
    totalSales: { totalUnits: 0, totalAmount: 0 },
  });
  const [top, setTop] = useState([]);
  const [branches, setBranches] = useState([]);
  const [recentSales, setRecentSales] = useState([]);
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [totalsData, topFlavors, branchesData, salesData, requestsData] =
        await Promise.all([
          getTotals(),
          getTopFlavors(),
          getBranches(),
          getSales(),
          getRequests(),
        ]);

      setTotals(totalsData);
      setTop(
        topFlavors.slice(0, 10).map((x) => ({
          name: x._id.city + " - " + x._id.flavor,
          value: x.units,
        }))
      );
      setBranches(branchesData);
      setRecentSales(salesData.slice(0, 5));
      setRecentRequests(requestsData.slice(0, 5));
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-6 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="text-6xl animate-bounce delay-100">🍦</div>
        </div>
        <h1 className="text-4xl font-bold gradient-text mb-2 animate-slideIn delay-200">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg animate-fadeIn delay-300">
          Manage your ice cream franchise operations
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-rose-500 to-rose-600 p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition-all duration-300 animate-bounceIn delay-400">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-rose-100 text-sm font-medium">Total Outlets</p>
              <p className="text-3xl font-bold">{totals.totalOutlets}</p>
            </div>
            <div className="text-4xl opacity-80">🏪</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-pink-500 to-pink-600 p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition-all duration-300 animate-bounceIn delay-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-pink-100 text-sm font-medium">
                Total Units Sold
              </p>
              <p className="text-3xl font-bold">
                {totals.totalSales.totalUnits}
              </p>
            </div>
            <div className="text-4xl opacity-80">📦</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-rose-600 to-rose-700 p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition-all duration-300 animate-bounceIn delay-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-rose-100 text-sm font-medium">Total Revenue</p>
              <p className="text-3xl font-bold">
                ₹{totals.totalSales.totalAmount.toLocaleString()}
              </p>
            </div>
            <div className="text-4xl opacity-80">💰</div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 animate-fadeIn delay-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            Top Flavors Across Cities
          </h3>
          <div className="text-2xl">🍦</div>
        </div>
        <div className="h-96">
          <Chart data={top} />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 animate-fadeIn delay-800">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
          Quick Actions <span className="text-2xl animate-bounce ml-2">🍦</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-rose-500 hover:bg-rose-600 text-white p-4 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg animate-bounceIn delay-900">
            <div className="text-2xl mb-2">🏪</div>
            <div>Manage Branches</div>
          </button>
          <button className="bg-pink-500 hover:bg-pink-600 text-white p-4 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg animate-bounceIn delay-1000">
            <div className="text-2xl mb-2">💰</div>
            <div>View Sales</div>
          </button>
          <button className="bg-rose-600 hover:bg-rose-700 text-white p-4 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg animate-bounceIn delay-1100">
            <div className="text-2xl mb-2">🥛</div>
            <div>Manage Ingredients</div>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Sales */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 animate-fadeIn delay-1200">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            Recent Sales <span className="text-xl animate-bounce ml-2">💰</span>
          </h3>
          <div className="space-y-3">
            {recentSales.map((sale, index) => (
              <div
                key={sale._id || index}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {(sale?.flavor ? sale.flavor.charAt(0) : "?").toUpperCase()}
                  </div>

                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">
                      {sale.flavor || "Unknown Flavor"}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {sale.branch || "No Branch"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600 dark:text-green-400 text-sm">
                    ₹{sale.amount}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {sale.units} units
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Requests */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 animate-fadeIn delay-1300">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            Recent Requests{" "}
            <span className="text-xl animate-bounce ml-2">🥛</span>
          </h3>
          <div className="space-y-3">
            {recentRequests.map((request, index) => (
              <div
                key={request._id || index}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {(request?.ingredient
                      ? request.ingredient.charAt(0)
                      : "?"
                    ).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">
                      {request?.ingredient || "Unknown"}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {request?.branch || "No Branch"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      request?.status === "approved"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : request?.status === "rejected"
                        ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                    }`}
                  >
                    {request?.status || "pending"}
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {request?.qty || 0} units
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

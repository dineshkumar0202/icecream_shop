import React, { useEffect, useState } from "react";
import { getTotals, getTopFlavors } from "../services/dashboardService";
import { getSales } from "../services/salesService";
import { getRequests } from "../services/ingredientService";
import { useAuth } from "../context/AuthContext";
import Chart from "../components/Chart";

export default function Dashboard() {
  const { user } = useAuth();
  const [totals, setTotals] = useState({
    totalOutlets: 0,
    totalSales: { totalUnits: 0, totalAmount: 0 },
  });
  const [top, setTop] = useState([]);
  const [userSales, setUserSales] = useState([]);
  const [userRequests, setUserRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      if (user?.role === 'admin') {
        // Admin dashboard - show all data
        const [totalsData, topFlavors] = await Promise.all([
          getTotals().catch(() => ({ totalOutlets: 0, totalSales: { totalUnits: 0, totalAmount: 0 } })),
          getTopFlavors().catch(() => [])
        ]);
        
        setTotals(totalsData);
        setTop(
          topFlavors
            .slice(0, 10)
            .map((x) => ({
              name: x._id.city + " - " + x._id.flavor,
              value: x.units,
            }))
        );
      } else {
        // User dashboard - show only user's data
        const [salesData, requestsData] = await Promise.all([
          getSales().catch(() => []),
          getRequests().catch(() => [])
        ]);
        
        const userSalesData = salesData.filter(sale => sale.branch === user?.branch);
        const userRequestsData = requestsData.filter(req => req.branch === user?.branch);
        
        setUserSales(userSalesData);
        setUserRequests(userRequestsData);
        
        // Calculate user totals
        const userTotalAmount = userSalesData.reduce((sum, sale) => sum + sale.amount, 0);
        const userTotalUnits = userSalesData.reduce((sum, sale) => sum + sale.units, 0);
        
        setTotals({
          totalOutlets: 1,
          totalSales: { totalUnits: userTotalUnits, totalAmount: userTotalAmount }
        });
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
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

  if (user?.role === 'admin') {
    return (
      <div className="h-full overflow-y-auto p-6 space-y-8 animate-fadeIn">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="text-6xl animate-bounce delay-100">📊</div>
          </div>
          <h1 className="text-4xl font-bold gradient-text mb-2 animate-slideIn delay-200">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg animate-fadeIn delay-300">
            Complete overview of your ice cream franchise operations
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
                <p className="text-pink-100 text-sm font-medium">Total Units Sold</p>
                <p className="text-3xl font-bold">{totals.totalSales.totalUnits}</p>
              </div>
              <div className="text-4xl opacity-80">📦</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-rose-600 to-rose-700 p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition-all duration-300 animate-bounceIn delay-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-rose-100 text-sm font-medium">Total Revenue</p>
                <p className="text-3xl font-bold">₹{totals.totalSales.totalAmount.toLocaleString()}</p>
              </div>
              <div className="text-4xl opacity-80">💰</div>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 animate-fadeIn delay-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Top Flavors Across Cities</h3>
            <div className="text-2xl">🍦</div>
          </div>
          <div className="h-96">
            <Chart data={top} />
          </div>
        </div>
      </div>
    );
  }

  // User Dashboard
  const totalSales = userSales.reduce((sum, sale) => sum + sale.amount, 0);
  const totalUnits = userSales.reduce((sum, sale) => sum + sale.units, 0);
  const pendingRequests = userRequests.filter(req => req.status === 'pending').length;
  const approvedRequests = userRequests.filter(req => req.status === 'approved').length;

  return (
    <div className="h-full overflow-y-auto p-6 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="text-6xl animate-bounce delay-100">🍦</div>
        </div>
        <h1 className="text-4xl font-bold gradient-text mb-2 animate-slideIn delay-200">
          Your Branch Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg animate-fadeIn delay-300">
          Welcome back, {user?.username}! Here's your branch performance overview.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-rose-500 to-rose-600 p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition-all duration-300 animate-bounceIn delay-400">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-rose-100 text-sm font-medium">Total Sales</p>
              <p className="text-3xl font-bold">₹{totalSales.toLocaleString()}</p>
            </div>
            <div className="text-4xl opacity-80">💰</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-pink-500 to-pink-600 p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition-all duration-300 animate-bounceIn delay-500">
          <div className="flex items-center justify-between">
    <div>
              <p className="text-pink-100 text-sm font-medium">Units Sold</p>
              <p className="text-3xl font-bold">{totalUnits}</p>
            </div>
            <div className="text-4xl opacity-80">📦</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-rose-400 to-rose-500 p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition-all duration-300 animate-bounceIn delay-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-rose-100 text-sm font-medium">Pending Requests</p>
              <p className="text-3xl font-bold">{pendingRequests}</p>
            </div>
            <div className="text-4xl opacity-80">⏳</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-rose-600 to-rose-700 p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition-all duration-300 animate-bounceIn delay-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-rose-100 text-sm font-medium">Approved Requests</p>
              <p className="text-3xl font-bold">{approvedRequests}</p>
            </div>
            <div className="text-4xl opacity-80">✅</div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Sales */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 animate-fadeIn delay-800">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            Recent Sales <span className="text-xl animate-bounce ml-2">💰</span>
          </h3>
          <div className="space-y-3">
            {userSales.slice(0, 5).map((sale, index) => (
              <div
                key={sale._id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {sale.flavor.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">{sale.flavor}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{sale.city}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600 dark:text-green-400 text-sm">₹{sale.amount}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{sale.units} units</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Requests */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 animate-fadeIn delay-900">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            Recent Requests <span className="text-xl animate-bounce ml-2">🥛</span>
          </h3>
          <div className="space-y-3">
            {userRequests.slice(0, 5).map((request, index) => (
              <div
                key={request._id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {request.ingredient.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">{request.ingredient}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{request.flavor}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    request.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    request.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  }`}>
                    {request.status}
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{request.qty} units</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

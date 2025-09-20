import React, { useEffect, useState } from "react";
import { getBranches } from "../services/branchService";

export default function UserBranches() {
  const [branches, setBranches] = useState([]);

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const data = await getBranches();
      setBranches(data);
    } catch (err) {
      console.error("Failed to fetch branches:", err);
    }
  };

  return (
   <div className="p-8 bg-gradient-to-br from-rose-50 to-pink-100 rounded-2xl shadow-xl m-4 h-full overflow-auto">
  <h2 className="text-3xl font-bold mb-6 text-gray-900 flex items-center">
    Our Branches <span className="ml-2 animate-bounce">🏪</span>
  </h2>

  {branches.length === 0 ? (
    <p className="text-gray-500 text-center py-10 text-lg">
      No branches available yet.
    </p>
  ) : (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {branches.map((b) => (
        <div
          key={b._id}
          className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition transform hover:scale-105"
        >
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-14 h-14 flex items-center justify-center bg-gradient-to-r from-rose-400 to-pink-500 text-white text-2xl font-bold rounded-full shadow">
              {b.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-xl text-gray-900">{b.name}</p>
              <p className="text-sm text-gray-500">{b.city} - {b.area}</p>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            Manager: <span className="font-medium">{b.manager || "No Manager"}</span>
          </div>
        </div>
      ))}
    </div>
  )}
</div>

  );
}

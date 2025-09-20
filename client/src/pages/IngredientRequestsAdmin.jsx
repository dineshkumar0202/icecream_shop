import { useEffect, useState } from "react";

export default function IngredientRequestsAdmin() {
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/ingredients");
      const data = await res.json();
      setRequests(data);
    } catch (err) {
      console.error("Error fetching requests:", err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await fetch(`http://localhost:5000/api/ingredients/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      fetchRequests(); // reload after update
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-6 bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Ingredient Requests</h2>
      {requests.length === 0 ? (
        <p>No requests found.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Branch</th>
              <th className="border p-2">Flavor</th>
              <th className="border p-2">Ingredient</th>
              <th className="border p-2">Quantity</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req._id}>
                <td className="border p-2">{req.branch?.name} ({req.branch?.city})</td>
                <td className="border p-2">{req.flavor}</td>
                <td className="border p-2">{req.ingredient}</td>
                <td className="border p-2">{req.qtyNeeded}</td>
                <td className="border p-2">{req.status}</td>
                <td className="border p-2 space-x-2">
                  <button
                    onClick={() => updateStatus(req._id, "approved")}
                    className="bg-green-500 text-white px-2 py-1 rounded"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => updateStatus(req._id, "denied")}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Deny
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

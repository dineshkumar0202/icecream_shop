import { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

function TopFlavors() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/dashboard/top-flavors")
      .then(res => setData(res.data))
      .catch(err => console.error("Error fetching top flavors:", err));
  }, []);

  if (data.length === 0) {
    return <p className="p-6">No flavor sales data available.</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">🍦 Top Flavors per City</h1>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <XAxis dataKey="city" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="unitsSold" name="Units Sold" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-4 text-sm text-gray-600">
        {data.map(row => (
          <div key={row.city}>{row.city}: {row.flavor} ({row.unitsSold})</div>
        ))}
      </div>
    </div>
  );
}

export default TopFlavors;

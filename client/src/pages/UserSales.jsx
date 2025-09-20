// import React, { useEffect, useState } from "react";
// import { getSales } from "../services/salesService";

// export default function UserSales() {
//   const [sales, setSales] = useState([]);

//   useEffect(() => {
//     fetchSales();
//   }, []);

//   const fetchSales = async () => {
//     try {
//       const data = await getSales();
//       setSales(data);
//     } catch (err) {
//       console.error("Failed to fetch sales:", err);
//     }
//   };

//   return (
//     <div className="p-8 bg-gradient-to-br from-rose-50 to-pink-100 rounded-2xl shadow-xl m-4 h-full overflow-auto">
//       <h2 className="text-3xl font-bold mb-6 text-gray-900 flex items-center">
//         Our Sales <span className="ml-2 animate-bounce">🍦</span>
//       </h2>

//       {sales.length === 0 ? (
//         <p className="text-gray-500 text-center py-10 text-lg">
//           No sales available yet.
//         </p>
//       ) : (
//         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {sales.map((s) => (
//             <div
//               key={s._id}
//               className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition transform hover:scale-105"
//             >
//               <div className="flex items-center space-x-4 mb-4">
//                 <div className="w-14 h-14 flex items-center justify-center bg-gradient-to-r from-rose-400 to-pink-500 text-white text-2xl font-bold rounded-full shadow">
//                   {s.flavor?.charAt(0).toUpperCase()}
//                 </div>
//                 <div>
//                   <p className="font-semibold text-xl text-gray-900">
//                     {typeof s.branch === "object"
//                       ? s.branch.name
//                       : s.branch || "Unknown Branch"}
//                   </p>
//                   <p className="text-sm text-gray-500">{s.city}</p>
//                 </div>
//               </div>
//               <div className="text-gray-700 text-sm">
//                 <p>
//                   <span className="font-medium">Flavor:</span> {s.flavor}
//                 </p>
//                 <p>
//                   <span className="font-medium">Units:</span> {s.units}
//                 </p>
//                 <p>
//                   <span className="font-medium">Amount:</span> ₹{s.amount}
//                 </p>
//                 <p className="text-xs text-gray-500 mt-1">
//                   {new Date(s.date).toLocaleDateString()}
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

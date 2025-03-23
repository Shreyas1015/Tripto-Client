// import { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import secureLocalStorage from "react-secure-storage";
// import toast from "react-hot-toast";
// import {
//   Activity,
//   Calendar,
//   Car,
//   Clock,
//   DollarSign,
//   MapPin,
//   MoreHorizontal,
//   RefreshCw,
//   Search,
//   Star,
//   Users,
//   Wallet,
// } from "lucide-react";

// const VendorDashboardContent = () => {
//   const decryptedUID = secureLocalStorage.getItem("uid");
//   const [isLoading, setIsLoading] = useState(true);
//   const [stats, setStats] = useState({
//     totalTrips: 0,
//     pendingTrips: 0,
//     completedTrips: 0,
//     cancelledTrips: 0,
//     totalEarnings: 0,
//     walletBalance: 0,
//   });
//   const [recentTrips, setRecentTrips] = useState([]);
//   const [activeTab, setActiveTab] = useState("overview");

//   // Mock data for demonstration
//   const mockStats = {
//     totalTrips: 124,
//     pendingTrips: 3,
//     completedTrips: 118,
//     cancelledTrips: 3,
//     totalEarnings: 15750.5,
//     walletBalance: 125.5,
//   };

//   const mockRecentTrips = [
//     {
//       id: "TR-7845",
//       date: "2023-03-15",
//       time: "14:30",
//       pickup: "Airport Terminal 1",
//       dropoff: "Central Business District",
//       amount: 450,
//       status: "completed",
//       passenger: "John Doe",
//       rating: 4.8,
//     },
//     {
//       id: "TR-7844",
//       date: "2023-03-14",
//       time: "09:15",
//       pickup: "Westside Mall",
//       dropoff: "North Hills Residency",
//       amount: 320,
//       status: "completed",
//       passenger: "Sarah Johnson",
//       rating: 5.0,
//     },
//     {
//       id: "TR-7843",
//       date: "2023-03-14",
//       time: "18:45",
//       pickup: "Central Station",
//       dropoff: "Greenwood Heights",
//       amount: 280,
//       status: "completed",
//       passenger: "Michael Brown",
//       rating: 4.5,
//     },
//     {
//       id: "TR-7842",
//       date: "2023-03-13",
//       time: "11:20",
//       pickup: "City Hospital",
//       dropoff: "Riverside Apartments",
//       amount: 350,
//       status: "cancelled",
//       passenger: "Emily Wilson",
//       rating: null,
//     },
//     {
//       id: "TR-7841",
//       date: "2023-03-12",
//       time: "20:10",
//       pickup: "Grand Hotel",
//       dropoff: "Airport Terminal 2",
//       amount: 520,
//       status: "completed",
//       passenger: "Robert Chen",
//       rating: 4.9,
//     },
//   ];

//   const mockAvailableTrips = [
//     {
//       id: "TR-8001",
//       date: "2023-03-16",
//       time: "10:30",
//       pickup: "Downtown Plaza",
//       dropoff: "Sunset Beach Resort",
//       estimatedAmount: 580,
//       distance: "12.5 km",
//       passenger: "Alex Morgan",
//       status: "available",
//     },
//     {
//       id: "TR-8002",
//       date: "2023-03-16",
//       time: "13:45",
//       pickup: "Metro Station",
//       dropoff: "University Campus",
//       estimatedAmount: 220,
//       distance: "5.8 km",
//       passenger: "Jessica Lee",
//       status: "available",
//     },
//     {
//       id: "TR-8003",
//       date: "2023-03-16",
//       time: "16:15",
//       pickup: "Shopping Mall",
//       dropoff: "Hillside Residency",
//       estimatedAmount: 350,
//       distance: "8.2 km",
//       passenger: "David Smith",
//       status: "available",
//     },
//   ];

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         setIsLoading(true);
//         // In a real app, these would be actual API calls
//         // const statsResponse = await axiosInstance.post(
//         //   `${process.env.REACT_APP_BASE_URL}/vendor/fetchDashboardStats`,
//         //   { decryptedUID }
//         // );
//         // const tripsResponse = await axiosInstance.post(
//         //   `${process.env.REACT_APP_BASE_URL}/vendor/fetchRecentTrips`,
//         //   { decryptedUID }
//         // );

//         // Simulate API response with mock data
//         setTimeout(() => {
//           setStats(mockStats);
//           setRecentTrips(mockRecentTrips);
//           setIsLoading(false);
//         }, 1000);
//       } catch (error) {
//         console.error("Error fetching dashboard data:", error);
//         toast.error("Failed to load dashboard data");
//         setIsLoading(false);
//       }
//     };

//     fetchDashboardData();
//   }, [decryptedUID]);

//   const acceptTrip = (tripId) => {
//     toast.success(`Trip ${tripId} accepted successfully!`);
//     // In a real app, this would make an API call to accept the trip
//   };

//   const refreshDashboard = () => {
//     toast.loading("Refreshing dashboard...");
//     // In a real app, this would refetch the data
//     setTimeout(() => {
//       toast.dismiss();
//       toast.success("Dashboard refreshed");
//     }, 1000);
//   };

//   return (
//     <div className="container mx-auto px-4 py-6">
//       {/* Dashboard Header */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-800">Vendor Dashboard</h1>
//           <p className="text-gray-500">
//             Welcome back! Here's your business at a glance
//           </p>
//         </div>
//         <div className="flex items-center space-x-3 mt-4 md:mt-0">
//           <div className="relative">
//             <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search trips..."
//               className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             />
//           </div>
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={refreshDashboard}
//             className="bg-blue-50 text-blue-600 p-2 rounded-lg hover:bg-blue-100"
//           >
//             <RefreshCw size={20} />
//           </motion.button>
//         </div>
//       </div>

//       {/* Dashboard Tabs */}
//       <div className="mb-6 border-b border-gray-200">
//         <div className="flex overflow-x-auto">
//           <button
//             onClick={() => setActiveTab("overview")}
//             className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
//               activeTab === "overview"
//                 ? "text-blue-600 border-b-2 border-blue-600"
//                 : "text-gray-500 hover:text-gray-700"
//             }`}
//           >
//             Overview
//           </button>
//           <button
//             onClick={() => setActiveTab("available")}
//             className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
//               activeTab === "available"
//                 ? "text-blue-600 border-b-2 border-blue-600"
//                 : "text-gray-500 hover:text-gray-700"
//             }`}
//           >
//             Available Trips
//           </button>
//           <button
//             onClick={() => setActiveTab("history")}
//             className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
//               activeTab === "history"
//                 ? "text-blue-600 border-b-2 border-blue-600"
//                 : "text-gray-500 hover:text-gray-700"
//             }`}
//           >
//             Trip History
//           </button>
//           <button
//             onClick={() => setActiveTab("earnings")}
//             className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
//               activeTab === "earnings"
//                 ? "text-blue-600 border-b-2 border-blue-600"
//                 : "text-gray-500 hover:text-gray-700"
//             }`}
//           >
//             Earnings
//           </button>
//           <button
//             onClick={() => setActiveTab("wallet")}
//             className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
//               activeTab === "wallet"
//                 ? "text-blue-600 border-b-2 border-blue-600"
//                 : "text-gray-500 hover:text-gray-700"
//             }`}
//           >
//             Wallet
//           </button>
//         </div>
//       </div>

//       {/* Stats Cards */}
//       {activeTab === "overview" && (
//         <>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//             <motion.div
//               whileHover={{ y: -5 }}
//               className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500"
//             >
//               <div className="flex justify-between items-start">
//                 <div>
//                   <p className="text-gray-500 text-sm">Total Trips</p>
//                   <h3 className="text-2xl font-bold mt-1">
//                     {stats.totalTrips}
//                   </h3>
//                 </div>
//                 <div className="bg-blue-100 p-3 rounded-lg">
//                   <Car className="h-6 w-6 text-blue-600" />
//                 </div>
//               </div>
//               <div className="mt-4 flex items-center text-sm text-green-600">
//                 <Activity className="h-4 w-4 mr-1" />
//                 <span>+12% from last month</span>
//               </div>
//             </motion.div>

//             <motion.div
//               whileHover={{ y: -5 }}
//               className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500"
//             >
//               <div className="flex justify-between items-start">
//                 <div>
//                   <p className="text-gray-500 text-sm">Total Earnings</p>
//                   <h3 className="text-2xl font-bold mt-1">
//                     ₹{stats.totalEarnings.toFixed(2)}
//                   </h3>
//                 </div>
//                 <div className="bg-green-100 p-3 rounded-lg">
//                   <DollarSign className="h-6 w-6 text-green-600" />
//                 </div>
//               </div>
//               <div className="mt-4 flex items-center text-sm text-green-600">
//                 <Activity className="h-4 w-4 mr-1" />
//                 <span>+8% from last month</span>
//               </div>
//             </motion.div>

//             <motion.div
//               whileHover={{ y: -5 }}
//               className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500"
//             >
//               <div className="flex justify-between items-start">
//                 <div>
//                   <p className="text-gray-500 text-sm">Wallet Balance</p>
//                   <h3 className="text-2xl font-bold mt-1">
//                     ₹{stats.walletBalance.toFixed(2)}
//                   </h3>
//                 </div>
//                 <div className="bg-purple-100 p-3 rounded-lg">
//                   <Wallet className="h-6 w-6 text-purple-600" />
//                 </div>
//               </div>
//               <div className="mt-4 flex items-center text-sm text-purple-600">
//                 <Activity className="h-4 w-4 mr-1" />
//                 <span>Last updated today</span>
//               </div>
//             </motion.div>

//             <motion.div
//               whileHover={{ y: -5 }}
//               className="bg-white rounded-xl shadow-md p-6 border-l-4 border-amber-500"
//             >
//               <div className="flex justify-between items-start">
//                 <div>
//                   <p className="text-gray-500 text-sm">Completion Rate</p>
//                   <h3 className="text-2xl font-bold mt-1">95.2%</h3>
//                 </div>
//                 <div className="bg-amber-100 p-3 rounded-lg">
//                   <Star className="h-6 w-6 text-amber-600" />
//                 </div>
//               </div>
//               <div className="mt-4 flex items-center text-sm text-green-600">
//                 <Activity className="h-4 w-4 mr-1" />
//                 <span>+2.3% from last month</span>
//               </div>
//             </motion.div>
//           </div>

//           {/* Recent Trips */}
//           <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
//             <div className="p-6 border-b border-gray-100">
//               <div className="flex justify-between items-center">
//                 <h3 className="text-lg font-semibold">Recent Trips</h3>
//                 <button className="text-blue-600 text-sm font-medium hover:underline">
//                   View All
//                 </button>
//               </div>
//             </div>
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Trip ID
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Date & Time
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Route
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Passenger
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Amount
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Status
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Rating
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200">
//                   {recentTrips.map((trip) => (
//                     <tr key={trip.id} className="hover:bg-gray-50">
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
//                         {trip.id}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                         <div className="flex items-center">
//                           <Calendar className="h-4 w-4 mr-1 text-gray-400" />
//                           {new Date(trip.date).toLocaleDateString()}
//                         </div>
//                         <div className="flex items-center mt-1">
//                           <Clock className="h-4 w-4 mr-1 text-gray-400" />
//                           {trip.time}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 text-sm text-gray-700">
//                         <div className="flex items-start">
//                           <MapPin className="h-4 w-4 mr-1 text-gray-400 mt-0.5" />
//                           <div>
//                             <p className="font-medium">{trip.pickup}</p>
//                             <p className="text-gray-500 mt-1">{trip.dropoff}</p>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                         <div className="flex items-center">
//                           <Users className="h-4 w-4 mr-1 text-gray-400" />
//                           {trip.passenger}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                         ₹{trip.amount.toFixed(2)}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span
//                           className={`px-2 py-1 text-xs font-medium rounded-full ${
//                             trip.status === "completed"
//                               ? "bg-green-100 text-green-800"
//                               : trip.status === "cancelled"
//                               ? "bg-red-100 text-red-800"
//                               : "bg-yellow-100 text-yellow-800"
//                           }`}
//                         >
//                           {trip.status.charAt(0).toUpperCase() +
//                             trip.status.slice(1)}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                         {trip.rating ? (
//                           <div className="flex items-center">
//                             <Star className="h-4 w-4 text-amber-500 mr-1" />
//                             <span>{trip.rating}</span>
//                           </div>
//                         ) : (
//                           <span className="text-gray-400">N/A</span>
//                         )}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                         <button className="text-gray-400 hover:text-gray-600">
//                           <MoreHorizontal className="h-5 w-5" />
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </>
//       )}

//       {/* Available Trips Tab */}
//       {activeTab === "available" && (
//         <div className="bg-white rounded-xl shadow-md overflow-hidden">
//           <div className="p-6 border-b border-gray-100">
//             <h3 className="text-lg font-semibold">Available Trips</h3>
//             <p className="text-gray-500 text-sm mt-1">
//               These trips need a vendor. Accept them to increase your earnings.
//             </p>
//           </div>

//           <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {mockAvailableTrips.map((trip) => (
//               <motion.div
//                 key={trip.id}
//                 whileHover={{ y: -5 }}
//                 className="border border-gray-200 rounded-lg overflow-hidden shadow-sm"
//               >
//                 <div className="bg-blue-50 p-4 border-b border-gray-200">
//                   <div className="flex justify-between items-center">
//                     <span className="text-blue-600 font-medium">{trip.id}</span>
//                     <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
//                       Available
//                     </span>
//                   </div>
//                 </div>

//                 <div className="p-4">
//                   <div className="flex items-center mb-3">
//                     <Calendar className="h-4 w-4 text-gray-400 mr-2" />
//                     <span className="text-sm text-gray-700">
//                       {new Date(trip.date).toLocaleDateString()} at {trip.time}
//                     </span>
//                   </div>

//                   <div className="mb-3">
//                     <div className="flex items-start mb-2">
//                       <div className="min-w-[24px] flex justify-center">
//                         <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
//                           <MapPin className="h-3 w-3 text-green-600" />
//                         </div>
//                       </div>
//                       <div className="ml-2">
//                         <p className="text-xs text-gray-500">Pickup</p>
//                         <p className="text-sm font-medium">{trip.pickup}</p>
//                       </div>
//                     </div>

//                     <div className="flex items-start">
//                       <div className="min-w-[24px] flex justify-center">
//                         <div className="h-6 w-6 rounded-full bg-red-100 flex items-center justify-center">
//                           <MapPin className="h-3 w-3 text-red-600" />
//                         </div>
//                       </div>
//                       <div className="ml-2">
//                         <p className="text-xs text-gray-500">Dropoff</p>
//                         <p className="text-sm font-medium">{trip.dropoff}</p>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="flex justify-between items-center mb-4">
//                     <div>
//                       <p className="text-xs text-gray-500">Distance</p>
//                       <p className="text-sm font-medium">{trip.distance}</p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-gray-500">Estimated Fare</p>
//                       <p className="text-sm font-medium">
//                         ₹{trip.estimatedAmount.toFixed(2)}
//                       </p>
//                     </div>
//                   </div>

//                   <motion.button
//                     whileHover={{ scale: 1.03 }}
//                     whileTap={{ scale: 0.97 }}
//                     onClick={() => acceptTrip(trip.id)}
//                     className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors"
//                   >
//                     Accept Trip
//                   </motion.button>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Wallet Tab */}
//       {activeTab === "wallet" && (
//         <div className="space-y-6">
//           <div className="bg-white rounded-xl shadow-md overflow-hidden">
//             <div className="p-6">
//               <h3 className="text-lg font-semibold mb-4">Wallet Balance</h3>

//               <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 text-white">
//                 <div className="flex justify-between items-center mb-4">
//                   <div>
//                     <p className="text-blue-100 text-sm">Current Balance</p>
//                     <h2 className="text-3xl font-bold mt-1">
//                       ₹{stats.walletBalance.toFixed(2)}
//                     </h2>
//                   </div>
//                   <Wallet className="h-10 w-10 text-blue-200" />
//                 </div>

//                 <div className="grid grid-cols-2 gap-4 mt-6">
//                   <motion.button
//                     whileHover={{ scale: 1.03 }}
//                     whileTap={{ scale: 0.97 }}
//                     className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white py-2 px-4 rounded-lg font-medium transition-colors"
//                   >
//                     Add Money
//                   </motion.button>
//                   <motion.button
//                     whileHover={{ scale: 1.03 }}
//                     whileTap={{ scale: 0.97 }}
//                     className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white py-2 px-4 rounded-lg font-medium transition-colors"
//                   >
//                     Withdraw
//                   </motion.button>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl shadow-md overflow-hidden">
//             <div className="p-6 border-b border-gray-100">
//               <h3 className="text-lg font-semibold">Recent Transactions</h3>
//             </div>

//             <div className="divide-y divide-gray-100">
//               <div className="p-4 flex justify-between items-center">
//                 <div className="flex items-center">
//                   <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
//                     <DollarSign className="h-5 w-5 text-green-600" />
//                   </div>
//                   <div>
//                     <p className="font-medium">Trip Earnings</p>
//                     <p className="text-sm text-gray-500">Trip ID: TR-7845</p>
//                   </div>
//                 </div>
//                 <div className="text-right">
//                   <p className="font-medium text-green-600">+₹450.00</p>
//                   <p className="text-xs text-gray-500">Mar 15, 2023</p>
//                 </div>
//               </div>

//               <div className="p-4 flex justify-between items-center">
//                 <div className="flex items-center">
//                   <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
//                     <DollarSign className="h-5 w-5 text-green-600" />
//                   </div>
//                   <div>
//                     <p className="font-medium">Trip Earnings</p>
//                     <p className="text-sm text-gray-500">Trip ID: TR-7844</p>
//                   </div>
//                 </div>
//                 <div className="text-right">
//                   <p className="font-medium text-green-600">+₹320.00</p>
//                   <p className="text-xs text-gray-500">Mar 14, 2023</p>
//                 </div>
//               </div>

//               <div className="p-4 flex justify-between items-center">
//                 <div className="flex items-center">
//                   <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
//                     <DollarSign className="h-5 w-5 text-red-600" />
//                   </div>
//                   <div>
//                     <p className="font-medium">Withdrawal</p>
//                     <p className="text-sm text-gray-500">To Bank Account</p>
//                   </div>
//                 </div>
//                 <div className="text-right">
//                   <p className="font-medium text-red-600">-₹1000.00</p>
//                   <p className="text-xs text-gray-500">Mar 10, 2023</p>
//                 </div>
//               </div>

//               <div className="p-4 flex justify-between items-center">
//                 <div className="flex items-center">
//                   <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
//                     <DollarSign className="h-5 w-5 text-blue-600" />
//                   </div>
//                   <div>
//                     <p className="font-medium">Cancellation Fee</p>
//                     <p className="text-sm text-gray-500">Trip ID: TR-7842</p>
//                   </div>
//                 </div>
//                 <div className="text-right">
//                   <p className="font-medium text-blue-600">+₹25.00</p>
//                   <p className="text-xs text-gray-500">Mar 13, 2023</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default VendorDashboardContent;

"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import axiosInstance from "../../API/axiosInstance";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  Calendar,
  Car,
  DollarSign,
  FileText,
  MapPin,
  PieChart,
  RefreshCw,
  Search,
  Users,
} from "lucide-react";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const VendorDashboardContent = () => {
  const navigate = useNavigate();
  const decryptedUID = secureLocalStorage.getItem("uid");

  const [vendorBookingsData, setVendorBookingsData] = useState([]);
  const [vendorIncomeData, setVendorIncomeData] = useState([]);
  const [vendorBookingStatusData, setVendorBookingStatusData] = useState([]);
  const [vendorDriverData, setVendorDriverData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("weekly");
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Derived state for summary metrics
  const [summaryMetrics, setSummaryMetrics] = useState({
    totalBookings: 0,
    totalIncome: 0,
    activeDrivers: 0,
    completionRate: 0,
  });

  useEffect(() => {
    fetchAllData();
  }, [decryptedUID]);

  // Calculate summary metrics whenever data changes
  useEffect(() => {
    if (
      vendorBookingsData.length &&
      vendorBookingStatusData.length &&
      vendorDriverData.length
    ) {
      const totalBookings = vendorBookingsData.length;

      // Calculate total income from all bookings
      const totalIncome = vendorBookingsData.reduce(
        (sum, booking) => sum + Number(booking.price || 0),
        0
      );

      // Count active drivers (unique driver IDs)
      const uniqueDrivers = new Set(
        vendorDriverData.map((driver) => driver.did)
      ).size;

      // Calculate completion rate
      const completedBookings =
        vendorBookingStatusData[0]?.completed_bookings || 0;
      const completionRate =
        totalBookings > 0 ? (completedBookings / totalBookings) * 100 : 0;

      setSummaryMetrics({
        totalBookings,
        totalIncome,
        activeDrivers: uniqueDrivers,
        completionRate: Math.round(completionRate),
      });
    }
  }, [vendorBookingsData, vendorBookingStatusData, vendorDriverData]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchVendorBookingsData(),
        fetchVendorIncomeData(),
        fetchVendorBookingStatusData(),
        fetchVendorDriverData(),
      ]);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchAllData();
    setIsRefreshing(false);
    toast.success("Dashboard data refreshed");
  };

  const fetchVendorBookingsData = async () => {
    try {
      const res = await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/vendor/fetchVendorBookingsData`,
        {
          decryptedUID,
        }
      );

      if (res.status === 200) {
        console.log("Vendor Booking Data : ", res.data);
        setVendorBookingsData(res.data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load vendor bookings data");
    }
  };

  const fetchVendorIncomeData = async () => {
    try {
      const res = await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/vendor/fetchVendorIncomeData`,
        {
          decryptedUID,
        }
      );

      if (res.status === 200) {
        console.log("vendor income :", res.data);
        setVendorIncomeData(res.data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load vendor income data");
    }
  };

  const fetchVendorBookingStatusData = async () => {
    try {
      const res = await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/vendor/fetchVendorBookingStatusData`,
        {
          decryptedUID,
        }
      );

      if (res.status === 200) {
        console.log("Booking status : ", res.data);
        setVendorBookingStatusData(res.data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load vendor booking status data");
    }
  };

  const fetchVendorDriverData = async () => {
    try {
      const res = await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/vendor/fetchVendorDriverData`,
        {
          decryptedUID,
        }
      );

      if (res.status === 200) {
        console.log("Vendor driver data : ", res.data);
        setVendorDriverData(res.data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load vendor driver data");
    }
  };

  // Filter income data based on active tab
  const filteredIncomeData = vendorIncomeData.filter(
    (item) => item.period === activeTab
  );

  // Prepare data for income chart
  const incomeChartData = {
    labels: filteredIncomeData.map((item) => {
      if (activeTab === "weekly") {
        return `Week ${item.week.split("-")[1]}`;
      } else if (activeTab === "monthly") {
        const monthNames = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        return monthNames[Number.parseInt(item.week.split("-")[1]) - 1];
      } else {
        return item.week;
      }
    }),
    datasets: [
      {
        label: "Income",
        data: filteredIncomeData.map((item) =>
          Number.parseFloat(item.total_income)
        ),
        borderColor: "#0bbfe0",
        backgroundColor: "rgba(11, 191, 224, 0.2)",
        borderWidth: 2,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // Prepare data for booking status chart
  const bookingStatusData = {
    labels: ["Completed", "Pending", "Cancelled"],
    datasets: [
      {
        data:
          vendorBookingStatusData.length > 0
            ? [
                Number.parseInt(
                  vendorBookingStatusData[0].completed_bookings || 0
                ),
                Number.parseInt(
                  vendorBookingStatusData[0].pending_bookings || 0
                ),
                Number.parseInt(
                  vendorBookingStatusData[0].cancelled_by_driver || 0
                ) +
                  Number.parseInt(
                    vendorBookingStatusData[0].cancelled_by_passenger || 0
                  ),
              ]
            : [0, 0, 0],
        backgroundColor: ["#4ade80", "#f59e0b", "#ef4444"],
        borderWidth: 0,
      },
    ],
  };

  // Filter bookings based on search term
  const filteredBookings = vendorBookingsData.filter(
    (booking) =>
      booking.bid?.toString().includes(searchTerm) ||
      booking.passenger_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      booking.pickup_location
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      booking.drop_location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get trip type label
  const getTripTypeLabel = (type) => {
    return type === 1 ? "One-way" : type === 2 ? "Round Trip" : "Unknown";
  };

  // Get trip status label
  const getTripStatusLabel = (status) => {
    switch (status) {
      case 0:
        return "Pending";
      case 1:
        return "Accepted";
      case 2:
        return "Completed";
      case 3:
        return "Cancelled";
      default:
        return "Unknown";
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 0:
        return "bg-yellow-100 text-yellow-800";
      case 1:
        return "bg-blue-100 text-blue-800";
      case 2:
        return "bg-green-100 text-green-800";
      case 3:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0bbfe0] mb-4"></div>
          <p className="text-lg text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1600px] mx-auto p-4 md:p-6">
        {/* Dashboard Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Vendor Dashboard
            </h1>
            <p className="text-gray-500">
              Monitor your business performance and driver activities
            </p>
          </div>
          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            <button
              onClick={handleRefresh}
              className={`flex items-center px-4 py-2 rounded-md text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-all ${
                isRefreshing ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isRefreshing}
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          </div>
        </motion.div>

        {/* Summary Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">
                  Total Bookings
                </p>
                <h3 className="text-3xl font-bold text-gray-800 mt-1">
                  {summaryMetrics.totalBookings}
                </h3>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <FileText className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">
                  Total Revenue
                </p>
                <h3 className="text-3xl font-bold text-gray-800 mt-1">
                  ₹{summaryMetrics.totalIncome.toLocaleString()}
                </h3>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">
                  Active Drivers
                </p>
                <h3 className="text-3xl font-bold text-gray-800 mt-1">
                  {summaryMetrics.activeDrivers}
                </h3>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <Users className="w-6 h-6 text-purple-500" />
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">
                  Completion Rate
                </p>
                <h3 className="text-3xl font-bold text-gray-800 mt-1">
                  {summaryMetrics.completionRate}%
                </h3>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg">
                <PieChart className="w-6 h-6 text-yellow-500" />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Income Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  Income Overview
                </h2>
                <p className="text-gray-500 text-sm">
                  Track your revenue over time
                </p>
              </div>
              <div className="flex mt-4 sm:mt-0 p-1 bg-gray-100 rounded-md">
                <button
                  onClick={() => setActiveTab("weekly")}
                  className={`px-3 py-1 text-sm rounded-md transition-all ${
                    activeTab === "weekly"
                      ? "bg-white shadow-sm text-gray-800"
                      : "text-gray-500"
                  }`}
                >
                  Weekly
                </button>
                <button
                  onClick={() => setActiveTab("monthly")}
                  className={`px-3 py-1 text-sm rounded-md transition-all ${
                    activeTab === "monthly"
                      ? "bg-white shadow-sm text-gray-800"
                      : "text-gray-500"
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setActiveTab("yearly")}
                  className={`px-3 py-1 text-sm rounded-md transition-all ${
                    activeTab === "yearly"
                      ? "bg-white shadow-sm text-gray-800"
                      : "text-gray-500"
                  }`}
                >
                  Yearly
                </button>
              </div>
            </div>
            <div className="h-80">
              <Line
                data={incomeChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: {
                        color: "rgba(0, 0, 0, 0.05)",
                      },
                      ticks: {
                        callback: (value) => "₹" + value,
                      },
                    },
                    x: {
                      grid: {
                        display: false,
                      },
                    },
                  },
                  plugins: {
                    legend: {
                      display: false,
                    },
                    tooltip: {
                      callbacks: {
                        label: (context) => "₹" + context.parsed.y,
                      },
                    },
                  },
                }}
              />
            </div>
          </motion.div>

          {/* Booking Status Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-800">
                Booking Status
              </h2>
              <p className="text-gray-500 text-sm">
                Distribution of booking statuses
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col justify-center">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-green-500 mr-3"></div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Completed</span>
                        <span className="font-medium">
                          {vendorBookingStatusData[0]?.completed_bookings || 0}
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2 mt-1">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{
                            width: `${
                              vendorBookingStatusData.length > 0
                                ? (Number.parseInt(
                                    vendorBookingStatusData[0]
                                      .completed_bookings || 0
                                  ) /
                                    (Number.parseInt(
                                      vendorBookingStatusData[0]
                                        .completed_bookings || 0
                                    ) +
                                      Number.parseInt(
                                        vendorBookingStatusData[0]
                                          .pending_bookings || 0
                                      ) +
                                      Number.parseInt(
                                        vendorBookingStatusData[0]
                                          .cancelled_by_driver || 0
                                      ) +
                                      Number.parseInt(
                                        vendorBookingStatusData[0]
                                          .cancelled_by_passenger || 0
                                      ))) *
                                  100
                                : 0
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-yellow-500 mr-3"></div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Pending</span>
                        <span className="font-medium">
                          {vendorBookingStatusData[0]?.pending_bookings || 0}
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2 mt-1">
                        <div
                          className="bg-yellow-500 h-2 rounded-full"
                          style={{
                            width: `${
                              vendorBookingStatusData.length > 0
                                ? (Number.parseInt(
                                    vendorBookingStatusData[0]
                                      .pending_bookings || 0
                                  ) /
                                    (Number.parseInt(
                                      vendorBookingStatusData[0]
                                        .completed_bookings || 0
                                    ) +
                                      Number.parseInt(
                                        vendorBookingStatusData[0]
                                          .pending_bookings || 0
                                      ) +
                                      Number.parseInt(
                                        vendorBookingStatusData[0]
                                          .cancelled_by_driver || 0
                                      ) +
                                      Number.parseInt(
                                        vendorBookingStatusData[0]
                                          .cancelled_by_passenger || 0
                                      ))) *
                                  100
                                : 0
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-red-500 mr-3"></div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Cancelled</span>
                        <span className="font-medium">
                          {Number.parseInt(
                            vendorBookingStatusData[0]?.cancelled_by_driver || 0
                          ) +
                            Number.parseInt(
                              vendorBookingStatusData[0]
                                ?.cancelled_by_passenger || 0
                            )}
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2 mt-1">
                        <div
                          className="bg-red-500 h-2 rounded-full"
                          style={{
                            width: `${
                              vendorBookingStatusData.length > 0
                                ? ((Number.parseInt(
                                    vendorBookingStatusData[0]
                                      .cancelled_by_driver || 0
                                  ) +
                                    Number.parseInt(
                                      vendorBookingStatusData[0]
                                        .cancelled_by_passenger || 0
                                    )) /
                                    (Number.parseInt(
                                      vendorBookingStatusData[0]
                                        .completed_bookings || 0
                                    ) +
                                      Number.parseInt(
                                        vendorBookingStatusData[0]
                                          .pending_bookings || 0
                                      ) +
                                      Number.parseInt(
                                        vendorBookingStatusData[0]
                                          .cancelled_by_driver || 0
                                      ) +
                                      Number.parseInt(
                                        vendorBookingStatusData[0]
                                          .cancelled_by_passenger || 0
                                      ))) *
                                  100
                                : 0
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="w-48 h-48">
                  <Pie
                    data={bookingStatusData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: true,
                      plugins: {
                        legend: {
                          position: "bottom",
                          labels: {
                            usePointStyle: true,
                            padding: 20,
                          },
                        },
                      },
                      cutout: "70%",
                    }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recent Bookings Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8"
        >
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col md:flex-row justify-between md:items-center">
              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  Recent Bookings
                </h2>
                <p className="text-gray-500 text-sm">
                  Manage and monitor all your bookings
                </p>
              </div>
              <div className="mt-4 md:mt-0 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search bookings..."
                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-md w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-[#0bbfe0] focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booking ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Passenger
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pickup
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dropoff
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trip Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Driver
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredBookings.length > 0 ? (
                  filteredBookings.map((booking, index) => (
                    <tr
                      key={booking.bid || index}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{booking.bid}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 bg-[#0bbfe0] rounded-full flex items-center justify-center text-white font-medium">
                            {booking.passenger_name
                              ? booking.passenger_name.charAt(0).toUpperCase()
                              : "U"}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {booking.passenger_name || "Unknown"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {booking.passenger_phone || "No phone"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-start">
                          <MapPin className="w-4 h-4 text-[#0bbfe0] mt-0.5 mr-1 flex-shrink-0" />
                          <span className="text-sm text-gray-500 line-clamp-2">
                            {booking.pickup_location}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-start">
                          <MapPin className="w-4 h-4 text-red-500 mt-0.5 mr-1 flex-shrink-0" />
                          <span className="text-sm text-gray-500 line-clamp-2">
                            {booking.drop_location}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                          {formatDate(booking.pickup_date_time)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-500">
                          {getTripTypeLabel(booking.trip_type)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ₹{booking.price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                            booking.trip_status
                          )}`}
                        >
                          {getTripStatusLabel(booking.trip_status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {booking.driver_name ? (
                          <div className="flex items-center">
                            <Car className="w-4 h-4 mr-1 text-gray-400" />
                            <span className="text-sm text-gray-500">
                              {booking.driver_name}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">
                            Not assigned
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="9"
                      className="px-6 py-10 text-center text-gray-500"
                    >
                      {searchTerm
                        ? "No bookings found matching your search."
                        : "No bookings available."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Driver Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100"
        >
          <div className="p-6 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  Driver Management
                </h2>
                <p className="text-gray-500 text-sm">
                  Monitor your driver fleet and their activities
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Driver
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vehicle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    License Plate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vehicle Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {vendorDriverData.length > 0 ? (
                  vendorDriverData.map((driver, index) => (
                    <tr
                      key={driver.did || index}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-[#077286] rounded-full flex items-center justify-center text-white font-medium">
                            {driver.driver_name
                              ? driver.driver_name.charAt(0).toUpperCase()
                              : "D"}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {driver.driver_name || "Unknown"}
                            </div>
                            <div className="text-xs text-gray-500">
                              ID: {driver.did}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {driver.driver_phone || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {driver.car_name || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {driver.car_number || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            driver.car_type == 1
                              ? "bg-blue-100 text-blue-800"
                              : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {driver.car_type == 1
                            ? "Sedan"
                            : driver.car_type == 2
                            ? "SUV"
                            : "Unknown"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-10 text-center text-gray-500"
                    >
                      No drivers available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default VendorDashboardContent;

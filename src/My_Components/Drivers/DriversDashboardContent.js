
// import { useState, useEffect } from "react"
// import { motion, AnimatePresence } from "framer-motion"
// import { useNavigate } from "react-router-dom"
// import secureLocalStorage from "react-secure-storage"
// import toast from "react-hot-toast"
// import axiosInstance from "../../API/axiosInstance" 
// import {
//   Car,
//   User,
//   MapPin,
//   DollarSign,
//   Star,
//   Calendar,
//   TrendingUp,
//   BarChart3,
//   Bell,
//   LogOut,
//   Menu,
//   X,
//   ChevronRight,
//   ChevronDown,
//   CheckCircle,
//   AlertCircle,
//   Wallet,
//   FileText,
//   Settings,
//   HelpCircle,
//   Zap,
//   Award,
//   Compass,
//   ArrowUpRight,
//   CircleDollarSign,
//   Banknote,
//   Percent,
//   MessageSquare,
//   ThumbsUp,
//   MapPinned,
//   Route,
//   RefreshCw,
//   Mail,
//   Phone,
//   BarChart2,
// } from "lucide-react"

// export default function DriverDashboard() {
//   const navigate = useNavigate()
//   const uid = localStorage.getItem("@secure.n.uid")
//   const decryptedUID = secureLocalStorage.getItem("uid")
//   const [did, setDid] = useState(null)

//   // State variables
//   const [isLoading, setIsLoading] = useState(false)
//   const [activeSection, setActiveSection] = useState("dashboard")
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
//   const [driverStatus, setDriverStatus] = useState("online") // online, offline, busy
//   const [trips, setTrips] = useState([])
//   const [currentTrip, setCurrentTrip] = useState(null)
//   const [pastTrips, setPastTrips] = useState([])
//   const [wallet, setWallet] = useState({ balance: 0, updated_at: "", role: "Driver" });
//   const [earnings, setEarnings] = useState({ today: 0, week: 0, month: 0, year: 0 })
//   const [reviews, setReviews] = useState([])
//   const [driverInfo, setDriverInfo] = useState({
//     name: "",
//     email: "",
//     phone_number: "",
//     car_name: "",
//     car_number: "",
//     car_type: "",
//     model_year: "",
//   })
//   const [stats, setStats] = useState({
//     totalTrips: 0,
//     totalEarnings: 0,
//     avgRating: 0,
//     completionRate: 0,
//   })

//   const [transactions, setTransactions] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       setIsLoading(true); // Start loading
//       try {
//         // Fetch profile first to get `did`
//         const profileRes = await axiosInstance.post(
//           `${process.env.REACT_APP_BASE_URL}/drivers/fetchProfileData`,
//           { decryptedUID }
//         );

//         if (profileRes.status === 200) {
//           console.log("Profile data:", profileRes.data);
//           setDriverInfo(profileRes.data);
//           setDid(profileRes.data.did);

//           const driverId = profileRes.data.did;

//           // Parallel API calls after fetching `did`
//           const [
//             walletRes,
//             earningsRes,
//             tripsRes,
//             reviewsRes,
//             statsRes,
//             transactionsRes,
//           ] = await Promise.all([
//             axiosInstance.post(`${process.env.REACT_APP_BASE_URL}/drivers/fetchWalletBalance`, {
//               decryptedUID,
//               driver_id: driverId,
//             }),
//             axiosInstance.post(`${process.env.REACT_APP_BASE_URL}/drivers/fetchEarnings`, {
//               decryptedUID,
//               driver_id: driverId,
//             }),
//             axiosInstance.post(`${process.env.REACT_APP_BASE_URL}/drivers/fetchTrips`, {
//               decryptedUID,
//               driver_id: driverId,
//             }),
//             axiosInstance.post(`${process.env.REACT_APP_BASE_URL}/drivers/fetchReviews`, {
//               decryptedUID,
//               driver_id: driverId,
//             }),
//             axiosInstance.post(`${process.env.REACT_APP_BASE_URL}/drivers/fetchStats`, {
//               decryptedUID,
//               driver_id: driverId,
//             }),
//             axiosInstance.post(`${process.env.REACT_APP_BASE_URL}/drivers/fetchTransactions`, {
//               decryptedUID,
//               driver_id: driverId,
//             }),
//           ]);

//           // Handle wallet response
//           if (walletRes.status === 200) {
//             console.log("Wallet balance:", walletRes.data);
//             setWallet({
//               balance: walletRes.data.balance,
//               updated_at: walletRes.data.updated_at,
//               role: "Driver",
//             });
//           }

//           // Handle earnings response
//           if (earningsRes.status === 200) {
//             console.log("Earnings:", earningsRes.data);
//             setEarnings(earningsRes.data);
//           }

//           // Handle trips response
//           if (tripsRes.status === 200) {
//             console.log("Trips data:", tripsRes.data);
//             setTrips(tripsRes.data);
//             setPastTrips(tripsRes.data);
//           }

//           // Handle reviews response
//           if (reviewsRes.status === 200) {
//             console.log("Reviews data:", reviewsRes.data);
//             setReviews(reviewsRes.data);
//           }

//           // Handle stats response
//           if (statsRes.status === 200) {
//             console.log("Stats data:", statsRes.data);
//             setStats(statsRes.data);
//           }

//           // Handle transactions response
//           if (transactionsRes.status === 200) {
//             console.log("Transactions data:", transactionsRes.data);
//             setTransactions(transactionsRes.data);
//           }
//         }
//       } catch (err) {
//         console.error("Error fetching data:", err);
//         toast.error("Failed to fetch data");
//       } finally {
//         setIsLoading(false); // Stop loading
//       }
//     };

//     fetchData();
//   }, [decryptedUID]);


//   const toggleDriverStatus = async () => {
//     try {
//       const newStatus = driverStatus === "online" ? "offline" : "online"

//       const res = await axiosInstance.post(`${process.env.REACT_APP_BASE_URL}/drivers/updateStatus`, {
//         decryptedUID,
//         status: newStatus,
//       })

//       if (res.status === 200) {
//         setDriverStatus(newStatus)
//         toast.success(`You are now ${newStatus}`)
//       }
//     } catch (error) {
//       console.error("Error updating status:", error)
//       toast.error("Failed to update status")
//     }
//   }


//   const handleLogout = () => {
//     // Clear local storage and navigate to login
//     localStorage.removeItem("@secure.n.uid")
//     secureLocalStorage.removeItem("uid")
//     navigate("/")
//   }

//   const formatDate = (dateString) => {
//     const options = {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     }
//     return new Date(dateString).toLocaleDateString("en-US", options)
//   }

//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat("en-IN", {
//       style: "currency",
//       currency: "INR",
//       maximumFractionDigits: 0,
//     }).format(amount)
//   }

//   const getStatusText = (status) => {
//     const statusMap = {
//       0: "Pending",
//       1: "Accepted",
//       2: "Driver Arrived",
//       3: "Trip Started",
//       4: "Trip In Progress",
//       5: "Completed",
//       6: "Cancelled By Passenger",
//       7: "Cancelled By Driver",
//     }
//     return statusMap[status] || "Unknown"
//   }

//   const getStatusColor = (status) => {
//     const colorMap = {
//       0: "bg-amber-500",
//       1: "bg-blue-500",
//       2: "bg-purple-500",
//       3: "bg-indigo-500",
//       4: "bg-cyan-500",
//       5: "bg-emerald-500",
//       6: "bg-rose-500",
//       7: "bg-rose-500",
//     }
//     return colorMap[status] || "bg-gray-500"
//   }

//   const getCarTypeText = (type) => {
//     const typeMap = {
//       1: "Sedan (4+1)",
//       2: "SUV/MUV (6+1)",
//     }
//     return typeMap[type] || type
//   }

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
//         <motion.div
//           animate={{ rotate: 360 }}
//           transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
//         >
//           <RefreshCw size={48} className="text-cyan-500" />
//         </motion.div>
//         <p className="mt-4 text-lg font-medium text-gray-700">Loading your dashboard...</p>
//       </div>
//     )
//   }

//   if (!uid) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//           className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full text-center"
//         >
//           <AlertCircle size={48} className="mx-auto mb-4 text-rose-500" />
//           <h2 className="text-2xl font-bold mb-4">Session Expired</h2>
//           <p className="mb-6 text-gray-600">Please login again to access your dashboard.</p>
//           <button
//             onClick={() => navigate("/")}
//             className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center mx-auto"
//           >
//             Back to Login
//             <ChevronRight size={18} className="ml-2" />
//           </button>
//         </motion.div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col">
//       {/* Header */}
//       <header className="bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-md">
//         <div className="container mx-auto px-4 py-3 flex justify-between items-center">
//           <div className="flex items-center">
//             <button className="md:hidden mr-4" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
//               {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
//             </button>
//             <div className="flex items-center">
//               <Car className="mr-2" size={24} />
//               <h1 className="text-xl font-bold">Driver Hub</h1>
//             </div>
//           </div>

//           <div className="flex items-center space-x-4">
//             {/* Driver Status Toggle */}
//             <div className="flex items-center">
//               <button
//                 onClick={toggleDriverStatus}
//                 className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${driverStatus === "online" ? "bg-emerald-500 text-white" : "bg-gray-200 text-gray-700"
//                   }`}
//               >
//                 <span
//                   className={`w-2 h-2 rounded-full mr-2 ${driverStatus === "online" ? "bg-white" : "bg-gray-500"}`}
//                 ></span>
//                 {driverStatus === "online" ? "Online" : "Offline"}
//               </button>
//             </div>



//             {/* User Menu */}
//             <div className="relative group">
//               <button className="flex items-center">
//                 <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-medium">
//                   {driverInfo.name.charAt(0)}
//                 </div>
//                 <ChevronDown size={16} className="ml-1" />
//               </button>

//               <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
//                 <div className="p-3 border-b border-gray-100">
//                   <p className="font-medium text-sm">{driverInfo.name}</p>
//                   <p className="text-xs text-gray-500">{driverInfo.email}</p>
//                 </div>
//                 <div>
//                   <button
//                     className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
//                     onClick={() => setActiveSection("profile")}
//                   >
//                     <User size={16} className="mr-2" />
//                     Profile
//                   </button>
//                   <button
//                     className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
//                     onClick={() => setActiveSection("settings")}
//                   >
//                     <Settings size={16} className="mr-2" />
//                     Settings
//                   </button>
//                   <button
//                     className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
//                     onClick={handleLogout}
//                   >
//                     <LogOut size={16} className="mr-2" />
//                     Logout
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Mobile Menu */}
//       <AnimatePresence>
//         {isMobileMenuOpen && (
//           <motion.div
//             initial={{ x: -300, opacity: 0 }}
//             animate={{ x: 0, opacity: 1 }}
//             exit={{ x: -300, opacity: 0 }}
//             className="fixed inset-0 z-50 bg-black bg-opacity-50"
//             onClick={() => setIsMobileMenuOpen(false)}
//           >
//             <div className="w-64 h-full bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
//               <div className="p-4 border-b border-gray-200">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center">
//                     <Car className="mr-2 text-cyan-600" size={20} />
//                     <h2 className="font-bold text-lg">Driver Hub</h2>
//                   </div>
//                   <button onClick={() => setIsMobileMenuOpen(false)}>
//                     <X size={20} />
//                   </button>
//                 </div>
//               </div>

//               <div className="p-4 border-b border-gray-200">
//                 <div className="flex items-center space-x-3">
//                   <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600 font-medium">
//                     {driverInfo.name.charAt(0)}
//                   </div>
//                   <div>
//                     <p className="font-medium">{driverInfo.name}</p>
//                     <p className="text-xs text-gray-500">{driverInfo.email}</p>
//                   </div>
//                 </div>

//                 <div className="mt-4">
//                   <button
//                     onClick={toggleDriverStatus}
//                     className={`w-full px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center ${driverStatus === "online" ? "bg-emerald-500 text-white" : "bg-gray-200 text-gray-700"
//                       }`}
//                   >
//                     <span
//                       className={`w-2 h-2 rounded-full mr-2 ${driverStatus === "online" ? "bg-white" : "bg-gray-500"}`}
//                     ></span>
//                     {driverStatus === "online" ? "Online" : "Offline"}
//                   </button>
//                 </div>
//               </div>

//               <nav className="p-4">
//                 <ul className="space-y-2">
//                   <li>
//                     <button
//                       onClick={() => {
//                         setActiveSection("dashboard")
//                         setIsMobileMenuOpen(false)
//                       }}
//                       className={`w-full flex items-center px-3 py-2 rounded-lg text-sm ${activeSection === "dashboard"
//                         ? "bg-cyan-50 text-cyan-600 font-medium"
//                         : "text-gray-700 hover:bg-gray-100"
//                         }`}
//                     >
//                       <BarChart3 size={18} className="mr-3" />
//                       Dashboard
//                     </button>
//                   </li>
//                   <li>
//                     <button
//                       onClick={() => {
//                         setActiveSection("trips")
//                         setIsMobileMenuOpen(false)
//                       }}
//                       className={`w-full flex items-center px-3 py-2 rounded-lg text-sm ${activeSection === "trips"
//                         ? "bg-cyan-50 text-cyan-600 font-medium"
//                         : "text-gray-700 hover:bg-gray-100"
//                         }`}
//                     >
//                       <Route size={18} className="mr-3" />
//                       My Trips
//                     </button>
//                   </li>
//                   <li>
//                     <button
//                       onClick={() => {
//                         setActiveSection("earnings")
//                         setIsMobileMenuOpen(false)
//                       }}
//                       className={`w-full flex items-center px-3 py-2 rounded-lg text-sm ${activeSection === "earnings"
//                         ? "bg-cyan-50 text-cyan-600 font-medium"
//                         : "text-gray-700 hover:bg-gray-100"
//                         }`}
//                     >
//                       <Wallet size={18} className="mr-3" />
//                       Earnings
//                     </button>
//                   </li>
//                   <li>
//                     <button
//                       onClick={() => {
//                         setActiveSection("performance")
//                         setIsMobileMenuOpen(false)
//                       }}
//                       className={`w-full flex items-center px-3 py-2 rounded-lg text-sm ${activeSection === "performance"
//                         ? "bg-cyan-50 text-cyan-600 font-medium"
//                         : "text-gray-700 hover:bg-gray-100"
//                         }`}
//                     >
//                       <Award size={18} className="mr-3" />
//                       Performance
//                     </button>
//                   </li>
//                   <li>
//                     <button
//                       onClick={() => {
//                         setActiveSection("profile")
//                         setIsMobileMenuOpen(false)
//                       }}
//                       className={`w-full flex items-center px-3 py-2 rounded-lg text-sm ${activeSection === "profile"
//                         ? "bg-cyan-50 text-cyan-600 font-medium"
//                         : "text-gray-700 hover:bg-gray-100"
//                         }`}
//                     >
//                       <User size={18} className="mr-3" />
//                       Profile
//                     </button>
//                   </li>
//                   <li>
//                     <button
//                       onClick={() => {
//                         setActiveSection("help")
//                         setIsMobileMenuOpen(false)
//                       }}
//                       className={`w-full flex items-center px-3 py-2 rounded-lg text-sm ${activeSection === "help"
//                         ? "bg-cyan-50 text-cyan-600 font-medium"
//                         : "text-gray-700 hover:bg-gray-100"
//                         }`}
//                     >
//                       <HelpCircle size={18} className="mr-3" />
//                       Help & Support
//                     </button>
//                   </li>
//                 </ul>
//               </nav>

//               <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
//                 <button
//                   onClick={handleLogout}
//                   className="w-full flex items-center justify-center px-3 py-2 rounded-lg text-sm text-rose-600 hover:bg-rose-50"
//                 >
//                   <LogOut size={18} className="mr-2" />
//                   Logout
//                 </button>
//               </div>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col">
//         {/* Tab Navigation */}
//         <div className="w-full bg-white border-b border-gray-200 shadow-sm">
//           <div className="flex overflow-x-auto no-scrollbar">
//             {[
//               { id: "dashboard", label: "Dashboard", icon: <BarChart3 size={18} /> },
//               { id: "trips", label: "My Trips", icon: <Route size={18} /> },
//               { id: "earnings", label: "Earnings", icon: <Wallet size={18} /> },
//               { id: "performance", label: "Performance", icon: <Award size={18} /> },
//               { id: "profile", label: "Profile", icon: <User size={18} /> },
//               { id: "help", label: "Help & Support", icon: <HelpCircle size={18} /> },
//             ].map((tab) => (
//               <button
//                 key={tab.id}
//                 onClick={() => setActiveSection(tab.id)}
//                 className={`flex items-center px-4 py-3 text-sm whitespace-nowrap border-b-2 ${activeSection === tab.id
//                   ? "border-cyan-500 text-cyan-600 font-medium"
//                   : "border-transparent text-gray-600 hover:text-cyan-600"
//                   }`}
//               >
//                 <span className="mr-2">{tab.icon}</span>
//                 {tab.label}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Main Content Area */}
//         <main className="flex-1 overflow-auto p-4 md:p-6">
//           <AnimatePresence mode="wait">
//             {/* Dashboard Section */}
//             {activeSection === "dashboard" && (
//               <motion.div
//                 key="dashboard"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 <div className="mb-6">
//                   <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
//                   <p className="text-gray-600">Welcome back, {driverInfo.name}</p>
//                 </div>

//                 {/* Status Card */}
//                 <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
//                   <div className="flex flex-col md:flex-row md:items-center md:justify-between">
//                     <div className="flex items-center mb-4 md:mb-0">
//                       <div
//                         className={`w-12 h-12 rounded-full flex items-center justify-center ${driverStatus === "online" ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-600"
//                           }`}
//                       >
//                         <Zap size={24} />
//                       </div>
//                       <div className="ml-4">
//                         <p className="text-sm text-gray-500">Current Status</p>
//                         <p className="font-semibold text-lg capitalize">{driverStatus}</p>
//                       </div>
//                     </div>
//                     <button
//                       onClick={toggleDriverStatus}
//                       className={`px-4 py-2 rounded-lg text-sm font-medium ${driverStatus === "online"
//                         ? "bg-emerald-500 text-white hover:bg-emerald-600"
//                         : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//                         }`}
//                     >
//                       {driverStatus === "online" ? "Go Offline" : "Go Online"}
//                     </button>
//                   </div>
//                 </div>

//                 {/* Stats Cards */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//                   <motion.div
//                     className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
//                     whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
//                     transition={{ duration: 0.2 }}
//                   >
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="text-sm text-gray-500">Today's Earnings</p>
//                         <p className="text-xl font-bold">{formatCurrency(earnings.today)}</p>
//                       </div>
//                       <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600">
//                         <DollarSign size={20} />
//                       </div>
//                     </div>
//                     <div className="mt-2 flex items-center text-xs text-emerald-600">
//                       <ArrowUpRight size={14} className="mr-1" />
//                       <span>+12% from yesterday</span>
//                     </div>
//                   </motion.div>

//                   <motion.div
//                     className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
//                     whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
//                     transition={{ duration: 0.2 }}
//                   >
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="text-sm text-gray-500">Total Trips</p>
//                         <p className="text-xl font-bold">{stats.totalTrips}</p>
//                       </div>
//                       <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
//                         <Route size={20} />
//                       </div>
//                     </div>
//                     <div className="mt-2 flex items-center text-xs text-emerald-600">
//                       <ArrowUpRight size={14} className="mr-1" />
//                       <span>+3 this week</span>
//                     </div>
//                   </motion.div>

//                   <motion.div
//                     className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
//                     whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
//                     transition={{ duration: 0.2 }}
//                   >
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="text-sm text-gray-500">Rating</p>
//                         <div className="flex items-center">
//                           <p className="text-xl font-bold">
//                             {(parseFloat(stats.avgRating) || 0).toFixed(1)}
//                           </p>
//                           <Star size={16} className="ml-1 text-amber-400" />
//                         </div>
//                       </div>
//                       <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
//                         <Star size={20} />
//                       </div>
//                     </div>
//                     <div className="mt-2 flex items-center text-xs text-emerald-600">
//                       <CheckCircle size={14} className="mr-1" />
//                       <span>Excellent</span>
//                     </div>
//                   </motion.div>

//                   <motion.div
//                     className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
//                     whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
//                     transition={{ duration: 0.2 }}
//                   >
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="text-sm text-gray-500">Completion Rate</p>
//                         <p className="text-xl font-bold">{stats.completionRate}%</p>
//                       </div>
//                       <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-600">
//                         <CheckCircle size={20} />
//                       </div>
//                     </div>
//                     <div className="mt-2 flex items-center text-xs text-emerald-600">
//                       <ArrowUpRight size={14} className="mr-1" />
//                       <span>+2% from last month</span>
//                     </div>
//                   </motion.div>
//                 </div>

//                 {/* Recent Trips */}
//                 <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
//                   <div className="flex items-center justify-between mb-4">
//                     <h3 className="font-semibold text-lg">Recent Trips</h3>
//                     <button
//                       className="text-sm text-cyan-600 hover:text-cyan-700"
//                       onClick={() => setActiveSection("trips")}
//                     >
//                       View All
//                     </button>
//                   </div>

//                   <div className="overflow-x-auto">
//                     <table className="min-w-full divide-y divide-gray-200">
//                       <thead>
//                         <tr>
//                           <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                             Trip ID
//                           </th>
//                           <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                             Date
//                           </th>
//                           <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                             Route
//                           </th>
//                           <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                             Fare
//                           </th>
//                           <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                             Status
//                           </th>
//                         </tr>
//                       </thead>
//                       <tbody className="divide-y divide-gray-200">
//                         {trips.slice(0, 3).map((trip) => (
//                           <tr key={trip.bid} className="hover:bg-gray-50">
//                             <td className="px-4 py-3 text-sm font-medium text-gray-900">#{trip.bid}</td>
//                             <td className="px-4 py-3 text-sm text-gray-500">{formatDate(trip.pickup_date_time)}</td>
//                             <td className="px-4 py-3 text-sm text-gray-500">
//                               <div className="flex items-center">
//                                 <MapPin size={14} className="text-gray-400 mr-1" />
//                                 <span className="truncate max-w-[150px]">{trip.pickup_location}</span>
//                                 <ChevronRight size={14} className="mx-1 text-gray-300" />
//                                 <MapPin size={14} className="text-gray-400 mr-1" />
//                                 <span className="truncate max-w-[150px]">{trip.drop_location}</span>
//                               </div>
//                             </td>
//                             <td className="px-4 py-3 text-sm font-medium text-gray-900">
//                               {formatCurrency(trip.price)}
//                             </td>
//                             <td className="px-4 py-3 text-sm">
//                               <span
//                                 className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(trip.trip_status)} text-white`}
//                               >
//                                 {getStatusText(trip.trip_status)}
//                               </span>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>

//                 {/* Recent Reviews */}
//                 <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
//                   <div className="flex items-center justify-between mb-4">
//                     <h3 className="font-semibold text-lg">Recent Reviews</h3>
//                     <button
//                       className="text-sm text-cyan-600 hover:text-cyan-700"
//                       onClick={() => setActiveSection("performance")}
//                     >
//                       View All
//                     </button>
//                   </div>

//                   <div className="space-y-4">
//                     {reviews.slice(0, 3).map((review) => (
//                       <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
//                         <div className="flex items-center justify-between">
//                           <div className="flex items-center">
//                             <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
//                               <User size={16} />
//                             </div>
//                             <div className="ml-3">
//                               <p className="text-sm font-medium">Trip #{review.bid}</p>
//                               <p className="text-xs text-gray-500">{formatDate(review.created_at)}</p>
//                             </div>
//                           </div>
//                           <div className="flex items-center">
//                             {Array.from({ length: review.rating }).map((_, i) => (
//                               <Star key={i} size={16} className="text-amber-400" />
//                             ))}
//                           </div>
//                         </div>
//                         <p className="mt-2 text-sm text-gray-600">{review.review}</p>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </motion.div>
//             )}

//             {/* Trips Section */}
//             {activeSection === "trips" && (
//               <motion.div
//                 key="trips"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 <div className="mb-6">
//                   <h2 className="text-2xl font-bold text-gray-800">My Trips</h2>
//                   <p className="text-gray-600">View and manage all your trips</p>
//                 </div>

//                 {/* Trip Filters */}
//                 <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
//                   <div className="flex flex-wrap gap-4">
//                     <div className="flex-1 min-w-[200px]">
//                       <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
//                       <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500">
//                         <option>Last 7 days</option>
//                         <option>Last 30 days</option>
//                         <option>Last 90 days</option>
//                         <option>Custom range</option>
//                       </select>
//                     </div>
//                     <div className="flex-1 min-w-[200px]">
//                       <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
//                       <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500">
//                         <option>All Statuses</option>
//                         <option>Completed</option>
//                         <option>Cancelled</option>
//                         <option>In Progress</option>
//                       </select>
//                     </div>
//                     <div className="flex items-end">
//                       <button className="bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 transition-colors">
//                         Apply Filters
//                       </button>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Trips List */}
//                 <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
//                   <div className="overflow-x-auto">
//                     <table className="min-w-full divide-y divide-gray-200">
//                       <thead className="bg-gray-50">
//                         <tr>
//                           <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                             Trip ID
//                           </th>
//                           <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                             Date & Time
//                           </th>
//                           <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                             Passenger
//                           </th>
//                           <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                             Route
//                           </th>
//                           <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                             Distance
//                           </th>
//                           <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                             Fare
//                           </th>
//                           <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                             Status
//                           </th>
//                           <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                             Actions
//                           </th>
//                         </tr>
//                       </thead>
//                       <tbody className="divide-y divide-gray-200">
//                         {pastTrips.map((trip) => (
//                           <tr key={trip.bid} className="hover:bg-gray-50">
//                             <td className="px-4 py-3 text-sm font-medium text-gray-900">#{trip.bid}</td>
//                             <td className="px-4 py-3 text-sm text-gray-500">{formatDate(trip.pickup_date_time)}</td>
//                             <td className="px-4 py-3 text-sm text-gray-900">
//                               <div className="flex items-center">
//                                 <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
//                                   <User size={16} />
//                                 </div>
//                                 <div className="ml-2">
//                                   <p className="font-medium">{trip.passenger_name}</p>
//                                   <p className="text-xs text-gray-500">{trip.passenger_phone}</p>
//                                 </div>
//                               </div>
//                             </td>
//                             <td className="px-4 py-3 text-sm text-gray-500">
//                               <div className="flex flex-col">
//                                 <div className="flex items-center">
//                                   <MapPin size={14} className="text-emerald-500 mr-1" />
//                                   <span className="truncate max-w-[150px]">{trip.pickup_location}</span>
//                                 </div>
//                                 <div className="flex items-center mt-1">
//                                   <MapPin size={14} className="text-rose-500 mr-1" />
//                                   <span className="truncate max-w-[150px]">{trip.drop_location}</span>
//                                 </div>
//                               </div>
//                             </td>
//                             <td className="px-4 py-3 text-sm text-gray-500">{trip.distance}</td>
//                             <td className="px-4 py-3 text-sm font-medium text-gray-900">
//                               {formatCurrency(trip.price)}
//                             </td>
//                             <td className="px-4 py-3 text-sm">
//                               <span
//                                 className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(trip.trip_status)} text-white`}
//                               >
//                                 {getStatusText(trip.trip_status)}
//                               </span>
//                             </td>
//                             <td className="px-4 py-3 text-sm">
//                               <button className="text-cyan-600 hover:text-cyan-700">View Details</button>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>

//                   {/* Pagination */}
//                   <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200">
//                     <div className="flex-1 flex justify-between sm:hidden">
//                       <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
//                         Previous
//                       </button>
//                       <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
//                         Next
//                       </button>
//                     </div>
//                     <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
//                       <div>
//                         <p className="text-sm text-gray-700">
//                           Showing <span className="font-medium">1</span> to{" "}
//                           <span className="font-medium">{pastTrips.length}</span> of{" "}
//                           <span className="font-medium">{pastTrips.length}</span> results
//                         </p>
//                       </div>
//                       <div>
//                         <nav
//                           className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
//                           aria-label="Pagination"
//                         >
//                           <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
//                             <span className="sr-only">Previous</span>
//                             <ChevronRight className="h-5 w-5 transform rotate-180" />
//                           </button>
//                           <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-cyan-50 text-sm font-medium text-cyan-600 hover:bg-cyan-100">
//                             1
//                           </button>
//                           <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
//                             <span className="sr-only">Next</span>
//                             <ChevronRight className="h-5 w-5" />
//                           </button>
//                         </nav>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </motion.div>
//             )}

//             {/* Earnings Section */}
//             {activeSection === "earnings" && (
//               <motion.div
//                 key="earnings"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 <div className="mb-6">
//                   <h2 className="text-2xl font-bold text-gray-800">Earnings</h2>
//                   <p className="text-gray-600">Track your income and payment history</p>
//                 </div>

//                 {/* Earnings Summary */}
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//                   <motion.div
//                     className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
//                     whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
//                     transition={{ duration: 0.2 }}
//                   >
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="text-sm text-gray-500">Today's Earnings</p>
//                         <p className="text-xl font-bold">{formatCurrency(earnings.today)}</p>
//                       </div>
//                       <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600">
//                         <DollarSign size={20} />
//                       </div>
//                     </div>
//                   </motion.div>

//                   <motion.div
//                     className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
//                     whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
//                     transition={{ duration: 0.2 }}
//                   >
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="text-sm text-gray-500">This Week</p>
//                         <p className="text-xl font-bold">{formatCurrency(earnings.week)}</p>
//                       </div>
//                       <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
//                         <Calendar size={20} />
//                       </div>
//                     </div>
//                   </motion.div>

//                   <motion.div
//                     className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
//                     whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
//                     transition={{ duration: 0.2 }}
//                   >
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="text-sm text-gray-500">This Month</p>
//                         <p className="text-xl font-bold">{formatCurrency(earnings.month)}</p>
//                       </div>
//                       <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-600">
//                         <TrendingUp size={20} />
//                       </div>
//                     </div>
//                   </motion.div>

//                   <motion.div
//                     className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
//                     whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
//                     transition={{ duration: 0.2 }}
//                   >
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="text-sm text-gray-500">This Year</p>
//                         <p className="text-xl font-bold">{formatCurrency(earnings.year)}</p>
//                       </div>
//                       <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
//                         <BarChart2 size={20} />
//                       </div>
//                     </div>
//                   </motion.div>
//                 </div>

//                 <div className="bg-gradient-to-r from-cyan-500 to-teal-500 rounded-xl shadow-md p-6 mb-6 text-white">
//                   <div className="flex justify-between items-center">
//                     <div>
//                       <p className="text-white/80 text-sm">Wallet Balance</p>
//                       <p className="text-3xl font-bold mt-1">{formatCurrency(wallet.balance)}</p>
//                       <p className="text-white/80 text-sm mt-1">Role: {wallet.role}</p>
//                       <p className="text-white/80 text-sm mt-2">Last updated: {formatDate(wallet.updated_at)}</p>
//                     </div>
//                     <div className="hidden md:block">
//                       <Wallet size={48} className="text-white/80" />
//                     </div>
//                   </div>
//                   <div className="mt-6 flex flex-wrap gap-3">
//                     <button className="bg-white text-cyan-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
//                       Withdraw Funds
//                     </button>
//                     <button className="bg-white/20 text-white px-4 py-2 rounded-lg font-medium hover:bg-white/30 transition-colors">
//                       Transaction History
//                     </button>
//                   </div>
//                 </div>

//                 {/* Earnings Breakdown */}
//                 {/* <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
//                   <h3 className="font-semibold text-lg mb-4">Earnings Breakdown</h3>

//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                     <div className="flex flex-col items-center p-4 bg-cyan-50 rounded-lg">
//                       <div className="w-16 h-16 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600 mb-3">
//                         <Banknote size={28} />
//                       </div>
//                       <p className="text-lg font-bold">{earningsBreakdown.driver}%</p>
//                       <p className="text-sm text-gray-600">Driver Share</p>
//                     </div>

//                     <div className="flex flex-col items-center p-4 bg-purple-50 rounded-lg">
//                       <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mb-3">
//                         <CircleDollarSign size={28} />
//                       </div>
//                       <p className="text-lg font-bold">{earningsBreakdown.admin}%</p>
//                       <p className="text-sm text-gray-600">Admin Fee</p>
//                     </div>

//                     <div className="flex flex-col items-center p-4 bg-teal-50 rounded-lg">
//                       <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 mb-3">
//                         <Percent size={28} />
//                       </div>
//                       <p className="text-lg font-bold">{earningsBreakdown.vendor}%</p>
//                       <p className="text-sm text-gray-600">Vendor Fee</p>
//                     </div>
//                   </div>

//                   <div className="mt-6 p-4 bg-gray-50 rounded-lg">
//                     <p className="text-sm text-gray-600">
//                       For each trip, you receive {earningsBreakdown.driver}% of the fare. The remaining{" "}
//                       {100 - earningsBreakdown.driver}% is distributed as {earningsBreakdown.admin}% to admin and{" "}
//                       {earningsBreakdown.vendor}% to vendor.
//                     </p>
//                   </div>
//                 </div> */}

//                 {/* Recent Transactions */}
//                 <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
//                   <div className="p-4 border-b border-gray-100">
//                     <h3 className="font-semibold text-lg">Recent Transactions</h3>
//                   </div>

//                   <div className="overflow-x-auto">
//                     <table className="min-w-full divide-y divide-gray-200">
//                       <thead className="bg-gray-50">
//                         <tr>
//                           <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                             Transaction ID
//                           </th>
//                           <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                             Date
//                           </th>
//                           <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                             Trip ID
//                           </th>
//                           <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                             Amount
//                           </th>
//                           <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                             Type
//                           </th>
//                           <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                             Status
//                           </th>
//                         </tr>
//                       </thead>
//                       <tbody className="divide-y divide-gray-200">
//                         {transactions.length > 0 ? (
//                           transactions.map((transaction) => (
//                             <tr key={transaction.id} className="hover:bg-gray-50">
//                               <td className="px-4 py-3 text-sm font-medium text-gray-900">#{transaction.id}</td>
//                               <td className="px-4 py-3 text-sm text-gray-500">{formatDate(transaction.date)}</td>
//                               <td className="px-4 py-3 text-sm text-gray-500">
//                                 {transaction.trip_id ? `#${transaction.trip_id}` : "-"}
//                               </td>
//                               <td className="px-4 py-3 text-sm font-medium text-emerald-600">
//                                 {transaction.type === "credit" ? "+" : "-"}
//                                 {formatCurrency(transaction.amount)}
//                               </td>
//                               <td className="px-4 py-3 text-sm text-gray-500">{transaction.description}</td>
//                               <td className="px-4 py-3 text-sm">
//                                 <span
//                                   className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${transaction.status === "completed"
//                                     ? "bg-emerald-100 text-emerald-800"
//                                     : transaction.status === "processing"
//                                       ? "bg-amber-100 text-amber-800"
//                                       : "bg-gray-100 text-gray-800"
//                                     }`}
//                                 >
//                                   {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
//                                 </span>
//                               </td>
//                             </tr>
//                           ))
//                         ) : (
//                           <tr>
//                             <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
//                               No transactions found
//                             </td>
//                           </tr>
//                         )}
//                       </tbody>
//                     </table>
//                   </div>

//                   {/* Pagination */}
//                   <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200">
//                     <div className="flex-1 flex justify-between sm:hidden">
//                       <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
//                         Previous
//                       </button>
//                       <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
//                         Next
//                       </button>
//                     </div>
//                     <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
//                       <div>
//                         <p className="text-sm text-gray-700">
//                           Showing <span className="font-medium">1</span> to{" "}
//                           <span className="font-medium">{transactions.length}</span> of{" "}
//                           <span className="font-medium">{transactions.length}</span> results
//                         </p>
//                       </div>
//                       <div>
//                         <nav
//                           className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
//                           aria-label="Pagination"
//                         >
//                           <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
//                             <span className="sr-only">Previous</span>
//                             <ChevronRight className="h-5 w-5 transform rotate-180" />
//                           </button>
//                           <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-cyan-50 text-sm font-medium text-cyan-600 hover:bg-cyan-100">
//                             1
//                           </button>
//                           <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
//                             <span className="sr-only">Next</span>
//                             <ChevronRight className="h-5 w-5" />
//                           </button>
//                         </nav>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </motion.div>
//             )}

//             {/* Performance Section */}
//             {activeSection === "performance" && (
//               <motion.div
//                 key="performance"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 <div className="mb-6">
//                   <h2 className="text-2xl font-bold text-gray-800">Performance</h2>
//                   <p className="text-gray-600">Track your ratings and performance metrics</p>
//                 </div>

//                 {/* Performance Report Card */}
//                 <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
//                   <h3 className="font-semibold text-lg mb-4">Driver Report Card</h3>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div>
//                       <div className="flex items-center justify-between mb-4">
//                         <div>
//                           <p className="text-sm text-gray-500">Overall Rating</p>
//                           <div className="flex items-center mt-1">
//                             <p className="text-3xl font-bold">
//                               {(parseFloat(stats.avgRating) || 0).toFixed(1)}
//                             </p>
//                             <div className="ml-2 flex">
//                               {Array.from({ length: 5 }).map((_, i) => (
//                                 <Star
//                                   key={i}
//                                   size={20}
//                                   className={i < Math.round(stats.avgRating) ? "text-amber-400" : "text-gray-200"}
//                                 />
//                               ))}
//                             </div>
//                           </div>
//                         </div>
//                         <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
//                           <Award size={36} />
//                         </div>
//                       </div>

//                       <div className="space-y-4">
//                         <div>
//                           <div className="flex items-center justify-between mb-1">
//                             <p className="text-sm font-medium">Trip Completion Rate</p>
//                             <p className="text-sm font-medium">{stats.completionRate}%</p>
//                           </div>
//                           <div className="w-full bg-gray-200 rounded-full h-2">
//                             <div
//                               className="bg-emerald-500 h-2 rounded-full"
//                               style={{ width: `${stats.completionRate}%` }}
//                             ></div>
//                           </div>
//                         </div>

//                         <div>
//                           <div className="flex items-center justify-between mb-1">
//                             <p className="text-sm font-medium">On-Time Arrival</p>
//                             <p className="text-sm font-medium">95%</p>
//                           </div>
//                           <div className="w-full bg-gray-200 rounded-full h-2">
//                             <div className="bg-cyan-500 h-2 rounded-full" style={{ width: "95%" }}></div>
//                           </div>
//                         </div>

//                         <div>
//                           <div className="flex items-center justify-between mb-1">
//                             <p className="text-sm font-medium">Customer Satisfaction</p>
//                             <p className="text-sm font-medium">98%</p>
//                           </div>
//                           <div className="w-full bg-gray-200 rounded-full h-2">
//                             <div className="bg-purple-500 h-2 rounded-full" style={{ width: "98%" }}></div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="bg-gray-50 rounded-lg p-4">
//                       <h4 className="font-medium mb-3">Performance Highlights</h4>
//                       <ul className="space-y-3">
//                         <li className="flex items-start">
//                           <CheckCircle size={18} className="text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
//                           <p className="text-sm text-gray-700">
//                             Maintained a perfect 5-star rating for the last 7 trips
//                           </p>
//                         </li>
//                         <li className="flex items-start">
//                           <CheckCircle size={18} className="text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
//                           <p className="text-sm text-gray-700">Completed 98% of all assigned trips</p>
//                         </li>
//                         <li className="flex items-start">
//                           <CheckCircle size={18} className="text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
//                           <p className="text-sm text-gray-700">Arrived on time for 95% of pickups</p>
//                         </li>
//                         <li className="flex items-start">
//                           <CheckCircle size={18} className="text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
//                           <p className="text-sm text-gray-700">Received positive comments for vehicle cleanliness</p>
//                         </li>
//                         <li className="flex items-start">
//                           <CheckCircle size={18} className="text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
//                           <p className="text-sm text-gray-700">No customer complaints in the last 30 days</p>
//                         </li>
//                       </ul>

//                       <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-lg">
//                         <p className="text-sm text-amber-800 flex items-start">
//                           <AlertCircle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
//                           Suggestion: Consider accepting more trip requests during peak hours to increase earnings.
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Reviews */}
//                 <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
//                   <h3 className="font-semibold text-lg mb-4">Customer Reviews</h3>

//                   <div className="space-y-6">
//                     {reviews.map((review) => (
//                       <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
//                         <div className="flex items-center justify-between">
//                           <div className="flex items-center">
//                             <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
//                               <User size={20} />
//                             </div>
//                             <div className="ml-3">
//                               <p className="font-medium">Trip #{review.bid}</p>
//                               <p className="text-xs text-gray-500">{formatDate(review.created_at)}</p>
//                             </div>
//                           </div>
//                           <div className="flex items-center">
//                             {Array.from({ length: review.rating }).map((_, i) => (
//                               <Star key={i} size={18} className="text-amber-400" />
//                             ))}
//                           </div>
//                         </div>
//                         <div className="mt-3 flex items-start">
//                           <MessageSquare size={18} className="text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
//                           <p className="text-gray-700">{review.review}</p>
//                         </div>
//                         <div className="mt-3 flex items-center text-xs text-gray-500">
//                           <ThumbsUp size={14} className="mr-1" />
//                           <span>Helpful review</span>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </motion.div>
//             )}

//             {/* Profile Section */}
//             {activeSection === "profile" && (
//               <motion.div
//                 key="profile"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 <div className="mb-6">
//                   <h2 className="text-2xl font-bold text-gray-800">Profile</h2>
//                   <p className="text-gray-600">Manage your personal and vehicle information</p>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                   {/* Profile Card */}
//                   <div className="md:col-span-1">
//                     <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
//                       <div className="flex flex-col items-center">
//                         <div className="w-24 h-24 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600 text-3xl font-bold mb-4">
//                           {driverInfo.name.charAt(0)}
//                         </div>
//                         <h3 className="text-xl font-bold">{driverInfo.name}</h3>
//                         <p className="text-gray-500 mt-1">Driver ID: {decryptedUID}</p>
//                         <div className="flex items-center mt-2">
//                           <Star className="text-amber-400" size={16} />
//                           <span className="ml-1 font-medium"> {(parseFloat(stats.avgRating) || 0).toFixed(1)}</span>
//                           <span className="mx-1 text-gray-400">•</span>
//                           <span className="text-gray-500">{stats.totalTrips} trips</span>
//                         </div>

//                         <div className="w-full mt-6 pt-6 border-t border-gray-100">
//                           <div className="flex items-center mb-4">
//                             <Mail size={18} className="text-gray-400 mr-3" />
//                             <div>
//                               <p className="text-sm text-gray-500">Email</p>
//                               <p className="font-medium">{driverInfo.email}</p>
//                             </div>
//                           </div>
//                           <div className="flex items-center mb-4">
//                             <Phone size={18} className="text-gray-400 mr-3" />
//                             <div>
//                               <p className="text-sm text-gray-500">Phone</p>
//                               <p className="font-medium">{driverInfo.phone_number}</p>
//                             </div>
//                           </div>
//                           <div className="flex items-center">
//                             <MapPinned size={18} className="text-gray-400 mr-3" />
//                             <div>
//                               <p className="text-sm text-gray-500">Location</p>
//                               <p className="font-medium">Mumbai, Maharashtra</p>
//                             </div>
//                           </div>
//                         </div>

//                         <button className="w-full mt-6 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors">
//                           Edit Profile
//                         </button>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Vehicle Information */}
//                   <div className="md:col-span-2">
//                     <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
//                       <h3 className="font-semibold text-lg mb-4">Vehicle Information</h3>

//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         <div className="flex items-center">
//                           <div className="w-12 h-12 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600 mr-4">
//                             <Car size={24} />
//                           </div>
//                           <div>
//                             <p className="text-sm text-gray-500">Car Model</p>
//                             <p className="font-medium text-lg">{driverInfo.car_name}</p>
//                           </div>
//                         </div>

//                         <div className="flex items-center">
//                           <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-4">
//                             <FileText size={24} />
//                           </div>
//                           <div>
//                             <p className="text-sm text-gray-500">Registration Number</p>
//                             <p className="font-medium text-lg">{driverInfo.car_number}</p>
//                           </div>
//                         </div>

//                         <div className="flex items-center">
//                           <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mr-4">
//                             <Calendar size={24} />
//                           </div>
//                           <div>
//                             <p className="text-sm text-gray-500">Model Year</p>
//                             <p className="font-medium text-lg">{driverInfo.model_year}</p>
//                           </div>
//                         </div>

//                         <div className="flex items-center">
//                           <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 mr-4">
//                             <Compass size={24} />
//                           </div>
//                           <div>
//                             <p className="text-sm text-gray-500">Car Type</p>
//                             <p className="font-medium text-lg">{getCarTypeText(driverInfo.car_type)}</p>
//                           </div>
//                         </div>
//                       </div>

//                       <div className="mt-6 p-4 bg-cyan-50 rounded-lg">
//                         <p className="text-sm text-cyan-800">
//                           All your vehicle documents have been verified. Remember to keep them updated before they
//                           expire.
//                         </p>
//                       </div>

//                       <div className="mt-6">
//                         <button className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors">
//                           Update Vehicle Information
//                         </button>
//                       </div>
//                     </div>

//                     {/* Document Status */}
//                     <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
//                       <h3 className="font-semibold text-lg mb-4">Document Status</h3>

//                       <div className="space-y-4">
//                         <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                           <div className="flex items-center">
//                             <FileText size={18} className="text-gray-500 mr-3" />
//                             <p className="font-medium">Driver's License</p>
//                           </div>
//                           <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
//                             Verified
//                           </span>
//                         </div>

//                         <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                           <div className="flex items-center">
//                             <FileText size={18} className="text-gray-500 mr-3" />
//                             <p className="font-medium">Vehicle Registration</p>
//                           </div>
//                           <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
//                             Verified
//                           </span>
//                         </div>

//                         <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                           <div className="flex items-center">
//                             <FileText size={18} className="text-gray-500 mr-3" />
//                             <p className="font-medium">Insurance</p>
//                           </div>
//                           <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
//                             Verified
//                           </span>
//                         </div>

//                         <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                           <div className="flex items-center">
//                             <FileText size={18} className="text-gray-500 mr-3" />
//                             <p className="font-medium">Background Check</p>
//                           </div>
//                           <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
//                             Verified
//                           </span>
//                         </div>
//                       </div>

//                       <div className="mt-6">
//                         <button className="px-4 py-2 border border-cyan-600 text-cyan-600 rounded-lg hover:bg-cyan-50 transition-colors">
//                           View All Documents
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </motion.div>
//             )}

//             {/* Help & Support Section */}
//             {activeSection === "help" && (
//               <motion.div
//                 key="help"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 <div className="mb-6">
//                   <h2 className="text-2xl font-bold text-gray-800">Help & Support</h2>
//                   <p className="text-gray-600">Get assistance and find answers to your questions</p>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//                   <motion.div
//                     className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
//                     whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
//                     transition={{ duration: 0.2 }}
//                   >
//                     <div className="w-12 h-12 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600 mb-4">
//                       <MessageSquare size={24} />
//                     </div>
//                     <h3 className="font-semibold text-lg mb-2">Chat Support</h3>
//                     <p className="text-gray-600 mb-4">Chat with our support team for immediate assistance</p>
//                     <button className="w-full px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors">
//                       Start Chat
//                     </button>
//                   </motion.div>

//                   <motion.div
//                     className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
//                     whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
//                     transition={{ duration: 0.2 }}
//                   >
//                     <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mb-4">
//                       <Phone size={24} />
//                     </div>
//                     <h3 className="font-semibold text-lg mb-2">Call Support</h3>
//                     <p className="text-gray-600 mb-4">Call our dedicated driver support line</p>
//                     <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
//                       Call Now
//                     </button>
//                   </motion.div>

//                   <motion.div
//                     className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
//                     whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
//                     transition={{ duration: 0.2 }}
//                   >
//                     <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 mb-4">
//                       <FileText size={24} />
//                     </div>
//                     <h3 className="font-semibold text-lg mb-2">Help Center</h3>
//                     <p className="text-gray-600 mb-4">Browse our knowledge base for answers</p>
//                     <button className="w-full px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
//                       Visit Help Center
//                     </button>
//                   </motion.div>
//                 </div>

//                 {/* FAQs */}
//                 <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
//                   <h3 className="font-semibold text-lg mb-4">Frequently Asked Questions</h3>

//                   <div className="space-y-4">
//                     <div className="border border-gray-200 rounded-lg overflow-hidden">
//                       <button className="w-full flex items-center justify-between p-4 text-left font-medium hover:bg-gray-50">
//                         <span>How do I update my vehicle information?</span>
//                         <ChevronDown size={18} />
//                       </button>
//                       <div className="p-4 bg-gray-50 border-t border-gray-200">
//                         <p className="text-gray-700">
//                           You can update your vehicle information by going to the Profile section and clicking on
//                           "Update Vehicle Information". Make sure to have all necessary documents ready for
//                           verification.
//                         </p>
//                       </div>
//                     </div>

//                     <div className="border border-gray-200 rounded-lg overflow-hidden">
//                       <button className="w-full flex items-center justify-between p-4 text-left font-medium hover:bg-gray-50">
//                         <span>How are my earnings calculated?</span>
//                         <ChevronDown size={18} />
//                       </button>
//                       <div className="p-4 bg-gray-50 border-t border-gray-200">
//                         <p className="text-gray-700">
//                           For each trip, you receive 90% of the fare. The remaining 10% is distributed as 6% to admin
//                           and 4% to vendor. Your earnings are automatically added to your wallet after each completed
//                           trip.
//                         </p>
//                       </div>
//                     </div>

//                     <div className="border border-gray-200 rounded-lg overflow-hidden">
//                       <button className="w-full flex items-center justify-between p-4 text-left font-medium hover:bg-gray-50">
//                         <span>How do I withdraw money from my wallet?</span>
//                         <ChevronDown size={18} />
//                       </button>
//                       <div className="p-4 bg-gray-50 border-t border-gray-200">
//                         <p className="text-gray-700">
//                           You can withdraw money from your wallet by going to the Earnings section and clicking on
//                           "Withdraw Funds". Enter the amount you wish to withdraw and select your preferred payment
//                           method. Withdrawals are typically processed within 1-2 business days.
//                         </p>
//                       </div>
//                     </div>

//                     <div className="border border-gray-200 rounded-lg overflow-hidden">
//                       <button className="w-full flex items-center justify-between p-4 text-left font-medium hover:bg-gray-50">
//                         <span>What should I do if a passenger cancels a trip?</span>
//                         <ChevronDown size={18} />
//                       </button>
//                       <div className="p-4 bg-gray-50 border-t border-gray-200">
//                         <p className="text-gray-700">
//                           If a passenger cancels a trip, you'll receive a notification. Depending on when the
//                           cancellation occurs, you may be eligible for a cancellation fee. The system automatically
//                           handles this, and any applicable fee will be added to your wallet. You can view the details in
//                           your trip history.
//                         </p>
//                       </div>
//                     </div>

//                     <div className="border border-gray-200 rounded-lg overflow-hidden">
//                       <button className="w-full flex items-center justify-between p-4 text-left font-medium hover:bg-gray-50">
//                         <span>How can I improve my driver rating?</span>
//                         <ChevronDown size={18} />
//                       </button>
//                       <div className="p-4 bg-gray-50 border-t border-gray-200">
//                         <p className="text-gray-700">
//                           To improve your rating, focus on providing excellent service: keep your vehicle clean, be
//                           punctual, follow the optimal route, drive safely, and be courteous to passengers. Consistently
//                           good service will lead to better ratings and more trip requests.
//                         </p>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="mt-6 p-4 bg-cyan-50 rounded-lg flex items-start">
//                     <HelpCircle size={20} className="text-cyan-600 mr-3 mt-0.5 flex-shrink-0" />
//                     <p className="text-sm text-cyan-800">
//                       Can't find what you're looking for? Contact our support team for personalized assistance. We're
//                       available 24/7 to help you with any issues or questions.
//                     </p>
//                   </div>
//                 </div>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </main>
//       </div>
//     </div>
//   )
// }

"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import secureLocalStorage from "react-secure-storage"
import toast from "react-hot-toast"
import axiosInstance from "../../API/axiosInstance"
import {
  Car,
  User,
  MapPin,
  DollarSign,
  Star,
  Calendar,
  TrendingUp,
  BarChart3,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  CheckCircle,
  AlertCircle,
  Wallet,
  FileText,
  Settings,
  HelpCircle,
  Zap,
  Award,
  Compass,
  ArrowUpRight,
  CircleDollarSign,
  Banknote,
  Percent,
  MessageSquare,
  ThumbsUp,
  MapPinned,
  Route,
  RefreshCw,
  Mail,
  Phone,
  BarChart2,
  Clock,
  Navigation,
  Shield,
  XCircle,
  Smile,
  Frown,
  Meh,
  Coffee,
  Music,
  Thermometer,
  Droplet,
  Wifi,
  Smartphone,
  Umbrella,
  Download,
  Share2,
  Info,
  ExternalLink,
} from "lucide-react"

export default function DriverDashboard() {
  const navigate = useNavigate()
  const uid = localStorage.getItem("@secure.n.uid")
  const decryptedUID = secureLocalStorage.getItem("uid")
  const [did, setDid] = useState(null)

  // State variables
  const [isLoading, setIsLoading] = useState(false)
  const [activeSection, setActiveSection] = useState("dashboard")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [driverStatus, setDriverStatus] = useState("online") // online, offline, busy
  const [trips, setTrips] = useState([])
  const [pastTrips, setPastTrips] = useState([])
  const [wallet, setWallet] = useState({ balance: 0, updated_at: "", role: "Driver" })
  const [earnings, setEarnings] = useState({ today: 0, week: 0, month: 0, year: 0 })
  const [reviews, setReviews] = useState([])
  const [driverInfo, setDriverInfo] = useState({
    name: "",
    email: "",
    phone_number: "",
    car_name: "",
    car_number: "",
    car_type: "",
    model_year: "",
  })
  const [stats, setStats] = useState({
    totalTrips: 0,
    totalEarnings: 0,
    avgRating: 0,
    completionRate: 0,
  })

  const [transactions, setTransactions] = useState([])

  // New states for trip details modal
  const [selectedTrip, setSelectedTrip] = useState(null)
  const [showTripDetails, setShowTripDetails] = useState(false)

  // New states for enhanced report card
  const [reportCardMetrics, setReportCardMetrics] = useState({
    overallRating: 0,
    tripCompletion: 0,
    onTimeArrival: 0,
    customerSatisfaction: 0,
    safetyScore: 0,
    vehicleCleanliness: 0,
    navigationEfficiency: 0,
    peakHoursActivity: 0,
    acceptanceRate: 0,
    cancellationRate: 0,
    earnings: {
      daily: [],
      weekly: [],
      monthly: [],
    },
    tripDistribution: {
      morning: 0,
      afternoon: 0,
      evening: 0,
      night: 0,
    },
    badges: [
      { id: 1, name: "Top Driver", achieved: true, icon: <Award size={20} /> },
      { id: 2, name: "Perfect Rating", achieved: true, icon: <Star size={20} /> },
      { id: 3, name: "Road Warrior", achieved: false, icon: <Route size={20} /> },
      { id: 4, name: "Customer Favorite", achieved: true, icon: <ThumbsUp size={20} /> },
      { id: 5, name: "Punctuality Pro", achieved: true, icon: <Clock size={20} /> },
    ],
    recentFeedback: [
      { type: "positive", comment: "Very professional and courteous" },
      { type: "positive", comment: "Clean vehicle and smooth ride" },
      { type: "neutral", comment: "Good service but arrived a bit late" },
      { type: "positive", comment: "Excellent navigation through traffic" },
    ],
  })

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true) // Start loading
      try {
        // Fetch profile first to get `did`
        const profileRes = await axiosInstance.post(`${process.env.REACT_APP_BASE_URL}/drivers/fetchDriverProfileData`, {
          decryptedUID,
        })

        if (profileRes.status === 200) {

          setDriverInfo(profileRes.data)
          setDid(profileRes.data.did)

          const driverId = profileRes.data.did

          // Parallel API calls after fetching `did`
          const [walletRes, earningsRes, tripsRes, reviewsRes, statsRes, transactionsRes] = await Promise.all([
            axiosInstance.post(`${process.env.REACT_APP_BASE_URL}/drivers/fetchWalletBalance`, {
              decryptedUID,
              driver_id: driverId,
            }),
            axiosInstance.post(`${process.env.REACT_APP_BASE_URL}/drivers/fetchEarnings`, {
              decryptedUID,
              driver_id: driverId,
            }),
            axiosInstance.post(`${process.env.REACT_APP_BASE_URL}/drivers/fetchTrips`, {
              decryptedUID,
              driver_id: driverId,
            }),
            axiosInstance.post(`${process.env.REACT_APP_BASE_URL}/drivers/fetchReviews`, {
              decryptedUID,
              driver_id: driverId,
            }),
            axiosInstance.post(`${process.env.REACT_APP_BASE_URL}/drivers/fetchStats`, {
              decryptedUID,
              driver_id: driverId,
            }),
            axiosInstance.post(`${process.env.REACT_APP_BASE_URL}/drivers/fetchTransactions`, {
              decryptedUID,
              driver_id: driverId,
            }),
          ])

          // Handle wallet response
          if (walletRes.status === 200) {
            setWallet({
              balance: walletRes.data.balance,
              updated_at: walletRes.data.updated_at,
              role: "Driver",
            })
          }

          // Handle earnings response
          if (earningsRes.status === 200) {
            setEarnings(earningsRes.data)
          }

          // Handle trips response
          if (tripsRes.status === 200) {
            setTrips(tripsRes.data)
            setPastTrips(tripsRes.data)
          }

          // Handle reviews response
          if (reviewsRes.status === 200) {
            console.log("Reviews:", reviewsRes.data)
            setReviews(reviewsRes.data.reviews)


            setReportCardMetrics((prev) => ({
              ...prev,
              overallRating: Number.parseFloat(reviewsRes.data.metrics.overallRating) || 0,
              tripCompletion: reviewsRes.data.metrics.tripCompletion || 0,
              onTimeArrival: reviewsRes.data.metrics.onTimeArrival || 0, // if added later
              customerSatisfaction: reviewsRes.data.metrics.customerSatisfaction || 0, // placeholder
              safetyScore: reviewsRes.data.metrics.safetyScore || 0,
              vehicleCleanliness: reviewsRes.data.metrics.vehicleCleanliness || 0,
              navigationEfficiency: reviewsRes.data.metrics.navigationEfficiency || 0,
              peakHoursActivity: reviewsRes.data.metrics.peakHoursActivity || 0, // if added
              acceptanceRate: reviewsRes.data.metrics.acceptanceRate || 0,
              cancellationRate: reviewsRes.data.metrics.cancellationRate || 0,
            }));

          }

          // Handle stats response
          if (statsRes.status === 200) {
            setStats(statsRes.data)
          }

          // Handle transactions response
          if (transactionsRes.status === 200) {
            setTransactions(transactionsRes.data)
          }
        }
      } catch (err) {
        console.error("Error fetching data:", err)
        toast.error("Failed to fetch data")
      } finally {
        setIsLoading(false) // Stop loading
      }
    }

    fetchData()
  }, [decryptedUID])

  // Function to view trip details
  const viewTripDetails = (trip) => {
    setSelectedTrip(trip)
    setShowTripDetails(true)
  }

  const toggleDriverStatus = async () => {
    try {
      const newStatus = driverStatus === "online" ? "offline" : "online"

      const res = await axiosInstance.post(`${process.env.REACT_APP_BASE_URL}/drivers/updateStatus`, {
        decryptedUID,
        status: newStatus,
      })

      if (res.status === 200) {
        setDriverStatus(newStatus)
        toast.success(`You are now ${newStatus}`)
      }
    } catch (error) {
      console.error("Error updating status:", error)
      toast.error("Failed to update status")
    }
  }

  const handleLogout = () => {
    // Clear local storage and navigate to login
    localStorage.removeItem("@secure.n.uid")
    secureLocalStorage.removeItem("uid")
    navigate("/")
  }

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
    return new Date(dateString).toLocaleDateString("en-US", options)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusText = (status) => {
    const statusMap = {
      0: "Pending",
      1: "Accepted",
      2: "Driver Arrived",
      3: "Trip Started",
      4: "Trip In Progress",
      5: "Completed",
      6: "Cancelled By Passenger",
      7: "Cancelled By Driver",
    }
    return statusMap[status] || "Unknown"
  }

  const getStatusColor = (status) => {
    const colorMap = {
      0: "bg-amber-500",
      1: "bg-blue-500",
      2: "bg-purple-500",
      3: "bg-indigo-500",
      4: "bg-cyan-500",
      5: "bg-emerald-500",
      6: "bg-rose-500",
      7: "bg-rose-500",
    }
    return colorMap[status] || "bg-gray-500"
  }

  const getCarTypeText = (type) => {
    const typeMap = {
      1: "Sedan (4+1)",
      2: "SUV/MUV (6+1)",
    }
    return typeMap[type] || type
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        >
          <RefreshCw size={48} className="text-cyan-500" />
        </motion.div>
        <p className="mt-4 text-lg font-medium text-gray-700">Loading your dashboard...</p>
      </div>
    )
  }

  if (!uid) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full text-center"
        >
          <AlertCircle size={48} className="mx-auto mb-4 text-rose-500" />
          <h2 className="text-2xl font-bold mb-4">Session Expired</h2>
          <p className="mb-6 text-gray-600">Please login again to access your dashboard.</p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center mx-auto"
          >
            Back to Login
            <ChevronRight size={18} className="ml-2" />
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <button className="md:hidden mr-4" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="flex items-center">
              <Car className="mr-2" size={24} />
              <h1 className="text-xl font-bold">Driver Hub</h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Driver Status Toggle */}
            <div className="flex items-center">
              <button
                onClick={toggleDriverStatus}
                className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${driverStatus === "online" ? "bg-emerald-500 text-white" : "bg-gray-200 text-gray-700"
                  }`}
              >
                <span
                  className={`w-2 h-2 rounded-full mr-2 ${driverStatus === "online" ? "bg-white" : "bg-gray-500"}`}
                ></span>
                {driverStatus === "online" ? "Online" : "Offline"}
              </button>
            </div>

            {/* User Menu */}
            <div className="relative group">
              <button className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-medium">
                  {driverInfo.name.charAt(0)}
                </div>
                <ChevronDown size={16} className="ml-1" />
              </button>

              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <div className="p-3 border-b border-gray-100">
                  <p className="font-medium text-sm">{driverInfo.name}</p>
                  <p className="text-xs text-gray-500">{driverInfo.email}</p>
                </div>
                <div>
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    onClick={() => setActiveSection("profile")}
                  >
                    <User size={16} className="mr-2" />
                    Profile
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    onClick={() => setActiveSection("settings")}
                  >
                    <Settings size={16} className="mr-2" />
                    Settings
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} className="mr-2" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            className="fixed inset-0 z-50 bg-black bg-opacity-50"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div className="w-64 h-full bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Car className="mr-2 text-cyan-600" size={20} />
                    <h2 className="font-bold text-lg">Driver Hub</h2>
                  </div>
                  <button onClick={() => setIsMobileMenuOpen(false)}>
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600 font-medium">
                    {driverInfo.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">{driverInfo.name}</p>
                    <p className="text-xs text-gray-500">{driverInfo.email}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <button
                    onClick={toggleDriverStatus}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center ${driverStatus === "online" ? "bg-emerald-500 text-white" : "bg-gray-200 text-gray-700"
                      }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full mr-2 ${driverStatus === "online" ? "bg-white" : "bg-gray-500"}`}
                    ></span>
                    {driverStatus === "online" ? "Online" : "Offline"}
                  </button>
                </div>
              </div>

              <nav className="p-4">
                <ul className="space-y-2">
                  <li>
                    <button
                      onClick={() => {
                        setActiveSection("dashboard")
                        setIsMobileMenuOpen(false)
                      }}
                      className={`w-full flex items-center px-3 py-2 rounded-lg text-sm ${activeSection === "dashboard"
                        ? "bg-cyan-50 text-cyan-600 font-medium"
                        : "text-gray-700 hover:bg-gray-100"
                        }`}
                    >
                      <BarChart3 size={18} className="mr-3" />
                      Dashboard
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        setActiveSection("trips")
                        setIsMobileMenuOpen(false)
                      }}
                      className={`w-full flex items-center px-3 py-2 rounded-lg text-sm ${activeSection === "trips"
                        ? "bg-cyan-50 text-cyan-600 font-medium"
                        : "text-gray-700 hover:bg-gray-100"
                        }`}
                    >
                      <Route size={18} className="mr-3" />
                      My Trips
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        setActiveSection("earnings")
                        setIsMobileMenuOpen(false)
                      }}
                      className={`w-full flex items-center px-3 py-2 rounded-lg text-sm ${activeSection === "earnings"
                        ? "bg-cyan-50 text-cyan-600 font-medium"
                        : "text-gray-700 hover:bg-gray-100"
                        }`}
                    >
                      <Wallet size={18} className="mr-3" />
                      Earnings
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        setActiveSection("performance")
                        setIsMobileMenuOpen(false)
                      }}
                      className={`w-full flex items-center px-3 py-2 rounded-lg text-sm ${activeSection === "performance"
                        ? "bg-cyan-50 text-cyan-600 font-medium"
                        : "text-gray-700 hover:bg-gray-100"
                        }`}
                    >
                      <Award size={18} className="mr-3" />
                      Performance
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        setActiveSection("profile")
                        setIsMobileMenuOpen(false)
                      }}
                      className={`w-full flex items-center px-3 py-2 rounded-lg text-sm ${activeSection === "profile"
                        ? "bg-cyan-50 text-cyan-600 font-medium"
                        : "text-gray-700 hover:bg-gray-100"
                        }`}
                    >
                      <User size={18} className="mr-3" />
                      Profile
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        setActiveSection("help")
                        setIsMobileMenuOpen(false)
                      }}
                      className={`w-full flex items-center px-3 py-2 rounded-lg text-sm ${activeSection === "help"
                        ? "bg-cyan-50 text-cyan-600 font-medium"
                        : "text-gray-700 hover:bg-gray-100"
                        }`}
                    >
                      <HelpCircle size={18} className="mr-3" />
                      Help & Support
                    </button>
                  </li>
                </ul>
              </nav>

              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center px-3 py-2 rounded-lg text-sm text-rose-600 hover:bg-rose-50"
                >
                  <LogOut size={18} className="mr-2" />
                  Logout
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Tab Navigation */}
        <div className="w-full bg-white border-b border-gray-200 shadow-sm">
          <div className="flex overflow-x-auto no-scrollbar">
            {[
              { id: "dashboard", label: "Dashboard", icon: <BarChart3 size={18} /> },
              { id: "trips", label: "My Trips", icon: <Route size={18} /> },
              { id: "earnings", label: "Earnings", icon: <Wallet size={18} /> },
              { id: "performance", label: "Performance", icon: <Award size={18} /> },
              { id: "profile", label: "Profile", icon: <User size={18} /> },
              { id: "help", label: "Help & Support", icon: <HelpCircle size={18} /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`flex items-center px-4 py-3 text-sm whitespace-nowrap border-b-2 ${activeSection === tab.id
                  ? "border-cyan-500 text-cyan-600 font-medium"
                  : "border-transparent text-gray-600 hover:text-cyan-600"
                  }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <AnimatePresence mode="wait">
            {/* Dashboard Section */}
            {activeSection === "dashboard" && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
                  <p className="text-gray-600">Welcome back, {driverInfo.name}</p>
                </div>

                {/* Status Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center mb-4 md:mb-0">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${driverStatus === "online" ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-600"
                          }`}
                      >
                        <Zap size={24} />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm text-gray-500">Current Status</p>
                        <p className="font-semibold text-lg capitalize">{driverStatus}</p>
                      </div>
                    </div>
                    <button
                      onClick={toggleDriverStatus}
                      className={`px-4 py-2 rounded-lg text-sm font-medium ${driverStatus === "online"
                        ? "bg-emerald-500 text-white hover:bg-emerald-600"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                    >
                      {driverStatus === "online" ? "Go Offline" : "Go Online"}
                    </button>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <motion.div
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
                    whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Today's Earnings</p>
                        <p className="text-xl font-bold">{formatCurrency(earnings.today)}</p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600">
                        <DollarSign size={20} />
                      </div>
                    </div>
                    <div className="mt-2 flex items-center text-xs text-emerald-600">
                      <ArrowUpRight size={14} className="mr-1" />
                      <span>+12% from yesterday</span>
                    </div>
                  </motion.div>

                  <motion.div
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
                    whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Total Trips</p>
                        <p className="text-xl font-bold">{stats.totalTrips}</p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                        <Route size={20} />
                      </div>
                    </div>
                    <div className="mt-2 flex items-center text-xs text-emerald-600">
                      <ArrowUpRight size={14} className="mr-1" />
                      <span>+3 this week</span>
                    </div>
                  </motion.div>

                  <motion.div
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
                    whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Rating</p>
                        <div className="flex items-center">
                          <p className="text-xl font-bold">{(Number.parseFloat(stats.avgRating) || 0).toFixed(1)}</p>
                          <Star size={16} className="ml-1 text-amber-400" />
                        </div>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                        <Star size={20} />
                      </div>
                    </div>
                    <div className="mt-2 flex items-center text-xs text-emerald-600">
                      <CheckCircle size={14} className="mr-1" />
                      <span>Excellent</span>
                    </div>
                  </motion.div>

                  <motion.div
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
                    whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Completion Rate</p>
                        <p className="text-xl font-bold">{stats.completionRate}%</p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-600">
                        <CheckCircle size={20} />
                      </div>
                    </div>
                    <div className="mt-2 flex items-center text-xs text-emerald-600">
                      <ArrowUpRight size={14} className="mr-1" />
                      <span>+2% from last month</span>
                    </div>
                  </motion.div>
                </div>

                {/* Recent Trips */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg">Recent Trips</h3>
                    <button
                      className="text-sm text-cyan-600 hover:text-cyan-700"
                      onClick={() => setActiveSection("trips")}
                    >
                      View All
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Trip ID
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Route
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Fare
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {trips.slice(0, 3).map((trip) => (
                          <tr key={trip.bid} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">#{trip.bid}</td>
                            <td className="px-4 py-3 text-sm text-gray-500">{formatDate(trip.pickup_date_time)}</td>
                            <td className="px-4 py-3 text-sm text-gray-500">
                              <div className="flex items-center">
                                <MapPin size={14} className="text-gray-400 mr-1" />
                                <span className="truncate max-w-[150px]">{trip.pickup_location}</span>
                                <ChevronRight size={14} className="mx-1 text-gray-300" />
                                <MapPin size={14} className="text-gray-400 mr-1" />
                                <span className="truncate max-w-[150px]">{trip.drop_location}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                              {formatCurrency(trip.price)}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(trip.trip_status)} text-white`}
                              >
                                {getStatusText(trip.trip_status)}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <button
                                className="text-cyan-600 hover:text-cyan-700"
                                onClick={() => viewTripDetails(trip)}
                              >
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Recent Reviews */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg">Recent Reviews</h3>
                    <button
                      className="text-sm text-cyan-600 hover:text-cyan-700"
                      onClick={() => setActiveSection("performance")}
                    >
                      View All
                    </button>
                  </div>

                  <div className="space-y-4">
                    {reviews.slice(0, 3).map((review) => (
                      <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                              <User size={16} />
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium">Trip #{review.bid}</p>
                              <p className="text-xs text-gray-500">{formatDate(review.created_at)}</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            {Array.from({ length: review.rating }).map((_, i) => (
                              <Star key={i} size={16} className="text-amber-400" />
                            ))}
                          </div>
                        </div>
                        <p className="mt-2 text-sm text-gray-600">{review.review}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Trips Section */}
            {activeSection === "trips" && (
              <motion.div
                key="trips"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">My Trips</h2>
                  <p className="text-gray-600">View and manage all your trips</p>
                </div>

                {/* Trip Filters */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
                  <div className="flex flex-wrap gap-4">
                    <div className="flex-1 min-w-[200px]">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                      <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500">
                        <option>Last 7 days</option>
                        <option>Last 30 days</option>
                        <option>Last 90 days</option>
                        <option>Custom range</option>
                      </select>
                    </div>
                    <div className="flex-1 min-w-[200px]">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500">
                        <option>All Statuses</option>
                        <option>Completed</option>
                        <option>Cancelled</option>
                        <option>In Progress</option>
                      </select>
                    </div>
                    <div className="flex items-end">
                      <button className="bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 transition-colors">
                        Apply Filters
                      </button>
                    </div>
                  </div>
                </div>

                {/* Trips List */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Trip ID
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date & Time
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Passenger
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Route
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Distance
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Fare
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {pastTrips.map((trip) => (
                          <tr key={trip.bid} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">#{trip.bid}</td>
                            <td className="px-4 py-3 text-sm text-gray-500">{formatDate(trip.pickup_date_time)}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                                  <User size={16} />
                                </div>
                                <div className="ml-2">
                                  <p className="font-medium">{trip.passenger_name}</p>
                                  <p className="text-xs text-gray-500">{trip.passenger_phone}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-500">
                              <div className="flex flex-col">
                                <div className="flex items-center">
                                  <MapPin size={14} className="text-emerald-500 mr-1" />
                                  <span className="truncate max-w-[150px]">{trip.pickup_location}</span>
                                </div>
                                <div className="flex items-center mt-1">
                                  <MapPin size={14} className="text-rose-500 mr-1" />
                                  <span className="truncate max-w-[150px]">{trip.drop_location}</span>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-500">{trip.distance}</td>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                              {formatCurrency(trip.price)}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(trip.trip_status)} text-white`}
                              >
                                {getStatusText(trip.trip_status)}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <button
                                className="text-cyan-600 hover:text-cyan-700"
                                onClick={() => viewTripDetails(trip)}
                              >
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200">
                    <div className="flex-1 flex justify-between sm:hidden">
                      <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                        Previous
                      </button>
                      <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                        Next
                      </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-700">
                          Showing <span className="font-medium">1</span> to{" "}
                          <span className="font-medium">{pastTrips.length}</span> of{" "}
                          <span className="font-medium">{pastTrips.length}</span> results
                        </p>
                      </div>
                      <div>
                        <nav
                          className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                          aria-label="Pagination"
                        >
                          <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                            <span className="sr-only">Previous</span>
                            <ChevronRight className="h-5 w-5 transform rotate-180" />
                          </button>
                          <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-cyan-50 text-sm font-medium text-cyan-600 hover:bg-cyan-100">
                            1
                          </button>
                          <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                            <span className="sr-only">Next</span>
                            <ChevronRight className="h-5 w-5" />
                          </button>
                        </nav>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Earnings Section */}
            {activeSection === "earnings" && (
              <motion.div
                key="earnings"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Earnings</h2>
                  <p className="text-gray-600">Track your income and payment history</p>
                </div>

                {/* Earnings Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <motion.div
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
                    whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Today's Earnings</p>
                        <p className="text-xl font-bold">{formatCurrency(earnings.today)}</p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600">
                        <DollarSign size={20} />
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
                    whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">This Week</p>
                        <p className="text-xl font-bold">{formatCurrency(earnings.week)}</p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                        <Calendar size={20} />
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
                    whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">This Month</p>
                        <p className="text-xl font-bold">{formatCurrency(earnings.month)}</p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-600">
                        <TrendingUp size={20} />
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
                    whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">This Year</p>
                        <p className="text-xl font-bold">{formatCurrency(earnings.year)}</p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                        <BarChart2 size={20} />
                      </div>
                    </div>
                  </motion.div>
                </div>

                <div className="bg-gradient-to-r from-cyan-500 to-teal-500 rounded-xl shadow-md p-6 mb-6 text-white">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-white/80 text-sm">Wallet Balance</p>
                      <p className="text-3xl font-bold mt-1">{formatCurrency(wallet.balance)}</p>
                      <p className="text-white/80 text-sm mt-1">Role: {wallet.role}</p>
                      <p className="text-white/80 text-sm mt-2">Last updated: {formatDate(wallet.updated_at)}</p>
                    </div>
                    <div className="hidden md:block">
                      <Wallet size={48} className="text-white/80" />
                    </div>
                  </div>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <button className="bg-white text-cyan-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                      Withdraw Funds
                    </button>
                    <button className="bg-white/20 text-white px-4 py-2 rounded-lg font-medium hover:bg-white/30 transition-colors">
                      Transaction History
                    </button>
                  </div>
                </div>

                {/* Earnings Breakdown */}
                {/* <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                  <h3 className="font-semibold text-lg mb-4">Earnings Breakdown</h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col items-center p-4 bg-cyan-50 rounded-lg">
                      <div className="w-16 h-16 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600 mb-3">
                        <Banknote size={28} />
                      </div>
                      <p className="text-lg font-bold">90%</p>
                      <p className="text-sm text-gray-600">Driver Share</p>
                    </div>

                    <div className="flex flex-col items-center p-4 bg-purple-50 rounded-lg">
                      <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mb-3">
                        <CircleDollarSign size={28} />
                      </div>
                      <p className="text-lg font-bold">6%</p>
                      <p className="text-sm text-gray-600">Admin Fee</p>
                    </div>

                    <div className="flex flex-col items-center p-4 bg-teal-50 rounded-lg">
                      <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 mb-3">
                        <Percent size={28} />
                      </div>
                      <p className="text-lg font-bold">4%</p>
                      <p className="text-sm text-gray-600">Vendor Fee</p>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      For each trip, you receive 90% of the fare. The remaining 10% is distributed as 6% to admin and 4%
                      to vendor.
                    </p>
                  </div>
                </div> */}

                {/* Recent Transactions */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-4 border-b border-gray-100">
                    <h3 className="font-semibold text-lg">Recent Transactions</h3>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Transaction ID
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Trip ID
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Type
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {transactions.length > 0 ? (
                          transactions.map((transaction) => (
                            <tr key={transaction.id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm font-medium text-gray-900">#{transaction.id}</td>
                              <td className="px-4 py-3 text-sm text-gray-500">{formatDate(transaction.date)}</td>
                              <td className="px-4 py-3 text-sm text-gray-500">
                                {transaction.trip_id ? `#${transaction.trip_id}` : "-"}
                              </td>
                              <td className="px-4 py-3 text-sm font-medium text-emerald-600">
                                {transaction.type === "credit" ? "+" : "-"}
                                {formatCurrency(transaction.amount)}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-500">{transaction.description}</td>
                              <td className="px-4 py-3 text-sm">
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${transaction.status === "completed"
                                    ? "bg-emerald-100 text-emerald-800"
                                    : transaction.status === "processing"
                                      ? "bg-amber-100 text-amber-800"
                                      : "bg-gray-100 text-gray-800"
                                    }`}
                                >
                                  {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                                </span>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                              No transactions found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200">
                    <div className="flex-1 flex justify-between sm:hidden">
                      <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                        Previous
                      </button>
                      <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                        Next
                      </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-700">
                          Showing <span className="font-medium">1</span> to{" "}
                          <span className="font-medium">{transactions.length}</span> of{" "}
                          <span className="font-medium">{transactions.length}</span> results
                        </p>
                      </div>
                      <div>
                        <nav
                          className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                          aria-label="Pagination"
                        >
                          <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                            <span className="sr-only">Previous</span>
                            <ChevronRight className="h-5 w-5 transform rotate-180" />
                          </button>
                          <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-cyan-50 text-sm font-medium text-cyan-600 hover:bg-cyan-100">
                            1
                          </button>
                          <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                            <span className="sr-only">Next</span>
                            <ChevronRight className="h-5 w-5" />
                          </button>
                        </nav>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Performance Section */}
            {activeSection === "performance" && (
              <motion.div
                key="performance"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Performance</h2>
                  <p className="text-gray-600">Track your ratings and performance metrics</p>
                </div>

                {/* Enhanced Performance Report Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-semibold text-lg">Driver Report Card</h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">Last updated: Today</span>
                      <button className="p-1 rounded-full hover:bg-gray-100">
                        <RefreshCw size={16} className="text-gray-500" />
                      </button>
                    </div>
                  </div>

                  {/* Overall Rating */}
                  <div className="flex flex-col md:flex-row items-center justify-between mb-8 p-4 bg-gradient-to-r from-cyan-50 to-teal-50 rounded-xl">
                    <div className="flex items-center mb-4 md:mb-0">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 flex items-center justify-center text-white text-2xl font-bold">
                        {reportCardMetrics.overallRating.toFixed(1)}
                      </div>
                      <div className="ml-4">
                        <p className="text-sm text-gray-500">Overall Rating</p>
                        <div className="flex items-center mt-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              size={20}
                              className={
                                i < Math.floor(reportCardMetrics.overallRating) ? "text-amber-400" : "text-gray-200"
                              }
                              fill={i < Math.floor(reportCardMetrics.overallRating) ? "#f59e0b" : "#e5e7eb"}
                            />
                          ))}
                        </div>
                        <p className="text-sm text-emerald-600 mt-1">Top 5% of drivers in your area</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {reportCardMetrics.badges.map((badge) => (
                        <div
                          key={badge.id}
                          className={`flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${badge.achieved ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-600"
                            }`}
                        >
                          <span className="mr-1">{badge.icon}</span>
                          {badge.name}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Performance Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-800 mb-3">Key Performance Metrics</h4>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center">
                            <CheckCircle size={16} className="text-emerald-500 mr-2" />
                            <p className="text-sm font-medium">Trip Completion Rate</p>
                          </div>
                          <p className="text-sm font-medium">{reportCardMetrics.tripCompletion}%</p>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-emerald-500 h-2 rounded-full"
                            style={{ width: `${reportCardMetrics.tripCompletion}%` }}
                          ></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center">
                            <Clock size={16} className="text-cyan-500 mr-2" />
                            <p className="text-sm font-medium">On-Time Arrival</p>
                          </div>
                          <p className="text-sm font-medium">{reportCardMetrics.onTimeArrival}%</p>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-cyan-500 h-2 rounded-full"
                            style={{ width: `${reportCardMetrics.onTimeArrival}%` }}
                          ></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center">
                            <ThumbsUp size={16} className="text-purple-500 mr-2" />
                            <p className="text-sm font-medium">Customer Satisfaction</p>
                          </div>
                          <p className="text-sm font-medium">{reportCardMetrics.customerSatisfaction}%</p>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-purple-500 h-2 rounded-full"
                            style={{ width: `${reportCardMetrics.customerSatisfaction}%` }}
                          ></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center">
                            <Shield size={16} className="text-rose-500 mr-2" />
                            <p className="text-sm font-medium">Safety Score</p>
                          </div>
                          <p className="text-sm font-medium">{reportCardMetrics.safetyScore}%</p>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-rose-500 h-2 rounded-full"
                            style={{ width: `${reportCardMetrics.safetyScore}%` }}
                          ></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center">
                            <Droplet size={16} className="text-blue-500 mr-2" />
                            <p className="text-sm font-medium">Vehicle Cleanliness</p>
                          </div>
                          <p className="text-sm font-medium">{reportCardMetrics.vehicleCleanliness}%</p>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${reportCardMetrics.vehicleCleanliness}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-800 mb-3">Additional Metrics</h4>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center">
                            <Navigation size={16} className="text-amber-500 mr-2" />
                            <p className="text-sm font-medium">Navigation Efficiency</p>
                          </div>
                          <p className="text-sm font-medium">{reportCardMetrics.navigationEfficiency}%</p>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-amber-500 h-2 rounded-full"
                            style={{ width: `${reportCardMetrics.navigationEfficiency}%` }}
                          ></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center">
                            <Zap size={16} className="text-orange-500 mr-2" />
                            <p className="text-sm font-medium">Peak Hours Activity</p>
                          </div>
                          <p className="text-sm font-medium">{reportCardMetrics.peakHoursActivity}%</p>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-orange-500 h-2 rounded-full"
                            style={{ width: `${reportCardMetrics.peakHoursActivity}%` }}
                          ></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center">
                            <CheckCircle size={16} className="text-green-500 mr-2" />
                            <p className="text-sm font-medium">Acceptance Rate</p>
                          </div>
                          <p className="text-sm font-medium">{reportCardMetrics.acceptanceRate}%</p>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${reportCardMetrics.acceptanceRate}%` }}
                          ></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center">
                            <XCircle size={16} className="text-gray-500 mr-2" />
                            <p className="text-sm font-medium">Cancellation Rate</p>
                          </div>
                          <p className="text-sm font-medium">{reportCardMetrics.cancellationRate}%</p>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gray-500 h-2 rounded-full"
                            style={{ width: `${reportCardMetrics.cancellationRate}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Trip Distribution */}
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Trip Distribution</h5>
                        <div className="grid grid-cols-4 gap-2">
                          <div className="text-center">
                            <div className="w-full bg-gray-200 rounded-t-lg h-16 flex items-end">
                              <div className="bg-cyan-400 rounded-t-lg w-full" style={{ height: "60%" }}></div>
                            </div>
                            <p className="text-xs mt-1">Morning</p>
                          </div>
                          <div className="text-center">
                            <div className="w-full bg-gray-200 rounded-t-lg h-16 flex items-end">
                              <div className="bg-cyan-400 rounded-t-lg w-full" style={{ height: "40%" }}></div>
                            </div>
                            <p className="text-xs mt-1">Afternoon</p>
                          </div>
                          <div className="text-center">
                            <div className="w-full bg-gray-200 rounded-t-lg h-16 flex items-end">
                              <div className="bg-cyan-400 rounded-t-lg w-full" style={{ height: "80%" }}></div>
                            </div>
                            <p className="text-xs mt-1">Evening</p>
                          </div>
                          <div className="text-center">
                            <div className="w-full bg-gray-200 rounded-t-lg h-16 flex items-end">
                              <div className="bg-cyan-400 rounded-t-lg w-full" style={{ height: "30%" }}></div>
                            </div>
                            <p className="text-xs mt-1">Night</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Passenger Feedback */}
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-800 mb-3">Recent Passenger Feedback</h4>
                    <div className="space-y-3">
                      {reportCardMetrics.recentFeedback.map((feedback, index) => (
                        <div key={index} className="flex items-start p-3 bg-gray-50 rounded-lg">
                          {feedback.type === "positive" ? (
                            <Smile size={18} className="text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                          ) : feedback.type === "neutral" ? (
                            <Meh size={18} className="text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                          ) : (
                            <Frown size={18} className="text-rose-500 mr-2 mt-0.5 flex-shrink-0" />
                          )}
                          <p className="text-sm text-gray-700">{feedback.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Improvement Suggestions */}
                  <div className="p-4 bg-cyan-50 border border-cyan-100 rounded-lg">
                    <h4 className="font-medium text-cyan-800 mb-2 flex items-center">
                      <Zap size={18} className="mr-2" />
                      Improvement Suggestions
                    </h4>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <ArrowUpRight size={16} className="text-cyan-600 mr-2 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-cyan-800">
                          Consider driving during peak hours (6-9 AM and 5-8 PM) to maximize earnings.
                        </p>
                      </li>
                      <li className="flex items-start">
                        <ArrowUpRight size={16} className="text-cyan-600 mr-2 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-cyan-800">
                          Maintain your high rating by keeping your vehicle clean and offering amenities like water or
                          charging cables.
                        </p>
                      </li>
                      <li className="flex items-start">
                        <ArrowUpRight size={16} className="text-cyan-600 mr-2 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-cyan-800">
                          Improve your navigation efficiency by familiarizing yourself with common routes and shortcuts.
                        </p>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Amenities Checklist */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                  <h3 className="font-semibold text-lg mb-4">Rider Amenities Checklist</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                        <Wifi size={20} />
                      </div>
                      <div>
                        <p className="font-medium">WiFi Hotspot</p>
                        <p className="text-xs text-gray-500">Passengers appreciate internet access</p>
                      </div>
                      <div className="ml-auto">
                        <div className="w-5 h-5 rounded-full border-2 border-emerald-500 flex items-center justify-center">
                          <CheckCircle size={12} className="text-emerald-500" />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3">
                        <Smartphone size={20} />
                      </div>
                      <div>
                        <p className="font-medium">Phone Chargers</p>
                        <p className="text-xs text-gray-500">USB/Lightning cables for passengers</p>
                      </div>
                      <div className="ml-auto">
                        <div className="w-5 h-5 rounded-full border-2 border-emerald-500 flex items-center justify-center">
                          <CheckCircle size={12} className="text-emerald-500" />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mr-3">
                        <Music size={20} />
                      </div>
                      <div>
                        <p className="font-medium">Music Options</p>
                        <p className="text-xs text-gray-500">Offering music choice to passengers</p>
                      </div>
                      <div className="ml-auto">
                        <div className="w-5 h-5 rounded-full border-2 border-emerald-500 flex items-center justify-center">
                          <CheckCircle size={12} className="text-emerald-500" />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600 mr-3">
                        <Thermometer size={20} />
                      </div>
                      <div>
                        <p className="font-medium">Temperature Control</p>
                        <p className="text-xs text-gray-500">Asking about comfort preferences</p>
                      </div>
                      <div className="ml-auto">
                        <div className="w-5 h-5 rounded-full border-2 border-emerald-500 flex items-center justify-center">
                          <CheckCircle size={12} className="text-emerald-500" />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-3">
                        <Coffee size={20} />
                      </div>
                      <div>
                        <p className="font-medium">Water Bottles</p>
                        <p className="text-xs text-gray-500">Complimentary water for passengers</p>
                      </div>
                      <div className="ml-auto">
                        <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                      </div>
                    </div>

                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 mr-3">
                        <Umbrella size={20} />
                      </div>
                      <div>
                        <p className="font-medium">Umbrella</p>
                        <p className="text-xs text-gray-500">For rainy day drop-offs</p>
                      </div>
                      <div className="ml-auto">
                        <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-lg">
                    <p className="text-sm text-amber-800 flex items-start">
                      <Info size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                      Providing these amenities can significantly improve your ratings and increase tips from
                      passengers.
                    </p>
                  </div>
                </div>

                {/* Reviews */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="font-semibold text-lg mb-4">Customer Reviews</h3>

                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                              <User size={20} />
                            </div>
                            <div className="ml-3">
                              <p className="font-medium">Trip #{review.bid}</p>
                              <p className="text-xs text-gray-500">{formatDate(review.created_at)}</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            {Array.from({ length: review.rating }).map((_, i) => (
                              <Star key={i} size={18} className="text-amber-400" />
                            ))}
                          </div>
                        </div>
                        <div className="mt-3 flex items-start">
                          <MessageSquare size={18} className="text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                          <p className="text-gray-700">{review.review}</p>
                        </div>
                        <div className="mt-3 flex items-center text-xs text-gray-500">
                          <ThumbsUp size={14} className="mr-1" />
                          <span>Helpful review</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Profile Section */}
            {activeSection === "profile" && (
              <motion.div
                key="profile"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Profile</h2>
                  <p className="text-gray-600">Manage your personal and vehicle information</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Profile Card */}
                  <div className="md:col-span-1">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                      <div className="flex flex-col items-center">
                        <div className="w-24 h-24 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600 text-3xl font-bold mb-4">
                          {driverInfo.name.charAt(0)}
                        </div>
                        <h3 className="text-xl font-bold">{driverInfo.name}</h3>
                        <p className="text-gray-500 mt-1">Driver ID: {decryptedUID}</p>
                        <div className="flex items-center mt-2">
                          <Star className="text-amber-400" size={16} />
                          <span className="ml-1 font-medium">
                            {" "}
                            {(Number.parseFloat(stats.avgRating) || 0).toFixed(1)}
                          </span>
                          <span className="mx-1 text-gray-400">•</span>
                          <span className="text-gray-500">{stats.totalTrips} trips</span>
                        </div>

                        <div className="w-full mt-6 pt-6 border-t border-gray-100">
                          <div className="flex items-center mb-4">
                            <Mail size={18} className="text-gray-400 mr-3" />
                            <div>
                              <p className="text-sm text-gray-500">Email</p>
                              <p className="font-medium">{driverInfo.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center mb-4">
                            <Phone size={18} className="text-gray-400 mr-3" />
                            <div>
                              <p className="text-sm text-gray-500">Phone</p>
                              <p className="font-medium">{driverInfo.phone_number}</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <MapPinned size={18} className="text-gray-400 mr-3" />
                            <div>
                              <p className="text-sm text-gray-500">Location</p>
                              <p className="font-medium">Mumbai, Maharashtra</p>
                            </div>
                          </div>
                        </div>

                        <button className="w-full mt-6 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors">
                          Edit Profile
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Vehicle Information */}
                  <div className="md:col-span-2">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                      <h3 className="font-semibold text-lg mb-4">Vehicle Information</h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center">
                          <div className="w-12 h-12 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600 mr-4">
                            <Car size={24} />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Car Model</p>
                            <p className="font-medium text-lg">{driverInfo.car_name}</p>
                          </div>
                        </div>

                        <div className="flex items-center">
                          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-4">
                            <FileText size={24} />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Registration Number</p>
                            <p className="font-medium text-lg">{driverInfo.car_number}</p>
                          </div>
                        </div>

                        <div className="flex items-center">
                          <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mr-4">
                            <Calendar size={24} />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Model Year</p>
                            <p className="font-medium text-lg">{driverInfo.model_year}</p>
                          </div>
                        </div>

                        <div className="flex items-center">
                          <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 mr-4">
                            <Compass size={24} />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Car Type</p>
                            <p className="font-medium text-lg">{getCarTypeText(driverInfo.car_type)}</p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 p-4 bg-cyan-50 rounded-lg">
                        <p className="text-sm text-cyan-800">
                          All your vehicle documents have been verified. Remember to keep them updated before they
                          expire.
                        </p>
                      </div>

                      <div className="mt-6">
                        <button className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors">
                          Update Vehicle Information
                        </button>
                      </div>
                    </div>

                    {/* Document Status */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                      <h3 className="font-semibold text-lg mb-4">Document Status</h3>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <FileText size={18} className="text-gray-500 mr-3" />
                            <p className="font-medium">Driver's License</p>
                          </div>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                            Verified
                          </span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <FileText size={18} className="text-gray-500 mr-3" />
                            <p className="font-medium">Vehicle Registration</p>
                          </div>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                            Verified
                          </span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <FileText size={18} className="text-gray-500 mr-3" />
                            <p className="font-medium">Insurance</p>
                          </div>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                            Verified
                          </span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <FileText size={18} className="text-gray-500 mr-3" />
                            <p className="font-medium">Background Check</p>
                          </div>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                            Verified
                          </span>
                        </div>
                      </div>

                      <div className="mt-6">
                        <button className="px-4 py-2 border border-cyan-600 text-cyan-600 rounded-lg hover:bg-cyan-50 transition-colors">
                          View All Documents
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Help & Support Section */}
            {activeSection === "help" && (
              <motion.div
                key="help"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Help & Support</h2>
                  <p className="text-gray-600">Get assistance and find answers to your questions</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <motion.div
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                    whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="w-12 h-12 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600 mb-4">
                      <MessageSquare size={24} />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Chat Support</h3>
                    <p className="text-gray-600 mb-4">Chat with our support team for immediate assistance</p>
                    <button className="w-full px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors">
                      Start Chat
                    </button>
                  </motion.div>

                  <motion.div
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                    whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mb-4">
                      <Phone size={24} />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Call Support</h3>
                    <p className="text-gray-600 mb-4">Call our dedicated driver support line</p>
                    <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                      Call Now
                    </button>
                  </motion.div>

                  <motion.div
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                    whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 mb-4">
                      <FileText size={24} />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Help Center</h3>
                    <p className="text-gray-600 mb-4">Browse our knowledge base for answers</p>
                    <button className="w-full px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
                      Visit Help Center
                    </button>
                  </motion.div>
                </div>

                {/* FAQs */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="font-semibold text-lg mb-4">Frequently Asked Questions</h3>

                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <button className="w-full flex items-center justify-between p-4 text-left font-medium hover:bg-gray-50">
                        <span>How do I update my vehicle information?</span>
                        <ChevronDown size={18} />
                      </button>
                      <div className="p-4 bg-gray-50 border-t border-gray-200">
                        <p className="text-gray-700">
                          You can update your vehicle information by going to the Profile section and clicking on
                          "Update Vehicle Information". Make sure to have all necessary documents ready for
                          verification.
                        </p>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <button className="w-full flex items-center justify-between p-4 text-left font-medium hover:bg-gray-50">
                        <span>How are my earnings calculated?</span>
                        <ChevronDown size={18} />
                      </button>
                      <div className="p-4 bg-gray-50 border-t border-gray-200">
                        <p className="text-gray-700">
                          For each trip, you receive 90% of the fare. The remaining 10% is distributed as 6% to admin
                          and 4% to vendor. Your earnings are automatically added to your wallet after each completed
                          trip.
                        </p>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <button className="w-full flex items-center justify-between p-4 text-left font-medium hover:bg-gray-50">
                        <span>How do I withdraw money from my wallet?</span>
                        <ChevronDown size={18} />
                      </button>
                      <div className="p-4 bg-gray-50 border-t border-gray-200">
                        <p className="text-gray-700">
                          You can withdraw money from your wallet by going to the Earnings section and clicking on
                          "Withdraw Funds". Enter the amount you wish to withdraw and select your preferred payment
                          method. Withdrawals are typically processed within 1-2 business days.
                        </p>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <button className="w-full flex items-center justify-between p-4 text-left font-medium hover:bg-gray-50">
                        <span>What should I do if a passenger cancels a trip?</span>
                        <ChevronDown size={18} />
                      </button>
                      <div className="p-4 bg-gray-50 border-t border-gray-200">
                        <p className="text-gray-700">
                          If a passenger cancels a trip, you'll receive a notification. Depending on when the
                          cancellation occurs, you may be eligible for a cancellation fee. The system automatically
                          handles this, and any applicable fee will be added to your wallet. You can view the details in
                          your trip history.
                        </p>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <button className="w-full flex items-center justify-between p-4 text-left font-medium hover:bg-gray-50">
                        <span>How can I improve my driver rating?</span>
                        <ChevronDown size={18} />
                      </button>
                      <div className="p-4 bg-gray-50 border-t border-gray-200">
                        <p className="text-gray-700">
                          To improve your rating, focus on providing excellent service: keep your vehicle clean, be
                          punctual, follow the optimal route, drive safely, and be courteous to passengers. Consistently
                          good service will lead to better ratings and more trip requests.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-cyan-50 rounded-lg flex items-start">
                    <HelpCircle size={20} className="text-cyan-600 mr-3 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-cyan-800">
                      Can't find what you're looking for? Contact our support team for personalized assistance. We're
                      available 24/7 to help you with any issues or questions.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Trip Details Modal */}
      {showTripDetails && selectedTrip && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex items-center justify-between">
              <h3 className="text-lg font-bold">Trip Details #{selectedTrip.bid}</h3>
              <button onClick={() => setShowTripDetails(false)} className="p-1 rounded-full hover:bg-gray-100">
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              {/* Trip Status */}
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(selectedTrip.trip_status)} mr-2`}></div>
                  <span className="font-medium">{getStatusText(selectedTrip.trip_status)}</span>
                </div>
                <span className="text-sm text-gray-500">{formatDate(selectedTrip.pickup_date_time)}</span>
              </div>

              {/* Trip Route */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="flex items-start mb-4">
                  <div className="mt-1">
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    <div className="w-0.5 h-16 bg-gray-300 mx-auto my-1"></div>
                    <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="mb-4">
                      <p className="text-sm text-gray-500">Pickup Location</p>
                      <p className="font-medium">{selectedTrip.pickup_location}</p>
                      <p className="text-sm text-gray-500 mt-1">{formatDate(selectedTrip.pickup_date_time)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Drop-off Location</p>
                      <p className="font-medium">{selectedTrip.drop_location}</p>
                      <p className="text-sm text-gray-500 mt-1">{formatDate(selectedTrip.drop_date_time)}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500 border-t border-gray-200 pt-3">
                  <div className="flex items-center">
                    <Route size={14} className="mr-1" />
                    <span>Distance: {selectedTrip.distance}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock size={14} className="mr-1" />
                    <span>
                      Duration: {(() => {
                        const pickup = new Date(selectedTrip.pickup_date_time)
                        const dropoff = new Date(selectedTrip.drop_date_time)
                        const diffMs = dropoff - pickup
                        const diffMins = Math.round(diffMs / 60000)
                        return `${diffMins} mins`
                      })()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Passenger Info */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-500 mb-3">Passenger Information</h4>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                    <User size={24} />
                  </div>
                  <div className="ml-3">
                    <p className="font-medium">{selectedTrip.passenger_name}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Phone size={14} className="mr-1" />
                      <span>{selectedTrip.passenger_phone}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trip Details */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-500 mb-3">Trip Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Trip Type</p>
                    <p className="font-medium">{selectedTrip.trip_type === 1 ? "One-Way Trip" : selectedTrip.trip_type === 2 ? "Round Trip" : ""}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Car Type</p>
                    <p className="font-medium">{getCarTypeText(selectedTrip.selected_car)}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Payment Method</p>
                    <p className="font-medium">Online Payment</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Ride OTP</p>
                    <p className="font-medium">{selectedTrip.ride_otp || "N/A"}</p>
                  </div>
                </div>
              </div>

              {/* Fare Breakdown */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-500 mb-3">Fare Breakdown</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Base Fare</span>
                    <span className="font-medium">{formatCurrency(selectedTrip.price)}</span>
                  </div>
                  {/* <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Distance Charge</span>
                    <span className="font-medium">{formatCurrency(Math.round(selectedTrip.price * 0.15))}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Time Charge</span>
                    <span className="font-medium">{formatCurrency(Math.round(selectedTrip.price * 0.05))}</span>
                  </div> */}
                  <div className="flex justify-between pt-2 border-t border-gray-200 mt-2">
                    <span className="font-medium">Total Fare</span>
                    <span className="font-bold">{formatCurrency(selectedTrip.price)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-200 mt-2 text-emerald-600">
                    <span className="font-medium">Your Earnings (90%)</span>
                    <span className="font-bold">{formatCurrency(Math.round(selectedTrip.price * 0.9))}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  <Download size={16} className="mr-2" />
                  Download Receipt
                </button>
                <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  <Share2 size={16} className="mr-2" />
                  Share Trip Details
                </button>
                <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  <ExternalLink size={16} className="mr-2" />
                  View on Map
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}


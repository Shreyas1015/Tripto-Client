// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import secureLocalStorage from "react-secure-storage";
// import axiosInstance from "../../API/axiosInstance";
// import {
//   Avatar,
//   Badge,
//   Button,
//   Card,
//   CardContent,
//   CardHeader,
//   CircularProgress,
//   Divider,
//   Grid,
//   Typography,
//   Tabs,
//   Tab,
// } from "@mui/material";

// const EnhancedPassengerDashboard = () => {
//   const navigate = useNavigate();
//   const [bookings, setBookings] = useState([]);
//   const [activeTab, setActiveTab] = useState("details");
//   const [activeTripIndex, setActiveTripIndex] = useState(0); // State to track the active trip
//   const uid = localStorage.getItem("@secure.n.uid");
//   const decryptedUID = secureLocalStorage.getItem("uid");

//   useEffect(() => {
//     const fetchBookingsDataTable = async () => {
//       try {
//         const res = await axiosInstance.post(
//           `${process.env.REACT_APP_BASE_URL}/passengers/fetchBookingsDataTable`,
//           { decryptedUID }
//         );

//         setBookings(res.data);
//         console.log(res.data);
//       } catch (error) {
//         console.error("Bookings Data Fetch Error: ", error.message);
//       }
//     };

//     fetchBookingsDataTable();
//   }, [decryptedUID]);

//   const BackToLogin = () => {
//     navigate("/");
//   };

//   if (!uid) {
//     return (
//       <div className="container text-center fw-bold">
//         <h2>INVALID URL. Please provide a valid UID.</h2>
//         <Button variant="contained" color="primary" onClick={BackToLogin}>
//           Back to Login
//         </Button>
//       </div>
//     );
//   }

//   // Select the active trip data based on activeTripIndex
//   const tripData = bookings[activeTripIndex] || {};

//   return (
//     <div className="min-h-screen p-4">
//       {/* Map through bookings to create a tab or card for each trip */}
//       <Tabs
//         value={activeTripIndex}
//         onChange={(event, newValue) => setActiveTripIndex(newValue)}
//         sx={{ marginBottom: 2 }}
//       >
//         {bookings.map((trip, index) => (
//           <Tab
//             key={trip.bid}
//             label={`Trip #${trip.bid}`}
//             value={index}
//             sx={{ textTransform: "none" }}
//           />
//         ))}
//       </Tabs>

//       <Card variant="outlined">
//         <CardContent>
//           <Grid container spacing={2} alignItems="center">
//             <Grid item>
//               <Avatar
//                 alt="Passenger"
//                 src="/placeholder-avatar.jpg"
//                 sx={{ width: 56, height: 56 }}
//               />
//             </Grid>
//             <Grid item xs>
//               <Typography variant="h5">{tripData.name}</Typography>
//               <Typography color="textSecondary">
//                 Trip ID: {tripData.bid}
//               </Typography>
//               <Badge
//                 badgeContent={
//                   tripData.trip_status === 0
//                     ? "Pending"
//                     : tripData.trip_status === 1
//                     ? "Accepted"
//                     : "Completed"
//                 }
//                 color={
//                   tripData.trip_status === 0
//                     ? "warning"
//                     : tripData.trip_status === 1
//                     ? "info"
//                     : "success"
//                 }
//               />
//             </Grid>
//             <Grid item>
//               <CircularProgress
//                 variant="determinate"
//                 value={
//                   tripData.trip_status === 0
//                     ? 33
//                     : tripData.trip_status === 1
//                     ? 66
//                     : 100
//                 }
//               />
//             </Grid>
//           </Grid>
//         </CardContent>
//       </Card>

//       <Tabs
//         value={activeTab}
//         onChange={(event, newValue) => setActiveTab(newValue)}
//         sx={{ marginTop: 2 }}
//       >
//         <Tab label="Trip Details" value="details" />
//         <Tab label="Route" value="route" />
//         <Tab label="Payment" value="payment" />
//       </Tabs>

//       <Card variant="outlined" sx={{ marginTop: 2 }}>
//         <CardHeader
//           title={
//             activeTab === "details"
//               ? "Trip Schedule"
//               : activeTab === "route"
//               ? "Trip Route"
//               : "Payment Details"
//           }
//         />
//         <CardContent>
//           {activeTab === "details" && (
//             <>
//               <Typography variant="body1">
//                 Pick-Up: {tripData.pickup_date_time}
//               </Typography>
//               <Typography variant="body1">
//                 Return: {tripData.drop_date_time}
//               </Typography>
//               <Typography variant="body1">
//                 Duration: {tripData.no_of_days} days
//               </Typography>
//               <Typography variant="body1">
//                 Trip Type: {tripData.trip_type}
//               </Typography>
//             </>
//           )}
//           {activeTab === "route" && (
//             <>
//               <Typography variant="body1">
//                 Pick-Up Location: {tripData.pickup_location}
//               </Typography>
//               <Typography variant="body1">
//                 Drop Location: {tripData.drop_location}
//               </Typography>
//             </>
//           )}
//           {activeTab === "payment" && (
//             <>
//               <Typography variant="body1">
//                 Total Amount: {tripData.price}
//               </Typography>
//             </>
//           )}
//         </CardContent>
//       </Card>

//       <Card variant="outlined" sx={{ marginTop: 2 }}>
//         <CardHeader title="Vehicle Details" />
//         <CardContent>
//           <Typography variant="body1">
//             Selected Car: {tripData.selected_car}
//           </Typography>
//           <Typography variant="body1">Distance: {tripData.distance}</Typography>
//           <Divider sx={{ margin: "16px 0" }} />
//           <Button variant="contained" color="primary" fullWidth>
//             Modify Booking
//           </Button>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default EnhancedPassengerDashboard;

// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import secureLocalStorage from "react-secure-storage";
// import axiosInstance from "../../API/axiosInstance";
// import {
//   Avatar,
//   Badge,
//   Button,
//   Card,
//   CardContent,
//   CircularProgress,
//   Grid,
//   Typography,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Tabs,
//   Tab,
// } from "@mui/material";
// import Header from "../Header";

// const EnhancedPassengerDashboard = () => {
//   const navigate = useNavigate();
//   const [bookings, setBookings] = useState([]);
//   const [activeTab, setActiveTab] = useState("details");
//   const [selectedTripIndex, setSelectedTripIndex] = useState(null); // State to track the selected trip
//   const [dialogOpen, setDialogOpen] = useState(false); // State to control dialog visibility
//   const uid = localStorage.getItem("@secure.n.uid");
//   const decryptedUID = secureLocalStorage.getItem("uid");

//   useEffect(() => {
//     const fetchBookingsDataTable = async () => {
//       try {
//         const res = await axiosInstance.post(
//           `${process.env.REACT_APP_BASE_URL}/passengers/fetchBookingsDataTable`,
//           { decryptedUID }
//         );

//         setBookings(res.data);
//         console.log(res.data);
//       } catch (error) {
//         console.error("Bookings Data Fetch Error: ", error.message);
//       }
//     };

//     fetchBookingsDataTable();
//   }, [decryptedUID]);

// const BackToLogin = () => {
//   navigate("/");
// };

// if (!uid) {
//   return (
//     <div className="container text-center fw-bold">
//       <h2>INVALID URL. Please provide a valid UID.</h2>
//       <Button variant="contained" color="primary" onClick={BackToLogin}>
//         Back to Login
//       </Button>
//     </div>
//   );
// }

//   // Select the active trip data based on selectedTripIndex
//   const tripData = bookings[selectedTripIndex] || {};

//   return (
//     <div
//       className="min-h-screen p-4"
//       style={{ filter: dialogOpen ? "blur(5px)" : "none" }}
//     >
//       <Header />

//       <Grid container spacing={2} marginTop={5}>
//         {bookings.map((trip, index) => (
//           <Grid item xs={12} key={trip.bid}>
//             <Card variant="outlined">
//               <CardContent>
//                 <Grid container spacing={2} alignItems="center">
//                   <Grid item>
//                     <Avatar
//                       alt="Passenger"
//                       src="/placeholder-avatar.jpg"
//                       sx={{ width: 56, height: 56 }}
//                     />
//                   </Grid>
//                   <Grid item xs>
//                     <Typography variant="h6">Trip ID: {trip.bid}</Typography>
//                   </Grid>
//                   <Grid item>
//                     <Button
//                       variant="contained"
//                       color="primary"
//                       onClick={() => {
//                         setSelectedTripIndex(index);
//                         setDialogOpen(true);
//                       }}
//                     >
//                       View Details
//                     </Button>
//                   </Grid>
//                 </Grid>
//               </CardContent>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>

//       <Dialog
//         open={dialogOpen}
//         onClose={() => setDialogOpen(false)}
//         fullWidth
//         maxWidth="md"
//       >
//         <DialogTitle>Trip Details</DialogTitle>
//         <DialogContent>
//           <Tabs
//             value={activeTab}
//             onChange={(event, newValue) => setActiveTab(newValue)}
//             sx={{ marginTop: 2 }}
//           >
//             <Tab label="Trip Details" value="details" />
//             <Tab label="Route" value="route" />
//             <Tab label="Payment" value="payment" />
//           </Tabs>

//           <Card variant="outlined" sx={{ marginTop: 2 }}>
//             <CardContent>
//               {activeTab === "details" && (
//                 <>
//                   <Typography variant="body1">
//                     Pick-Up: {tripData.pickup_date_time}
//                   </Typography>
//                   <Typography variant="body1">
//                     Return: {tripData.drop_date_time}
//                   </Typography>
//                   <Typography variant="body1">
//                     Duration: {tripData.no_of_days} days
//                   </Typography>
//                   <Typography variant="body1">
//                     Trip Type: {tripData.trip_type}
//                   </Typography>
//                 </>
//               )}
//               {activeTab === "route" && (
//                 <>
//                   <Typography variant="body1">
//                     Pick-Up Location: {tripData.pickup_location}
//                   </Typography>
//                   <Typography variant="body1">
//                     Drop Location: {tripData.drop_location}
//                   </Typography>
//                 </>
//               )}
//               {activeTab === "payment" && (
//                 <>
//                   <Typography variant="body1">
//                     Total Amount: {tripData.price}
//                   </Typography>
//                 </>
//               )}
//             </CardContent>
//           </Card>

//           <Card variant="outlined" sx={{ marginTop: 2 }}>
//             <CardContent>
//               <Typography variant="body1">
//                 Selected Car: {tripData.selected_car}
//               </Typography>
//               <Typography variant="body1">
//                 Distance: {tripData.distance}
//               </Typography>
//             </CardContent>
//           </Card>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setDialogOpen(false)} color="primary">
//             Close
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </div>
//   );
// };

// export default EnhancedPassengerDashboard;
"use client"

import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import secureLocalStorage from "react-secure-storage"
import { toast, Toaster } from "react-hot-toast"
import axiosInstance from "../../API/axiosInstance"
import {
  MapPin,
  Calendar,
  Clock,
  CreditCard,
  ChevronDown,
  Search,
  Car,
  DollarSign,
  ArrowRight,
  CheckCircle,
  XCircle,
  AlertCircle,
  Truck,
  BarChart4,
  TrendingUp,
  RefreshCw,
  LogOut,
  X,
  FileText,
  Repeat,
  ArrowUpRight,
  ArrowDownRight,
  Menu,
  User,
  Bell,
  Settings,
  Home,
  IndianRupee,
} from "lucide-react"

// Trip status mapping
const TRIP_STATUS = {
  0: { label: "Pending", color: "#F59E0B", icon: <Clock size={16} /> },
  1: { label: "Accepted", color: "#3B82F6", icon: <CheckCircle size={16} /> },
  2: { label: "Driver Arrived", color: "#10B981", icon: <Car size={16} /> },
  3: { label: "Trip Started", color: "#8B5CF6", icon: <ArrowRight size={16} /> },
  4: { label: "Trip In Progress", color: "#6366F1", icon: <TrendingUp size={16} /> },
  5: { label: "Completed", color: "#059669", icon: <CheckCircle size={16} /> },
  6: { label: "Cancelled By Passenger", color: "#EF4444", icon: <XCircle size={16} /> },
  7: { label: "Cancelled By Driver", color: "#DC2626", icon: <XCircle size={16} /> },
}

// Car type mapping
const CAR_TYPE = {
  1: { label: "Sedan", icon: <Car size={16} /> },
  2: { label: "SUV/MUV", icon: <Truck size={16} /> },
}

// Payment mode mapping
const PAYMENT_MODE = {
  1: { label: "Cash", icon: <IndianRupee size={16} /> },
  2: { label: "UPI", icon: <CreditCard size={16} /> },
  3: { label: "Credit Card", icon: <CreditCard size={16} /> },
}

// Trip type mapping
const TRIP_TYPE = {
  1: { label: "One Way", icon: <ArrowRight size={16} /> },
  2: { label: "Round Trip", icon: <Repeat size={16} /> },
}

const PassengerDashboard = () => {
  const navigate = useNavigate()
  const uid = localStorage.getItem("@secure.n.uid")
  const decryptedUID = secureLocalStorage.getItem("uid")

  const [isLoading, setIsLoading] = useState(true)
  const [trips, setTrips] = useState([])
  const [filteredTrips, setFilteredTrips] = useState([])
  const [transactions, setTransactions] = useState([])
  const [pid, setPid] = useState(null)
  const [stats, setStats] = useState({
    totalTrips: 0,
    completedTrips: 0,
    cancelledTrips: 0,
    totalSpent: 0,
    upcomingTrips: 0,
  })
  const [activeFilter, setActiveFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTrip, setSelectedTrip] = useState(null)
  const [showTripDetails, setShowTripDetails] = useState(false)
  const [timeRange, setTimeRange] = useState("all") // all, month, year
  const [monthlySpending, setMonthlySpending] = useState([])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [dataLoaded, setDataLoaded] = useState(false)

  // Fetch passenger trips
  useEffect(() => {
    if (decryptedUID) {
      fetchTrips()
    }
  }, [decryptedUID])

  // Fetch transactions when pid is available
  useEffect(() => {
    if (decryptedUID && pid) {
      fetchTransactions()
    }
  }, [decryptedUID, pid])

  // Filter trips when filter or search changes
  useEffect(() => {
    if (trips.length > 0) {
      let filtered = [...trips]

      // Apply status filter
      if (activeFilter !== "all") {
        filtered = filtered.filter((trip) => {
          if (activeFilter === "upcoming") {
            return [0, 1, 2, 3, 4].includes(trip.trip_status)
          } else if (activeFilter === "completed") {
            return trip.trip_status === 5
          } else if (activeFilter === "cancelled") {
            return [6, 7].includes(trip.trip_status)
          }
          return true
        })
      }

      // Apply time range filter
      if (timeRange !== "all") {
        const now = new Date()
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        const startOfYear = new Date(now.getFullYear(), 0, 1)

        filtered = filtered.filter((trip) => {
          const tripDate = new Date(trip.pickup_date_time)
          if (timeRange === "month") {
            return tripDate >= startOfMonth
          } else if (timeRange === "year") {
            return tripDate >= startOfYear
          }
          return true
        })
      }

      // Apply search filter
      if (searchTerm) {
        filtered = filtered.filter(
          (trip) =>
            trip.pickup_location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            trip.drop_location?.toLowerCase().includes(searchTerm.toLowerCase()),
        )
      }

      setFilteredTrips(filtered)
    }
  }, [trips, activeFilter, searchTerm, timeRange])

  // Calculate stats and monthly spending when transactions or trips change
  useEffect(() => {
    if (trips.length > 0 && transactions.length > 0) {
      calculateStats()
      calculateMonthlySpending()
      setDataLoaded(true)
    }
  }, [trips, transactions])

  const calculateStats = () => {
    const totalTrips = trips.length
    const completedTrips = trips.filter((trip) => trip.trip_status === 5).length
    const cancelledTrips = trips.filter((trip) => [6, 7].includes(trip.trip_status)).length
    const upcomingTrips = trips.filter((trip) => [0, 1, 2, 3, 4].includes(trip.trip_status)).length

    // Calculate total spent from transactions
    const totalSpent = transactions.reduce((sum, transaction) => sum + Number.parseFloat(transaction.amount || 0), 0)

    setStats({
      totalTrips,
      completedTrips,
      cancelledTrips,
      totalSpent,
      upcomingTrips,
    })
  }

  const fetchTrips = async () => {
    setIsLoading(true)
    try {
      const response = await axiosInstance.post(`${process.env.REACT_APP_BASE_URL}/passengers/fetchPassengerTrips`, {
        decryptedUID,
      })

      if (response.status === 200) {
        // Sort trips by date (newest first)
        const sortedTrips = response.data.sort((a, b) => new Date(b.pickup_date_time) - new Date(a.pickup_date_time))
        setTrips(sortedTrips)
        setFilteredTrips(sortedTrips)

        // Extract passenger ID from the first trip
        if (sortedTrips.length > 0 && sortedTrips[0].pid) {
          setPid(sortedTrips[0].pid)
        }
      }
    } catch (error) {
      console.error("Error fetching trips:", error)
      toast.error("Failed to load trip data")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchTransactions = async () => {
    try {
      const response = await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/passengers/fetchPassengerTransactions`,
        {
          decryptedUID,
          passenger_id: pid,
        },
      )

      if (response.status === 200) {
        setTransactions(response.data)
      }
    } catch (error) {
      console.error("Error fetching transactions:", error)
    }
  }

  const calculateMonthlySpending = () => {
    // Create a map to store monthly spending
    const spending = {}

    // Get current date to calculate last 6 months
    const now = new Date()

    // Initialize last 6 months with zero values
    for (let i = 5; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthKey = month.toLocaleString("default", { month: "short", year: "numeric" })
      spending[monthKey] = 0
    }

    // Add transaction amounts to the corresponding months
    transactions.forEach((txn) => {
      const date = new Date(txn.created_at)
      const monthKey = date.toLocaleString("default", { month: "short", year: "numeric" })

      // Only include transactions from the last 6 months
      const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1)
      if (date >= sixMonthsAgo && spending.hasOwnProperty(monthKey)) {
        spending[monthKey] += Number.parseFloat(txn.amount || 0)
      }
    })

    // Convert to array format for the chart
    const spendingArray = Object.entries(spending).map(([month, amount]) => ({
      month,
      amount,
    }))

    setMonthlySpending(spendingArray)
  }

  const refreshData = async () => {
    setIsRefreshing(true)
    setDataLoaded(false)
    await fetchTrips()
    if (pid) {
      await fetchTransactions()
    }
    toast.success("Data refreshed successfully")
    setIsRefreshing(false)
  }

  const viewTripDetails = (trip) => {
    setSelectedTrip(trip)
    setShowTripDetails(true)
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatTime = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount || 0)
  }

  const getStatusBadge = (status) => {
    const statusInfo = TRIP_STATUS[status] || {
      label: "Unknown",
      color: "#6B7280",
      icon: <AlertCircle size={16} />,
    }

    return (
      <div
        className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
        style={{
          backgroundColor: `${statusInfo.color}20`,
          color: statusInfo.color,
        }}
      >
        <span className="mr-1">{statusInfo.icon}</span>
        {statusInfo.label}
      </div>
    )
  }

  const getPaymentBadge = (mode) => {
    const paymentInfo = PAYMENT_MODE[mode] || {
      label: "Unknown",
      icon: <AlertCircle size={16} />,
    }

    return (
      <div className="inline-flex items-center text-gray-700">
        <span className="mr-1">{paymentInfo.icon}</span>
        {paymentInfo.label}
      </div>
    )
  }

  const getTripTypeBadge = (type) => {
    const tripInfo = TRIP_TYPE[type] || {
      label: "Unknown",
      icon: <AlertCircle size={16} />,
    }

    return (
      <div className="inline-flex items-center text-gray-700">
        <span className="mr-1">{tripInfo.icon}</span>
        {tripInfo.label}
      </div>
    )
  }

  const getCarTypeBadge = (type) => {
    const carInfo = CAR_TYPE[type] || {
      label: "Unknown",
      icon: <Car size={16} />,
    }

    return (
      <div className="inline-flex items-center text-gray-700">
        <span className="mr-1">{carInfo.icon}</span>
        {carInfo.label}
      </div>
    )
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  }

  const cardVariants = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 20 },
    },
    hover: {
      scale: 1.02,
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      transition: { type: "spring", stiffness: 300, damping: 20 },
    },
  }

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 25 },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      transition: { duration: 0.2 },
    },
  }

  // Calculate max amount for chart scaling
  const maxAmount = useMemo(() => {
    if (monthlySpending.length === 0) return 0
    return Math.max(...monthlySpending.map((d) => d.amount))
  }, [monthlySpending])

  if (!uid) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Invalid Access</h2>
          <p className="text-gray-600 mb-6">Please provide a valid user ID to access this page.</p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center mx-auto"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Back to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">

      {/* Main Content */}
      <div className="min-h-screen">
        <div className="p-6 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Trips</h1>
              <p className="text-gray-600">View and manage all your trips</p>
            </div>

            <div className="mt-4 md:mt-0 flex items-center space-x-3">
              <button
                onClick={refreshData}
                disabled={isRefreshing}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                {isRefreshing ? "Refreshing..." : "Refresh"}
              </button>

              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                <Car className="mr-2 h-4 w-4" />
                Book a Ride
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            <motion.div variants={cardVariants} whileHover="hover" className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Trips</p>
                  <h3 className="text-2xl font-bold mt-1">{stats.totalTrips}</h3>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                  <Car className="h-6 w-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-green-600 flex items-center">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  {Math.round((stats.completedTrips / (stats.totalTrips || 1)) * 100)}%
                </span>
                <span className="ml-2 text-gray-500">completion rate</span>
              </div>
            </motion.div>

            <motion.div variants={cardVariants} whileHover="hover" className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Spent</p>
                  <h3 className="text-2xl font-bold mt-1">{formatCurrency(stats.totalSpent)}</h3>
                </div>
                <div className="p-3 bg-green-100 rounded-lg text-green-600">
                  <IndianRupee className="h-6 w-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-gray-500">
                  Avg. {formatCurrency(stats.totalSpent / (stats.completedTrips || 1))} per trip
                </span>
              </div>
            </motion.div>

            <motion.div variants={cardVariants} whileHover="hover" className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500">Completed Trips</p>
                  <h3 className="text-2xl font-bold mt-1">{stats.completedTrips}</h3>
                </div>
                <div className="p-3 bg-green-100 rounded-lg text-green-600">
                  <CheckCircle className="h-6 w-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span
                  className={`flex items-center ${stats.completedTrips > stats.cancelledTrips ? "text-green-600" : "text-red-600"}`}
                >
                  {stats.completedTrips > stats.cancelledTrips ? (
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 mr-1" />
                  )}
                  {stats.completedTrips - stats.cancelledTrips}
                </span>
                <span className="ml-2 text-gray-500">vs cancelled</span>
              </div>
            </motion.div>

            <motion.div variants={cardVariants} whileHover="hover" className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500">Upcoming Trips</p>
                  <h3 className="text-2xl font-bold mt-1">{stats.upcomingTrips}</h3>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg text-purple-600">
                  <Calendar className="h-6 w-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-gray-500">
                  {stats.upcomingTrips > 0 ? "Trips scheduled" : "No upcoming trips"}
                </span>
              </div>
            </motion.div>
          </motion.div>


          {/* <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            className="bg-white p-6 rounded-xl shadow-sm mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-800">Monthly Spending</h2>
              <div className="flex items-center text-sm text-gray-500">
                <BarChart4 className="h-4 w-4 mr-1" />
                Last 6 months
              </div>
            </div>

            {isLoading || !dataLoaded ? (
              <div className="h-64 flex items-center justify-center">
                <RefreshCw className="h-8 w-8 text-blue-500 animate-spin" />
              </div>
            ) : (
              <div className="h-64 flex items-end space-x-2">
                {monthlySpending.map((data, index) => {
                  // Calculate height percentage (minimum 5% for visibility)
                  const heightPercentage = maxAmount > 0 ? Math.max((data.amount / maxAmount) * 100, 5) : 5

                  return (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div className="w-full h-full flex items-end justify-center">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${heightPercentage}%` }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          className="w-full bg-blue-500 rounded-t-md"
                          style={{ maxWidth: "40px" }}
                        />
                      </div>
                      <div className="mt-2 text-xs text-gray-600">{data.month}</div>
                      <div className="text-xs font-medium">{formatCurrency(data.amount)}</div>
                    </div>
                  )
                })}
              </div>
            )}
          </motion.div> */}

          {/* Filters and Search */}
          <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveFilter("all")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${activeFilter === "all" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  All Trips
                </button>
                <button
                  onClick={() => setActiveFilter("upcoming")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${activeFilter === "upcoming"
                    ? "bg-purple-100 text-purple-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  Upcoming
                </button>
                <button
                  onClick={() => setActiveFilter("completed")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${activeFilter === "completed"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  Completed
                </button>
                <button
                  onClick={() => setActiveFilter("cancelled")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${activeFilter === "cancelled"
                    ? "bg-red-100 text-red-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  Cancelled
                </button>
              </div>

              <div className="flex items-center space-x-3">
                <div className="relative">
                  <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    className="pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                  >
                    <option value="all">All Time</option>
                    <option value="month">This Month</option>
                    <option value="year">This Year</option>
                  </select>
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>

                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search locations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Trips List */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center">
                  <RefreshCw className="h-12 w-12 text-blue-500 animate-spin mb-4" />
                  <p className="text-gray-600">Loading your trips...</p>
                </div>
              </div>
            ) : filteredTrips.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 p-6 text-center">
                <Car className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-800 mb-2">No trips found</h3>
                <p className="text-gray-500 max-w-md">
                  {searchTerm
                    ? "No trips match your search criteria. Try adjusting your filters."
                    : "You haven't taken any trips yet. Book your first ride now!"}
                </p>
                <button className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                  <Car className="mr-2 h-4 w-4" />
                  Book a Ride
                </button>
              </div>
            ) : (
              <motion.div variants={containerVariants} initial="hidden" animate="visible">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Trip Details
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Date & Time
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Car Type
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Amount
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredTrips.map((trip) => (
                        <motion.tr
                          key={trip.bid}
                          variants={itemVariants}
                          className="hover:bg-gray-50 cursor-pointer"
                          onClick={() => viewTripDetails(trip)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-start">
                              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                {TRIP_TYPE[trip.trip_type]?.icon || <Car className="h-5 w-5 text-blue-600" />}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {getTripTypeBadge(trip.trip_type)}
                                </div>
                                <div className="text-sm text-gray-500 mt-1 flex items-center">
                                  <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                                  <span className="truncate max-w-xs">{trip.pickup_location || "N/A"}</span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{formatDate(trip.pickup_date_time)}</div>
                            <div className="text-sm text-gray-500">{formatTime(trip.pickup_date_time)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">{getCarTypeBadge(trip.selected_car)}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{formatCurrency(trip.price)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(trip.trip_status)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                viewTripDetails(trip)
                              }}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              View Details
                            </button>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Trip Details Modal */}
      <AnimatePresence>
        {showTripDetails && selectedTrip && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b sticky top-0 bg-white z-10 flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900">Trip Details</h3>
                <button onClick={() => setShowTripDetails(false)} className="text-gray-400 hover:text-gray-500">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6">
                {/* Trip Status */}
                <div className="mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {getStatusBadge(selectedTrip.trip_status)}
                      <span className="ml-2 text-sm text-gray-500">
                        {selectedTrip.trip_status === 5 ? "Completed on" : "Last updated"}:{" "}
                        {formatDate(selectedTrip.pickup_date_time)}
                      </span>
                    </div>
                    <div>{getTripTypeBadge(selectedTrip.trip_type)}</div>
                  </div>
                </div>

                {/* Trip Route */}
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <div className="flex items-start mb-4">
                    <div className="flex flex-col items-center mr-4">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <div className="w-0.5 h-16 bg-gray-300 my-1"></div>
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    </div>
                    <div className="flex-1">
                      <div className="mb-4">
                        <p className="text-xs text-gray-500">PICKUP LOCATION</p>
                        <p className="text-sm font-medium">{selectedTrip.pickup_location || "N/A"}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(selectedTrip.pickup_date_time)} • {formatTime(selectedTrip.pickup_date_time)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">DROP LOCATION</p>
                        <p className="text-sm font-medium">{selectedTrip.drop_location || "N/A"}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(selectedTrip.drop_date_time)} • {formatTime(selectedTrip.drop_date_time)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <span className="text-gray-500">Distance:</span>
                      <span className="ml-1 font-medium">{selectedTrip.distance || "N/A"}</span>
                    </div>
                    {selectedTrip.trip_type === 2 && (
                      <div>
                        <span className="text-gray-500">Duration:</span>
                        <span className="ml-1 font-medium">{selectedTrip.no_of_days || 0} days</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Trip Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-3">RIDE DETAILS</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Car Type</span>
                        <span className="text-sm font-medium">{getCarTypeBadge(selectedTrip.selected_car)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Booking ID</span>
                        <span className="text-sm font-medium">#{selectedTrip.bid}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Driver ID</span>
                        <span className="text-sm font-medium">#{selectedTrip.did || "Not assigned"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Passenger</span>
                        <span className="text-sm font-medium">{selectedTrip.passenger_name || "N/A"}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-3">PAYMENT DETAILS</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Amount</span>
                        <span className="text-sm font-medium">{formatCurrency(selectedTrip.price)}</span>
                      </div>

                      {/* Find transaction for this trip */}
                      {transactions.find((tx) => tx.bid === selectedTrip.bid) ? (
                        <>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Payment Method</span>
                            <span className="text-sm font-medium">
                              {getPaymentBadge(transactions.find((tx) => tx.bid === selectedTrip.bid)?.payment_mode)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Payment Status</span>
                            <span className="text-sm font-medium text-green-600 flex items-center">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Paid
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Transaction ID</span>
                            <span className="text-sm font-medium">
                              #{transactions.find((tx) => tx.bid === selectedTrip.bid)?.txn_id || "N/A"}
                            </span>
                          </div>
                        </>
                      ) : (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Payment Status</span>
                          {selectedTrip.trip_status === 5 ? (
                            <span className="text-sm font-medium text-green-600 flex items-center">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Paid
                            </span>
                          ) : (
                            <span className="text-sm font-medium text-yellow-600 flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              Pending
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3 justify-end pt-4 border-t">
                  {selectedTrip.trip_status === 0 && (
                    <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                      Cancel Trip
                    </button>
                  )}

                  {[1, 2, 3, 4].includes(selectedTrip.trip_status) && (
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                      <MapPin className="mr-2 h-4 w-4" />
                      Track Ride
                    </button>
                  )}

                  {selectedTrip.trip_status === 5 && (
                    <>
                      <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                        <FileText className="mr-2 h-4 w-4" />
                        Download Invoice
                      </button>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                        <Repeat className="mr-2 h-4 w-4" />
                        Book Similar Trip
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => setShowTripDetails(false)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default PassengerDashboard


import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import secureLocalStorage from "react-secure-storage";
import toast from "react-hot-toast";
import {
  Activity,
  Calendar,
  Car,
  Clock,
  DollarSign,
  MapPin,
  MoreHorizontal,
  RefreshCw,
  Search,
  Star,
  Users,
  Wallet,
} from "lucide-react";

const VendorDashboardContent = () => {
  const decryptedUID = secureLocalStorage.getItem("uid");
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTrips: 0,
    pendingTrips: 0,
    completedTrips: 0,
    cancelledTrips: 0,
    totalEarnings: 0,
    walletBalance: 0,
  });
  const [recentTrips, setRecentTrips] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data for demonstration
  const mockStats = {
    totalTrips: 124,
    pendingTrips: 3,
    completedTrips: 118,
    cancelledTrips: 3,
    totalEarnings: 15750.5,
    walletBalance: 125.5,
  };

  const mockRecentTrips = [
    {
      id: "TR-7845",
      date: "2023-03-15",
      time: "14:30",
      pickup: "Airport Terminal 1",
      dropoff: "Central Business District",
      amount: 450,
      status: "completed",
      passenger: "John Doe",
      rating: 4.8,
    },
    {
      id: "TR-7844",
      date: "2023-03-14",
      time: "09:15",
      pickup: "Westside Mall",
      dropoff: "North Hills Residency",
      amount: 320,
      status: "completed",
      passenger: "Sarah Johnson",
      rating: 5.0,
    },
    {
      id: "TR-7843",
      date: "2023-03-14",
      time: "18:45",
      pickup: "Central Station",
      dropoff: "Greenwood Heights",
      amount: 280,
      status: "completed",
      passenger: "Michael Brown",
      rating: 4.5,
    },
    {
      id: "TR-7842",
      date: "2023-03-13",
      time: "11:20",
      pickup: "City Hospital",
      dropoff: "Riverside Apartments",
      amount: 350,
      status: "cancelled",
      passenger: "Emily Wilson",
      rating: null,
    },
    {
      id: "TR-7841",
      date: "2023-03-12",
      time: "20:10",
      pickup: "Grand Hotel",
      dropoff: "Airport Terminal 2",
      amount: 520,
      status: "completed",
      passenger: "Robert Chen",
      rating: 4.9,
    },
  ];

  const mockAvailableTrips = [
    {
      id: "TR-8001",
      date: "2023-03-16",
      time: "10:30",
      pickup: "Downtown Plaza",
      dropoff: "Sunset Beach Resort",
      estimatedAmount: 580,
      distance: "12.5 km",
      passenger: "Alex Morgan",
      status: "available",
    },
    {
      id: "TR-8002",
      date: "2023-03-16",
      time: "13:45",
      pickup: "Metro Station",
      dropoff: "University Campus",
      estimatedAmount: 220,
      distance: "5.8 km",
      passenger: "Jessica Lee",
      status: "available",
    },
    {
      id: "TR-8003",
      date: "2023-03-16",
      time: "16:15",
      pickup: "Shopping Mall",
      dropoff: "Hillside Residency",
      estimatedAmount: 350,
      distance: "8.2 km",
      passenger: "David Smith",
      status: "available",
    },
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        // In a real app, these would be actual API calls
        // const statsResponse = await axiosInstance.post(
        //   `${process.env.REACT_APP_BASE_URL}/vendor/fetchDashboardStats`,
        //   { decryptedUID }
        // );
        // const tripsResponse = await axiosInstance.post(
        //   `${process.env.REACT_APP_BASE_URL}/vendor/fetchRecentTrips`,
        //   { decryptedUID }
        // );

        // Simulate API response with mock data
        setTimeout(() => {
          setStats(mockStats);
          setRecentTrips(mockRecentTrips);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Failed to load dashboard data");
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [decryptedUID]);

  const acceptTrip = (tripId) => {
    toast.success(`Trip ${tripId} accepted successfully!`);
    // In a real app, this would make an API call to accept the trip
  };

  const refreshDashboard = () => {
    toast.loading("Refreshing dashboard...");
    // In a real app, this would refetch the data
    setTimeout(() => {
      toast.dismiss();
      toast.success("Dashboard refreshed");
    }, 1000);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Vendor Dashboard</h1>
          <p className="text-gray-500">
            Welcome back! Here's your business at a glance
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search trips..."
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={refreshDashboard}
            className="bg-blue-50 text-blue-600 p-2 rounded-lg hover:bg-blue-100"
          >
            <RefreshCw size={20} />
          </motion.button>
        </div>
      </div>

      {/* Dashboard Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex overflow-x-auto">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
              activeTab === "overview"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("available")}
            className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
              activeTab === "available"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Available Trips
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
              activeTab === "history"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Trip History
          </button>
          <button
            onClick={() => setActiveTab("earnings")}
            className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
              activeTab === "earnings"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Earnings
          </button>
          <button
            onClick={() => setActiveTab("wallet")}
            className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
              activeTab === "wallet"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Wallet
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {activeTab === "overview" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm">Total Trips</p>
                  <h3 className="text-2xl font-bold mt-1">
                    {stats.totalTrips}
                  </h3>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Car className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-green-600">
                <Activity className="h-4 w-4 mr-1" />
                <span>+12% from last month</span>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm">Total Earnings</p>
                  <h3 className="text-2xl font-bold mt-1">
                    ₹{stats.totalEarnings.toFixed(2)}
                  </h3>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-green-600">
                <Activity className="h-4 w-4 mr-1" />
                <span>+8% from last month</span>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm">Wallet Balance</p>
                  <h3 className="text-2xl font-bold mt-1">
                    ₹{stats.walletBalance.toFixed(2)}
                  </h3>
                </div>
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Wallet className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-purple-600">
                <Activity className="h-4 w-4 mr-1" />
                <span>Last updated today</span>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl shadow-md p-6 border-l-4 border-amber-500"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm">Completion Rate</p>
                  <h3 className="text-2xl font-bold mt-1">95.2%</h3>
                </div>
                <div className="bg-amber-100 p-3 rounded-lg">
                  <Star className="h-6 w-6 text-amber-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-green-600">
                <Activity className="h-4 w-4 mr-1" />
                <span>+2.3% from last month</span>
              </div>
            </motion.div>
          </div>

          {/* Recent Trips */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Recent Trips</h3>
                <button className="text-blue-600 text-sm font-medium hover:underline">
                  View All
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trip ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Route
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Passenger
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rating
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentTrips.map((trip) => (
                    <tr key={trip.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                        {trip.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                          {new Date(trip.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center mt-1">
                          <Clock className="h-4 w-4 mr-1 text-gray-400" />
                          {trip.time}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        <div className="flex items-start">
                          <MapPin className="h-4 w-4 mr-1 text-gray-400 mt-0.5" />
                          <div>
                            <p className="font-medium">{trip.pickup}</p>
                            <p className="text-gray-500 mt-1">{trip.dropoff}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1 text-gray-400" />
                          {trip.passenger}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ₹{trip.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            trip.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : trip.status === "cancelled"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {trip.status.charAt(0).toUpperCase() +
                            trip.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {trip.rating ? (
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-amber-500 mr-1" />
                            <span>{trip.rating}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <button className="text-gray-400 hover:text-gray-600">
                          <MoreHorizontal className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Available Trips Tab */}
      {activeTab === "available" && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold">Available Trips</h3>
            <p className="text-gray-500 text-sm mt-1">
              These trips need a vendor. Accept them to increase your earnings.
            </p>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockAvailableTrips.map((trip) => (
              <motion.div
                key={trip.id}
                whileHover={{ y: -5 }}
                className="border border-gray-200 rounded-lg overflow-hidden shadow-sm"
              >
                <div className="bg-blue-50 p-4 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-600 font-medium">{trip.id}</span>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                      Available
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-center mb-3">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-700">
                      {new Date(trip.date).toLocaleDateString()} at {trip.time}
                    </span>
                  </div>

                  <div className="mb-3">
                    <div className="flex items-start mb-2">
                      <div className="min-w-[24px] flex justify-center">
                        <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                          <MapPin className="h-3 w-3 text-green-600" />
                        </div>
                      </div>
                      <div className="ml-2">
                        <p className="text-xs text-gray-500">Pickup</p>
                        <p className="text-sm font-medium">{trip.pickup}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="min-w-[24px] flex justify-center">
                        <div className="h-6 w-6 rounded-full bg-red-100 flex items-center justify-center">
                          <MapPin className="h-3 w-3 text-red-600" />
                        </div>
                      </div>
                      <div className="ml-2">
                        <p className="text-xs text-gray-500">Dropoff</p>
                        <p className="text-sm font-medium">{trip.dropoff}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-xs text-gray-500">Distance</p>
                      <p className="text-sm font-medium">{trip.distance}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Estimated Fare</p>
                      <p className="text-sm font-medium">
                        ₹{trip.estimatedAmount.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => acceptTrip(trip.id)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors"
                  >
                    Accept Trip
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Wallet Tab */}
      {activeTab === "wallet" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Wallet Balance</h3>

              <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 text-white">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-blue-100 text-sm">Current Balance</p>
                    <h2 className="text-3xl font-bold mt-1">
                      ₹{stats.walletBalance.toFixed(2)}
                    </h2>
                  </div>
                  <Wallet className="h-10 w-10 text-blue-200" />
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white py-2 px-4 rounded-lg font-medium transition-colors"
                  >
                    Add Money
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white py-2 px-4 rounded-lg font-medium transition-colors"
                  >
                    Withdraw
                  </motion.button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold">Recent Transactions</h3>
            </div>

            <div className="divide-y divide-gray-100">
              <div className="p-4 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <DollarSign className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Trip Earnings</p>
                    <p className="text-sm text-gray-500">Trip ID: TR-7845</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600">+₹450.00</p>
                  <p className="text-xs text-gray-500">Mar 15, 2023</p>
                </div>
              </div>

              <div className="p-4 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <DollarSign className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Trip Earnings</p>
                    <p className="text-sm text-gray-500">Trip ID: TR-7844</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600">+₹320.00</p>
                  <p className="text-xs text-gray-500">Mar 14, 2023</p>
                </div>
              </div>

              <div className="p-4 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
                    <DollarSign className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <p className="font-medium">Withdrawal</p>
                    <p className="text-sm text-gray-500">To Bank Account</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-red-600">-₹1000.00</p>
                  <p className="text-xs text-gray-500">Mar 10, 2023</p>
                </div>
              </div>

              <div className="p-4 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <DollarSign className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Cancellation Fee</p>
                    <p className="text-sm text-gray-500">Trip ID: TR-7842</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-blue-600">+₹25.00</p>
                  <p className="text-xs text-gray-500">Mar 13, 2023</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorDashboardContent;

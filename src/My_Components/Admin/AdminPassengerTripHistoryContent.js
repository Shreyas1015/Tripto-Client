import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import axiosInstance from "../../API/axiosInstance";
import secureLocalStorage from "react-secure-storage";
import {
  Search,
  Calendar,
  MapPin,
  Clock,
  ChevronDown,
  ChevronUp,
  Filter,
  Car,
  X,
  ArrowLeft,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock4,
  User,
  Phone,
  FileText,
  Edit,
  Trash2,
  RefreshCw,
  Eye,
  ChevronLeft,
  ChevronRight,
  Key,
  CreditCard,
  Building,
} from "lucide-react";
import toast from "react-hot-toast";

// Trip status mapping
const tripStatusMap = {
  0: { label: "Pending", icon: Clock4, color: "text-yellow-500 bg-yellow-100" },
  1: {
    label: "Accepted",
    icon: CheckCircle,
    color: "text-blue-500 bg-blue-100",
  },
  2: {
    label: "Driver Arrived",
    icon: Car,
    color: "text-purple-500 bg-purple-100",
  },
  3: {
    label: "Trip Started",
    icon: Car,
    color: "text-indigo-500 bg-indigo-100",
  },
  4: {
    label: "Trip In Progress",
    icon: Car,
    color: "text-teal-500 bg-teal-100",
  },
  5: {
    label: "Completed",
    icon: CheckCircle,
    color: "text-green-500 bg-green-100",
  },
  6: {
    label: "Cancelled By Passenger",
    icon: XCircle,
    color: "text-red-500 bg-red-100",
  },
  7: {
    label: "Cancelled By Driver",
    icon: XCircle,
    color: "text-red-500 bg-red-100",
  },
};

// Car type mapping
const carTypeMap = {
  1: "4+1 Seater",
  2: "6+1 Seater",
};

// Trip type mapping
const tripTypeMap = {
  0: "One-way Trip",
  1: "Round Trip",
};

export default function AdminPassengerTripHistory() {
  const navigate = useNavigate();
  const uid = localStorage.getItem("@secure.n.uid");
  const decryptedUID = secureLocalStorage.getItem("uid");

  const [trips, setTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedTrip, setExpandedTrip] = useState(null);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [tripsPerPage] = useState(10);
  const [newStatus, setNewStatus] = useState(0);
  const [filters, setFilters] = useState({
    tripStatus: null,
    tripType: null,
    passengerId: "",
    passengerName: "",
    passengerPhone: "",
    dateRange: {
      start: null,
      end: null,
    },
  });
  const [stats, setStats] = useState({
    totalTrips: 0,
    pendingTrips: 0,
    acceptedTrips: 0,
    driverArrivedTrips: 0,
    tripStartedTrips: 0,
    inProgressTrips: 0,
    completedTrips: 0,
    cancelledByPassengerTrips: 0,
    cancelledByDriverTrips: 0,
    totalRevenue: 0,
  });

  // Fetch all passenger trips
  useEffect(() => {
    const fetchAllPassengerTrips = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.post(
          `${process.env.REACT_APP_BASE_URL}/admin/getAllPassengerTrips`,
          {
            decryptedUID,
          }
        );

        if (response.data && Array.isArray(response.data)) {
          console.log("Fetched trips:", response.data);
          // Sort trips by date (newest first)
          const sortedTrips = response.data.sort(
            (a, b) =>
              new Date(b.pickup_date_time) - new Date(a.pickup_date_time)
          );
          setTrips(sortedTrips);
          setFilteredTrips(sortedTrips);
          calculateStats(sortedTrips);
          setTotalPages(Math.ceil(sortedTrips.length / tripsPerPage));
        }
      } catch (error) {
        console.error("Error fetching trip history:", error);
        toast.error("Failed to load passenger trips. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (decryptedUID) {
      fetchAllPassengerTrips();
    }
  }, [decryptedUID, tripsPerPage]);

  // Calculate statistics
  const calculateStats = (tripData) => {
    const stats = tripData.reduce(
      (acc, trip) => {
        acc.totalTrips += 1;

        switch (trip.trip_status) {
          case 0:
            acc.pendingTrips += 1;
            break;
          case 1:
            acc.acceptedTrips += 1;
            break;
          case 2:
            acc.driverArrivedTrips += 1;
            break;
          case 3:
            acc.tripStartedTrips += 1;
            break;
          case 4:
            acc.inProgressTrips += 1;
            break;
          case 5:
            acc.completedTrips += 1;
            acc.totalRevenue += Number.parseInt(trip.price) || 0;
            break;
          case 6:
            acc.cancelledByPassengerTrips += 1;
            break;
          case 7:
            acc.cancelledByDriverTrips += 1;
            break;
          default:
            break;
        }

        return acc;
      },
      {
        totalTrips: 0,
        pendingTrips: 0,
        acceptedTrips: 0,
        driverArrivedTrips: 0,
        tripStartedTrips: 0,
        inProgressTrips: 0,
        completedTrips: 0,
        cancelledByPassengerTrips: 0,
        cancelledByDriverTrips: 0,
        totalRevenue: 0,
      }
    );

    setStats(stats);
  };

  // Handle search and filtering
  useEffect(() => {
    let results = [...trips];

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        (trip) =>
          trip.pickup_location?.toLowerCase().includes(query) ||
          trip.drop_location?.toLowerCase().includes(query) ||
          trip.bid?.toString().includes(query) ||
          trip.passenger_name?.toLowerCase().includes(query) ||
          trip.passenger_phone?.includes(query)
      );
    }

    // Apply filters
    if (filters.tripStatus !== null) {
      results = results.filter(
        (trip) => trip.trip_status === filters.tripStatus
      );
    }

    if (filters.tripType !== null) {
      results = results.filter((trip) => trip.trip_type === filters.tripType);
    }

    if (filters.passengerId) {
      results = results.filter(
        (trip) => trip.pid?.toString() === filters.passengerId
      );
    }

    if (filters.passengerName) {
      results = results.filter((trip) =>
        trip.passenger_name
          ?.toLowerCase()
          .includes(filters.passengerName.toLowerCase())
      );
    }

    if (filters.passengerPhone) {
      results = results.filter((trip) =>
        trip.passenger_phone?.includes(filters.passengerPhone)
      );
    }

    if (filters.dateRange.start && filters.dateRange.end) {
      const startDate = new Date(filters.dateRange.start);
      const endDate = new Date(filters.dateRange.end);
      endDate.setHours(23, 59, 59, 999); // Include the entire end day

      results = results.filter((trip) => {
        const tripDate = new Date(trip.pickup_date_time);
        return tripDate >= startDate && tripDate <= endDate;
      });
    }

    setFilteredTrips(results);
    setTotalPages(Math.ceil(results.length / tripsPerPage));
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchQuery, filters, trips, tripsPerPage]);

  // Reset filters
  const resetFilters = () => {
    setFilters({
      tripStatus: null,
      tripType: null,
      passengerId: "",
      passengerName: "",
      passengerPhone: "",
      dateRange: {
        start: null,
        end: null,
      },
    });
    setSearchQuery("");
    setFilterOpen(false);
  };

  // Toggle trip details expansion
  const toggleTripExpansion = (tripId) => {
    setExpandedTrip(expandedTrip === tripId ? null : tripId);
  };

  // Open trip details modal
  const openTripDetails = (trip) => {
    setSelectedTrip(trip);
    setShowDetailModal(true);
  };

  // Open delete confirmation modal
  const openDeleteModal = (trip) => {
    setSelectedTrip(trip);
    setShowDeleteModal(true);
  };

  // Open status update modal
  const openStatusModal = (trip) => {
    setSelectedTrip(trip);
    setNewStatus(trip.trip_status);
    setShowStatusModal(true);
  };

  // Delete trip
  const deleteTrip = async () => {
    try {
      await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/admin/deleteTrip`,
        {
          decryptedUID,
          bid: selectedTrip.bid,
        }
      );

      toast.success(`Trip #${selectedTrip.bid} has been deleted`);

      // Update trips list
      const updatedTrips = trips.filter(
        (trip) => trip.bid !== selectedTrip.bid
      );
      setTrips(updatedTrips);
      setFilteredTrips(updatedTrips);
      calculateStats(updatedTrips);

      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting trip:", error);
      toast.error("Failed to delete trip. Please try again.");
    }
  };

  // Update trip status
  const updateTripStatus = async () => {
    try {
      await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/admin/updateTripStatus`,
        {
          decryptedUID,
          bid: selectedTrip.bid,
          trip_status: newStatus,
        }
      );

      toast.success(
        `Trip #${selectedTrip.bid} status updated to ${tripStatusMap[newStatus].label}`
      );

      // Update trips list
      const updatedTrips = trips.map((trip) => {
        if (trip.bid === selectedTrip.bid) {
          return { ...trip, trip_status: newStatus };
        }
        return trip;
      });

      setTrips(updatedTrips);
      setFilteredTrips(updatedTrips);
      calculateStats(updatedTrips);

      setShowStatusModal(false);
    } catch (error) {
      console.error("Error updating trip status:", error);
      toast.error("Failed to update trip status. Please try again.");
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "MMM dd, yyyy • h:mm a");
    } catch (error) {
      return "Invalid Date";
    }
  };

  // Format price
  const formatPrice = (price) => {
    return `₹${Number.parseInt(price).toLocaleString("en-IN")}`;
  };

  // Export trip data to CSV
  const exportToCSV = () => {
    const headers = [
      "Booking ID",
      "Passenger ID",
      "Passenger Name",
      "Passenger Phone",
      "Trip Type",
      "Status",
      "Pickup Location",
      "Drop Location",
      "Pickup Date & Time",
      "Return Date & Time",
      "Distance (km)",
      "Vehicle Type",
      "Price",
      "Days",
    ];

    const csvData = filteredTrips.map((trip) => [
      trip.bid,
      trip.pid,
      trip.name,
      trip.phone_number,
      tripTypeMap[trip.trip_type] || "Unknown",
      tripStatusMap[trip.trip_status]?.label || "Unknown",
      trip.pickup_location,
      trip.drop_location,
      formatDate(trip.pickup_date_time),
      formatDate(trip.drop_date_time),
      trip.distance,
      carTypeMap[trip.selected_car] || "Unknown",
      trip.price,
      trip.no_of_days,
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.map((cell) => `"${cell || ""}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `passenger-trips-${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Trip data exported successfully");
  };

  // Pagination
  const paginatedTrips = filteredTrips.slice(
    (currentPage - 1) * tripsPerPage,
    currentPage * tripsPerPage
  );

  // Navigate back to admin dashboard
  const goToDashboard = () => {
    navigate(`/admindashboard?uid=${uid}`);
  };

  // Refresh data
  const refreshData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/admin/getAllPassengerTrips`,
        {
          decryptedUID,
        }
      );

      if (response.data && Array.isArray(response.data)) {
        const sortedTrips = response.data.sort(
          (a, b) => new Date(b.pickup_date_time) - new Date(a.pickup_date_time)
        );
        setTrips(sortedTrips);
        setFilteredTrips(sortedTrips);
        calculateStats(sortedTrips);
        setTotalPages(Math.ceil(sortedTrips.length / tripsPerPage));
        toast.success("Data refreshed successfully");
      }
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast.error("Failed to refresh data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!uid) {
    return (
      <div className="container text-center fw-bold p-5">
        <h2>INVALID URL. Please provide a valid UID.</h2>
        <button onClick={() => navigate("/")} className="btn btn-primary mt-3">
          Back to Login
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={goToDashboard}
                className="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Back to dashboard"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Passenger Trip Management
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={refreshData}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Refresh data"
              >
                <RefreshCw className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </button>
              <button
                onClick={exportToCSV}
                className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                <FileText className="h-4 w-4 mr-2" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8"
        >
          {/* Total Trips */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Total Trips
                </span>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalTrips}
                </div>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Car className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-xs">
              <div className="flex items-center text-green-500">
                <span className="font-medium">Revenue:</span>
                <span className="ml-1">
                  ₹{stats.totalRevenue.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>

          {/* Active Trips */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Active Trips
                </span>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.pendingTrips +
                    stats.acceptedTrips +
                    stats.driverArrivedTrips +
                    stats.tripStartedTrips +
                    stats.inProgressTrips}
                </div>
              </div>
              <div className="h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
            <div className="mt-2 grid grid-cols-3 gap-1 text-xs">
              <div className="text-yellow-500">
                <span className="font-medium">Pending:</span>{" "}
                {stats.pendingTrips}
              </div>
              <div className="text-blue-500">
                <span className="font-medium">Accepted:</span>{" "}
                {stats.acceptedTrips}
              </div>
              <div className="text-purple-500">
                <span className="font-medium">In Progress:</span>{" "}
                {stats.driverArrivedTrips +
                  stats.tripStartedTrips +
                  stats.inProgressTrips}
              </div>
            </div>
          </div>

          {/* Completed Trips */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Completed
                </span>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {stats.completedTrips}
                </div>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-xs">
              <div className="text-green-500">
                <span className="font-medium">Completion Rate:</span>
                <span className="ml-1">
                  {stats.totalTrips > 0
                    ? `${Math.round(
                        (stats.completedTrips / stats.totalTrips) * 100
                      )}%`
                    : "0%"}
                </span>
              </div>
            </div>
          </div>

          {/* Cancelled Trips */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Cancelled
                </span>
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {stats.cancelledByPassengerTrips +
                    stats.cancelledByDriverTrips}
                </div>
              </div>
              <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-xs">
              <div className="text-red-500">
                <span className="font-medium">Cancellation Rate:</span>
                <span className="ml-1">
                  {stats.totalTrips > 0
                    ? `${Math.round(
                        ((stats.cancelledByPassengerTrips +
                          stats.cancelledByDriverTrips) /
                          stats.totalTrips) *
                          100
                      )}%`
                    : "0%"}
                </span>
              </div>
            </div>
          </div>

          {/* Cancelled By Passenger */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Cancelled By Passenger
                </span>
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {stats.cancelledByPassengerTrips}
                </div>
              </div>
              <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-xs">
              <div className="text-red-500">
                <span className="font-medium">Cancellation Rate:</span>
                <span className="ml-1">
                  {stats.totalTrips > 0
                    ? `${Math.round(
                        ((stats.cancelledByPassengerTrips +
                          stats.cancelledByDriverTrips) /
                          stats.totalTrips) *
                          100
                      )}%`
                    : "0%"}
                </span>
              </div>
            </div>
          </div>

          {/* Cancelled By Driver */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Cancelled By Driver
                </span>
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {stats.cancelledByDriverTrips}
                </div>
              </div>
              <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-xs">
              <div className="text-red-500">
                <span className="font-medium">Cancellation Rate:</span>
                <span className="ml-1">
                  {stats.totalTrips > 0
                    ? `${Math.round(
                        ((stats.cancelledByPassengerTrips +
                          stats.cancelledByDriverTrips) /
                          stats.totalTrips) *
                          100
                      )}%`
                    : "0%"}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Search and Filter */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by location, booking ID, passenger name or phone"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center justify-center px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              <Filter className="h-5 w-5 mr-2 text-gray-600 dark:text-gray-300" />
              <span className="text-gray-700 dark:text-gray-300">
                Advanced Filters
              </span>
              {filterOpen ? (
                <ChevronUp className="h-5 w-5 ml-2 text-gray-600 dark:text-gray-300" />
              ) : (
                <ChevronDown className="h-5 w-5 ml-2 text-gray-600 dark:text-gray-300" />
              )}
            </button>
          </div>

          {/* Filter options */}
          <AnimatePresence>
            {filterOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Trip Status
                    </label>
                    <select
                      value={
                        filters.tripStatus === null ? "" : filters.tripStatus
                      }
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          tripStatus:
                            e.target.value === ""
                              ? null
                              : Number.parseInt(e.target.value),
                        })
                      }
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">All Statuses</option>
                      {Object.entries(tripStatusMap).map(
                        ([value, { label }]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Trip Type
                    </label>
                    <select
                      value={filters.tripType === null ? "" : filters.tripType}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          tripType:
                            e.target.value === ""
                              ? null
                              : Number.parseInt(e.target.value),
                        })
                      }
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">All Types</option>
                      {Object.entries(tripTypeMap).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Date Range
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="date"
                        value={filters.dateRange.start || ""}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            dateRange: {
                              ...filters.dateRange,
                              start: e.target.value,
                            },
                          })
                        }
                        className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                      <span className="text-gray-500">to</span>
                      <input
                        type="date"
                        value={filters.dateRange.end || ""}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            dateRange: {
                              ...filters.dateRange,
                              end: e.target.value,
                            },
                          })
                        }
                        className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Passenger ID
                    </label>
                    <input
                      type="text"
                      placeholder="Enter passenger ID"
                      value={filters.passengerId}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          passengerId: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Passenger Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter passenger name"
                      value={filters.passengerName}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          passengerName: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Passenger Phone
                    </label>
                    <input
                      type="text"
                      placeholder="Enter passenger phone"
                      value={filters.passengerPhone}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          passengerPhone: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-4">
                  <button
                    onClick={resetFilters}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    Reset Filters
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Trip List */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredTrips.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 text-center">
            <div className="flex justify-center mb-4">
              <AlertCircle className="h-16 w-16 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No trips found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {searchQuery ||
              Object.values(filters).some((val) => val !== null && val !== "")
                ? "Try adjusting your search or filters to see more results."
                : "There are no passenger trips in the system yet."}
            </p>
            {(searchQuery ||
              Object.values(filters).some(
                (val) => val !== null && val !== ""
              )) && (
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Booking ID
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Passenger
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Trip Details
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Price
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {paginatedTrips.map((trip) => {
                      const statusInfo =
                        tripStatusMap[trip.trip_status] || tripStatusMap[0];
                      const StatusIcon = statusInfo.icon;

                      return (
                        <tr
                          key={trip.bid}
                          className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors cursor-pointer"
                          onClick={() => toggleTripExpansion(trip.bid)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              #{trip.bid}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {formatDate(trip.pickup_date_time).split("•")[0]}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {trip.name || "N/A"}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {trip.phone_number || "N/A"}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 dark:text-white">
                              {tripTypeMap[
                                trip.trip_type == 1
                                  ? "One Way Trip "
                                  : trip.trip_type == 2
                                  ? "Round Trip"
                                  : ""
                              ] || "Trip"}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                              {trip.pickup_location} → {trip.drop_location}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}
                            >
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {statusInfo.label}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            {formatPrice(trip.price)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div
                              className="flex items-center justify-end space-x-2"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openTripDetails(trip);
                                }}
                                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                              >
                                <Eye className="h-5 w-5" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openStatusModal(trip);
                                }}
                                className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300"
                              >
                                <Edit className="h-5 w-5" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openDeleteModal(trip);
                                }}
                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Expanded trip details */}
              <AnimatePresence>
                {expandedTrip && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden border-t border-gray-200 dark:border-gray-700"
                  >
                    {paginatedTrips.map((trip) => {
                      if (trip.bid === expandedTrip) {
                        return (
                          <div
                            key={`expanded-${trip.bid}`}
                            className="p-4 bg-gray-50 dark:bg-gray-850"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <div className="space-y-3">
                                  <div className="flex items-start">
                                    <div className="h-6 w-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3 mt-1">
                                      <MapPin className="h-3 w-3 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div>
                                      <span className="text-sm text-gray-500 dark:text-gray-400">
                                        Pickup Location
                                      </span>
                                      <p className="text-gray-900 dark:text-white">
                                        {trip.pickup_location}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex items-start">
                                    <div className="h-6 w-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mr-3 mt-1">
                                      <MapPin className="h-3 w-3 text-red-600 dark:text-red-400" />
                                    </div>
                                    <div>
                                      <span className="text-sm text-gray-500 dark:text-gray-400">
                                        Drop Location
                                      </span>
                                      <p className="text-gray-900 dark:text-white">
                                        {trip.drop_location}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex items-start">
                                    <div className="h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3 mt-1">
                                      <Calendar className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                      <span className="text-sm text-gray-500 dark:text-gray-400">
                                        Pickup Date & Time
                                      </span>
                                      <p className="text-gray-900 dark:text-white">
                                        {formatDate(trip.pickup_date_time)}
                                      </p>
                                    </div>
                                  </div>

                                  {trip.trip_type === 1 && (
                                    <div className="flex items-start">
                                      <div className="h-6 w-6 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mr-3 mt-1">
                                        <Clock className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                                      </div>
                                      <div>
                                        <span className="text-sm text-gray-500 dark:text-gray-400">
                                          Return Date & Time
                                        </span>
                                        <p className="text-gray-900 dark:text-white">
                                          {formatDate(trip.drop_date_time)}
                                        </p>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div>
                                <div className="space-y-3">
                                  <div className="flex items-start">
                                    <div className="h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3 mt-1">
                                      <Car className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                      <span className="text-sm text-gray-500 dark:text-gray-400">
                                        Vehicle Type
                                      </span>
                                      <p className="text-gray-900 dark:text-white">
                                        {carTypeMap[trip.selected_car] ||
                                          "Vehicle"}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex items-start">
                                    <div className="h-6 w-6 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center mr-3 mt-1">
                                      <MapPin className="h-3 w-3 text-yellow-600 dark:text-yellow-400" />
                                    </div>
                                    <div>
                                      <span className="text-sm text-gray-500 dark:text-gray-400">
                                        Distance
                                      </span>
                                      <p className="text-gray-900 dark:text-white">
                                        {trip.distance} km
                                      </p>
                                    </div>
                                  </div>

                                  {trip.trip_type === 1 && (
                                    <div className="flex items-start">
                                      <div className="h-6 w-6 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mr-3 mt-1">
                                        <Calendar className="h-3 w-3 text-orange-600 dark:text-orange-400" />
                                      </div>
                                      <div>
                                        <span className="text-sm text-gray-500 dark:text-gray-400">
                                          Duration
                                        </span>
                                        <p className="text-gray-900 dark:text-white">
                                          {trip.no_of_days}{" "}
                                          {trip.no_of_days === 1
                                            ? "day"
                                            : "days"}
                                        </p>
                                      </div>
                                    </div>
                                  )}

                                  <div className="flex items-start">
                                    <div className="h-6 w-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3 mt-1">
                                      <User className="h-3 w-3 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div>
                                      <span className="text-sm text-gray-500 dark:text-gray-400">
                                        Passenger ID
                                      </span>
                                      <p className="text-gray-900 dark:text-white">
                                        {trip.pid || "N/A"}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-wrap justify-end gap-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                              <button
                                onClick={() => openStatusModal(trip)}
                                className="flex items-center px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 hover:bg-yellow-200 dark:hover:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300 rounded-lg transition-colors"
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                <span>Update Status</span>
                              </button>

                              <button
                                onClick={() => openTripDetails(trip)}
                                className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                              >
                                <span>View Full Details</span>
                                <ArrowRight className="h-4 w-4 ml-2" />
                              </button>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700 dark:text-gray-400">
                        Showing{" "}
                        <span className="font-medium">
                          {(currentPage - 1) * tripsPerPage + 1}
                        </span>{" "}
                        to{" "}
                        <span className="font-medium">
                          {Math.min(
                            currentPage * tripsPerPage,
                            filteredTrips.length
                          )}
                        </span>{" "}
                        of{" "}
                        <span className="font-medium">
                          {filteredTrips.length}
                        </span>{" "}
                        results
                      </p>
                    </div>
                    <div>
                      <nav
                        className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                        aria-label="Pagination"
                      >
                        <button
                          onClick={() =>
                            setCurrentPage(Math.max(1, currentPage - 1))
                          }
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                        >
                          <span className="sr-only">Previous</span>
                          <ChevronLeft className="h-5 w-5" />
                        </button>

                        {[...Array(totalPages)].map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`relative inline-flex items-center px-4 py-2 border ${
                              currentPage === i + 1
                                ? "z-10 bg-blue-50 dark:bg-blue-900/30 border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-400"
                                : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                            } text-sm font-medium`}
                          >
                            {i + 1}
                          </button>
                        ))}

                        <button
                          onClick={() =>
                            setCurrentPage(
                              Math.min(totalPages, currentPage + 1)
                            )
                          }
                          disabled={currentPage === totalPages}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                        >
                          <span className="sr-only">Next</span>
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* Trip Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedTrip && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Trip Details
                </h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Booking ID:
                      </span>
                      <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white">
                        #{selectedTrip.bid}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      {tripTypeMap[selectedTrip.trip_type] || "Trip"}
                    </h2>
                  </div>

                  <div
                    className={`px-3 py-1 rounded-full ${
                      tripStatusMap[selectedTrip.trip_status]?.color
                    }`}
                  >
                    <span className="text-sm font-medium">
                      {tripStatusMap[selectedTrip.trip_status]?.label ||
                        "Pending"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Trip Information
                    </h4>

                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3 mt-1">
                          <MapPin className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Pickup Location
                          </span>
                          <p className="text-gray-900 dark:text-white">
                            {selectedTrip.pickup_location}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="h-8 w-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mr-3 mt-1">
                          <MapPin className="h-4 w-4 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Drop Location
                          </span>
                          <p className="text-gray-900 dark:text-white">
                            {selectedTrip.drop_location}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3 mt-1">
                          <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Pickup Date & Time
                          </span>
                          <p className="text-gray-900 dark:text-white">
                            {formatDate(selectedTrip.pickup_date_time)}
                          </p>
                        </div>
                      </div>

                      {selectedTrip.trip_type === 1 && (
                        <>
                          <div className="flex items-start">
                            <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mr-3 mt-1">
                              <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                Return Date & Time
                              </span>
                              <p className="text-gray-900 dark:text-white">
                                {formatDate(selectedTrip.drop_date_time)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start">
                            <div className="h-8 w-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mr-3 mt-1">
                              <Clock className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                            </div>
                            <div>
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                Duration
                              </span>
                              <p className="text-gray-900 dark:text-white">
                                {selectedTrip.no_of_days}{" "}
                                {selectedTrip.no_of_days === 1 ? "day" : "days"}
                              </p>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Passenger Details
                    </h4>

                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3 mt-1">
                          <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Passenger ID
                          </span>
                          <p className="text-gray-900 dark:text-white">
                            {selectedTrip.pid || "N/A"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3 mt-1">
                          <User className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Passenger Name
                          </span>
                          <p className="text-gray-900 dark:text-white">
                            {selectedTrip.name || "Not specified"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mr-3 mt-1">
                          <Phone className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Passenger Phone
                          </span>
                          <p className="text-gray-900 dark:text-white">
                            {selectedTrip.phone_number || "Not specified"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="h-8 w-8 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center mr-3 mt-1">
                          <Car className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Vehicle Type
                          </span>
                          <p className="text-gray-900 dark:text-white">
                            {carTypeMap[selectedTrip.selected_car] || "Vehicle"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Payment Summary
                  </h4>

                  <div className="space-y-2">
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                      <div className="flex justify-between font-bold">
                        <span className="text-gray-900 dark:text-white">
                          Total Amount
                        </span>
                        <span className="text-gray-900 dark:text-white">
                          {formatPrice(selectedTrip.price)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Additional Information
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start">
                      <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3 mt-1">
                        <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Distance
                        </span>
                        <p className="text-gray-900 dark:text-white">
                          {selectedTrip.distance} km
                        </p>
                      </div>
                    </div>

                    {selectedTrip.ride_otp && (
                      <div className="flex items-start">
                        <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3 mt-1">
                          <Key className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Ride OTP
                          </span>
                          <p className="text-gray-900 dark:text-white">
                            {selectedTrip.ride_otp}
                          </p>
                        </div>
                      </div>
                    )}

                    {selectedTrip.payment_otp && (
                      <div className="flex items-start">
                        <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mr-3 mt-1">
                          <CreditCard className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Payment OTP
                          </span>
                          <p className="text-gray-900 dark:text-white">
                            {selectedTrip.payment_otp}
                          </p>
                        </div>
                      </div>
                    )}

                    {selectedTrip.vid && (
                      <div className="flex items-start">
                        <div className="h-8 w-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mr-3 mt-1">
                          <Building className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Vendor ID
                          </span>
                          <p className="text-gray-900 dark:text-white">
                            {selectedTrip.vid}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end p-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    openStatusModal(selectedTrip);
                  }}
                  className="flex items-center px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 hover:bg-yellow-200 dark:hover:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300 rounded-lg transition-colors mr-3"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  <span>Update Status</span>
                </button>

                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && selectedTrip && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                    <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center mb-2">
                  Delete Trip
                </h3>

                <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
                  Are you sure you want to delete trip #{selectedTrip.bid}? This
                  action cannot be undone.
                </p>

                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={deleteTrip}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status Update Modal */}
      <AnimatePresence>
        {showStatusModal && selectedTrip && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Edit className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center mb-2">
                  Update Trip Status
                </h3>

                <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
                  Change the status for trip #{selectedTrip.bid}
                </p>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) =>
                      setNewStatus(Number.parseInt(e.target.value))
                    }
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    {Object.entries(tripStatusMap).map(([value, { label }]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => setShowStatusModal(false)}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={updateTripStatus}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Update
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

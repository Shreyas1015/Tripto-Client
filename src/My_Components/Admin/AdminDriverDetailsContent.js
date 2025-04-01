"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import axiosInstance from "../../API/axiosInstance";
import secureLocalStorage from "react-secure-storage";
import {
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  X,
  FileText,
  RefreshCw,
  User,
  Phone,
  Mail,
  Car,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Edit,
  Trash2,
  FileCheck,
  UserCheck,
  UserX,
  ArrowUpDown,
  Star,
  MapPin,
  Activity,
  Info,
  ArrowRight,
} from "lucide-react";
import toast from "react-hot-toast";

// Driver status mapping
const driverStatusMap = {
  0: { label: "Active", icon: UserCheck, color: "text-green-500 bg-green-100" },
  1: { label: "Inactive", icon: UserX, color: " text-red-500 bg-red-100" },
  2: {
    label: "Suspended",
    icon: AlertCircle,
    color: "text-orange-500 bg-orange-100",
  },
};

// Document verification status mapping
const verificationStatusMap = {
  0: { label: "Pending", icon: Clock, color: "text-yellow-500 bg-yellow-100" },
  1: {
    label: "Verified",
    icon: CheckCircle,
    color: "text-green-500 bg-green-100",
  },
  2: { label: "Rejected", icon: XCircle, color: "text-red-500 bg-red-100" },
};

export default function AdminDriverDashboard() {
  const navigate = useNavigate();
  const uid = localStorage.getItem("@secure.n.uid");
  const decryptedUID = secureLocalStorage.getItem("uid");

  const [drivers, setDrivers] = useState([]);
  const [filteredDrivers, setFilteredDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedDriver, setExpandedDriver] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [driversPerPage] = useState(10);
  const [newStatus, setNewStatus] = useState(1);
  const [sortConfig, setSortConfig] = useState({
    key: "did",
    direction: "desc",
  });
  const [filters, setFilters] = useState({
    driverStatus: null,
    verificationStatus: null,
    dateRange: {
      start: null,
      end: null,
    },
  });
  const [stats, setStats] = useState({
    totalDrivers: 0,
    activeDrivers: 0,
    inactiveDrivers: 0,
    pendingVerification: 0,
    fullyVerified: 0,
    suspendedDrivers: 0,
    rejectedDocuments: 0,
    topRatedDrivers: 0,
  });

  // Fetch all drivers
  useEffect(() => {
    const fetchAllDrivers = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.post(
          `${process.env.REACT_APP_BASE_URL}/admin/getAllDrivers`,
          {
            decryptedUID,
          }
        );

        if (response.data && Array.isArray(response.data)) {
          console.log("Fetched drivers:", response.data);
          setDrivers(response.data);
          setFilteredDrivers(response.data);
          calculateStats(response.data);
          setTotalPages(Math.ceil(response.data.length / driversPerPage));
        }
      } catch (error) {
        console.error("Error fetching drivers:", error);
        toast.error("Failed to load drivers. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (decryptedUID) {
      fetchAllDrivers();
    }
  }, [decryptedUID, driversPerPage]);

  const calculateStats = (driverData) => {
    const stats = driverData.reduce(
      (acc, driver) => {
        acc.totalDrivers += 1;

        // Driver status stats (based on user_status)
        if (driver.user_status === 0) {
          acc.activeDrivers += 1;
        } else if (driver.user_status === 1) {
          acc.inactiveDrivers += 1;
        } else if (driver.user_status === 2) {
          acc.suspendedDrivers += 1;
        }

        // Document verification stats
        if (driver.all_documents_status === 1) {
          acc.fullyVerified += 1;
        } else if (driver.all_documents_status === 0) {
          acc.pendingVerification += 1;
        } else if (driver.all_documents_status === 2) {
          acc.rejectedDocuments += 1;
        }

        // Top-rated drivers (assuming rating exists and is numerical)
        if (driver.rating && driver.rating >= 4.5) {
          acc.topRatedDrivers += 1;
        }

        return acc;
      },
      {
        totalDrivers: 0,
        activeDrivers: 0,
        inactiveDrivers: 0,
        suspendedDrivers: 0, // Added for clarity
        pendingVerification: 0,
        fullyVerified: 0,
        rejectedDocuments: 0,
        topRatedDrivers: 0,
      }
    );

    setStats(stats);
  };

  // Handle search and filtering
  useEffect(() => {
    let results = [...drivers];

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        (driver) =>
          driver.did?.toString().includes(query) || // ID
          driver.driver_name?.toLowerCase().includes(query) || // Corrected name field
          driver.phone_number?.includes(query) // Corrected phone field
      );
    }

    // Apply filters
    if (filters.driverStatus != null) {
      // Handles both null & undefined
      results = results.filter(
        (driver) => driver.user_status === filters.driverStatus
      );
    }

    if (filters.verificationStatus != null) {
      results = results.filter(
        (driver) => driver.all_documents_status === filters.verificationStatus
      );
    }

    if (filters.dateRange.start && filters.dateRange.end) {
      const startDate = new Date(filters.dateRange.start);
      const endDate = new Date(filters.dateRange.end);
      endDate.setHours(23, 59, 59, 999); // Include the full end day

      results = results.filter((driver) => {
        const driverDate = driver.reason_updated_at
          ? new Date(driver.reason_updated_at)
          : new Date(driver.created_at); // Fallback to created_at
        return driverDate >= startDate && driverDate <= endDate;
      });
    }

    // Apply sorting if sortConfig.key exists
    if (sortConfig.key) {
      results.sort((a, b) => {
        const valueA = a[sortConfig.key];
        const valueB = b[sortConfig.key];

        if (valueA < valueB) return sortConfig.direction === "asc" ? -1 : 1;
        if (valueA > valueB) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    setFilteredDrivers(results);
    setTotalPages(Math.ceil(results.length / driversPerPage));
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchQuery, filters, drivers, driversPerPage, sortConfig]);

  // Reset filters
  const resetFilters = () => {
    setFilters({
      driverStatus: null,
      verificationStatus: null,
      dateRange: {
        start: null,
        end: null,
      },
    });
    setSearchQuery("");
    setFilterOpen(false);
  };

  // Toggle driver details expansion
  const toggleDriverExpansion = (driverId) => {
    setExpandedDriver(expandedDriver === driverId ? null : driverId);
  };

  // Open driver details modal
  const openDriverDetails = (driver) => {
    setSelectedDriver(driver);
    setShowDetailModal(true);
  };

  // Open status update modal
  const openStatusModal = (driver) => {
    setSelectedDriver(driver);
    setNewStatus(driver.user_status);
    setShowStatusModal(true);
  };

  // Open delete confirmation modal
  const openDeleteModal = (driver) => {
    setSelectedDriver(driver);
    setShowDeleteModal(true);
  };

  // Update driver status
  const updateDriverStatus = async () => {
    try {
      await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/admin/updateDriverStatus`,
        {
          decryptedUID,
          did: selectedDriver.did,
          user_status: newStatus,
        }
      );

      toast.success(
        `Driver #${selectedDriver.did} status updated to ${driverStatusMap[newStatus].label}`
      );

      // Update drivers list
      const updatedDrivers = drivers.map((driver) => {
        if (driver.did === selectedDriver.did) {
          return { ...driver, user_status: newStatus };
        }
        return driver;
      });

      setDrivers(updatedDrivers);
      setFilteredDrivers(updatedDrivers);
      calculateStats(updatedDrivers);

      setShowStatusModal(false);
    } catch (error) {
      console.error("Error updating driver status:", error);
      toast.error("Failed to update driver status. Please try again.");
    }
  };

  // Delete driver
  const deleteDriver = async () => {
    try {
      await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/admin/deleteDriver`,
        {
          decryptedUID,
          did: selectedDriver.did,
          driver_uid: selectedDriver.uid,
        }
      );

      toast.success(`Driver #${selectedDriver.did} has been deleted`);

      // Update drivers list
      const updatedDrivers = drivers.filter(
        (driver) => driver.did !== selectedDriver.did
      );
      setDrivers(updatedDrivers);
      setFilteredDrivers(updatedDrivers);
      calculateStats(updatedDrivers);

      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting driver:", error);
      toast.error("Failed to delete driver. Please try again.");
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

  // Navigate to document verification page
  const goToDocumentVerification = (driver) => {
    navigate(`/admin-driver-verification?uid=${uid}`);
  };

  // Navigate back to admin dashboard
  const goToDashboard = () => {
    navigate(`/admindashboard?uid=${uid}`);
  };

  // Refresh data
  const refreshData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/admin/getAllDrivers`,
        {
          decryptedUID,
        }
      );

      if (response.data && Array.isArray(response.data)) {
        setDrivers(response.data);
        setFilteredDrivers(response.data);
        calculateStats(response.data);
        setTotalPages(Math.ceil(response.data.length / driversPerPage));
        toast.success("Data refreshed successfully");
      }
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast.error("Failed to refresh data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Export driver data to CSV
  const exportToCSV = () => {
    const headers = [
      "Driver ID",
      "User ID",
      "Name",
      "Phone",
      "Email",
      "Status",
      "Document Status",
      "Registration Date",
      "Last Updated",
    ];

    const csvData = filteredDrivers.map((driver) => [
      driver.did,
      driver.uid,
      driver.driver_name || "N/A",
      driver.phone_number || "N/A",
      driver.email || "N/A",
      driverStatusMap[driver.user_status]?.label || "Unknown",
      driver.all_documents_status === 1
        ? "Verified"
        : driver.all_documents_status === 0
        ? "Pending"
        : "Rejected",
      formatDate(driver.created_at),
      formatDate(driver.reason_updated_at),
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
      `drivers-data-${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Driver data exported successfully");
  };

  // Handle sorting
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Pagination
  const paginatedDrivers = filteredDrivers.slice(
    (currentPage - 1) * driversPerPage,
    currentPage * driversPerPage
  );

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
                <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Driver Management
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {/* Total Drivers */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Total Drivers
                </span>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats?.totalDrivers ?? 0} {/* Safe access */}
                </div>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-xs">
              <div className="flex items-center text-green-500">
                <span className="font-medium">Active:</span>
                <span className="ml-1">{stats?.activeDrivers ?? 0}</span>
              </div>
              <div className="flex items-center text-red-500 ml-4">
                <span className="font-medium">Inactive:</span>
                <span className="ml-1">{stats?.inactiveDrivers ?? 0}</span>
              </div>
            </div>
          </div>

          {/* Document Verification */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Document Verification
                </span>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats?.fullyVerified ?? 0}
                </div>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <FileCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-1 text-xs">
              <div className="text-yellow-500">
                <span className="font-medium">Pending:</span>{" "}
                {stats?.pendingVerification ?? 0}
              </div>
              <div className="text-red-500">
                <span className="font-medium">Rejected:</span>{" "}
                {stats?.rejectedDocuments ?? 0}
              </div>
            </div>
          </div>

          {/* Top Rated Drivers */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Top Rated
                </span>
                <div className="text-2xl font-bold text-amber-500 dark:text-amber-400">
                  {stats?.topRatedDrivers ?? 0}
                </div>
              </div>
              <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Star className="h-6 w-6 text-amber-500 dark:text-amber-400" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-xs">
              <div className="text-amber-500">
                <span className="font-medium">Drivers with 4.5+ rating</span>
              </div>
            </div>
          </div>

          {/* Verification Rate */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Verification Rate
                </span>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {stats?.totalDrivers > 0 && stats?.fullyVerified != null
                    ? `${Math.round(
                        (stats.fullyVerified / stats.totalDrivers) * 100
                      )}%`
                    : "0%"}
                </div>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Activity className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-xs">
              <div className="text-blue-500">
                <span className="font-medium">Fully verified drivers</span>
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
                placeholder="Search by ID, name, phone or email"
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
              <span className="text-gray-700 dark:text-gray-300">Filters</span>
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
                      Driver Status
                    </label>
                    <select
                      value={
                        filters.driverStatus === null
                          ? ""
                          : filters.driverStatus
                      }
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          driverStatus:
                            e.target.value === ""
                              ? null
                              : Number.parseInt(e.target.value),
                        })
                      }
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">All Statuses</option>
                      {Object.entries(driverStatusMap).map(
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
                      Verification Status
                    </label>
                    <select
                      value={
                        filters.verificationStatus === null
                          ? ""
                          : filters.verificationStatus
                      }
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          verificationStatus:
                            e.target.value === ""
                              ? null
                              : Number.parseInt(e.target.value),
                        })
                      }
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">All Verification Statuses</option>
                      {Object.entries(verificationStatusMap).map(
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
                      Registration Date Range
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

        {/* Driver List */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredDrivers.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 text-center">
            <div className="flex justify-center mb-4">
              <AlertCircle className="h-16 w-16 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No drivers found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {searchQuery ||
              Object.values(filters).some((val) => val !== null && val !== "")
                ? "Try adjusting your search or filters to see more results."
                : "There are no drivers in the system yet."}
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
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                        onClick={() => requestSort("did")}
                      >
                        <div className="flex items-center">
                          Driver ID
                          <ArrowUpDown className="ml-1 h-4 w-4" />
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                        onClick={() => requestSort("name")}
                      >
                        <div className="flex items-center">
                          Driver
                          <ArrowUpDown className="ml-1 h-4 w-4" />
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Contact
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
                        Documents
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
                    {paginatedDrivers.map((driver) => {
                      const driverStatusInfo =
                        driverStatusMap[driver.user_status] ||
                        driverStatusMap[0];
                      const verificationStatusInfo =
                        verificationStatusMap[driver.all_documents_status] ||
                        verificationStatusMap[0];
                      const StatusIcon = driverStatusInfo.icon;
                      const VerificationIcon = verificationStatusInfo.icon;

                      return (
                        <tr
                          key={driver.did}
                          className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors cursor-pointer"
                          onClick={() => toggleDriverExpansion(driver.did)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              #{driver.did}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              UID: {driver.uid}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                                {driver.profile_img ? (
                                  <img
                                    src={
                                      driver.profile_img || "/placeholder.svg"
                                    }
                                    alt={driver.driver_name || "Driver"}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {driver.driver_name || "N/A"}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  Joined:{" "}
                                  {formatDate(driver.created_at).split("•")[0]}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 dark:text-white flex items-center">
                              <Phone className="h-4 w-4 mr-1 text-gray-500" />
                              {driver.phone_number || "N/A"}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                              <Mail className="h-4 w-4 mr-1 text-gray-500" />
                              {driver.email || "N/A"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${driverStatusInfo.color}`}
                            >
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {driverStatusInfo.label}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${verificationStatusInfo.color}`}
                            >
                              <VerificationIcon className="h-3 w-3 mr-1" />
                              {verificationStatusInfo.label}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div
                              className="flex items-center justify-end space-x-2"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openDriverDetails(driver);
                                }}
                                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                title="View Details"
                              >
                                <Eye className="h-5 w-5" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  goToDocumentVerification(driver);
                                }}
                                className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                                title="Verify Documents"
                              >
                                <FileCheck className="h-5 w-5" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openStatusModal(driver);
                                }}
                                className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300"
                                title="Update Status"
                              >
                                <Edit className="h-5 w-5" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openDeleteModal(driver);
                                }}
                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                title="Delete Driver"
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

              {/* Expanded driver details */}
              <AnimatePresence>
                {expandedDriver && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden border-t border-gray-200 dark:border-gray-700"
                  >
                    {paginatedDrivers.map((driver) => {
                      if (driver.did === expandedDriver) {
                        return (
                          <div
                            key={`expanded-${driver.did}`}
                            className="p-4 bg-gray-50 dark:bg-gray-850"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                                  Driver Information
                                </h3>
                                <div className="space-y-3">
                                  <div className="flex items-start">
                                    <div className="h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3 mt-1">
                                      <User className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                      <span className="text-sm text-gray-500 dark:text-gray-400">
                                        Full Name
                                      </span>
                                      <p className="text-gray-900 dark:text-white">
                                        {driver.driver_name || "Not specified"}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex items-start">
                                    <div className="h-6 w-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3 mt-1">
                                      <Phone className="h-3 w-3 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div>
                                      <span className="text-sm text-gray-500 dark:text-gray-400">
                                        Phone Number
                                      </span>
                                      <p className="text-gray-900 dark:text-white">
                                        {driver.phone_number || "Not specified"}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex items-start">
                                    <div className="h-6 w-6 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mr-3 mt-1">
                                      <Mail className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <div>
                                      <span className="text-sm text-gray-500 dark:text-gray-400">
                                        Email Address
                                      </span>
                                      <p className="text-gray-900 dark:text-white">
                                        {driver.email || "Not specified"}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex items-start">
                                    <div className="h-6 w-6 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center mr-3 mt-1">
                                      <Calendar className="h-3 w-3 text-yellow-600 dark:text-yellow-400" />
                                    </div>
                                    <div>
                                      <span className="text-sm text-gray-500 dark:text-gray-400">
                                        Registration Date
                                      </span>
                                      <p className="text-gray-900 dark:text-white">
                                        {formatDate(driver.created_at)}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                                  Document Status
                                </h3>
                                <div className="space-y-3">
                                  <div className="flex items-start">
                                    <div className="h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3 mt-1">
                                      <FileCheck className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                      <span className="text-sm text-gray-500 dark:text-gray-400">
                                        Overall Status
                                      </span>
                                      <p
                                        className={`font-medium ${verificationStatusMap[
                                          driver.all_documents_status
                                        ]?.color.replace("bg-", "text-")}`}
                                      >
                                        {verificationStatusMap[
                                          driver.all_documents_status
                                        ]?.label || "Unknown"}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-2 gap-3">
                                    <div className="flex items-start">
                                      <div className="h-5 w-5 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-2 mt-0.5">
                                        <FileText className="h-2.5 w-2.5 text-gray-600 dark:text-gray-400" />
                                      </div>
                                      <div>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                          Aadhar Card
                                        </span>
                                        <p
                                          className={`text-sm font-medium ${verificationStatusMap[
                                            driver.aadharFrontStatus
                                          ]?.color.replace("bg-", "text-")}`}
                                        >
                                          {verificationStatusMap[
                                            driver.aadharFrontStatus
                                          ]?.label || "Unknown"}
                                        </p>
                                      </div>
                                    </div>

                                    <div className="flex items-start">
                                      <div className="h-5 w-5 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-2 mt-0.5">
                                        <FileText className="h-2.5 w-2.5 text-gray-600 dark:text-gray-400" />
                                      </div>
                                      <div>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                          PAN Card
                                        </span>
                                        <p
                                          className={`text-sm font-medium ${verificationStatusMap[
                                            driver.panCardFrontStatus
                                          ]?.color.replace("bg-", "text-")}`}
                                        >
                                          {verificationStatusMap[
                                            driver.panCardFrontStatus
                                          ]?.label || "Unknown"}
                                        </p>
                                      </div>
                                    </div>

                                    <div className="flex items-start">
                                      <div className="h-5 w-5 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-2 mt-0.5">
                                        <FileText className="h-2.5 w-2.5 text-gray-600 dark:text-gray-400" />
                                      </div>
                                      <div>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                          Driving License
                                        </span>
                                        <p
                                          className={`text-sm font-medium ${verificationStatusMap[
                                            driver.drivingLicenseFrontStatus
                                          ]?.color.replace("bg-", "text-")}`}
                                        >
                                          {verificationStatusMap[
                                            driver.drivingLicenseFrontStatus
                                          ]?.label || "Unknown"}
                                        </p>
                                      </div>
                                    </div>

                                    <div className="flex items-start">
                                      <div className="h-5 w-5 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-2 mt-0.5">
                                        <FileText className="h-2.5 w-2.5 text-gray-600 dark:text-gray-400" />
                                      </div>
                                      <div>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                          Vehicle RC
                                        </span>
                                        <p
                                          className={`text-sm font-medium ${verificationStatusMap[
                                            driver.rcStatus
                                          ]?.color.replace("bg-", "text-")}`}
                                        >
                                          {verificationStatusMap[
                                            driver.rcStatus
                                          ]?.label || "Unknown"}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-wrap justify-end gap-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                              <button
                                onClick={() => goToDocumentVerification(driver)}
                                className="flex items-center px-4 py-2 bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/50 text-green-800 dark:text-green-300 rounded-lg transition-colors"
                              >
                                <FileCheck className="h-4 w-4 mr-2" />
                                <span>Verify Documents</span>
                              </button>

                              <button
                                onClick={() => openStatusModal(driver)}
                                className="flex items-center px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 hover:bg-yellow-200 dark:hover:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300 rounded-lg transition-colors"
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                <span>Update Status</span>
                              </button>

                              <button
                                onClick={() => openDriverDetails(driver)}
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
                          {(currentPage - 1) * driversPerPage + 1}
                        </span>{" "}
                        to{" "}
                        <span className="font-medium">
                          {Math.min(
                            currentPage * driversPerPage,
                            filteredDrivers.length
                          )}
                        </span>{" "}
                        of{" "}
                        <span className="font-medium">
                          {filteredDrivers.length}
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

      {/* Driver Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedDriver && (
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
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[97vh] overflow-hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Driver Details
                </h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                <div className="flex flex-col md:flex-row items-start gap-6 mb-6">
                  <div className="w-full md:w-1/3 flex flex-col items-center">
                    <div className="h-32 w-32 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden mb-4">
                      {selectedDriver.profile_img || selectedDriver.selfie ? (
                        <img
                          src={
                            selectedDriver.profile_img || selectedDriver.selfie
                          }
                          alt={selectedDriver.driver_name || "Driver"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <User className="h-16 w-16 text-gray-500 dark:text-gray-400" />
                      )}
                    </div>

                    <h2 className="text-xl font-bold text-gray-900 dark:text-white text-center">
                      {selectedDriver.driver_name || "Driver"}
                    </h2>

                    <div className="mt-2 flex items-center">
                      <div
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          driverStatusMap[selectedDriver.user_status]?.color
                        }`}
                      >
                        {/* <StatusIcon className="h-3 w-3 mr-1" /> */}
                        {driverStatusMap[selectedDriver.user_status]?.label ||
                          "Unknown"}
                      </div>
                    </div>

                    <div className="mt-4 w-full">
                      <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Driver ID
                          </span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            #{selectedDriver.did}
                          </span>
                        </div>

                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            User ID
                          </span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            #{selectedDriver.uid}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Joined
                          </span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {
                              formatDate(selectedDriver.created_at).split(
                                "•"
                              )[0]
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="w-full md:w-2/3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                          Contact Information
                        </h3>

                        <div className="space-y-4">
                          <div className="flex items-start">
                            <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3 mt-1">
                              <Phone className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                Phone Number
                              </span>
                              <p className="text-gray-900 dark:text-white">
                                {selectedDriver.phone_number || "Not specified"}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start">
                            <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3 mt-1">
                              <Mail className="h-4 w-4 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                Email Address
                              </span>
                              <p className="text-gray-900 dark:text-white">
                                {selectedDriver.email || "Not specified"}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start">
                            <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mr-3 mt-1">
                              <MapPin className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                Address
                              </span>
                              <p className="text-gray-900 dark:text-white">
                                {selectedDriver.address || "Not specified"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                          Document Verification
                        </h3>

                        <div className="space-y-4">
                          <div className="flex items-start">
                            <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3 mt-1">
                              <FileCheck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                Overall Status
                              </span>
                              <p
                                className={`font-medium ${verificationStatusMap[
                                  selectedDriver.all_documents_status
                                ]?.color.replace("bg-", "text-")}`}
                              >
                                {verificationStatusMap[
                                  selectedDriver.all_documents_status
                                ]?.label || "Unknown"}
                              </p>
                            </div>
                          </div>

                          <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-3">
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Document Status
                            </h4>

                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div className="flex justify-between">
                                <span className="text-gray-500 dark:text-gray-400">
                                  Aadhar Card
                                </span>
                                <span
                                  className={verificationStatusMap[
                                    selectedDriver.aadharFrontStatus
                                  ]?.color.replace("bg-", "text-")}
                                >
                                  {
                                    verificationStatusMap[
                                      selectedDriver.aadharFrontStatus
                                    ]?.label
                                  }
                                </span>
                              </div>

                              <div className="flex justify-between">
                                <span className="text-gray-500 dark:text-gray-400">
                                  PAN Card
                                </span>
                                <span
                                  className={verificationStatusMap[
                                    selectedDriver.panCardFrontStatus
                                  ]?.color.replace("bg-", "text-")}
                                >
                                  {
                                    verificationStatusMap[
                                      selectedDriver.panCardFrontStatus
                                    ]?.label
                                  }
                                </span>
                              </div>

                              <div className="flex justify-between">
                                <span className="text-gray-500 dark:text-gray-400">
                                  Driving License
                                </span>
                                <span
                                  className={verificationStatusMap[
                                    selectedDriver.drivingLicenseFrontStatus
                                  ]?.color.replace("bg-", "text-")}
                                >
                                  {
                                    verificationStatusMap[
                                      selectedDriver.drivingLicenseFrontStatus
                                    ]?.label
                                  }
                                </span>
                              </div>

                              <div className="flex justify-between">
                                <span className="text-gray-500 dark:text-gray-400">
                                  Vehicle RC
                                </span>
                                <span
                                  className={verificationStatusMap[
                                    selectedDriver.rcStatus
                                  ]?.color.replace("bg-", "text-")}
                                >
                                  {
                                    verificationStatusMap[
                                      selectedDriver.rcStatus
                                    ]?.label
                                  }
                                </span>
                              </div>

                              <div className="flex justify-between">
                                <span className="text-gray-500 dark:text-gray-400">
                                  Insurance
                                </span>
                                <span
                                  className={verificationStatusMap[
                                    selectedDriver.insuranceStatus
                                  ]?.color.replace("bg-", "text-")}
                                >
                                  {
                                    verificationStatusMap[
                                      selectedDriver.insuranceStatus
                                    ]?.label
                                  }
                                </span>
                              </div>

                              <div className="flex justify-between">
                                <span className="text-gray-500 dark:text-gray-400">
                                  Permit
                                </span>
                                <span
                                  className={verificationStatusMap[
                                    selectedDriver.permitStatus
                                  ]?.color.replace("bg-", "text-")}
                                >
                                  {
                                    verificationStatusMap[
                                      selectedDriver.permitStatus
                                    ]?.label
                                  }
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Vehicle Information
                      </h3>

                      <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-start">
                            <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3 mt-1">
                              <Car className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                Vehicle Type
                              </span>
                              <p className="text-gray-900 dark:text-white">
                                {selectedDriver.car_type == 1
                                  ? "SEDAN (4 + 1)"
                                  : selectedDriver.car_type == 2
                                  ? "SUV , MUV (6 + 1)"
                                  : "" || "Not specified"}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start">
                            <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3 mt-1">
                              <Info className="h-4 w-4 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                Vehicle Model
                              </span>
                              <p className="text-gray-900 dark:text-white">
                                {selectedDriver.car_name || "Not specified"}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start">
                            <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mr-3 mt-1">
                              <FileText className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                Registration Number
                              </span>
                              <p className="text-gray-900 dark:text-white">
                                {selectedDriver.car_number || "Not specified"}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start">
                            <div className="h-8 w-8 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center mr-3 mt-1">
                              <Calendar className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                            </div>
                            <div>
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                Registration Year
                              </span>
                              <p className="text-gray-900 dark:text-white">
                                {selectedDriver.model_year || "Not specified"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Document Rejection History
                  </h3>

                  <div className="space-y-4">
                    {selectedDriver.aadharFrontRejectReason && (
                      <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-lg p-3">
                        <div className="flex items-start">
                          <div className="h-6 w-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mr-3 mt-1">
                            <XCircle className="h-3 w-3 text-red-600 dark:text-red-400" />
                          </div>
                          <div>
                            <span className="text-sm font-medium text-red-800 dark:text-red-300">
                              Aadhar Card (Front) Rejected
                            </span>
                            <p className="text-sm text-red-700 dark:text-red-400">
                              {selectedDriver.aadharFrontRejectReason}
                            </p>
                            <p className="text-xs text-red-600 dark:text-red-500 mt-1">
                              {formatDate(
                                selectedDriver.aadharFrontReason_updated_at
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedDriver.aadharBackRejectReason && (
                      <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-lg p-3">
                        <div className="flex items-start">
                          <div className="h-6 w-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mr-3 mt-1">
                            <XCircle className="h-3 w-3 text-red-600 dark:text-red-400" />
                          </div>
                          <div>
                            <span className="text-sm font-medium text-red-800 dark:text-red-300">
                              Aadhar Card (Back) Rejected
                            </span>
                            <p className="text-sm text-red-700 dark:text-red-400">
                              {selectedDriver.aadharBackRejectReason}
                            </p>
                            <p className="text-xs text-red-600 dark:text-red-500 mt-1">
                              {formatDate(
                                selectedDriver.aadharBackReason_updated_at
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedDriver.panCardFrontRejectReason && (
                      <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-lg p-3">
                        <div className="flex items-start">
                          <div className="h-6 w-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mr-3 mt-1">
                            <XCircle className="h-3 w-3 text-red-600 dark:text-red-400" />
                          </div>
                          <div>
                            <span className="text-sm font-medium text-red-800 dark:text-red-300">
                              PAN Card Rejected
                            </span>
                            <p className="text-sm text-red-700 dark:text-red-400">
                              {selectedDriver.panCardFrontRejectReason}
                            </p>
                            <p className="text-xs text-red-600 dark:text-red-500 mt-1">
                              {formatDate(
                                selectedDriver.panCardFrontReason_updated_at
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedDriver.selfieRejectReason && (
                      <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-lg p-3">
                        <div className="flex items-start">
                          <div className="h-6 w-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mr-3 mt-1">
                            <XCircle className="h-3 w-3 text-red-600 dark:text-red-400" />
                          </div>
                          <div>
                            <span className="text-sm font-medium text-red-800 dark:text-red-300">
                              Selfie Rejected
                            </span>
                            <p className="text-sm text-red-700 dark:text-red-400">
                              {selectedDriver.selfieRejectReason}
                            </p>
                            <p className="text-xs text-red-600 dark:text-red-500 mt-1">
                              {formatDate(
                                selectedDriver.selfieReason_updated_at
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedDriver.passbookOrChequeRejectReason && (
                      <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-lg p-3">
                        <div className="flex items-start">
                          <div className="h-6 w-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mr-3 mt-1">
                            <XCircle className="h-3 w-3 text-red-600 dark:text-red-400" />
                          </div>
                          <div>
                            <span className="text-sm font-medium text-red-800 dark:text-red-300">
                              Passbook / Cheque Rejected
                            </span>
                            <p className="text-sm text-red-700 dark:text-red-400">
                              {selectedDriver.passbookOrChequeRejectReason}
                            </p>
                            <p className="text-xs text-red-600 dark:text-red-500 mt-1">
                              {formatDate(
                                selectedDriver.passbookOrChequeReason_updated_at
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedDriver.rcRejectReason && (
                      <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-lg p-3">
                        <div className="flex items-start">
                          <div className="h-6 w-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mr-3 mt-1">
                            <XCircle className="h-3 w-3 text-red-600 dark:text-red-400" />
                          </div>
                          <div>
                            <span className="text-sm font-medium text-red-800 dark:text-red-300">
                              RC Rejected
                            </span>
                            <p className="text-sm text-red-700 dark:text-red-400">
                              {selectedDriver.rcRejectReason}
                            </p>
                            <p className="text-xs text-red-600 dark:text-red-500 mt-1">
                              {formatDate(selectedDriver.rcReason_updated_at)}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedDriver.pucRejectReason && (
                      <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-lg p-3">
                        <div className="flex items-start">
                          <div className="h-6 w-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mr-3 mt-1">
                            <XCircle className="h-3 w-3 text-red-600 dark:text-red-400" />
                          </div>
                          <div>
                            <span className="text-sm font-medium text-red-800 dark:text-red-300">
                              PUC Rejected
                            </span>
                            <p className="text-sm text-red-700 dark:text-red-400">
                              {selectedDriver.pucRejectReason}
                            </p>
                            <p className="text-xs text-red-600 dark:text-red-500 mt-1">
                              {formatDate(selectedDriver.pucReason_updated_at)}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedDriver.insuranceRejectReason && (
                      <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-lg p-3">
                        <div className="flex items-start">
                          <div className="h-6 w-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mr-3 mt-1">
                            <XCircle className="h-3 w-3 text-red-600 dark:text-red-400" />
                          </div>
                          <div>
                            <span className="text-sm font-medium text-red-800 dark:text-red-300">
                              Insurance Rejected
                            </span>
                            <p className="text-sm text-red-700 dark:text-red-400">
                              {selectedDriver.insuranceRejectReason}
                            </p>
                            <p className="text-xs text-red-600 dark:text-red-500 mt-1">
                              {formatDate(
                                selectedDriver.insuranceReason_updated_at
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedDriver.permitRejectReason && (
                      <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-lg p-3">
                        <div className="flex items-start">
                          <div className="h-6 w-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mr-3 mt-1">
                            <XCircle className="h-3 w-3 text-red-600 dark:text-red-400" />
                          </div>
                          <div>
                            <span className="text-sm font-medium text-red-800 dark:text-red-300">
                              Permit Rejected
                            </span>
                            <p className="text-sm text-red-700 dark:text-red-400">
                              {selectedDriver.permitRejectReason}
                            </p>
                            <p className="text-xs text-red-600 dark:text-red-500 mt-1">
                              {formatDate(
                                selectedDriver.permitReason_updated_at
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedDriver.fitnessCertificateRejectReason && (
                      <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-lg p-3">
                        <div className="flex items-start">
                          <div className="h-6 w-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mr-3 mt-1">
                            <XCircle className="h-3 w-3 text-red-600 dark:text-red-400" />
                          </div>
                          <div>
                            <span className="text-sm font-medium text-red-800 dark:text-red-300">
                              Fitness Certificate Rejected
                            </span>
                            <p className="text-sm text-red-700 dark:text-red-400">
                              {selectedDriver.fitnessCertificateRejectReason}
                            </p>
                            <p className="text-xs text-red-600 dark:text-red-500 mt-1">
                              {formatDate(
                                selectedDriver.fitnessCertificateReason_updated_at
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedDriver.taxReceiptRejectReason && (
                      <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-lg p-3">
                        <div className="flex items-start">
                          <div className="h-6 w-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mr-3 mt-1">
                            <XCircle className="h-3 w-3 text-red-600 dark:text-red-400" />
                          </div>
                          <div>
                            <span className="text-sm font-medium text-red-800 dark:text-red-300">
                              Tax Receipt Rejected
                            </span>
                            <p className="text-sm text-red-700 dark:text-red-400">
                              {selectedDriver.taxReceiptRejectReason}
                            </p>
                            <p className="text-xs text-red-600 dark:text-red-500 mt-1">
                              {formatDate(
                                selectedDriver.taxReceiptReason_updated_at
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedDriver.drivingLicenseFrontRejectReason && (
                      <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-lg p-3">
                        <div className="flex items-start">
                          <div className="h-6 w-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mr-3 mt-1">
                            <XCircle className="h-3 w-3 text-red-600 dark:text-red-400" />
                          </div>
                          <div>
                            <span className="text-sm font-medium text-red-800 dark:text-red-300">
                              Driving License (Front) Rejected
                            </span>
                            <p className="text-sm text-red-700 dark:text-red-400">
                              {selectedDriver.drivingLicenseFrontRejectReason}
                            </p>
                            <p className="text-xs text-red-600 dark:text-red-500 mt-1">
                              {formatDate(
                                selectedDriver.drivingLicenseFrontReason_updated_at
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedDriver.drivingLicenseBackRejectReason && (
                      <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-lg p-3">
                        <div className="flex items-start">
                          <div className="h-6 w-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mr-3 mt-1">
                            <XCircle className="h-3 w-3 text-red-600 dark:text-red-400" />
                          </div>
                          <div>
                            <span className="text-sm font-medium text-red-800 dark:text-red-300">
                              Driving License (Back) Rejected
                            </span>
                            <p className="text-sm text-red-700 dark:text-red-400">
                              {selectedDriver.drivingLicenseBackRejectReason}
                            </p>
                            <p className="text-xs text-red-600 dark:text-red-500 mt-1">
                              {formatDate(
                                selectedDriver.drivingLicenseBackReason_updated_at
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {!selectedDriver.aadharFrontRejectReason &&
                      !selectedDriver.aadharBackRejectReason &&
                      !selectedDriver.panCardFrontRejectReason &&
                      !selectedDriver.selfieRejectReason &&
                      !selectedDriver.passbookOrChequeRejectReason &&
                      !selectedDriver.rcRejectReason &&
                      !selectedDriver.pucRejectReason &&
                      !selectedDriver.insuranceRejectReason &&
                      !selectedDriver.permitRejectReason &&
                      !selectedDriver.fitnessCertificateRejectReason &&
                      !selectedDriver.taxReceiptRejectReason &&
                      !selectedDriver.drivingLicenseFrontRejectReason &&
                      !selectedDriver.drivingLicenseBackRejectReason && (
                        <p className="text-gray-500 dark:text-gray-400 text-center">
                          No document rejection history found.
                        </p>
                      )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end p-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    goToDocumentVerification(selectedDriver);
                  }}
                  className="flex items-center px-4 py-2 bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/50 text-green-800 dark:text-green-300 rounded-lg transition-colors mr-3"
                >
                  <FileCheck className="h-4 w-4 mr-2" />
                  <span>Verify Documents</span>
                </button>

                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    openStatusModal(selectedDriver);
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

      {/* Status Update Modal */}
      <AnimatePresence>
        {showStatusModal && selectedDriver && (
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
                  Update Driver Status
                </h3>

                <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
                  Change the status for driver #{selectedDriver.did}
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
                    {Object.entries(driverStatusMap).map(
                      ([value, { label }]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      )
                    )}
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
                    onClick={updateDriverStatus}
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

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && selectedDriver && (
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
                  Delete Driver
                </h3>

                <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
                  Are you sure you want to delete driver #{selectedDriver.did}?
                  This action cannot be undone.
                </p>

                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={deleteDriver}
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
    </div>
  );
}

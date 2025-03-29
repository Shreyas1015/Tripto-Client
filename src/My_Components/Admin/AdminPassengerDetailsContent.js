"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Search,
  Filter,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Download,
  RefreshCw,
  Eye,
  X,
  Bell,
  Settings,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import axiosInstance from "../../API/axiosInstance";
import secureLocalStorage from "react-secure-storage";
import toast from "react-hot-toast";

const AdminPassengerDashboard = () => {
  const [passengers, setPassengers] = useState([]);
  const [filteredPassengers, setFilteredPassengers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "ascending",
  });
  const [selectedPassenger, setSelectedPassenger] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    suspended: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isExporting, setIsExporting] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);

  // Get admin UID from secure storage
  const decryptedUID = secureLocalStorage.getItem("uid");

  // Fetch passengers data from API
  const fetchPassengers = async (page = 1, status = activeFilter) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/admin/fetchPassengers`,
        {
          decryptedUID,
          page,
          limit: 20,
          status: status === "all" ? null : status,
        }
      );

      if (response.status === 200) {
        setPassengers(response.data.passengers);
        setFilteredPassengers(response.data.passengers);
        setTotalPages(response.data.totalPages || 1);
        setCurrentPage(page);
        console.log("Passengers : ", response.data.passengers);

        // Update stats
        fetchPassengerStats();
      } else {
        toast.error("Failed to fetch passengers");
      }
    } catch (error) {
      console.error("Error fetching passengers:", error);
      toast.error("Error fetching passengers");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch passenger statistics
  const fetchPassengerStats = async () => {
    try {
      const response = await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/admin/getPassengerStats`,
        {
          decryptedUID,
        }
      );

      if (response.status === 200) {
        setStats({
          total: response.data.total || 0,
          active: response.data.active || 0,
          inactive: response.data.inactive || 0,
          suspended: response.data.suspended || 0,
        });
      }
    } catch (error) {
      console.error("Error fetching passenger stats:", error);
    }
  };

  // Initial data fetch
  useEffect(() => {
    if (decryptedUID) {
      fetchPassengers(1, "all");
    }
  }, [decryptedUID]);

  // Handle search
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredPassengers(passengers);
    } else {
      const filtered = passengers.filter(
        (passenger) =>
          passenger.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          passenger.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          passenger.id?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPassengers(filtered);
    }
  }, [searchTerm, passengers]);

  // Handle sorting
  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });

    const sortedData = [...filteredPassengers].sort((a, b) => {
      if (!a[key] && !b[key]) return 0;
      if (!a[key]) return 1;
      if (!b[key]) return -1;

      if (a[key] < b[key]) {
        return direction === "ascending" ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === "ascending" ? 1 : -1;
      }
      return 0;
    });

    setFilteredPassengers(sortedData);
  };

  // Filter passengers by status
  const filterPassengers = (status) => {
    setActiveFilter(status);
    fetchPassengers(1, status);
  };

  // View passenger details
  const viewPassengerDetails = async (passenger) => {
    setIsLoading(true);
    try {
      // Fetch detailed passenger info
      const response = await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/admin/getPassengerDetails`,
        {
          decryptedUID,
          passengerId: passenger.pid,
        }
      );

      if (response.status === 200) {
        console.log("Passenger Details : ", response.data);
        setSelectedPassenger(response.data);
        setShowDetailModal(true);
      } else {
        toast.error("Failed to fetch passenger details");
      }
    } catch (error) {
      console.error("Error fetching passenger details:", error);
      toast.error("Error fetching passenger details");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle passenger status change
  const handleStatusChange = async (passengerId, newStatus) => {
    setIsActionLoading(true);
    try {
      const response = await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/admin/updatePassengerStatus`,
        {
          decryptedUID,
          passengerId,
          status: newStatus,
        }
      );

      if (response.status === 200) {
        toast.success(
          `Passenger ${
            newStatus === "active" ? "activated" : "suspended"
          } successfully`
        );
        setShowDetailModal(false);
        fetchPassengers(currentPage, activeFilter);
      } else {
        toast.error("Failed to update passenger status");
      }
    } catch (error) {
      console.error("Error updating passenger status:", error);
      toast.error("Error updating passenger status");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDeletePassenger = async (passengerUID) => {
    console.log("handleDeletePassenger called with passengerId:", passengerUID); // Log the passengerId
    setIsActionLoading(true); // Indicate action is in progress

    try {
      const response = await axiosInstance.delete(
        `${process.env.REACT_APP_BASE_URL}/admin/deleteAdminPassenger`,
        {
          data: {
            decryptedUID,
            passengerUID, // Include passengerId in the request
          },
        }
      );

      console.log("Delete request sent. Response:", response); // Log the response

      if (response.status === 200) {
        console.log("Passenger deleted successfully");
        toast.success("Passenger deleted successfully");
        setShowDetailModal(false);
        fetchPassengers(currentPage, activeFilter); // Refresh the passenger list
      } else {
        console.error(
          "Failed to delete passenger. Response status:",
          response.status
        );
        toast.error("Failed to delete passenger");
      }
    } catch (error) {
      console.error("Error deleting passenger:", error); // Log the error
      toast.error("Error deleting passenger");
    } finally {
      setIsActionLoading(false); // Reset loading state
    }
  };

  // Handle export passengers data
  const handleExportData = async () => {
    setIsExporting(true);
    try {
      const response = await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/admin/exportPassengersData`,
        {
          decryptedUID,
          status: activeFilter === "all" ? null : activeFilter,
        },
        { responseType: "blob" }
      );

      if (response.status === 200) {
        // Create a download link for the CSV file
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `passengers_${new Date().toISOString().split("T")[0]}.csv`
        );
        document.body.appendChild(link);
        link.click();
        link.remove();
        toast.success("Export successful");
      } else {
        toast.error("Failed to export data");
      }
    } catch (error) {
      console.error("Error exporting data:", error);
      toast.error("Error exporting data");
    } finally {
      setIsExporting(false);
    }
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 0:
        return "bg-green-100 text-green-800";
      case 1:
        return "bg-yellow-100 text-yellow-800";
      case 2:
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
        staggerChildren: 0.05,
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

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring", damping: 25, stiffness: 500 },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.2 },
    },
  };

  // Stats data
  const statsData = [
    {
      title: "Total Passengers",
      value: stats.total,
      icon: <Users size={20} />,
      color: "bg-blue-500",
    },
    {
      title: "Active Passengers",
      value: stats.active,
      icon: <UserCheck size={20} />,
      color: "bg-green-500",
    },
    {
      title: "Inactive Passengers",
      value: stats.inactive,
      icon: <UserX size={20} />,
      color: "bg-yellow-500",
    },
    {
      title: "Suspended Accounts",
      value: stats.suspended,
      icon: <Trash2 size={20} />,
      color: "bg-red-500",
    },
  ];

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Top Navigation */}
      <header className="bg-white shadow-sm py-4 px-6 flex items-center justify-between">
        <div className="flex items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            Passenger Management
          </h2>
        </div>

        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full hover:bg-gray-100">
            <Bell size={20} className="text-gray-600" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100">
            <Settings size={20} className="text-gray-600" />
          </button>
          <div className="flex items-center space-x-2">
            <img
              src="https://i.pravatar.cc/150?img=68"
              alt="Admin"
              className="w-8 h-8 rounded-full"
            />
            <span className="text-sm font-medium text-gray-700">Admin</span>
          </div>
        </div>
      </header>

      <main className="p-6">
        {/* Stats Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {statsData.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-500 text-sm">{stat.title}</p>
                  <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                </div>
                <div className={`${stat.color} p-3 rounded-lg text-white`}>
                  {stat.icon}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-xl shadow-sm p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="relative w-full md:w-96">
              <input
                type="text"
                placeholder="Search passengers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <button
                  onClick={() => setShowFilterMenu(!showFilterMenu)}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Filter size={18} />
                  <span>Filter</span>
                  {showFilterMenu ? (
                    <ChevronUp size={18} />
                  ) : (
                    <ChevronDown size={18} />
                  )}
                </button>

                {showFilterMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 py-2">
                    <button
                      onClick={() => {
                        filterPassengers("all");
                        setShowFilterMenu(false);
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                        activeFilter === "all" ? "bg-blue-50 text-blue-600" : ""
                      }`}
                    >
                      All Passengers
                    </button>
                    <button
                      onClick={() => {
                        filterPassengers("active");
                        setShowFilterMenu(false);
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                        activeFilter === "active"
                          ? "bg-blue-50 text-blue-600"
                          : ""
                      }`}
                    >
                      Active
                    </button>
                    <button
                      onClick={() => {
                        filterPassengers("inactive");
                        setShowFilterMenu(false);
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                        activeFilter === "inactive"
                          ? "bg-blue-50 text-blue-600"
                          : ""
                      }`}
                    >
                      Inactive
                    </button>
                    <button
                      onClick={() => {
                        filterPassengers("suspended");
                        setShowFilterMenu(false);
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                        activeFilter === "suspended"
                          ? "bg-blue-50 text-blue-600"
                          : ""
                      }`}
                    >
                      Suspended
                    </button>
                  </div>
                )}
              </div>

              <button
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleExportData}
                disabled={isExporting}
              >
                {isExporting ? (
                  <>
                    <RefreshCw size={18} className="animate-spin" />
                    <span>Exporting...</span>
                  </>
                ) : (
                  <>
                    <Download size={18} />
                    <span>Export</span>
                  </>
                )}
              </button>

              <button
                onClick={() => fetchPassengers(currentPage, activeFilter)}
                disabled={isLoading}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw
                  size={18}
                  className={isLoading ? "animate-spin" : ""}
                />
                <span>{isLoading ? "Loading..." : "Refresh"}</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Passengers Table */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-xl shadow-sm overflow-hidden"
        >
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center">
                  <RefreshCw
                    size={40}
                    className="text-blue-500 animate-spin mb-4"
                  />
                  <p className="text-gray-500">Loading passenger data...</p>
                </div>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      <button
                        onClick={() => requestSort("name")}
                        className="flex items-center space-x-1 hover:text-gray-700"
                      >
                        <span>Passenger</span>
                        {sortConfig.key === "name" &&
                          (sortConfig.direction === "ascending" ? (
                            <ChevronUp size={16} />
                          ) : (
                            <ChevronDown size={16} />
                          ))}
                      </button>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      <button
                        onClick={() => requestSort("uid")}
                        className="flex items-center space-x-1 hover:text-gray-700"
                      >
                        <span>ID</span>
                        {sortConfig.key === "uid" &&
                          (sortConfig.direction === "ascending" ? (
                            <ChevronUp size={16} />
                          ) : (
                            <ChevronDown size={16} />
                          ))}
                      </button>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      <button
                        onClick={() => requestSort("email")}
                        className="flex items-center space-x-1 hover:text-gray-700"
                      >
                        <span>Email</span>
                        {sortConfig.key === "email" &&
                          (sortConfig.direction === "ascending" ? (
                            <ChevronUp size={16} />
                          ) : (
                            <ChevronDown size={16} />
                          ))}
                      </button>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      <button
                        onClick={() => requestSort("status")}
                        className="flex items-center space-x-1 hover:text-gray-700"
                      >
                        <span>Status</span>
                        {sortConfig.key === "status" &&
                          (sortConfig.direction === "ascending" ? (
                            <ChevronUp size={16} />
                          ) : (
                            <ChevronDown size={16} />
                          ))}
                      </button>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      <button
                        onClick={() => requestSort("joinDate")}
                        className="flex items-center space-x-1 hover:text-gray-700"
                      >
                        <span>Join Date</span>
                        {sortConfig.key === "joinDate" &&
                          (sortConfig.direction === "ascending" ? (
                            <ChevronUp size={16} />
                          ) : (
                            <ChevronDown size={16} />
                          ))}
                      </button>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      <button
                        onClick={() => requestSort("bookings")}
                        className="flex items-center space-x-1 hover:text-gray-700"
                      >
                        <span>Bookings</span>
                        {sortConfig.key === "bookings" &&
                          (sortConfig.direction === "ascending" ? (
                            <ChevronUp size={16} />
                          ) : (
                            <ChevronDown size={16} />
                          ))}
                      </button>
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
                  {filteredPassengers.length === 0 ? (
                    <tr>
                      <td
                        colSpan="7"
                        className="px-6 py-12 text-center text-gray-500"
                      >
                        <div className="flex flex-col items-center">
                          <Users size={40} className="text-gray-400 mb-4" />
                          <p className="text-lg font-medium">
                            No passengers found
                          </p>
                          <p className="text-sm">
                            Try adjusting your search or filter criteria
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredPassengers.map((passenger, index) => (
                      <motion.tr
                        key={passenger.uid}
                        variants={itemVariants}
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => viewPassengerDetails(passenger)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img
                                className="h-10 w-10 rounded-full"
                                src={
                                  passenger.profile_img ||
                                  "/placeholder.svg?height=40&width=40"
                                }
                                alt=""
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {passenger.name || "Unknown"}
                              </div>
                              <div className="text-sm text-gray-500">
                                {passenger.phone_number || "No phone"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {passenger.uid || "N/A"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {passenger.email || "No email"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                              passenger.user_status
                            )}`}
                          >
                            {passenger.user_status === 0
                              ? "Active"
                              : passenger.user_status === 1
                              ? "Inactive"
                              : passenger.user_status === 2
                              ? "Suspended"
                              : "Unknown"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {passenger.joinDate || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {passenger.bookings || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                viewPassengerDetails(passenger);
                              }}
                              className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50"
                            >
                              <Eye size={18} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                // Navigate to edit page or open edit modal
                                toast.success(
                                  `Edit functionality for ${passenger.uid} will be implemented soon`
                                );
                              }}
                              className="text-yellow-600 hover:text-yellow-900 p-1 rounded-full hover:bg-yellow-50"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeletePassenger(passenger.uid);
                              }}
                              className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-medium">
                    {(currentPage - 1) * 20 + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(currentPage * 20, stats.total)}
                  </span>{" "}
                  of <span className="font-medium">{stats.total}</span> results
                </p>
              </div>
              <div>
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() =>
                      currentPage > 1 &&
                      fetchPassengers(currentPage - 1, activeFilter)
                    }
                    disabled={currentPage === 1 || isLoading}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronRight
                      className="h-5 w-5 transform rotate-180"
                      aria-hidden="true"
                    />
                  </button>

                  {/* Show current page and total pages */}
                  <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>

                  <button
                    onClick={() =>
                      currentPage < totalPages &&
                      fetchPassengers(currentPage + 1, activeFilter)
                    }
                    disabled={currentPage === totalPages || isLoading}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRight className="h-5 w-5" aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Passenger Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedPassenger && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalVariants}
            className="fixed inset-0 z-50 overflow-y-auto"
            onClick={() => setShowDetailModal(false)}
          >
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div
                className="fixed inset-0 transition-opacity"
                aria-hidden="true"
              >
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>

              <span
                className="hidden sm:inline-block sm:align-middle sm:h-screen"
                aria-hidden="true"
              >
                &#8203;
              </span>

              <div
                className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                          Passenger Details
                        </h3>
                        <button
                          onClick={() => setShowDetailModal(false)}
                          className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                        >
                          <span className="sr-only">Close</span>
                          <X className="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>

                      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Left Column - Basic Info */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex flex-col items-center mb-4">
                            <img
                              src={
                                selectedPassenger.profile_img ||
                                "/placeholder.svg?height=96&width=96" ||
                                "/placeholder.svg"
                              }
                              alt={selectedPassenger.name || "Passenger"}
                              className="w-24 h-24 rounded-full mb-3 object-cover"
                            />
                            <h4 className="text-xl font-semibold">
                              {selectedPassenger.name || "Unknown Name"}
                            </h4>
                            <span
                              className={`px-3 py-1 mt-2 text-xs font-semibold rounded-full ${getStatusColor(
                                selectedPassenger.user_status
                              )}`}
                            >
                              {selectedPassenger.user_status === 0
                                ? "Active"
                                : selectedPassenger.user_status === 1
                                ? "Inactive"
                                : selectedPassenger.user_status === 2
                                ? "Suspended"
                                : "Unknown"}
                            </span>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <p className="text-sm text-gray-500">
                                Passenger ID
                              </p>
                              <p className="font-medium">
                                {selectedPassenger.pid || "N/A"}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">
                                Email Address
                              </p>
                              <p className="font-medium">
                                {selectedPassenger.email || "No email provided"}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">
                                Phone Number
                              </p>
                              <p className="font-medium">
                                {selectedPassenger.phone_number ||
                                  "No phone provided"}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Joined On</p>
                              <p className="font-medium">
                                {selectedPassenger.created_at
                                  ? new Date(
                                      selectedPassenger.created_at
                                    ).toLocaleDateString("en-US", {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    })
                                  : "Unknown"}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">
                                Last Active
                              </p>
                              <p className="font-medium">
                                {selectedPassenger.lastActive || "Unknown"}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">
                                Verification Status
                              </p>
                              <p className="font-medium flex items-center">
                                {selectedPassenger.verified ? (
                                  <>
                                    <CheckCircle
                                      size={16}
                                      className="text-green-500 mr-1"
                                    />
                                    Verified
                                  </>
                                ) : (
                                  <>
                                    <AlertCircle
                                      size={16}
                                      className="text-red-500 mr-1"
                                    />
                                    Not Verified
                                  </>
                                )}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Middle Column - Address & Bookings */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="text-lg font-medium mb-4">
                            Address Information
                          </h4>
                          <div className="space-y-3 mb-6">
                            {selectedPassenger.address ? (
                              <>
                                <div>
                                  <p className="text-sm text-gray-500">
                                    Street Address
                                  </p>
                                  <p className="font-medium">
                                    {selectedPassenger.address.street ||
                                      "N/A (e.g., 123 Main St)"}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">City</p>
                                  <p className="font-medium">
                                    {selectedPassenger.address.city ||
                                      "N/A (e.g., Sample City)"}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">State</p>
                                  <p className="font-medium">
                                    {selectedPassenger.address.state ||
                                      "N/A (e.g., Sample State)"}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">
                                    Zip Code
                                  </p>
                                  <p className="font-medium">
                                    {selectedPassenger.address.zipCode ||
                                      "N/A (e.g., 12345)"}
                                  </p>
                                </div>
                              </>
                            ) : (
                              <>
                                <div>
                                  <p className="text-sm text-gray-500">
                                    Street Address
                                  </p>
                                  <p className="font-medium">123 Main St</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">City</p>
                                  <p className="font-medium">Sample City</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">State</p>
                                  <p className="font-medium">Sample State</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">
                                    Zip Code
                                  </p>
                                  <p className="font-medium">12345</p>
                                </div>
                              </>
                            )}
                          </div>

                          <h4 className="text-lg font-medium mb-4">
                            Booking Summary
                          </h4>
                          <div className="bg-white p-3 rounded-lg border border-gray-200">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-gray-600">
                                Total Bookings
                              </span>
                              <span className="font-semibold">
                                {selectedPassenger.bookings || 0}
                              </span>
                            </div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-gray-600">Completed</span>
                              <span className="font-semibold">
                                {selectedPassenger.completedBookings ||
                                  Math.floor(
                                    (selectedPassenger.bookings || 0) * 0.8
                                  )}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">Cancelled</span>
                              <span className="font-semibold">
                                {selectedPassenger.cancelledBookings ||
                                  Math.floor(
                                    (selectedPassenger.bookings || 0) * 0.2
                                  )}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Right Column - Activity & Actions */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="text-lg font-medium mb-4">
                            Recent Activity
                          </h4>
                          <div className="space-y-3 mb-6">
                            {selectedPassenger.recentActivity ? (
                              selectedPassenger.recentActivity.map(
                                (activity, index) => (
                                  <div
                                    key={index}
                                    className="bg-white p-3 rounded-lg border border-gray-200"
                                  >
                                    <p className="text-sm text-gray-600">
                                      {activity.description}: {activity.date}
                                    </p>
                                  </div>
                                )
                              )
                            ) : (
                              <>
                                <div className="bg-white p-3 rounded-lg border border-gray-200">
                                  <p className="text-sm text-gray-600">
                                    Last login:{" "}
                                    {selectedPassenger.lastLogin ||
                                      new Date().toLocaleDateString()}
                                  </p>
                                </div>
                                <div className="bg-white p-3 rounded-lg border border-gray-200">
                                  <p className="text-sm text-gray-600">
                                    Profile updated:{" "}
                                    {selectedPassenger.lastUpdated ||
                                      new Date(
                                        Date.now() - 86400000 * 3
                                      ).toLocaleDateString()}
                                  </p>
                                </div>
                                <div className="bg-white p-3 rounded-lg border border-gray-200">
                                  <p className="text-sm text-gray-600">
                                    Last booking:{" "}
                                    {selectedPassenger.lastBooking ||
                                      new Date(
                                        Date.now() - 86400000 * 7
                                      ).toLocaleDateString()}
                                  </p>
                                </div>
                              </>
                            )}
                          </div>

                          <h4 className="text-lg font-medium mb-4">
                            Admin Actions
                          </h4>
                          <div className="space-y-3">
                            <button
                              className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                              onClick={() =>
                                toast.success(
                                  "Edit functionality will be implemented soon"
                                )
                              }
                              disabled={isActionLoading}
                            >
                              <Edit size={16} className="mr-2" />
                              Edit Passenger
                            </button>
                            {selectedPassenger.status === "active" ? (
                              <button
                                className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={() =>
                                  handleStatusChange(
                                    selectedPassenger.uid,
                                    "suspended"
                                  )
                                }
                                disabled={isActionLoading}
                              >
                                {isActionLoading ? (
                                  <>
                                    <RefreshCw
                                      size={16}
                                      className="mr-2 animate-spin"
                                    />
                                    Processing...
                                  </>
                                ) : (
                                  <>
                                    <UserX size={16} className="mr-2" />
                                    Suspend Account
                                  </>
                                )}
                              </button>
                            ) : (
                              <button
                                className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={() =>
                                  handleStatusChange(
                                    selectedPassenger.uid,
                                    "active"
                                  )
                                }
                                disabled={isActionLoading}
                              >
                                {isActionLoading ? (
                                  <>
                                    <RefreshCw
                                      size={16}
                                      className="mr-2 animate-spin"
                                    />
                                    Processing...
                                  </>
                                ) : (
                                  <>
                                    <UserCheck size={16} className="mr-2" />
                                    Activate Account
                                  </>
                                )}
                              </button>
                            )}
                            <button
                              className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-red-600 bg-white hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                              onClick={() =>
                                handleDeletePassenger(selectedPassenger.uid)
                              }
                              disabled={isActionLoading}
                            >
                              {isActionLoading ? (
                                <>
                                  <RefreshCw
                                    size={16}
                                    className="mr-2 animate-spin"
                                  />
                                  Processing...
                                </>
                              ) : (
                                <>
                                  <Trash2 size={16} className="mr-2" />
                                  Delete Account
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => setShowDetailModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminPassengerDashboard;

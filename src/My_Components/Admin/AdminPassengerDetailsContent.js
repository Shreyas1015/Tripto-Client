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
} from "lucide-react";

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

  // Mock data for demonstration
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockPassengers = Array(20)
        .fill()
        .map((_, index) => ({
          id: `PAX${1000 + index}`,
          name: [
            "John Doe",
            "Jane Smith",
            "Robert Johnson",
            "Emily Davis",
            "Michael Wilson",
          ][Math.floor(Math.random() * 5)],
          email: `passenger${index + 1}@example.com`,
          phone: `+1 (555) ${100 + index}-${1000 + index}`,
          status: ["active", "inactive", "suspended"][
            Math.floor(Math.random() * 3)
          ],
          joinDate: new Date(
            2023,
            Math.floor(Math.random() * 12),
            Math.floor(Math.random() * 28) + 1
          )
            .toISOString()
            .split("T")[0],
          lastActive: new Date(
            2023,
            Math.floor(Math.random() * 12),
            Math.floor(Math.random() * 28) + 1
          )
            .toISOString()
            .split("T")[0],
          bookings: Math.floor(Math.random() * 10),
          profileImage: `https://i.pravatar.cc/150?img=${index + 1}`,
          verified: Math.random() > 0.3,
          address: {
            street: `${1000 + index} Main St`,
            city: ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"][
              Math.floor(Math.random() * 5)
            ],
            state: ["NY", "CA", "IL", "TX", "AZ"][
              Math.floor(Math.random() * 5)
            ],
            zipCode: `${10000 + Math.floor(Math.random() * 90000)}`,
          },
        }));

      setPassengers(mockPassengers);
      setFilteredPassengers(mockPassengers);
      setIsLoading(false);
    }, 1500);
  }, []);

  // Handle search
  useEffect(() => {
    if (searchTerm === "") {
      filterPassengers(activeFilter);
    } else {
      const filtered = passengers.filter(
        (passenger) =>
          passenger.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          passenger.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          passenger.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPassengers(filtered);
    }
  }, [searchTerm, passengers, activeFilter]);

  // Handle sorting
  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });

    const sortedData = [...filteredPassengers].sort((a, b) => {
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
    if (status === "all") {
      setFilteredPassengers(passengers);
    } else {
      const filtered = passengers.filter(
        (passenger) => passenger.status === status
      );
      setFilteredPassengers(filtered);
    }
  };

  // View passenger details
  const viewPassengerDetails = (passenger) => {
    setSelectedPassenger(passenger);
    setShowDetailModal(true);
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-yellow-100 text-yellow-800";
      case "suspended":
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
  const stats = [
    {
      title: "Total Passengers",
      value: passengers.length,
      icon: <Users size={20} />,
      color: "bg-blue-500",
    },
    {
      title: "Active Passengers",
      value: passengers.filter((p) => p.status === "active").length,
      icon: <UserCheck size={20} />,
      color: "bg-green-500",
    },
    {
      title: "Inactive Passengers",
      value: passengers.filter((p) => p.status === "inactive").length,
      icon: <UserX size={20} />,
      color: "bg-yellow-500",
    },
    {
      title: "Suspended Accounts",
      value: passengers.filter((p) => p.status === "suspended").length,
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
          {stats.map((stat, index) => (
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

              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Download size={18} />
                <span>Export</span>
              </button>

              <button
                onClick={() => {
                  setIsLoading(true);
                  setTimeout(() => setIsLoading(false), 1000);
                }}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <RefreshCw
                  size={18}
                  className={isLoading ? "animate-spin" : ""}
                />
                <span>Refresh</span>
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
                        onClick={() => requestSort("id")}
                        className="flex items-center space-x-1 hover:text-gray-700"
                      >
                        <span>ID</span>
                        {sortConfig.key === "id" &&
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
                        key={passenger.id}
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
                                  passenger.profileImage || "/placeholder.svg"
                                }
                                alt=""
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {passenger.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {passenger.phone}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {passenger.id}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {passenger.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                              passenger.status
                            )}`}
                          >
                            {passenger.status.charAt(0).toUpperCase() +
                              passenger.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {passenger.joinDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {passenger.bookings}
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
                                console.log("Edit", passenger.id);
                              }}
                              className="text-yellow-600 hover:text-yellow-900 p-1 rounded-full hover:bg-yellow-50"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                console.log("Delete", passenger.id);
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
                  Showing <span className="font-medium">1</span> to{" "}
                  <span className="font-medium">
                    {filteredPassengers.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium">
                    {filteredPassengers.length}
                  </span>{" "}
                  results
                </p>
              </div>
              <div>
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <a
                    href="#"
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronRight
                      className="h-5 w-5 transform rotate-180"
                      aria-hidden="true"
                    />
                  </a>
                  <a
                    href="#"
                    aria-current="page"
                    className="z-10 bg-blue-50 border-blue-500 text-blue-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                  >
                    1
                  </a>
                  <a
                    href="#"
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRight className="h-5 w-5" aria-hidden="true" />
                  </a>
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
                                selectedPassenger.profileImage ||
                                "/placeholder.svg"
                              }
                              alt={selectedPassenger.name}
                              className="w-24 h-24 rounded-full mb-3"
                            />
                            <h4 className="text-xl font-semibold">
                              {selectedPassenger.name}
                            </h4>
                            <span
                              className={`px-3 py-1 mt-2 text-xs font-semibold rounded-full ${getStatusColor(
                                selectedPassenger.status
                              )}`}
                            >
                              {selectedPassenger.status
                                .charAt(0)
                                .toUpperCase() +
                                selectedPassenger.status.slice(1)}
                            </span>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <p className="text-sm text-gray-500">
                                Passenger ID
                              </p>
                              <p className="font-medium">
                                {selectedPassenger.id}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">
                                Email Address
                              </p>
                              <p className="font-medium">
                                {selectedPassenger.email}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">
                                Phone Number
                              </p>
                              <p className="font-medium">
                                {selectedPassenger.phone}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Joined On</p>
                              <p className="font-medium">
                                {selectedPassenger.joinDate}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">
                                Last Active
                              </p>
                              <p className="font-medium">
                                {selectedPassenger.lastActive}
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
                                    <X
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
                            <div>
                              <p className="text-sm text-gray-500">
                                Street Address
                              </p>
                              <p className="font-medium">
                                {selectedPassenger.address.street}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">City</p>
                              <p className="font-medium">
                                {selectedPassenger.address.city}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">State</p>
                              <p className="font-medium">
                                {selectedPassenger.address.state}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Zip Code</p>
                              <p className="font-medium">
                                {selectedPassenger.address.zipCode}
                              </p>
                            </div>
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
                                {selectedPassenger.bookings}
                              </span>
                            </div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-gray-600">Completed</span>
                              <span className="font-semibold">
                                {Math.floor(selectedPassenger.bookings * 0.8)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">Cancelled</span>
                              <span className="font-semibold">
                                {Math.floor(selectedPassenger.bookings * 0.2)}
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
                            <div className="bg-white p-3 rounded-lg border border-gray-200">
                              <p className="text-sm text-gray-600">
                                Last login: {new Date().toLocaleDateString()}
                              </p>
                            </div>
                            <div className="bg-white p-3 rounded-lg border border-gray-200">
                              <p className="text-sm text-gray-600">
                                Profile updated:{" "}
                                {new Date(
                                  Date.now() - 86400000 * 3
                                ).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="bg-white p-3 rounded-lg border border-gray-200">
                              <p className="text-sm text-gray-600">
                                Booking made:{" "}
                                {new Date(
                                  Date.now() - 86400000 * 7
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          <h4 className="text-lg font-medium mb-4">
                            Admin Actions
                          </h4>
                          <div className="space-y-3">
                            <button className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                              <Edit size={16} className="mr-2" />
                              Edit Passenger
                            </button>
                            {selectedPassenger.status === "active" ? (
                              <button className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700">
                                <UserX size={16} className="mr-2" />
                                Suspend Account
                              </button>
                            ) : (
                              <button className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700">
                                <UserCheck size={16} className="mr-2" />
                                Activate Account
                              </button>
                            )}
                            <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-red-600 bg-white hover:bg-red-50">
                              <Trash2 size={16} className="mr-2" />
                              Delete Account
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

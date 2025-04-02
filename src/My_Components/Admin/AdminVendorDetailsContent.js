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
  Building,
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
  MapPin,
  Activity,
  ArrowRight,
  Briefcase,
  Store,
  CreditCard,
} from "lucide-react";
import toast from "react-hot-toast";

// Vendor status mapping
const vendorStatusMap = {
  0: { label: "Active", icon: UserCheck, color: "text-green-500 bg-green-100" },
  1: { label: "Inactive", icon: UserX, color: "text-red-500 bg-red-100" },
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

export default function AdminVendorDashboard() {
  const navigate = useNavigate();
  const uid = localStorage.getItem("@secure.n.uid");
  const decryptedUID = secureLocalStorage.getItem("uid");

  const [vendors, setVendors] = useState([]);
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedVendor, setExpandedVendor] = useState(null);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [vendorsPerPage] = useState(10);
  const [newStatus, setNewStatus] = useState(0);
  const [sortConfig, setSortConfig] = useState({
    key: "vid",
    direction: "desc",
  });
  const [filters, setFilters] = useState({
    vendorStatus: null,
    verificationStatus: null,
    dateRange: {
      start: null,
      end: null,
    },
  });
  const [stats, setStats] = useState({
    totalVendors: 0,
    activeVendors: 0,
    inactiveVendors: 0,
    pendingVerification: 0,
    fullyVerified: 0,
    rejectedDocuments: 0,
    recentlyJoined: 0,
  });

  // Fetch all vendors
  useEffect(() => {
    const fetchAllVendors = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.post(
          `${process.env.REACT_APP_BASE_URL}/admin/getAllVendors`,
          {
            decryptedUID,
          }
        );

        if (response.data && Array.isArray(response.data)) {
          setVendors(response.data);
          setFilteredVendors(response.data);
          calculateStats(response.data);
          setTotalPages(Math.ceil(response.data.length / vendorsPerPage));
        }
      } catch (error) {
        console.error("Error fetching vendors:", error);
        toast.error("Failed to load vendors. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (decryptedUID) {
      fetchAllVendors();
    }
  }, [decryptedUID, vendorsPerPage]);

  // Calculate statistics
  const calculateStats = (vendorData) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const stats = vendorData.reduce(
      (acc, vendor) => {
        acc.totalVendors += 1;

        // Vendor status stats
        if (vendor.user_status === 0) {
          acc.activeVendors += 1;
        } else {
          acc.inactiveVendors += 1;
        }

        // Document verification stats
        if (vendor.all_documents_status === 1) {
          acc.fullyVerified += 1;
        } else if (vendor.all_documents_status === 0) {
          acc.pendingVerification += 1;
        } else {
          acc.rejectedDocuments += 1;
        }

        // Recently joined vendors (last 30 days)
        const createdDate = new Date(vendor.created_at);
        if (createdDate >= thirtyDaysAgo) {
          acc.recentlyJoined += 1;
        }

        return acc;
      },
      {
        totalVendors: 0,
        activeVendors: 0,
        inactiveVendors: 0,
        pendingVerification: 0,
        fullyVerified: 0,
        rejectedDocuments: 0,
        recentlyJoined: 0,
      }
    );

    setStats(stats);
  };

  // Handle search and filtering
  useEffect(() => {
    let results = [...vendors];

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        (vendor) =>
          vendor.vid?.toString().includes(query) ||
          vendor.name?.toLowerCase().includes(query) ||
          vendor.phone_number?.includes(query) ||
          vendor.email?.toLowerCase().includes(query) ||
          vendor.firm_name?.toLowerCase().includes(query)
      );
    }

    // Apply filters
    if (filters.vendorStatus !== null) {
      results = results.filter(
        (vendor) => vendor.user_status === filters.vendorStatus
      );
    }

    if (filters.verificationStatus !== null) {
      results = results.filter(
        (vendor) => vendor.all_documents_status === filters.verificationStatus
      );
    }

    if (filters.dateRange.start && filters.dateRange.end) {
      const startDate = new Date(filters.dateRange.start);
      const endDate = new Date(filters.dateRange.end);
      endDate.setHours(23, 59, 59, 999); // Include the entire end day

      results = results.filter((vendor) => {
        // Using registration date or last update date
        const vendorDate = new Date(vendor.created_at);
        return vendorDate >= startDate && vendorDate <= endDate;
      });
    }

    // Apply sorting
    results.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });

    setFilteredVendors(results);
    setTotalPages(Math.ceil(results.length / vendorsPerPage));
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchQuery, filters, vendors, vendorsPerPage, sortConfig]);

  // Reset filters
  const resetFilters = () => {
    setFilters({
      vendorStatus: null,
      verificationStatus: null,
      dateRange: {
        start: null,
        end: null,
      },
    });
    setSearchQuery("");
    setFilterOpen(false);
  };

  // Toggle vendor details expansion
  const toggleVendorExpansion = (vendorId) => {
    setExpandedVendor(expandedVendor === vendorId ? null : vendorId);
  };

  // Open vendor details modal
  const openVendorDetails = (vendor) => {
    setSelectedVendor(vendor);
    setShowDetailModal(true);
  };

  // Open status update modal
  const openStatusModal = (vendor) => {
    setSelectedVendor(vendor);
    setNewStatus(vendor.user_status);
    setShowStatusModal(true);
  };

  // Open delete confirmation modal
  const openDeleteModal = (vendor) => {
    setSelectedVendor(vendor);
    setShowDeleteModal(true);
  };

  // Update vendor status
  const updateVendorStatus = async () => {
    try {
      await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/admin/updateVendorStatus`,
        {
          decryptedUID,
          vid: selectedVendor.vid,
          user_status: newStatus,
        }
      );

      toast.success(
        `Vendor #${selectedVendor.vid} status updated to ${vendorStatusMap[newStatus].label}`
      );

      // Update vendors list
      const updatedVendors = vendors.map((vendor) => {
        if (vendor.vid === selectedVendor.vid) {
          return { ...vendor, user_status: newStatus };
        }
        return vendor;
      });

      setVendors(updatedVendors);
      setFilteredVendors(updatedVendors);
      calculateStats(updatedVendors);

      setShowStatusModal(false);
    } catch (error) {
      console.error("Error updating vendor status:", error);
      toast.error("Failed to update vendor status. Please try again.");
    }
  };

  // Delete vendor
  const deleteVendor = async () => {
    try {
      await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/admin/deleteVendor`,
        {
          decryptedUID,
          vid: selectedVendor.vid,
          vendor_uid: selectedVendor.uid,
        }
      );

      toast.success(`Vendor #${selectedVendor.vid} has been deleted`);

      // Update vendors list
      const updatedVendors = vendors.filter(
        (vendor) => vendor.vid !== selectedVendor.vid
      );
      setVendors(updatedVendors);
      setFilteredVendors(updatedVendors);
      calculateStats(updatedVendors);

      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting vendor:", error);
      toast.error("Failed to delete vendor. Please try again.");
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
  const goToDocumentVerification = (vendor) => {
    navigate(`/admin-vendor-verification?uid=${uid}&vid=${vendor.vid}`);
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
        `${process.env.REACT_APP_BASE_URL}/admin/getAllVendors`,
        {
          decryptedUID,
        }
      );

      if (response.data && Array.isArray(response.data)) {
        setVendors(response.data);
        setFilteredVendors(response.data);
        calculateStats(response.data);
        setTotalPages(Math.ceil(response.data.length / vendorsPerPage));
        toast.success("Data refreshed successfully");
      }
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast.error("Failed to refresh data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Export vendor data to CSV
  const exportToCSV = () => {
    const headers = [
      "Vendor ID",
      "User ID",
      "Name",
      "Firm Name",
      "Phone",
      "Email",
      "Status",
      "Document Status",
      "Registration Date",
      "Last Updated",
    ];

    const csvData = filteredVendors.map((vendor) => [
      vendor.vid,
      vendor.uid,
      vendor.name || "N/A",
      vendor.firm_name || "N/A",
      vendor.phone_number || "N/A",
      vendor.email || "N/A",
      vendorStatusMap[vendor.user_status]?.label || "Unknown",
      vendor.all_documents_status === 1
        ? "Verified"
        : vendor.all_documents_status === 0
        ? "Pending"
        : "Rejected",
      formatDate(vendor.created_at),
      formatDate(vendor.updated_at),
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
      `vendors-data-${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Vendor data exported successfully");
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
  const paginatedVendors = filteredVendors.slice(
    (currentPage - 1) * vendorsPerPage,
    currentPage * vendorsPerPage
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
                Vendor Management
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
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Total Vendors
                </span>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalVendors}
                </div>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Store className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-xs">
              <div className="flex items-center text-green-500">
                <span className="font-medium">Active:</span>
                <span className="ml-1">{stats.activeVendors}</span>
              </div>
              <div className="flex items-center text-red-500 ml-4">
                <span className="font-medium">Inactive:</span>
                <span className="ml-1">{stats.inactiveVendors}</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Document Verification
                </span>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.fullyVerified}
                </div>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <FileCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-1 text-xs">
              <div className="text-yellow-500">
                <span className="font-medium">Pending:</span>{" "}
                {stats.pendingVerification}
              </div>
              <div className="text-red-500">
                <span className="font-medium">Rejected:</span>{" "}
                {stats.rejectedDocuments}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Recently Joined
                </span>
                <div className="text-2xl font-bold text-purple-500 dark:text-purple-400">
                  {stats.recentlyJoined}
                </div>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-purple-500 dark:text-purple-400" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-xs">
              <div className="text-purple-500">
                <span className="font-medium">New vendors in last 30 days</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Verification Rate
                </span>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {stats.totalVendors > 0
                    ? `${Math.round(
                        (stats.fullyVerified / stats.totalVendors) * 100
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
                <span className="font-medium">Fully verified vendors</span>
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
                placeholder="Search by ID, name, firm, phone or email"
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
                      Vendor Status
                    </label>
                    <select
                      value={
                        filters.vendorStatus === null
                          ? ""
                          : filters.vendorStatus
                      }
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          vendorStatus:
                            e.target.value === ""
                              ? null
                              : Number.parseInt(e.target.value),
                        })
                      }
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">All Statuses</option>
                      {Object.entries(vendorStatusMap).map(
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

        {/* Vendor List */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredVendors.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 text-center">
            <div className="flex justify-center mb-4">
              <AlertCircle className="h-16 w-16 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No vendors found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {searchQuery ||
              Object.values(filters).some((val) => val !== null && val !== "")
                ? "Try adjusting your search or filters to see more results."
                : "There are no vendors in the system yet."}
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
                        onClick={() => requestSort("vid")}
                      >
                        <div className="flex items-center">
                          Vendor ID
                          <ArrowUpDown className="ml-1 h-4 w-4" />
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                        onClick={() => requestSort("name")}
                      >
                        <div className="flex items-center">
                          Vendor
                          <ArrowUpDown className="ml-1 h-4 w-4" />
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                        onClick={() => requestSort("firm_name")}
                      >
                        <div className="flex items-center">
                          Firm Name
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
                    {paginatedVendors.map((vendor) => {
                      const vendorStatusInfo =
                        vendorStatusMap[vendor.user_status] ||
                        vendorStatusMap[0];
                      const verificationStatusInfo =
                        verificationStatusMap[vendor.all_documents_status] ||
                        verificationStatusMap[0];
                      const StatusIcon = vendorStatusInfo.icon;
                      const VerificationIcon = verificationStatusInfo.icon;

                      return (
                        <tr
                          key={vendor.vid}
                          className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors cursor-pointer"
                          onClick={() => toggleVendorExpansion(vendor.vid)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              #{vendor.vid}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              UID: {vendor.uid}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                                {vendor.profilePhoto ? (
                                  <img
                                    src={
                                      vendor.profilePhoto || "/placeholder.svg"
                                    }
                                    alt={vendor.name || "Vendor"}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {vendor.name || "N/A"}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  Joined:{" "}
                                  {formatDate(vendor.created_at).split("•")[0]}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {vendor.firm_name || "N/A"}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 dark:text-white flex items-center">
                              <Phone className="h-4 w-4 mr-1 text-gray-500" />
                              {vendor.phone_number || "N/A"}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                              <Mail className="h-4 w-4 mr-1 text-gray-500" />
                              {vendor.email || "N/A"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${vendorStatusInfo.color}`}
                            >
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {vendorStatusInfo.label}
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
                                  openVendorDetails(vendor);
                                }}
                                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                title="View Details"
                              >
                                <Eye className="h-5 w-5" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  goToDocumentVerification(vendor);
                                }}
                                className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                                title="Verify Documents"
                              >
                                <FileCheck className="h-5 w-5" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openStatusModal(vendor);
                                }}
                                className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300"
                                title="Update Status"
                              >
                                <Edit className="h-5 w-5" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openDeleteModal(vendor);
                                }}
                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                title="Delete Vendor"
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

              {/* Expanded vendor details */}
              <AnimatePresence>
                {expandedVendor && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden border-t border-gray-200 dark:border-gray-700"
                  >
                    {paginatedVendors.map((vendor) => {
                      if (vendor.vid === expandedVendor) {
                        return (
                          <div
                            key={`expanded-${vendor.vid}`}
                            className="p-4 bg-gray-50 dark:bg-gray-850"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                                  Vendor Information
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
                                        {vendor.name || "Not specified"}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex items-start">
                                    <div className="h-6 w-6 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mr-3 mt-1">
                                      <Building className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <div>
                                      <span className="text-sm text-gray-500 dark:text-gray-400">
                                        Firm Name
                                      </span>
                                      <p className="text-gray-900 dark:text-white">
                                        {vendor.firm_name || "Not specified"}
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
                                        {vendor.phone_number || "Not specified"}
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
                                        {vendor.email || "Not specified"}
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
                                        {formatDate(vendor.created_at)}
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
                                          vendor.all_documents_status
                                        ]?.color.replace("bg-", "text-")}`}
                                      >
                                        {verificationStatusMap[
                                          vendor.all_documents_status
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
                                            vendor.aadharFrontStatus
                                          ]?.color.replace("bg-", "text-")}`}
                                        >
                                          {verificationStatusMap[
                                            vendor.aadharFrontStatus
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
                                            vendor.panCardFrontStatus
                                          ]?.color.replace("bg-", "text-")}`}
                                        >
                                          {verificationStatusMap[
                                            vendor.panCardFrontStatus
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
                                          Udyam Aadhar
                                        </span>
                                        <p
                                          className={`text-sm font-medium ${verificationStatusMap[
                                            vendor.udyamAadharStatus
                                          ]?.color.replace("bg-", "text-")}`}
                                        >
                                          {verificationStatusMap[
                                            vendor.udyamAadharStatus
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
                                          Ghumasta License
                                        </span>
                                        <p
                                          className={`text-sm font-medium ${verificationStatusMap[
                                            vendor.ghumastaLicenseStatus
                                          ]?.color.replace("bg-", "text-")}`}
                                        >
                                          {verificationStatusMap[
                                            vendor.ghumastaLicenseStatus
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
                                onClick={() => goToDocumentVerification(vendor)}
                                className="flex items-center px-4 py-2 bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/50 text-green-800 dark:text-green-300 rounded-lg transition-colors"
                              >
                                <FileCheck className="h-4 w-4 mr-2" />
                                <span>Verify Documents</span>
                              </button>

                              <button
                                onClick={() => openStatusModal(vendor)}
                                className="flex items-center px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 hover:bg-yellow-200 dark:hover:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300 rounded-lg transition-colors"
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                <span>Update Status</span>
                              </button>

                              <button
                                onClick={() => openVendorDetails(vendor)}
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
                          {(currentPage - 1) * vendorsPerPage + 1}
                        </span>{" "}
                        to{" "}
                        <span className="font-medium">
                          {Math.min(
                            currentPage * vendorsPerPage,
                            filteredVendors.length
                          )}
                        </span>{" "}
                        of{" "}
                        <span className="font-medium">
                          {filteredVendors.length}
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

      {/* Vendor Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedVendor && (
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
                  Vendor Details
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
                      {selectedVendor.profilePhoto ? (
                        <img
                          src={
                            selectedVendor.profilePhoto || "/placeholder.svg"
                          }
                          alt={selectedVendor.name || "Vendor"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <User className="h-16 w-16 text-gray-500 dark:text-gray-400" />
                      )}
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white text-center">
                      {selectedVendor.name || "Vendor"}
                    </h2>

                    <div className="mt-2 flex items-center">
                      {(() => {
                        const StatusIcon =
                          vendorStatusMap[selectedVendor.user_status]?.icon;
                        return (
                          <>
                            {StatusIcon && (
                              <StatusIcon className="h-3 w-3 mr-1" />
                            )}
                            <div
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                vendorStatusMap[selectedVendor.user_status]
                                  ?.color
                              }`}
                            >
                              {vendorStatusMap[selectedVendor.user_status]
                                ?.label || "Unknown"}
                            </div>
                          </>
                        );
                      })()}
                    </div>
                    <div className="mt-4 w-full">
                      <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Vendor ID
                          </span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            #{selectedVendor.vid}
                          </span>
                        </div>

                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            User ID
                          </span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            #{selectedVendor.uid}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Joined
                          </span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {
                              formatDate(selectedVendor.created_at).split(
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
                          Business Information
                        </h3>

                        <div className="space-y-4">
                          <div className="flex items-start">
                            <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mr-3 mt-1">
                              <Building className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div>
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                Firm Name
                              </span>
                              <p className="text-gray-900 dark:text-white">
                                {selectedVendor.firm_name || "Not specified"}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start">
                            <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3 mt-1">
                              <Phone className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                Phone Number
                              </span>
                              <p className="text-gray-900 dark:text-white">
                                {selectedVendor.phone_number || "Not specified"}
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
                                {selectedVendor.email || "Not specified"}
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
                                {selectedVendor.address || "Not specified"}
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
                                  selectedVendor.all_documents_status
                                ]?.color.replace("bg-", "text-")}`}
                              >
                                {verificationStatusMap[
                                  selectedVendor.all_documents_status
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
                                  Aadhar Card (Front)
                                </span>
                                <span
                                  className={verificationStatusMap[
                                    selectedVendor.aadharFrontStatus
                                  ]?.color.replace("bg-", "text-")}
                                >
                                  {
                                    verificationStatusMap[
                                      selectedVendor.aadharFrontStatus
                                    ]?.label
                                  }
                                </span>
                              </div>

                              <div className="flex justify-between">
                                <span className="text-gray-500 dark:text-gray-400">
                                  Aadhar Card (Back)
                                </span>
                                <span
                                  className={verificationStatusMap[
                                    selectedVendor.aadharBackStatus
                                  ]?.color.replace("bg-", "text-")}
                                >
                                  {
                                    verificationStatusMap[
                                      selectedVendor.aadharBackStatus
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
                                    selectedVendor.panCardFrontStatus
                                  ]?.color.replace("bg-", "text-")}
                                >
                                  {
                                    verificationStatusMap[
                                      selectedVendor.panCardFrontStatus
                                    ]?.label
                                  }
                                </span>
                              </div>

                              <div className="flex justify-between">
                                <span className="text-gray-500 dark:text-gray-400">
                                  Profile Photo
                                </span>
                                <span
                                  className={verificationStatusMap[
                                    selectedVendor.profilePhotoStatus
                                  ]?.color.replace("bg-", "text-")}
                                >
                                  {
                                    verificationStatusMap[
                                      selectedVendor.profilePhotoStatus
                                    ]?.label
                                  }
                                </span>
                              </div>

                              <div className="flex justify-between">
                                <span className="text-gray-500 dark:text-gray-400">
                                  Udyam Aadhar
                                </span>
                                <span
                                  className={verificationStatusMap[
                                    selectedVendor.udyamAadharStatus
                                  ]?.color.replace("bg-", "text-")}
                                >
                                  {
                                    verificationStatusMap[
                                      selectedVendor.udyamAadharStatus
                                    ]?.label
                                  }
                                </span>
                              </div>

                              <div className="flex justify-between">
                                <span className="text-gray-500 dark:text-gray-400">
                                  Ghumasta License
                                </span>
                                <span
                                  className={verificationStatusMap[
                                    selectedVendor.ghumastaLicenseStatus
                                  ]?.color.replace("bg-", "text-")}
                                >
                                  {
                                    verificationStatusMap[
                                      selectedVendor.ghumastaLicenseStatus
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
                        Registration Information
                      </h3>

                      <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-start">
                            <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3 mt-1">
                              <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                Registration Date
                              </span>
                              <p className="text-gray-900 dark:text-white">
                                {formatDate(selectedVendor.created_at)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start">
                            <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3 mt-1">
                              <Clock className="h-4 w-4 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                Last Updated
                              </span>
                              <p className="text-gray-900 dark:text-white">
                                {formatDate(selectedVendor.updated_at)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start">
                            <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mr-3 mt-1">
                              <Briefcase className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                Business Type
                              </span>
                              <p className="text-gray-900 dark:text-white">
                                {selectedVendor.business_type ||
                                  "Not specified"}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start">
                            <div className="h-8 w-8 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center mr-3 mt-1">
                              <CreditCard className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                            </div>
                            <div>
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                Payment Information
                              </span>
                              <p className="text-gray-900 dark:text-white">
                                {selectedVendor.payment_info || "Not specified"}
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
                    {selectedVendor.aadharFrontRejectReason && (
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
                              {selectedVendor.aadharFrontRejectReason}
                            </p>
                            <p className="text-xs text-red-600 dark:text-red-500 mt-1">
                              {formatDate(
                                selectedVendor.aadharFrontReason_updated_at
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedVendor.aadharBackRejectReason && (
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
                              {selectedVendor.aadharBackRejectReason}
                            </p>
                            <p className="text-xs text-red-600 dark:text-red-500 mt-1">
                              {formatDate(
                                selectedVendor.aadharBackReason_updated_at
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedVendor.panCardFrontRejectReason && (
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
                              {selectedVendor.panCardFrontRejectReason}
                            </p>
                            <p className="text-xs text-red-600 dark:text-red-500 mt-1">
                              {formatDate(
                                selectedVendor.panCardFrontReason_updated_at
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedVendor.profilePhotoRejectReason && (
                      <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-lg p-3">
                        <div className="flex items-start">
                          <div className="h-6 w-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mr-3 mt-1">
                            <XCircle className="h-3 w-3 text-red-600 dark:text-red-400" />
                          </div>
                          <div>
                            <span className="text-sm font-medium text-red-800 dark:text-red-300">
                              Profile Photo Rejected
                            </span>
                            <p className="text-sm text-red-700 dark:text-red-400">
                              {selectedVendor.profilePhotoRejectReason}
                            </p>
                            <p className="text-xs text-red-600 dark:text-red-500 mt-1">
                              {formatDate(
                                selectedVendor.profilePhotoReason_updated_at
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedVendor.udyamAadharRejectReason && (
                      <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-lg p-3">
                        <div className="flex items-start">
                          <div className="h-6 w-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mr-3 mt-1">
                            <XCircle className="h-3 w-3 text-red-600 dark:text-red-400" />
                          </div>
                          <div>
                            <span className="text-sm font-medium text-red-800 dark:text-red-300">
                              Udyam Aadhar Rejected
                            </span>
                            <p className="text-sm text-red-700 dark:text-red-400">
                              {selectedVendor.udyamAadharRejectReason}
                            </p>
                            <p className="text-xs text-red-600 dark:text-red-500 mt-1">
                              {formatDate(
                                selectedVendor.udyamAadharReason_updated_at
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedVendor.ghumastaLicenseRejectReason && (
                      <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-lg p-3">
                        <div className="flex items-start">
                          <div className="h-6 w-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mr-3 mt-1">
                            <XCircle className="h-3 w-3 text-red-600 dark:text-red-400" />
                          </div>
                          <div>
                            <span className="text-sm font-medium text-red-800 dark:text-red-300">
                              Ghumasta License Rejected
                            </span>
                            <p className="text-sm text-red-700 dark:text-red-400">
                              {selectedVendor.ghumastaLicenseRejectReason}
                            </p>
                            <p className="text-xs text-red-600 dark:text-red-500 mt-1">
                              {formatDate(
                                selectedVendor.ghumastaLicenseReason_updated_at
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {!selectedVendor.aadharFrontRejectReason &&
                      !selectedVendor.aadharBackRejectReason &&
                      !selectedVendor.panCardFrontRejectReason &&
                      !selectedVendor.profilePhotoRejectReason &&
                      !selectedVendor.udyamAadharRejectReason &&
                      !selectedVendor.ghumastaLicenseRejectReason && (
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
                    goToDocumentVerification(selectedVendor);
                  }}
                  className="flex items-center px-4 py-2 bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/50 text-green-800 dark:text-green-300 rounded-lg transition-colors mr-3"
                >
                  <FileCheck className="h-4 w-4 mr-2" />
                  <span>Verify Documents</span>
                </button>

                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    openStatusModal(selectedVendor);
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
        {showStatusModal && selectedVendor && (
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
                  Update Vendor Status
                </h3>

                <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
                  Change the status for vendor #{selectedVendor.vid}
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
                    {Object.entries(vendorStatusMap).map(
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
                    onClick={updateVendorStatus}
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
        {showDeleteModal && selectedVendor && (
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
                  Delete Vendor
                </h3>

                <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
                  Are you sure you want to delete vendor #{selectedVendor.vid}?
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
                    onClick={deleteVendor}
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

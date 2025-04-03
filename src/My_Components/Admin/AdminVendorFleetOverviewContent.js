import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  TrendingUp,
  Calendar,
  DollarSign,
  CreditCard,
  Truck,
  FileCheck,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Wallet,
  CheckCircle,
  XCircle,
  BarChart3,
  PieChart,
  LineChart,
  Users,
  ArrowLeft,
  Download,
  Search,
  Eye,
  AlertCircle,
} from "lucide-react";
import axiosInstance from "../../API/axiosInstance";
import secureLocalStorage from "react-secure-storage";
import toast from "react-hot-toast";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from "recharts";

const AdminVendorFleetOverview = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [timeRange, setTimeRange] = useState("month"); // day, week, month, year
  const [stats, setStats] = useState({
    totalVendors: 0,
    activeVendors: 0,
    pendingVendors: 0,
    totalBookings: 0,
    totalRevenue: 0,
    revenueChange: 0,
    bookingsChange: 0,
  });
  const [revenueData, setRevenueData] = useState([]);
  const [bookingData, setBookingData] = useState([]);
  const [paymentMethodData, setPaymentMethodData] = useState([]);
  const [topVendors, setTopVendors] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [vendorsList, setVendorsList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "revenue",
    direction: "descending",
  });
  const [isExporting, setIsExporting] = useState(false);
  const [documentStats, setDocumentStats] = useState({
    verified: 0,
    pending: 0,
    rejected: 0,
  });
  const [error, setError] = useState(null);

  // Get admin UID from secure storage
  const uid = localStorage.getItem("@secure.n.uid");
  const decryptedUID = secureLocalStorage.getItem("uid");

  // Fetch dashboard data
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosInstance.post(
          `${process.env.REACT_APP_BASE_URL}/admin/getVendorFleetStats`,
          { decryptedUID, timeRange }
        );

        if (res.status === 200) {
          console.log("📊 Stats response:", res.data[0]);
          setStats(res.data[0]); // Extract first object from the array
        }
      } catch (error) {
        console.error("❌ Error fetching stats:", error);
        toast.error("Failed to load stats");
      }
    };

    const fetchRevenue = async () => {
      try {
        const res = await axiosInstance.post(
          `${process.env.REACT_APP_BASE_URL}/admin/getVendorRevenueTrend`,
          { decryptedUID, timeRange }
        );

        if (res.status === 200) {
          console.log("Revenue response:", res.data);

          // Ensure revenue is a number
          const formattedData = res.data.map((item) => ({
            period: item.period, // Keep period as string
            revenue: Number(item.revenue) || 0, // Convert revenue to number
          }));

          setRevenueData(formattedData);
        }
      } catch (error) {
        console.error("Error fetching revenue data:", error);
        toast.error("Failed to load revenue data");
      }
    };

    const fetchBookings = async () => {
      try {
        const res = await axiosInstance.post(
          `${process.env.REACT_APP_BASE_URL}/admin/getVendorBookingTrend`,
          { decryptedUID, timeRange }
        );

        if (res.status === 200) {
          const formattedData = res.data.map((item) => ({
            name: new Date(item.bookingDate).toLocaleDateString("en-GB"), // Format date as DD/MM/YYYY
            bookings: item.totalBookings,
          }));

          setBookingData(formattedData);
        }
      } catch (error) {
        console.error("Error fetching booking data:", error);
        toast.error("Failed to load booking data");
      }
    };


    const fetchPaymentMethods = async () => {
      try {
        const res = await axiosInstance.post(
          `${process.env.REACT_APP_BASE_URL}/admin/getPaymentMethodDistribution`,
          { decryptedUID, timeRange }
        );
        if (res.status === 200) {
          setPaymentMethodData(res.data)
        };
      } catch (error) {
        console.error("Error fetching payment methods:", error);
        toast.error("Failed to load payment methods");
      }
    };

    const fetchTopVendors = async () => {
      try {
        const res = await axiosInstance.post(
          `${process.env.REACT_APP_BASE_URL}/admin/getTopVendors`,
          { decryptedUID, limit: 5 }
        );
        if (res.status === 200) setTopVendors(res.data);
      } catch (error) {
        console.error("Error fetching top vendors:", error);
        toast.error("Failed to load top vendors");
      }
    };

    const fetchTransactions = async () => {
      try {
        const res = await axiosInstance.post(
          `${process.env.REACT_APP_BASE_URL}/admin/getRecentVendorTransactions`,
          { decryptedUID, limit: 5 }
        );
        if (res.status === 200) setRecentTransactions(res.data);
      } catch (error) {
        console.error("Error fetching recent transactions:", error);
        toast.error("Failed to load transactions");
      }
    };

    const fetchVendorsList = async () => {
      try {
        const res = await axiosInstance.post(
          `${process.env.REACT_APP_BASE_URL}/admin/getFleetAllVendors`,
          { decryptedUID }
        );
        if (res.status === 200) setVendorsList(res.data);
      } catch (error) {
        console.error("Error fetching vendors list:", error);
        toast.error("Failed to load vendors list");
      }
    };

    const fetchDocumentStats = async () => {
      try {
        const res = await axiosInstance.post(
          `${process.env.REACT_APP_BASE_URL}/admin/getDocumentVerificationStats`,
          { decryptedUID }
        );
        if (res.status === 200) setDocumentStats(res.data);
      } catch (error) {
        console.error("Error fetching document stats:", error);
        toast.error("Failed to load document stats");
      }
    };

    fetchStats();
    fetchRevenue();
    fetchBookings();
    fetchPaymentMethods();
    fetchTopVendors();
    fetchTransactions();
    fetchVendorsList();
    fetchDocumentStats();
  }, [decryptedUID, timeRange]);

  // Handle export data
  const handleExportData = async () => {
    setIsExporting(true);
    try {
      const response = await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/admin/exportVendorData`,
        {
          decryptedUID,
          timeRange,
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
          `vendor_fleet_data_${new Date().toISOString().split("T")[0]}.csv`
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

  // Handle sorting
  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Navigate to vendor details
  const viewVendorDetails = (vendorId) => {
    navigate(`/admin-vendor-verification?uid=${uid}&vid=${vendorId}`);
  };

  // Navigate back to admin dashboard
  const goToDashboard = () => {
    navigate(`/admindashboard?uid=${uid}`);
  };

  // Filtered and sorted vendors list
  const filteredVendors = useMemo(() => {
    let filtered = [...vendorsList];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (vendor) =>
          vendor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vendor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vendor.firm_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vendor.phone_number?.includes(searchTerm)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });

    return filtered;
  }, [vendorsList, searchTerm, sortConfig]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  // Get payment method name
  const getPaymentMethodName = (code) => {
    switch (code) {
      case 1:
        return "Cash";
      case 2:
        return "UPI/Online";
      case 3:
        return "Card";
      default:
        return "Unknown";
    }
  };

  // Get document status badge
  const getDocumentStatusBadge = (status) => {
    switch (status) {
      case 1:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Verified
          </span>
        );
      case 2:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </span>
        );
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

  // Colors for charts
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

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
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={goToDashboard}
                className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Back to dashboard"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                Vendor Fleet Overview
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <button
                // onClick={fetchDashboardData}
                disabled={isLoading}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Refresh data"
              >
                <RefreshCw
                  className={`h-5 w-5 text-gray-600 ${isLoading ? "animate-spin" : ""
                    }`}
                />
              </button>
              <button
                onClick={handleExportData}
                disabled={isExporting}
                className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                {isExporting ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                <span>{isExporting ? "Exporting..." : "Export CSV"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Time Range Selector */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="inline-flex items-center rounded-md shadow-sm">
            <button
              onClick={() => setTimeRange("day")}
              className={`px-4 py-2 text-sm font-medium rounded-l-md border ${timeRange === "day"
                ? "bg-blue-50 text-blue-700 border-blue-300"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
            >
              Today
            </button>
            <button
              onClick={() => setTimeRange("week")}
              className={`px-4 py-2 text-sm font-medium border-t border-b ${timeRange === "week"
                ? "bg-blue-50 text-blue-700 border-blue-300"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
            >
              This Week
            </button>
            <button
              onClick={() => setTimeRange("month")}
              className={`px-4 py-2 text-sm font-medium border-t border-b ${timeRange === "month"
                ? "bg-blue-50 text-blue-700 border-blue-300"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
            >
              This Month
            </button>
            <button
              onClick={() => setTimeRange("year")}
              className={`px-4 py-2 text-sm font-medium rounded-r-md border ${timeRange === "year"
                ? "bg-blue-50 text-blue-700 border-blue-300"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
            >
              This Year
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center h-96">
            <div className="flex flex-col items-center">
              <RefreshCw className="h-12 w-12 text-blue-500 animate-spin mb-4" />
              <p className="text-lg text-gray-600">Loading dashboard data...</p>
            </div>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {/* Stats Cards */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                    <Users className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">
                      Total Vendors
                    </p>
                    <div className="flex items-baseline">
                      <h3 className="text-2xl font-semibold text-gray-900">
                        {stats.totalVendors}
                      </h3>
                      <span className="ml-2 text-sm font-medium text-green-600">
                        <ArrowUpRight className="inline h-4 w-4" />
                        {stats.totalVendors > 0
                          ? Math.round(
                            (stats.activeVendors / stats.totalVendors) * 100
                          )
                          : 0}
                        %
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Active</span>
                    <span className="text-xs font-medium text-gray-900">
                      {stats.activeVendors}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                    <div
                      className="bg-blue-600 h-1.5 rounded-full"
                      style={{
                        width: `${stats.totalVendors > 0
                          ? (stats.activeVendors / stats.totalVendors) * 100
                          : 0
                          }%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100 text-green-600">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">
                      Total Revenue
                    </p>
                    <div className="flex items-baseline">
                      <h3 className="text-2xl font-semibold text-gray-900">
                        {formatCurrency(stats.totalRevenue)}
                      </h3>
                      <span
                        className={`ml-2 text-sm font-medium ${stats.revenueChange >= 0
                          ? "text-green-600"
                          : "text-red-600"
                          }`}
                      >
                        {stats.revenueChange >= 0 ? (
                          <ArrowUpRight className="inline h-4 w-4" />
                        ) : (
                          <ArrowDownRight className="inline h-4 w-4" />
                        )}
                        {Math.abs(stats.revenueChange)}%
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Target</span>
                    <span className="text-xs font-medium text-gray-900">
                      {formatCurrency(stats.totalRevenue * 1.2)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                    <div
                      className="bg-green-600 h-1.5 rounded-full"
                      style={{
                        width: `${Math.min(
                          (stats.totalRevenue / (stats.totalRevenue * 1.2)) *
                          100,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">
                      Total Bookings
                    </p>
                    <div className="flex items-baseline">
                      <h3 className="text-2xl font-semibold text-gray-900">
                        {stats.totalBookings}
                      </h3>
                      <span
                        className={`ml-2 text-sm font-medium ${stats.bookingsChange >= 0
                          ? "text-green-600"
                          : "text-red-600"
                          }`}
                      >
                        {stats.bookingsChange >= 0 ? (
                          <ArrowUpRight className="inline h-4 w-4" />
                        ) : (
                          <ArrowDownRight className="inline h-4 w-4" />
                        )}
                        {Math.abs(stats.bookingsChange)}%
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      Avg. per vendor
                    </span>
                    <span className="text-xs font-medium text-gray-900">
                      {stats.activeVendors > 0
                        ? Math.round(stats.totalBookings / stats.activeVendors)
                        : 0}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                    <div
                      className="bg-purple-600 h-1.5 rounded-full"
                      style={{ width: "65%" }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                    <FileCheck className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">
                      Document Verification
                    </p>
                    <div className="flex items-baseline">
                      <h3 className="text-2xl font-semibold text-gray-900">
                        {documentStats.verified +
                          documentStats.pending +
                          documentStats.rejected}
                      </h3>
                      <span className="ml-2 text-sm font-medium text-green-600">
                        <CheckCircle className="inline h-4 w-4" />
                        {documentStats.verified}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      Verification Rate
                    </span>
                    <span className="text-xs font-medium text-gray-900">
                      {documentStats.verified +
                        documentStats.pending +
                        documentStats.rejected >
                        0
                        ? Math.round(
                          (documentStats.verified /
                            (documentStats.verified +
                              documentStats.pending +
                              documentStats.rejected)) *
                          100
                        )
                        : 0}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                    <div
                      className="bg-yellow-600 h-1.5 rounded-full"
                      style={{
                        width: `${documentStats.verified +
                          documentStats.pending +
                          documentStats.rejected >
                          0
                          ? (documentStats.verified /
                            (documentStats.verified +
                              documentStats.pending +
                              documentStats.rejected)) *
                          100
                          : 0
                          }%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Charts */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Revenue Trend */}
              <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Revenue Trend
                  </h3>
                  <div className="flex items-center space-x-2">
                    <LineChart className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-500">
                      {timeRange === "day"
                        ? "Today"
                        : timeRange === "week"
                          ? "This Week"
                          : timeRange === "month"
                            ? "This Month"
                            : "This Year"}
                    </span>
                  </div>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart
                      data={revenueData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="period" stroke="#6b7280" /> {/* ✅ Fixed Key */}
                      <YAxis
                        stroke="#6b7280"
                        tickFormatter={(value) => `₹${value.toLocaleString("en-IN")}`}
                      />
                      <Tooltip
                        formatter={(value) => [`₹${value.toLocaleString("en-IN")}`, "Revenue"]}
                        labelFormatter={(label) => `Period: ${label}`}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        activeDot={{ r: 8 }}
                        name="Revenue"
                      />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Payment Method Distribution */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Payment Methods
                  </h3>
                  <div className="flex items-center space-x-2">
                    <PieChart className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-500">Distribution</span>
                  </div>
                </div>
                <div className="h-80 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={paymentMethodData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {paymentMethodData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [`${value}`, "Count"]}
                      />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>

            {/* Booking Trend and Top Vendors */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Booking Trend */}
              <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Booking Trend
                  </h3>
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-500">
                      {timeRange === "day"
                        ? "Today"
                        : timeRange === "week"
                          ? "This Week"
                          : timeRange === "month"
                            ? "This Month"
                            : "This Year"}
                    </span>
                  </div>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={bookingData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip
                        formatter={(value) => [`${value}`, "Bookings"]}
                        labelFormatter={(label) => `Period: ${label}`}
                      />
                      <Legend />
                      <Bar dataKey="bookings" fill="#8884d8" name="Bookings" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Top Vendors */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Top Vendors
                  </h3>
                  <div className="flex items-center space-x-2">
                    <Truck className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-500">By Revenue</span>
                  </div>
                </div>
                <div className="space-y-4">
                  {topVendors.length > 0 ? (
                    topVendors.map((vendor, index) => (
                      <div key={vendor.vid} className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          {vendor.profilePhoto ? (
                            <img
                              src={vendor.profilePhoto || "/placeholder.svg"}
                              alt={vendor.name}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-gray-500 font-medium">
                              {index + 1}
                            </span>
                          )}
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="text-sm font-medium text-gray-900">
                                {vendor.name}
                              </h4>
                              <p className="text-xs text-gray-500">
                                {vendor.firm_name || "Individual Vendor"}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-900">
                                {formatCurrency(vendor.revenue)}
                              </p>
                              <p className="text-xs text-gray-500">
                                {vendor.bookings} bookings
                              </p>
                            </div>
                          </div>
                          <div className="mt-1 w-full bg-gray-200 rounded-full h-1.5">
                            <div
                              className="bg-blue-600 h-1.5 rounded-full"
                              style={{
                                width: `${topVendors[0].revenue > 0
                                  ? Math.round(
                                    (vendor.revenue /
                                      topVendors[0].revenue) *
                                    100
                                  )
                                  : 0
                                  }%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Truck className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">
                        No vendors found
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        No vendor data available for the selected time period.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Recent Transactions */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-lg shadow overflow-hidden"
            >
              <div className="px-6 py-5 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">
                    Recent Vendor Transactions
                  </h3>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-500">
                      Latest activity
                    </span>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Transaction ID
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Vendor
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Booking ID
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
                        Payment Method
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Date
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentTransactions.length > 0 ? (
                      recentTransactions.map((transaction) => (
                        <tr
                          key={transaction.txn_id}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            #{transaction.txn_id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                {transaction.vendor_profile ? (
                                  <img
                                    src={
                                      transaction.vendor_profile ||
                                      "/placeholder.svg"
                                    }
                                    alt={transaction.vendor_name}
                                    className="h-8 w-8 rounded-full object-cover"
                                  />
                                ) : (
                                  <Users className="h-4 w-4 text-gray-500" />
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {transaction.vendor_name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {transaction.vendor_firm || "Individual"}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            #{transaction.bid}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {formatCurrency(transaction.amount)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {transaction.payment_mode === 1 ? (
                                <DollarSign className="h-4 w-4 text-green-500 mr-1.5" />
                              ) : transaction.payment_mode === 2 ? (
                                <CreditCard className="h-4 w-4 text-blue-500 mr-1.5" />
                              ) : (
                                <Wallet className="h-4 w-4 text-purple-500 mr-1.5" />
                              )}
                              <span className="text-sm text-gray-900">
                                {getPaymentMethodName(transaction.payment_mode)}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(transaction.created_at)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {transaction.status === 1 ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Completed
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                <Clock className="w-3 h-3 mr-1" />
                                Pending
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={7}
                          className="px-6 py-10 text-center text-sm text-gray-500"
                        >
                          <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
                          <p className="mt-2 font-medium text-gray-900">
                            No transactions found
                          </p>
                          <p className="mt-1">
                            No vendor transactions available for the selected
                            time period.
                          </p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Vendor Search */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-lg shadow p-6"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Vendor Fleet
                </h3>
                <div className="relative w-full md:w-64">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Search vendors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {filteredVendors.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <Truck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No vendors found
                  </h3>
                  <p className="text-gray-500">
                    {searchTerm
                      ? "Try adjusting your search terms"
                      : "There are no vendors in the system yet"}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
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
                            <span>Vendor</span>
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
                            onClick={() => requestSort("firm_name")}
                            className="flex items-center space-x-1 hover:text-gray-700"
                          >
                            <span>Firm Name</span>
                            {sortConfig.key === "firm_name" &&
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
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          <button
                            onClick={() => requestSort("revenue")}
                            className="flex items-center space-x-1 hover:text-gray-700"
                          >
                            <span>Revenue</span>
                            {sortConfig.key === "revenue" &&
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
                            onClick={() => requestSort("all_documents_status")}
                            className="flex items-center space-x-1 hover:text-gray-700"
                          >
                            <span>Document Status</span>
                            {sortConfig.key === "all_documents_status" &&
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
                      {filteredVendors.map((vendor) => (
                        <tr key={vendor.vid} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                {vendor.profilePhoto ? (
                                  <img
                                    src={
                                      vendor.profilePhoto || "/placeholder.svg"
                                    }
                                    alt={vendor.name}
                                    className="h-10 w-10 rounded-full object-cover"
                                  />
                                ) : (
                                  <Users className="h-5 w-5 text-gray-500" />
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {vendor.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {formatDate(vendor.created_at)}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {vendor.firm_name || "Individual Vendor"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {vendor.bookings || 0}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(vendor.revenue || 0)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getDocumentStatusBadge(
                              vendor.all_documents_status
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => viewVendorDetails(vendor.vid)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Eye size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminVendorFleetOverview;

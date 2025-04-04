import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import secureLocalStorage from "react-secure-storage"
import axiosInstance from "../../API/axiosInstance"
import {
    ChevronDown,
    ChevronUp,
    ChevronLeft,
    ChevronRight,
    Calendar,
    DollarSign,
    CreditCard,
    Wallet,
    Download,
    Filter,
    Search,
    RefreshCw,
    ArrowUpDown,
    Users,
    Car,
    Building,
    Clock,
    CheckCircle,
    AlertCircle,
    X,
    Info,
} from "lucide-react"
import { format, parseISO, isValid, subDays, subMonths, startOfMonth, endOfMonth } from "date-fns"
import toast from "react-hot-toast"
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
} from "chart.js"
import { Pie, Line, Bar } from "react-chartjs-2"

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title)

// Payment mode mapping
const paymentModeMap = {
    0: { label: "Cash", icon: DollarSign, color: "text-green-500 bg-green-100" },
    1: { label: "UPI", icon: Wallet, color: "text-blue-500 bg-blue-100" },
    2: { label: "Credit Card", icon: CreditCard, color: "text-purple-500 bg-purple-100" },
}

// Transaction status mapping
const transactionStatusMap = {
    0: { label: "Pending", icon: Clock, color: "text-yellow-500 bg-yellow-100" },
    1: { label: "Completed", icon: CheckCircle, color: "text-green-500 bg-green-100" },
}

export default function AdminRevenueAnalytics() {
    const navigate = useNavigate()
    const uid = localStorage.getItem("@secure.n.uid")
    const decryptedUID = secureLocalStorage.getItem("uid")

    const [transactions, setTransactions] = useState([])
    const [wallets, setWallets] = useState([])
    const [filteredTransactions, setFilteredTransactions] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [filterOpen, setFilterOpen] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [transactionsPerPage] = useState(10)
    const [totalPages, setTotalPages] = useState(1)
    const [sortConfig, setSortConfig] = useState({ key: "txn_id", direction: "desc" })
    const [dateRange, setDateRange] = useState({
        start: format(subMonths(new Date(), 1), "yyyy-MM-dd"),
        end: format(new Date(), "yyyy-MM-dd"),
    })
    const [filters, setFilters] = useState({
        paymentMode: null,
        transactionStatus: null,
        transactionType: null, // "passenger", "vendor", "all"
    })
    const [activeTab, setActiveTab] = useState("overview")
    const [timeFrame, setTimeFrame] = useState("monthly")
    const [showInfoModal, setShowInfoModal] = useState(false)

    // Fetch transactions and wallet data
    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                setLoading(true);
                console.log("Fetching Transactions...");

                const response = await axiosInstance.post(
                    `${process.env.REACT_APP_BASE_URL}/admin/fetchAllTransactions`,
                    {
                        decryptedUID,

                    }
                );


                if (response.data.transactions && Array.isArray(response.data.transactions)) {
                    setTransactions(response.data.transactions);
                    setFilteredTransactions(response.data.transactions);
                    setTotalPages(Math.ceil(response.data.transactions.length / transactionsPerPage));
                }
            } catch (error) {
                console.error("Error fetching transactions:", error);
                toast.error("Failed to load transactions. Please try again.");
                setTransactions([]);
                setFilteredTransactions([]);
                setTotalPages(0);
            } finally {
                setLoading(false);
            }
        };

        const fetchWallets = async () => {
            try {
                setLoading(true);
                console.log("Fetching Wallets...");

                const response = await axiosInstance.post(
                    `${process.env.REACT_APP_BASE_URL}/admin/fetchAllWallets`,
                    {
                        decryptedUID,

                    }
                );

                console.log("Wallets Response:", response.data.wallets);
                if (response.data.wallets && Array.isArray(response.data.wallets)) {
                    setWallets(response.data.wallets);
                }
            } catch (error) {
                console.error("Error fetching wallets:", error);
                toast.error("Failed to load wallets. Please try again.");
                setWallets([]);
            } finally {
                setLoading(false);
            }
        };

        if (decryptedUID) {
            fetchTransactions();
            fetchWallets();
        }
    }, [decryptedUID, transactionsPerPage]);


    // Apply filters and search
    useEffect(() => {
        let results = [...transactions]

        // Apply search
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            results = results.filter(
                (transaction) =>
                    transaction.txn_id?.toString().includes(query) ||
                    transaction.pid?.toString().includes(query) ||
                    transaction.did?.toString().includes(query) ||
                    transaction.vid?.toString().includes(query) ||
                    transaction.bid?.toString().includes(query) ||
                    transaction.amount?.toString().includes(query),
            )
        }

        // Apply date range filter
        if (dateRange.start && dateRange.end) {
            const startDate = new Date(dateRange.start)
            const endDate = new Date(dateRange.end)
            endDate.setHours(23, 59, 59, 999) // Include the entire end day

            results = results.filter((transaction) => {
                const transactionDate = new Date(transaction.created_at)
                return transactionDate >= startDate && transactionDate <= endDate
            })
        }

        // Apply payment mode filter
        if (filters.paymentMode !== null) {
            results = results.filter((transaction) => transaction.payment_mode === filters.paymentMode)
        }

        // Apply transaction status filter
        if (filters.transactionStatus !== null) {
            results = results.filter((transaction) => transaction.status === filters.transactionStatus)
        }

        // Apply transaction type filter
        if (filters.transactionType === "passenger") {
            results = results.filter((transaction) => transaction.pid !== null && transaction.vid === null)
        } else if (filters.transactionType === "vendor") {
            results = results.filter((transaction) => transaction.vid !== null)
        }

        // Apply sorting
        results.sort((a, b) => {
            if (sortConfig.key === "created_at") {
                return sortConfig.direction === "asc"
                    ? new Date(a.created_at) - new Date(b.created_at)
                    : new Date(b.created_at) - new Date(a.created_at)
            }

            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === "asc" ? -1 : 1
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === "asc" ? 1 : -1
            }
            return 0
        })

        setFilteredTransactions(results)
        setTotalPages(Math.ceil(results.length / transactionsPerPage))
        setCurrentPage(1) // Reset to first page when filters change
    }, [searchQuery, dateRange, filters, transactions, transactionsPerPage, sortConfig])

    // Calculate revenue statistics
    const revenueStats = useMemo(() => {
        const stats = {
            totalRevenue: 0,
            adminRevenue: 0,
            driverRevenue: 0,
            vendorRevenue: 0,
            passengerBookings: 0,
            vendorBookings: 0,
            paymentMethods: {
                cash: 0,
                upi: 0,
                creditCard: 0,
            },
            monthlyRevenue: {},
            dailyRevenue: {},
        }

        // Process each transaction
        filteredTransactions.forEach((transaction) => {
            const amount = Number.parseFloat(transaction.amount)
            stats.totalRevenue += amount

            // Determine booking type and calculate revenue distribution
            if (transaction.vid !== null) {
                // Vendor booking: 90% driver, 4% vendor, 6% admin
                stats.driverRevenue += amount * 0.9
                stats.vendorRevenue += amount * 0.04
                stats.adminRevenue += amount * 0.06
                stats.vendorBookings += 1
            } else {
                // Passenger booking: 90% driver, 10% admin
                stats.driverRevenue += amount * 0.9
                stats.adminRevenue += amount * 0.1
                stats.passengerBookings += 1
            }

            // Count payment methods
            if (transaction.payment_mode === 1) {
                stats.paymentMethods.cash += amount
            } else if (transaction.payment_mode === 2) {
                stats.paymentMethods.upi += amount
            } else if (transaction.payment_mode === 3) {
                stats.paymentMethods.creditCard += amount
            }

            // Process for time-based charts
            const date = new Date(transaction.created_at)
            const monthKey = format(date, "MMM yyyy")
            const dayKey = format(date, "dd MMM")

            // Monthly data
            if (!stats.monthlyRevenue[monthKey]) {
                stats.monthlyRevenue[monthKey] = {
                    total: 0,
                    admin: 0,
                    driver: 0,
                    vendor: 0,
                }
            }
            stats.monthlyRevenue[monthKey].total += amount

            if (transaction.vid !== null) {
                stats.monthlyRevenue[monthKey].admin += amount * 0.06
                stats.monthlyRevenue[monthKey].driver += amount * 0.9
                stats.monthlyRevenue[monthKey].vendor += amount * 0.04
            } else {
                stats.monthlyRevenue[monthKey].admin += amount * 0.1
                stats.monthlyRevenue[monthKey].driver += amount * 0.9
                stats.monthlyRevenue[monthKey].vendor += 0
            }

            // Daily data
            if (!stats.dailyRevenue[dayKey]) {
                stats.dailyRevenue[dayKey] = {
                    total: 0,
                    admin: 0,
                    driver: 0,
                    vendor: 0,
                }
            }
            stats.dailyRevenue[dayKey].total += amount

            if (transaction.vid !== null) {
                stats.dailyRevenue[dayKey].admin += amount * 0.06
                stats.dailyRevenue[dayKey].driver += amount * 0.9
                stats.dailyRevenue[dayKey].vendor += amount * 0.04
            } else {
                stats.dailyRevenue[dayKey].admin += amount * 0.1
                stats.dailyRevenue[dayKey].driver += amount * 0.9
                stats.dailyRevenue[dayKey].vendor += 0
            }
        })

        return stats
    }, [filteredTransactions])

    // Prepare chart data
    const chartData = useMemo(() => {
        // Payment method distribution
        const paymentMethodData = {
            labels: ["Cash", "UPI", "Credit Card"],
            datasets: [
                {
                    data: [
                        revenueStats.paymentMethods.cash,
                        revenueStats.paymentMethods.upi,
                        revenueStats.paymentMethods.creditCard,
                    ],
                    backgroundColor: ["rgba(75, 192, 192, 0.6)", "rgba(54, 162, 235, 0.6)", "rgba(153, 102, 255, 0.6)"],
                    borderColor: ["rgba(75, 192, 192, 1)", "rgba(54, 162, 235, 1)", "rgba(153, 102, 255, 1)"],
                    borderWidth: 1,
                },
            ],
        }

        // Revenue distribution
        const revenueDistributionData = {
            labels: ["Admin", "Drivers", "Vendors"],
            datasets: [
                {
                    data: [revenueStats.adminRevenue, revenueStats.driverRevenue, revenueStats.vendorRevenue],
                    backgroundColor: ["rgba(255, 99, 132, 0.6)", "rgba(54, 162, 235, 0.6)", "rgba(255, 206, 86, 0.6)"],
                    borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)", "rgba(255, 206, 86, 1)"],
                    borderWidth: 1,
                },
            ],
        }

        // Booking type distribution
        const bookingTypeData = {
            labels: ["Passenger Bookings", "Vendor Bookings"],
            datasets: [
                {
                    data: [revenueStats.passengerBookings, revenueStats.vendorBookings],
                    backgroundColor: ["rgba(54, 162, 235, 0.6)", "rgba(255, 206, 86, 0.6)"],
                    borderColor: ["rgba(54, 162, 235, 1)", "rgba(255, 206, 86, 1)"],
                    borderWidth: 1,
                },
            ],
        }

        // Time series data
        let timeSeriesData
        let timeLabels
        let timeValues

        if (timeFrame === "monthly") {
            // Sort months chronologically
            timeLabels = Object.keys(revenueStats.monthlyRevenue).sort((a, b) => {
                return new Date(a) - new Date(b)
            })

            timeValues = {
                total: timeLabels.map((month) => revenueStats.monthlyRevenue[month].total),
                admin: timeLabels.map((month) => revenueStats.monthlyRevenue[month].admin),
                driver: timeLabels.map((month) => revenueStats.monthlyRevenue[month].driver),
                vendor: timeLabels.map((month) => revenueStats.monthlyRevenue[month].vendor),
            }
        } else {
            // Sort days chronologically
            timeLabels = Object.keys(revenueStats.dailyRevenue).sort((a, b) => {
                return new Date(`2025 ${a}`) - new Date(`2025 ${b}`)
            })

            timeValues = {
                total: timeLabels.map((day) => revenueStats.dailyRevenue[day].total),
                admin: timeLabels.map((day) => revenueStats.dailyRevenue[day].admin),
                driver: timeLabels.map((day) => revenueStats.dailyRevenue[day].driver),
                vendor: timeLabels.map((day) => revenueStats.dailyRevenue[day].vendor),
            }
        }

        timeSeriesData = {
            labels: timeLabels,
            datasets: [
                {
                    label: "Total Revenue",
                    data: timeValues.total,
                    borderColor: "rgba(75, 192, 192, 1)",
                    backgroundColor: "rgba(75, 192, 192, 0.2)",
                    tension: 0.4,
                    fill: true,
                },
                {
                    label: "Admin Revenue",
                    data: timeValues.admin,
                    borderColor: "rgba(255, 99, 132, 1)",
                    backgroundColor: "rgba(255, 99, 132, 0.2)",
                    tension: 0.4,
                    fill: true,
                },
                {
                    label: "Driver Revenue",
                    data: timeValues.driver,
                    borderColor: "rgba(54, 162, 235, 1)",
                    backgroundColor: "rgba(54, 162, 235, 0.2)",
                    tension: 0.4,
                    fill: true,
                },
                {
                    label: "Vendor Revenue",
                    data: timeValues.vendor,
                    borderColor: "rgba(255, 206, 86, 1)",
                    backgroundColor: "rgba(255, 206, 86, 0.2)",
                    tension: 0.4,
                    fill: true,
                },
            ],
        }

        return {
            paymentMethodData,
            revenueDistributionData,
            bookingTypeData,
            timeSeriesData,
        }
    }, [revenueStats, timeFrame])

    // Reset filters
    const resetFilters = () => {
        setFilters({
            paymentMode: null,
            transactionStatus: null,
            transactionType: null,
        })
        setDateRange({
            start: format(subMonths(new Date(), 1), "yyyy-MM-dd"),
            end: format(new Date(), "yyyy-MM-dd"),
        })
        setSearchQuery("")
        setFilterOpen(false)
    }

    // Handle sorting
    const requestSort = (key) => {
        let direction = "asc"
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc"
        }
        setSortConfig({ key, direction })
    }

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(amount)
    }

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return "N/A"
        try {
            const date = parseISO(dateString)
            if (!isValid(date)) return "Invalid Date"
            return format(date, "MMM dd, yyyy • h:mm a")
        } catch (error) {
            return "Invalid Date"
        }
    }

    // Set predefined date ranges
    const setDateRangePreset = (preset) => {
        const today = new Date()
        let start, end

        switch (preset) {
            case "today":
                start = format(today, "yyyy-MM-dd")
                end = format(today, "yyyy-MM-dd")
                break
            case "yesterday":
                start = format(subDays(today, 1), "yyyy-MM-dd")
                end = format(subDays(today, 1), "yyyy-MM-dd")
                break
            case "last7days":
                start = format(subDays(today, 6), "yyyy-MM-dd")
                end = format(today, "yyyy-MM-dd")
                break
            case "last30days":
                start = format(subDays(today, 29), "yyyy-MM-dd")
                end = format(today, "yyyy-MM-dd")
                break
            case "thisMonth":
                start = format(startOfMonth(today), "yyyy-MM-dd")
                end = format(today, "yyyy-MM-dd")
                break
            case "lastMonth":
                const lastMonth = subMonths(today, 1)
                start = format(startOfMonth(lastMonth), "yyyy-MM-dd")
                end = format(endOfMonth(lastMonth), "yyyy-MM-dd")
                break
            default:
                return
        }

        setDateRange({ start, end })
    }

    // Export data to CSV
    const exportToCSV = () => {
        const headers = [
            "Transaction ID",
            "Passenger ID",
            "Driver ID",
            "Vendor ID",
            "Booking ID",
            "Amount",
            "Status",
            "Payment Mode",
            "Date & Time",
            "Admin Revenue",
            "Driver Revenue",
            "Vendor Revenue",
        ]

        const csvData = filteredTransactions.map((transaction) => {
            const amount = Number.parseFloat(transaction.amount)
            let adminRevenue, driverRevenue, vendorRevenue

            if (transaction.vid !== null) {
                // Vendor booking: 90% driver, 4% vendor, 6% admin
                adminRevenue = amount * 0.06
                driverRevenue = amount * 0.9
                vendorRevenue = amount * 0.04
            } else {
                // Passenger booking: 90% driver, 10% admin
                adminRevenue = amount * 0.1
                driverRevenue = amount * 0.9
                vendorRevenue = 0
            }

            return [
                transaction.txn_id,
                transaction.pid || "N/A",
                transaction.did || "N/A",
                transaction.vid || "N/A",
                transaction.bid,
                transaction.amount,
                transactionStatusMap[transaction.status]?.label || "Unknown",
                paymentModeMap[transaction.payment_mode]?.label || "Unknown",
                formatDate(transaction.created_at),
                adminRevenue.toFixed(2),
                driverRevenue.toFixed(2),
                vendorRevenue.toFixed(2),
            ]
        })

        const csvContent = [
            headers.join(","),
            ...csvData.map((row) => row.map((cell) => `"${cell || ""}"`).join(",")),
        ].join("\n")

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.setAttribute("href", url)
        link.setAttribute("download", `revenue-data-${new Date().toISOString().split("T")[0]}.csv`)
        link.style.visibility = "hidden"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        toast.success("Revenue data exported successfully")
    }

    // Navigate back to admin dashboard
    const goToDashboard = () => {
        navigate(`/admindashboard?uid=${uid}`)
    }

    // Refresh data
    const refreshData = async () => {
        try {
            setLoading(true)

            const response = await axiosInstance.post(
                `${process.env.REACT_APP_BASE_URL}/admin/fetchAllTransactions`,
                {
                    decryptedUID,

                }
            );

            // Fetch wallets
            const walletsResponse = await axiosInstance.post(`${process.env.REACT_APP_BASE_URL}/admin/fetchAllWallets`, {
                decryptedUID,
            })

            if (response.data.transactions && Array.isArray(response.data.transactions)) {
                setTransactions(response.data.transactions)
                setFilteredTransactions(response.data.transactions)
                setTotalPages(Math.ceil(response.data.transactions.length / transactionsPerPage))
            }

            if (walletsResponse.data.wallets && Array.isArray(walletsResponse.data.wallets)) {
                setWallets(walletsResponse.data.wallets)
            }

            toast.success("Data refreshed successfully")
        } catch (error) {
            console.error("Error refreshing data:", error)
            toast.error("Failed to refresh data. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    // Pagination
    const paginatedTransactions = filteredTransactions.slice(
        (currentPage - 1) * transactionsPerPage,
        currentPage * transactionsPerPage,
    )

    if (!uid) {
        return (
            <div className="container text-center fw-bold p-5">
                <h2>INVALID URL. Please provide a valid UID.</h2>
                <button onClick={() => navigate("/")} className="btn btn-primary mt-3">
                    Back to Login
                </button>
            </div>
        )
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
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Revenue Analytics</h1>
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
                                <Download className="h-4 w-4 mr-2" />
                                <span>Export CSV</span>
                            </button>
                            <button
                                onClick={() => setShowInfoModal(true)}
                                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                aria-label="Revenue distribution info"
                            >
                                <Info className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Tabs */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm mb-6 overflow-hidden">
                    <div className="flex border-b border-gray-200 dark:border-gray-700">
                        <button
                            onClick={() => setActiveTab("overview")}
                            className={`flex-1 py-4 px-4 text-center font-medium text-sm sm:text-base transition-colors ${activeTab === "overview"
                                ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                                }`}
                        >
                            Overview
                        </button>
                        <button
                            onClick={() => setActiveTab("transactions")}
                            className={`flex-1 py-4 px-4 text-center font-medium text-sm sm:text-base transition-colors ${activeTab === "transactions"
                                ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                                }`}
                        >
                            Transactions
                        </button>
                        <button
                            onClick={() => setActiveTab("charts")}
                            className={`flex-1 py-4 px-4 text-center font-medium text-sm sm:text-base transition-colors ${activeTab === "charts"
                                ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                                }`}
                        >
                            Charts & Analytics
                        </button>
                        <button
                            onClick={() => setActiveTab("wallets")}
                            className={`flex-1 py-4 px-4 text-center font-medium text-sm sm:text-base transition-colors ${activeTab === "wallets"
                                ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                                }`}
                        >
                            Wallets
                        </button>
                    </div>
                </div>

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
                                <span className="text-sm text-gray-500 dark:text-gray-400">Total Revenue</span>
                                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {formatCurrency(revenueStats.totalRevenue)}
                                </div>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                <DollarSign className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                        <div className="mt-2 flex items-center text-xs">
                            <div className="flex items-center text-green-500">
                                <span className="font-medium">Transactions:</span>
                                <span className="ml-1">{filteredTransactions.length}</span>
                            </div>
                            <div className="flex items-center text-blue-500 ml-4">
                                <span className="font-medium">Avg. Value:</span>
                                <span className="ml-1">
                                    {formatCurrency(
                                        filteredTransactions.length > 0 ? revenueStats.totalRevenue / filteredTransactions.length : 0,
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="text-sm text-gray-500 dark:text-gray-400">Admin Revenue</span>
                                <div className="text-2xl font-bold text-red-500 dark:text-red-400">
                                    {formatCurrency(revenueStats.adminRevenue)}
                                </div>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                                <Building className="h-6 w-6 text-red-600 dark:text-red-400" />
                            </div>
                        </div>
                        <div className="mt-2 flex items-center text-xs">
                            <div className="text-gray-500">
                                <span className="font-medium">Share:</span>
                                <span className="ml-1">
                                    {revenueStats.totalRevenue > 0
                                        ? `${((revenueStats.adminRevenue / revenueStats.totalRevenue) * 100).toFixed(1)}%`
                                        : "0%"}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="text-sm text-gray-500 dark:text-gray-400">Driver Revenue</span>
                                <div className="text-2xl font-bold text-blue-500 dark:text-blue-400">
                                    {formatCurrency(revenueStats.driverRevenue)}
                                </div>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                <Car className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                        <div className="mt-2 flex items-center text-xs">
                            <div className="text-gray-500">
                                <span className="font-medium">Share:</span>
                                <span className="ml-1">
                                    {revenueStats.totalRevenue > 0
                                        ? `${((revenueStats.driverRevenue / revenueStats.totalRevenue) * 100).toFixed(1)}%`
                                        : "0%"}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="text-sm text-gray-500 dark:text-gray-400">Vendor Revenue</span>
                                <div className="text-2xl font-bold text-yellow-500 dark:text-yellow-400">
                                    {formatCurrency(revenueStats.vendorRevenue)}
                                </div>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                                <Users className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                            </div>
                        </div>
                        <div className="mt-2 flex items-center text-xs">
                            <div className="text-gray-500">
                                <span className="font-medium">Share:</span>
                                <span className="ml-1">
                                    {revenueStats.totalRevenue > 0
                                        ? `${((revenueStats.vendorRevenue / revenueStats.totalRevenue) * 100).toFixed(1)}%`
                                        : "0%"}
                                </span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Date Range Selector */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setDateRangePreset("today")}
                                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${dateRange.start === format(new Date(), "yyyy-MM-dd") &&
                                    dateRange.end === format(new Date(), "yyyy-MM-dd")
                                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
                                    : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                                    }`}
                            >
                                Today
                            </button>
                            <button
                                onClick={() => setDateRangePreset("yesterday")}
                                className="px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                            >
                                Yesterday
                            </button>
                            <button
                                onClick={() => setDateRangePreset("last7days")}
                                className="px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                            >
                                Last 7 Days
                            </button>
                            <button
                                onClick={() => setDateRangePreset("last30days")}
                                className="px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                            >
                                Last 30 Days
                            </button>
                            <button
                                onClick={() => setDateRangePreset("thisMonth")}
                                className="px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                            >
                                This Month
                            </button>
                            <button
                                onClick={() => setDateRangePreset("lastMonth")}
                                className="px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                            >
                                Last Month
                            </button>
                        </div>

                        <div className="flex items-center space-x-2">
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="date"
                                    value={dateRange.start}
                                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                                    className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                            <span className="text-gray-500">to</span>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="date"
                                    value={dateRange.end}
                                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                                    className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                    {activeTab === "overview" && (
                        <motion.div
                            key="overview"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                                {/* Revenue Distribution */}
                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Revenue Distribution</h3>
                                    <div className="h-64">
                                        <Pie data={chartData.revenueDistributionData} options={{ maintainAspectRatio: false }} />
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 mt-6">
                                        <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-3 text-center">
                                            <div className="text-xs text-gray-500 dark:text-gray-400">Admin</div>
                                            <div className="text-lg font-bold text-red-500 dark:text-red-400">
                                                {formatCurrency(revenueStats.adminRevenue)}
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                {revenueStats.totalRevenue > 0
                                                    ? `${((revenueStats.adminRevenue / revenueStats.totalRevenue) * 100).toFixed(1)}%`
                                                    : "0%"}
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-3 text-center">
                                            <div className="text-xs text-gray-500 dark:text-gray-400">Drivers</div>
                                            <div className="text-lg font-bold text-blue-500 dark:text-blue-400">
                                                {formatCurrency(revenueStats.driverRevenue)}
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                {revenueStats.totalRevenue > 0
                                                    ? `${((revenueStats.driverRevenue / revenueStats.totalRevenue) * 100).toFixed(1)}%`
                                                    : "0%"}
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-3 text-center">
                                            <div className="text-xs text-gray-500 dark:text-gray-400">Vendors</div>
                                            <div className="text-lg font-bold text-yellow-500 dark:text-yellow-400">
                                                {formatCurrency(revenueStats.vendorRevenue)}
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                {revenueStats.totalRevenue > 0
                                                    ? `${((revenueStats.vendorRevenue / revenueStats.totalRevenue) * 100).toFixed(1)}%`
                                                    : "0%"}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Methods */}
                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Payment Methods</h3>
                                    <div className="h-64">
                                        <Pie data={chartData.paymentMethodData} options={{ maintainAspectRatio: false }} />
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 mt-6">
                                        <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-3 text-center">
                                            <div className="text-xs text-gray-500 dark:text-gray-400">Cash</div>
                                            <div className="text-lg font-bold text-teal-500 dark:text-teal-400">
                                                {formatCurrency(revenueStats.paymentMethods.cash)}
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                {revenueStats.totalRevenue > 0
                                                    ? `${((revenueStats.paymentMethods.cash / revenueStats.totalRevenue) * 100).toFixed(1)}%`
                                                    : "0%"}
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-3 text-center">
                                            <div className="text-xs text-gray-500 dark:text-gray-400">UPI</div>
                                            <div className="text-lg font-bold text-blue-500 dark:text-blue-400">
                                                {formatCurrency(revenueStats.paymentMethods.upi)}
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                {revenueStats.totalRevenue > 0
                                                    ? `${((revenueStats.paymentMethods.upi / revenueStats.totalRevenue) * 100).toFixed(1)}%`
                                                    : "0%"}
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-3 text-center">
                                            <div className="text-xs text-gray-500 dark:text-gray-400">Credit Card</div>
                                            <div className="text-lg font-bold text-purple-500 dark:text-purple-400">
                                                {formatCurrency(revenueStats.paymentMethods.creditCard)}
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                {revenueStats.totalRevenue > 0
                                                    ? `${((revenueStats.paymentMethods.creditCard / revenueStats.totalRevenue) * 100).toFixed(1)}%`
                                                    : "0%"}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Revenue Trend */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
                                <div className="flex flex-wrap items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Revenue Trend</h3>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => setTimeFrame("daily")}
                                            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${timeFrame === "daily"
                                                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
                                                : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                                                }`}
                                        >
                                            Daily
                                        </button>
                                        <button
                                            onClick={() => setTimeFrame("monthly")}
                                            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${timeFrame === "monthly"
                                                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
                                                : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                                                }`}
                                        >
                                            Monthly
                                        </button>
                                    </div>
                                </div>
                                <div className="h-80">
                                    <Line
                                        data={chartData.timeSeriesData}
                                        options={{
                                            maintainAspectRatio: false,
                                            scales: {
                                                y: {
                                                    beginAtZero: true,
                                                    ticks: {
                                                        callback: (value) => "₹" + value.toLocaleString(),
                                                    },
                                                },
                                            },
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Booking Types */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Booking Types</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="h-64">
                                        <Pie data={chartData.bookingTypeData} options={{ maintainAspectRatio: false }} />
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-4 mb-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center">
                                                    <div className="h-4 w-4 rounded-full bg-blue-500 mr-2"></div>
                                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        Passenger Bookings
                                                    </span>
                                                </div>
                                                <span className="text-lg font-bold text-gray-900 dark:text-white">
                                                    {revenueStats.passengerBookings}
                                                </span>
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                Revenue: {formatCurrency(revenueStats.totalRevenue - revenueStats.vendorRevenue)}
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                Admin Share: 10% | Driver Share: 90%
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center">
                                                    <div className="h-4 w-4 rounded-full bg-yellow-500 mr-2"></div>
                                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Vendor Bookings</span>
                                                </div>
                                                <span className="text-lg font-bold text-gray-900 dark:text-white">
                                                    {revenueStats.vendorBookings}
                                                </span>
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                Revenue: {formatCurrency(revenueStats.vendorRevenue / 0.04)}
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                Admin: 6% | Driver: 90% | Vendor: 4%
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "transactions" && (
                        <motion.div
                            key="transactions"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* Search and Filter */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-6">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search by ID, passenger, driver, vendor or booking ID"
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
                                                        Payment Mode
                                                    </label>
                                                    <select
                                                        value={filters.paymentMode === null ? "" : filters.paymentMode}
                                                        onChange={(e) =>
                                                            setFilters({
                                                                ...filters,
                                                                paymentMode: e.target.value === "" ? null : Number.parseInt(e.target.value),
                                                            })
                                                        }
                                                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                                    >
                                                        <option value="">All Payment Modes</option>
                                                        {Object.entries(paymentModeMap).map(([value, { label }]) => (
                                                            <option key={value} value={value}>
                                                                {label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                        Transaction Status
                                                    </label>
                                                    <select
                                                        value={filters.transactionStatus === null ? "" : filters.transactionStatus}
                                                        onChange={(e) =>
                                                            setFilters({
                                                                ...filters,
                                                                transactionStatus: e.target.value === "" ? null : Number.parseInt(e.target.value),
                                                            })
                                                        }
                                                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                                    >
                                                        <option value="">All Statuses</option>
                                                        {Object.entries(transactionStatusMap).map(([value, { label }]) => (
                                                            <option key={value} value={value}>
                                                                {label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                        Transaction Type
                                                    </label>
                                                    <select
                                                        value={filters.transactionType === null ? "" : filters.transactionType}
                                                        onChange={(e) =>
                                                            setFilters({
                                                                ...filters,
                                                                transactionType: e.target.value === "" ? null : e.target.value,
                                                            })
                                                        }
                                                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                                    >
                                                        <option value="">All Types</option>
                                                        <option value="passenger">Passenger Bookings</option>
                                                        <option value="vendor">Vendor Bookings</option>
                                                    </select>
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

                            {/* Transaction List */}
                            {loading ? (
                                <div className="flex justify-center items-center py-12">
                                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                                </div>
                            ) : filteredTransactions.length === 0 ? (
                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 text-center">
                                    <div className="flex justify-center mb-4">
                                        <AlertCircle className="h-16 w-16 text-gray-400" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No transactions found</h3>
                                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                                        {searchQuery || Object.values(filters).some((val) => val !== null && val !== "")
                                            ? "Try adjusting your search or filters to see more results."
                                            : "There are no transactions in the system yet."}
                                    </p>
                                    {(searchQuery || Object.values(filters).some((val) => val !== null && val !== "")) && (
                                        <button
                                            onClick={resetFilters}
                                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                                        >
                                            Clear Filters
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                                <thead className="bg-gray-50 dark:bg-gray-900">
                                                    <tr>
                                                        <th
                                                            scope="col"
                                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                                                            onClick={() => requestSort("txn_id")}
                                                        >
                                                            <div className="flex items-center">
                                                                Transaction ID
                                                                <ArrowUpDown className="ml-1 h-4 w-4" />
                                                            </div>
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                                                            onClick={() => requestSort("amount")}
                                                        >
                                                            <div className="flex items-center">
                                                                Amount
                                                                <ArrowUpDown className="ml-1 h-4 w-4" />
                                                            </div>
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                                                        >
                                                            Type
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                                                        >
                                                            Payment
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                                                            onClick={() => requestSort("created_at")}
                                                        >
                                                            <div className="flex items-center">
                                                                Date
                                                                <ArrowUpDown className="ml-1 h-4 w-4" />
                                                            </div>
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                                                        >
                                                            Revenue Split
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                                    {paginatedTransactions.map((transaction) => {
                                                        const amount = Number.parseFloat(transaction.amount)
                                                        let adminRevenue, driverRevenue, vendorRevenue

                                                        if (transaction.vid !== null) {
                                                            // Vendor booking: 90% driver, 4% vendor, 6% admin
                                                            adminRevenue = amount * 0.06
                                                            driverRevenue = amount * 0.9
                                                            vendorRevenue = amount * 0.04
                                                        } else {
                                                            // Passenger booking: 90% driver, 10% admin
                                                            adminRevenue = amount * 0.1
                                                            driverRevenue = amount * 0.9
                                                            vendorRevenue = 0
                                                        }

                                                        const paymentModeInfo = paymentModeMap[transaction.payment_mode] || paymentModeMap[0]
                                                        const statusInfo = transactionStatusMap[transaction.status] || transactionStatusMap[0]
                                                        const PaymentIcon = paymentModeInfo.icon
                                                        const StatusIcon = statusInfo.icon

                                                        return (
                                                            <tr
                                                                key={transaction.txn_id}
                                                                className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                                                            >
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                                        #{transaction.txn_id}
                                                                    </div>
                                                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                                                        Booking #{transaction.bid}
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                                        ₹{transaction.amount}
                                                                    </div>
                                                                    <div
                                                                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}
                                                                    >
                                                                        <StatusIcon className="h-3 w-3 mr-1" />
                                                                        {statusInfo.label}
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <div className="text-sm text-gray-900 dark:text-white">
                                                                        {transaction.vid !== null ? (
                                                                            <span className="flex items-center">
                                                                                <Users className="h-4 w-4 mr-1 text-yellow-500" />
                                                                                Vendor
                                                                            </span>
                                                                        ) : (
                                                                            <span className="flex items-center">
                                                                                <Users className="h-4 w-4 mr-1 text-blue-500" />
                                                                                Passenger
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                                                        {transaction.vid !== null
                                                                            ? `Vendor #${transaction.vid}, Driver #${transaction.did || "N/A"}`
                                                                            : `Passenger #${transaction.pid || "N/A"}, Driver #${transaction.did || "N/A"}`}
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <div
                                                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${paymentModeInfo.color}`}
                                                                    >
                                                                        <PaymentIcon className="h-3 w-3 mr-1" />
                                                                        {paymentModeInfo.label}
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <div className="text-sm text-gray-900 dark:text-white">
                                                                        {formatDate(transaction.created_at).split("•")[0]}
                                                                    </div>
                                                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                                                        {formatDate(transaction.created_at).split("•")[1]}
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4">
                                                                    <div className="flex flex-col space-y-1">
                                                                        <div className="flex items-center justify-between">
                                                                            <span className="text-xs text-gray-500 dark:text-gray-400">Admin:</span>
                                                                            <span className="text-xs font-medium text-red-500 dark:text-red-400">
                                                                                ₹{adminRevenue.toFixed(2)} ({transaction.vid !== null ? "6%" : "10%"})
                                                                            </span>
                                                                        </div>
                                                                        <div className="flex items-center justify-between">
                                                                            <span className="text-xs text-gray-500 dark:text-gray-400">Driver:</span>
                                                                            <span className="text-xs font-medium text-blue-500 dark:text-blue-400">
                                                                                ₹{driverRevenue.toFixed(2)} (90%)
                                                                            </span>
                                                                        </div>
                                                                        {transaction.vid !== null && (
                                                                            <div className="flex items-center justify-between">
                                                                                <span className="text-xs text-gray-500 dark:text-gray-400">Vendor:</span>
                                                                                <span className="text-xs font-medium text-yellow-500 dark:text-yellow-400">
                                                                                    ₹{vendorRevenue.toFixed(2)} (4%)
                                                                                </span>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        )
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Pagination */}
                                        {totalPages > 1 && (
                                            <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
                                                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                                    <div>
                                                        <p className="text-sm text-gray-700 dark:text-gray-400">
                                                            Showing <span className="font-medium">{(currentPage - 1) * transactionsPerPage + 1}</span>{" "}
                                                            to{" "}
                                                            <span className="font-medium">
                                                                {Math.min(currentPage * transactionsPerPage, filteredTransactions.length)}
                                                            </span>{" "}
                                                            of <span className="font-medium">{filteredTransactions.length}</span> results
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <nav
                                                            className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                                                            aria-label="Pagination"
                                                        >
                                                            <button
                                                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
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
                                                                    className={`relative inline-flex items-center px-4 py-2 border ${currentPage === i + 1
                                                                        ? "z-10 bg-blue-50 dark:bg-blue-900/30 border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-400"
                                                                        : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                                                                        } text-sm font-medium`}
                                                                >
                                                                    {i + 1}
                                                                </button>
                                                            ))}

                                                            <button
                                                                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
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
                        </motion.div>
                    )}

                    {activeTab === "charts" && (
                        <motion.div
                            key="charts"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="grid grid-cols-1 gap-6 mb-6">
                                {/* Revenue Trend Chart */}
                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                                    <div className="flex flex-wrap items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Revenue Trend</h3>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => setTimeFrame("daily")}
                                                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${timeFrame === "daily"
                                                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
                                                    : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                                                    }`}
                                            >
                                                Daily
                                            </button>
                                            <button
                                                onClick={() => setTimeFrame("monthly")}
                                                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${timeFrame === "monthly"
                                                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
                                                    : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                                                    }`}
                                            >
                                                Monthly
                                            </button>
                                        </div>
                                    </div>
                                    <div className="h-96">
                                        <Line
                                            data={chartData.timeSeriesData}
                                            options={{
                                                maintainAspectRatio: false,
                                                scales: {
                                                    y: {
                                                        beginAtZero: true,
                                                        ticks: {
                                                            callback: (value) => "₹" + value.toLocaleString(),
                                                        },
                                                    },
                                                },
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Revenue Distribution and Payment Methods */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Revenue Distribution</h3>
                                        <div className="h-80">
                                            <Pie data={chartData.revenueDistributionData} options={{ maintainAspectRatio: false }} />
                                        </div>
                                    </div>

                                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Payment Methods</h3>
                                        <div className="h-80">
                                            <Pie data={chartData.paymentMethodData} options={{ maintainAspectRatio: false }} />
                                        </div>
                                    </div>
                                </div>

                                {/* Booking Types and Revenue by Type */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Booking Types</h3>
                                        <div className="h-80">
                                            <Pie data={chartData.bookingTypeData} options={{ maintainAspectRatio: false }} />
                                        </div>
                                    </div>

                                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Revenue by Type</h3>
                                        <div className="h-80">
                                            <Bar
                                                data={{
                                                    labels: ["Passenger Bookings", "Vendor Bookings"],
                                                    datasets: [
                                                        {
                                                            label: "Total Revenue",
                                                            data: [
                                                                revenueStats.totalRevenue - revenueStats.vendorRevenue / 0.04,
                                                                revenueStats.vendorRevenue / 0.04,
                                                            ],
                                                            backgroundColor: ["rgba(54, 162, 235, 0.6)", "rgba(255, 206, 86, 0.6)"],
                                                            borderColor: ["rgba(54, 162, 235, 1)", "rgba(255, 206, 86, 1)"],
                                                            borderWidth: 1,
                                                        },
                                                    ],
                                                }}
                                                options={{
                                                    maintainAspectRatio: false,
                                                    scales: {
                                                        y: {
                                                            beginAtZero: true,
                                                            ticks: {
                                                                callback: (value) => "₹" + value.toLocaleString(),
                                                            },
                                                        },
                                                    },
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "wallets" && (
                        <motion.div
                            key="wallets"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                {wallets.map((wallet) => {
                                    let walletType = wallet.userType || "Unknown"
                                    let walletIcon = DollarSign
                                    let walletColor = "text-gray-500 bg-gray-100"

                                    if (walletType === "Admin") {
                                        walletIcon = Building
                                        walletColor = "text-red-500 bg-red-100"
                                    } else if (walletType === "Driver") {
                                        walletIcon = Car
                                        walletColor = "text-blue-500 bg-blue-100"
                                    } else if (walletType === "Vendor") {
                                        walletIcon = Users
                                        walletColor = "text-yellow-500 bg-yellow-100"
                                    } else if (walletType === "Passenger") {
                                        walletIcon = Users
                                        walletColor = "text-green-500 bg-green-100"
                                    }

                                    const WalletIcon = walletIcon

                                    return (
                                        <div key={wallet.walletId} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                                            {/* header */}
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center">
                                                    <div className={`h-10 w-10 rounded-full ${walletColor.split(" ")[1]} flex items-center justify-center mr-3`}>
                                                        <WalletIcon className={`h-5 w-5 ${walletColor.split(" ")[0]}`} />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{walletType} Wallet</h3>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                                            ID: #{wallet.walletId} ({walletType} #{wallet.userId})
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                                    {formatCurrency(wallet.balance)}
                                                </div>
                                            </div>

                                            {/* timestamps */}
                                            <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm text-gray-500 dark:text-gray-400">Created</span>
                                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {formatDate(wallet.lastUpdated)} {/* fallback until backend adds created_at */}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-gray-500 dark:text-gray-400">Last Updated</span>
                                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {formatDate(wallet.lastUpdated)}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* recent transactions */}
                                            <div className="mt-4">
                                                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Recent Activity</h4>
                                                <div className="space-y-2">
                                                    {
                                                        filteredTransactions
                                                            .filter((t) => {
                                                                if (walletType === "Admin") return true
                                                                if (walletType === "Driver") return t.did === wallet.userId
                                                                if (walletType === "Vendor") return t.vid === wallet.userId
                                                                return false
                                                            })
                                                            .slice(0, 3)
                                                            .map((t) => {
                                                                const amount = Number.parseFloat(t.amount)
                                                                let walletAmount = 0

                                                                if (walletType === "Admin") {
                                                                    walletAmount = t.vid !== null ? amount * 0.06 : amount * 0.1
                                                                } else if (walletType === "Driver") {
                                                                    walletAmount = amount * 0.9
                                                                } else if (walletType === "Vendor") {
                                                                    walletAmount = amount * 0.04
                                                                }

                                                                const paymentInfo = paymentModeMap[t.payment_mode] || paymentModeMap[0]
                                                                const PaymentIcon = paymentInfo.icon

                                                                return (
                                                                    <div
                                                                        key={t.txn_id}
                                                                        className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700"
                                                                    >
                                                                        <div className="flex items-center">
                                                                            <div
                                                                                className={`h-8 w-8 rounded-full ${paymentInfo.color.split(" ")[1]} flex items-center justify-center mr-2`}
                                                                            >
                                                                                <PaymentIcon className={`h-4 w-4 ${paymentInfo.color.split(" ")[0]}`} />
                                                                            </div>
                                                                            <div>
                                                                                <div className="text-sm font-medium text-gray-900 dark:text-white">Transaction #{t.txn_id}</div>
                                                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                                                    {formatDate(t.created_at).split("•")[0]}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="text-sm font-medium text-green-500">+₹{walletAmount.toFixed(2)}</div>
                                                                    </div>
                                                                )
                                                            })
                                                    }

                                                    {
                                                        filteredTransactions.filter((t) => {
                                                            if (walletType === "Admin") return true
                                                            if (walletType === "Driver") return t.did === wallet.userId
                                                            if (walletType === "Vendor") return t.vid === wallet.userId
                                                            return false
                                                        }).length === 0 && (
                                                            <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                                                                No recent transactions found
                                                            </div>
                                                        )
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}

                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Revenue Distribution Info Modal */}
            <AnimatePresence>
                {showInfoModal && (
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
                            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Revenue Distribution</h3>
                                <button
                                    onClick={() => setShowInfoModal(false)}
                                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                </button>
                            </div>

                            <div className="p-6">
                                <div className="space-y-4">
                                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                                        <h4 className="text-lg font-medium text-blue-800 dark:text-blue-300 mb-2">Passenger Bookings</h4>
                                        <p className="text-sm text-blue-700 dark:text-blue-400 mb-3">
                                            For bookings made directly by passengers:
                                        </p>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg text-center">
                                                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Driver</div>
                                                <div className="text-xl font-bold text-blue-600 dark:text-blue-400">90%</div>
                                            </div>
                                            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg text-center">
                                                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Admin</div>
                                                <div className="text-xl font-bold text-red-600 dark:text-red-400">10%</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                                        <h4 className="text-lg font-medium text-yellow-800 dark:text-yellow-300 mb-2">Vendor Bookings</h4>
                                        <p className="text-sm text-yellow-700 dark:text-yellow-400 mb-3">
                                            For bookings made through vendors:
                                        </p>
                                        <div className="grid grid-cols-3 gap-2">
                                            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg text-center">
                                                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Driver</div>
                                                <div className="text-xl font-bold text-blue-600 dark:text-blue-400">90%</div>
                                            </div>
                                            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg text-center">
                                                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Vendor</div>
                                                <div className="text-xl font-bold text-yellow-600 dark:text-yellow-400">4%</div>
                                            </div>
                                            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg text-center">
                                                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Admin</div>
                                                <div className="text-xl font-bold text-red-600 dark:text-red-400">6%</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        <p>
                                            All transaction amounts are automatically distributed according to these percentages. The
                                            respective shares are added to each party's wallet immediately upon successful payment.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end p-4 border-t border-gray-200 dark:border-gray-700">
                                <button
                                    onClick={() => setShowInfoModal(false)}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}


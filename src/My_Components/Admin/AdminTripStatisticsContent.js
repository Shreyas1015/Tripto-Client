"use client"

import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import secureLocalStorage from "react-secure-storage"
import axiosInstance from "../../API/axiosInstance"
import {
    Calendar,
    Car,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ChevronUp,
    Clock,
    Download,
    Filter,
    Info,
    MapPin,
    RefreshCw,
    Route,
    Search,
    Users,
    X,
    ArrowUpDown,
    CheckCircle,
    XCircle,
    DollarSign,
    AlertCircle,
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
    Filler,
} from "chart.js"
import { Pie, Line, Doughnut } from "react-chartjs-2"

// Register ChartJS components including Filler for the fill option
ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Filler,
)

// Trip status mapping
const tripStatusMap = {
    0: { label: "Pending", icon: Clock, color: "text-yellow-500 bg-yellow-100" },
    1: { label: "Accepted", icon: CheckCircle, color: "text-blue-500 bg-blue-100" },
    2: { label: "Driver Arrived", icon: Car, color: "text-indigo-500 bg-indigo-100" },
    3: { label: "Trip Started", icon: Route, color: "text-purple-500 bg-purple-100" },
    4: { label: "Trip In Progress", icon: Route, color: "text-purple-500 bg-purple-100" },
    5: { label: "Completed", icon: CheckCircle, color: "text-green-500 bg-green-100" },
    6: { label: "Cancelled By Passenger", icon: XCircle, color: "text-red-500 bg-red-100" },
    7: { label: "Cancelled By Driver", icon: XCircle, color: "text-red-500 bg-red-100" },
}

// Trip type mapping - updated to match backend values
const tripTypeMap = {
    1: { label: "One Way", icon: Route },
    2: { label: "Round Trip", icon: RefreshCw },
}

// Car type mapping
const carTypeMap = {
    1: { label: "4 + 1 Seater", icon: Car },
    2: { label: "6 + 1 Seater", icon: Car },
}

export default function AdminTripStatistics() {
    const navigate = useNavigate()
    const uid = localStorage.getItem("@secure.n.uid")
    const decryptedUID = secureLocalStorage.getItem("uid")

    const [bookings, setBookings] = useState([])
    const [filteredBookings, setFilteredBookings] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [filterOpen, setFilterOpen] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [bookingsPerPage] = useState(10)
    const [totalPages, setTotalPages] = useState(1)
    const [sortConfig, setSortConfig] = useState({ key: "bid", direction: "desc" })
    const [dateRange, setDateRange] = useState({
        start: format(subMonths(new Date(), 1), "yyyy-MM-dd"),
        end: format(new Date(), "yyyy-MM-dd"),
    })
    const [filters, setFilters] = useState({
        tripStatus: null,
        tripType: null,
        carType: null,
        bookingType: null, // "passenger", "vendor", "all"
    })
    const [activeTab, setActiveTab] = useState("overview")
    const [timeFrame, setTimeFrame] = useState("monthly")
    const [showInfoModal, setShowInfoModal] = useState(false)
    const [selectedBooking, setSelectedBooking] = useState(null)

    // Fetch bookings data
    useEffect(() => {
        const fetchBookings = async () => {
            try {
                setLoading(true)
                console.log("Fetching Bookings...")

                const response = await axiosInstance.post(`${process.env.REACT_APP_BASE_URL}/admin/fetchAllBookings`, {
                    decryptedUID,
                })

                console.log(" Bookings fetched successfully:", response.data.bookings)
                if (response.data.bookings && Array.isArray(response.data.bookings)) {
                    // Normalize field names to ensure consistency
                    const normalizedBookings = response.data.bookings.map((booking) => ({
                        bid: booking.bid,
                        pid: booking.pid,
                        did: booking.did,
                        vid: booking.vid,
                        pickup_location: booking.pickup_location || booking.pickupLocation,
                        drop_location: booking.drop_location || booking.dropLocation,
                        pickup_date_time: booking.pickup_date_time || booking.pickupDateTime,
                        drop_date_time: booking.drop_date_time || booking.dropDateTime,
                        trip_status: booking.trip_status || booking.tripStatus,
                        trip_type: booking.trip_type || booking.tripType,
                        distance: booking.distance,
                        selected_car: booking.selected_car || booking.selectedCar,
                        price: booking.price,
                        no_of_days: booking.no_of_days,
                        passenger_name: booking.passenger_name || booking.passengerName,
                        passenger_phone: booking.passenger_phone || booking.passengerPhone,
                        cancellation_reason: booking.cancellation_reason,
                    }))

                    setBookings(normalizedBookings)
                    setFilteredBookings(normalizedBookings)
                    setTotalPages(Math.ceil(normalizedBookings.length / bookingsPerPage))
                }
            } catch (error) {
                console.error("Error fetching bookings:", error)
                toast.error("Failed to load bookings. Please try again.")
                setBookings([])
                setFilteredBookings([])
                setTotalPages(0)
            } finally {
                setLoading(false)
            }
        }

        if (decryptedUID) {
            fetchBookings()
        }
    }, [decryptedUID, bookingsPerPage])

    // Apply filters and search
    useEffect(() => {
        let results = [...bookings]

        // Apply search
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            results = results.filter(
                (booking) =>
                    booking.bid?.toString().includes(query) ||
                    booking.pid?.toString().includes(query) ||
                    booking.did?.toString().includes(query) ||
                    booking.vid?.toString().includes(query) ||
                    booking.pickup_location?.toLowerCase().includes(query) ||
                    booking.drop_location?.toLowerCase().includes(query) ||
                    booking.passenger_name?.toLowerCase().includes(query) ||
                    booking.passenger_phone?.includes(query),
            )
        }

        // Apply date range filter
        if (dateRange.start && dateRange.end) {
            const startDate = new Date(dateRange.start)
            const endDate = new Date(dateRange.end)
            endDate.setHours(23, 59, 59, 999) // Include the entire end day

            results = results.filter((booking) => {
                try {
                    const bookingDate = new Date(booking.pickup_date_time)
                    return bookingDate >= startDate && bookingDate <= endDate
                } catch (error) {
                    console.error("Error parsing date:", booking.pickup_date_time)
                    return false
                }
            })
        }

        // Apply trip status filter
        if (filters.tripStatus !== null) {
            results = results.filter((booking) => booking.trip_status === filters.tripStatus)
        }

        // Apply trip type filter
        if (filters.tripType !== null) {
            results = results.filter((booking) => booking.trip_type === filters.tripType)
        }

        // Apply car type filter
        if (filters.carType !== null) {
            results = results.filter((booking) => booking.selected_car === filters.carType)
        }

        // Apply booking type filter
        if (filters.bookingType === "passenger") {
            results = results.filter((booking) => booking.pid !== null && booking.vid === null)
        } else if (filters.bookingType === "vendor") {
            results = results.filter((booking) => booking.vid !== null)
        }

        // Apply sorting
        results.sort((a, b) => {
            if (sortConfig.key === "pickup_date_time" || sortConfig.key === "drop_date_time") {
                return sortConfig.direction === "asc"
                    ? new Date(a[sortConfig.key]) - new Date(b[sortConfig.key])
                    : new Date(b[sortConfig.key]) - new Date(a[sortConfig.key])
            }

            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === "asc" ? -1 : 1
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === "asc" ? 1 : -1
            }
            return 0
        })

        setFilteredBookings(results)
        setTotalPages(Math.ceil(results.length / bookingsPerPage))
        setCurrentPage(1) // Reset to first page when filters change
    }, [searchQuery, dateRange, filters, bookings, bookingsPerPage, sortConfig])

    // Calculate trip statistics
    const tripStats = useMemo(() => {
        const stats = {
            totalTrips: filteredBookings.length,
            completedTrips: 0,
            cancelledTrips: 0,
            pendingTrips: 0,
            inProgressTrips: 0,
            totalRevenue: 0,
            passengerTrips: 0,
            vendorTrips: 0,
            oneWayTrips: 0,
            roundTrips: 0,
            fourSeaterTrips: 0,
            sixSeaterTrips: 0,
            averageTripDistance: 0,
            monthlyTrips: {},
            dailyTrips: {},
            statusDistribution: {
                0: 0,
                1: 0,
                2: 0,
                3: 0,
                4: 0,
                5: 0,
                6: 0,
                7: 0,
            },
        }

        // Process each booking
        filteredBookings.forEach((booking) => {
            try {
                // Count by status
                if (booking.trip_status === 5) {
                    stats.completedTrips += 1
                    stats.totalRevenue += Number(booking.price || 0)
                } else if (booking.trip_status === 6 || booking.trip_status === 7) {
                    stats.cancelledTrips += 1
                } else if (booking.trip_status === 0 || booking.trip_status === 1) {
                    stats.pendingTrips += 1
                } else if (booking.trip_status >= 2 && booking.trip_status <= 4) {
                    stats.inProgressTrips += 1
                }

                // Count by booking type
                if (booking.vid !== null) {
                    stats.vendorTrips += 1
                } else {
                    stats.passengerTrips += 1
                }

                // Count by trip type
                if (booking.trip_type === 1) {
                    stats.oneWayTrips += 1
                } else if (booking.trip_type === 2) {
                    stats.roundTrips += 1
                }

                // Count by car type
                if (booking.selected_car === 1) {
                    stats.fourSeaterTrips += 1
                } else if (booking.selected_car === 2) {
                    stats.sixSeaterTrips += 1
                }

                // Status distribution
                stats.statusDistribution[booking.trip_status] = (stats.statusDistribution[booking.trip_status] || 0) + 1

                // Calculate average distance
                if (booking.distance) {
                    const distance = Number.parseFloat(booking.distance)
                    if (!isNaN(distance)) {
                        stats.averageTripDistance += distance
                    }
                }

                // Process for time-based charts
                if (booking.pickup_date_time && isValid(new Date(booking.pickup_date_time))) {
                    const date = new Date(booking.pickup_date_time)
                    const monthKey = format(date, "MMM yyyy")
                    const dayKey = format(date, "dd MMM")

                    // Monthly data
                    if (!stats.monthlyTrips[monthKey]) {
                        stats.monthlyTrips[monthKey] = {
                            total: 0,
                            completed: 0,
                            cancelled: 0,
                            revenue: 0,
                        }
                    }
                    stats.monthlyTrips[monthKey].total += 1

                    if (booking.trip_status === 5) {
                        stats.monthlyTrips[monthKey].completed += 1
                        stats.monthlyTrips[monthKey].revenue += Number(booking.price || 0)
                    } else if (booking.trip_status === 6 || booking.trip_status === 7) {
                        stats.monthlyTrips[monthKey].cancelled += 1
                    }

                    // Daily data
                    if (!stats.dailyTrips[dayKey]) {
                        stats.dailyTrips[dayKey] = {
                            total: 0,
                            completed: 0,
                            cancelled: 0,
                            revenue: 0,
                        }
                    }
                    stats.dailyTrips[dayKey].total += 1

                    if (booking.trip_status === 5) {
                        stats.dailyTrips[dayKey].completed += 1
                        stats.dailyTrips[dayKey].revenue += Number(booking.price || 0)
                    } else if (booking.trip_status === 6 || booking.trip_status === 7) {
                        stats.dailyTrips[dayKey].cancelled += 1
                    }
                }
            } catch (error) {
                console.error("Error processing booking for stats:", error, booking)
            }
        })

        // Calculate average distance
        stats.averageTripDistance = stats.totalTrips > 0 ? stats.averageTripDistance / stats.totalTrips : 0

        return stats
    }, [filteredBookings])

    // Prepare chart data
    const chartData = useMemo(() => {
        // Status distribution
        const statusDistributionData = {
            labels: Object.entries(tripStatusMap).map(([_, { label }]) => label),
            datasets: [
                {
                    data: Object.keys(tripStatusMap).map((status) => tripStats.statusDistribution[status] || 0),
                    backgroundColor: [
                        "rgba(255, 206, 86, 0.6)", // Pending
                        "rgba(54, 162, 235, 0.6)", // Accepted
                        "rgba(153, 102, 255, 0.6)", // Driver Arrived
                        "rgba(153, 102, 255, 0.6)", // Trip Started
                        "rgba(153, 102, 255, 0.6)", // Trip In Progress
                        "rgba(75, 192, 192, 0.6)", // Completed
                        "rgba(255, 99, 132, 0.6)", // Cancelled By Passenger
                        "rgba(255, 99, 132, 0.6)", // Cancelled By Driver
                    ],
                    borderColor: [
                        "rgba(255, 206, 86, 1)",
                        "rgba(54, 162, 235, 1)",
                        "rgba(153, 102, 255, 1)",
                        "rgba(153, 102, 255, 1)",
                        "rgba(153, 102, 255, 1)",
                        "rgba(75, 192, 192, 1)",
                        "rgba(255, 99, 132, 1)",
                        "rgba(255, 99, 132, 1)",
                    ],
                    borderWidth: 1,
                },
            ],
        }

        // Trip type distribution
        const tripTypeData = {
            labels: ["One Way Trips", "Round Trips"],
            datasets: [
                {
                    data: [tripStats.oneWayTrips, tripStats.roundTrips],
                    backgroundColor: ["rgba(54, 162, 235, 0.6)", "rgba(255, 206, 86, 0.6)"],
                    borderColor: ["rgba(54, 162, 235, 1)", "rgba(255, 206, 86, 1)"],
                    borderWidth: 1,
                },
            ],
        }

        // Booking type distribution
        const bookingTypeData = {
            labels: ["Passenger Bookings", "Vendor Bookings"],
            datasets: [
                {
                    data: [tripStats.passengerTrips, tripStats.vendorTrips],
                    backgroundColor: ["rgba(75, 192, 192, 0.6)", "rgba(153, 102, 255, 0.6)"],
                    borderColor: ["rgba(75, 192, 192, 1)", "rgba(153, 102, 255, 1)"],
                    borderWidth: 1,
                },
            ],
        }

        // Car type distribution
        const carTypeData = {
            labels: ["4+1 Seater", "6+1 Seater"],
            datasets: [
                {
                    data: [tripStats.fourSeaterTrips, tripStats.sixSeaterTrips],
                    backgroundColor: ["rgba(255, 159, 64, 0.6)", "rgba(255, 99, 132, 0.6)"],
                    borderColor: ["rgba(255, 159, 64, 1)", "rgba(255, 99, 132, 1)"],
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
            timeLabels = Object.keys(tripStats.monthlyTrips).sort((a, b) => {
                return new Date(a) - new Date(b)
            })

            timeValues = {
                total: timeLabels.map((month) => tripStats.monthlyTrips[month].total),
                completed: timeLabels.map((month) => tripStats.monthlyTrips[month].completed),
                cancelled: timeLabels.map((month) => tripStats.monthlyTrips[month].cancelled),
                revenue: timeLabels.map((month) => tripStats.monthlyTrips[month].revenue),
            }
        } else {
            // Sort days chronologically
            timeLabels = Object.keys(tripStats.dailyTrips).sort((a, b) => {
                return new Date(`2025 ${a}`) - new Date(`2025 ${b}`)
            })

            timeValues = {
                total: timeLabels.map((day) => tripStats.dailyTrips[day].total),
                completed: timeLabels.map((day) => tripStats.dailyTrips[day].completed),
                cancelled: timeLabels.map((day) => tripStats.dailyTrips[day].cancelled),
                revenue: timeLabels.map((day) => tripStats.dailyTrips[day].revenue),
            }
        }

        timeSeriesData = {
            labels: timeLabels,
            datasets: [
                {
                    label: "Total Trips",
                    data: timeValues.total,
                    borderColor: "rgba(75, 192, 192, 1)",
                    backgroundColor: "rgba(75, 192, 192, 0.2)",
                    tension: 0.4,
                    fill: true,
                },
                {
                    label: "Completed Trips",
                    data: timeValues.completed,
                    borderColor: "rgba(54, 162, 235, 1)",
                    backgroundColor: "rgba(54, 162, 235, 0.2)",
                    tension: 0.4,
                    fill: true,
                },
                {
                    label: "Cancelled Trips",
                    data: timeValues.cancelled,
                    borderColor: "rgba(255, 99, 132, 1)",
                    backgroundColor: "rgba(255, 99, 132, 0.2)",
                    tension: 0.4,
                    fill: true,
                },
            ],
        }

        // Revenue time series
        const revenueTimeSeriesData = {
            labels: timeLabels,
            datasets: [
                {
                    label: "Revenue",
                    data: timeValues.revenue,
                    borderColor: "rgba(255, 159, 64, 1)",
                    backgroundColor: "rgba(255, 159, 64, 0.2)",
                    tension: 0.4,
                    fill: true,
                },
            ],
        }

        return {
            statusDistributionData,
            tripTypeData,
            bookingTypeData,
            carTypeData,
            timeSeriesData,
            revenueTimeSeriesData,
        }
    }, [tripStats, timeFrame])

    // Reset filters
    const resetFilters = () => {
        setFilters({
            tripStatus: null,
            tripType: null,
            carType: null,
            bookingType: null,
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
            console.error("Error formatting date:", dateString, error)
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
            "Booking ID",
            "Passenger ID",
            "Driver ID",
            "Vendor ID",
            "Pickup Location",
            "Drop Location",
            "Pickup Date & Time",
            "Drop Date & Time",
            "Trip Status",
            "Trip Type",
            "Distance",
            "Car Type",
            "Price",
            "No. of Days",
            "Passenger Name",
            "Passenger Phone",
        ]

        const csvData = filteredBookings.map((booking) => {
            return [
                booking.bid,
                booking.pid || "N/A",
                booking.did || "N/A",
                booking.vid || "N/A",
                booking.pickup_location,
                booking.drop_location,
                formatDate(booking.pickup_date_time),
                formatDate(booking.drop_date_time),
                tripStatusMap[booking.trip_status]?.label || "Unknown",
                tripTypeMap[booking.trip_type]?.label || "Unknown",
                booking.distance,
                carTypeMap[booking.selected_car]?.label || "Unknown",
                booking.price,
                booking.no_of_days,
                booking.passenger_name || "N/A",
                booking.passenger_phone || "N/A",
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
        link.setAttribute("download", `trip-data-${new Date().toISOString().split("T")[0]}.csv`)
        link.style.visibility = "hidden"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        toast.success("Trip data exported successfully")
    }

    // Navigate back to admin dashboard
    const goToDashboard = () => {
        navigate(`/admindashboard?uid=${uid}`)
    }

    // Refresh data
    const refreshData = async () => {
        try {
            setLoading(true)

            const response = await axiosInstance.post(`${process.env.REACT_APP_BASE_URL}/admin/fetchAllBookings`, {
                decryptedUID,
            })

            if (response.data.bookings && Array.isArray(response.data.bookings)) {
                // Normalize field names to ensure consistency
                const normalizedBookings = response.data.bookings.map((booking) => ({
                    bid: booking.bid,
                    pid: booking.pid,
                    did: booking.did,
                    vid: booking.vid,
                    pickup_location: booking.pickup_location || booking.pickupLocation,
                    drop_location: booking.drop_location || booking.dropLocation,
                    pickup_date_time: booking.pickup_date_time || booking.pickupDateTime,
                    drop_date_time: booking.drop_date_time || booking.dropDateTime,
                    trip_status: booking.trip_status || booking.tripStatus,
                    trip_type: booking.trip_type || booking.tripType,
                    distance: booking.distance,
                    selected_car: booking.selected_car || booking.selectedCar,
                    price: booking.price,
                    no_of_days: booking.no_of_days,
                    passenger_name: booking.passenger_name || booking.passengerName,
                    passenger_phone: booking.passenger_phone || booking.passengerPhone,
                    cancellation_reason: booking.cancellation_reason,
                }))

                setBookings(normalizedBookings)
                setFilteredBookings(normalizedBookings)
                setTotalPages(Math.ceil(normalizedBookings.length / bookingsPerPage))
            }

            toast.success("Data refreshed successfully")
        } catch (error) {
            console.error("Error refreshing data:", error)
            toast.error("Failed to refresh data. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    // View booking details
    const viewBookingDetails = (booking) => {
        setSelectedBooking(booking)
        setShowInfoModal(true)
    }

    // Pagination
    const paginatedBookings = filteredBookings.slice((currentPage - 1) * bookingsPerPage, currentPage * bookingsPerPage)

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
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Trip Statistics</h1>
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
                                aria-label="Trip information"
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
                            onClick={() => setActiveTab("trips")}
                            className={`flex-1 py-4 px-4 text-center font-medium text-sm sm:text-base transition-colors ${activeTab === "trips"
                                    ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                                }`}
                        >
                            Trip Listings
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
                                <span className="text-sm text-gray-500 dark:text-gray-400">Total Trips</span>
                                <div className="text-2xl font-bold text-gray-900 dark:text-white">{tripStats.totalTrips}</div>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                <Route className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                        <div className="mt-2 flex items-center text-xs">
                            <div className="flex items-center text-green-500">
                                <span className="font-medium">Completed:</span>
                                <span className="ml-1">{tripStats.completedTrips}</span>
                            </div>
                            <div className="flex items-center text-red-500 ml-4">
                                <span className="font-medium">Cancelled:</span>
                                <span className="ml-1">{tripStats.cancelledTrips}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="text-sm text-gray-500 dark:text-gray-400">Total Revenue</span>
                                <div className="text-2xl font-bold text-green-500 dark:text-green-400">
                                    {formatCurrency(tripStats.totalRevenue)}
                                </div>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                        <div className="mt-2 flex items-center text-xs">
                            <div className="text-gray-500">
                                <span className="font-medium">Avg. Trip Value:</span>
                                <span className="ml-1">
                                    {formatCurrency(tripStats.completedTrips > 0 ? tripStats.totalRevenue / tripStats.completedTrips : 0)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="text-sm text-gray-500 dark:text-gray-400">Booking Types</span>
                                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                    <span className="text-blue-500 dark:text-blue-400">{tripStats.passengerTrips}</span> /
                                    <span className="text-purple-500 dark:text-purple-400"> {tripStats.vendorTrips}</span>
                                </div>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                            </div>
                        </div>
                        <div className="mt-2 flex items-center text-xs">
                            <div className="flex items-center text-blue-500">
                                <span className="font-medium">Passenger:</span>
                                <span className="ml-1">{tripStats.passengerTrips}</span>
                            </div>
                            <div className="flex items-center text-purple-500 ml-4">
                                <span className="font-medium">Vendor:</span>
                                <span className="ml-1">{tripStats.vendorTrips}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="text-sm text-gray-500 dark:text-gray-400">Trip Types</span>
                                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                    <span className="text-teal-500 dark:text-teal-400">{tripStats.oneWayTrips}</span> /
                                    <span className="text-amber-500 dark:text-amber-400"> {tripStats.roundTrips}</span>
                                </div>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                                <RefreshCw className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                            </div>
                        </div>
                        <div className="mt-2 flex items-center text-xs">
                            <div className="flex items-center text-teal-500">
                                <span className="font-medium">One Way:</span>
                                <span className="ml-1">{tripStats.oneWayTrips}</span>
                            </div>
                            <div className="flex items-center text-amber-500 ml-4">
                                <span className="font-medium">Round Trip:</span>
                                <span className="ml-1">{tripStats.roundTrips}</span>
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
                                {/* Status Distribution */}
                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Trip Status Distribution</h3>
                                    <div className="h-64">
                                        <Doughnut data={chartData.statusDistributionData} options={{ maintainAspectRatio: false }} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 mt-6">
                                        <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-3 text-center">
                                            <div className="text-xs text-gray-500 dark:text-gray-400">Completed</div>
                                            <div className="text-lg font-bold text-green-500 dark:text-green-400">
                                                {tripStats.completedTrips}
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                {tripStats.totalTrips > 0
                                                    ? `${((tripStats.completedTrips / tripStats.totalTrips) * 100).toFixed(1)}%`
                                                    : "0%"}
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-3 text-center">
                                            <div className="text-xs text-gray-500 dark:text-gray-400">Cancelled</div>
                                            <div className="text-lg font-bold text-red-500 dark:text-red-400">{tripStats.cancelledTrips}</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                {tripStats.totalTrips > 0
                                                    ? `${((tripStats.cancelledTrips / tripStats.totalTrips) * 100).toFixed(1)}%`
                                                    : "0%"}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Trip Types */}
                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Trip Types</h3>
                                    <div className="h-64">
                                        <Pie data={chartData.tripTypeData} options={{ maintainAspectRatio: false }} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 mt-6">
                                        <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-3 text-center">
                                            <div className="text-xs text-gray-500 dark:text-gray-400">One Way</div>
                                            <div className="text-lg font-bold text-blue-500 dark:text-blue-400">{tripStats.oneWayTrips}</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                {tripStats.totalTrips > 0
                                                    ? `${((tripStats.oneWayTrips / tripStats.totalTrips) * 100).toFixed(1)}%`
                                                    : "0%"}
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-3 text-center">
                                            <div className="text-xs text-gray-500 dark:text-gray-400">Round Trip</div>
                                            <div className="text-lg font-bold text-amber-500 dark:text-amber-400">{tripStats.roundTrips}</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                {tripStats.totalTrips > 0
                                                    ? `${((tripStats.roundTrips / tripStats.totalTrips) * 100).toFixed(1)}%`
                                                    : "0%"}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Trip Trend */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
                                <div className="flex flex-wrap items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Trip Trend</h3>
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
                                                        precision: 0,
                                                    },
                                                },
                                            },
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Revenue Trend */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Revenue Trend</h3>
                                <div className="h-80">
                                    <Line
                                        data={chartData.revenueTimeSeriesData}
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

                            {/* Recent Trips */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Trips</h3>
                                    <button
                                        onClick={() => setActiveTab("trips")}
                                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                                    >
                                        View All
                                    </button>
                                </div>
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
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                            {filteredBookings.slice(0, 5).map((booking) => {
                                                const StatusIcon = tripStatusMap[booking.trip_status]?.icon || Clock
                                                const statusInfo = tripStatusMap[booking.trip_status] || tripStatusMap[0]

                                                return (
                                                    <tr
                                                        key={booking.bid}
                                                        className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors cursor-pointer"
                                                        onClick={() => viewBookingDetails(booking)}
                                                    >
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm font-medium text-gray-900 dark:text-white">#{booking.bid}</div>
                                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                                {formatDate(booking.pickup_date_time).split("•")[0]}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-gray-900 dark:text-white">
                                                                {booking.passenger_name || `Passenger #${booking.pid}`}
                                                            </div>
                                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                                {booking.passenger_phone || "No phone"}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="text-sm text-gray-900 dark:text-white flex items-center">
                                                                <MapPin className="h-3 w-3 mr-1 text-gray-500" />
                                                                {booking.pickup_location?.substring(0, 20)}...
                                                            </div>
                                                            <div className="text-sm text-gray-900 dark:text-white flex items-center">
                                                                <MapPin className="h-3 w-3 mr-1 text-gray-500" />
                                                                {booking.drop_location?.substring(0, 20)}...
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
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                                {formatCurrency(booking.price || 0)}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "trips" && (
                        <motion.div
                            key="trips"
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
                                            placeholder="Search by ID, passenger, location or phone"
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
                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                        Trip Status
                                                    </label>
                                                    <select
                                                        value={filters.tripStatus === null ? "" : filters.tripStatus}
                                                        onChange={(e) =>
                                                            setFilters({
                                                                ...filters,
                                                                tripStatus: e.target.value === "" ? null : Number.parseInt(e.target.value),
                                                            })
                                                        }
                                                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                                    >
                                                        <option value="">All Statuses</option>
                                                        {Object.entries(tripStatusMap).map(([value, { label }]) => (
                                                            <option key={value} value={value}>
                                                                {label}
                                                            </option>
                                                        ))}
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
                                                                tripType: e.target.value === "" ? null : Number.parseInt(e.target.value),
                                                            })
                                                        }
                                                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                                    >
                                                        <option value="">All Trip Types</option>
                                                        {Object.entries(tripTypeMap).map(([value, { label }]) => (
                                                            <option key={value} value={value}>
                                                                {label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                        Car Type
                                                    </label>
                                                    <select
                                                        value={filters.carType === null ? "" : filters.carType}
                                                        onChange={(e) =>
                                                            setFilters({
                                                                ...filters,
                                                                carType: e.target.value === "" ? null : Number.parseInt(e.target.value),
                                                            })
                                                        }
                                                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                                    >
                                                        <option value="">All Car Types</option>
                                                        {Object.entries(carTypeMap).map(([value, { label }]) => (
                                                            <option key={value} value={value}>
                                                                {label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                        Booking Type
                                                    </label>
                                                    <select
                                                        value={filters.bookingType === null ? "" : filters.bookingType}
                                                        onChange={(e) =>
                                                            setFilters({
                                                                ...filters,
                                                                bookingType: e.target.value === "" ? null : e.target.value,
                                                            })
                                                        }
                                                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                                    >
                                                        <option value="">All Booking Types</option>
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

                            {/* Trip List */}
                            {loading ? (
                                <div className="flex justify-center items-center py-12">
                                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                                </div>
                            ) : filteredBookings.length === 0 ? (
                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 text-center">
                                    <div className="flex justify-center mb-4">
                                        <AlertCircle className="h-16 w-16 text-gray-400" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No trips found</h3>
                                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                                        {searchQuery || Object.values(filters).some((val) => val !== null && val !== "")
                                            ? "Try adjusting your search or filters to see more results."
                                            : "There are no trips in the system yet."}
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
                                                            onClick={() => requestSort("bid")}
                                                        >
                                                            <div className="flex items-center">
                                                                Booking ID
                                                                <ArrowUpDown className="ml-1 h-4 w-4" />
                                                            </div>
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
                                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                                                            onClick={() => requestSort("pickup_date_time")}
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
                                                            Status
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                                                            onClick={() => requestSort("price")}
                                                        >
                                                            <div className="flex items-center">
                                                                Price
                                                                <ArrowUpDown className="ml-1 h-4 w-4" />
                                                            </div>
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                                    {paginatedBookings.map((booking) => {
                                                        const StatusIcon = tripStatusMap[booking.trip_status]?.icon || Clock
                                                        const statusInfo = tripStatusMap[booking.trip_status] || tripStatusMap[0]

                                                        return (
                                                            <tr
                                                                key={booking.bid}
                                                                className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors cursor-pointer"
                                                                onClick={() => viewBookingDetails(booking)}
                                                            >
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                                        #{booking.bid}
                                                                    </div>
                                                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                                                        {booking.vid ? (
                                                                            <span className="flex items-center">
                                                                                <Users className="h-3 w-3 mr-1" />
                                                                                Vendor #{booking.vid}
                                                                            </span>
                                                                        ) : (
                                                                            <span className="flex items-center">
                                                                                <Users className="h-3 w-3 mr-1" />
                                                                                Passenger #{booking.pid}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <div className="text-sm text-gray-900 dark:text-white">
                                                                        {booking.passenger_name || `Passenger #${booking.pid}`}
                                                                    </div>
                                                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                                                        {booking.passenger_phone || "No phone"}
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4">
                                                                    <div className="text-sm text-gray-900 dark:text-white flex items-center">
                                                                        <MapPin className="h-3 w-3 mr-1 text-gray-500" />
                                                                        {booking.pickup_location?.substring(0, 20)}...
                                                                    </div>
                                                                    <div className="text-sm text-gray-900 dark:text-white flex items-center">
                                                                        <MapPin className="h-3 w-3 mr-1 text-gray-500" />
                                                                        {booking.drop_location?.substring(0, 20)}...
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <div className="text-sm text-gray-900 dark:text-white">
                                                                        {formatDate(booking.pickup_date_time).split("•")[0]}
                                                                    </div>
                                                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                                                        {formatDate(booking.pickup_date_time).split("•")[1]}
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <div
                                                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}
                                                                    >
                                                                        <StatusIcon className="h-3 w-3 mr-1" />
                                                                        {statusInfo.label}
                                                                    </div>
                                                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                                        {tripTypeMap[booking.trip_type]?.label || "Unknown"}
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                                        {formatCurrency(booking.price || 0)}
                                                                    </div>
                                                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                                                        {carTypeMap[booking.selected_car]?.label || "Unknown"}
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
                                                            Showing <span className="font-medium">{(currentPage - 1) * bookingsPerPage + 1}</span> to{" "}
                                                            <span className="font-medium">
                                                                {Math.min(currentPage * bookingsPerPage, filteredBookings.length)}
                                                            </span>{" "}
                                                            of <span className="font-medium">{filteredBookings.length}</span> results
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
                                {/* Trip Trend Chart */}
                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                                    <div className="flex flex-wrap items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Trip Trend</h3>
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
                                                            precision: 0,
                                                        },
                                                    },
                                                },
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Revenue Trend Chart */}
                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Revenue Trend</h3>
                                    <div className="h-96">
                                        <Line
                                            data={chartData.revenueTimeSeriesData}
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

                                {/* Status Distribution and Trip Types */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                            Trip Status Distribution
                                        </h3>
                                        <div className="h-80">
                                            <Doughnut data={chartData.statusDistributionData} options={{ maintainAspectRatio: false }} />
                                        </div>
                                    </div>

                                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Trip Types</h3>
                                        <div className="h-80">
                                            <Pie data={chartData.tripTypeData} options={{ maintainAspectRatio: false }} />
                                        </div>
                                    </div>
                                </div>

                                {/* Booking Types and Car Types */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Booking Types</h3>
                                        <div className="h-80">
                                            <Pie data={chartData.bookingTypeData} options={{ maintainAspectRatio: false }} />
                                        </div>
                                    </div>

                                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Car Types</h3>
                                        <div className="h-80">
                                            <Pie data={chartData.carTypeData} options={{ maintainAspectRatio: false }} />
                                        </div>
                                    </div>
                                </div>

                                {/* Trip Metrics */}
                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Trip Metrics</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="bg-gray-50 dark:bg-gray-750 rounded-xl p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <h4 className="text-base font-medium text-gray-700 dark:text-gray-300">Completion Rate</h4>
                                                <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                                                </div>
                                            </div>
                                            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                                                {tripStats.totalTrips > 0
                                                    ? `${((tripStats.completedTrips / tripStats.totalTrips) * 100).toFixed(1)}%`
                                                    : "0%"}
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                {tripStats.completedTrips} out of {tripStats.totalTrips} trips completed
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 dark:bg-gray-750 rounded-xl p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <h4 className="text-base font-medium text-gray-700 dark:text-gray-300">Cancellation Rate</h4>
                                                <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                                                    <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                                                </div>
                                            </div>
                                            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                                                {tripStats.totalTrips > 0
                                                    ? `${((tripStats.cancelledTrips / tripStats.totalTrips) * 100).toFixed(1)}%`
                                                    : "0%"}
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                {tripStats.cancelledTrips} out of {tripStats.totalTrips} trips cancelled
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 dark:bg-gray-750 rounded-xl p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <h4 className="text-base font-medium text-gray-700 dark:text-gray-300">Average Distance</h4>
                                                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                                    <Route className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                                </div>
                                            </div>
                                            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                                                {tripStats.averageTripDistance.toFixed(1)} km
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">Average distance per trip</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Booking Details Modal */}
            <AnimatePresence>
                {showInfoModal && selectedBooking && (
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
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-3xl w-full overflow-hidden max-h-[90vh] overflow-y-auto"
                        >
                            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                    Booking Details #{selectedBooking.bid}
                                </h3>
                                <button
                                    onClick={() => {
                                        setShowInfoModal(false)
                                        setSelectedBooking(null)
                                    }}
                                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                </button>
                            </div>

                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Trip Information */}
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Trip Information</h4>
                                        <div className="space-y-4">
                                            <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-4">
                                                <div className="flex items-center mb-2">
                                                    <MapPin className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Pickup Location</span>
                                                </div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">{selectedBooking.pickup_location}</p>
                                            </div>

                                            <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-4">
                                                <div className="flex items-center mb-2">
                                                    <MapPin className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Drop Location</span>
                                                </div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">{selectedBooking.drop_location}</p>
                                            </div>

                                            <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-4">
                                                <div className="flex items-center mb-2">
                                                    <Calendar className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        Pickup Date & Time
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    {formatDate(selectedBooking.pickup_date_time)}
                                                </p>
                                            </div>

                                            {selectedBooking.drop_date_time && (
                                                <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-4">
                                                    <div className="flex items-center mb-2">
                                                        <Calendar className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                            Drop Date & Time
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        {formatDate(selectedBooking.drop_date_time)}
                                                    </p>
                                                </div>
                                            )}

                                            <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-4">
                                                <div className="flex items-center mb-2">
                                                    <Route className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Trip Details</span>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div>
                                                        <span className="text-xs text-gray-500 dark:text-gray-400">Distance</span>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">{selectedBooking.distance} km</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-xs text-gray-500 dark:text-gray-400">Trip Type</span>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                                            {tripTypeMap[selectedBooking.trip_type]?.label || "Unknown"}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <span className="text-xs text-gray-500 dark:text-gray-400">Car Type</span>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                                            {carTypeMap[selectedBooking.selected_car]?.label || "Unknown"}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <span className="text-xs text-gray-500 dark:text-gray-400">Price</span>
                                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                                            {formatCurrency(selectedBooking.price || 0)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* User Information */}
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">User Information</h4>
                                        <div className="space-y-4">
                                            <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-4">
                                                <div className="flex items-center mb-2">
                                                    <Users className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        Passenger Details
                                                    </span>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div>
                                                        <span className="text-xs text-gray-500 dark:text-gray-400">Name</span>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                                            {selectedBooking.passenger_name || `Passenger #${selectedBooking.pid}`}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <span className="text-xs text-gray-500 dark:text-gray-400">Phone</span>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                                            {selectedBooking.passenger_phone || "N/A"}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <span className="text-xs text-gray-500 dark:text-gray-400">Passenger ID</span>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">{selectedBooking.pid || "N/A"}</p>
                                                    </div>
                                                    {selectedBooking.vid && (
                                                        <div>
                                                            <span className="text-xs text-gray-500 dark:text-gray-400">Vendor ID</span>
                                                            <p className="text-sm text-gray-600 dark:text-gray-400">{selectedBooking.vid}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-4">
                                                <div className="flex items-center mb-2">
                                                    <Car className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Driver Details</span>
                                                </div>
                                                <div>
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">Driver ID</span>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        {selectedBooking.did || "Not assigned yet"}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-4">
                                                <div className="flex items-center mb-2">
                                                    <Clock className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Trip Status</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <div
                                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${tripStatusMap[selectedBooking.trip_status]?.color || "text-gray-500 bg-gray-100"
                                                            }`}
                                                    >
                                                        {tripStatusMap[selectedBooking.trip_status]?.icon && <Clock className="h-3 w-3 mr-1" />}
                                                        {tripStatusMap[selectedBooking.trip_status]?.label || "Unknown"}
                                                    </div>
                                                </div>
                                            </div>

                                            {selectedBooking.cancellation_reason && (
                                                <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-4">
                                                    <div className="flex items-center mb-2">
                                                        <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                            Cancellation Reason
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        {selectedBooking.cancellation_reason}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end p-4 border-t border-gray-200 dark:border-gray-700">
                                <button
                                    onClick={() => {
                                        setShowInfoModal(false)
                                        setSelectedBooking(null)
                                    }}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Trip Info Modal */}
            <AnimatePresence>
                {showInfoModal && !selectedBooking && (
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
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Trip Status Information</h3>
                                <button
                                    onClick={() => setShowInfoModal(false)}
                                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                </button>
                            </div>

                            <div className="p-6">
                                <div className="space-y-4">
                                    {Object.entries(tripStatusMap).map(([status, { label, icon: StatusIcon, color }]) => (
                                        <div key={status} className="flex items-center p-3 bg-gray-50 dark:bg-gray-750 rounded-lg">
                                            <div
                                                className={`h-8 w-8 rounded-full ${color.split(" ")[1]} flex items-center justify-center mr-3`}
                                            >
                                                <StatusIcon className={`h-4 w-4 ${color.split(" ")[0]}`} />
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900 dark:text-white">{label}</div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">Status Code: {status}</div>
                                            </div>
                                        </div>
                                    ))}
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


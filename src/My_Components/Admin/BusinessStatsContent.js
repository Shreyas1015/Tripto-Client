

import { useState, useEffect } from "react"
import axiosInstance from "../../API/axiosInstance"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Download, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"
import secureLocalStorage from "react-secure-storage"

// API base URL from environment variable
const API_BASE_URL = process.env.REACT_APP_BASE_URL

export default function BusinessStatsContent() {
  // State variables
  const [timeFrame, setTimeFrame] = useState("monthly")
  const [selectedRegion, setSelectedRegion] = useState("North")
  const [regions, setRegions] = useState(["North"])
  const uid = localStorage.getItem("@secure.n.uid");
  const decryptedUID = secureLocalStorage.getItem("uid");

  // Data states
  const [quickStats, setQuickStats] = useState({
    totalTrips: 0,
    revenue: 0,
    activeDrivers: 0,
    cancellationRate: 0,
  })
  const [tripData, setTripData] = useState([])
  const [revenueData, setRevenueData] = useState({})
  const [cancellationData, setCancellationData] = useState([])
  const [paymentData, setPaymentData] = useState([])

  // Loading and error states
  const [loading, setLoading] = useState({
    quickStats: true,
    tripData: true,
    revenueData: true,
    cancellationData: true,
    paymentData: true,
  })
  const [error, setError] = useState({
    quickStats: null,
    tripData: null,
    revenueData: null,
    cancellationData: null,
    paymentData: null,
  })

  const COLORS = ["#0bbfe0", "#077286", "#0999b3", "#066275", "#0bbfe0"]

  // Fetch quick stats
  useEffect(() => {
    const fetchQuickStats = async () => {
      try {
        const response = await axiosInstance.post(`${API_BASE_URL}/admin/fetchQuickStats`, {
          decryptedUID
        })
        setQuickStats(response.data)
        setLoading((prev) => ({ ...prev, quickStats: false }))
      } catch (err) {
        console.error("Error fetching quick stats:", err)
        setError((prev) => ({ ...prev, quickStats: err.message }))
        setLoading((prev) => ({ ...prev, quickStats: false }))
      }
    }

    const fetchTripData = async () => {
      setLoading((prev) => ({ ...prev, tripData: true }))
      try {
        const response = await axiosInstance.post(`${API_BASE_URL}/admin/fetchTripData`, {
          params: { timeFrame },
          decryptedUID
        })
        setTripData(response.data)
        setLoading((prev) => ({ ...prev, tripData: false }))
      } catch (err) {
        console.error("Error fetching trip data:", err)
        setError((prev) => ({ ...prev, tripData: err.message }))
        setLoading((prev) => ({ ...prev, tripData: false }))
      }
    }

    const fetchRevenueData = async () => {
      setLoading((prev) => ({ ...prev, revenueData: true }));
      try {
        const response = await axiosInstance.post(`${API_BASE_URL}/admin/fetchRevenueData`, {
          decryptedUID,
        });

        const rawData = response.data;
        console.log("Raw Revenue Data:", rawData);

        // Remove URLs and Invalid Locations
        const cleanedData = Object.fromEntries(
          Object.entries(rawData).filter(([key]) => {
            return !key.startsWith("http") && key.trim() !== "";
          })
        );

        // Extract valid region names
        const validRegions = Object.keys(cleanedData);

        // Set State
        setRevenueData(cleanedData);
        setRegions(validRegions);

        // Auto-select first valid region
        if (validRegions.length > 0 && !cleanedData[selectedRegion]) {
          setSelectedRegion(validRegions[0]);
        }

        setLoading((prev) => ({ ...prev, revenueData: false }));
      } catch (err) {
        console.error("Error fetching revenue data:", err);
        setError((prev) => ({ ...prev, revenueData: err.message }));
        setLoading((prev) => ({ ...prev, revenueData: false }));
      }
    };



    const fetchCancellationData = async () => {
      try {
        const response = await axiosInstance.post(`${API_BASE_URL}/admin/fetchCancellationData`, {
          decryptedUID
        })
        setCancellationData(response.data)
        setLoading((prev) => ({ ...prev, cancellationData: false }))
      } catch (err) {
        console.error("Error fetching cancellation data:", err)
        setError((prev) => ({ ...prev, cancellationData: err.message }))
        setLoading((prev) => ({ ...prev, cancellationData: false }))
      }
    }
    const fetchPaymentData = async () => {
      try {
        const response = await axiosInstance.post(`${API_BASE_URL}/admin/fetchPaymentData`, { decryptedUID });

        if (!response.data || !Array.isArray(response.data.paymentData)) {
          throw new Error("Invalid payment data format");
        }

        setPaymentData(response.data.paymentData);
        setLoading((prev) => ({ ...prev, paymentData: false }));
      } catch (err) {
        console.error("Error fetching payment data:", err);
        setError((prev) => ({ ...prev, paymentData: err.message }));
        setLoading((prev) => ({ ...prev, paymentData: false }));
      }
    };


    fetchPaymentData()
    fetchRevenueData()
    fetchQuickStats()
    fetchTripData()
    fetchCancellationData()
  }, [decryptedUID, selectedRegion, timeFrame])



  // Export data to CSV
  const exportData = async () => {
    try {
      const response = await axiosInstance.post(`${API_BASE_URL}/admin/export`, {
        params: { region: selectedRegion },
        responseType: "blob",
        decryptedUID
      })

      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", `${selectedRegion}_revenue_data.csv`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (err) {
      console.error("Error exporting data:", err)
      alert("Failed to export data. Please try again.")
    }
  }

  // Calculate payment percentages
  const calculatePaymentPercentages = () => {
    if (!Array.isArray(paymentData) || paymentData.length === 0) {
      return { paid: 0, unpaid: 0 };
    }

    const paidEntry = paymentData.find((item) => item.name === "Paid");
    const unpaidEntry = paymentData.find((item) => item.name === "Unpaid");

    const paid = paidEntry?.value || 0;
    const unpaid = unpaidEntry?.value || 0;
    const total = paid + unpaid;

    return {
      paid: total > 0 ? Math.round((paid / total) * 100) : 0,
      unpaid: total > 0 ? Math.round((unpaid / total) * 100) : 0,
    };
  };

  const paymentPercentages = calculatePaymentPercentages();




  // Loading placeholder component
  const LoadingPlaceholder = ({ height = "100%" }) => (
    <div className="flex items-center justify-center" style={{ height }}>
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0bbfe0]"></div>
    </div>
  )

  // Error component
  const ErrorDisplay = ({ message }) => (
    <div className="flex flex-col items-center justify-center text-red-500 p-4">
      <AlertCircle className="h-8 w-8 mb-2" />
      <p>Failed to load data</p>
      <p className="text-sm">{message}</p>
    </div>
  )

  return (
    <motion.div
      className="p-8 max-w-7xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold text-[#077286] mb-8">Business Stats</h1>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {loading.quickStats ? (
          Array(4)
            .fill(0)
            .map((_, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow h-24 animate-pulse">
                <div className="bg-gray-200 h-full rounded"></div>
              </div>
            ))
        ) : error.quickStats ? (
          <div className="col-span-4">
            <ErrorDisplay message={error.quickStats} />
          </div>
        ) : (
          <>
            <StatCard
              title="Completed Trips"
              value={quickStats.totalTrips.toLocaleString()}
              color="bg-blue-100 text-blue-600"
            />
            <StatCard
              title="Revenue"
              value={`$${quickStats.revenue.toLocaleString()}`}
              color="bg-green-100 text-green-600"
            />
            <StatCard
              title="Active Drivers"
              value={quickStats.activeDrivers.toLocaleString()}
              color="bg-yellow-100 text-yellow-600"
            />
            <StatCard
              title="Cancellation Rate"
              value={`${quickStats.cancellationRate.toFixed(1)}%`}
              color="bg-red-100 text-red-600"
            />
          </>
        )}
      </div>

      {/* Trip Metrics */}
      <motion.div className="bg-white rounded-lg p-6 mb-8 shadow">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold text-[#077286]">Trips Completed</h2>
          <TimeFrameSelector timeFrame={timeFrame} setTimeFrame={setTimeFrame} />
        </div>
        <div className="h-64">
          {loading.tripData ? (
            <LoadingPlaceholder />
          ) : error.tripData ? (
            <ErrorDisplay message={error.tripData} />
          ) : tripData.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              No trip data available for the selected time frame
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tripData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="completed" fill="#0bbfe0" />
                <Bar dataKey="cancelled" fill="#ff6b6b" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </motion.div>


      {/* Revenue Metrics */}
      <motion.div className="bg-white rounded-lg p-6 mb-8 shadow">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold text-[#077286]">Revenue by Region</h2>
          <div className="flex items-center space-x-4">
            {/* Dropdown for selecting region */}
            <select
              className="border p-2 rounded w-40"
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              disabled={loading.revenueData || regions.length === 0}
            >
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region.length > 50 ? region.substring(0, 50) + "..." : region}
                </option>
              ))}
            </select>

            {/* Export Button */}
            <button
              className="border p-2 rounded flex items-center text-sm"
              onClick={exportData}
              disabled={loading.revenueData || error.revenueData}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Chart Section */}
        <div className="h-64">
          {loading.revenueData ? (
            <LoadingPlaceholder />
          ) : error.revenueData ? (
            <ErrorDisplay message={error.revenueData} />
          ) : !revenueData[selectedRegion] || revenueData[selectedRegion].length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              No revenue data available for {selectedRegion}
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData[selectedRegion]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 'auto']} tickCount={5} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="total_revenue" stroke="#077286" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </motion.div>


      {/* Cancellation and Payment Metrics */}
      <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Cancellation Reasons */}
        <div className="bg-white rounded-lg p-6 shadow">
          <h2 className="text-xl font-bold text-[#077286] mb-4">Cancellation Reasons</h2>
          <div className="h-64">
            {loading.cancellationData ? (
              <LoadingPlaceholder />
            ) : error.cancellationData ? (
              <ErrorDisplay message={error.cancellationData} />
            ) : cancellationData.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                No cancellation data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={cancellationData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    dataKey="value"
                  >
                    {cancellationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Payment Status */}
        <div className="bg-white rounded-lg p-6 shadow">
          <h2 className="text-xl font-bold text-[#077286] mb-4">Payment Status</h2>
          {loading.paymentData ? (
            <LoadingPlaceholder height="200px" />
          ) : error.paymentData ? (
            <ErrorDisplay message={error.paymentData} />
          ) : paymentData.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-gray-500">No payment data available</div>
          ) : (
            <div className="flex items-center justify-around">
              <div className="text-center">
                <p className="text-4xl font-bold text-[#0bbfe0]">{paymentPercentages.paid}%</p>
                <p className="text-sm text-gray-500">Paid</p>
              </div>
              <div className="h-40 w-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={paymentData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} dataKey="value">
                      {paymentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-[#ff6b6b]">{paymentPercentages.unpaid}%</p>
                <p className="text-sm text-gray-500">Unpaid</p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

const StatCard = ({ title, value, color }) => (
  <motion.div className="bg-white rounded-lg p-6 shadow" whileHover={{ scale: 1.05 }}>
    <div className="flex items-center">
      <div className={`rounded-full p-3 mr-4 ${color}`}>
        <div className="h-6 w-6" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  </motion.div>
)

const TimeFrameSelector = ({ timeFrame, setTimeFrame }) => (
  <div className="flex space-x-2">
    {["daily", "weekly", "monthly"].map((frame) => (
      <button
        key={frame}
        className={`px-4 py-2 border rounded ${timeFrame === frame ? "bg-blue-500 text-white" : "bg-white"}`}
        onClick={() => setTimeFrame(frame)}
      >
        {frame.charAt(0).toUpperCase() + frame.slice(1)}
      </button>
    ))}
  </div>
)


import React, { useState } from "react";
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
} from "recharts";
import { Download } from "lucide-react";
import { motion } from "framer-motion";

const tripData = [
  { date: "2023-01", completed: 120, cancelled: 10 },
  { date: "2023-02", completed: 150, cancelled: 8 },
  { date: "2023-03", completed: 180, cancelled: 12 },
  { date: "2023-04", completed: 200, cancelled: 15 },
  { date: "2023-05", completed: 220, cancelled: 10 },
  { date: "2023-06", completed: 250, cancelled: 5 },
];

const revenueData = {
  North: [
    { date: "2023-01", suv: 3000, muv: 2000 },
    { date: "2023-02", suv: 3500, muv: 2500 },
    { date: "2023-03", suv: 4000, muv: 3000 },
    { date: "2023-04", suv: 4500, muv: 3500 },
    { date: "2023-05", suv: 5000, muv: 4000 },
    { date: "2023-06", suv: 5500, muv: 4500 },
  ],
};

const cancellationData = [
  { reason: "User Error", value: 30 },
  { reason: "Driver Delay", value: 25 },
  { reason: "Weather", value: 15 },
  { reason: "Vehicle Issue", value: 20 },
  { reason: "Other", value: 10 },
];

const paymentData = [
  { status: "Paid", value: 75 },
  { status: "Unpaid", value: 25 },
];

const COLORS = ["#0bbfe0", "#077286", "#0999b3", "#066275", "#0bbfe0"];

export default function BusinessStatsContent() {
  const [timeFrame, setTimeFrame] = useState("monthly");
  const [selectedRegion, setSelectedRegion] = useState("North");

  return (
    <motion.div
      className="p-8 max-w-7xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold text-[#077286] mb-8">Buisness Stats</h1>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Trips"
          value="1,234"
          color="bg-blue-100 text-blue-600"
        />
        <StatCard
          title="Revenue"
          value="$45,678"
          color="bg-green-100 text-green-600"
        />
        <StatCard
          title="Active Drivers"
          value="89"
          color="bg-yellow-100 text-yellow-600"
        />
        <StatCard
          title="Cancellation Rate"
          value="3.2%"
          color="bg-red-100 text-red-600"
        />
      </div>

      {/* Trip Metrics */}
      <motion.div className="bg-white rounded-lg p-6 mb-8 shadow">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold text-[#077286]">Trips Completed</h2>
          <TimeFrameSelector
            timeFrame={timeFrame}
            setTimeFrame={setTimeFrame}
          />
        </div>
        <div className="h-64">
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
        </div>
      </motion.div>

      {/* Revenue Metrics */}
      <motion.div className="bg-white rounded-lg p-6 mb-8 shadow">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold text-[#077286]">
            Revenue by Region
          </h2>
          <div className="flex items-center space-x-4">
            <select
              className="border p-2 rounded w-40"
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
            >
              {Object.keys(revenueData).map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
            <button className="border p-2 rounded flex items-center text-sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueData[selectedRegion]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="suv" stroke="#0bbfe0" />
              <Line type="monotone" dataKey="muv" stroke="#077286" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Cancellation and Payment Metrics */}
      <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Cancellation Reasons */}
        <div className="bg-white rounded-lg p-6 shadow">
          <h2 className="text-xl font-bold text-[#077286] mb-4">
            Cancellation Reasons
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={cancellationData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  dataKey="value"
                >
                  {cancellationData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Status */}
        <div className="bg-white rounded-lg p-6 shadow">
          <h2 className="text-xl font-bold text-[#077286] mb-4">
            Payment Status
          </h2>
          <div className="flex items-center justify-around">
            <div className="text-center">
              <p className="text-4xl font-bold text-[#0bbfe0]">75%</p>
              <p className="text-sm text-gray-500">Paid</p>
            </div>
            <div className="h-40 w-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {paymentData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-[#ff6b6b]">25%</p>
              <p className="text-sm text-gray-500">Unpaid</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

const StatCard = ({ title, value, color }) => (
  <motion.div
    className="bg-white rounded-lg p-6 shadow"
    whileHover={{ scale: 1.05 }}
  >
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
);

const TimeFrameSelector = ({ timeFrame, setTimeFrame }) => (
  <div className="flex space-x-2">
    {["daily", "weekly", "monthly"].map((frame) => (
      <button
        key={frame}
        className={`px-4 py-2 border rounded ${
          timeFrame === frame ? "bg-blue-500 text-white" : "bg-white"
        }`}
        onClick={() => setTimeFrame(frame)}
      >
        {frame.charAt(0).toUpperCase() + frame.slice(1)}
      </button>
    ))}
  </div>
);

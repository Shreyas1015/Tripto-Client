// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import secureLocalStorage from "react-secure-storage";
// import axiosInstance from "../../API/axiosInstance";

// const DriversDashboardContent = () => {
//   const navigate = useNavigate();
//   const [bookingsInfo, setBookingsInfo] = useState([]);
//   const [passengerInfo, setPassengerInfo] = useState([]);
//   const uid = localStorage.getItem("@secure.n.uid");
//   const decryptedUID = secureLocalStorage.getItem("uid");

//   useEffect(() => {
//     const fetchBookingsDataTable = async () => {
//       try {
//         const res = await axiosInstance.post(
//           `${process.env.REACT_APP_BASE_URL}/drivers/fetchBookingsDataTable`,
//           { decryptedUID }
//         );
//         setBookingsInfo(res.data.bookingInfo);
//         setPassengerInfo(res.data.passengerInfo);
//         console.log(res.data);
//       } catch (error) {
//         console.error("Bookings Data Fetch Error: ", error.message);
//       }
//     };

//     fetchBookingsDataTable();
//   }, [decryptedUID]);

//   const BackToLogin = () => {
//     navigate("/");
//   };

//   if (!uid) {
//     return (
//       <>
//         <div className="container text-center fw-bold">
//           <h2>INVALID URL. Please provide a valid UID.</h2>
//           <button onClick={BackToLogin} className="btn blue-buttons">
//             Back to Login
//           </button>
//         </div>
//       </>
//     );
//   }

//   return (
//     <>
//       <div className="container-fluid">
//         <h2>Drivers Dashboard</h2>
//         <hr />
//         <div className="table-responsive">
//           <table className="table text-center table-bordered rounded-3">
//             <thead className="table-dark">
//               <tr>
//                 <th className="px-4">Sr No.</th>
//                 <th className="px-4">Pick-Up Location</th>
//                 <th className="px-4">Drop Location</th>
//                 <th>Pick-Up Date & Time</th>
//                 <th>Return Date & Time</th>
//                 <th>No. Of Days</th>
//                 <th>Trip Type</th>
//                 <th>Trip Status</th>
//                 <th>Distance</th>
//                 <th>Selected Car</th>
//                 <th>Total Amount</th>
//                 <th>Passenger Name</th>
//                 <th>Passenger Phone No.</th>
//               </tr>
//             </thead>
//             <tbody>
//               {bookingsInfo.map((booking, index) => (
//                 <tr key={index}>
//                   <th>{index + 1}</th>
//                   <td>{booking.pickup_location}</td>
//                   <td>{booking.drop_location}</td>
//                   <td>{booking.pickup_date_time}</td>
//                   <td>{booking.drop_date_time}</td>
//                   <td>{booking.no_of_days}</td>
//                   <td>
//                     {booking.trip_type === 1 ? "One Way Trip" : "Round Trip"}
//                   </td>
//                   <td>
//                     {booking.trip_status === 0
//                       ? "Pending"
//                       : booking.trip_status === 1
//                       ? "Accepted"
//                       : "Completed"}
//                   </td>
//                   <td>{booking.distance} KM</td>
//                   <td>
//                     {booking.selected_car === 1
//                       ? "( 4 + 1 SEDAN )"
//                       : "( 6 + 1 SUV , MUV )"}
//                   </td>
//                   <td>{booking.price}</td>
//                   <td>{passengerInfo[index].name}</td>
//                   <td>{passengerInfo[index].phone_number}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </>
//   );
// };

// export default DriversDashboardContent;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import axiosInstance from "../../API/axiosInstance";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  MapPin,
  Calendar,
  Car,
  User,
  DollarSign,
  ArrowRight,
  ArrowLeftRight,
  Star,
  TrendingUp,
  Award,
} from "lucide-react";
import DriversHeader from "./DriversHeader";

// Mock data for demo (replace with fetched data)
const earningsData = [
  { name: "Mon", earnings: 120 },
  { name: "Tue", earnings: 180 },
  { name: "Wed", earnings: 200 },
  { name: "Thu", earnings: 150 },
  { name: "Fri", earnings: 300 },
  { name: "Sat", earnings: 400 },
  { name: "Sun", earnings: 280 },
];

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const getOrdinalSuffix = (day) => {
  if (day > 3 && day < 21) return "th"; // covers 11th to 20th
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

const formatDateTime = (dateTime) => {
  const date = new Date(dateTime);
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const dayWithSuffix = `${day}${getOrdinalSuffix(day)}`;

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const time = `${hours}:${minutes} ${ampm}`;

  return `${dayWithSuffix} ${month} ${year}, ${time}`;
};

const TripCard = ({ trip }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="bg-white rounded-lg shadow p-4 mb-4"
    >
      <div
        className={`h-2 ${
          trip.trip_status == 1
            ? "bg-green-500"
            : trip.trip_status == 0
            ? "bg-yellow-500"
            : "bg-red-500"
        }`}
      />
      <div className="flex justify-between items-center py-3">
        <div>
          <span className="text-md text-[#0bbfe0] my-2 font-bold">
            {trip.trip_type === 2 ? "Round Trip" : "One-way"}
          </span>
          <div className="text-2xl font-bold my-2">${trip.price}</div>
        </div>
        <div>
          <span>{formatDateTime(trip.pickup_date_time)}</span>
        </div>
      </div>
      <div className="text-sm text-gray-600 mt-2">
        <div className="flex items-center">
          <MapPin className="w-4 h-4 mr-1" />
          {trip.pickup_location}
        </div>
        <div className="flex items-center mt-1">
          <MapPin className="w-4 h-4 mr-1" />
          {trip.drop_location}
        </div>
        <div className="mt-2 flex justify-between items-center text-[#0bbfe0]">
          <div className="mt-2 ">
            <Car className="w-10 h-10" />
            {trip.selected_car === 1 ? (
              <span className="pl-1">Sedan</span>
            ) : (
              <span className="pl-1">SUV</span>
            )}
          </div>
          <div className="mt-2 text-lg">{trip.distance} KM</div>
        </div>
        {trip.rating > 0 && (
          <div className="mt-2 flex items-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < trip.rating ? "text-yellow-400" : "text-gray-300"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default function DriversDashboardContent() {
  const navigate = useNavigate();
  const [bookingsInfo, setBookingsInfo] = useState([]);
  const uid = localStorage.getItem("@secure.n.uid");
  const decryptedUID = secureLocalStorage.getItem("uid");

  useEffect(() => {
    const fetchBookingsDataTable = async () => {
      try {
        const res = await axiosInstance.post(
          `${process.env.REACT_APP_BASE_URL}/drivers/fetchBookingsDataTable`,
          { decryptedUID }
        );
        setBookingsInfo(res.data.bookingInfo);
        console.log(res.data.bookingInfo);
      } catch (error) {
        console.error("Bookings Data Fetch Error: ", error.message);
      }
    };

    fetchBookingsDataTable();
  }, [decryptedUID]);

  const BackToLogin = () => {
    navigate("/");
  };

  if (!uid) {
    return (
      <div className="container text-center font-bold">
        <h2>INVALID URL. Please provide a valid UID.</h2>
        <button onClick={BackToLogin} className="btn-blue">
          Back to Login
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* <header className="bg-gradient-to-r from-[#0bbfe0] to-[#077286] text-white p-6 rounded-b-3xl shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <div className="rounded-full w-16 h-16 bg-gray-300 mr-4"></div>
            <div>
              <h1 className="text-3xl font-bold">John Driver</h1>
              <div className="flex items-center">
                <Star className="w-5 h-5 text-yellow-400" />
                <span className="ml-1 text-lg">4.8</span>
              </div>
            </div>
          </div>
          <div className="flex space-x-6">
            <div className="text-center">
              <div>Total Trips</div>
              <div className="text-3xl font-bold">250</div>
            </div>
            <div className="text-center">
              <div>Total Earnings</div>
              <div className="text-3xl font-bold">$5,250</div>
            </div>
          </div>
        </div>
      </header> */}
      <DriversHeader />

      <main className="container mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Weekly Performance</h2>
              <div>
                <div className="flex justify-between text-sm text-gray-500 mb-1">
                  <span>Trips Completed</span>
                  <span>25/30</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-lg">
                  <div
                    className="h-full bg-gradient-to-r from-[#0bbfe0] to-[#077286] "
                    style={{ width: "83%" }}
                  />
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Weekly Earnings</h2>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={earningsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="earnings"
                    stroke="#007286"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div
              className="bg-white p-4 rounded-lg shadow overflow-scroll"
              style={{ height: "31.5rem" }}
            >
              <h2 className="text-2xl font-bold">Trip History</h2>
              <div className="mt-6">
                <AnimatePresence>
                  {bookingsInfo.map((trip, index) => (
                    <TripCard key={index} trip={trip} />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* <footer className="bg-blue-600 text-white p-4 mt-8">
        <div className="container mx-auto flex justify-between">
          <div className="flex space-x-4">
            <button className="hover:text-gray-200">Support</button>
            <button className="hover:text-gray-200">FAQs</button>
            <button className="hover:text-gray-200">Settings</button>
          </div>
          <div className="text-sm">© 2023 TRIPTO. All rights reserved.</div>
        </div>
      </footer> */}
    </div>
  );
}

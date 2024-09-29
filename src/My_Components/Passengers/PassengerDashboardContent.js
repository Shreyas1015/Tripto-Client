// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import secureLocalStorage from "react-secure-storage";
// import axiosInstance from "../../API/axiosInstance";
// import {
//   Avatar,
//   Badge,
//   Button,
//   Card,
//   CardContent,
//   CardHeader,
//   CircularProgress,
//   Divider,
//   Grid,
//   Typography,
//   Tabs,
//   Tab,
// } from "@mui/material";

// const EnhancedPassengerDashboard = () => {
//   const navigate = useNavigate();
//   const [bookings, setBookings] = useState([]);
//   const [activeTab, setActiveTab] = useState("details");
//   const [activeTripIndex, setActiveTripIndex] = useState(0); // State to track the active trip
//   const uid = localStorage.getItem("@secure.n.uid");
//   const decryptedUID = secureLocalStorage.getItem("uid");

//   useEffect(() => {
//     const fetchBookingsDataTable = async () => {
//       try {
//         const res = await axiosInstance.post(
//           `${process.env.REACT_APP_BASE_URL}/passengers/fetchBookingsDataTable`,
//           { decryptedUID }
//         );

//         setBookings(res.data);
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
//       <div className="container text-center fw-bold">
//         <h2>INVALID URL. Please provide a valid UID.</h2>
//         <Button variant="contained" color="primary" onClick={BackToLogin}>
//           Back to Login
//         </Button>
//       </div>
//     );
//   }

//   // Select the active trip data based on activeTripIndex
//   const tripData = bookings[activeTripIndex] || {};

//   return (
//     <div className="min-h-screen p-4">
//       {/* Map through bookings to create a tab or card for each trip */}
//       <Tabs
//         value={activeTripIndex}
//         onChange={(event, newValue) => setActiveTripIndex(newValue)}
//         sx={{ marginBottom: 2 }}
//       >
//         {bookings.map((trip, index) => (
//           <Tab
//             key={trip.bid}
//             label={`Trip #${trip.bid}`}
//             value={index}
//             sx={{ textTransform: "none" }}
//           />
//         ))}
//       </Tabs>

//       <Card variant="outlined">
//         <CardContent>
//           <Grid container spacing={2} alignItems="center">
//             <Grid item>
//               <Avatar
//                 alt="Passenger"
//                 src="/placeholder-avatar.jpg"
//                 sx={{ width: 56, height: 56 }}
//               />
//             </Grid>
//             <Grid item xs>
//               <Typography variant="h5">{tripData.name}</Typography>
//               <Typography color="textSecondary">
//                 Trip ID: {tripData.bid}
//               </Typography>
//               <Badge
//                 badgeContent={
//                   tripData.trip_status === 0
//                     ? "Pending"
//                     : tripData.trip_status === 1
//                     ? "Accepted"
//                     : "Completed"
//                 }
//                 color={
//                   tripData.trip_status === 0
//                     ? "warning"
//                     : tripData.trip_status === 1
//                     ? "info"
//                     : "success"
//                 }
//               />
//             </Grid>
//             <Grid item>
//               <CircularProgress
//                 variant="determinate"
//                 value={
//                   tripData.trip_status === 0
//                     ? 33
//                     : tripData.trip_status === 1
//                     ? 66
//                     : 100
//                 }
//               />
//             </Grid>
//           </Grid>
//         </CardContent>
//       </Card>

//       <Tabs
//         value={activeTab}
//         onChange={(event, newValue) => setActiveTab(newValue)}
//         sx={{ marginTop: 2 }}
//       >
//         <Tab label="Trip Details" value="details" />
//         <Tab label="Route" value="route" />
//         <Tab label="Payment" value="payment" />
//       </Tabs>

//       <Card variant="outlined" sx={{ marginTop: 2 }}>
//         <CardHeader
//           title={
//             activeTab === "details"
//               ? "Trip Schedule"
//               : activeTab === "route"
//               ? "Trip Route"
//               : "Payment Details"
//           }
//         />
//         <CardContent>
//           {activeTab === "details" && (
//             <>
//               <Typography variant="body1">
//                 Pick-Up: {tripData.pickup_date_time}
//               </Typography>
//               <Typography variant="body1">
//                 Return: {tripData.drop_date_time}
//               </Typography>
//               <Typography variant="body1">
//                 Duration: {tripData.no_of_days} days
//               </Typography>
//               <Typography variant="body1">
//                 Trip Type: {tripData.trip_type}
//               </Typography>
//             </>
//           )}
//           {activeTab === "route" && (
//             <>
//               <Typography variant="body1">
//                 Pick-Up Location: {tripData.pickup_location}
//               </Typography>
//               <Typography variant="body1">
//                 Drop Location: {tripData.drop_location}
//               </Typography>
//             </>
//           )}
//           {activeTab === "payment" && (
//             <>
//               <Typography variant="body1">
//                 Total Amount: {tripData.price}
//               </Typography>
//             </>
//           )}
//         </CardContent>
//       </Card>

//       <Card variant="outlined" sx={{ marginTop: 2 }}>
//         <CardHeader title="Vehicle Details" />
//         <CardContent>
//           <Typography variant="body1">
//             Selected Car: {tripData.selected_car}
//           </Typography>
//           <Typography variant="body1">Distance: {tripData.distance}</Typography>
//           <Divider sx={{ margin: "16px 0" }} />
//           <Button variant="contained" color="primary" fullWidth>
//             Modify Booking
//           </Button>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default EnhancedPassengerDashboard;

// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import secureLocalStorage from "react-secure-storage";
// import axiosInstance from "../../API/axiosInstance";
// import {
//   Avatar,
//   Badge,
//   Button,
//   Card,
//   CardContent,
//   CircularProgress,
//   Grid,
//   Typography,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Tabs,
//   Tab,
// } from "@mui/material";
// import Header from "../Header";

// const EnhancedPassengerDashboard = () => {
//   const navigate = useNavigate();
//   const [bookings, setBookings] = useState([]);
//   const [activeTab, setActiveTab] = useState("details");
//   const [selectedTripIndex, setSelectedTripIndex] = useState(null); // State to track the selected trip
//   const [dialogOpen, setDialogOpen] = useState(false); // State to control dialog visibility
//   const uid = localStorage.getItem("@secure.n.uid");
//   const decryptedUID = secureLocalStorage.getItem("uid");

//   useEffect(() => {
//     const fetchBookingsDataTable = async () => {
//       try {
//         const res = await axiosInstance.post(
//           `${process.env.REACT_APP_BASE_URL}/passengers/fetchBookingsDataTable`,
//           { decryptedUID }
//         );

//         setBookings(res.data);
//         console.log(res.data);
//       } catch (error) {
//         console.error("Bookings Data Fetch Error: ", error.message);
//       }
//     };

//     fetchBookingsDataTable();
//   }, [decryptedUID]);

// const BackToLogin = () => {
//   navigate("/");
// };

// if (!uid) {
//   return (
//     <div className="container text-center fw-bold">
//       <h2>INVALID URL. Please provide a valid UID.</h2>
//       <Button variant="contained" color="primary" onClick={BackToLogin}>
//         Back to Login
//       </Button>
//     </div>
//   );
// }

//   // Select the active trip data based on selectedTripIndex
//   const tripData = bookings[selectedTripIndex] || {};

//   return (
//     <div
//       className="min-h-screen p-4"
//       style={{ filter: dialogOpen ? "blur(5px)" : "none" }}
//     >
//       <Header />

//       <Grid container spacing={2} marginTop={5}>
//         {bookings.map((trip, index) => (
//           <Grid item xs={12} key={trip.bid}>
//             <Card variant="outlined">
//               <CardContent>
//                 <Grid container spacing={2} alignItems="center">
//                   <Grid item>
//                     <Avatar
//                       alt="Passenger"
//                       src="/placeholder-avatar.jpg"
//                       sx={{ width: 56, height: 56 }}
//                     />
//                   </Grid>
//                   <Grid item xs>
//                     <Typography variant="h6">Trip ID: {trip.bid}</Typography>
//                   </Grid>
//                   <Grid item>
//                     <Button
//                       variant="contained"
//                       color="primary"
//                       onClick={() => {
//                         setSelectedTripIndex(index);
//                         setDialogOpen(true);
//                       }}
//                     >
//                       View Details
//                     </Button>
//                   </Grid>
//                 </Grid>
//               </CardContent>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>

//       <Dialog
//         open={dialogOpen}
//         onClose={() => setDialogOpen(false)}
//         fullWidth
//         maxWidth="md"
//       >
//         <DialogTitle>Trip Details</DialogTitle>
//         <DialogContent>
//           <Tabs
//             value={activeTab}
//             onChange={(event, newValue) => setActiveTab(newValue)}
//             sx={{ marginTop: 2 }}
//           >
//             <Tab label="Trip Details" value="details" />
//             <Tab label="Route" value="route" />
//             <Tab label="Payment" value="payment" />
//           </Tabs>

//           <Card variant="outlined" sx={{ marginTop: 2 }}>
//             <CardContent>
//               {activeTab === "details" && (
//                 <>
//                   <Typography variant="body1">
//                     Pick-Up: {tripData.pickup_date_time}
//                   </Typography>
//                   <Typography variant="body1">
//                     Return: {tripData.drop_date_time}
//                   </Typography>
//                   <Typography variant="body1">
//                     Duration: {tripData.no_of_days} days
//                   </Typography>
//                   <Typography variant="body1">
//                     Trip Type: {tripData.trip_type}
//                   </Typography>
//                 </>
//               )}
//               {activeTab === "route" && (
//                 <>
//                   <Typography variant="body1">
//                     Pick-Up Location: {tripData.pickup_location}
//                   </Typography>
//                   <Typography variant="body1">
//                     Drop Location: {tripData.drop_location}
//                   </Typography>
//                 </>
//               )}
//               {activeTab === "payment" && (
//                 <>
//                   <Typography variant="body1">
//                     Total Amount: {tripData.price}
//                   </Typography>
//                 </>
//               )}
//             </CardContent>
//           </Card>

//           <Card variant="outlined" sx={{ marginTop: 2 }}>
//             <CardContent>
//               <Typography variant="body1">
//                 Selected Car: {tripData.selected_car}
//               </Typography>
//               <Typography variant="body1">
//                 Distance: {tripData.distance}
//               </Typography>
//             </CardContent>
//           </Card>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setDialogOpen(false)} color="primary">
//             Close
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </div>
//   );
// };

// export default EnhancedPassengerDashboard;

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Calendar,
  Clock,
  Car,
  DollarSign,
  ArrowRight,
  Scale,
} from "lucide-react";
import secureLocalStorage from "react-secure-storage";
import axiosInstance from "../../API/axiosInstance";

export default function EnhancedPassengerDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("details");
  const [progress, setProgress] = useState(66);
  const [bookings, setBookings] = useState([]);
  const [selectedTripIndex, setSelectedTripIndex] = useState(null);
  const uid = localStorage.getItem("@secure.n.uid");
  const decryptedUID = secureLocalStorage.getItem("uid");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axiosInstance.post(
          `${process.env.REACT_APP_BASE_URL}/passengers/fetchBookingsDataTable`,
          { decryptedUID }
        );
        setBookings(res.data);
      } catch (error) {
        console.error("Bookings Data Fetch Error: ", error.message);
      }
    };

    fetchBookings();
  }, [decryptedUID]);

  useEffect(() => {
    const timer = setTimeout(() => setProgress(100), 3000);
    return () => clearTimeout(timer);
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const BackToLogin = () => {
    navigate("/");
  };

  if (!uid) {
    return (
      <div className="container text-center fw-bold">
        <h2>INVALID URL. Please provide a valid UID.</h2>
        <button className="" onClick={BackToLogin}>
          Back to Login
        </button>
      </div>
    );
  }

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const selectedTrip = bookings[selectedTripIndex] || {};

  return (
    <>
      {/* <div className="min-h-screen bg-gradient-to-br from-[#e6f7fb] to-[#e0f2f7] p-8">
        <div className="max-w-7xl mx-auto"> */}
      {/* Header */}
      <header className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 ring-2 ring-[#0bbfe0] rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold text-white">
              JD
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#0bbfe0] to-[#077286]">
                Passenger Dashboard
              </h1>
              <p className="text-gray-500">Welcome back!</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Trip List */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-xl font-bold mb-4">Your Trips</h2>
            <div className="h-[600px] overflow-y-auto pr-4">
              {bookings.map((trip, index) => (
                <motion.div
                  key={trip.bid}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  className="mb-4 bg-white p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setSelectedTripIndex(index)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">Trip ID: {trip.bid}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(trip.pickup_date_time).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="px-2 py-1 bg-gradient-to-r from-[#0bbfe0] to-[#077286] text-white rounded-lg">
                      {trip.trip_status == 0
                        ? "Pending"
                        : trip.trip_status == 1
                        ? "Accepted"
                        : "Completed"}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Trip Details */}
        <div className="lg:col-span-2 space-y-8">
          {selectedTripIndex !== null ? (
            <div>
              <div className="grid grid-cols-3 gap-4 mb-8">
                <button
                  onClick={() => setActiveTab("details")}
                  className={`p-4 text-lg font-semibold border-b-4 ${
                    activeTab === "details"
                      ? "border-[#0bbfe0] text-[#0bbfe0]"
                      : "border-transparent text-gray-500"
                  }`}
                >
                  Trip Details
                </button>
                <button
                  onClick={() => setActiveTab("route")}
                  className={`p-4 text-lg font-semibold border-b-4 ${
                    activeTab === "route"
                      ? "border-[#0bbfe0] text-[#0bbfe0]"
                      : "border-transparent text-gray-500"
                  }`}
                >
                  Route
                </button>
                <button
                  onClick={() => setActiveTab("payment")}
                  className={`p-4 text-lg font-semibold border-b-4 ${
                    activeTab === "payment"
                      ? "border-[#0bbfe0] text-[#0bbfe0]"
                      : "border-transparent text-gray-500"
                  }`}
                >
                  Payment
                </button>
              </div>
              <AnimatePresence mode="wait">
                {activeTab === "details" && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="bg-white p-6 rounded-lg shadow-lg"
                  >
                    <h2 className="text-2xl font-bold mb-4 flex items-center space-x-2">
                      <Calendar className="h-6 w-6 text-[#0bbfe0]" />
                      <span>Trip Schedule</span>
                    </h2>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="font-semibold text-gray-600 mb-2">
                          Pick-Up Date & Time
                        </label>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#0bbfe0]" />
                          <input
                            className="border border-gray-300 rounded pl-10 py-2 w-full"
                            value={formatDateTime(
                              selectedTrip.pickup_date_time
                            )}
                            readOnly
                          />
                        </div>
                      </div>
                      <div>
                        <label className="font-semibold text-gray-600 mb-2">
                          Return Date & Time
                        </label>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#0bbfe0]" />
                          <input
                            className="border border-gray-300 rounded pl-10 py-2 w-full"
                            value={formatDateTime(selectedTrip.drop_date_time)}
                            readOnly
                          />
                        </div>
                      </div>
                      <div>
                        <label className="font-semibold text-gray-600 mb-2 ">
                          Duration
                        </label>
                        <input
                          className="border border-gray-300 rounded p-2 w-full"
                          value={`${
                            selectedTrip.no_of_days == null
                              ? "1 day"
                              : selectedTrip.no_of_days + " days"
                          } `}
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-gray-600 mb-2 ">
                          Trip Type
                        </label>
                        <input
                          className="border border-gray-300 rounded p-2 w-full"
                          value={
                            selectedTrip.trip_type == 1
                              ? "One-Way Trip"
                              : selectedTrip.trip_type == 2
                              ? "Round Trip"
                              : "Trip Not Selected"
                          }
                          readOnly
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "route" && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="bg-white p-6 rounded-lg shadow-lg"
                  >
                    <h2 className="text-2xl font-bold mb-4 flex items-center space-x-2">
                      <MapPin className="h-6 w-6 text-[#0bbfe0]" />
                      <span>Trip Route</span>
                    </h2>
                    <div className="space-y-6">
                      {/* First Row: Pick-Up and Drop Locations */}
                      <div className="flex space-x-4">
                        <div className="flex-1">
                          <label className="font-semibold text-gray-600 mb-2">
                            Pick-Up Location
                          </label>
                          <input
                            className="border border-gray-300 rounded p-2 w-full"
                            value={selectedTrip.pickup_location}
                            readOnly
                          />
                        </div>
                        <div className="flex-1">
                          <label className="font-semibold text-gray-600 mb-2">
                            Drop Location
                          </label>
                          <input
                            className="border border-gray-300 rounded p-2 w-full"
                            value={selectedTrip.drop_location}
                            readOnly
                          />
                        </div>
                      </div>
                      {/* Second Row: Vehicle Model and Distance */}
                      <div className="flex space-x-4">
                        <div className="flex-1">
                          <label className="font-semibold text-gray-600 mb-2">
                            Vehicle Model
                          </label>
                          <input
                            className="border border-gray-300 rounded p-2 w-full"
                            value={
                              selectedTrip.selected_car === 1
                                ? "4+1 (SEDAN)"
                                : selectedTrip.selected_car === 2
                                ? "6+1 (SUV, MUV)"
                                : "No Car Selected"
                            }
                            readOnly
                          />
                        </div>
                        <div className="flex-1">
                          <label className="font-semibold text-gray-600 mb-2">
                            Distance
                          </label>
                          <input
                            className="border border-gray-300 rounded p-2 w-full"
                            value={selectedTrip.distance + " KM"}
                            readOnly
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "payment" && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="bg-white p-6 rounded-lg shadow-lg"
                  >
                    <h2 className="text-2xl font-bold mb-4 flex items-center space-x-2">
                      <DollarSign className="h-6 w-6 text-[#0bbfe0]" />
                      <span>Payment Details</span>
                    </h2>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="font-semibold text-gray-600 mb-2">
                          Total Fare
                        </label>
                        <input
                          className="border border-gray-300 rounded p-2 w-full"
                          value={`$${selectedTrip.price}`}
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-gray-600 mb-2">
                          Payment Status
                        </label>
                        <input
                          className="border border-gray-300 rounded p-2 w-full"
                          value={selectedTrip.payment_status}
                          readOnly
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <h2 className="text-2xl font-semibold">
                Select a trip to view details.
              </h2>
            </div>
          )}
        </div>
      </div>
      {/* </div>
      </div> */}
    </>
  );
}

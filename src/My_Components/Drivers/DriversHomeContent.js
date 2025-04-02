// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import axiosInstance from "../../API/axiosInstance";
// import secureLocalStorage from "react-secure-storage";
// import { toast } from "react-hot-toast";

// const DriversHomeContent = () => {
//   const navigate = useNavigate();
//   const uid = localStorage.getItem("@secure.n.uid");
//   const decryptedUID = secureLocalStorage.getItem("uid");

//   const [bookingsData, setBookingsData] = useState([]);

//   useEffect(() => {
//     const fetchBookingsDetails = async () => {
//       try {
//         const res = await axiosInstance.post(
//           `${process.env.REACT_APP_BASE_URL}/drivers/fetchBookingsDetails`,
//           { decryptedUID }
//         );
//         if (res.status === 200) {
//           setBookingsData(res.data);
//           console.log(res.data);
//         } else {
//           toast.error("Error Fetching Bookings Details!");
//         }
//       } catch (error) {
//         console.log(error);
//       }
//     };

//     // Initial fetch
//     fetchBookingsDetails();

//     // Set up polling interval
//     const intervalId = setInterval(fetchBookingsDetails, 5000); // Poll every 5 seconds

//     // Clean up interval on component unmount
//     return () => clearInterval(intervalId);
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
//         <h2>Drivers Home Page</h2>
//         <hr />
//         <div className="bookings row">
//           {bookingsData.map((booking) => (
//             <div className="col-lg-12" key={booking.bid}>
//               <div className="card my-3 mx-auto" style={{ height: "20rem" }}>
//                 <div className="card-body">
//                   <h5 className="card-title">
//                     {booking.trip_type === 1 ? "One Way Trip" : "Round Trip"}
//                   </h5>
//                   <p
//                     style={{
//                       overflow: "hidden",
//                       whiteSpace: "nowrap",
//                       textOverflow: "ellipsis",
//                     }}
//                   >
//                     {" "}
//                     Pickup: {booking.pickup_location}
//                   </p>
//                   <p
//                     style={{
//                       overflow: "hidden",
//                       whiteSpace: "nowrap",
//                       textOverflow: "ellipsis",
//                     }}
//                   >
//                     Drop: {booking.drop_location}
//                   </p>

//                   <p className="card-text text-secondary">
//                     Date & Time :{" "}
//                     {new Date(booking.pickup_date_time).toLocaleString(
//                       "en-GB",
//                       {
//                         year: "numeric",
//                         month: "short",
//                         day: "numeric",
//                         hour: "numeric",
//                         minute: "numeric",
//                         hour12: true,
//                       }
//                     )}
//                   </p>
//                   <div className="col-lg-6">
//                     <Link to={`/booking-details?bid=${booking.bid}`}>
//                       <button className="btn blue-buttons">View Details</button>
//                     </Link>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </>
//   );
// };

// export default DriversHomeContent;
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../API/axiosInstance";
import secureLocalStorage from "react-secure-storage";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import {
  Car,
  MapPin,
  Calendar,
  CheckCircle,
  User,
  ArrowLeftRight,
  ArrowRight,
} from "lucide-react"; // Importing icons from Lucide React

const DriversHomeContent = () => {
  const navigate = useNavigate();
  const uid = localStorage.getItem("@secure.n.uid");
  const decryptedUID = secureLocalStorage.getItem("uid");
  const [bookingsData, setBookingsData] = useState([]);

  useEffect(() => {
    const fetchBookingsDetails = async () => {
      try {
        const res = await axiosInstance.post(
          `${process.env.REACT_APP_BASE_URL}/drivers/fetchBookingsDetails`,
          { decryptedUID }
        );

        if (res.status === 200) {
          if (res.data.length === 0) {
            // If no trips are found, set an empty array and show a "No trips found" message
            setBookingsData([]);
            console.log("No trips found for today.");
          } else {
            // If trips are found, update the state with the data
            setBookingsData(res.data);
            console.log("Bookings Data:", res.data);
          }
        } else {
          // Handle unexpected status codes
          toast.error("Unexpected response from the server.");
        }
      } catch (error) {
        // Handle actual errors (e.g., network issues)
        toast.error("Error Fetching Bookings Details!");
        console.log(error);
      }
    };

    fetchBookingsDetails();
    const intervalId = setInterval(fetchBookingsDetails, 15000); // Poll every 15 seconds

    return () => clearInterval(intervalId);
  }, [decryptedUID]);

  const handleSubmit = async (bid, e) => {
    e.preventDefault();
    console.log("Form submitted for bid:", bid);

    // Find the particular booking based on bid
    const booking = bookingsData.find((item) => item.bid === bid);
    console.log("Particular Selected Booking:", booking);

    if (!booking) {
      console.error("Booking not found!");
      toast.error("Booking not found!");
      return;
    }

    try {
      console.log(
        "Sending request to API:",
        `${process.env.REACT_APP_BASE_URL}/drivers/driverAcceptBooking`
      );
      console.log("Request payload:", { decryptedUID, booking });

      const res = await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/drivers/driverAcceptBooking`,
        { decryptedUID, booking }
      );

      console.log("Response received from API:", res);

      if (res.status === 200) {
        console.log("Booking accepted successfully");

        // Optionally, update the state by removing the accepted booking
        const updatedBookings = bookingsData.filter((item) => item.bid !== bid);
        setBookingsData(updatedBookings);

        console.log("Updated bookings list:", updatedBookings);

        // Only redirect to driver-navigation for one-way trips
        if (booking.trip_type === 1) {
          console.log("Trip type is One-Way");

          const currentTime = new Date();
          const pickupTime = new Date(booking.pickup_date_time);
          console.log("Current Time:", currentTime);
          console.log("Pickup Time:", pickupTime);

          // Check if the trip is within the next 30 minutes
          const timeDifferenceInMinutes =
            (pickupTime - currentTime) / (1000 * 60);
          console.log("Time difference in minutes:", timeDifferenceInMinutes);

          if (timeDifferenceInMinutes <= 30 && timeDifferenceInMinutes >= 0) {
            console.log("Redirecting to driver-navigation...");
            navigate(`/driver-navigation?uid=${uid}`, {
              state: { rideDetails: booking },
            });
          } else {
            console.log(
              "Trip is not within the next 30 minutes, no navigation."
            );
          }

          toast.success("Booking has been accepted!");
        } else {
          console.log(
            "Trip type is Round-Trip, navigating to drivers dashboard..."
          );
          navigate(`/driversdashboard?uid=${uid}`);
        }
      }
    } catch (error) {
      console.error("Error Submitting Details:", error);
      toast.error("Error Submitting Details, Car Type does not match");
    }
  };

  const BackToLogin = () => {
    navigate("/");
  };

  const formatDateTime = (isoString) => {
    const date = new Date(isoString); // Convert UTC string to Date object

    const formattedDate = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    const formattedTime = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      second: "numeric", // Add seconds if needed
      hour12: true, // Converts to AM/PM format
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, // Automatically adjusts for local timezone
    });

    return { formattedDate, formattedTime };
  };

  if (!uid) {
    return (
      <div className="container text-center fw-bold">
        <h2>INVALID URL. Please provide a valid UID.</h2>
        <button onClick={BackToLogin} className="btn blue-buttons">
          Back to Login
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-4 pt-24 pb-20">
        <h1 className="text-3xl font-bold text-[#077286] mb-8">
          Available Bookings
        </h1>

        {bookingsData.length > 0 ? (
          bookingsData.map((booking) => {
            const { formattedDate, formattedTime } = formatDateTime(
              booking.pickup_date_time
            );

            return (
              <div
                className="relative bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg mb-8"
                key={booking.id}
              >
                {/* Vendor Booking Notch */}
                {booking.vid && (
                  <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                    Vendor Booking
                  </div>
                )}

                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <span
                      className={`text-lg font-semibold px-4 py-2 rounded-full ${
                        booking.trip_type === 2
                          ? "bg-purple-100 text-purple-600"
                          : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {booking.trip_type === 2 ? (
                        <ArrowLeftRight className="w-5 h-5 mr-2 inline-block" />
                      ) : (
                        <ArrowRight className="w-5 h-5 mr-2 inline-block" />
                      )}
                      {booking.trip_type === 2 ? "Round Trip" : "One-way"}
                    </span>
                    <div className="text-right">
                      <div className="text-lg text-gray-500">
                        {formattedDate}
                      </div>
                      <div className="text-xl font-semibold">
                        {formattedTime}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-center">
                      <MapPin className="w-6 h-6 mr-3 text-[#0bbfe0]" />
                      <span className="text-base">
                        {booking.pickup_location}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-6 h-6 mr-3 text-[#077286]" />
                      <span className="text-base">{booking.drop_location}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center">
                      <Car className="w-10 h-10 mr-3 text-[#0bbfe0]" />
                      <span className="text-xl font-semibold">
                        {booking.selected_car === 1 ? "SEDAN" : "SUV, MUV"}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-7 h-7 mr-3 text-[#077286]" />
                      <span className="text-xl">
                        {booking.distance} • {booking.no_of_days}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-6">
                    <div className="text-4xl font-bold text-[#077286]">
                      ${booking.price}
                    </div>
                    <div className="flex items-center">
                      <User className="w-6 h-6 mr-2 text-gray-500" />
                      <span className="text-xl text-gray-600">
                        {booking.passengerName}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between space-x-4">
                    <button
                      onClick={(e) => handleSubmit(booking.bid, e)}
                      className="btn blue-buttons"
                    >
                      Accept Booking
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-12"
          >
            <CheckCircle className="w-16 h-16 text-[#0bbfe0] mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-[#077286] mb-2">
              All Caught Up!
            </h2>
            <p className="text-gray-600">
              No more bookings available at the moment.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DriversHomeContent;

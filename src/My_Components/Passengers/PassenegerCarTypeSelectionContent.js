// import React from "react";
// import { motion } from "framer-motion";
// import { useLocation, useNavigate } from "react-router-dom";
// import { ArrowRight, Car } from "lucide-react";
// import secureLocalStorage from "react-secure-storage";
// import axiosInstance from "../../API/axiosInstance";
// import toast from "react-hot-toast";

// export default function CarTypeSelection() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const uid = localStorage.getItem("@secure.n.uid");
//   const decryptedUID = secureLocalStorage.getItem("uid");
//   const { fourSeater, sixSeater, oneWayTrip, distance } = location.state || {};

//   const [selectedCar, setSelectedCar] = React.useState("");

//   const carOptions = [
//     { type: "4 + 1", fare: fourSeater },
//     { type: "6 + 1", fare: sixSeater },
//   ];

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (selectedCar) {
//       // Determine price based on selected car type
//       const price =
//         selectedCar === "4 + 1"
//           ? fourSeater
//           : selectedCar === "6 + 1"
//           ? sixSeater
//           : 0;
//       const car_type =
//         selectedCar === "4 + 1" ? 1 : selectedCar === "6 + 1" ? 2 : 0;

//       const formData = {
//         uid: decryptedUID,
//         pid: oneWayTrip.pid,
//         pickup_location: oneWayTrip.pickup_location,
//         drop_location: oneWayTrip.drop_location,
//         pickup_date_time: oneWayTrip.pickup_date_time,
//         distance: distance,
//         selected_car: car_type,
//         price: price,
//       };

//       // Send data to backend
//       try {
//         const res = await axiosInstance.post(
//           `${process.env.REACT_APP_BASE_URL}/passengers/handleOneWayTrip`,
//           { formData, decryptedUID }
//         );

//         if (res.status === 200) {
//           toast.success(
//             `Your booking has been confirmed. Our Driver Will Soon Connect With You!`
//           );
//           navigate(`/passengerdashboard?uid=${uid}`);
//         } else {
//           console.error("Error in Booking Trip!");
//           toast.error("Error in Booking Trip!");
//         }
//       } catch (error) {
//         console.error("Error in Booking Trip: ", error.message);
//         toast.error("Error in Booking Trip!");
//       }
//     }
//   };

//   const fadeInUp = {
//     initial: { opacity: 0, y: 20 },
//     animate: { opacity: 1, y: 0 },
//     exit: { opacity: 0, y: -20 },
//     transition: { duration: 0.3 },
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-[#e6f7fb] to-[#e0f2f7] flex items-center justify-center p-4">
//       <div className="w-full max-w-2xl overflow-hidden bg-white shadow-lg rounded-lg">
//         <div className="bg-gradient-to-r from-[#0bbfe0] to-[#077286] p-6 text-white">
//           <h1 className="text-3xl font-bold">Select Car Type</h1>
//           <p className="text-[#e0f2f7]">Choose your preferred vehicle</p>
//         </div>

//         <div className="p-6">
//           <motion.form
//             onSubmit={handleSubmit}
//             {...fadeInUp}
//             className="space-y-6"
//           >
//             <div className="space-y-2">
//               <label className="text-lg font-semibold">Select Car Type</label>
//               <div className="space-y-2">
//                 {carOptions.map((car) => (
//                   <div
//                     key={car.type}
//                     className={`flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-[#0bbfe0] transition-colors ${
//                       selectedCar === car.type ? "bg-[#e0f2f7]" : ""
//                     }`}
//                   >
//                     <input
//                       type="radio"
//                       id={car.type}
//                       value={car.type}
//                       checked={selectedCar === car.type}
//                       onChange={() => setSelectedCar(car.type)}
//                       className="sr-only"
//                     />
//                     <label
//                       htmlFor={car.type}
//                       className="flex items-center cursor-pointer w-full"
//                     >
//                       <span className="h-6 w-6 mr-3 text-[#0bbfe0]">
//                         <Car />
//                       </span>
//                       <span>{car.type} Seater</span>
//                     </label>
//                     <span className="text-[#0bbfe0] w-20 text-center font-semibold">
//                       ₹{car.fare}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//             <button
//               type="submit"
//               className={`flex items-center justify-center w-auto bg-[#0bbfe0] hover:bg-[#0999b3] text-white px-4 py-2 rounded-md ${
//                 !selectedCar ? "opacity-50 cursor-not-allowed" : ""
//               }`}
//               disabled={!selectedCar}
//             >
//               Book Your Trip <ArrowRight className="ml-2 h-4 w-4" />
//             </button>
//           </motion.form>
//         </div>
//       </div>
//     </div>
//   );
// }
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, Car } from "lucide-react";
import secureLocalStorage from "react-secure-storage";
import axiosInstance from "../../API/axiosInstance";
import toast from "react-hot-toast";

export default function CarTypeSelection() {
  const navigate = useNavigate();
  const location = useLocation();
  const uid = localStorage.getItem("@secure.n.uid");
  const decryptedUID = secureLocalStorage.getItem("uid");

  // Receive both one-way and round-trip data from location state
  const { fourSeater, sixSeater, oneWayTrip, roundTrip, distance } =
    location.state || {};
  console.log("oneWayTrip: ", oneWayTrip);
  console.log("roundTrip: ", roundTrip);
  console.log("distance: ", distance);

  const [selectedCar, setSelectedCar] = useState("");

  const carOptions = [
    { type: "4 + 1", fare: fourSeater },
    { type: "6 + 1", fare: sixSeater },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedCar) {
      // Determine price based on selected car type
      const price =
        selectedCar === "4 + 1"
          ? fourSeater
          : selectedCar === "6 + 1"
          ? sixSeater
          : 0;
      const car_type =
        selectedCar === "4 + 1" ? 1 : selectedCar === "6 + 1" ? 2 : 0;

      // Check whether it's a one-way or round-trip and adjust formData accordingly
      const formData = {
        uid: decryptedUID,
        pid: oneWayTrip ? oneWayTrip.pid : roundTrip.pid, // Handle both trip types
        pickup_location: oneWayTrip
          ? oneWayTrip.pickup_location
          : roundTrip.pickup_location,
        drop_location: oneWayTrip
          ? oneWayTrip.drop_location
          : roundTrip.drop_location,
        pickup_date_time: oneWayTrip
          ? oneWayTrip.pickup_date_time
          : roundTrip.pickup_date_time,
        return_date_time: roundTrip ? roundTrip.return_date_time : null,
        distance: distance,
        selected_car: car_type,
        price: price,
        no_of_days: roundTrip ? roundTrip.no_of_days : 1,
      };

      try {
        const endpoint = oneWayTrip
          ? "/passengers/handleOneWayTrip"
          : "/passengers/handleRoundTrip"; // Adjust endpoint based on trip type

        const res = await axiosInstance.post(
          `${process.env.REACT_APP_BASE_URL}${endpoint}`,
          { formData, decryptedUID }
        );

        if (res.status === 200) {
          toast.success(
            `Your booking has been confirmed. Our Driver Will Soon Connect With You!`
          );
          navigate(`/passengerdashboard?uid=${uid}`);
        } else {
          console.error("Error in Booking Trip!");
          toast.error("Error in Booking Trip!");
        }
      } catch (error) {
        console.error("Error in Booking Trip: ", error.message);
        toast.error("Error in Booking Trip!");
      }
    }
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e6f7fb] to-[#e0f2f7] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl overflow-hidden bg-white shadow-lg rounded-lg">
        <div className="bg-gradient-to-r from-[#0bbfe0] to-[#077286] p-6 text-white">
          <h1 className="text-3xl font-bold">Select Car Type</h1>
          <p className="text-[#e0f2f7]">Choose your preferred vehicle</p>
        </div>

        <div className="p-6">
          <motion.form
            onSubmit={handleSubmit}
            {...fadeInUp}
            className="space-y-6"
          >
            <div className="space-y-2">
              <label className="text-lg font-semibold">Select Car Type</label>
              <div className="space-y-2">
                {carOptions.map((car) => (
                  <div
                    key={car.type}
                    className={`flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-[#0bbfe0] transition-colors ${
                      selectedCar === car.type ? "bg-[#e0f2f7]" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      id={car.type}
                      value={car.type}
                      checked={selectedCar === car.type}
                      onChange={() => setSelectedCar(car.type)}
                      className="sr-only"
                    />
                    <label
                      htmlFor={car.type}
                      className="flex items-center cursor-pointer w-full"
                    >
                      <span className="h-6 w-6 mr-3 text-[#0bbfe0]">
                        <Car />
                      </span>
                      <span>{car.type} Seater</span>
                    </label>
                    <span className="text-[#0bbfe0] w-20 text-center font-semibold">
                      ₹{car.fare}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <button
              type="submit"
              className={`flex items-center justify-center w-auto bg-[#0bbfe0] hover:bg-[#0999b3] text-white px-4 py-2 rounded-md ${
                !selectedCar ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={!selectedCar}
            >
              Book Your Trip <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </motion.form>
        </div>
      </div>
    </div>
  );
}

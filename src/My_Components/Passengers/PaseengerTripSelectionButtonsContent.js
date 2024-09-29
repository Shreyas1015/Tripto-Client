// import React from "react";
// import { Link, useNavigate } from "react-router-dom";
// // import secureLocalStorage from "react-secure-storage";
// import Header from "../Header";

// const PaseengerTripSelectionButtonsContent = () => {
//   const navigate = useNavigate();
//   const uid = localStorage.getItem("@secure.n.uid");
//   // const decryptedUID = secureLocalStorage.getItem("uid");

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
//       <div className="container-fluid min-vh-100">
//         <Header />
//         {/* <div className="row">
//           <div className="col-lg-6">
//             <Link to={`/oneWayTrip?uid=${uid}`}>
//               <button className="btn btn-lg btn-outline-dark">
//                 One Way Trip
//               </button>
//             </Link>
//           </div>
//           <div className="col-lg-6">
//             <Link to={`/roundTrip?uid=${uid}`}>
//               <button className="btn btn-lg btn-outline-dark">
//                 Round Trip
//               </button>
//             </Link>
//           </div>
//         </div> */}

//         <div className="card trip-selection-card mx-auto">
//           <div className="card-header p-4">
//             <Link to={`/oneWayTrip?uid=${uid}`}>One Way Trip</Link>
//           </div>
//           <div className="card-header p-4">
//             <Link to={`/roundTrip?uid=${uid}`}>Round Trip</Link>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default PaseengerTripSelectionButtonsContent;

// import React, { useState } from "react";
// import Header from "../Header";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   ArrowLeft,
//   ArrowRight,
//   Calendar,
//   Clock,
//   MapPin,
//   Car,
//   Plane,
// } from "lucide-react";

// export default function EnhancedTripBooking() {
//   //new
//   const [step, setStep] = useState(1);
//   const [tripType, setTripType] = useState("oneWay");
//   const [pickupLocation, setPickupLocation] = useState("");
//   const [destination, setDestination] = useState("");
//   const [pickupDate, setPickupDate] = useState("");
//   const [pickupTime, setPickupTime] = useState("");
//   const [returnDate, setReturnDate] = useState("");
//   const [returnTime, setReturnTime] = useState("");
//   const [carType, setCarType] = useState("");

//   const handleNext = () => {
//     setStep(step + 1);
//   };

//   const handleBack = () => {
//     setStep(step - 1);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log({
//       tripType,
//       pickupLocation,
//       destination,
//       pickupDate,
//       pickupTime,
//       returnDate,
//       returnTime,
//       carType,
//     });
//     alert("Trip booked successfully!");
//   };

//   const fadeInUp = {
//     initial: { opacity: 0, y: 20 },
//     animate: { opacity: 1, y: 0 },
//     exit: { opacity: 0, y: -20 },
//     transition: { duration: 0.3 },
//   };

//   const carOptions = [
//     { type: "4 + 1", fare: 500 },
//     { type: "6 + 1", fare: 700 },
//     { type: "8 + 1", fare: 900 },
//   ];

//   return (
//     <>
//       <Header />
//       <div className="flex items-center justify-center p-2">
//         <div className="w-full items-center justify-center max-w-2xl overflow-hidden bg-white shadow-lg rounded-lg">
//           <div className="bg-gradient-to-r from-[#0bbfe0] to-[#077286] p-6 text-white">
//             <h2 className="text-3xl">Book Your Adventure</h2>
//             <p className="text-[#e0f2f7]">
//               Embark on a journey of a lifetime with TRIPTO
//             </p>
//           </div>
//           <div className="p-6">
//             <form onSubmit={handleSubmit}>
//               <AnimatePresence mode="wait">
//                 {step === 1 && (
//                   <motion.div key="step1" {...fadeInUp} className="space-y-6">
//                     <div className="space-y-2">
//                       <label className="text-lg font-semibold">
//                         Choose Your Trip Type
//                       </label>
//                       <div className="flex space-x-4">
//                         <div className="flex-1">
//                           <input
//                             type="radio"
//                             id="oneWay"
//                             name="tripType"
//                             value="oneWay"
//                             checked={tripType === "oneWay"}
//                             onChange={() => setTripType("oneWay")}
//                             className="sr-only"
//                           />
//                           <label
//                             htmlFor="oneWay"
//                             className={`flex flex-col items-center justify-between rounded-md border-2 p-4 cursor-pointer ${
//                               tripType === "oneWay"
//                                 ? "border-[#0bbfe0]"
//                                 : "border-gray-300 hover:border-[#0bbfe0]"
//                             }`}
//                           >
//                             <Car className="mb-3 h-6 w-6" />
//                             One-way Trip
//                           </label>
//                         </div>
//                         <div className="flex-1">
//                           <input
//                             type="radio"
//                             id="roundTrip"
//                             name="tripType"
//                             value="roundTrip"
//                             checked={tripType === "roundTrip"}
//                             onChange={() => setTripType("roundTrip")}
//                             className="sr-only"
//                           />
//                           <label
//                             htmlFor="roundTrip"
//                             className={`flex flex-col items-center justify-between rounded-md border-2 p-4 cursor-pointer ${
//                               tripType === "roundTrip"
//                                 ? "border-[#0bbfe0]"
//                                 : "border-gray-300 hover:border-[#0bbfe0]"
//                             }`}
//                           >
//                             <Plane className="mb-3 h-6 w-6" />
//                             Round Trip
//                           </label>
//                         </div>
//                       </div>
//                     </div>
//                   </motion.div>
//                 )}

//                 {step === 2 && (
//                   <motion.div key="step2" {...fadeInUp} className="space-y-6">
//                     <div className="space-y-4">
//                       <label className="text-lg font-semibold">
//                         Where are you going?
//                       </label>
//                       <div className="relative">
//                         <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//                         <input
//                           id="pickupLocation"
//                           placeholder="Enter pickup location"
//                           value={pickupLocation}
//                           onChange={(e) => setPickupLocation(e.target.value)}
//                           className="pl-10 py-6 w-full text-lg border border-gray-300 rounded-lg"
//                         />
//                       </div>
//                       <div className="relative">
//                         <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//                         <input
//                           id="destination"
//                           placeholder="Enter destination"
//                           value={destination}
//                           onChange={(e) => setDestination(e.target.value)}
//                           className="pl-10 py-6 w-full text-lg border border-gray-300 rounded-lg"
//                         />
//                       </div>
//                     </div>
//                   </motion.div>
//                 )}

//                 {step === 3 && (
//                   <motion.div key="step3" {...fadeInUp} className="space-y-6">
//                     <label className="text-lg font-semibold">
//                       When are you traveling?
//                     </label>
//                     <div className="grid grid-cols-2 gap-4">
//                       <div className="space-y-2">
//                         <label htmlFor="pickupDate">Pickup Date</label>
//                         <div className="relative">
//                           <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//                           <input
//                             id="pickupDate"
//                             type="date"
//                             value={pickupDate}
//                             onChange={(e) => setPickupDate(e.target.value)}
//                             className="pl-10 py-2 w-full border border-gray-300 rounded-lg"
//                           />
//                         </div>
//                       </div>
//                       <div className="space-y-2">
//                         <label htmlFor="pickupTime">Pickup Time</label>
//                         <div className="relative">
//                           <Clock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//                           <input
//                             id="pickupTime"
//                             type="time"
//                             value={pickupTime}
//                             onChange={(e) => setPickupTime(e.target.value)}
//                             className="pl-10 py-2 w-full border border-gray-300 rounded-lg"
//                           />
//                         </div>
//                       </div>
//                     </div>
//                     {tripType === "roundTrip" && (
//                       <div className="grid grid-cols-2 gap-4">
//                         <div className="space-y-2">
//                           <label htmlFor="returnDate">Return Date</label>
//                           <div className="relative">
//                             <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//                             <input
//                               id="returnDate"
//                               type="date"
//                               value={returnDate}
//                               onChange={(e) => setReturnDate(e.target.value)}
//                               className="pl-10 py-2 w-full border border-gray-300 rounded-lg"
//                             />
//                           </div>
//                         </div>
//                         <div className="space-y-2">
//                           <label htmlFor="returnTime">Return Time</label>
//                           <div className="relative">
//                             <Clock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//                             <input
//                               id="returnTime"
//                               type="time"
//                               value={returnTime}
//                               onChange={(e) => setReturnTime(e.target.value)}
//                               className="pl-10 py-2 w-full border border-gray-300 rounded-lg"
//                             />
//                           </div>
//                         </div>
//                       </div>
//                     )}
//                     <div className="space-y-2">
//                       <label className="text-lg font-semibold">
//                         Select Car Type
//                       </label>
//                       {carOptions.map((car) => (
//                         <div
//                           key={car.type}
//                           className={`flex items-center justify-between p-4 rounded-lg border border-gray-200 cursor-pointer hover:border-[#0bbfe0] ${
//                             carType === car.type ? "border-[#0bbfe0]" : ""
//                           }`}
//                           onClick={() => setCarType(car.type)}
//                         >
//                           <div className="flex items-center">
//                             <Car className="h-6 w-6 mr-3 text-[#0bbfe0]" />
//                             <span>{car.type} Seater</span>
//                           </div>
//                           <span className="text-[#0bbfe0] font-semibold">
//                             ₹{car.fare}
//                           </span>
//                         </div>
//                       ))}
//                     </div>
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </form>
//           </div>
//           <div className="flex justify-between p-6">
//             {step > 1 && (
//               <button
//                 onClick={handleBack}
//                 className="flex items-center border border-gray-300 py-2 px-4 rounded-lg"
//               >
//                 <ArrowLeft className="mr-2 h-4 w-4" /> Back
//               </button>
//             )}
//             {step < 3 ? (
//               <button
//                 onClick={handleNext}
//                 className="ml-auto bg-[#0bbfe0] text-white py-2 px-6 rounded-lg hover:bg-[#0999b3]"
//               >
//                 Next <ArrowRight className="ml-2 h-4 w-4" />
//               </button>
//             ) : (
//               <button
//                 type="submit"
//                 onClick={handleSubmit}
//                 className="ml-auto bg-gradient-to-r from-[#0bbfe0] to-[#077286] text-white py-2 px-6 rounded-lg hover:from-[#0999b3] hover:to-[#066275]"
//               >
//                 Book Trip
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Car, Plane } from "lucide-react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

export default function TripTypeSelection() {
  const uid = localStorage.getItem("@secure.n.uid");
  const [tripType, setTripType] = useState("oneWay");
  const navigate = useNavigate();

  const handleNext = () => {
    if (tripType === "oneWay") {
      navigate(`/oneWayTrip?uid=${uid}`); // Navigate to One-way trip page
    } else {
      navigate(`/roundTrip?uid=${uid}`); // Navigate to Round-trip page
    }
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3 },
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-[#e6f7fb] to-[#e0f2f7] flex items-center justify-center">
        <div className="w-full max-w-2xl overflow-hidden bg-white shadow-lg rounded-lg">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0bbfe0] to-[#077286] p-6 text-white">
            <h1 className="text-3xl font-bold">Book Your Adventure</h1>
            <p className="text-[#e0f2f7]">
              Embark on a journey of a lifetime with TRIPTO
            </p>
          </div>

          {/* Content */}
          <div className="p-6">
            <motion.div key="step1" {...fadeInUp} className="space-y-6">
              <div className="space-y-2">
                <label className="text-lg font-semibold">
                  Choose Your Trip Type
                </label>
                <div className="flex space-x-4">
                  {/* One Way Trip */}
                  <div className="flex-1">
                    <input
                      type="radio"
                      id="oneWay"
                      name="tripType"
                      value="oneWay"
                      checked={tripType === "oneWay"}
                      onChange={() => setTripType("oneWay")}
                      className="sr-only peer"
                    />
                    <label
                      htmlFor="oneWay"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-checked:border-[#0bbfe0]"
                    >
                      <Car className="mb-3 h-6 w-6" />
                      One-way Trip
                    </label>
                  </div>

                  {/* Round Trip */}
                  <div className="flex-1">
                    <input
                      type="radio"
                      id="roundTrip"
                      name="tripType"
                      value="roundTrip"
                      checked={tripType === "roundTrip"}
                      onChange={() => setTripType("roundTrip")}
                      className="sr-only peer"
                    />
                    <label
                      htmlFor="roundTrip"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-checked:border-[#0bbfe0]"
                    >
                      <Plane className="mb-3 h-6 w-6" />
                      Round Trip
                    </label>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Separator */}
          <div className="border-t border-gray-300 my-4"></div>

          {/* Footer */}
          <div className="flex justify-end p-6">
            <button
              onClick={handleNext}
              className="flex items-center justify-center w-28 bg-[#0bbfe0] hover:bg-[#0999b3] text-white px-4 py-2 rounded-md"
            >
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

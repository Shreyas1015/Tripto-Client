// import { useState } from "react";
// import { motion } from "framer-motion";
// import { ArrowRight, Car, Repeat } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// export default function VendorTripTypeSelection() {
//   const uid = localStorage.getItem("@secure.n.uid");
//   const [tripType, setTripType] = useState("oneWay");
//   const navigate = useNavigate();

//   const handleNext = () => {
//     if (tripType === "oneWay") {
//       navigate(`/vendor/one-way-trip?uid=${uid}`);
//     } else {
//       navigate(`/vendor/round-trip?uid=${uid}`);
//     }
//   };

//   const fadeInUp = {
//     initial: { opacity: 0, y: 20 },
//     animate: { opacity: 1, y: 0 },
//     exit: { opacity: 0, y: -20 },
//     transition: { duration: 0.3 },
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-[#f8f9fa] to-[#e9ecef] flex items-center justify-center p-4">
//       <motion.div
//         initial={{ opacity: 0, scale: 0.95 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ duration: 0.5 }}
//         className="w-full max-w-3xl overflow-hidden bg-white shadow-xl rounded-xl"
//       >
//         {/* Header */}
//         <div className="bg-gradient-to-r from-[#0070f3] to-[#00a8ff] p-8 text-white">
//           <h1 className="text-4xl font-bold">Vendor Booking Portal</h1>
//           <p className="text-blue-100 mt-2">
//             Book trips for your passengers with ease
//           </p>
//         </div>

//         {/* Content */}
//         <div className="p-8">
//           <motion.div {...fadeInUp} className="space-y-8">
//             <div>
//               <h2 className="text-2xl font-semibold text-gray-800 mb-4">
//                 Select Trip Type
//               </h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* One Way Trip */}
//                 <motion.div
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                 >
//                   <input
//                     type="radio"
//                     id="oneWay"
//                     name="tripType"
//                     value="oneWay"
//                     checked={tripType === "oneWay"}
//                     onChange={() => setTripType("oneWay")}
//                     className="sr-only peer"
//                   />
//                   <label
//                     htmlFor="oneWay"
//                     className="flex flex-col items-center justify-between rounded-xl border-2 border-gray-200 bg-white p-6 hover:border-blue-400 hover:bg-blue-50 peer-checked:border-blue-500 peer-checked:bg-blue-50 transition-all duration-200 cursor-pointer h-full"
//                   >
//                     <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
//                       <Car className="h-8 w-8 text-blue-600" />
//                     </div>
//                     <h3 className="text-xl font-medium text-gray-800">
//                       One-way Trip
//                     </h3>
//                     <p className="text-gray-500 text-center mt-2">
//                       Book a single journey from pickup to destination
//                     </p>
//                   </label>
//                 </motion.div>

//                 {/* Round Trip */}
//                 <motion.div
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                 >
//                   <input
//                     type="radio"
//                     id="roundTrip"
//                     name="tripType"
//                     value="roundTrip"
//                     checked={tripType === "roundTrip"}
//                     onChange={() => setTripType("roundTrip")}
//                     className="sr-only peer"
//                   />
//                   <label
//                     htmlFor="roundTrip"
//                     className="flex flex-col items-center justify-between rounded-xl border-2 border-gray-200 bg-white p-6 hover:border-blue-400 hover:bg-blue-50 peer-checked:border-blue-500 peer-checked:bg-blue-50 transition-all duration-200 cursor-pointer h-full"
//                   >
//                     <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
//                       <Repeat className="h-8 w-8 text-blue-600" />
//                     </div>
//                     <h3 className="text-xl font-medium text-gray-800">
//                       Round Trip
//                     </h3>
//                     <p className="text-gray-500 text-center mt-2">
//                       Book a return journey with multiple days
//                     </p>
//                   </label>
//                 </motion.div>
//               </div>
//             </div>
//           </motion.div>
//         </div>

//         {/* Footer */}
//         <div className="flex justify-end p-8 border-t border-gray-200 bg-gray-50">
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={handleNext}
//             className="flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition-colors"
//           >
//             Continue <ArrowRight className="ml-2 h-5 w-5" />
//           </motion.button>
//         </div>
//       </motion.div>
//     </div>
//   );
// }

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Car, Repeat, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function VendorTripTypeSelection() {
  const uid = localStorage.getItem("@secure.n.uid");
  const [tripType, setTripType] = useState("oneWay");
  const navigate = useNavigate();

  const handleNext = () => {
    if (tripType === "oneWay") {
      navigate(`/vendor/one-way-trip?uid=${uid}`);
    } else {
      navigate(`/vendor/round-trip?uid=${uid}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex flex-col">
      {/* Header */}
      {/* <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Car className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-slate-800">
                TRIPTO
              </span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a
                href="#"
                className="text-slate-600 hover:text-slate-900 px-3 py-2 text-sm font-medium"
              >
                Dashboard
              </a>
              <a
                href="#"
                className="text-indigo-600 border-b-2 border-indigo-600 px-3 py-2 text-sm font-medium"
              >
                Book Trip
              </a>
              <a
                href="#"
                className="text-slate-600 hover:text-slate-900 px-3 py-2 text-sm font-medium"
              >
                Manage Drivers
              </a>
              <a
                href="#"
                className="text-slate-600 hover:text-slate-900 px-3 py-2 text-sm font-medium"
              >
                Reports
              </a>
            </nav>
          </div>
        </div>
      </header> */}

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          {/* Breadcrumb */}
          <div className="mb-6 flex items-center text-sm text-slate-500">
            <a href="/vendordashboard" className="hover:text-indigo-600">
              Dashboard
            </a>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="font-medium text-slate-800">Book Trip</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            {/* Progress Steps */}
            <div className="bg-indigo-50 px-6 py-4">
              <div className="flex items-center">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-600 text-white text-sm font-medium">
                  1
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-sm font-medium text-indigo-600">
                    Step 1
                  </h3>
                  <p className="text-sm text-slate-700">Select Trip Type</p>
                </div>
                <div className="h-px w-12 bg-indigo-200"></div>
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-slate-200 text-slate-500 text-sm font-medium">
                  2
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-sm font-medium text-slate-500">Step 2</h3>
                  <p className="text-sm text-slate-500">Trip Details</p>
                </div>
                <div className="h-px w-12 bg-slate-200"></div>
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-slate-200 text-slate-500 text-sm font-medium">
                  3
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-slate-500">Step 3</h3>
                  <p className="text-sm text-slate-500">Vehicle Selection</p>
                </div>
              </div>
            </div>

            <div className="p-8">
              <h1 className="text-2xl font-bold text-slate-800 mb-6">
                Select Trip Type
              </h1>
              <p className="text-slate-600 mb-8">
                Choose the type of trip you want to book for your passenger
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                {/* One Way Trip */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative"
                >
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
                    className="flex flex-col h-full rounded-xl border-2 border-slate-200 bg-white p-6 hover:border-indigo-300 hover:bg-indigo-50/30 peer-checked:border-indigo-600 peer-checked:bg-indigo-50 transition-all duration-200 cursor-pointer"
                  >
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                        <Car className="h-6 w-6 text-indigo-600" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-slate-800">
                          One-way Trip
                        </h3>
                        <p className="text-slate-500 text-sm">
                          Point A to Point B
                        </p>
                      </div>
                    </div>
                    <div className="flex-grow">
                      <ul className="space-y-2 text-slate-600">
                        <li className="flex items-center">
                          <div className="h-1.5 w-1.5 rounded-full bg-indigo-600 mr-2"></div>
                          Single journey from pickup to destination
                        </li>
                        <li className="flex items-center">
                          <div className="h-1.5 w-1.5 rounded-full bg-indigo-600 mr-2"></div>
                          Ideal for immediate travel needs
                        </li>
                        <li className="flex items-center">
                          <div className="h-1.5 w-1.5 rounded-full bg-indigo-600 mr-2"></div>
                          Simple pricing based on distance
                        </li>
                      </ul>
                    </div>
                    <div className="absolute top-4 right-4">
                      <div
                        className={`h-5 w-5 rounded-full border-2 ${
                          tripType === "oneWay"
                            ? "border-indigo-600 bg-indigo-600"
                            : "border-slate-300"
                        } flex items-center justify-center`}
                      >
                        {tripType === "oneWay" && (
                          <div className="h-2 w-2 rounded-full bg-white"></div>
                        )}
                      </div>
                    </div>
                  </label>
                </motion.div>

                {/* Round Trip */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative"
                >
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
                    className="flex flex-col h-full rounded-xl border-2 border-slate-200 bg-white p-6 hover:border-indigo-300 hover:bg-indigo-50/30 peer-checked:border-indigo-600 peer-checked:bg-indigo-50 transition-all duration-200 cursor-pointer"
                  >
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                        <Repeat className="h-6 w-6 text-indigo-600" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-slate-800">
                          Round Trip
                        </h3>
                        <p className="text-slate-500 text-sm">
                          Point A to Point B and back
                        </p>
                      </div>
                    </div>
                    <div className="flex-grow">
                      <ul className="space-y-2 text-slate-600">
                        <li className="flex items-center">
                          <div className="h-1.5 w-1.5 rounded-full bg-indigo-600 mr-2"></div>
                          Return journey with multiple days
                        </li>
                        <li className="flex items-center">
                          <div className="h-1.5 w-1.5 rounded-full bg-indigo-600 mr-2"></div>
                          Perfect for business trips or vacations
                        </li>
                        <li className="flex items-center">
                          <div className="h-1.5 w-1.5 rounded-full bg-indigo-600 mr-2"></div>
                          Includes driver accommodation charges
                        </li>
                      </ul>
                    </div>
                    <div className="absolute top-4 right-4">
                      <div
                        className={`h-5 w-5 rounded-full border-2 ${
                          tripType === "roundTrip"
                            ? "border-indigo-600 bg-indigo-600"
                            : "border-slate-300"
                        } flex items-center justify-center`}
                      >
                        {tripType === "roundTrip" && (
                          <div className="h-2 w-2 rounded-full bg-white"></div>
                        )}
                      </div>
                    </div>
                  </label>
                </motion.div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center px-8 py-5 bg-slate-50 border-t border-slate-200">
              <button
                onClick={() => navigate(`/vendordashboard?uid=${uid}`)}
                className="text-slate-600 hover:text-slate-900 font-medium"
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleNext}
                className="flex items-center justify-center px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm transition-colors"
              >
                Continue <ArrowRight className="ml-2 h-4 w-4" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Car, Repeat } from "lucide-react";
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

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9fa] to-[#e9ecef] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl overflow-hidden bg-white shadow-xl rounded-xl"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0070f3] to-[#00a8ff] p-8 text-white">
          <h1 className="text-4xl font-bold">Vendor Booking Portal</h1>
          <p className="text-blue-100 mt-2">
            Book trips for your passengers with ease
          </p>
        </div>

        {/* Content */}
        <div className="p-8">
          <motion.div {...fadeInUp} className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Select Trip Type
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* One Way Trip */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
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
                    className="flex flex-col items-center justify-between rounded-xl border-2 border-gray-200 bg-white p-6 hover:border-blue-400 hover:bg-blue-50 peer-checked:border-blue-500 peer-checked:bg-blue-50 transition-all duration-200 cursor-pointer h-full"
                  >
                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                      <Car className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-800">
                      One-way Trip
                    </h3>
                    <p className="text-gray-500 text-center mt-2">
                      Book a single journey from pickup to destination
                    </p>
                  </label>
                </motion.div>

                {/* Round Trip */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
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
                    className="flex flex-col items-center justify-between rounded-xl border-2 border-gray-200 bg-white p-6 hover:border-blue-400 hover:bg-blue-50 peer-checked:border-blue-500 peer-checked:bg-blue-50 transition-all duration-200 cursor-pointer h-full"
                  >
                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                      <Repeat className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-800">
                      Round Trip
                    </h3>
                    <p className="text-gray-500 text-center mt-2">
                      Book a return journey with multiple days
                    </p>
                  </label>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-8 border-t border-gray-200 bg-gray-50">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNext}
            className="flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition-colors"
          >
            Continue <ArrowRight className="ml-2 h-5 w-5" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

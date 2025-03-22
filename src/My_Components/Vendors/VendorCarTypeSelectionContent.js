import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, Car } from "lucide-react";
import secureLocalStorage from "react-secure-storage";
import axiosInstance from "../../API/axiosInstance";
import toast from "react-hot-toast";

export default function VendorCarTypeSelection() {
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
    { type: "4 + 1", fare: fourSeater, icon: "sedan" },
    { type: "6 + 1", fare: sixSeater, icon: "suv" },
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
        vid: oneWayTrip ? oneWayTrip.vid : roundTrip.vid, // Handle both trip types
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
        passenger_name: oneWayTrip
          ? oneWayTrip.passenger_name
          : roundTrip.passenger_name,
        passenger_phone: oneWayTrip
          ? oneWayTrip.passenger_phone
          : roundTrip.passenger_phone,
      };

      try {
        const endpoint = oneWayTrip
          ? "/vendor/handleOneWayTrip"
          : "/vendor/handleRoundTrip"; // Adjust endpoint based on trip type

        const res = await axiosInstance.post(
          `${process.env.REACT_APP_BASE_URL}${endpoint}`,
          { formData, decryptedUID }
        );

        if (res.status === 200) {
          toast.success(
            `Booking has been confirmed for ${formData.passenger_name}. A driver will be assigned shortly.`
          );
          navigate(`/vendordashboard?uid=${uid}`);
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
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9fa] to-[#e9ecef] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl overflow-hidden bg-white shadow-xl rounded-xl"
      >
        <div className="bg-gradient-to-r from-[#0070f3] to-[#00a8ff] p-6 text-white">
          <h1 className="text-3xl font-bold">Select Vehicle Type</h1>
          <p className="text-blue-100">
            Choose the appropriate vehicle for your passenger
          </p>
        </div>

        <div className="p-8">
          <motion.form
            onSubmit={handleSubmit}
            {...fadeInUp}
            className="space-y-6"
          >
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Available Vehicles
              </h2>

              <div className="space-y-4">
                {carOptions.map((car) => (
                  <motion.div
                    key={car.type}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center justify-between p-5 rounded-xl border-2 transition-all duration-200 ${
                      selectedCar === car.type
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300"
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
                      <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                        <Car className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <span className="block text-lg font-medium">
                          {car.type} Seater
                        </span>
                        <span className="text-gray-500 text-sm">
                          {car.type === "4 + 1" ? "Sedan" : "SUV"} • Comfortable
                          for {car.type === "4 + 1" ? "4" : "6"} passengers
                        </span>
                      </div>
                    </label>
                    <div className="text-blue-600 font-bold text-xl">
                      ₹{car.fare}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className={`flex items-center justify-center w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md transition-colors ${
                  !selectedCar ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={!selectedCar}
              >
                Confirm Booking <ArrowRight className="ml-2 h-5 w-5" />
              </motion.button>
            </div>

            {oneWayTrip && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-medium text-gray-800 mb-2">
                  Booking Summary
                </h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>
                    <span className="font-medium">Passenger:</span>{" "}
                    {oneWayTrip.passenger_name}
                  </p>
                  <p>
                    <span className="font-medium">Phone:</span>{" "}
                    {oneWayTrip.passenger_phone}
                  </p>
                  <p>
                    <span className="font-medium">Trip Type:</span> One Way
                  </p>
                  <p>
                    <span className="font-medium">Distance:</span> {distance} km
                  </p>
                </div>
              </div>
            )}

            {roundTrip && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-medium text-gray-800 mb-2">
                  Booking Summary
                </h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>
                    <span className="font-medium">Passenger:</span>{" "}
                    {roundTrip.passenger_name}
                  </p>
                  <p>
                    <span className="font-medium">Phone:</span>{" "}
                    {roundTrip.passenger_phone}
                  </p>
                  <p>
                    <span className="font-medium">Trip Type:</span> Round Trip
                  </p>
                  <p>
                    <span className="font-medium">Distance:</span> {distance} km
                  </p>
                  <p>
                    <span className="font-medium">Duration:</span>{" "}
                    {roundTrip.no_of_days} days
                  </p>
                </div>
              </div>
            )}
          </motion.form>
        </div>
      </motion.div>
    </div>
  );
}

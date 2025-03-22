"use client";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, MapPin, Car, CheckCircle } from "lucide-react";

export default function RoundTripConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const uid = localStorage.getItem("@secure.n.uid");
  const bookingDetails = location.state?.bookingDetails;

  if (!bookingDetails) {
    // Redirect if no booking details are available
    navigate(`/passengerdashboard?uid=${uid}`);
    return null;
  }

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleBackToDashboard = () => {
    navigate(`/passengerdashboard?uid=${uid}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e6f7fb] to-[#e0f2f7] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden"
      >
        <div className="bg-gradient-to-r from-[#0bbfe0] to-[#077286] p-6 text-white">
          <h1 className="text-2xl font-bold">Round Trip Confirmed</h1>
          <p className="text-[#e0f2f7]">Your booking has been scheduled</p>
        </div>

        <div className="p-6">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
          </div>

          {/* Confirmation Message */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-[#077286] mb-2">
              Booking Successful!
            </h2>
            <p className="text-gray-600">
              Your round trip has been scheduled. We'll assign a driver closer
              to your pickup time.
            </p>
          </div>

          {/* Trip Details */}
          <div className="border rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold mb-3">Trip Details</h3>

            <div className="space-y-4 mb-4">
              <div className="flex items-start">
                <Calendar className="w-5 h-5 mr-2 text-[#0bbfe0] mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">PICKUP DATE & TIME</p>
                  <p className="text-base font-medium">
                    {formatDate(bookingDetails.pickup_date_time)}
                  </p>
                </div>
              </div>

              {bookingDetails.return_date_time && (
                <div className="flex items-start">
                  <Calendar className="w-5 h-5 mr-2 text-[#0bbfe0] mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">RETURN DATE & TIME</p>
                    <p className="text-base font-medium">
                      {formatDate(bookingDetails.return_date_time)}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-start">
                <MapPin className="w-5 h-5 mr-2 text-[#0bbfe0] mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">PICKUP</p>
                  <p className="text-base">{bookingDetails.pickup_location}</p>
                </div>
              </div>

              <div className="flex items-start">
                <MapPin className="w-5 h-5 mr-2 text-[#077286] mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">DROP-OFF</p>
                  <p className="text-base">{bookingDetails.drop_location}</p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Car className="w-5 h-5 mr-2 text-[#0bbfe0]" />
                  <span className="font-medium">
                    {bookingDetails.selected_car === 1
                      ? "Sedan (4+1)"
                      : "SUV (6+1)"}
                  </span>
                </div>
                <span className="font-bold text-[#077286]">
                  ₹{bookingDetails.price}
                </span>
              </div>

              <div className="mt-2 text-sm text-gray-500">
                <span>Duration: {bookingDetails.no_of_days} day(s)</span>
                <span className="mx-2">•</span>
                <span>Distance: {bookingDetails.distance} km</span>
              </div>
            </div>
          </div>

          {/* Back to Dashboard Button */}
          <button
            onClick={handleBackToDashboard}
            className="w-full bg-[#0bbfe0] hover:bg-[#0999b3] text-white py-3 rounded-md font-semibold"
          >
            Back to Dashboard
          </button>
        </div>
      </motion.div>
    </div>
  );
}

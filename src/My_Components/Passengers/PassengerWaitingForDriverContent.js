import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Car, Clock, MapPin, X } from "lucide-react";
import axiosInstance from "../../API/axiosInstance";
import secureLocalStorage from "react-secure-storage";
import toast from "react-hot-toast";

export default function WaitingForDriver() {
  const location = useLocation();
  const navigate = useNavigate();
  const uid = localStorage.getItem("@secure.n.uid");
  const decryptedUID = secureLocalStorage.getItem("uid");
  const [bookingDetails, setBookingDetails] = useState(null);
  const [waitingTime, setWaitingTime] = useState(0);
  const [driverAssigned, setDriverAssigned] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  // Get booking details from location state or fetch from API
  useEffect(() => {
    // If we have booking details but it's not a one-way trip, redirect to dashboard
    if (
      location.state?.bookingDetails &&
      location.state.bookingDetails.trip_type !== 1
    ) {
      toast.info("This screen is only for one-way trips");
      navigate(`/passengerdashboard?uid=${uid}`);
      return;
    }

    const getBookingDetails = async () => {
      try {
        // If booking details are passed via location state, use them
        if (location.state?.bookingDetails) {
          setBookingDetails(location.state.bookingDetails);
          return;
        }

        // Otherwise fetch the latest booking from API
        const res = await axiosInstance.post(
          `${process.env.REACT_APP_BASE_URL}/passengers/getLatestBooking`,
          {
            decryptedUID,
          }
        );

        if (res.status === 200 && res.data) {
          // Only proceed if it's a one-way trip
          if (res.data.trip_type === 1) {
            setBookingDetails(res.data);
          } else {
            toast.info("No active one-way bookings found");
            navigate(`/passengerdashboard?uid=${uid}`);
          }
        } else {
          toast.error("No active booking found");
          navigate(`/passengerdashboard?uid=${uid}`);
        }
      } catch (error) {
        console.error("Error fetching booking details:", error);
        toast.error("Error fetching booking details");
      }
    };

    getBookingDetails();
  }, [location.state, decryptedUID, navigate, uid]);

  // Check for driver assignment every few seconds
  useEffect(() => {
    if (!bookingDetails) return;

    const checkDriverAssignment = async () => {
      try {
        const res = await axiosInstance.post(
          `${process.env.REACT_APP_BASE_URL}/passengers/checkDriverAssignment`,
          {
            decryptedUID,
            bookingId: bookingDetails.id,
          }
        );

        if (res.status === 200 && res.data.driverAssigned) {
          setDriverAssigned(true);
          toast.success("Driver assigned! Redirecting to ride details...");

          // Wait a moment before redirecting to show the success message
          setTimeout(() => {
            navigate(`/ride-details?uid=${uid}`, {
              state: { rideDetails: res.data.rideDetails },
            });
          }, 2000);
        }
      } catch (error) {
        console.error("Error checking driver assignment:", error);
      }
    };

    // Check immediately and then every 5 seconds
    checkDriverAssignment();
    const intervalId = setInterval(checkDriverAssignment, 5000);

    // Update waiting time every second
    const waitingIntervalId = setInterval(() => {
      setWaitingTime((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(intervalId);
      clearInterval(waitingIntervalId);
    };
  }, [bookingDetails, decryptedUID, navigate, uid]);

  // Format waiting time as MM:SS
  const formatWaitingTime = () => {
    const minutes = Math.floor(waitingTime / 60);
    const seconds = waitingTime % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  // Handle booking cancellation
  const handleCancelBooking = () => {
    try {
      const res = axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/passengers/cancelBooking`,
        {
          decryptedUID,
          bookingId: bookingDetails.id,
          reason: cancelReason,
        }
      );

      if (res.status === 200) {
        toast.success("Booking cancelled successfully");
        navigate(`/passengerdashboard?uid=${uid}`);
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error("Error cancelling booking");
    }
  };

  if (!bookingDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#e6f7fb] to-[#e0f2f7] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0bbfe0] mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e6f7fb] to-[#e0f2f7] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden"
      >
        <div className="bg-gradient-to-r from-[#0bbfe0] to-[#077286] p-6 text-white">
          <h1 className="text-2xl font-bold">Finding Your Driver</h1>
          <p className="text-[#e0f2f7]">
            Please wait while we connect you with a driver
          </p>
        </div>

        <div className="p-6">
          {/* Waiting Animation */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-[#e0f2f7] flex items-center justify-center">
                <Car className="w-12 h-12 text-[#0bbfe0]" />
              </div>
              <div className="absolute inset-0 rounded-full border-4 border-[#0bbfe0] border-t-transparent animate-spin"></div>
            </div>
          </div>

          {/* Waiting Time */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center">
              <Clock className="w-5 h-5 mr-2 text-[#0bbfe0]" />
              <span className="text-lg font-semibold">
                Waiting time: {formatWaitingTime()}
              </span>
            </div>
            <p className="text-gray-500 mt-1">
              {driverAssigned
                ? "Driver found! Redirecting..."
                : "Looking for drivers near you..."}
            </p>
          </div>

          {/* Trip Details */}
          <div className="border rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold mb-3">Trip Details</h3>
            <div className="space-y-3">
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
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex justify-between">
                <span className="text-gray-600">Car Type:</span>
                <span className="font-semibold">
                  {bookingDetails.selected_car === 1
                    ? "Sedan (4+1)"
                    : "SUV (6+1)"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Fare:</span>
                <span className="font-semibold text-[#077286]">
                  ₹{bookingDetails.price}
                </span>
              </div>
            </div>
          </div>

          {/* Cancel Button */}
          {!driverAssigned && (
            <button
              onClick={() => setShowCancelModal(true)}
              className="w-full border border-red-500 text-red-500 py-2 rounded-md font-semibold hover:bg-red-50"
            >
              Cancel Booking
            </button>
          )}
        </div>
      </motion.div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-md"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-[#077286]">
                Cancel Booking
              </h3>
              <button
                onClick={() => setShowCancelModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-gray-600 mb-4">
              Please let us know why you're cancelling this booking.
            </p>

            <div className="mb-4">
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full border rounded-md p-3"
              >
                <option value="">Select a reason</option>
                <option value="wait_too_long">Waiting too long</option>
                <option value="changed_plans">Changed my plans</option>
                <option value="booked_by_mistake">Booked by mistake</option>
                <option value="other">Other reason</option>
              </select>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-2 border border-gray-300 rounded-md"
              >
                Back
              </button>
              <button
                onClick={handleCancelBooking}
                disabled={!cancelReason}
                className={`flex-1 py-2 rounded-md text-white ${
                  cancelReason
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Confirm Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

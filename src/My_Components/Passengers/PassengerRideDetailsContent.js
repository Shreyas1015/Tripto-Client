import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MapPin,
  Phone,
  MessageSquare,
  Car,
  CreditCard,
  Star,
  Clock,
  CheckCircle,
  Key,
  X,
} from "lucide-react";
import axiosInstance from "../../API/axiosInstance";
import secureLocalStorage from "react-secure-storage";
import toast from "react-hot-toast";

export default function RideDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const uid = localStorage.getItem("@secure.n.uid");
  const decryptedUID = secureLocalStorage.getItem("uid");
  const [rideDetails, setRideDetails] = useState(null);
  const [otp, setOtp] = useState(null);
  const [rideStatus, setRideStatus] = useState("accepted"); // accepted, arrived, started, inProgress, completed
  const [paymentOtpInput, setPaymentOtpInput] = useState("");
  const [showPaymentOtpModal, setShowPaymentOtpModal] = useState(false);
  const [isGeneratingOtp, setIsGeneratingOtp] = useState(false);
  const [isVerifyingPaymentOtp, setIsVerifyingPaymentOtp] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null);

  // Get ride details from location state or fetch from API
  useEffect(() => {
    const fetchRideDetails = async () => {
      try {
        let rideData;

        // If ride details are passed via location state, use them
        if (location.state?.rideDetails) {
          console.log(
            "Ride details from location state:",
            location.state.rideDetails
          );
          rideData = location.state.rideDetails;
        } else {
          // Otherwise, fetch from API
          const res = await axiosInstance.post(
            `${process.env.REACT_APP_BASE_URL}/passengers/getCurrentRide`,
            {
              decryptedUID,
            }
          );

          if (res.status === 200 && res.data) {
            rideData = res.data;
            console.log("Ride details from API:", rideData);
          } else {
            toast.error("No active ride found");
            navigate(`/passengerdashboard?uid=${uid}`);
            return;
          }
        }

        // Set ride details
        setRideDetails(rideData);
      } catch (error) {
        console.error("Error fetching ride details:", error);
        toast.error("Error fetching ride details");
      }
    };

    fetchRideDetails();
  }, [location.state, decryptedUID, navigate, uid]);

  // Poll for trip status updates
  useEffect(() => {
    if (!rideDetails?.bookingId) return;

    const fetchTripStatus = async () => {
      try {
        const res = await axiosInstance.post(
          `${process.env.REACT_APP_BASE_URL}/passengers/getTripStatus`,
          {
            decryptedUID,
            bookingId: rideDetails.bookingId,
          }
        );

        if (res.status === 200 && res.data) {
          console.log("Trip status:", res.data);
          const tripStatus = res.data;

          if (tripStatus === 1) {
            setRideStatus("accepted");
          } else if (tripStatus === 2) {
            setRideStatus("arrived");
          } else if (tripStatus === 3) {
            setRideStatus("started");
          } else if (tripStatus === 4) {
            setRideStatus("inProgress");
          } else if (tripStatus === 5) {
            setRideStatus("completed");
          }
        }
      } catch (error) {
        console.error("Error fetching trip status:", error);
      }
    };

    // Initial fetch
    fetchTripStatus();

    // Set up polling every 10 seconds
    const intervalId = setInterval(fetchTripStatus, 10000);

    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [rideDetails, decryptedUID]);

  // Generate OTP for ride start
  const handleGenerateOtp = async () => {
    if (isGeneratingOtp) return;

    setIsGeneratingOtp(true);
    try {
      // Generate a random 4-digit OTP
      const generatedOtp = Math.floor(1000 + Math.random() * 9000);
      setOtp(generatedOtp);

      // Save OTP to backend
      await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/passengers/setRideStartOtp`,
        {
          decryptedUID,
          rideId: rideDetails.bookingId,
          otp: generatedOtp,
        }
      );

      toast.success(
        "OTP generated successfully. Share with your driver to start the ride."
      );
      console.log("OTP generated and saved:", generatedOtp);
    } catch (error) {
      console.error("Error generating OTP:", error);
      toast.error("Error generating OTP");
    } finally {
      setIsGeneratingOtp(false);
    }
  };

  const handlePayment = (method) => {
    setPaymentMethod(method); // Store selected payment method
    setShowPaymentOtpModal(true);

    toast.success(
      `Please enter the payment verification OTP provided by your driver`
    );
  };

  // Verify payment OTP with the selected payment method
  const handleVerifyPaymentOtp = async () => {
    if (isVerifyingPaymentOtp) return;

    setIsVerifyingPaymentOtp(true);
    try {
      const res = await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/passengers/verifyPaymentOtp`,
        {
          decryptedUID,
          rideId: rideDetails.bookingId,
          enteredOtp: Number.parseInt(paymentOtpInput),
          paymentMethod, // Include payment method
        }
      );

      if (res.status === 200) {
        setShowPaymentOtpModal(false);
        toast.success("Payment verified successfully!");
        setRideStatus("completed");

        // Navigate to rating screen after a short delay
        setTimeout(() => {
          navigate(`/rate-driver?uid=${uid}`, {
            state: { rideDetails },
          });
        }, 2000);
      } else {
        toast.error("Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying payment OTP:", error);
      toast.error("Error verifying payment OTP");
    } finally {
      setIsVerifyingPaymentOtp(false);
    }
  };

  // Handle call driver
  const handleCallDriver = () => {
    if (rideDetails && rideDetails.driverPhone) {
      window.location.href = `tel:${rideDetails.driverPhone}`;
    } else {
      toast.error("Driver phone number not available");
    }
  };

  // Handle chat with driver
  const handleChatDriver = () => {
    toast.success("Chat feature will be implemented soon!");
  };

  if (!rideDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#e6f7fb] to-[#e0f2f7] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0bbfe0] mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading ride details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e6f7fb] to-[#e0f2f7]">
      <div className="max-w-4xl mx-auto p-4">
        {/* Ride Status */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-[#077286]">
              {rideStatus === "accepted" && "Driver Assigned"}
              {rideStatus === "arrived" && "Driver Has Arrived"}
              {rideStatus === "started" && "Ride Started"}
              {rideStatus === "inProgress" && "Ride in Progress"}
              {rideStatus === "completed" && "Ride Completed"}
            </h2>
            <div className="flex items-center bg-[#e0f2f7] px-4 py-2 rounded-full">
              <Clock className="w-5 h-5 mr-2 text-[#0bbfe0]" />
              <span className="font-semibold">
                {rideStatus === "accepted"
                  ? "Driver on the way"
                  : rideStatus === "arrived"
                  ? "Driver waiting"
                  : rideStatus === "started" || rideStatus === "inProgress"
                  ? "On the way to destination"
                  : "Trip completed"}
              </span>
            </div>
          </div>

          {/* Driver Info */}
          <div className="flex items-center mb-6">
            <div className="w-16 h-16 rounded-full bg-gray-200 mr-4 overflow-hidden">
              {rideDetails.driverPhoto ? (
                <img
                  src={rideDetails.driverPhoto || "/placeholder.svg"}
                  alt={rideDetails.driverName || "Driver"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#0bbfe0] text-white text-2xl font-bold">
                  {(rideDetails.driverName || "D").charAt(0)}
                </div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold">
                {rideDetails.driverName || "Your Driver"}
              </h3>
              <div className="flex items-center text-gray-600">
                <Star className="w-4 h-4 text-yellow-500 mr-1" />
                <span>{rideDetails.driverRating || "4.8"}</span>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleCallDriver}
                className="w-12 h-12 rounded-full bg-[#e0f2f7] flex items-center justify-center"
              >
                <Phone className="w-5 h-5 text-[#0bbfe0]" />
              </button>
              <button
                onClick={handleChatDriver}
                className="w-12 h-12 rounded-full bg-[#e0f2f7] flex items-center justify-center"
              >
                <MessageSquare className="w-5 h-5 text-[#0bbfe0]" />
              </button>
            </div>
          </div>

          {/* Vehicle Info */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-6">
            <div className="flex items-center">
              <Car className="w-8 h-8 mr-3 text-[#0bbfe0]" />
              <div>
                <p className="text-lg font-semibold">
                  {rideDetails.carModel ||
                    (rideDetails.selected_car === 1 ? "Sedan" : "SUV")}
                </p>
                <p className="text-gray-600">
                  {rideDetails.carLicensePlate || "MH 01 AB 1234"}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold">
                {rideDetails.carColor || "White"}
              </p>
            </div>
          </div>

          {/* OTP Generation (shown only when driver has arrived) */}
          {rideStatus === "arrived" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 border border-[#0bbfe0] rounded-lg mb-6"
            >
              <h3 className="text-lg font-semibold mb-2">
                Generate OTP for Driver
              </h3>
              <div className="flex items-center justify-between">
                {otp ? (
                  <div className="text-3xl font-bold tracking-wider text-[#077286]">
                    {otp}
                  </div>
                ) : (
                  <div className="text-gray-500">
                    Click the button to generate OTP
                  </div>
                )}
                <button
                  onClick={handleGenerateOtp}
                  disabled={isGeneratingOtp || otp !== null}
                  className={`${
                    otp !== null
                      ? "bg-green-500 hover:bg-green-600"
                      : isGeneratingOtp
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#0bbfe0] hover:bg-[#0999b3]"
                  } text-white px-4 py-2 rounded-md flex items-center`}
                >
                  {isGeneratingOtp ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Generating...
                    </>
                  ) : otp !== null ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Generated
                    </>
                  ) : (
                    <>
                      <Key className="w-4 h-4 mr-2" />
                      Generate OTP
                    </>
                  )}
                </button>
              </div>
              {otp && (
                <p className="mt-2 text-sm text-gray-600">
                  Share this OTP with your driver to start the ride
                </p>
              )}
            </motion.div>
          )}

          {/* Ride Status Message */}
          {rideStatus === "started" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-green-50 border border-green-200 rounded-lg mb-6"
            >
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                <p className="text-green-700 font-medium">
                  Your ride has started! Enjoy your trip.
                </p>
              </div>
            </motion.div>
          )}

          {/* Ride Details */}
          <div className="space-y-4 mb-6">
            <div className="flex items-start">
              <MapPin className="w-6 h-6 mr-3 text-[#0bbfe0] mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-500">PICKUP</p>
                <p className="text-base">
                  {rideDetails.pickupLocation || rideDetails.pickup_location}
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <MapPin className="w-6 h-6 mr-3 text-[#077286] mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-500">DROP-OFF</p>
                <p className="text-base">
                  {rideDetails.dropLocation || rideDetails.drop_location}
                </p>
              </div>
            </div>
          </div>

          {/* Fare Details */}
          <div className="border-t border-gray-200 pt-4 mb-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Fare</h3>
              <p className="text-2xl font-bold text-[#077286]">
                ₹{rideDetails.price}
              </p>
            </div>
            <p className="text-gray-500 text-sm">
              {rideDetails.trip_type === 2 ? "Round Trip" : "One-way"} •{" "}
              {rideDetails.distance} km
            </p>
          </div>

          {/* Payment Options (shown only when ride is in progress) */}
          {rideStatus === "inProgress" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold">Payment Method</h3>
              <div className="grid grid-cols-3 gap-4">
                <button
                  onClick={() => handlePayment(1)}
                  className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <CreditCard className="w-8 h-8 mb-2 text-[#0bbfe0]" />
                  <span>Cash</span>
                </button>
                <button
                  onClick={() => handlePayment(2)}
                  className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <CreditCard className="w-8 h-8 mb-2 text-[#0bbfe0]" />
                  <span>UPI</span>
                </button>
                <button
                  onClick={() => handlePayment(3)}
                  className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <CreditCard className="w-8 h-8 mb-2 text-[#0bbfe0]" />
                  <span>Card</span>
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Payment OTP Modal */}
      {showPaymentOtpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-md"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-[#077286]">
                Payment Verification
              </h3>
              <button
                onClick={() => setShowPaymentOtpModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-gray-600 mb-4">
              Enter the payment verification OTP provided by your driver to
              complete the payment.
            </p>

            <div className="mb-4">
              <input
                type="text"
                value={paymentOtpInput}
                onChange={(e) =>
                  setPaymentOtpInput(
                    e.target.value.replace(/\D/g, "").slice(0, 4)
                  )
                }
                placeholder="Enter 4-digit OTP"
                className="w-full border rounded-md p-3 text-center text-2xl tracking-widest"
                maxLength={4}
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowPaymentOtpModal(false)}
                className="flex-1 py-2 border border-gray-300 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleVerifyPaymentOtp}
                disabled={paymentOtpInput.length !== 4 || isVerifyingPaymentOtp}
                className={`flex-1 py-2 rounded-md text-white ${
                  paymentOtpInput.length === 4 && !isVerifyingPaymentOtp
                    ? "bg-[#0bbfe0] hover:bg-[#0999b3]"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                {isVerifyingPaymentOtp ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Verifying...
                  </div>
                ) : (
                  "Verify & Complete"
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

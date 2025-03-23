"use client";

import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MapPin,
  Phone,
  MessageSquare,
  Navigation,
  CheckCircle,
  X,
  Key,
  Clock,
} from "lucide-react";
import axiosInstance from "../../API/axiosInstance";
import secureLocalStorage from "react-secure-storage";
import toast from "react-hot-toast";

export default function DriverNavigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const uid = localStorage.getItem("@secure.n.uid");
  const decryptedUID = secureLocalStorage.getItem("uid");
  const [rideDetails, setRideDetails] = useState(null);
  const [rideStartOtpInput, setRideStartOtpInput] = useState("");
  const [rideStatus, setRideStatus] = useState("accepted"); // accepted, arrived, started, inProgress, completed
  const [showRideStartOtpModal, setShowRideStartOtpModal] = useState(false);
  const [paymentOtp, setPaymentOtp] = useState(null);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isGeneratingPaymentOtp, setIsGeneratingPaymentOtp] = useState(false);

  // Get ride details from location state or fetch from API
  useEffect(() => {
    const fetchRideDetails = async () => {
      try {
        // If ride details are passed via location state, use them
        if (location.state?.rideDetails) {
          // Only proceed if it's a one-way trip
          if (location.state.rideDetails.trip_type === 1) {
            setRideDetails(location.state.rideDetails);
            console.log("Ride details from state:", location.state.rideDetails);
          } else {
            toast.info("Navigation is only available for one-way trips");
            navigate(`/drivershome?uid=${uid}`);
          }
          return;
        }

        // Otherwise fetch from API
        const res = await axiosInstance.post(
          `${process.env.REACT_APP_BASE_URL}/drivers/getCurrentRide`,
          {
            decryptedUID,
          }
        );

        if (res.status === 200 && res.data) {
          // Only proceed if it's a one-way trip
          if (res.data.trip_type === 1) {
            setRideDetails(res.data);
          } else {
            toast.info("Navigation is only available for one-way trips");
            navigate(`/drivershome?uid=${uid}`);
          }
        } else {
          toast.error("No active ride found");
          navigate(`/drivershome?uid=${uid}`);
        }
      } catch (error) {
        console.error("Error fetching ride details:", error);
        toast.error("Error fetching ride details");
      }
    };

    fetchRideDetails();
  }, [location.state, decryptedUID, navigate, uid]);

  // Poll for trip status updates
  useEffect(() => {
    if (!rideDetails?.bookingId && !rideDetails?.bid) return;

    const fetchTripStatus = async () => {
      try {
        const res = await axiosInstance.post(
          `${process.env.REACT_APP_BASE_URL}/drivers/getTripStatus`,
          {
            decryptedUID,
            bookingId: rideDetails.bookingId || rideDetails.bid,
          }
        );

        if (res.status === 200) {
          const tripStatus = res.data;
          console.log("Trip status:", tripStatus);

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

  // Handle OTP verification for ride start
  const handleRideStartOtpVerification = async () => {
    if (isVerifyingOtp) return;

    setIsVerifyingOtp(true);
    try {
      // Verify OTP via backend
      const res = await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/drivers/verifyRideStartOtp`,
        {
          decryptedUID,
          rideId: rideDetails.bookingId || rideDetails.bid,
          enteredOtp: Number.parseInt(rideStartOtpInput),
        }
      );

      if (res.status === 200) {
        setShowRideStartOtpModal(false);
        toast.success("OTP verified successfully!");
        // Don't call startRide here, let the user click the Start Ride button
      } else {
        toast.error("Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("Error verifying OTP");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // Handle start ride
  const handleStartRide = async () => {
    try {
      const res = await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/drivers/startRide`,
        {
          decryptedUID,
          rideId: rideDetails.bookingId || rideDetails.bid,
        }
      );

      if (res.status === 200) {
        setRideStatus("started");
        toast.success("Ride started successfully!");
      } else {
        toast.error("Failed to start ride. Please try again.");
      }
    } catch (error) {
      console.error("Error starting ride:", error);
      toast.error("Error starting ride");
    }
  };

  // Generate payment OTP
  const handleGeneratePaymentOtp = async () => {
    if (isGeneratingPaymentOtp) return;

    setIsGeneratingPaymentOtp(true);
    try {
      // Generate a random 4-digit OTP
      const generatedOtp = Math.floor(1000 + Math.random() * 9000);
      setPaymentOtp(generatedOtp);

      // Save OTP to backend
      await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/drivers/setPaymentOtp`,
        {
          decryptedUID,
          rideId: rideDetails.bookingId || rideDetails.bid,
          otp: generatedOtp,
        }
      );

      toast.success(
        "Payment OTP generated. Share with passenger to complete payment."
      );
      console.log("Payment OTP generated:", generatedOtp);
    } catch (error) {
      console.error("Error generating payment OTP:", error);
      toast.error("Error generating payment OTP");
    } finally {
      setIsGeneratingPaymentOtp(false);
    }
  };

  // Handle call passenger
  const handleCallPassenger = () => {
    if (rideDetails && rideDetails.passengerPhone) {
      window.location.href = `tel:${rideDetails.passengerPhone}`;
    } else {
      toast.error("Passenger phone number not available");
    }
  };

  // Handle chat with passenger
  const handleChatPassenger = () => {
    toast.success("Chat feature will be implemented soon!");
  };

  // Handle arrived at pickup
  const handleArrivedAtPickup = async () => {
    try {
      await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/drivers/arrivedAtPickup`,
        {
          decryptedUID,
          rideId: rideDetails.bookingId || rideDetails.bid,
        }
      );

      setRideStatus("arrived");
      setShowRideStartOtpModal(true);
      toast.success("Marked as arrived at pickup location");
    } catch (error) {
      console.error("Error updating arrival status:", error);
      toast.error("Error updating arrival status");
    }
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
              {rideStatus === "accepted" && "Navigate to Pickup"}
              {rideStatus === "arrived" && "Waiting for Passenger"}
              {rideStatus === "started" && "Ride Started"}
              {rideStatus === "inProgress" && "Navigate to Destination"}
              {rideStatus === "completed" && "Ride Completed"}
            </h2>
            <div className="flex items-center bg-[#e0f2f7] px-4 py-2 rounded-full">
              <Clock className="w-5 h-5 mr-2 text-[#0bbfe0]" />
              <span className="font-semibold">
                {rideStatus === "accepted"
                  ? "En route to pickup"
                  : rideStatus === "arrived"
                  ? "At pickup location"
                  : rideStatus === "started" || rideStatus === "inProgress"
                  ? "On the way to destination"
                  : "Trip completed"}
              </span>
            </div>
          </div>

          {/* Passenger Info */}
          <div className="flex items-center mb-6">
            <div className="w-16 h-16 rounded-full bg-gray-200 mr-4 overflow-hidden">
              {rideDetails.passengerPhoto ? (
                <img
                  src={rideDetails.passengerPhoto || "/placeholder.svg"}
                  alt={rideDetails.passengerName || "Passenger"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#0bbfe0] text-white text-2xl font-bold">
                  {(rideDetails.passengerName || "P").charAt(0)}
                </div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold">
                {rideDetails.passengerName || "Your Passenger"}
              </h3>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleCallPassenger}
                className="w-12 h-12 rounded-full bg-[#e0f2f7] flex items-center justify-center"
              >
                <Phone className="w-5 h-5 text-[#0bbfe0]" />
              </button>
              <button
                onClick={handleChatPassenger}
                className="w-12 h-12 rounded-full bg-[#e0f2f7] flex items-center justify-center"
              >
                <MessageSquare className="w-5 h-5 text-[#0bbfe0]" />
              </button>
            </div>
          </div>

          {/* Ride Details */}
          <div className="space-y-4 mb-6">
            <div className="flex items-start">
              <MapPin className="w-6 h-6 mr-3 text-[#0bbfe0] mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-500">PICKUP</p>
                <p className="text-base">{rideDetails.pickup_location}</p>
              </div>
            </div>
            <div className="flex items-start">
              <MapPin className="w-6 h-6 mr-3 text-[#077286] mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-500">DROP-OFF</p>
                <p className="text-base">{rideDetails.drop_location}</p>
              </div>
            </div>
          </div>

          {/* Trip Info */}
          <div className="p-4 bg-gray-50 rounded-lg mb-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500">Trip Type</p>
                <p className="font-semibold">
                  {rideDetails.trip_type === 2 ? "Round Trip" : "One-way"}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Distance</p>
                <p className="font-semibold">{rideDetails.distance} km</p>
              </div>
              <div>
                <p className="text-gray-500">Fare</p>
                <p className="font-semibold text-[#077286]">
                  ₹{rideDetails.price}
                </p>
              </div>
            </div>
          </div>

          {/* Payment OTP Generation (shown only when ride is in progress) */}
          {rideStatus === "inProgress" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 border border-[#0bbfe0] rounded-lg mb-6"
            >
              <h3 className="text-lg font-semibold mb-2">
                Generate Payment OTP
              </h3>
              <div className="flex items-center justify-between">
                {paymentOtp ? (
                  <div className="text-3xl font-bold tracking-wider text-[#077286]">
                    {paymentOtp}
                  </div>
                ) : (
                  <div className="text-gray-500">
                    Click the button to generate payment OTP
                  </div>
                )}
                <button
                  onClick={handleGeneratePaymentOtp}
                  disabled={isGeneratingPaymentOtp || paymentOtp !== null}
                  className={`${
                    paymentOtp !== null
                      ? "bg-green-500 hover:bg-green-600"
                      : isGeneratingPaymentOtp
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#0bbfe0] hover:bg-[#0999b3]"
                  } text-white px-4 py-2 rounded-md flex items-center`}
                >
                  {isGeneratingPaymentOtp ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Generating...
                    </>
                  ) : paymentOtp !== null ? (
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
              {paymentOtp && (
                <p className="mt-2 text-sm text-gray-600">
                  Share this OTP with your passenger to complete the payment
                </p>
              )}
            </motion.div>
          )}

          {/* Action Buttons */}
          {rideStatus === "accepted" && (
            <button
              onClick={handleArrivedAtPickup}
              className="w-full bg-[#0bbfe0] hover:bg-[#0999b3] text-white py-3 rounded-md font-semibold flex items-center justify-center"
            >
              <Navigation className="w-5 h-5 mr-2" />
              I've Arrived at Pickup
            </button>
          )}

          {rideStatus === "started" && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-6">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                <p className="text-green-700 font-medium">
                  Ride has started! Navigate to the destination.
                </p>
              </div>
            </div>
          )}

          {rideStatus === "arrived" && (
            <button
              onClick={handleStartRide}
              className="w-full bg-[#0bbfe0] hover:bg-[#0999b3] text-white py-3 rounded-md font-semibold flex items-center justify-center mt-4"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              Start Ride
            </button>
          )}
        </div>
      </div>

      {/* OTP Modal for Ride Start */}
      {showRideStartOtpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-md"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-[#077286]">
                Enter OTP from Passenger
              </h3>
              <button
                onClick={() => setShowRideStartOtpModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-gray-600 mb-4">
              Ask the passenger for the OTP shown on their app to start the
              ride.
            </p>

            <div className="mb-4">
              <input
                type="text"
                value={rideStartOtpInput}
                onChange={(e) =>
                  setRideStartOtpInput(
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
                onClick={() => setShowRideStartOtpModal(false)}
                className="flex-1 py-2 border border-gray-300 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleRideStartOtpVerification}
                disabled={rideStartOtpInput.length !== 4 || isVerifyingOtp}
                className={`flex-1 py-2 rounded-md text-white ${
                  rideStartOtpInput.length === 4 && !isVerifyingOtp
                    ? "bg-[#0bbfe0] hover:bg-[#0999b3]"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                {isVerifyingOtp ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Verifying...
                  </div>
                ) : (
                  "Verify & Start"
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

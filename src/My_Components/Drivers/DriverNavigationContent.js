import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MapPin,
  Phone,
  MessageSquare,
  Navigation,
  Clock,
  CheckCircle,
  X,
} from "lucide-react";
import axiosInstance from "../../API/axiosInstance";
import secureLocalStorage from "react-secure-storage";
import toast from "react-hot-toast";

export default function DriverNavigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const uid = localStorage.getItem("@secure.n.uid");
  const decryptedUID = secureLocalStorage.getItem("uid");
  const mapRef = useRef(null);
  const [rideDetails, setRideDetails] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [eta, setEta] = useState(null);
  const [otpInput, setOtpInput] = useState("");
  const [rideStatus, setRideStatus] = useState("accepted"); // accepted, arrived, inProgress, completed
  const [mapInstance, setMapInstance] = useState(null);
  const [driverMarker, setDriverMarker] = useState(null);
  const [routeLine, setRouteLine] = useState(null);
  const [showOtpModal, setShowOtpModal] = useState(false);

  // Get ride details from location state or fetch from API
  useEffect(() => {
    const fetchRideDetails = async () => {
      try {
        // If ride details are passed via location state, use them
        if (location.state?.rideDetails) {
          // Only proceed if it's a one-way trip
          if (location.state.rideDetails.trip_type === 1) {
            setRideDetails(location.state.rideDetails);
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

  // Initialize map once we have ride details
  useEffect(() => {
    if (!rideDetails || !window.OlaMapsSDK) return;

    const initMap = async () => {
      try {
        const olaMaps = new window.OlaMapsSDK.OlaMaps({
          apiKey: process.env.REACT_APP_OLA_API_KEY,
        });

        // Parse pickup and drop coordinates
        const pickupCoords = parseCoordinates(rideDetails.pickup_location);
        const dropCoords = parseCoordinates(rideDetails.drop_location);

        if (!pickupCoords || !dropCoords) {
          console.error("Invalid coordinates");
          return;
        }

        // Get current location (in a real app, use browser geolocation)
        // For demo, we'll place the driver at a random position near pickup
        const initialDriverLng =
          pickupCoords.lng + (Math.random() - 0.5) * 0.01;
        const initialDriverLat =
          pickupCoords.lat + (Math.random() - 0.5) * 0.01;
        setCurrentLocation({ lat: initialDriverLat, lng: initialDriverLng });

        // Initialize map centered on driver's location
        const map = olaMaps.init({
          style:
            "https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json",
          container: "driver-map",
          center: [initialDriverLng, initialDriverLat],
          zoom: 15,
        });

        setMapInstance(map);

        // Add pickup marker (blue)
        olaMaps
          .addMarker({
            offset: [0, 6],
            anchor: "bottom",
            color: "blue",
          })
          .setLngLat([pickupCoords.lng, pickupCoords.lat])
          .addTo(map);

        // Add destination marker (red)
        olaMaps
          .addMarker({
            offset: [0, 6],
            anchor: "bottom",
            color: "red",
          })
          .setLngLat([dropCoords.lng, dropCoords.lat])
          .addTo(map);

        // Add driver marker (green)
        const driverMarkerInstance = olaMaps
          .addMarker({
            offset: [0, 6],
            anchor: "bottom",
            color: "green",
          })
          .setLngLat([initialDriverLng, initialDriverLat])
          .addTo(map);

        setDriverMarker(driverMarkerInstance);

        // Draw route from driver to pickup
        drawRoute(
          olaMaps,
          map,
          { lat: initialDriverLat, lng: initialDriverLng },
          pickupCoords
        );

        // Calculate initial ETA
        calculateEta(
          { lat: initialDriverLat, lng: initialDriverLng },
          pickupCoords
        );

        // Simulate driver movement (in a real app, this would be real GPS updates)
        startDriverSimulation(
          { lat: initialDriverLat, lng: initialDriverLng },
          pickupCoords,
          driverMarkerInstance,
          olaMaps,
          map
        );
      } catch (error) {
        console.error("Error initializing map:", error);
      }
    };

    initMap();
  }, [rideDetails]);

  // Helper function to parse coordinates from string
  const parseCoordinates = (coordString) => {
    try {
      // Check if the string is in "lat, lng" format
      const isLatLng =
        /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(\d{1,3}(\.\d+)?|\d(\.\d+)?)/.test(
          coordString
        );

      if (isLatLng) {
        const [lat, lng] = coordString
          .split(",")
          .map((coord) => Number.parseFloat(coord.trim()));
        return { lat, lng };
      }

      // If not in lat,lng format, return null (would need geocoding in a real app)
      return null;
    } catch (error) {
      console.error("Error parsing coordinates:", error);
      return null;
    }
  };

  // Draw route between two points
  const drawRoute = async (olaMaps, map, start, end) => {
    try {
      // Clear previous route if exists
      if (routeLine) {
        routeLine.remove();
      }

      // Get directions from Ola Maps API
      const response = await axiosInstance.get(
        `https://api.olamaps.io/routing/v1/directions?origin=${start.lat},${start.lng}&destination=${end.lat},${end.lng}&api_key=${process.env.REACT_APP_OLA_API_KEY}`
      );

      if (
        response.data &&
        response.data.routes &&
        response.data.routes.length > 0
      ) {
        const route = response.data.routes[0];

        // Create a GeoJSON object from the route geometry
        const routeGeoJSON = {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: route.geometry.coordinates,
          },
        };

        // Add the route to the map
        const routeLineInstance = olaMaps
          .addLine({
            data: routeGeoJSON,
            paint: {
              "line-color": "#0bbfe0",
              "line-width": 4,
              "line-opacity": 0.8,
            },
          })
          .addTo(map);

        setRouteLine(routeLineInstance);
      }
    } catch (error) {
      console.error("Error drawing route:", error);
    }
  };

  // Calculate ETA between two points
  const calculateEta = async (start, end) => {
    try {
      const response = await axiosInstance.get(
        `https://api.olamaps.io/routing/v1/distanceMatrix?origins=${start.lat},${start.lng}&destinations=${end.lat},${end.lng}&api_key=${process.env.REACT_APP_OLA_API_KEY}`
      );

      if (
        response.data &&
        response.data.rows &&
        response.data.rows.length > 0
      ) {
        const element = response.data.rows[0].elements[0];
        if (element && element.duration) {
          // Convert duration from seconds to minutes
          const etaMinutes = Math.ceil(element.duration / 60);
          setEta(etaMinutes);
        }
      }
    } catch (error) {
      console.error("Error calculating ETA:", error);
    }
  };

  // Simulate driver movement (in a real app, this would be real GPS updates)
  const startDriverSimulation = (start, destination, marker, olaMaps, map) => {
    const simulationSteps = 20; // Number of steps to simulate
    let currentStep = 0;

    const latStep = (destination.lat - start.lat) / simulationSteps;
    const lngStep = (destination.lng - start.lng) / simulationSteps;

    const interval = setInterval(() => {
      currentStep++;

      if (currentStep >= simulationSteps) {
        clearInterval(interval);
        setRideStatus("arrived");
        toast.success("You have arrived at the pickup location!");
        return;
      }

      const newLat = start.lat + latStep * currentStep;
      const newLng = start.lng + lngStep * currentStep;

      // Update driver marker position
      marker.setLngLat([newLng, newLat]);

      // Update current location state
      const newLocation = { lat: newLat, lng: newLng };
      setCurrentLocation(newLocation);

      // Recalculate ETA
      calculateEta(newLocation, destination);

      // Redraw route
      drawRoute(olaMaps, map, newLocation, destination);
    }, 3000); // Update every 3 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  };

  // Handle OTP verification
  const handleOtpVerification = async () => {
    try {
      // In a real app, this would be verified on the backend
      const res = await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/drivers/verifyOtp`,
        {
          decryptedUID,
          rideId: rideDetails.id,
          otp: otpInput,
        }
      );

      if (res.status === 200) {
        setRideStatus("inProgress");
        setShowOtpModal(false);
        toast.success("OTP verified! Ride started.");

        // If we have map and driver marker, update the route to destination
        if (mapInstance && driverMarker && currentLocation) {
          const dropCoords = parseCoordinates(rideDetails.drop_location);

          // Draw new route from current location to drop-off
          const olaMaps = new window.OlaMapsSDK.OlaMaps({
            apiKey: process.env.REACT_APP_OLA_API_KEY,
          });

          drawRoute(olaMaps, mapInstance, currentLocation, dropCoords);

          // Calculate new ETA to destination
          calculateEta(currentLocation, dropCoords);
        }
      } else {
        toast.error("Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("Error verifying OTP");
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

  // Handle ride completion
  const handleCompleteRide = async () => {
    try {
      await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/drivers/completeRide`,
        {
          decryptedUID,
          rideId: rideDetails.id,
        }
      );

      setRideStatus("completed");
      toast.success("Ride completed successfully!");
    } catch (error) {
      console.error("Error completing ride:", error);
      toast.error("Error completing ride");
    }
  };

  // Handle arrived at pickup
  const handleArrivedAtPickup = () => {
    try {
      setRideStatus("arrived");
      setShowOtpModal(true);
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
        {/* Map Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div
            id="driver-map"
            ref={mapRef}
            className="w-full h-64 md:h-96"
          ></div>
        </div>

        {/* Ride Status */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-[#077286]">
              {rideStatus === "accepted" && "Navigate to Pickup"}
              {rideStatus === "arrived" && "Waiting for Passenger"}
              {rideStatus === "inProgress" && "Navigate to Destination"}
              {rideStatus === "completed" && "Ride Completed"}
            </h2>
            {eta && rideStatus !== "completed" && (
              <div className="flex items-center bg-[#e0f2f7] px-4 py-2 rounded-full">
                <Clock className="w-5 h-5 mr-2 text-[#0bbfe0]" />
                <span className="font-semibold">
                  {rideStatus === "inProgress"
                    ? `${eta} min to destination`
                    : `${eta} min to pickup`}
                </span>
              </div>
            )}
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

          {rideStatus === "inProgress" && (
            <button
              onClick={handleCompleteRide}
              className="w-full bg-[#0bbfe0] hover:bg-[#0999b3] text-white py-3 rounded-md font-semibold flex items-center justify-center"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              Complete Ride
            </button>
          )}
        </div>
      </div>

      {/* OTP Modal */}
      {showOtpModal && (
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
                onClick={() => setShowOtpModal(false)}
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
                value={otpInput}
                onChange={(e) =>
                  setOtpInput(e.target.value.replace(/\D/g, "").slice(0, 4))
                }
                placeholder="Enter 4-digit OTP"
                className="w-full border rounded-md p-3 text-center text-2xl tracking-widest"
                maxLength={4}
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowOtpModal(false)}
                className="flex-1 py-2 border border-gray-300 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleOtpVerification}
                disabled={otpInput.length !== 4}
                className={`flex-1 py-2 rounded-md text-white ${
                  otpInput.length === 4
                    ? "bg-[#0bbfe0] hover:bg-[#0999b3]"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Verify & Start
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

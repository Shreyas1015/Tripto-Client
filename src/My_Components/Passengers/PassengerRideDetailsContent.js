import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MapPin,
  Phone,
  MessageSquare,
  Car,
  Clock,
  CreditCard,
  Star,
} from "lucide-react";
import axiosInstance from "../../API/axiosInstance";
import secureLocalStorage from "react-secure-storage";
import toast from "react-hot-toast";

export default function RideDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const uid = localStorage.getItem("@secure.n.uid");
  const decryptedUID = secureLocalStorage.getItem("uid");
  const mapRef = useRef(null);
  const [rideDetails, setRideDetails] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);
  const [eta, setEta] = useState(null);
  const [otp, setOtp] = useState(null);
  const [rideStatus, setRideStatus] = useState("accepted"); // accepted, arriving, arrived, inProgress, completed
  const [mapInstance, setMapInstance] = useState(null);
  const [driverMarker, setDriverMarker] = useState(null);
  const [routeLine, setRouteLine] = useState(null);

  // Get ride details from location state or fetch from API
  useEffect(() => {
    const fetchRideDetails = async () => {
      try {
        // If ride details are passed via location state, use them
        if (location.state?.rideDetails) {
          setRideDetails(location.state.rideDetails);
          return;
        }

        // Otherwise fetch from API
        const res = await axiosInstance.post(
          `${process.env.REACT_APP_BASE_URL}/passengers/getCurrentRide`,
          {
            decryptedUID,
          }
        );

        if (res.status === 200 && res.data) {
          setRideDetails(res.data);

          // Generate a random 4-digit OTP
          const generatedOtp = Math.floor(1000 + Math.random() * 9000);
          setOtp(generatedOtp);

          // Save OTP to backend
          await axiosInstance.post(
            `${process.env.REACT_APP_BASE_URL}/passengers/setRideOtp`,
            {
              decryptedUID,
              rideId: res.data.id,
              otp: generatedOtp,
            }
          );
        } else {
          toast.error("No active ride found");
          navigate(`/passengerdashboard?uid=${uid}`);
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

        // Initialize map centered on pickup location
        const map = olaMaps.init({
          style:
            "https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json",
          container: "ride-map",
          center: [pickupCoords.lng, pickupCoords.lat],
          zoom: 13,
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
        // Initially place it at a random position near pickup
        const initialDriverLng =
          pickupCoords.lng + (Math.random() - 0.5) * 0.01;
        const initialDriverLat =
          pickupCoords.lat + (Math.random() - 0.5) * 0.01;

        const driverMarkerInstance = olaMaps
          .addMarker({
            offset: [0, 6],
            anchor: "bottom",
            color: "green",
          })
          .setLngLat([initialDriverLng, initialDriverLat])
          .addTo(map);

        setDriverMarker(driverMarkerInstance);
        setDriverLocation({ lat: initialDriverLat, lng: initialDriverLng });

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

        // Simulate driver movement (in a real app, this would come from a backend)
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

  // Simulate driver movement (in a real app, this would come from a backend)
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
        toast.success("Driver has arrived at your pickup location!");
        return;
      }

      const newLat = start.lat + latStep * currentStep;
      const newLng = start.lng + lngStep * currentStep;

      // Update driver marker position
      marker.setLngLat([newLng, newLat]);

      // Update driver location state
      const newLocation = { lat: newLat, lng: newLng };
      setDriverLocation(newLocation);

      // Recalculate ETA
      calculateEta(newLocation, destination);

      // Redraw route
      drawRoute(olaMaps, map, newLocation, destination);

      // When driver is close to pickup (last 3 steps)
      if (currentStep >= simulationSteps - 3 && rideStatus === "accepted") {
        setRideStatus("arriving");
        toast.success("Driver is arriving soon!");
      }
    }, 3000); // Update every 3 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  };

  const handleOtpVerification = async (enteredOtp) => {
    try {
      // Verify OTP via backend
      const res = await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/passengers/verifyRideOtp`,
        {
          decryptedUID,
          rideId: rideDetails.id,
          enteredOtp: Number.parseInt(enteredOtp),
        }
      );

      if (res.status === 200 && res.data.success) {
        setRideStatus("inProgress");
        toast.success("OTP verified! Your ride has started.");

        // Update ride status in backend
        await axiosInstance.post(
          `${process.env.REACT_APP_BASE_URL}/passengers/startRide`,
          {
            decryptedUID,
            rideId: rideDetails.id,
          }
        );

        // Map updates
        if (mapInstance && driverMarker && driverLocation) {
          const dropCoords = parseCoordinates(rideDetails.drop_location);

          const olaMaps = new window.OlaMapsSDK.OlaMaps({
            apiKey: process.env.REACT_APP_OLA_API_KEY,
          });

          drawRoute(olaMaps, mapInstance, driverLocation, dropCoords);
          calculateEta(driverLocation, dropCoords);
        }
      } else {
        toast.error(res.data.message || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("Error verifying OTP");
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

  // Handle ride completion
  const handleCompleteRide = async () => {
    try {
      await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/passengers/completeRide`,
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

  // Handle payment
  const handlePayment = (method) => {
    toast.success(`Payment via ${method} will be processed`);
    navigate(`/rate-driver?uid=${uid}`, {
      state: { rideDetails },
    });
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
          <div id="ride-map" ref={mapRef} className="w-full h-64 md:h-80"></div>
        </div>

        {/* Ride Status */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-[#077286]">
              {rideStatus === "accepted" && "Driver Assigned"}
              {rideStatus === "arriving" && "Driver Arriving Soon"}
              {rideStatus === "arrived" && "Driver Has Arrived"}
              {rideStatus === "inProgress" && "Ride in Progress"}
              {rideStatus === "completed" && "Ride Completed"}
            </h2>
            {eta && rideStatus !== "completed" && (
              <div className="flex items-center bg-[#e0f2f7] px-4 py-2 rounded-full">
                <Clock className="w-5 h-5 mr-2 text-[#0bbfe0]" />
                <span className="font-semibold">
                  {rideStatus === "inProgress"
                    ? `${eta} min to destination`
                    : `${eta} min away`}
                </span>
              </div>
            )}
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
                  {rideDetails.licensePlate || "MH 01 AB 1234"}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold">
                {rideDetails.carColor || "White"}
              </p>
            </div>
          </div>

          {/* OTP Verification (shown only when driver has arrived) */}
          {rideStatus === "arrived" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 border border-[#0bbfe0] rounded-lg mb-6"
            >
              <h3 className="text-lg font-semibold mb-2">
                Verify OTP with Driver
              </h3>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold tracking-wider text-[#077286]">
                  {otp}
                </div>
                <button
                  onClick={() => handleOtpVerification(otp)}
                  className="bg-[#0bbfe0] hover:bg-[#0999b3] text-white px-4 py-2 rounded-md"
                >
                  Start Ride
                </button>
              </div>
            </motion.div>
          )}

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

          {/* Payment Options (shown only when ride is completed) */}
          {rideStatus === "completed" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold">Payment Method</h3>
              <div className="grid grid-cols-3 gap-4">
                <button
                  onClick={() => handlePayment("Cash")}
                  className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <CreditCard className="w-8 h-8 mb-2 text-[#0bbfe0]" />
                  <span>Cash</span>
                </button>
                <button
                  onClick={() => handlePayment("UPI")}
                  className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <CreditCard className="w-8 h-8 mb-2 text-[#0bbfe0]" />
                  <span>UPI</span>
                </button>
                <button
                  onClick={() => handlePayment("Card")}
                  className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <CreditCard className="w-8 h-8 mb-2 text-[#0bbfe0]" />
                  <span>Card</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* Action Button */}
          {rideStatus === "inProgress" && (
            <button
              onClick={handleCompleteRide}
              className="w-full bg-[#0bbfe0] hover:bg-[#0999b3] text-white py-3 rounded-md font-semibold mt-4"
            >
              Complete Ride
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

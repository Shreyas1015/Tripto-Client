import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, MapPin, Calendar, User, Phone, Mail } from "lucide-react";
import axiosInstance from "../../API/axiosInstance";
import secureLocalStorage from "react-secure-storage";
import toast from "react-hot-toast";
import { isFuture, parseISO } from "date-fns";

export default function VendorOneWayTripContent() {
  const navigate = useNavigate();
  const uid = localStorage.getItem("@secure.n.uid");
  const decryptedUID = secureLocalStorage.getItem("uid");
  const [fourSeater, setFourSeater] = useState(0);
  const [sixSeater, setSixSeater] = useState(0);
  const [vid, setVid] = useState(0);
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [dropSuggestions, setDropSuggestions] = useState([]);
  const [pickupCoords, setPickupCoords] = useState(null);
  const [dropCoords, setDropCoords] = useState(null);
  const mapRef = useRef(null);

  const [oneWayTrip, setOneWayTrip] = useState({
    uid: decryptedUID,
    vid: "",
    pickup_location: "",
    drop_location: "",
    pickup_date_time: "",
    passenger_name: "",
    passenger_phone: "",
    passenger_email: "",
  });

  // Fetch Passenger ID (VID)
  useEffect(() => {
    const fetchVID = async () => {
      try {
        const res = await axiosInstance.post(
          `${process.env.REACT_APP_BASE_URL}/vendor/fetchVID`,
          { decryptedUID }
        );
        setVid(res.data);
        console.log("VID: ", res.data);
      } catch (error) {
        console.error("Fetch VID Error: ", error.message);
      }
    };
    fetchVID();
  }, [decryptedUID]);

  // Initialize the map
  useEffect(() => {
    if (window.OlaMapsSDK) {
      const olaMaps = new window.OlaMapsSDK.OlaMaps({
        apiKey: process.env.REACT_APP_OLA_API_KEY,
      });

      const myMap = olaMaps.init({
        style:
          "https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json",
        container: "map",
        center: [72.83684765628624, 19.014235887210432], // Centering on Mumbai
        zoom: 15,
      });

      // Adding first draggable marker (pickup)
      const marker1 = olaMaps
        .addMarker({
          offset: [0, 6],
          anchor: "bottom",
          color: "blue",
          draggable: true,
        })
        .setLngLat([72.83684765628624, 19.014235887210432])
        .addTo(myMap);

      // Adding second draggable marker (drop)
      const marker2 = olaMaps
        .addMarker({
          offset: [0, 6],
          anchor: "bottom",
          color: "red",
          draggable: true,
        })
        .setLngLat([72.83284765628624, 19.014635887210432])
        .addTo(myMap);

      // Update coordinates on drag and set them to state
      const updateCoordinates = (marker, type) => {
        const { lng, lat } = marker.getLngLat();
        if (type === "pickup") {
          setPickupCoords({ lng, lat });
          setOneWayTrip((prev) => ({
            ...prev,
            pickup_location: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
          }));
        } else if (type === "drop") {
          setDropCoords({ lng, lat });
          setOneWayTrip((prev) => ({
            ...prev,
            drop_location: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
          }));
        }
      };

      marker1.on("drag", () => updateCoordinates(marker1, "pickup"));
      marker2.on("drag", () => updateCoordinates(marker2, "drop"));
    }
  }, []);

  // Fetch autocomplete suggestions for pickup or drop location
  const fetchAutocomplete = async (query, type) => {
    if (query.length < 3) return;

    try {
      const response = await axiosInstance.get(
        `https://api.olamaps.io/places/v1/autocomplete?input=${query}&api_key=${process.env.REACT_APP_OLA_API_KEY}`,
        { skipLoading: true }
      );

      const predictions = response.data.predictions || [];
      if (type === "pickup") {
        setPickupSuggestions(predictions);
      } else {
        setDropSuggestions(predictions);
      }
    } catch (error) {
      console.error("Autocomplete Error: ", error.message);
    }
  };

  const geocodeAddress = async (address) => {
    try {
      // Check if the address is already in lat/lng format
      const isLatLng =
        /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(\d{1,3}(\.\d+)?|\d(\.\d+)?)/.test(
          address
        );

      if (isLatLng) {
        const [lat, lng] = address
          .split(",")
          .map((coord) => Number.parseFloat(coord.trim()));
        console.log("Returning already provided coordinates:", { lat, lng });
        return { lat, lng }; // Return the coordinates directly
      }

      console.log("Address to be geocoded:", address);
      const encodedAddress = encodeURIComponent(address);
      const geocodeUrl = `https://api.olamaps.io/places/v1/geocode?address=${encodedAddress}&language=hi&api_key=${process.env.REACT_APP_OLA_API_KEY}`;

      const response = await axiosInstance.get(geocodeUrl);
      const geocodingResults = response.data.geocodingResults;

      if (!geocodingResults || geocodingResults.length === 0) {
        console.error("No geocoding results found.");
        return null;
      }

      let bestMatch = null;
      let smallestDistance = Number.POSITIVE_INFINITY;

      // Get coordinates of the original address
      const originalCoordinates = await getCoordinatesFromAddress(address);

      if (!originalCoordinates) {
        console.error("Original coordinates could not be determined.");
        return null;
      }

      // Function to calculate distance between two lat/lng points using Haversine formula
      const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Radius of the Earth in km
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLon = ((lon2 - lon1) * Math.PI) / 180;
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c; // Distance in km
        return distance;
      };

      // Loop through the results and calculate distance from original address
      geocodingResults.forEach((result) => {
        const resultCoordinates = result.geometry.location;
        const distance = calculateDistance(
          originalCoordinates.lat,
          originalCoordinates.lng,
          resultCoordinates.lat,
          resultCoordinates.lng
        );

        // Keep track of the closest match
        if (distance < smallestDistance) {
          smallestDistance = distance;
          bestMatch = result;
        }
      });

      if (bestMatch && bestMatch.geometry && bestMatch.geometry.location) {
        return bestMatch.geometry.location;
      } else {
        console.error("No suitable match found.");
        return null;
      }
    } catch (error) {
      console.error("Geocoding Error:", error.message);
      return null;
    }
  };

  const getCoordinatesFromAddress = async (address) => {
    try {
      // Check if the address is already in lat/lng format
      const isLatLng =
        /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(\d{1,3}(\.\d+)?|\d(\.\d+)?)/.test(
          address
        );

      if (isLatLng) {
        const [lat, lng] = address
          .split(",")
          .map((coord) => Number.parseFloat(coord.trim()));
        console.log("Returning already provided coordinates:", { lat, lng });
        return { lat, lng }; // Return the coordinates directly
      }

      const encodedAddress = encodeURIComponent(address);
      const geocodeUrl = `https://api.olamaps.io/places/v1/geocode?address=${encodedAddress}&language=hi&api_key=${process.env.REACT_APP_OLA_API_KEY}`;

      const response = await axiosInstance.get(geocodeUrl);
      const geocodingResults = response.data.geocodingResults;

      if (geocodingResults && geocodingResults.length > 0) {
        return geocodingResults[0].geometry.location;
      } else {
        console.error(
          "Could not retrieve coordinates for the original address."
        );
        return null;
      }
    } catch (error) {
      console.error("Error in getCoordinatesFromAddress:", error.message);
      return null;
    }
  };

  const fetchDistance = async (pickupLocation, dropLocation) => {
    try {
      // Check if the pickup and drop locations are already in lat/lng format
      const isPickupLatLng =
        /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(\d{1,3}(\.\d+)?|\d(\.\d+)?)/.test(
          pickupLocation
        );
      const isDropLatLng =
        /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(\d{1,3}(\.\d+)?|\d(\.\d+)?)/.test(
          dropLocation
        );

      let pickupCoords, dropCoords;

      if (isPickupLatLng) {
        const [pickupLat, pickupLng] = pickupLocation
          .split(",")
          .map((coord) => Number.parseFloat(coord.trim()));
        pickupCoords = { lat: pickupLat, lng: pickupLng };
        console.log("Using provided pickup coordinates:", pickupCoords);
      } else {
        pickupCoords = await geocodeAddress(pickupLocation);
      }

      if (isDropLatLng) {
        const [dropLat, dropLng] = dropLocation
          .split(",")
          .map((coord) => Number.parseFloat(coord.trim()));
        dropCoords = { lat: dropLat, lng: dropLng };
        console.log("Using provided drop coordinates:", dropCoords);
      } else {
        dropCoords = await geocodeAddress(dropLocation);
      }

      // Debugging: Log the coordinates to verify they are correct
      console.log("Pickup Coordinates:", pickupCoords);
      console.log("Drop Coordinates:", dropCoords);

      if (!pickupCoords || !dropCoords) {
        console.error(
          "Unable to retrieve coordinates for one or both locations."
        );
        return 0; // If geocoding fails, return 0
      }

      const { lat: pickupLat, lng: pickupLng } = pickupCoords;
      const { lat: dropLat, lng: dropLng } = dropCoords;

      // Fetch distance from the API using the geocoded coordinates
      const response = await axiosInstance.get(
        `https://api.olamaps.io/routing/v1/distanceMatrix?origins=${pickupLat},${pickupLng}&destinations=${dropLat},${dropLng}&api_key=${process.env.REACT_APP_OLA_API_KEY}`
      );

      // Debugging: Log the full API response to inspect the data structure
      console.log("Distance API response:", response.data);

      const distanceInMeters =
        response?.data?.rows?.[0]?.elements?.[0]?.distance;
      console.log("Distance in meters:", distanceInMeters);

      if (distanceInMeters !== undefined) {
        const distanceInKilometers = Math.round(distanceInMeters / 1000);
        console.log("Distance in kilometers:", distanceInKilometers);
        return distanceInKilometers;
      } else {
        console.error("Distance data is missing or malformed.");
        return 0;
      }
    } catch (error) {
      console.error("Error fetching distance: ", error.message);
      toast.error("Unable to calculate distance. Please try again.");
      return 0; // Default to 0 if an error occurs
    }
  };

  const calculatingPrice = async () => {
    const distance = await fetchDistance(
      oneWayTrip.pickup_location,
      oneWayTrip.drop_location
    );

    if (distance === 0) {
      toast.error("Unable to calculate price due to missing distance.");
      return { fourSeater: 0, sixSeater: 0, distance: 0 };
    }

    const priceForFourSeater = distance * 12;
    const priceForSixSeater = distance * 16;
    setFourSeater(priceForFourSeater);
    setSixSeater(priceForSixSeater);

    console.log("Returning from price calc func : ", {
      fourSeater: priceForFourSeater,
      sixSeater: priceForSixSeater,
      distance: distance,
    });

    return {
      fourSeater: priceForFourSeater,
      sixSeater: priceForSixSeater,
      distance,
    };
  };

  // Validate and format the pickup date and time
  const validatePickupDateTime = (pickupDateTime) => {
    const parsedDate = parseISO(pickupDateTime); // Parse the ISO string into a Date object
    if (!isFuture(parsedDate)) {
      toast.error("Pickup date and time must be in the future.");
      return false;
    }
    return true;
  };

  const handlePhaseOne = async (e) => {
    e.preventDefault();

    // Validate phone number
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(oneWayTrip.passenger_phone)) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    // Validate passenger name
    if (!oneWayTrip.passenger_name.trim()) {
      toast.error("Please enter passenger name");
      return;
    }

    // Validate pickup date and time
    if (!validatePickupDateTime(oneWayTrip.pickup_date_time)) {
      return;
    }
    const { fourSeater, sixSeater, distance } = await calculatingPrice();

    if (distance === 0) return;

    setOneWayTrip((prevState) => ({ ...prevState, vid }));
    navigate(`/vendor/car-type-selection?uid=${uid}`, {
      state: {
        fourSeater,
        sixSeater,
        distance,
        oneWayTrip: { ...oneWayTrip, vid },
      },
    });
  };

  const BackToLogin = () => {
    navigate("/");
  };

  if (!uid) {
    return (
      <div className="container text-center fw-bold">
        <h2>INVALID URL. Please provide a valid UID.</h2>
        <button onClick={BackToLogin} className="btn blue-buttons">
          Back to Login
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9fa] to-[#e9ecef] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex w-full max-w-6xl overflow-hidden bg-white shadow-xl rounded-xl"
      >
        <div className="w-full md:w-1/2 p-6">
          <div className="bg-gradient-to-r from-[#0070f3] to-[#00a8ff] p-6 text-white rounded-xl">
            <h1 className="text-3xl font-bold">Book One-Way Trip</h1>
            <p className="text-blue-100 mt-2">
              Enter trip and passenger details
            </p>
          </div>

          <div className="p-6">
            <motion.form
              onSubmit={handlePhaseOne}
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <div className="space-y-2">
                <input type="hidden" name="vid" value={vid} />
                <label className="flex items-center text-lg font-semibold text-gray-700">
                  <User className="mr-2 h-5 w-5 text-blue-500" />
                  Passenger Name
                </label>
                <input
                  type="text"
                  placeholder="Enter passenger name"
                  className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  value={oneWayTrip.passenger_name}
                  onChange={(e) =>
                    setOneWayTrip({
                      ...oneWayTrip,
                      passenger_name: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-lg font-semibold text-gray-700">
                  <Phone className="mr-2 h-5 w-5 text-blue-500" />
                  Passenger Phone
                </label>
                <input
                  type="tel"
                  placeholder="Enter 10-digit phone number"
                  className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  value={oneWayTrip.passenger_phone}
                  onChange={(e) =>
                    setOneWayTrip({
                      ...oneWayTrip,
                      passenger_phone: e.target.value,
                    })
                  }
                  pattern="[0-9]{10}"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-lg font-semibold text-gray-700">
                  <Mail className="mr-2 h-5 w-5 text-blue-500" />
                  Passenger Email
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  value={oneWayTrip.passenger_email}
                  onChange={(e) =>
                    setOneWayTrip({
                      ...oneWayTrip,
                      passenger_email: e.target.value,
                    })
                  }

                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-lg font-semibold text-gray-700">
                  <MapPin className="mr-2 h-5 w-5 text-blue-500" />
                  Pickup Location
                </label>
                <input
                  type="text"
                  placeholder="Enter pickup location"
                  className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  value={oneWayTrip.pickup_location}
                  onChange={(e) => {
                    setOneWayTrip({
                      ...oneWayTrip,
                      pickup_location: e.target.value,
                    });
                    fetchAutocomplete(e.target.value, "pickup");
                  }}
                />
                {pickupSuggestions.length > 0 && (
                  <ul
                    className="border rounded-lg bg-white max-h-40 overflow-y-auto shadow-md"
                    style={{ scrollbarWidth: "thin" }}
                  >
                    {pickupSuggestions.map((suggestion, index) => (
                      <li
                        key={index}
                        className="p-3 cursor-pointer hover:bg-blue-50 transition-colors"
                        onClick={() => {
                          setOneWayTrip({
                            ...oneWayTrip,
                            pickup_location: suggestion.description,
                          });
                          setPickupSuggestions([]);
                        }}
                      >
                        {suggestion.description}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-lg font-semibold text-gray-700">
                  <MapPin className="mr-2 h-5 w-5 text-blue-500" />
                  Drop Location
                </label>
                <input
                  type="text"
                  placeholder="Enter drop location"
                  className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  value={oneWayTrip.drop_location}
                  onChange={(e) => {
                    setOneWayTrip({
                      ...oneWayTrip,
                      drop_location: e.target.value,
                    });
                    fetchAutocomplete(e.target.value, "drop");
                  }}
                />
                {dropSuggestions.length > 0 && (
                  <ul
                    className="border rounded-lg bg-white max-h-40 overflow-y-auto shadow-md"
                    style={{ scrollbarWidth: "thin" }}
                  >
                    {dropSuggestions.map((suggestion, index) => (
                      <li
                        key={index}
                        className="p-3 cursor-pointer hover:bg-blue-50 transition-colors"
                        onClick={() => {
                          setOneWayTrip({
                            ...oneWayTrip,
                            drop_location: suggestion.description,
                          });
                          setDropSuggestions([]);
                        }}
                      >
                        {suggestion.description}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-lg font-semibold text-gray-700">
                  <Calendar className="mr-2 h-5 w-5 text-blue-500" />
                  Pickup Date and Time
                </label>
                <input
                  type="datetime-local"
                  className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={oneWayTrip.pickup_date_time}
                  onChange={(e) =>
                    setOneWayTrip({
                      ...oneWayTrip,
                      pickup_date_time: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="flex items-center justify-center w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md transition-colors"
              >
                Continue <ArrowRight className="ml-2 h-5 w-5" />
              </motion.button>
            </motion.form>
          </div>
        </div>

        <div className="hidden md:block md:w-1/2 relative">
          <div
            id="map"
            ref={mapRef}
            className="absolute inset-0 rounded-r-xl overflow-hidden"
          ></div>
          <div className="absolute bottom-4 right-4 bg-white p-3 rounded-lg shadow-lg">
            <div className="flex items-center space-x-2 text-sm font-medium">
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-blue-500 mr-1"></div>
                <span>Pickup</span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-red-500 mr-1"></div>
                <span>Drop</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

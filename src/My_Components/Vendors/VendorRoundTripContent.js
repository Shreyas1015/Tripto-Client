import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../API/axiosInstance";
import secureLocalStorage from "react-secure-storage";
import { ArrowRight, MapPin, Calendar, User, Phone, Clock } from "lucide-react";
import toast from "react-hot-toast";
import { differenceInCalendarDays, differenceInDays, isBefore, isFuture, parseISO } from "date-fns";

export default function VendorRoundTripContent() {
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

  const [roundTrip, setRoundTrip] = useState({
    uid: decryptedUID,
    vid: "",
    pickup_location: "",
    drop_location: "",
    pickup_date_time: "",
    return_date_time: "",
    no_of_days: "",
    passenger_name: "",
    passenger_phone: "",
  });

  useEffect(() => {
    const fetchVID = async () => {
      try {
        const res = await axiosInstance.post(
          `${process.env.REACT_APP_BASE_URL}/vendor/fetchVID`,
          { decryptedUID }
        );
        console.log("VID Response: ", res.data);
        setVid(res.data);
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
          setRoundTrip((prev) => ({
            ...prev,
            pickup_location: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
          }));
        } else if (type === "drop") {
          setDropCoords({ lng, lat });
          setRoundTrip((prev) => ({
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

  // const calculatingPrice = async () => {
  //   try {
  //     const distance = await fetchDistance(
  //       roundTrip.pickup_location,
  //       roundTrip.drop_location
  //     );

  //     console.log("Fetched Distance: ", distance);

  //     // Handle invalid or zero distance
  //     if (!distance || distance <= 0) {
  //       console.log("Distance is invalid or zero. Unable to calculate price.");
  //       toast.error(
  //         "Unable to calculate price due to missing or invalid distance."
  //       );
  //       return { fourSeater: 0, sixSeater: 0, distance: 0 };
  //     }

  //     // // Calculate number of days here
  //     // const pickupDate = new Date(roundTrip.pickup_date_time);
  //     // const returnDate = new Date(roundTrip.return_date_time);
  //     // const timeDifference = returnDate.getTime() - pickupDate.getTime();
  //     // const numberOfDays = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
  //     // console.log("Calculated Number of Days: ", numberOfDays);

  //     // Calculate number of days
  //     const numberOfDays = differenceInDays(
  //       parseISO(roundTrip.return_date_time),
  //       parseISO(roundTrip.pickup_date_time)
  //     );
  //     console.log("Calculated Number of Days: ", numberOfDays);

  //     const inputKM = distance * 2; // Round trip distance
  //     console.log("Input Kilometers (Round Trip): ", inputKM);

  //     // Calculate per-day charges
  //     const perDayCharges = numberOfDays * 300;
  //     console.log("Per Day Charges: ", perDayCharges);

  //     let finalRateForFourSeater;
  //     let finalRateForSixSeater;

  //     // Apply original redundant logic
  //     if (inputKM > perDayCharges) {
  //       const finalKM1_for_four_seater = inputKM * 12;
  //       const finalKM1_for_six_seater = inputKM * 16;
  //       const nights = numberOfDays - 1;
  //       const nightCharges = nights * 500;
  //       console.log("Night Charges (inputKM > perDayCharges): ", nightCharges);

  //       finalRateForFourSeater = finalKM1_for_four_seater + nightCharges;
  //       finalRateForSixSeater = finalKM1_for_six_seater + nightCharges;
  //     } else {
  //       const finalKM2_for_four_seater = perDayCharges * 12;
  //       const finalKM2_for_six_seater = perDayCharges * 16;
  //       const nights = numberOfDays - 1;
  //       const nightCharges = nights * 500;
  //       console.log("Night Charges (perDayCharges >= inputKM): ", nightCharges);

  //       finalRateForFourSeater = finalKM2_for_four_seater + nightCharges;
  //       finalRateForSixSeater = finalKM2_for_six_seater + nightCharges;
  //     }

  //     console.log("Final Rate for Four Seater: ", finalRateForFourSeater);
  //     console.log("Final Rate for Six Seater: ", finalRateForSixSeater);

  //     // Update state
  //     setFourSeater(finalRateForFourSeater);
  //     setSixSeater(finalRateForSixSeater);

  //     return {
  //       fourSeater: finalRateForFourSeater,
  //       sixSeater: finalRateForSixSeater,
  //       distance,
  //     };
  //   } catch (error) {
  //     console.error("Error calculating price:", error);
  //     toast.error("An error occurred while calculating the price.");
  //     return { fourSeater: 0, sixSeater: 0, distance: 0 };
  //   }
  // };

  const calculatingPrice = async () => {
    try {
      const distance = await fetchDistance(
        roundTrip.pickup_location,
        roundTrip.drop_location
      );

      console.log("Fetched Distance: ", distance);

      // Handle invalid or zero distance
      if (!distance || distance <= 0) {
        console.log("Distance is invalid or zero. Unable to calculate price.");
        toast.error(
          "Unable to calculate price due to missing or invalid distance."
        );
        return { fourSeater: 0, sixSeater: 0, distance: 0 };
      }

      // Calculate number of days using date-fns
      const numberOfDays = differenceInCalendarDays(
        parseISO(roundTrip.return_date_time),
        parseISO(roundTrip.pickup_date_time)
      ) || 1;

      console.log("Calculated Number of Days: ", numberOfDays);

      const inputKM = distance * 2; // Round trip distance
      console.log("Input Kilometers (Round Trip): ", inputKM);

      // Calculate per-day charges
      const perDayCharges = numberOfDays * 300;
      console.log("Per Day Charges: ", perDayCharges);

      let finalRateForFourSeater;
      let finalRateForSixSeater;

      const nights = numberOfDays - 1;
      const nightCharges = nights * 500;

      if (inputKM > perDayCharges) {
        const finalKM1_for_four_seater = inputKM * 12;
        const finalKM1_for_six_seater = inputKM * 16;

        console.log("Night Charges (inputKM > perDayCharges): ", nightCharges);

        finalRateForFourSeater = finalKM1_for_four_seater + nightCharges;
        finalRateForSixSeater = finalKM1_for_six_seater + nightCharges;
      } else {
        const finalKM2_for_four_seater = perDayCharges * 12;
        const finalKM2_for_six_seater = perDayCharges * 16;

        console.log("Night Charges (perDayCharges >= inputKM): ", nightCharges);

        finalRateForFourSeater = finalKM2_for_four_seater + nightCharges;
        finalRateForSixSeater = finalKM2_for_six_seater + nightCharges;
      }

      console.log("Final Rate for Four Seater: ", finalRateForFourSeater);
      console.log("Final Rate for Six Seater: ", finalRateForSixSeater);

      setFourSeater(finalRateForFourSeater);
      setSixSeater(finalRateForSixSeater);

      return {
        fourSeater: finalRateForFourSeater,
        sixSeater: finalRateForSixSeater,
        distance,
      };
    } catch (error) {
      console.error("Error calculating price:", error);
      toast.error("An error occurred while calculating the price.");
      return { fourSeater: 0, sixSeater: 0, distance: 0 };
    }
  };


  const handlePhaseOne = async (e) => {
    e.preventDefault();

    // Validate phone number
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(roundTrip.passenger_phone)) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    // Validate passenger name
    if (!roundTrip.passenger_name.trim()) {
      toast.error("Please enter passenger name");
      return;
    }

    const { pickup_date_time, return_date_time } = roundTrip;

    const pickupDate = parseISO(pickup_date_time);
    const returnDate = parseISO(return_date_time);
    const currentDate = new Date();

    if (isBefore(pickupDate, currentDate)) {
      toast.error("Pickup date and time must be from the present day or later.");
      return;
    }

    if (isBefore(returnDate, pickupDate)) {
      toast.error("Return date & time cannot be before the pickup date.");
      return;
    }

    const numberOfDays = differenceInCalendarDays(returnDate, pickupDate) || 1; // Minimum 1 day

    console.log("Calculated Number of Days: ", numberOfDays);

    const updatedRoundTrip = {
      ...roundTrip,
      no_of_days: numberOfDays,
      vid, // Include vid directly here
    };

    const { fourSeater, sixSeater, distance } = await calculatingPrice();

    navigate(`/vendor/car-type-selection?uid=${uid}`, {
      state: {
        fourSeater,
        sixSeater,
        distance,
        roundTrip: updatedRoundTrip,
      },
    });

    console.log("Round Trip after update: ", updatedRoundTrip);
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
            <h1 className="text-3xl font-bold">Book Round Trip</h1>
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
                  value={roundTrip.passenger_name}
                  onChange={(e) =>
                    setRoundTrip({
                      ...roundTrip,
                      passenger_name: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <input type="hidden" name="vid" value={vid} />
                <label className="flex items-center text-lg font-semibold text-gray-700">
                  <User className="mr-2 h-5 w-5 text-blue-500" />
                  Passenger Email
                </label>
                <input
                  type="email"
                  placeholder="Enter passenger email"
                  className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  value={roundTrip.passenger_email}
                  onChange={(e) =>
                    setRoundTrip({
                      ...roundTrip,
                      passenger_email: e.target.value,
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
                  value={roundTrip.passenger_phone}
                  onChange={(e) =>
                    setRoundTrip({
                      ...roundTrip,
                      passenger_phone: e.target.value,
                    })
                  }
                  pattern="[0-9]{10}"
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
                  value={roundTrip.pickup_location}
                  onChange={(e) => {
                    setRoundTrip({
                      ...roundTrip,
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
                          setRoundTrip({
                            ...roundTrip,
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
                  value={roundTrip.drop_location}
                  onChange={(e) => {
                    setRoundTrip({
                      ...roundTrip,
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
                          setRoundTrip({
                            ...roundTrip,
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
                  Pickup Date & Time
                </label>
                <input
                  type="datetime-local"
                  className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  value={roundTrip.pickup_date_time}
                  onChange={(e) =>
                    setRoundTrip({
                      ...roundTrip,
                      pickup_date_time: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-lg font-semibold text-gray-700">
                  <Clock className="mr-2 h-5 w-5 text-blue-500" />
                  Return Date & Time
                </label>
                <input
                  type="datetime-local"
                  className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  value={roundTrip.return_date_time}
                  onChange={(e) =>
                    setRoundTrip({
                      ...roundTrip,
                      return_date_time: e.target.value,
                    })
                  }
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

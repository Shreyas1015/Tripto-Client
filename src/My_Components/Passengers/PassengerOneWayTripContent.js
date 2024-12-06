// import React, { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { useNavigate } from "react-router-dom";
// import { ArrowRight } from "lucide-react";
// import axiosInstance from "../../API/axiosInstance";
// import secureLocalStorage from "react-secure-storage";

// export default function PassengerOneWayTripContent() {
//   const navigate = useNavigate();
//   const uid = localStorage.getItem("@secure.n.uid");
//   const decryptedUID = secureLocalStorage.getItem("uid");
//   const [fourSeater, setFourSeater] = useState(0);
//   const [sixSeater, setSixSeater] = useState(0);
//   const [pid, setPid] = useState(0);

//   const [oneWayTrip, setOneWayTrip] = useState({
//     uid: decryptedUID,
//     pid: "",
//     pickup_location: "",
//     drop_location: "",
//     pickup_date_time: "",
//   });

//   useEffect(() => {
//     const fetchPID = async () => {
//       try {
//         const res = await axiosInstance.post(
//           `${process.env.REACT_APP_BASE_URL}/passengers/fetchPID`,
//           { decryptedUID }
//         );
//         setPid(res.data);
//       } catch (error) {
//         console.error("Fetch PID Error: ", error.message);
//       }
//     };
//     fetchPID();
//   }, [decryptedUID]);
//   const handlePhaseOne = (e) => {
//     e.preventDefault();
//     const now = new Date();
//     const pickupDateTime = new Date(oneWayTrip.pickup_date_time);

//     if (pickupDateTime <= now) {
//       alert("Pickup date and time must be in the future.");
//       return;
//     }

//     // Calculate prices before navigating
//     const { fourSeater, sixSeater, distance } = calculatingPrice();

//     setOneWayTrip((prevState) => ({ ...prevState, pid }));
//     navigate(`/car-type-selection?uid${uid}`, {
//       state: {
//         fourSeater,
//         sixSeater,
//         distance,
//         oneWayTrip: { ...oneWayTrip, pid },
//       },
//     });
//     console.log("One Way Trip Data: ", { ...oneWayTrip, pid }, distance);
//   };

//   const calculatingPrice = () => {
//     const distance = 50; // Dummy distance in kilometers
//     const priceForFourSeater = distance * 12;
//     const priceForSixSeater = distance * 16;
//     setFourSeater(priceForFourSeater);
//     setSixSeater(priceForSixSeater);
//     return {
//       fourSeater: priceForFourSeater,
//       sixSeater: priceForSixSeater,
//       distance,
//     };
//   };

//   const BackToLogin = () => {
//     navigate("/");
//   };

//   if (!uid) {
//     return (
//       <div className="container text-center fw-bold">
//         <h2>INVALID URL. Please provide a valid UID.</h2>
//         <button onClick={BackToLogin} className="btn blue-buttons">
//           Back to Login
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-[#e6f7fb] to-[#e0f2f7] flex items-center justify-center p-4">
//       <div className="w-full max-w-2xl overflow-hidden bg-white shadow-lg rounded-lg">
//         <div className="bg-gradient-to-r from-[#0bbfe0] to-[#077286] p-6 text-white">
//           <h1 className="text-3xl font-bold">Book Your One Way Trip</h1>
//           <p className="text-[#e0f2f7]">Enter your trip details</p>
//         </div>

//         <div className="p-6">
//           <motion.form onSubmit={handlePhaseOne} className="space-y-6">
//             <div className="space-y-2">
//               <input type="hidden" name="pid" value={pid} />
//               <label className="text-lg font-semibold">Pickup Location</label>
//               <input
//                 type="text"
//                 placeholder="Enter pickup location"
//                 className="border rounded-md p-2 w-full"
//                 required
//                 value={oneWayTrip.pickup_location}
//                 onChange={(e) =>
//                   setOneWayTrip({
//                     ...oneWayTrip,
//                     pickup_location: e.target.value,
//                   })
//                 }
//               />
//             </div>
//             <div className="space-y-2">
//               <label className="text-lg font-semibold">Drop Location</label>
//               <input
//                 type="text"
//                 placeholder="Enter drop location"
//                 className="border rounded-md p-2 w-full"
//                 required
//                 value={oneWayTrip.drop_location}
//                 onChange={(e) =>
//                   setOneWayTrip({
//                     ...oneWayTrip,
//                     drop_location: e.target.value,
//                   })
//                 }
//               />
//             </div>
//             <div className="space-y-2">
//               <label className="text-lg font-semibold">
//                 Pickup Date & Time
//               </label>
//               <input
//                 type="datetime-local"
//                 className="border rounded-md p-2 w-full"
//                 required
//                 value={oneWayTrip.pickup_date_time}
//                 onChange={(e) =>
//                   setOneWayTrip({
//                     ...oneWayTrip,
//                     pickup_date_time: e.target.value,
//                   })
//                 }
//               />
//             </div>
//             <button
//               type="submit"
//               className="flex items-center justify-center w-28 bg-[#0bbfe0] hover:bg-[#0999b3] text-white px-4 py-2 rounded-md"
//             >
//               Next <ArrowRight className="ml-2 h-4 w-4" />
//             </button>
//           </motion.form>
//         </div>
//       </div>
//     </div>
//   );
// }

// Main Code :

// import React, { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { useNavigate } from "react-router-dom";
// import { ArrowRight } from "lucide-react";
// import axiosInstance from "../../API/axiosInstance";
// import secureLocalStorage from "react-secure-storage";
// import toast from "react-hot-toast";

// export default function PassengerOneWayTripContent() {
//   const navigate = useNavigate();
//   const uid = localStorage.getItem("@secure.n.uid");
//   const decryptedUID = secureLocalStorage.getItem("uid");
//   const [fourSeater, setFourSeater] = useState(0);
//   const [sixSeater, setSixSeater] = useState(0);
//   const [pid, setPid] = useState(0);
//   const [pickupSuggestions, setPickupSuggestions] = useState([]);
//   const [dropSuggestions, setDropSuggestions] = useState([]);

//   const [oneWayTrip, setOneWayTrip] = useState({
//     uid: decryptedUID,
//     pid: "",
//     pickup_location: "",
//     drop_location: "",
//     pickup_date_time: "",
//   });

//   // Fetch Passenger ID (PID)
//   useEffect(() => {
//     const fetchPID = async () => {
//       try {
//         const res = await axiosInstance.post(
//           `${process.env.REACT_APP_BASE_URL}/passengers/fetchPID`,
//           { decryptedUID }
//         );
//         setPid(res.data);
//       } catch (error) {
//         console.error("Fetch PID Error: ", error.message);
//       }
//     };
//     fetchPID();
//   }, [decryptedUID]);

//   // Fetch autocomplete suggestions for pickup or drop location
//   const fetchAutocomplete = async (query, type) => {
//     if (query.length < 3) return;

//     try {
//       const response = await axiosInstance.get(
//         `https://api.olamaps.io/places/v1/autocomplete?input=${query}&api_key=${process.env.REACT_APP_OLA_API_KEY}`,
//         { skipLoading: true }
//       );

//       const predictions = response.data.predictions || [];
//       if (type === "pickup") {
//         setPickupSuggestions(predictions);
//       } else {
//         setDropSuggestions(predictions);
//       }
//     } catch (error) {
//       console.error("Autocomplete Error: ", error.message);
//     }
//   };

// const geocodeAddress = async (address) => {
//   try {
//     console.log("Address to be geocoded:", address);

//     const encodedAddress = encodeURIComponent(address);
//     const geocodeUrl = `https://api.olamaps.io/places/v1/geocode?address=${encodedAddress}&language=hi&api_key=${process.env.REACT_APP_OLA_API_KEY}`;

//     const response = await axiosInstance.get(geocodeUrl);
//     const geocodingResults = response.data.geocodingResults;
//     if (!geocodingResults || geocodingResults.length === 0) {
//       console.error("No geocoding results found.");
//       return null;
//     }

//     let bestMatch = null;
//     let smallestDistance = Infinity;

//     // Get coordinates of the original address
//     const originalCoordinates = await getCoordinatesFromAddress(address);

//     if (!originalCoordinates) {
//       console.error("Original coordinates could not be determined.");
//       return null;
//     }

//     // Function to calculate distance between two lat/lng points using Haversine formula
//     const calculateDistance = (lat1, lon1, lat2, lon2) => {
//       const R = 6371; // Radius of the Earth in km
//       const dLat = ((lat2 - lat1) * Math.PI) / 180;
//       const dLon = ((lon2 - lon1) * Math.PI) / 180;
//       const a =
//         Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//         Math.cos((lat1 * Math.PI) / 180) *
//           Math.cos((lat2 * Math.PI) / 180) *
//           Math.sin(dLon / 2) *
//           Math.sin(dLon / 2);
//       const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//       const distance = R * c; // Distance in km
//       return distance;
//     };

//     // Loop through the results and calculate distance from original address
//     geocodingResults.forEach((result) => {
//       const resultCoordinates = result.geometry.location;
//       const distance = calculateDistance(
//         originalCoordinates.lat,
//         originalCoordinates.lng,
//         resultCoordinates.lat,
//         resultCoordinates.lng
//       );

//       // Keep track of the closest match
//       if (distance < smallestDistance) {
//         smallestDistance = distance;
//         bestMatch = result;
//       }
//     });

//     if (bestMatch && bestMatch.geometry && bestMatch.geometry.location) {
//       return bestMatch.geometry.location;
//     } else {
//       console.error("No suitable match found.");
//       return null;
//     }
//   } catch (error) {
//     console.error("Geocoding Error:", error.message);
//     return null;
//   }
// };

// const getCoordinatesFromAddress = async (address) => {
//   try {
//     const encodedAddress = encodeURIComponent(address);
//     const geocodeUrl = `https://api.olamaps.io/places/v1/geocode?address=${encodedAddress}&language=hi&api_key=${process.env.REACT_APP_OLA_API_KEY}`;

//     const response = await axiosInstance.get(geocodeUrl);
//     const geocodingResults = response.data.geocodingResults;

//     if (geocodingResults && geocodingResults.length > 0) {
//       return geocodingResults[0].geometry.location;
//     } else {
//       console.error(
//         "Could not retrieve coordinates for the original address."
//       );
//       return null;
//     }
//   } catch (error) {
//     console.error("Error in getCoordinatesFromAddress:", error.message);
//     return null;
//   }
// };

//   const fetchDistance = async (pickupLocation, dropLocation) => {
//     try {
//       // Geocode both pickup and drop locations
//       const pickupCoords = await geocodeAddress(pickupLocation);
//       const dropCoords = await geocodeAddress(dropLocation);

//       // Debugging: Log the coordinates to verify they are correct
//       console.log("Pickup Coordinates:", pickupCoords);
//       console.log("Drop Coordinates:", dropCoords);

//       if (!pickupCoords || !dropCoords) {
//         console.error(
//           "Unable to retrieve coordinates for one or both locations."
//         );
//         return 0; // If geocoding fails, return 0
//       }

//       const { lat: pickupLat, lng: pickupLng } = pickupCoords;
//       const { lat: dropLat, lng: dropLng } = dropCoords;

//       // Fetch distance from the API using the geocoded coordinates
//       const response = await axiosInstance.get(
//         `https://api.olamaps.io/routing/v1/distanceMatrix?origins=${pickupLat},${pickupLng}&destinations=${dropLat},${dropLng}&api_key=${process.env.REACT_APP_OLA_API_KEY}`
//       );

//       // Debugging: Log the full API response to inspect the data structure
//       console.log("Distance API response:", response.data);

//       // Log the rows and elements to inspect their structure
//       console.log("Rows:", response.data.rows);
//       console.log("Elements:", response.data.rows[0].elements);

//       const distanceInMeters =
//         response?.data?.rows?.[0]?.elements?.[0]?.distance;
//       console.log("Distance in meters:", distanceInMeters);

//       if (distanceInMeters !== undefined) {
//         const distanceInKilometers = Math.round(distanceInMeters / 1000);
//         console.log("Distance in kilometers:", distanceInKilometers);
//         return distanceInKilometers;
//       } else {
//         console.error("Distance data is missing or malformed.");
//         return 0;
//       }
//     } catch (error) {
//       console.error("Error fetching distance: ", error.message);
//       toast.error("Unable to calculate distance. Please try again.");
//       return 0; // Default to 0 if an error occurs
//     }
//   };

//   const calculatingPrice = async () => {
//     const distance = await fetchDistance(
//       oneWayTrip.pickup_location,
//       oneWayTrip.drop_location
//     );

//     if (distance === 0) {
//       toast.error("Unable to calculate price due to missing distance.");
//       return { fourSeater: 0, sixSeater: 0, distance: 0 };
//     }

//     const priceForFourSeater = distance * 12;
//     const priceForSixSeater = distance * 16;
//     setFourSeater(priceForFourSeater);
//     setSixSeater(priceForSixSeater);

//     console.log("Returning from price calc func : ", {
//       fourSeater: priceForFourSeater,
//       sixSeater: priceForSixSeater,
//       distance: distance,
//     });

//     return {
//       fourSeater: priceForFourSeater,
//       sixSeater: priceForSixSeater,
//       distance,
//     };
//   };

//   const handlePhaseOne = async (e) => {
//     e.preventDefault();

//     const now = new Date();
//     const pickupDateTime = new Date(oneWayTrip.pickup_date_time);

//     if (pickupDateTime <= now) {
//       toast.error("Pickup date and time must be in the future.");
//       return;
//     }

//     const { fourSeater, sixSeater, distance } = await calculatingPrice();

//     if (distance === 0) return;

//     setOneWayTrip((prevState) => ({ ...prevState, pid }));
//     navigate(`/car-type-selection?uid=${uid}`, {
//       state: {
//         fourSeater,
//         sixSeater,
//         distance,
//         oneWayTrip: { ...oneWayTrip, pid },
//       },
//     });
//   };

//   const BackToLogin = () => {
//     navigate("/");
//   };

//   if (!uid) {
//     return (
//       <div className="container text-center fw-bold">
//         <h2>INVALID URL. Please provide a valid UID.</h2>
//         <button onClick={BackToLogin} className="btn blue-buttons">
//           Back to Login
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-[#e6f7fb] to-[#e0f2f7] flex items-center justify-center p-4">
//       <div className="w-full max-w-2xl overflow-hidden bg-white shadow-lg rounded-lg">
//         <div className="bg-gradient-to-r from-[#0bbfe0] to-[#077286] p-6 text-white">
//           <h1 className="text-3xl font-bold">Book Your One Way Trip</h1>
//           <p className="text-[#e0f2f7]">Enter your trip details</p>
//         </div>

//         <div className="p-6">
//           <motion.form onSubmit={handlePhaseOne} className="space-y-6">
//             <div className="space-y-2">
//               <input type="hidden" name="pid" value={pid} />
//               <label className="text-lg font-semibold">Pickup Location</label>
//               <input
//                 type="text"
//                 placeholder="Enter pickup location"
//                 className="border rounded-md p-2 w-full"
//                 required
//                 value={oneWayTrip.pickup_location}
//                 onChange={(e) => {
//                   setOneWayTrip({
//                     ...oneWayTrip,
//                     pickup_location: e.target.value,
//                   });
//                   fetchAutocomplete(e.target.value, "pickup");
//                 }}
//               />
//               <ul
//                 className="border rounded-md bg-white max-h-40 overflow-y-auto"
//                 style={{ scrollbarWidth: "thin" }}
//               >
//                 {pickupSuggestions.map((suggestion, index) => (
//                   <li
//                     key={index}
//                     className="p-2 cursor-pointer hover:bg-gray-200"
//                     onClick={() => {
//                       setOneWayTrip({
//                         ...oneWayTrip,
//                         pickup_location: suggestion.description,
//                       });
//                       setPickupSuggestions([]);
//                     }}
//                   >
//                     {suggestion.description}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//             <div className="space-y-2">
//               <label className="text-lg font-semibold">Drop Location</label>
//               <input
//                 type="text"
//                 placeholder="Enter drop location"
//                 className="border rounded-md p-2 w-full"
//                 required
//                 value={oneWayTrip.drop_location}
//                 onChange={(e) => {
//                   setOneWayTrip({
//                     ...oneWayTrip,
//                     drop_location: e.target.value,
//                   });
//                   fetchAutocomplete(e.target.value, "drop");
//                 }}
//               />
//               <ul
//                 className="border rounded-md bg-white max-h-40 overflow-y-auto"
//                 style={{ scrollbarWidth: "thin" }}
//               >
//                 {dropSuggestions.map((suggestion, index) => (
//                   <li
//                     key={index}
//                     className="p-2 cursor-pointer hover:bg-gray-200"
//                     onClick={() => {
//                       setOneWayTrip({
//                         ...oneWayTrip,
//                         drop_location: suggestion.description,
//                       });
//                       setDropSuggestions([]);
//                     }}
//                   >
//                     {suggestion.description}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//             <div className="space-y-2">
//               <label className="text-lg font-semibold">
//                 Pickup Date & Time
//               </label>
//               <input
//                 type="datetime-local"
//                 className="border rounded-md p-2 w-full"
//                 required
//                 value={oneWayTrip.pickup_date_time}
//                 onChange={(e) =>
//                   setOneWayTrip({
//                     ...oneWayTrip,
//                     pickup_date_time: e.target.value,
//                   })
//                 }
//               />
//             </div>
//             <button
//               type="submit"
//               className="flex items-center justify-center w-28 bg-[#0bbfe0] hover:bg-[#0999b3] text-white px-4 py-2 rounded-md"
//             >
//               Next <ArrowRight className="ml-2 h-4 w-4" />
//             </button>
//           </motion.form>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import axiosInstance from "../../API/axiosInstance";
import secureLocalStorage from "react-secure-storage";
import toast from "react-hot-toast";

export default function PassengerOneWayTripContent() {
  const navigate = useNavigate();
  const uid = localStorage.getItem("@secure.n.uid");
  const decryptedUID = secureLocalStorage.getItem("uid");
  const [fourSeater, setFourSeater] = useState(0);
  const [sixSeater, setSixSeater] = useState(0);
  const [pid, setPid] = useState(0);
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [dropSuggestions, setDropSuggestions] = useState([]);
  const [pickupCoords, setPickupCoords] = useState(null);
  const [dropCoords, setDropCoords] = useState(null);
  const mapRef = useRef(null);

  const [oneWayTrip, setOneWayTrip] = useState({
    uid: decryptedUID,
    pid: "",
    pickup_location: "",
    drop_location: "",
    pickup_date_time: "",
  });

  // Fetch Passenger ID (PID)
  useEffect(() => {
    const fetchPID = async () => {
      try {
        const res = await axiosInstance.post(
          `${process.env.REACT_APP_BASE_URL}/passengers/fetchPID`,
          { decryptedUID }
        );
        setPid(res.data);
      } catch (error) {
        console.error("Fetch PID Error: ", error.message);
      }
    };
    fetchPID();
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
          .map((coord) => parseFloat(coord.trim()));
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
      let smallestDistance = Infinity;

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
          .map((coord) => parseFloat(coord.trim()));
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
          .map((coord) => parseFloat(coord.trim()));
        pickupCoords = { lat: pickupLat, lng: pickupLng };
        console.log("Using provided pickup coordinates:", pickupCoords);
      } else {
        pickupCoords = await geocodeAddress(pickupLocation);
      }

      if (isDropLatLng) {
        const [dropLat, dropLng] = dropLocation
          .split(",")
          .map((coord) => parseFloat(coord.trim()));
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

  const handlePhaseOne = async (e) => {
    e.preventDefault();

    const now = new Date();
    const pickupDateTime = new Date(oneWayTrip.pickup_date_time);

    if (pickupDateTime <= now) {
      toast.error("Pickup date and time must be in the future.");
      return;
    }

    const { fourSeater, sixSeater, distance } = await calculatingPrice();

    if (distance === 0) return;

    setOneWayTrip((prevState) => ({ ...prevState, pid }));
    navigate(`/car-type-selection?uid=${uid}`, {
      state: {
        fourSeater,
        sixSeater,
        distance,
        oneWayTrip: { ...oneWayTrip, pid },
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
    <div className="min-h-screen bg-gradient-to-br from-[#e6f7fb] to-[#e0f2f7] flex items-center justify-center p-4">
      <div className="flex w-full max-w-6xl overflow-hidden bg-white shadow-lg rounded-lg">
        <div className="w-1/2 p-6">
          <div className="bg-gradient-to-r from-[#0bbfe0] to-[#077286] p-6 text-white">
            <h1 className="text-3xl font-bold">Book Your One Way Trip</h1>
            <p className="text-[#e0f2f7]">Enter your trip details</p>
          </div>

          <div className="p-6">
            <motion.form onSubmit={handlePhaseOne} className="space-y-6">
              <div className="space-y-2">
                <input type="hidden" name="pid" value={pid} />
                <label className="text-lg font-semibold">Pickup Location</label>
                <input
                  type="text"
                  placeholder="Enter pickup location"
                  className="border rounded-md p-2 w-full"
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
                <ul
                  className="border rounded-md bg-white max-h-40 overflow-y-auto"
                  style={{ scrollbarWidth: "thin" }}
                >
                  {pickupSuggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      className="p-2 cursor-pointer hover:bg-gray-200"
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
              </div>

              <div className="space-y-2">
                <label className="text-lg font-semibold">Drop Location</label>
                <input
                  type="text"
                  placeholder="Enter drop location"
                  className="border rounded-md p-2 w-full"
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
                <ul
                  className="border rounded-md bg-white max-h-40 overflow-y-auto"
                  style={{ scrollbarWidth: "thin" }}
                >
                  {dropSuggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      className="p-2 cursor-pointer hover:bg-gray-200"
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
              </div>

              <div className="space-y-2">
                <label className="text-lg font-semibold">
                  Pickup Date and Time
                </label>
                <input
                  type="datetime-local"
                  className="border rounded-md p-2 w-full"
                  value={oneWayTrip.pickup_date_time}
                  onChange={(e) =>
                    setOneWayTrip({
                      ...oneWayTrip,
                      pickup_date_time: e.target.value,
                    })
                  }
                />
              </div>

              <button
                type="submit"
                className="flex items-center justify-center w-28 bg-[#0bbfe0] hover:bg-[#0999b3] text-white px-4 py-2 rounded-md"
              >
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </motion.form>
          </div>
        </div>

        <div className="w-1/2">
          <div
            id="map"
            ref={mapRef}
            style={{ height: "100%", width: "100%" }}
          ></div>
        </div>
      </div>
    </div>
  );
}

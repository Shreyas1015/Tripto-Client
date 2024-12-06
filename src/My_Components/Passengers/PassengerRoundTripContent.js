// import axiosInstance from "../../API/axiosInstance";
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import secureLocalStorage from "react-secure-storage";

// const PassengerRoundTripContent = () => {
//   const navigate = useNavigate();
//   const uid = localStorage.getItem("@secure.n.uid");
//   const decryptedUID = secureLocalStorage.getItem("uid");
//   const [fourSeater, setFourSeater] = useState(0);
//   const [sixSeater, setSixSeater] = useState(0);
//   // const [distance, setDistance] = useState(0);

//   const [pid, setPid] = useState(0);
//   const [roundTrip, setRoundTrip] = useState({
//     uid: decryptedUID,
//     pid: "",
//     pickup_location: "",
//     drop_location: "",
//     pickup_date_time: "",
//     return_date_time: "",
//     no_of_days: "",
//   });

//   const [selectedCar, setSelectedCar] = useState("");
//   const [showCarSelection, setShowCarSelection] = useState(false);

//   useEffect(() => {
//     const fetchPID = async () => {
//       try {
//         const res = await axiosInstance.post(
//           `${process.env.REACT_APP_BASE_URL}/passengers/fetchPID`,
//           { decryptedUID }
//         );

//         setPid(parseInt(res.data, 10));
//         console.log("PID : ", res.data);
//       } catch (error) {
//         console.error("Fetch PID Error: ", error.message);
//       }
//     };

//     fetchPID();
//   }, [decryptedUID]);

//   const handlePhaseOne = (e) => {
//     e.preventDefault();
//     const { pickup_date_time, return_date_time } = roundTrip;

//     // Convert pickup and return date strings to Date objects
//     const pickupDate = new Date(pickup_date_time);
//     const returnDate = new Date(return_date_time);

//     // Get the current date and time
//     const currentDate = new Date();

//     // Check if pickup date is from the present day
//     if (pickupDate < currentDate) {
//       alert("Pickup date and time must be from the present day or later.");
//       return;
//     }

//     // Check if return pickup date is before pickup date
//     if (returnDate < pickupDate) {
//       alert("Return date & time cannot be before the pickup date .");
//       return;
//     }

//     // Calculate the difference in milliseconds
//     const timeDifference = returnDate.getTime() - pickupDate.getTime();

//     // Convert milliseconds to days
//     const numberOfDays = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

//     // Update the state with the number of days
//     setRoundTrip({
//       ...roundTrip,
//       no_of_days: numberOfDays,
//     });

//     calculatingPrice();
//     setShowCarSelection(true);
//   };

//   const calculatingPrice = () => {
//     //kilometer per day 250+ validation
//     //night charges per day 700rs (no. days in a trip - 1 )
//     const distance = 600;
//     const inputKM = distance * 2;

//     const numberOfDays = roundTrip.no_of_days === 0 ? 1 : roundTrip.no_of_days;

//     const perDayCharges = roundTrip.no_of_days * 250;
//     if (inputKM > perDayCharges) {
//       const finalKM1_for_four_seater = inputKM * 12;
//       const finalKM1_for_six_seater = inputKM * 16;
//       const nights = numberOfDays - 1;
//       const nightCharges = nights * 500;
//       const finalRateForFourSeater = finalKM1_for_four_seater + nightCharges;
//       const finalRateForSixSeater = finalKM1_for_six_seater + nightCharges;
//       setFourSeater(finalRateForFourSeater);
//       setSixSeater(finalRateForSixSeater);
//     } else {
//       const finalKM2_for_four_seater = perDayCharges * 12;
//       const finalKM2_for_six_seater = perDayCharges * 16;
//       const nights = numberOfDays - 1;
//       const nightCharges = nights * 500;
//       const finalRateForFourSeater = finalKM2_for_four_seater + nightCharges;
//       const finalRateForSixSeater = finalKM2_for_six_seater + nightCharges;
//       setFourSeater(finalRateForFourSeater);
//       setSixSeater(finalRateForSixSeater);
//     }
//   };

//   const handlePhaseTwo = async (e) => {
//     e.preventDefault();

//     try {
//       const distance = 225;
//       const totalDistance = distance * 2;
//       let price = 0;

//       if (selectedCar === "4-seater") {
//         price = fourSeater;
//       } else if (selectedCar === "6-seater") {
//         price = sixSeater;
//       }
//       if (!selectedCar) {
//         alert("Please select a car type before booking the trip.");
//         return;
//       }
//       const numberOfDays =
//         roundTrip.no_of_days === 0 ? 1 : roundTrip.no_of_days;
//       const selectedCarValue = selectedCar === "4-seater" ? 1 : 2;

//       const formData = {
//         uid: decryptedUID,
//         pid: pid,
//         pickup_location: roundTrip.pickup_location,
//         drop_location: roundTrip.drop_location,
//         pickup_date_time: roundTrip.pickup_date_time,
//         return_date_time: roundTrip.return_date_time,
//         no_of_days: numberOfDays,
//         distance: totalDistance,
//         selected_car: selectedCarValue,
//         price: price,
//       };

//       // Send data to backend
//       const res = await axiosInstance.post(
//         `${process.env.REACT_APP_BASE_URL}/passengers/handleRoundTrip`,
//         { formData, decryptedUID }
//       );

//       if (res.status === 200) {
//         alert(
//           `Your booking has been confirmed. Please wait until the acknowledgement!`
//         );
//         setRoundTrip({
//           pickup_location: "",
//           drop_location: "",
//           pickup_date_time: "",
//           return_date_time: "",
//           no_of_days: "",
//         });
//         setSelectedCar("");
//         setShowCarSelection(false);
//       } else {
//         console.error("Error in Booking Trip!");
//         alert("Error in Booking Trip!");
//       }
//     } catch (error) {
//       console.error("Error in Booking Trip: ", error.message);
//       alert("Error in Booking Trip!");
//     }
//   };

//   const BackToLogin = () => {
//     navigate("/");
//   };

//   if (!uid) {
//     return (
//       <>
//         <div className="container text-center fw-bold">
//           <h2>INVALID URL. Please provide a valid UID.</h2>
//           <button onClick={BackToLogin} className="btn blue-buttons">
//             Back to Login
//           </button>
//         </div>
//       </>
//     );
//   }

//   return (
//     <>
//       <div className="container-fluid">
//         <h2>Round Trip</h2>
//         <hr />
//         <div className="row">
//           <div className="col-lg-6">
//             <div className="one-way-trip">
//               <div
//                 className="card mx-auto my-5"
//                 style={{ width: "25rem", height: "24rem" }}
//               >
//                 <div className="card-body">
//                   <h5 className="card-title">
//                     Select Pickup and Drop Location
//                   </h5>
//                   <hr />
//                   <form onSubmit={handlePhaseOne}>
//                     <div className="input-group mb-4">
//                       <span className="input-group-text">Pickup Location</span>
//                       <input
//                         name="pickup_location"
//                         type="url"
//                         className="form-control"
//                         required
//                         value={roundTrip.pickup_location}
//                         onChange={(e) =>
//                           setRoundTrip({
//                             ...roundTrip,
//                             pickup_location: e.target.value,
//                           })
//                         }
//                       />
//                     </div>
//                     <div className="input-group mb-4">
//                       <span className="input-group-text">Drop Location</span>
//                       <input
//                         name="drop_location"
//                         type="url"
//                         className="form-control"
//                         required
//                         value={roundTrip.drop_location}
//                         onChange={(e) =>
//                           setRoundTrip({
//                             ...roundTrip,
//                             drop_location: e.target.value,
//                           })
//                         }
//                       />
//                     </div>
//                     <div className="input-group mb-4">
//                       <span className="input-group-text">
//                         PickUp Date & Time
//                       </span>
//                       <input
//                         type="datetime-local"
//                         className="form-control"
//                         required
//                         value={roundTrip.pickup_date_time}
//                         onChange={(e) =>
//                           setRoundTrip({
//                             ...roundTrip,
//                             pickup_date_time: e.target.value,
//                           })
//                         }
//                       />
//                     </div>
//                     <div className="input-group mb-4">
//                       <span className="input-group-text">
//                         Return Date & Time
//                       </span>
//                       <input
//                         type="datetime-local"
//                         name="drop_date_time"
//                         required
//                         className="form-control"
//                         value={roundTrip.return_date_time}
//                         onChange={(e) =>
//                           setRoundTrip({
//                             ...roundTrip,
//                             return_date_time: e.target.value,
//                           })
//                         }
//                       />
//                     </div>
//                     <input
//                       type="submit"
//                       value="Phase 1: Submit Locations and Time"
//                       className="blue-buttons form-control"
//                     />
//                   </form>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="col-lg-6">
//             {showCarSelection && (
//               <div className="car-selection">
//                 <div className="card mx-auto my-5" style={{ width: "25rem" }}>
//                   <div className="card-body">
//                     <h5 className="card-title">Select Car Type</h5>
//                     <hr />
//                     <div className="mb-4">
//                       <label htmlFor="4-seater" className="form-label">
//                         4-seater
//                       </label>
//                       <input
//                         type="radio"
//                         id="4-seater"
//                         name="car-type"
//                         value="4-seater"
//                         onChange={(e) => setSelectedCar(e.target.value)}
//                         checked={selectedCar === "4-seater"}
//                       />

//                       <span>{fourSeater}</span>
//                     </div>

//                     <div className="mb-4">
//                       <label htmlFor="6-seater" className="form-label">
//                         6-seater
//                       </label>
//                       <input
//                         type="radio"
//                         id="6-seater"
//                         name="car-type"
//                         value="6-seater"
//                         onChange={(e) => setSelectedCar(e.target.value)}
//                         checked={selectedCar === "6-seater"}
//                       />
//                       <span>{sixSeater}</span>
//                     </div>
//                     <input
//                       type="submit"
//                       value="Phase 2: Book Trip"
//                       className="blue-buttons form-control"
//                       onClick={handlePhaseTwo}
//                     />
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default PassengerRoundTripContent;

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../API/axiosInstance";
import secureLocalStorage from "react-secure-storage";
import { ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

export default function PassengerRoundTripContent() {
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

  const [roundTrip, setRoundTrip] = useState({
    uid: decryptedUID,
    pid: "",
    pickup_location: "",
    drop_location: "",
    pickup_date_time: "",
    return_date_time: "",
    no_of_days: "",
  });

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

  // const calculatingPrice = async () => {
  //   const distance = await fetchDistance(
  //     roundTrip.pickup_location,
  //     roundTrip.drop_location
  //   );

  //   console.log("Distance: ", distance);
  //   if (distance === 0) {
  //     toast.error("Unable to calculate price due to missing distance.");
  //     return { fourSeater: 0, sixSeater: 0, distance: 0 };
  //   }

  //   // Ensure that price calculations are done correctly
  //   const inputKM = distance * 2;
  //   const numberOfDays = roundTrip.no_of_days === 0 ? 1 : roundTrip.no_of_days;
  //   const perDayCharges = roundTrip.no_of_days * 250;

  //   let priceForFourSeater = 0;
  //   let priceForSixSeater = 0;

  //   if (inputKM > perDayCharges) {
  //     priceForFourSeater = inputKM * 12 + (numberOfDays - 1) * 500;
  //     priceForSixSeater = inputKM * 16 + (numberOfDays - 1) * 500;
  //   } else {
  //     priceForFourSeater = perDayCharges * 12 + (numberOfDays - 1) * 500;
  //     priceForSixSeater = perDayCharges * 16 + (numberOfDays - 1) * 500;
  //   }

  //   setFourSeater(priceForFourSeater);
  //   setSixSeater(priceForSixSeater);

  //   console.log("Returning from price calc func : ", {
  //     fourSeater: priceForFourSeater,
  //     sixSeater: priceForSixSeater,
  //     distance: distance,
  //   });

  //   return {
  //     fourSeater: priceForFourSeater,
  //     sixSeater: priceForSixSeater,
  //     distance,
  //   };
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

      // Calculate number of days here
      const pickupDate = new Date(roundTrip.pickup_date_time);
      const returnDate = new Date(roundTrip.return_date_time);
      const timeDifference = returnDate.getTime() - pickupDate.getTime();
      const numberOfDays = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
      console.log("Calculated Number of Days: ", numberOfDays);

      const inputKM = distance * 2; // Round trip distance
      console.log("Input Kilometers (Round Trip): ", inputKM);

      // Calculate per-day charges
      const perDayCharges = numberOfDays * 300;
      console.log("Per Day Charges: ", perDayCharges);

      let finalRateForFourSeater;
      let finalRateForSixSeater;

      // Apply original redundant logic
      if (inputKM > perDayCharges) {
        const finalKM1_for_four_seater = inputKM * 12;
        const finalKM1_for_six_seater = inputKM * 16;
        const nights = numberOfDays - 1;
        const nightCharges = nights * 500;
        console.log("Night Charges (inputKM > perDayCharges): ", nightCharges);

        finalRateForFourSeater = finalKM1_for_four_seater + nightCharges;
        finalRateForSixSeater = finalKM1_for_six_seater + nightCharges;
      } else {
        const finalKM2_for_four_seater = perDayCharges * 12;
        const finalKM2_for_six_seater = perDayCharges * 16;
        const nights = numberOfDays - 1;
        const nightCharges = nights * 500;
        console.log("Night Charges (perDayCharges >= inputKM): ", nightCharges);

        finalRateForFourSeater = finalKM2_for_four_seater + nightCharges;
        finalRateForSixSeater = finalKM2_for_six_seater + nightCharges;
      }

      console.log("Final Rate for Four Seater: ", finalRateForFourSeater);
      console.log("Final Rate for Six Seater: ", finalRateForSixSeater);

      // Update state
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
    const { pickup_date_time, return_date_time } = roundTrip;

    const pickupDate = new Date(pickup_date_time);
    const returnDate = new Date(return_date_time);
    const currentDate = new Date();

    if (pickupDate < currentDate) {
      toast.error(
        "Pickup date and time must be from the present day or later."
      );
      return;
    }

    if (returnDate < pickupDate) {
      toast.error("Return date & time cannot be before the pickup date.");
      return;
    }

    const timeDifference = returnDate.getTime() - pickupDate.getTime();
    const numberOfDays = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

    // Log numberOfDays to check its value
    console.log("Calculated Number of Days: ", numberOfDays);

    // Set the no_of_days in the roundTrip object
    const updatedRoundTrip = {
      ...roundTrip,
      no_of_days: numberOfDays,
      pid, // Include pid directly here
    };

    // Calculate prices
    const { fourSeater, sixSeater, distance } = await calculatingPrice();

    // Navigate with updatedRoundTrip
    navigate(`/car-type-selection?uid=${uid}`, {
      state: {
        fourSeater,
        sixSeater,
        distance,
        roundTrip: updatedRoundTrip,
      },
    });

    // Log the updated roundTrip
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
    <div className="min-h-screen bg-gradient-to-br from-[#e6f7fb] to-[#e0f2f7] flex items-center justify-center p-4">
      <div className="flex w-full max-w-6xl overflow-hidden bg-white shadow-lg rounded-lg">
        <div className="w-1/2 p-6">
          <div className="bg-gradient-to-r from-[#0bbfe0] to-[#077286] p-6 text-white">
            <h1 className="text-3xl font-bold">Book Your Round Trip</h1>
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
                  value={roundTrip.pickup_location}
                  onChange={(e) => {
                    setRoundTrip({
                      ...roundTrip,
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
              </div>
              <div className="space-y-2">
                <label className="text-lg font-semibold">Drop Location</label>
                <input
                  type="text"
                  placeholder="Enter drop location"
                  className="border rounded-md p-2 w-full"
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
                <ul
                  className="border rounded-md bg-white max-h-40 overflow-y-auto"
                  style={{ scrollbarWidth: "thin" }}
                >
                  {dropSuggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      className="p-2 cursor-pointer hover:bg-gray-200"
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
              </div>
              <div className="space-y-2">
                <label className="text-lg font-semibold">
                  Pickup Date & Time
                </label>
                <input
                  type="datetime-local"
                  className="border rounded-md p-2 w-full"
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
                <label className="text-lg font-semibold">
                  Return Date & Time
                </label>
                <input
                  type="datetime-local"
                  className="border rounded-md p-2 w-full"
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

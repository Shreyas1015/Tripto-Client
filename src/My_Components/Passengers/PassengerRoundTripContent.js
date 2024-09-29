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

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../API/axiosInstance";
import secureLocalStorage from "react-secure-storage";
import { ArrowRight } from "lucide-react";

export default function PassengerRoundTripContent() {
  const navigate = useNavigate();
  const uid = localStorage.getItem("@secure.n.uid");
  const decryptedUID = secureLocalStorage.getItem("uid");
  const [fourSeater, setFourSeater] = useState(0);
  const [sixSeater, setSixSeater] = useState(0);
  const [pid, setPid] = useState(0);

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

  const handlePhaseOne = (e) => {
    e.preventDefault();
    const { pickup_date_time, return_date_time } = roundTrip;

    const pickupDate = new Date(pickup_date_time);
    const returnDate = new Date(return_date_time);
    const currentDate = new Date();

    if (pickupDate < currentDate) {
      alert("Pickup date and time must be from the present day or later.");
      return;
    }

    if (returnDate < pickupDate) {
      alert("Return date & time cannot be before the pickup date.");
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
    const { fourSeater, sixSeater, distance } = calculatingPrice();

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

  const calculatingPrice = () => {
    const distance = 600; // Dummy distance in kilometers
    const inputKM = distance * 2;
    const numberOfDays = roundTrip.no_of_days === 0 ? 1 : roundTrip.no_of_days;
    const perDayCharges = roundTrip.no_of_days * 250;

    let priceForFourSeater;
    let priceForSixSeater;

    if (inputKM > perDayCharges) {
      const finalKM1_for_four_seater = inputKM * 12;
      const finalKM1_for_six_seater = inputKM * 16;
      const nights = numberOfDays - 1;
      const nightCharges = nights * 500;
      priceForFourSeater = finalKM1_for_four_seater + nightCharges;
      priceForSixSeater = finalKM1_for_six_seater + nightCharges;
    } else {
      const finalKM2_for_four_seater = perDayCharges * 12;
      const finalKM2_for_six_seater = perDayCharges * 16;
      const nights = numberOfDays - 1;
      const nightCharges = nights * 500;
      priceForFourSeater = finalKM2_for_four_seater + nightCharges;
      priceForSixSeater = finalKM2_for_six_seater + nightCharges;
    }

    setFourSeater(priceForFourSeater);
    setSixSeater(priceForSixSeater);

    return {
      fourSeater: priceForFourSeater,
      sixSeater: priceForSixSeater,
      distance,
    };
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
      <div className="w-full max-w-2xl overflow-hidden bg-white shadow-lg rounded-lg">
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
                onChange={(e) =>
                  setRoundTrip({
                    ...roundTrip,
                    pickup_location: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-lg font-semibold">Drop Location</label>
              <input
                type="text"
                placeholder="Enter drop location"
                className="border rounded-md p-2 w-full"
                required
                value={roundTrip.drop_location}
                onChange={(e) =>
                  setRoundTrip({
                    ...roundTrip,
                    drop_location: e.target.value,
                  })
                }
              />
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
    </div>
  );
}

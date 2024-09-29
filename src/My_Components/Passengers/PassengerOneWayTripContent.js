// import * as React from "react";
// import Button from "@mui/material/Button";
// import Dialog from "@mui/material/Dialog";
// import DialogActions from "@mui/material/DialogActions";
// import DialogContent from "@mui/material/DialogContent";
// import DialogContentText from "@mui/material/DialogContentText";
// import DialogTitle from "@mui/material/DialogTitle";
// import Slide from "@mui/material/Slide";
// // import { TransitionProps } from "@mui/material/transitions";
// import axiosInstance from "../../API/axiosInstance";
// import { useNavigate } from "react-router-dom";
// import secureLocalStorage from "react-secure-storage";
// import { useState, useEffect } from "react";
// import { RadioGroup, FormControlLabel, Radio } from "@mui/material";
// import toast from "react-hot-toast";

// const Transition = React.forwardRef(function Transition(props, ref) {
//   return <Slide direction="up" ref={ref} {...props} />;
// });

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

//   const [selectedCar, setSelectedCar] = useState("");
//   const [open, setOpen] = useState(false);

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

//     const now = new Date();
//     const pickupDateTime = new Date(oneWayTrip.pickup_date_time);

//     if (pickupDateTime <= now) {
//       toast.error("Pickup date and time must be in the future.");
//       return;
//     }

//     calculatingPrice();
//     setOpen(true); // Show dialog after phase one
//   };

//   const calculatingPrice = () => {
//     const distance = 50;
//     const priceForFourSeater = distance * 12;
//     const priceForSixSeater = distance * 16;
//     setFourSeater(priceForFourSeater);
//     setSixSeater(priceForSixSeater);
//   };

//   const handlePhaseTwo = async (e) => {
//     e.preventDefault();

//     if (!selectedCar) {
//       alert("Please select a car type.");
//       return;
//     }

//     try {
//       const distance = 50; // Dummy distance in kilometers
//       let price = 0;

//       // Calculate price based on selected car type
//       if (selectedCar === "4-seater") {
//         price = fourSeater;
//       } else if (selectedCar === "6-seater") {
//         price = sixSeater;
//       }

//       const selectedCarValue = selectedCar === "4-seater" ? 1 : 2;

//       const formData = {
//         uid: decryptedUID,
//         pid: pid,
//         pickup_location: oneWayTrip.pickup_location,
//         drop_location: oneWayTrip.drop_location,
//         pickup_date_time: oneWayTrip.pickup_date_time,
//         distance: distance,
//         selected_car: selectedCarValue,
//         price: price,
//       };

//       // Send data to backend
//       const res = await axiosInstance.post(
//         `${process.env.REACT_APP_BASE_URL}/passengers/handleOneWayTrip`,
//         { formData, decryptedUID }
//       );

//       if (res.status === 200) {
//         toast.success(
//           `Your booking has been confirmed. Our Driver Will Soon Connect With You!`
//         );
//         setOneWayTrip({
//           pickup_location: "",
//           drop_location: "",
//           pickup_date_time: "",
//         });
//         setSelectedCar("");
//         setOpen(false);
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
//       <div className="container text-center fw-bold">
//         <h2>INVALID URL. Please provide a valid UID.</h2>
//         <button onClick={BackToLogin} className="btn blue-buttons">
//           Back to Login
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="container-fluid">
//       <h2>One Way Trip</h2>
//       <hr />

//       <div className="one-way-trip">
//         <div
//           className="card mx-auto my-5"
//           style={{ width: "25rem", height: "21rem" }}
//         >
//           <div className="card-body">
//             <h5 className="card-title">Select Pickup and Drop Location</h5>
//             <hr />
//             <form onSubmit={handlePhaseOne}>
//               <div className="input-group mb-4">
//                 <span className="input-group-text">Pickup Location</span>
//                 <input
//                   name="pickup_location"
//                   type="url"
//                   className="form-control"
//                   required
//                   value={oneWayTrip.pickup_location}
//                   onChange={(e) =>
//                     setOneWayTrip({
//                       ...oneWayTrip,
//                       pickup_location: e.target.value,
//                     })
//                   }
//                 />
//               </div>
//               <div className="input-group mb-4">
//                 <span className="input-group-text">Drop Location</span>
//                 <input
//                   name="drop_location"
//                   type="url"
//                   className="form-control"
//                   required
//                   value={oneWayTrip.drop_location}
//                   onChange={(e) =>
//                     setOneWayTrip({
//                       ...oneWayTrip,
//                       drop_location: e.target.value,
//                     })
//                   }
//                 />
//               </div>
//               <div className="input-group mb-4">
//                 <span className="input-group-text">Date and Time</span>
//                 <input
//                   type="datetime-local"
//                   className="form-control"
//                   required
//                   value={oneWayTrip.pickup_date_time}
//                   onChange={(e) =>
//                     setOneWayTrip({
//                       ...oneWayTrip,
//                       pickup_date_time: e.target.value,
//                     })
//                   }
//                 />
//               </div>
//               <input
//                 type="submit"
//                 value="Phase 1: Submit Locations and Time"
//                 className="blue-buttons form-control"
//               />
//             </form>
//           </div>
//         </div>
//       </div>

//       <Dialog
//         open={open}
//         TransitionComponent={Transition}
//         keepMounted
//         onClose={() => setOpen(false)}
//         aria-describedby="alert-dialog-slide-description"
//       >
//         <DialogTitle>Select Car Type</DialogTitle>
//         <DialogContent>
//           <DialogContentText id="alert-dialog-slide-description">
//             <i>Select Car type according to seating capacity</i>
//           </DialogContentText>
//           <RadioGroup
//             value={selectedCar}
//             onChange={(e) => setSelectedCar(e.target.value)}
//           >
//             <FormControlLabel
//               value="4-seater"
//               control={<Radio />}
//               label={`4-seater - $${fourSeater}`}
//             />
//             <FormControlLabel
//               value="6-seater"
//               control={<Radio />}
//               label={`6-seater - $${sixSeater}`}
//             />
//           </RadioGroup>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpen(false)}>Cancel</Button>
//           <Button onClick={handlePhaseTwo} disabled={!selectedCar}>
//             Book Trip
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import axiosInstance from "../../API/axiosInstance";
import secureLocalStorage from "react-secure-storage";

export default function PassengerOneWayTripContent() {
  const navigate = useNavigate();
  const uid = localStorage.getItem("@secure.n.uid");
  const decryptedUID = secureLocalStorage.getItem("uid");
  const [fourSeater, setFourSeater] = useState(0);
  const [sixSeater, setSixSeater] = useState(0);
  const [pid, setPid] = useState(0);

  const [oneWayTrip, setOneWayTrip] = useState({
    uid: decryptedUID,
    pid: "",
    pickup_location: "",
    drop_location: "",
    pickup_date_time: "",
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
    const now = new Date();
    const pickupDateTime = new Date(oneWayTrip.pickup_date_time);

    if (pickupDateTime <= now) {
      alert("Pickup date and time must be in the future.");
      return;
    }

    // Calculate prices before navigating
    const { fourSeater, sixSeater, distance } = calculatingPrice();

    setOneWayTrip((prevState) => ({ ...prevState, pid }));
    navigate(`/car-type-selection?uid${uid}`, {
      state: {
        fourSeater,
        sixSeater,
        distance,
        oneWayTrip: { ...oneWayTrip, pid },
      },
    });
    console.log("One Way Trip Data: ", { ...oneWayTrip, pid }, distance);
  };

  const calculatingPrice = () => {
    const distance = 50; // Dummy distance in kilometers
    const priceForFourSeater = distance * 12;
    const priceForSixSeater = distance * 16;
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
                onChange={(e) =>
                  setOneWayTrip({
                    ...oneWayTrip,
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
                value={oneWayTrip.drop_location}
                onChange={(e) =>
                  setOneWayTrip({
                    ...oneWayTrip,
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
    </div>
  );
}

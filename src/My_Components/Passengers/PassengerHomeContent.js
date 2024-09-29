// import axiosInstance from "../../API/axiosInstance";
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import secureLocalStorage from "react-secure-storage";

// const PassengerHomeContent = () => {
//   const navigate = useNavigate();
//   const uid = localStorage.getItem("@secure.n.uid");
//   const decryptedUID = secureLocalStorage.getItem("uid");

//   const [pid, setPid] = useState(0);
//   const [oneWayTrip, setOneWayTrip] = useState({
//     uid: decryptedUID,
//     pid: "",
//     pickup_location: "",
//     drop_location: "",
//     pickup_date_time: "",
//   });
//   const [roundTrip, setRoundTrip] = useState({
//     uid: decryptedUID,
//     pid: "",
//     pickup_location: "",
//     drop_location: "",
//     pickup_date_time: "",
//     drop_date_time: "",
//   });

//   const BackToLogin = () => {
//     navigate("/");
//   };

//   const handleOneWayTrip = async (e) => {
//     e.preventDefault();

//     try {
//       const formData = {
//         uid: decryptedUID,
//         pid: pid,
//         pickup_location: oneWayTrip.pickup_location,
//         drop_location: oneWayTrip.drop_location,
//         pickup_date_time: oneWayTrip.pickup_date_time,
//       };
//       const res = await axiosInstance.post(
//         `${process.env.REACT_APP_BASE_URL}/passengers/handleOneWayTrip`,
//         formData
//       );
//       if (res.status === 200) {
//         alert(`Your trip has been booked successfully!`);
//         setOneWayTrip({
//           pickup_location: "",
//           drop_location: "",
//           pickup_date_time: "",
//         });
//       } else {
//         console.error("Error in Booking Trip!");
//         alert("Error in Booking Trip!");
//       }
//     } catch (error) {
//       console.error("Error in Booking Trip: ", error.message);
//       alert("Error in Booking Trip!");
//     }
//   };

//   const handleRoundTrip = async (e) => {
//     e.preventDefault();

//     try {
//       const formData = {
//         uid: decryptedUID,
//         pid: pid,
//         pickup_location: roundTrip.pickup_location,
//         drop_location: roundTrip.drop_location,
//         pickup_date_time: roundTrip.pickup_date_time,
//         drop_date_time: roundTrip.drop_date_time,
//       };
//       const res = await axiosInstance.post(
//         `${process.env.REACT_APP_BASE_URL}/passengers/handleRoundTrip`,
//         formData
//       );
//       if (res.status === 200) {
//         alert(`Your trip has been booked successfully!`);
//         setRoundTrip({
//           pickup_location: "",
//           drop_location: "",
//           pickup_date_time: "",
//           drop_date_time: "",
//         });
//       } else {
//         console.error("Error in Booking Trip!");
//         alert("Error in Booking Trip!");
//       }
//     } catch (error) {
//       console.error("Error in Booking Trip: ", error.message);
//       alert("Error in Booking Trip!");
//     }
//   };

// useEffect(() => {
//   const fetchPID = async () => {
//     try {
//       const res = await axiosInstance.post(
//         `${process.env.REACT_APP_BASE_URL}/passengers/fetchPID`,
//         { decryptedUID }
//       );

//       setPid(parseInt(res.data, 10));
//       console.log("PID : ", res.data);
//     } catch (error) {
//       console.error("Fetch PID Error: ", error.message);
//     }
//   };

//   fetchPID();
// }, [decryptedUID]);

//   const handleChange1 = (e) => {
//     const { name, value } = e.target;

//     setOneWayTrip((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handleChange2 = (e) => {
//     const { name, value } = e.target;

//     setRoundTrip((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

// if (!uid) {
//   return (
//     <>
//       <div className="container text-center fw-bold">
//         <h2>INVALID URL. Please provide a valid UID.</h2>
//         <button onClick={BackToLogin} className="btn blue-buttons">
//           Back to Login
//         </button>
//       </div>
//     </>
//   );
// }

//   return (
//     <>
//       <div className="container-fluid">
//         <h2>Passenger Home Page</h2>
//         <hr />
//         <div className="row">
//           <div className="col-lg-6">
//             <div className="one-way-trip">
//               <div
//                 className="card mx-auto my-5"
//                 style={{ width: "25rem", height: "21rem" }}
//               >
//                 <div className="card-body">
//                   <h5 className="card-title">One Way Trip</h5>
//                   <hr />
//                   <form onSubmit={handleOneWayTrip}>
//                     <input type="hidden" name="uid" value={decryptedUID} />
//                     <input type="hidden" name="pid" value={pid} />

//                     <div className="input-group mb-4">
//                       <span className="input-group-text">Pickup Location</span>
//                       <input
//                         name="pickup_location"
//                         type="url"
//                         className="form-control"
//                         required
//                         value={oneWayTrip.pickup_location}
//                         onChange={handleChange1}
//                       />
//                     </div>
//                     <div className="input-group mb-4">
//                       <span className="input-group-text">Drop Location</span>
//                       <input
//                         name="drop_location"
//                         type="url"
//                         className="form-control"
//                         required
//                         value={oneWayTrip.drop_location}
//                         onChange={handleChange1}
//                       />
//                     </div>
//                     <div className="input-group mb-4">
//                       <span className="input-group-text">Pick Up Time</span>
//                       <input
//                         type="datetime-local"
//                         name="pickup_date_time"
//                         required
//                         className="form-control"
//                         value={oneWayTrip.pickup_date_time}
//                         onChange={handleChange1}
//                       />
//                     </div>
//                     <input
//                       type="submit"
//                       value="Submit"
//                       className="blue-buttons form-control"
//                     />
//                   </form>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="col-lg-6">
//             <div className="round-trip">
//               <div className="card mx-auto my-5" style={{ width: "25rem" }}>
//                 <div className="card-body">
//                   <h5 className="card-title">Round Trip</h5>
//                   <hr />
//                   <form onSubmit={handleRoundTrip}>
//                     <input type="hidden" name="uid" value={decryptedUID} />
//                     <input type="hidden" name="pid" value={pid} />
//                     <div className="input-group mb-4">
//                       <span className="input-group-text">Pickup Location</span>
//                       <input
//                         name="pickup_location"
//                         type="url"
//                         className="form-control"
//                         required
//                         value={roundTrip.pickup_location}
//                         onChange={handleChange2}
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
//                         onChange={handleChange2}
//                       />
//                     </div>
//                     <div className="input-group mb-4">
//                       <span className="input-group-text">Pick Up Time</span>
//                       <input
//                         type="datetime-local"
//                         name="pickup_date_time"
//                         required
//                         className="form-control"
//                         value={roundTrip.pickup_date_time}
//                         onChange={handleChange2}
//                       />
//                     </div>
//                     <div className="input-group mb-4">
//                       <span className="input-group-text">Drop Time</span>
//                       <input
//                         type="datetime-local"
//                         name="drop_date_time"
//                         required
//                         className="form-control"
//                         value={roundTrip.drop_date_time}
//                         onChange={handleChange2}
//                       />
//                     </div>
//                     <input
//                       type="submit"
//                       value="Submit"
//                       className="blue-buttons form-control"
//                     />
//                   </form>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default PassengerHomeContent;

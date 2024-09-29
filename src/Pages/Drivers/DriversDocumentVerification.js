// import React, { useEffect, useState } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";

// import axiosInstance from "../../API/axiosInstance";

// const DriversDocumentVerification = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [validDriver, setValidDriver] = useState(0);
//   const uid = new URLSearchParams(location.search).get("uid");
//   const [isOpen, setIsOpen] = useState(true);

//   console.log("Passenger Id : ", uid);

//   useEffect(() => {
//     const fetchStatusIndicators = async () => {
//       try {
//         const response = await axiosInstance.post(
//           `${process.env.REACT_APP_BASE_URL}/drivers/fetchParticularDocStatus`,
//           { uid }
//         );

//         if (response.status === 200) {
//           setValidDriver(response.data.all_documents_status);
//         } else {
//           console.error("Failed to fetch status indicators");
//         }
//       } catch (error) {
//         console.error("Error fetching status indicators:", error.message);
//       }
//     };

//     fetchStatusIndicators();
//   }, [uid]);

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

//   const handleTrigger = () => setIsOpen(!isOpen);

//   const handleLogout = () => {
//     window.localStorage.removeItem("user_type");
//     navigate("/");
//     alert("Logged Out Successfully");
//   };

//   return (
//     <>
//       <div className="page ">
//         <div className="row container-fluid">
//           <div className={`col-lg-${isOpen ? "2" : "0"} transition-col`}></div>
//           <div className={`col-lg-${isOpen ? "10" : "12"} transition-col`}>
//             <div className="content">
//               <DriversVerificationContent />
//             </div>
//           </div>
//         </div>

//         <div className={`sidebar ${isOpen ? "sidebar--open" : ""}`}>
//           <div
//             style={{ color: "#0bbfe0" }}
//             className="trigger"
//             onClick={handleTrigger}
//           >
//             <i className={`fas ${isOpen ? "fa-times" : "fa-bars"}`}></i>
//           </div>

//           <Link
//             className="text-decoration-none"
//             to={`/driversdocumentverification?uid=${uid}`}
//           >
//             <div className="sidebar-position">
//               <i style={{ color: "#0bbfe0" }} className="fa-solid fa-user "></i>
//               <span> My Profile</span>
//             </div>
//           </Link>
//           {validDriver === 1 ? (
//             <>
//               <Link
//                 className="text-decoration-none"
//                 to={`/driversdashboard?uid=${uid}`}
//               >
//                 <div className="sidebar-position">
//                   <i
//                     style={{ color: "#0bbfe0" }}
//                     className="fa-brands fa-windows"
//                   ></i>
//                   <span> Dashboard</span>
//                 </div>
//               </Link>
//               <Link
//                 className="text-decoration-none"
//                 to={`/drivershomepage?uid=${uid}`}
//               >
//                 <div className="sidebar-position">
//                   <i
//                     style={{ color: "#0bbfe0" }}
//                     className="fa-brands fa-windows"
//                   ></i>
//                   <span> Home</span>
//                 </div>
//               </Link>
//             </>
//           ) : (
//             ""
//           )}

//           <div className="sidebar-position" onClick={handleLogout}>
//             <i
//               style={{ color: "#0bbfe0" }}
//               className="fa-solid fa-arrow-right-from-bracket"
//             />
//             <span> Logout</span>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default DriversDocumentVerification;
import React from "react";
import DriversSidebar from "../../My_Components/Drivers/DriversSidebar";
import DriversVerificationContent from "../../My_Components/Drivers/DriversVerificationContent";

const DriversDocumentVerification = () => {
  return (
    <>
      <DriversSidebar contentComponent={<DriversVerificationContent />} />
    </>
  );
};

export default DriversDocumentVerification;

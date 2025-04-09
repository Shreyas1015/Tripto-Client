import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../API/axiosInstance";
import secureLocalStorage from "react-secure-storage";
import toast from "react-hot-toast";
import {
  User,
  LayoutDashboard,
  Home,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const DriversSidebar = (props) => {
  const navigate = useNavigate();
  const uid = localStorage.getItem("@secure.n.uid");
  const decryptedUID = secureLocalStorage.getItem("uid");
  const [isOpen, setIsOpen] = useState(true);
  const [validDriver, setValidDriver] = useState(0);

  const BackToLogin = () => {
    navigate("/");
  };

  useEffect(() => {
    const fetchStatusIndicators = async () => {
      try {
        const response = await axiosInstance.post(
          `${process.env.REACT_APP_BASE_URL}/drivers/fetchParticularDocStatus`,
          { decryptedUID }
        );

        if (response.status === 200) {
          setValidDriver(response.data.all_documents_status);
        } else {
          console.error("Failed to fetch status indicators");
        }
      } catch (error) {
        console.error("Error fetching status indicators:", error.message);
      }
    };

    fetchStatusIndicators();
  }, [decryptedUID]);

  if (!decryptedUID) {
    return (
      <>
        <div className="container text-center fw-bold">
          <h2>INVALID URL. Please provide a valid UID.</h2>
          <button onClick={BackToLogin} className="btn blue-buttons">
            Back to Login
          </button>
        </div>
      </>
    );
  }

  const handleTrigger = () => setIsOpen(!isOpen);

  const handleLogout = async () => {
    try {
      const response = await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/auth/logout`
      );

      if (response.status === 200) {
        window.localStorage.removeItem("@secure.n.user_type");
        window.localStorage.removeItem("@secure.n.uid");
        navigate("/");
        toast.error("Logged Out Successfully");
      } else {
        console.error("Logout failed:", response.error);
      }
    } catch (error) {
      console.error("Error during logout:", error.message);
    }
  };

  return (
    <>
      <div className="page ">
        <div className="row container-fluid">
          <div className={`col-lg-${isOpen ? "2" : "0"} transition-col`}></div>
          <div className={`col-lg-${isOpen ? "10" : "12"} transition-col`}>
            <div className="content">{props.contentComponent}</div>
          </div>
        </div>

        <div
          className={`sidebar bg-gradient-to-b from-[#0bbfe0] to-[#077286] text-white transition-all duration-300 ease-in-out ${isOpen ? "sidebar--open" : ""
            }`}
        >
          <div className="flex items-center justify-between mb-8 hover:bg-white/20 p-2 rounded-md">
            {/* Avatar with initials */}
            {isOpen && (
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-white mr-3 flex items-center justify-center">
                  <span className="text-black text-lg font-bold">DP</span>{" "}
                  {/* Initials */}
                </div>

                {/* Sidebar Header */}
                <div className="sidebar-header cursor-pointer transition-opacity duration-300">
                  <h2 className="text-white text-xl transition-opacity duration-300">
                    DRIVER PANEL
                  </h2>
                  <p className="text-xs text-white opacity-70 transition-opacity duration-300">
                    Online
                  </p>
                </div>
              </div>
            )}

            {/* Sidebar Toggle Button */}
            <div className="text-white cursor-pointer" onClick={handleTrigger}>
              {isOpen ? (
                <ChevronLeft className="text-white" />
              ) : (
                <ChevronRight className="text-white" />
              )}
            </div>
          </div>

          <Link
            className="text-decoration-none"
            to={`/driversdocumentverification?uid=${uid}`}
          >
            <div className="sidebar-position">
              <User className="text-white" />
              <span> My Profile</span>
            </div>
          </Link>
          {validDriver === 1 ? (
            <>
              <Link
                className="text-decoration-none"
                to={`/driversdashboard?uid=${uid}`}
              >
                <div className="sidebar-position">
                  <LayoutDashboard className="text-white" />
                  <span> Dashboard</span>
                </div>
              </Link>
              <Link
                className="text-decoration-none"
                to={`/drivershomepage?uid=${uid}`}
              >
                <div className="sidebar-position">
                  <Home className="text-white" />
                  <span> Home</span>
                </div>
              </Link>
            </>
          ) : (
            ""
          )}
          <div className="sidebar-position" onClick={handleLogout}>
            <LogOut className="text-white" />
            <span> Logout</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default DriversSidebar;

// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import { User, LayoutDashboard, Home, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
// import axiosInstance from "../../API/axiosInstance";
// import secureLocalStorage from "react-secure-storage";
// import toast from "react-hot-toast";

// const DriversSidebar = ({ contentComponent }) => {
//   const navigate = useNavigate();
//   const uid = localStorage.getItem("@secure.n.uid");
//   const decryptedUID = secureLocalStorage.getItem("uid");
//   const [isOpen, setIsOpen] = useState(true); // Sidebar toggle state
//   const [validDriver, setValidDriver] = useState(0);

//   // Fetch driver status on mount
//   useEffect(() => {
//     const fetchStatusIndicators = async () => {
//       try {
//         const response = await axiosInstance.post(
//           `${process.env.REACT_APP_BASE_URL}/drivers/fetchParticularDocStatus`,
//           { decryptedUID }
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
//   }, [decryptedUID]);

//   if (!decryptedUID) {
//     return (
//       <div className="container text-center fw-bold">
//         <h2>INVALID URL. Please provide a valid UID.</h2>
//         <button onClick={() => navigate("/")} className="btn blue-buttons">
//           Back to Login
//         </button>
//       </div>
//     );
//   }

//   const handleToggle = () => setIsOpen(!isOpen);

//   const handleLogout = async () => {
//     try {
//       const response = await axiosInstance.post(
//         `${process.env.REACT_APP_BASE_URL}/auth/logout`
//       );
//       if (response.status === 200) {
//         window.localStorage.removeItem("@secure.n.user_type");
//         window.localStorage.removeItem("@secure.n.uid");
//         navigate("/");
//         toast.error("Logged Out Successfully");
//       } else {
//         console.error("Logout failed:", response.error);
//       }
//     } catch (error) {
//       console.error("Error during logout:", error.message);
//     }
//   };

//   return (
//     <div className="page flex">
//       {/* Sidebar */}
//       <motion.div
//         className={`bg-gradient-to-b from-[#0bbfe0] to-[#077286] text-white p-4 flex flex-col justify-between transition-all duration-300 ease-in-out ${
//           isOpen ? "w-64" : "w-20"
//         }`}
//         initial={false}
//         animate={{ width: isOpen ? 256 : 80 }}
//       >
//         <div>
//           <div className="flex items-center justify-between mb-8">
//             {isOpen && (
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 className="flex items-center"
//               >
//                 <span className="font-bold">Driver Panel</span>
//               </motion.div>
//             )}
//             <button onClick={handleToggle} className="text-white hover:bg-white/20">
//               {isOpen ? <ChevronLeft /> : <ChevronRight />}
//             </button>
//           </div>
//           <nav>
//             <ul className="space-y-2">
//               <li>
//                 <Link
//                   to={`/driversdocumentverification?uid=${uid}`}
//                   className={`w-full justify-start text-white hover:bg-white/20 ${
//                     isOpen ? "px-4" : "px-2"
//                   }`}
//                 >
//                   <User className={`h-5 w-5 ${isOpen ? "mr-4" : "mx-auto"}`} />
//                   {isOpen && <span>My Profile</span>}
//                 </Link>
//               </li>
//               {validDriver === 1 && (
//                 <>
//                   <li>
//                     <Link
//                       to={`/driversdashboard?uid=${uid}`}
//                       className={`w-full justify-start text-white hover:bg-white/20 ${
//                         isOpen ? "px-4" : "px-2"
//                       }`}
//                     >
//                       <LayoutDashboard className={`h-5 w-5 ${isOpen ? "mr-4" : "mx-auto"}`} />
//                       {isOpen && <span>Dashboard</span>}
//                     </Link>
//                   </li>
//                   <li>
//                     <Link
//                       to={`/drivershomepage?uid=${uid}`}
//                       className={`w-full justify-start text-white hover:bg-white/20 ${
//                         isOpen ? "px-4" : "px-2"
//                       }`}
//                     >
//                       <Home className={`h-5 w-5 ${isOpen ? "mr-4" : "mx-auto"}`} />
//                       {isOpen && <span>Home</span>}
//                     </Link>
//                   </li>
//                 </>
//               )}
//               <li onClick={handleLogout}>
//                 <button
//                   className={`w-full justify-start text-white hover:bg-white/20 ${
//                     isOpen ? "px-4" : "px-2"
//                   }`}
//                 >
//                   <LogOut className={`h-5 w-5 ${isOpen ? "mr-4" : "mx-auto"}`} />
//                   {isOpen && <span>Logout</span>}
//                 </button>
//               </li>
//             </ul>
//           </nav>
//         </div>
//       </motion.div>

//       {/* Content area */}
//       <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'ml-64' : 'ml-20'} w-full p-4`}>
//         {contentComponent}
//       </div>
//     </div>
//   );
// };

// export default DriversSidebar;

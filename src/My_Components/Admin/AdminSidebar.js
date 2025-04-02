// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import axiosInstance from "../../API/axiosInstance";
// import secureLocalStorage from "react-secure-storage";
// import toast from "react-hot-toast";
// import {
//   User,
//   LogOut,
//   ChevronLeft,
//   ChevronRight,
//   Car,
//   Briefcase,
//   BarChart2,
//   ChevronDown,
// } from "lucide-react";

// const uid = localStorage.getItem("@secure.n.uid");
// const menuItems = [
//   {
//     icon: User,
//     label: "Passenger Details",
//     href: "/admin-passenger-details",
//     subItems: [
//       { label: "Edit Passengers", href: "/admin-passenger-details" },
//       { label: "Trip History", href: "/admin-passenger-trip-history" },
//     ],
//   },
//   {
//     icon: Car,
//     label: "Driver Details",
//     href: "/admin-driver-details",
//     subItems: [
//       { label: "Edit Drivers", href: `/admin-edit-driver?uid=${uid}` },
//       {
//         label: "Driver Verification",
//         href: `/admin-driver-verification?uid=${uid}`,
//       },
//     ],
//   },
//   {
//     icon: Briefcase,
//     label: "Vendor Details",
//     href: "/admin-vendor-details",
//     subItems: [
//       { label: "Vendor Details", href: "/admin-vendor-details" },
//       { label: "Fleet Overview", href: "/admin-fleet-overview" },
//     ],
//   },
//   {
//     icon: BarChart2,
//     label: "Business Stats",
//     href: "/admin-business-stats",
//     subItems: [
//       { label: "Overall Stats", href: "/admin-business-stats" },
//       { label: "Revenue Analytics", href: "/admin-revenue-analytics" },
//       { label: "Trip Statistics", href: "/admin-trip-statistics" },
//     ],
//   },
// ];

// const AdminSidebar = (props) => {
//   const navigate = useNavigate();
//   const decryptedUID = secureLocalStorage.getItem("uid");

//   const [isOpen, setIsOpen] = useState(false);
//   const [expandedItem, setExpandedItem] = useState(null);

//   const BackToLogin = () => {
//     navigate("/");
//   };

//   if (!decryptedUID) {
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
//     <>
//       <div className="page">
//         <div className="row container-fluid">
//           <div className={`col-lg-${isOpen ? "2" : "0"} transition-col`}></div>
//           <div className={`col-lg-${isOpen ? "10" : "12"} transition-col`}>
//             <div className="content">{props.contentComponent}</div>
//           </div>
//         </div>

//         <div
//           className={`sidebar h-full bg-white shadow-lg transition-all text-[#0bbfe0] duration-300 ease-in-out ${
//             isOpen ? "sidebar--open" : ""
//           }`}
//         >
//           <div className="flex items-center justify-between mb-8 hover:bg-white/20 p-2 rounded-md">
//             {/* Avatar with initials */}
//             {isOpen && (
//               <div className="flex items-center">
//                 <div className="h-10 w-10 rounded-full bg-white mr-3 flex items-center justify-center border-2 border-[#0bbfe0]">
//                   <span className="text-black text-lg font-bold">DP</span>{" "}
//                   {/* Initials */}
//                 </div>

//                 {/* Sidebar Header */}
//                 <div className="sidebar-header cursor-pointer transition-opacity duration-300">
//                   <h2 className="text-[#077286] text-xl transition-opacity duration-300">
//                     ADMIN PANEL
//                   </h2>
//                   <p className="text-xs text-[#0bbfe0] opacity-70 transition-opacity duration-300">
//                     Online
//                   </p>
//                 </div>
//               </div>
//             )}

//             {/* Sidebar Toggle Button */}
//             <div
//               className="text-[#0bbfe0] cursor-pointer"
//               onClick={handleTrigger}
//             >
//               {isOpen ? (
//                 <ChevronLeft className="text-[#0bbfe0]" />
//               ) : (
//                 <ChevronRight className="text-[#0bbfe0]" />
//               )}
//             </div>
//           </div>

//           <nav className="mt-4">
//             <ul>
//               {menuItems.map((item, index) => (
//                 <li key={index} className="mb-2">
//                   <div
//                     onClick={() =>
//                       setExpandedItem(
//                         expandedItem === item.label ? null : item.label
//                       )
//                     }
//                   >
//                     <button className="flex items-center justify-between w-full text-[#077286] hover:bg-[#0bbfe0]/10 p-2 rounded">
//                       <div className="flex items-center">
//                         <item.icon className="text-[#0bbfe0] mr-4" />
//                         {isOpen && (
//                           <p className="text-[#077286] ">{item.label}</p>
//                         )}
//                       </div>
//                       {isOpen && item.subItems && (
//                         <ChevronDown
//                           className={`ml-4 transition-transform ${
//                             expandedItem === item.label ? "rotate-180" : ""
//                           }`}
//                         />
//                       )}
//                     </button>
//                     {isOpen && expandedItem === item.label && item.subItems && (
//                       <ul className="ml-6 mt-2">
//                         {item.subItems.map((subItem, subIndex) => (
//                           <li key={subIndex}>
//                             <Link to={subItem.href}>
//                               <button className="flex items-center justify-start w-full text-[#077286] hover:bg-[#0bbfe0]/10 p-2 rounded">
//                                 <ChevronRight className="text-[#0bbfe0]" />
//                                 {subItem.label}
//                               </button>
//                             </Link>
//                           </li>
//                         ))}
//                       </ul>
//                     )}
//                   </div>
//                 </li>
//               ))}
//             </ul>
//             <div
//               className="mt-auto flex items-center p-2 hover:bg-[#0bbfe0]/10 rounded cursor-pointer"
//               onClick={handleLogout}
//             >
//               <LogOut className="text-[#0bbfe0] mr-4" />
//               {isOpen && <p className="text-[#077286]">Logout</p>}
//             </div>
//           </nav>
//         </div>
//       </div>
//     </>
//   );
// };

// export default AdminSidebar;
"use client";

import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Car,
  Briefcase,
  BarChart2,
  ChevronDown,
} from "lucide-react";
import axiosInstance from "../../API/axiosInstance";
import secureLocalStorage from "react-secure-storage";
import toast from "react-hot-toast";

const uid = localStorage.getItem("@secure.n.uid");
const menuItems = [
  {
    icon: User,
    label: "Passenger Details",
    href: "/admin-passenger-details",
    subItems: [
      { label: "Edit Passengers", href: "/admin-passenger-details" },
      { label: "Trip History", href: "/admin-passenger-trip-history" },
    ],
  },
  {
    icon: Car,
    label: "Driver Details",
    href: "/admin-driver-details",
    subItems: [
      { label: "Edit Drivers", href: `/admin-edit-driver?uid=${uid}` },
      {
        label: "Driver Verification",
        href: `/admin-driver-verification?uid=${uid}`,
      },
    ],
  },
  {
    icon: Briefcase,
    label: "Vendor Details",
    href: "/admin-vendor-details",
    subItems: [
      { label: "Vendor Details", href: "/admin-vendor-details" },
      { label: "Vendor Verification", href: "/admin-vendor-verification" },
      { label: "Fleet Overview", href: "/admin-fleet-overview" },
    ],
  },
  {
    icon: BarChart2,
    label: "Business Stats",
    href: "/admin-business-stats",
    subItems: [
      { label: "Overall Stats", href: "/admin-business-stats" },
      { label: "Revenue Analytics", href: "/admin-revenue-analytics" },
      { label: "Trip Statistics", href: "/admin-trip-statistics" },
    ],
  },
];

const AdminSidebar = ({ contentComponent }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const decryptedUID = secureLocalStorage.getItem("uid");

  const [isOpen, setIsOpen] = useState(true);
  const [expandedItem, setExpandedItem] = useState(null);
  const [activeRoute, setActiveRoute] = useState("");

  useEffect(() => {
    // Set active route based on current location
    setActiveRoute(location.pathname);

    // Check if any menu item matches the current path and expand it
    const currentMenu = menuItems.find((item) =>
      item.subItems?.some((subItem) => subItem.href === location.pathname)
    );
    if (currentMenu) {
      setExpandedItem(currentMenu.label);
    }

    // Handle responsive behavior
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [location.pathname]);

  const BackToLogin = () => {
    navigate("/");
  };

  if (!decryptedUID) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="p-8 bg-white rounded-lg shadow-lg text-center max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">INVALID URL</h2>
          <p className="text-gray-600 mb-6">
            Please provide a valid UID to access this page.
          </p>
          <button
            onClick={BackToLogin}
            className="px-6 py-2 bg-gradient-to-r from-[#0bbfe0] to-[#077286] text-white rounded-md hover:shadow-lg transition-all duration-300"
          >
            Back to Login
          </button>
        </div>
      </div>
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

  // Animation variants
  const sidebarVariants = {
    open: { width: "280px", transition: { duration: 0.3, ease: "easeInOut" } },
    closed: { width: "70px", transition: { duration: 0.3, ease: "easeInOut" } },
  };

  const textVariants = {
    open: {
      opacity: 1,
      x: 0,
      display: "block",
      transition: { delay: 0.1, duration: 0.2 },
    },
    closed: {
      opacity: 0,
      x: -10,
      transitionEnd: { display: "none" },
      transition: { duration: 0.2 },
    },
  };

  const submenuVariants = {
    open: {
      height: "auto",
      opacity: 1,
      transition: {
        height: { duration: 0.3 },
        opacity: { duration: 0.3 },
      },
    },
    closed: {
      height: 0,
      opacity: 0,
      transition: {
        height: { duration: 0.3 },
        opacity: { duration: 0.2 },
      },
    },
  };

  const isActive = (path) => {
    return activeRoute === path;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <motion.div
        className="fixed h-full bg-white shadow-lg z-20 overflow-hidden"
        variants={sidebarVariants}
        initial={isOpen ? "open" : "closed"}
        animate={isOpen ? "open" : "closed"}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div
            className={`flex items-center justify-between p-4 ${
              !isOpen ? "px-2" : ""
            }`}
          >
            <div className="flex items-center">
              <div
                className={`h-10 w-10 rounded-full bg-gradient-to-r from-[#0bbfe0] to-[#077286] flex items-center justify-center text-white font-bold flex-shrink-0`}
              >
                DP
              </div>
              <motion.div
                className="ml-3"
                variants={textVariants}
                initial={isOpen ? "open" : "closed"}
                animate={isOpen ? "open" : "closed"}
              >
                <h2 className="text-[#077286] text-xl font-bold">
                  ADMIN PANEL
                </h2>
                <div className="flex items-center text-xs text-[#0bbfe0]">
                  <span className="h-2 w-2 rounded-full bg-green-500 mr-1"></span>
                  Online
                </div>
              </motion.div>
            </div>

            {/* Toggle Button */}
            <motion.button
              className={`p-1 rounded-full hover:bg-gray-100 text-[#0bbfe0] focus:outline-none ${
                !isOpen ? "mr-1" : ""
              }`}
              onClick={handleTrigger}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
            </motion.button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4">
            <ul className="space-y-1 px-2">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <div>
                    <button
                      className={`flex items-center justify-between w-full rounded-lg transition-colors duration-200 ${
                        !isOpen ? "p-2 justify-center" : "p-3"
                      } ${
                        expandedItem === item.label || isActive(item.href)
                          ? "bg-[#0bbfe0]/10 text-[#077286]"
                          : "hover:bg-gray-100 text-gray-700"
                      }`}
                      onClick={() =>
                        setExpandedItem(
                          expandedItem === item.label ? null : item.label
                        )
                      }
                    >
                      <div
                        className={`flex items-center ${
                          !isOpen ? "justify-center" : ""
                        }`}
                      >
                        <item.icon
                          className={`${
                            expandedItem === item.label || isActive(item.href)
                              ? "text-[#0bbfe0]"
                              : "text-gray-500"
                          }`}
                          size={20}
                        />
                        <motion.span
                          className="ml-4 font-medium"
                          variants={textVariants}
                          initial={isOpen ? "open" : "closed"}
                          animate={isOpen ? "open" : "closed"}
                        >
                          {item.label}
                        </motion.span>
                      </div>
                      {item.subItems && isOpen && (
                        <motion.div
                          animate={{
                            rotate: expandedItem === item.label ? 180 : 0,
                          }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown size={16} />
                        </motion.div>
                      )}
                    </button>

                    {/* Submenu */}
                    <AnimatePresence>
                      {isOpen && expandedItem === item.label && (
                        <motion.ul
                          className="ml-9 mt-1 overflow-hidden"
                          variants={submenuVariants}
                          initial="closed"
                          animate="open"
                          exit="closed"
                        >
                          {item.subItems.map((subItem, subIndex) => (
                            <motion.li
                              key={subIndex}
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: subIndex * 0.05 }}
                            >
                              <Link to={subItem.href}>
                                <div
                                  className={`flex items-center py-2 px-3 rounded-md my-1 text-sm ${
                                    isActive(subItem.href)
                                      ? "bg-[#0bbfe0]/10 text-[#077286] font-medium"
                                      : "text-gray-600 hover:bg-gray-100"
                                  }`}
                                >
                                  <div
                                    className={`w-1 h-1 rounded-full mr-2 ${
                                      isActive(subItem.href)
                                        ? "bg-[#0bbfe0]"
                                        : "bg-gray-400"
                                    }`}
                                  ></div>
                                  {subItem.label}
                                </div>
                              </Link>
                            </motion.li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </div>
                </li>
              ))}
            </ul>
          </nav>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className={`flex items-center ${
              !isOpen ? "justify-center p-2 mx-2" : "p-3 mx-2"
            } mt-4 mb-4 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200`}
          >
            <LogOut size={20} className="text-gray-500" />
            <motion.span
              className="ml-4 font-medium"
              variants={textVariants}
              initial={isOpen ? "open" : "closed"}
              animate={isOpen ? "open" : "closed"}
            >
              Logout
            </motion.span>
          </button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 ${
          isOpen ? "ml-[280px]" : "ml-[70px]"
        }`}
      >
        <div className="p-6">{contentComponent}</div>
      </div>
    </div>
  );
};

export default AdminSidebar;

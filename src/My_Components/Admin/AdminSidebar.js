import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../API/axiosInstance";
import secureLocalStorage from "react-secure-storage";
import toast from "react-hot-toast";
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

const AdminSidebar = (props) => {
  const navigate = useNavigate();
  const decryptedUID = secureLocalStorage.getItem("uid");

  const [isOpen, setIsOpen] = useState(false);
  const [expandedItem, setExpandedItem] = useState(null);

  const BackToLogin = () => {
    navigate("/");
  };

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
      <div className="page">
        <div className="row container-fluid">
          <div className={`col-lg-${isOpen ? "2" : "0"} transition-col`}></div>
          <div className={`col-lg-${isOpen ? "10" : "12"} transition-col`}>
            <div className="content">{props.contentComponent}</div>
          </div>
        </div>

        <div
          className={`sidebar h-full bg-white shadow-lg transition-all text-[#0bbfe0] duration-300 ease-in-out ${
            isOpen ? "sidebar--open" : ""
          }`}
        >
          <div className="flex items-center justify-between mb-8 hover:bg-white/20 p-2 rounded-md">
            {/* Avatar with initials */}
            {isOpen && (
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-white mr-3 flex items-center justify-center border-2 border-[#0bbfe0]">
                  <span className="text-black text-lg font-bold">DP</span>{" "}
                  {/* Initials */}
                </div>

                {/* Sidebar Header */}
                <div className="sidebar-header cursor-pointer transition-opacity duration-300">
                  <h2 className="text-[#077286] text-xl transition-opacity duration-300">
                    ADMIN PANEL
                  </h2>
                  <p className="text-xs text-[#0bbfe0] opacity-70 transition-opacity duration-300">
                    Online
                  </p>
                </div>
              </div>
            )}

            {/* Sidebar Toggle Button */}
            <div
              className="text-[#0bbfe0] cursor-pointer"
              onClick={handleTrigger}
            >
              {isOpen ? (
                <ChevronLeft className="text-[#0bbfe0]" />
              ) : (
                <ChevronRight className="text-[#0bbfe0]" />
              )}
            </div>
          </div>

          <nav className="mt-4">
            <ul>
              {menuItems.map((item, index) => (
                <li key={index} className="mb-2">
                  <div
                    onClick={() =>
                      setExpandedItem(
                        expandedItem === item.label ? null : item.label
                      )
                    }
                  >
                    <button className="flex items-center justify-between w-full text-[#077286] hover:bg-[#0bbfe0]/10 p-2 rounded">
                      <div className="flex items-center">
                        <item.icon className="text-[#0bbfe0] mr-4" />
                        {isOpen && (
                          <p className="text-[#077286] ">{item.label}</p>
                        )}
                      </div>
                      {isOpen && item.subItems && (
                        <ChevronDown
                          className={`ml-4 transition-transform ${
                            expandedItem === item.label ? "rotate-180" : ""
                          }`}
                        />
                      )}
                    </button>
                    {isOpen && expandedItem === item.label && item.subItems && (
                      <ul className="ml-6 mt-2">
                        {item.subItems.map((subItem, subIndex) => (
                          <li key={subIndex}>
                            <Link to={subItem.href}>
                              <button className="flex items-center justify-start w-full text-[#077286] hover:bg-[#0bbfe0]/10 p-2 rounded">
                                <ChevronRight className="text-[#0bbfe0]" />
                                {subItem.label}
                              </button>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </li>
              ))}
            </ul>
            <div
              className="mt-auto flex items-center p-2 hover:bg-[#0bbfe0]/10 rounded cursor-pointer"
              onClick={handleLogout}
            >
              <LogOut className="text-[#0bbfe0] mr-4" />
              {isOpen && <p className="text-[#077286]">Logout</p>}
            </div>
          </nav>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;

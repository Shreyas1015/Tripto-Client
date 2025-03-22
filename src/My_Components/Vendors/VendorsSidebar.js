import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "../../API/axiosInstance";
import secureLocalStorage from "react-secure-storage";
import { toast } from "react-hot-toast";
import {
  User,
  Plane,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  Search,
  Bell,
  ChevronDown,
} from "lucide-react";

const Navbar = ({ handleTrigger }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const uid = localStorage.getItem("@secure.n.uid");
  const decryptedUID = secureLocalStorage.getItem("uid");
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [updatedProfileData, setUpdatedProfileData] = useState({});
  const [updatedProfileIMG, setUpdatedProfileIMG] = useState("");

  const navItems = [
    { to: `/vendorprofile?uid=${uid}`, icon: User, label: "My Profile" },
    { to: `/vendortrip?uid=${uid}`, icon: Plane, label: "Book Your Trip" },
    {
      to: `/vendordashboard?uid=${uid}`,
      icon: LayoutDashboard,
      label: "Dashboard",
    },
  ];

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axiosInstance.post(
          `${process.env.REACT_APP_BASE_URL}/vendor/fetchProfileData`,
          {
            decryptedUID,
          }
        );

        if (response.status === 200) {
          setUpdatedProfileData(response.data);
        }
      } catch (error) {
        console.error("Error fetching Profile Data:", error.message);
      }
    };

    const fetchProfileIMG = async () => {
      try {
        const response = await axiosInstance.post(
          `${process.env.REACT_APP_BASE_URL}/vendor/fetchProfileIMG`,
          {
            decryptedUID,
          }
        );

        setUpdatedProfileIMG(response.data.link.profilePhoto);
      } catch (error) {
        console.error("Error fetching profile image:", error.message);
      }
    };

    fetchProfileData();
    fetchProfileIMG();
  }, [decryptedUID]);

  const handleLogout = async () => {
    try {
      const response = await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/auth/logout`
      );

      if (response.status === 200) {
        window.localStorage.removeItem("user_type");
        navigate("/");
        toast.success("Logged out successfully");
      } else {
        toast.error("Logout failed");
      }
    } catch (error) {
      toast.error("Error during logout");
    }
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleTrigger}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 md:hidden"
            >
              <Menu className="h-6 w-6" />
            </motion.button>
            <div className="hidden md:flex ml-10 space-x-4">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.to}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname.includes(item.to)
                      ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center">
            <div className="relative mr-4">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-2 pl-10 pr-4 text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                <Bell className="h-6 w-6" />
              </motion.button>
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50">
                  {notifications.length > 0 ? (
                    notifications.map((notification, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        {notification}
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-gray-500 dark:text-gray-400">
                      No new notifications
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="relative ml-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <img
                  className="h-8 w-8 rounded-full object-cover"
                  src={updatedProfileIMG}
                  alt="Profile"
                />
                <span className="hidden md:inline-block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {updatedProfileData.name}
                </span>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </motion.button>
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50">
                  <Link
                    to={`/vendorprofile?uid=${uid}`}
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Your Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

const Sidebar = ({ isOpen, handleTrigger, handleLogout }) => {
  const uid = localStorage.getItem("@secure.n.uid");
  const navItems = [
    { to: `/vendorprofile?uid=${uid}`, icon: User, label: "My Profile" },
    { to: `/vendortrip?uid=${uid}`, icon: Plane, label: "Book Your Trip" },
    {
      to: `/vendordashboard?uid=${uid}`,
      icon: LayoutDashboard,
      label: "Dashboard",
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-lg z-30"
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <Link to="/" className="flex items-center space-x-3">
                <img
                  src="/path-to-your-logo.png"
                  alt="Tripto"
                  className="h-8 w-auto"
                />
                <span className="text-xl font-bold text-gray-800 dark:text-white">
                  Tripto
                </span>
              </Link>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleTrigger}
                className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>
            <nav className="flex-1 overflow-y-auto p-4">
              <ul className="space-y-2">
                {navItems.map((item, index) => (
                  <motion.li
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to={item.to}
                      className="flex items-center p-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <item.icon className="w-5 h-5 mr-3" />
                      <span>{item.label}</span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="flex items-center w-full p-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
              >
                <LogOut className="w-5 h-5 mr-3" />
                <span>Logout</span>
              </motion.button>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

const VendorLayout = ({ children }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const uid = localStorage.getItem("@secure.n.uid");

  useEffect(() => {
    if (!uid) {
      navigate("/");
    }
  }, [uid, navigate]);

  const handleTrigger = () => setIsOpen(!isOpen);

  const handleLogout = async () => {
    try {
      const response = await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/auth/logout`
      );

      if (response.status === 200) {
        window.localStorage.removeItem("user_type");
        navigate("/");
        toast.success("Logged out successfully");
      } else {
        toast.error("Logout failed");
      }
    } catch (error) {
      toast.error("Error during logout");
    }
  };

  const BackToLogin = () => {
    navigate("/");
  };

  if (!uid) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-900 to-indigo-900">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-2xl max-w-md w-full">
          <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-6">
            Invalid URL
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-center mb-8">
            Please provide a valid UID to access your account.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={BackToLogin}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all text-lg"
          >
            Return to Login
          </motion.button>
        </div>
      </div>
    );
  }
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar
        isOpen={isOpen}
        handleTrigger={handleTrigger}
        handleLogout={handleLogout}
      />
      <div className="flex-1 flex flex-col">
        <Navbar handleTrigger={handleTrigger} />
        <main className="flex-1 overflow-y-auto bg-gray-100 dark:bg-gray-900 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default VendorLayout;

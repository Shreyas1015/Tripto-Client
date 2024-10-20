import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Car } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../API/axiosInstance";
import secureLocalStorage from "react-secure-storage";
import toast from "react-hot-toast";

export default function EnhancedLoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    emailOtp: "",
  });
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleEmailVerification = async () => {
    try {
      const res = await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/auth/sendLoginEmailVerification`,
        { email: formData.email }
      );

      if (res.data.success) {
        toast.success("Email verification code sent successfully");
      } else {
        toast.error("Failed to send email verification code");
      }
    } catch (error) {
      console.error(error);
      toast.error("User Not Registered");
    }
  };

  const confirmEmailVerification = async () => {
    try {
      const res = await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/auth/confirmEmail`,
        {
          email: formData.email,
          emailOtp: formData.emailOtp,
        }
      );

      if (res.data.success) {
        toast.success("Email verified successfully");
      }
    } catch (error) {
      console.error(error);
      toast.error("Invalid OTP");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.emailOtp) {
      toast.error("Please enter email OTP");
      return;
    }

    try {
      const verifyEmailRes = await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/auth/confirmEmail`,
        {
          email: formData.email,
          emailOtp: formData.emailOtp,
        }
      );

      if (!verifyEmailRes.data.success) {
        toast.error("Email OTP verification failed");
        return;
      }

      const loginRes = await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/auth/login`,
        {
          email: formData.email,
        }
      );

      const userId = loginRes.data.uid;
      const userType = loginRes.data.user_type;

      secureLocalStorage.setItem("uid", userId);
      secureLocalStorage.setItem("user_type", userType);

      const encryptedUID = localStorage.getItem("@secure.n.uid");

      switch (userType) {
        case 1:
          navigate(`/admin-business-stats?uid=${encryptedUID}`);
          break;
        case 2:
          navigate(`/passengertrip?uid=${encryptedUID}`);
          break;
        case 3:
          navigate(`/driversdocumentverification?uid=${encryptedUID}`);
          break;
        case 4:
          navigate(`/vendorsdashboard?uid=${encryptedUID}`);
          break;
        default:
          toast.error("Invalid user type");
      }

      toast.success("Logged In Successfully");
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("An error occurred during login.");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Panel - Decorative */}
      <div className="bg-gradient-to-br from-[#0bbfe0] via-[#0999b3] to-[#077286] md:w-1/2 p-8 flex flex-col justify-between">
        <div className="text-white">
          <motion.h1
            className="text-6xl font-bold mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            TRIPTO
          </motion.h1>
          <motion.p
            className="text-xl"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Your trusted Travel Partner
          </motion.p>
        </div>
        <motion.div
          className="mt-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <Car className="text-white h-80 w-80 mx-auto opacity-20" />
        </motion.div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="bg-gray-50 md:w-1/2 p-8 flex items-center justify-center">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Login</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10 pr-4 py-2 w-full rounded-md border-gray-300 focus:border-[#0bbfe0] focus:ring focus:ring-[#0bbfe0] focus:ring-opacity-50 transition duration-200"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label
                htmlFor="emailOtp"
                className="text-sm font-medium text-gray-700"
              >
                Email OTP
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="emailOtp"
                  name="emailOtp"
                  type="text"
                  placeholder="Enter your OTP"
                  value={formData.emailOtp}
                  onChange={handleChange}
                  className="pl-10 pr-4 py-2 w-full rounded-md border-gray-300 focus:border-[#0bbfe0] focus:ring focus:ring-[#0bbfe0] focus:ring-opacity-50 transition duration-200"
                  required
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="h-4 w-4 text-[#0bbfe0] border-gray-300 rounded focus:ring-[#0bbfe0]"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 text-sm text-gray-600"
                >
                  Remember me
                </label>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={handleEmailVerification}
                className="flex-1 bg-[#0bbfe0] hover:bg-[#0999b3] text-white py-2 rounded-md transition duration-300"
              >
                Send OTP
              </button>
              <button
                type="button"
                onClick={confirmEmailVerification}
                className="flex-1 bg-[#0bbfe0] hover:bg-[#0999b3] text-white py-2 rounded-md transition duration-300"
              >
                Verify OTP
              </button>
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#0bbfe0] to-[#0999b3] hover:from-[#0999b3] hover:to-[#077286] text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
            >
              Sign In
            </button>
          </form>
          <p className="mt-8 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <a
              href="/signup"
              className="font-medium text-[#0bbfe0] hover:text-[#0999b3]"
            >
              Sign up here
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

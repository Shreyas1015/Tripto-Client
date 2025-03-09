// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import {
//   User,
//   Mail,
//   Phone,
//   Lock,
//   Car,
//   ArrowRight,
//   BriefcaseBusinessIcon,
// } from "lucide-react";
// import axiosInstance from "../API/axiosInstance";
// import toast from "react-hot-toast";

// export default function EnhancedSignUp() {
//   const navigate = useNavigate();
//   const [showUserTypePopup, setShowUserTypePopup] = useState(true);
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone_number: "",
//     emailOtp: "",
//     user_type: "",
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevState) => ({ ...prevState, [name]: value }));
//   };

//   const handleEmailVerification = async () => {
//     try {
//       const res = await axiosInstance.post(
//         `${process.env.REACT_APP_BASE_URL}/auth/sendEmailVerification`,
//         { email: formData.email }
//       );
//       if (res.data.success) {
//         toast.success("Email verification code sent successfully");
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("An error occurred while sending email verification code");
//     }
//   };

//   const confirmEmailVerification = async () => {
//     try {
//       const res = await axiosInstance.post(
//         `${process.env.REACT_APP_BASE_URL}/auth/confirmEmail`,
//         {
//           email: formData.email,
//           emailOtp: formData.emailOtp,
//         }
//       );
//       if (res.data.success) {
//         toast.success("Email verified successfully");
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("Invalid OTP");
//     }
//   };

//   const handleUserTypeSelection = (userType) => {
//     setFormData((prevState) => ({
//       ...prevState,
//       user_type: userType.toString(),
//     }));
//     setShowUserTypePopup(false);
//   };

//   const handleSignupWithVerification = async (e) => {
//     e.preventDefault();

//     if (!formData.emailOtp) {
//       toast.error("Please enter email OTP");
//       return;
//     }

//     try {
//       const verifyEmailRes = await axiosInstance.post(
//         `${process.env.REACT_APP_BASE_URL}/auth/confirmEmail`,
//         {
//           email: formData.email,
//           emailOtp: formData.emailOtp,
//         }
//       );

//       if (!verifyEmailRes.data.success) {
//         toast.error("Email OTP verification failed");
//         return;
//       }

//       if (!/^\d{10}$/.test(formData.phone_number)) {
//         toast.error("Phone number must be exactly 10 digits");
//         return;
//       }

//       const response = await axiosInstance.post(
//         `${process.env.REACT_APP_BASE_URL}/auth/signup_with_verification`,
//         formData
//       );

//       toast.success("Signed Up Successfully");
//       navigate("/");
//     } catch (error) {
//       console.error("Error:", error);
//       if (error.response && error.response.data && error.response.data.error) {
//         toast.error(error.response.data.error);
//       } else {
//         toast.error("An error occurred during signup");
//       }
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col md:flex-row">
//       {/* Left Panel - Decorative */}
//       <div className="bg-gradient-to-br from-[#0bbfe0] via-[#0999b3] to-[#077286] md:w-1/2 p-8 flex flex-col justify-between">
//         <motion.div
//           className="text-white"
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//         >
//           <h1 className="text-6xl font-bold mb-4">TRIPTO</h1>
//           <h5
//             className="text-xl"
//             initial={{ opacity: 0 }}
//             transition={{ delay: 0.2 }}
//           >
//             Empowering your fleet, one ride at a time.
//           </h5>
//         </motion.div>
//         <motion.div
//           className="mt-auto"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 1, delay: 0.5 }}
//         >
//           <Mail className="text-white h-80 w-80 mx-auto opacity-20" />
//         </motion.div>
//       </div>

//       {/* Right Panel - Sign Up Form */}
//       <motion.div
//         className="bg-white md:w-1/2 p-8 flex items-center justify-center"
//         initial={{ opacity: 0, x: 20 }}
//         animate={{ opacity: 1, x: 0 }}
//         transition={{ duration: 0.5 }}
//       >
//         <div className="w-full max-w-md">
//           <div className="py-4">
//             <h4 className="text-2xl font-bold text-[#272727]">
//               Create an Account
//             </h4>
//             <h6 className="text-l mt-2 text-gray-600">
//               Join TRIPTO and start your journey today
//             </h6>
//           </div>

//           <form onSubmit={handleSignupWithVerification} className="space-y-4">
//             <div className="space-y-2">
//               <label
//                 htmlFor="name"
//                 className="text-sm font-medium text-gray-700"
//               >
//                 Name
//               </label>
//               <div className="relative">
//                 <input
//                   id="name"
//                   name="name"
//                   placeholder="Enter Your Name"
//                   value={formData.name}
//                   onChange={handleChange}
//                   className="w-full border pl-10 pr-4 py-2 border-gray-300  rounded focus:outline-none focus:ring-2 focus:ring-[#0bbfe0]"
//                   required
//                 />
//                 <User className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
//               </div>
//             </div>

//             <div className="space-y-2">
//               <label
//                 htmlFor="email"
//                 className="text-sm font-medium text-gray-700"
//               >
//                 Email
//               </label>
//               <div className="relative">
//                 <input
//                   id="email"
//                   name="email"
//                   type="email"
//                   placeholder="you@example.com"
//                   value={formData.email}
//                   onChange={handleChange}
//                   className="w-full border border-gray-300 pl-10 pr-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#0bbfe0]"
//                   required
//                 />
//                 <Mail className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
//               </div>
//             </div>

//             <div className="space-y-2">
//               <label
//                 htmlFor="phone_number"
//                 className="text-sm font-medium text-gray-700"
//               >
//                 Phone Number
//               </label>
//               <div className="relative">
//                 <input
//                   id="phone_number"
//                   name="phone_number"
//                   type="tel"
//                   placeholder="Enter your phone number"
//                   value={formData.phone_number}
//                   onChange={handleChange}
//                   maxLength="10"
//                   pattern="\d{10}"
//                   title="Phone number must be 10 digits"
//                   className="w-full border border-gray-300 pl-10 pr-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#0bbfe0]"
//                   required
//                 />
//                 <Phone className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
//               </div>
//             </div>

//             <div className="space-y-2">
//               <label
//                 htmlFor="emailOtp"
//                 className="text-sm font-medium text-gray-700"
//               >
//                 Email OTP
//               </label>
//               <div className="relative">
//                 <input
//                   id="emailOtp"
//                   name="emailOtp"
//                   placeholder="Enter your OTP here"
//                   value={formData.emailOtp}
//                   onChange={handleChange}
//                   className="w-full border border-gray-300 pl-10 pr-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#0bbfe0]"
//                   required
//                 />
//                 <Lock className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
//               </div>
//             </div>

//             <div className="flex justify-between">
//               <button
//                 type="button"
//                 onClick={handleEmailVerification}
//                 className="border border-[#0bbfe0] text-[#0bbfe0] px-4 py-2 rounded hover:bg-[#0bbfe0] hover:text-white transition-colors"
//               >
//                 Send OTP
//               </button>
//               <button
//                 type="button"
//                 onClick={confirmEmailVerification}
//                 className="border border-[#0bbfe0] text-[#0bbfe0] px-4 py-2 rounded hover:bg-[#0bbfe0] hover:text-white transition-colors"
//               >
//                 Verify OTP
//               </button>
//             </div>

//             <button
//               type="submit"
//               className="w-full bg-[#0bbfe0] text-white py-2 rounded hover:bg-[#0999b3] transition-colors"
//             >
//               Sign Up <ArrowRight className="ml-2 h-4 w-4 inline-block" />
//             </button>
//           </form>

//           <div className="flex justify-center mt-4">
//             <p className="text-sm text-gray-600">
//               Already have an account?{" "}
//               <a
//                 href="/"
//                 className="font-medium text-[#0bbfe0] hover:text-[#0999b3] transition-colors"
//               >
//                 Log in
//               </a>
//             </p>
//           </div>
//         </div>
//       </motion.div>

//       {/* User Type Selection Dialog */}
//       {showUserTypePopup && (
//         <motion.div
//           className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//         >
//           <div className="bg-white rounded-lg p-10 max-w-3xl w-full">
//             <h2 className="text-xl font-bold mb-4">Select User Type</h2>
//             <p className="text-gray-500 mb-4">
//               Choose your role in the TRIPTO ecosystem
//             </p>
//             <div className="grid grid-cols-3 gap-4">
//               <button
//                 onClick={() => handleUserTypeSelection(2)}
//                 className="border border-[#0bbfe0] text-[#0bbfe0] py-4 rounded-lg flex flex-col items-center hover:bg-[#0bbfe0] hover:text-white transition-colors"
//               >
//                 <User className="h-16 w-16 mb-2" />
//                 <span>Passenger</span>
//               </button>
//               <button
//                 onClick={() => handleUserTypeSelection(3)}
//                 className="border border-[#0bbfe0] text-[#0bbfe0] py-4 rounded-lg flex flex-col items-center hover:bg-[#0bbfe0] hover:text-white transition-colors"
//               >
//                 <Car className="h-16 w-16 mb-2" />
//                 <span>Driver</span>
//               </button>
//               <button
//                 onClick={() => handleUserTypeSelection(4)}
//                 className="border border-[#0bbfe0] text-[#0bbfe0] py-4 rounded-lg flex flex-col items-center hover:bg-[#0bbfe0] hover:text-white transition-colors"
//               >
//                 <BriefcaseBusinessIcon className="h-16 w-16 mb-2" />
//                 <span>Vendor</span>
//               </button>
//             </div>
//           </div>
//         </motion.div>
//       )}
//     </div>
//   );
// }
"use client";

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Car,
  ArrowRight,
  BriefcaseBusinessIcon,
  Check,
  Loader2,
} from "lucide-react";
import axiosInstance from "../API/axiosInstance";
import toast from "react-hot-toast";

export default function EnhancedSignUp() {
  const navigate = useNavigate();
  const [showUserTypePopup, setShowUserTypePopup] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    emailOtp: "",
    user_type: "",
  });
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [otpError, setOtpError] = useState("");
  const [currentStep, setCurrentStep] = useState(1); // 1: Email, 2: OTP, 3: Complete profile

  // OTP input refs
  const otpRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  // State for individual OTP digits
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Update emailOtp in formData when otpDigits change
  useEffect(() => {
    const combinedOtp = otpDigits.join("");
    setFormData((prev) => ({ ...prev, emailOtp: combinedOtp }));

    // Auto-verify when all 6 digits are filled
    if (combinedOtp.length === 6 && !otpVerified && !isVerifying) {
      confirmEmailVerification();
    }
  }, [otpDigits]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));

    if (name === "emailOtp") {
      setOtpError("");
    }
  };

  const handleEmailVerification = async () => {
    if (!formData.email) {
      toast.error("Please enter your email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSendingOtp(true);
    try {
      const res = await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/auth/sendEmailVerification`,
        {
          email: formData.email,
        }
      );
      if (res.data.success) {
        toast.success("OTP sent to your email");
        setOtpSent(true);
        setCountdown(60); // 60 seconds countdown for resend
        setCurrentStep(2); // Move to OTP verification step

        // Focus on first OTP input
        setTimeout(() => {
          if (otpRefs[0].current) {
            otpRefs[0].current.focus();
          }
        }, 100);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || "Failed to send OTP");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const confirmEmailVerification = async () => {
    const combinedOtp = otpDigits.join("");
    if (combinedOtp.length !== 6) {
      setOtpError("Please enter all 6 digits");
      return;
    }

    setIsVerifying(true);
    try {
      const res = await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/auth/confirmEmail`,
        {
          email: formData.email,
          emailOtp: combinedOtp,
        }
      );
      if (res.data.success) {
        toast.success("Email verified successfully");
        setOtpVerified(true);
        setOtpError("");
        setCurrentStep(3); // Move to complete profile step
      }
    } catch (error) {
      console.error(error);
      setOtpError("Invalid OTP. Please try again.");
      toast.error("Invalid OTP");

      // Clear OTP fields on error
      setOtpDigits(["", "", "", "", "", ""]);
      if (otpRefs[0].current) {
        otpRefs[0].current.focus();
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleUserTypeSelection = (userType) => {
    setFormData((prevState) => ({
      ...prevState,
      user_type: userType.toString(),
    }));
    setShowUserTypePopup(false);
  };

  const handleSignupWithVerification = async (e) => {
    e.preventDefault();

    if (!otpVerified) {
      toast.error("Please verify your email first");
      return;
    }

    if (!/^\d{10}$/.test(formData.phone_number)) {
      toast.error("Phone number must be exactly 10 digits");
      return;
    }

    try {
      const response = await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/auth/signup_with_verification`,
        formData
      );

      toast.success("Signed Up Successfully");
      navigate("/");
    } catch (error) {
      console.error("Error:", error);
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("An error occurred during signup");
      }
    }
  };

  // Handle OTP digit input
  const handleOtpDigitChange = (index, value) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    // Update the digit at the specified index
    const newOtpDigits = [...otpDigits];
    newOtpDigits[index] = value;
    setOtpDigits(newOtpDigits);

    // Auto-advance to next input if a digit was entered
    if (value && index < 5) {
      otpRefs[index + 1].current.focus();
    }
  };

  // Handle backspace in OTP input
  const handleOtpKeyDown = (index, e) => {
    // If backspace is pressed and current field is empty, focus previous field
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpRefs[index - 1].current.focus();
    }
  };

  // Handle paste for OTP
  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");

    // Check if pasted content is a 6-digit number
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split("");
      setOtpDigits(digits);

      // Focus the last input
      otpRefs[5].current.focus();
    }
  };

  // Render step indicators
  const renderStepIndicators = () => {
    return (
      <div className="flex items-center justify-center mb-6">
        <div className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep >= 1
                ? "bg-[#0bbfe0] text-white"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            1
          </div>
          <div
            className={`w-16 h-1 ${
              currentStep >= 2 ? "bg-[#0bbfe0]" : "bg-gray-200"
            }`}
          ></div>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep >= 2
                ? "bg-[#0bbfe0] text-white"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            2
          </div>
          <div
            className={`w-16 h-1 ${
              currentStep >= 3 ? "bg-[#0bbfe0]" : "bg-gray-200"
            }`}
          ></div>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep >= 3
                ? "bg-[#0bbfe0] text-white"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            3
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Panel - Decorative */}
      <div className="bg-gradient-to-br from-[#0bbfe0] via-[#0999b3] to-[#077286] md:w-1/2 p-8 flex flex-col justify-between">
        <motion.div
          className="text-white"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-6xl font-bold mb-4">TRIPTO</h1>
          <h5
            className="text-xl"
            initial={{ opacity: 0 }}
            transition={{ delay: 0.2 }}
          >
            Empowering your fleet, one ride at a time.
          </h5>
        </motion.div>
        <motion.div
          className="mt-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <Mail className="text-white h-80 w-80 mx-auto opacity-20" />
        </motion.div>
      </div>

      {/* Right Panel - Sign Up Form */}
      <motion.div
        className="bg-white md:w-1/2 p-8 flex items-center justify-center"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-full max-w-md">
          <div className="py-4">
            <h4 className="text-2xl font-bold text-[#272727]">
              Create an Account
            </h4>
            <h6 className="text-l mt-2 text-gray-600">
              Join TRIPTO and start your journey today
            </h6>
          </div>

          {renderStepIndicators()}

          <form onSubmit={handleSignupWithVerification} className="space-y-6">
            {/* Step 1: Email */}
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full border border-gray-300 pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0bbfe0]"
                      required
                    />
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleEmailVerification}
                  disabled={isSendingOtp}
                  className="w-full bg-[#0bbfe0] text-white py-3 rounded-lg hover:bg-[#0999b3] transition-colors flex items-center justify-center"
                >
                  {isSendingOtp ? (
                    <>
                      <Loader2 className="animate-spin h-5 w-5 mr-2" />
                      Sending OTP...
                    </>
                  ) : (
                    "Continue with Email Verification"
                  )}
                </button>

                <div className="text-center text-sm text-gray-500">
                  We'll send a verification code to your email
                </div>
              </motion.div>
            )}

            {/* Step 2: OTP Verification */}
            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <h3 className="text-lg font-medium text-gray-900">
                    Verify your email
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    We've sent a 6-digit code to{" "}
                    <span className="font-medium text-[#0bbfe0]">
                      {formData.email}
                    </span>
                  </p>
                </div>

                {/* Professional OTP Input */}
                <div
                  className="flex gap-2 justify-center w-full my-4"
                  onPaste={handleOtpPaste}
                >
                  {otpDigits.map((digit, index) => (
                    <div
                      key={index}
                      className={`w-11 h-14 relative ${
                        isVerifying ? "opacity-70" : ""
                      }`}
                    >
                      <input
                        ref={otpRefs[index]}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) =>
                          handleOtpDigitChange(index, e.target.value)
                        }
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className={`w-full h-full text-center text-xl font-semibold border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0bbfe0] ${
                          otpError
                            ? "border-red-500"
                            : digit
                            ? "border-[#0bbfe0]"
                            : "border-gray-300"
                        }`}
                        disabled={isVerifying || otpVerified}
                      />
                      {index < 5 && (
                        <div className="absolute top-1/2 -right-2 transform -translate-y-1/2 text-gray-300">
                          -
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {otpError && (
                  <p className="text-red-500 text-sm text-center">{otpError}</p>
                )}

                {isVerifying && (
                  <div className="flex items-center justify-center text-[#0bbfe0]">
                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                    <span>Verifying...</span>
                  </div>
                )}

                <div className="flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={confirmEmailVerification}
                    disabled={isVerifying || otpDigits.join("").length !== 6}
                    className={`w-full py-3 rounded-lg transition-colors flex items-center justify-center ${
                      isVerifying || otpDigits.join("").length !== 6
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-[#0bbfe0] text-white hover:bg-[#0999b3]"
                    }`}
                  >
                    Verify Email
                  </button>

                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      Change Email
                    </button>
                    <span className="text-gray-300">|</span>
                    <button
                      type="button"
                      onClick={handleEmailVerification}
                      disabled={countdown > 0 || isVerifying}
                      className={`text-sm ${
                        countdown > 0 || isVerifying
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-[#0bbfe0] hover:text-[#0999b3]"
                      }`}
                    >
                      {countdown > 0
                        ? `Resend in ${countdown}s`
                        : "Resend Code"}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Complete Profile */}
            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 bg-green-50 p-3 rounded-lg border border-green-200">
                  <Check className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm font-medium text-green-800">
                      Email Verified
                    </p>
                    <p className="text-xs text-green-600">{formData.email}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="name"
                      className="text-sm font-medium text-gray-700"
                    >
                      Full Name
                    </label>
                    <div className="relative">
                      <input
                        id="name"
                        name="name"
                        placeholder="Enter Your Name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full border pl-10 pr-4 py-3 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0bbfe0]"
                        required
                      />
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="phone_number"
                      className="text-sm font-medium text-gray-700"
                    >
                      Phone Number
                    </label>
                    <div className="relative">
                      <input
                        id="phone_number"
                        name="phone_number"
                        type="tel"
                        placeholder="Enter your phone number"
                        value={formData.phone_number}
                        onChange={handleChange}
                        maxLength="10"
                        pattern="\d{10}"
                        title="Phone number must be 10 digits"
                        className="w-full border border-gray-300 pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0bbfe0]"
                        required
                      />
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#0bbfe0] text-white py-3 rounded-lg hover:bg-[#0999b3] transition-colors flex items-center justify-center"
                >
                  Complete Sign Up <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </motion.div>
            )}
          </form>

          <div className="flex justify-center mt-6">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <a
                href="/"
                className="font-medium text-[#0bbfe0] hover:text-[#0999b3] transition-colors"
              >
                Log in
              </a>
            </p>
          </div>
        </div>
      </motion.div>

      {/* User Type Selection Dialog */}
      {showUserTypePopup && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="bg-white rounded-lg p-10 max-w-3xl w-full">
            <h2 className="text-xl font-bold mb-4">Select User Type</h2>
            <p className="text-gray-500 mb-4">
              Choose your role in the TRIPTO ecosystem
            </p>
            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={() => handleUserTypeSelection(2)}
                className="border border-[#0bbfe0] text-[#0bbfe0] py-4 rounded-lg flex flex-col items-center hover:bg-[#0bbfe0] hover:text-white transition-colors"
              >
                <User className="h-16 w-16 mb-2" />
                <span>Passenger</span>
              </button>
              <button
                onClick={() => handleUserTypeSelection(3)}
                className="border border-[#0bbfe0] text-[#0bbfe0] py-4 rounded-lg flex flex-col items-center hover:bg-[#0bbfe0] hover:text-white transition-colors"
              >
                <Car className="h-16 w-16 mb-2" />
                <span>Driver</span>
              </button>
              <button
                onClick={() => handleUserTypeSelection(4)}
                className="border border-[#0bbfe0] text-[#0bbfe0] py-4 rounded-lg flex flex-col items-center hover:bg-[#0bbfe0] hover:text-white transition-colors"
              >
                <BriefcaseBusinessIcon className="h-16 w-16 mb-2" />
                <span>Vendor</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

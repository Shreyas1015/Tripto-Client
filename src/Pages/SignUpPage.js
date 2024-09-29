// import React, { useState } from "react";
// import axios from "axios";
// import { Link, useNavigate } from "react-router-dom";
// import axiosInstance from "../API/axiosInstance";
// import toast from "react-hot-toast";

// const SignUpPage = () => {
//   const navigate = useNavigate();
//   const [showUserTypePopup, setShowUserTypePopup] = useState(true);
//   const [selectedUserType, setSelectedUserType] = useState("");

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone_number: "",
//     emailOtp: "",
//     // phoneOtp: "",
//     user_type: "",
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevState) => ({ ...prevState, [name]: value }));
//   };

//   const handleEmailVerification = async () => {
//     try {
//       const res = await axios.post(
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
//       const res = await axios.post(
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

//   // const handlePhoneVerification = async () => {
//   //   try {
//   //     const res = await axios.post(
//   //       `${process.env.REACT_APP_BASE_URL}/auth/sendPhoneVerification`,
//   //       { phone: formData.phone_number }
//   //     );

//   //     if (res.data.success) {
//   //       alert("Phone verification code sent successfully");
//   //     } else {
//   //       setErrorMessage("Failed to send phone verification code");
//   //     }
//   //   } catch (error) {
//   //     console.error(error);
//   //     setErrorMessage(
//   //       "An error occurred while sending phone verification code"
//   //     );
//   //   }
//   // };

//   const handleUserTypeSelection = (userType) => {
//     setSelectedUserType(userType);
//     setFormData((prevState) => ({ ...prevState, user_type: userType }));
//     setShowUserTypePopup(false);
//   };

//   const handleSignupWithVerification = async (e) => {
//     e.preventDefault();

//     if (!formData.emailOtp) {
//       toast.error("Please enter email OTPs");
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
//         toast.error(error.response.data.error);
//       }
//     }
//   };

//   return (
//     <>
//       <div className="container-fluid min-vh-100">
//         <div className="row min-vh-100">
//           <img
//             className="object-fit-cover position-absolute z-n1 m-0 p-0"
//             src="/Images/login&signup_image.png"
//             alt=""
//             style={{ height: "100vh" }}
//           />
//           {showUserTypePopup && (
//             <div className="user-type-overlay">
//               <div className="user-type-popup">
//                 <h3>Select User Type</h3>
//                 <div className="user-type-options row text-center">
//                   <div
//                     className="user-type-option col-lg-6"
//                     onClick={() => handleUserTypeSelection(2)}
//                   >
//                     <div className="card" style={{ width: "18rem" }}>
//                       <img
//                         src="/Images/avatar (3).png"
//                         className="card-img-top img-fluid"
//                         alt=""
//                       />
//                       <div className="card-body">
//                         <p className="card-text">Passenger</p>
//                       </div>
//                     </div>
//                   </div>
//                   <div
//                     className="user-type-option col-lg-6"
//                     onClick={() => handleUserTypeSelection(3)}
//                   >
//                     <div className="card" style={{ width: "18rem" }}>
//                       <img
//                         src="/Images/avatar (1).jpeg"
//                         className="card-img-top img-fluid"
//                         alt=""
//                       />
//                       <div className="card-body">
//                         <p className="card-text">Driver</p>
//                       </div>
//                     </div>
//                   </div>
//                   {/* <div
//                     className="user-type-option col-lg-4"
//                     onClick={() => handleUserTypeSelection("Vendor")}
//                   >
//                     <div className="card" style={{ width: "18rem" }}>
//                       <img
//                         src="/Images/avatar (2).jpeg"
//                         className="card-img-top img-fluid"
//                         alt=""
//                       />
//                       <div className="card-body">
//                         <p className="card-text">Vendor</p>
//                       </div>
//                     </div>
//                   </div> */}
//                 </div>
//               </div>
//             </div>
//           )}
//           <div className="col-lg-6 m-0 p-0"></div>
//           <div className="col-lg-6 m-0 p-0">
//             <form
//               className="bg-light signup-container mx-auto rounded-4"
//               onSubmit={handleSignupWithVerification}
//             >
//               <div className="text-center signup-text pt-4 mx-auto mb-5">
//                 <h1 className="mb-3">Sign Up</h1>
//                 <i>"Welcome to TRIPTO , Your trusted Travel Partner !!"</i>
//               </div>
//               <div className="form-container pb-4 mx-auto">
//                 <div className="row">
//                   <div className="col-lg-6">
//                     <div className="mb-3">
//                       <label htmlFor="name" className="form-label">
//                         Name
//                       </label>
//                       <input
//                         type="text"
//                         name="name"
//                         className="form-control"
//                         id="name"
//                         placeholder="Enter Your Name"
//                         required
//                         onChange={handleChange}
//                         value={formData.name}
//                       />
//                     </div>
//                   </div>
//                   <div className="col-lg-6 mb-3">
//                     <label htmlFor="email" className="form-label">
//                       Email address
//                     </label>
//                     <div className="input-group">
//                       <input
//                         type="email"
//                         name="email"
//                         className="form-control"
//                         id="email"
//                         placeholder="name@gmail.com"
//                         required
//                         onChange={handleChange}
//                         value={formData.email}
//                       />
//                       <button
//                         className="btn btn-sm"
//                         type="button"
//                         style={{ backgroundColor: "#0bbfe0", color: "white" }}
//                         onClick={handleEmailVerification}
//                       >
//                         Send OTP
//                       </button>
//                     </div>
//                   </div>
//                   <div className="col-lg-6 mb-3">
//                     <label htmlFor="emailOtp" className="form-label">
//                       Email OTP:
//                     </label>
//                     <div className="input-group">
//                       <input
//                         type="text"
//                         id="emailOtp"
//                         name="emailOtp"
//                         className="form-control"
//                         value={formData.emailOtp}
//                         placeholder="Enter your OTP here"
//                         onChange={handleChange}
//                         required
//                       />

//                       <button
//                         className="btn btn-sm"
//                         style={{ backgroundColor: "#0bbfe0", color: "white" }}
//                         type="button"
//                         onClick={confirmEmailVerification}
//                       >
//                         Verify OTP
//                       </button>
//                     </div>
//                   </div>
//                   <div className="col-lg-6">
//                     <div className="mb-3">
//                       <label htmlFor="phone_number" className="form-label">
//                         Phone Number
//                       </label>
//                       <input
//                         type="number"
//                         name="phone_number"
//                         className="form-control"
//                         id="phone_number"
//                         placeholder="Enter your phone number"
//                         onChange={handleChange}
//                         value={formData.phone_number}
//                         required
//                       />
//                       {/* <button
//                     className="btn btn-outline-secondary"
//                     type="button"
//                     // onClick={handlePhoneVerification}
//                   >
//                     Send Phone OTP
//                   </button> */}
//                     </div>
//                   </div>
//                 </div>

//                 {/* <div className="mb-3">
//                   <label htmlFor="phoneOtp" className="form-label">
//                     Phone OTP:
//                   </label>
//                   <input
//                     type="text"
//                     id="phoneOtp"
//                     name="phoneOtp"
//                     className="form-control"
//                     value={formData.phoneOtp}
//                     placeholder="Enter your phone OTP here"
//                     onChange={handleChange}
//                     required
//                   />
//                 </div> */}

//                 <br />

//                 <input
//                   className="btn px-4 py-2"
//                   style={{ backgroundColor: "#0bbfe0", color: "white" }}
//                   type="submit"
//                   value="Sign Up"
//                 />
//               </div>
//               <div className="text-center p-3 ">
//                 <Link className="text-decoration-none blue-text" to="/">
//                   Already Have An Account ? Login Here
//                 </Link>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default SignUpPage;
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, Phone, Lock, Car, ArrowRight } from "lucide-react";
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleEmailVerification = async () => {
    try {
      const res = await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/auth/sendEmailVerification`,
        { email: formData.email }
      );
      if (res.data.success) {
        toast.success("Email verification code sent successfully");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while sending email verification code");
    }
  };

  const confirmEmailVerification = async () => {
    try {
      const res = await axiosInstance.post("/auth/confirmEmail", {
        email: formData.email,
        emailOtp: formData.emailOtp,
      });
      if (res.data.success) {
        toast.success("Email verified successfully");
      }
    } catch (error) {
      console.error(error);
      toast.error("Invalid OTP");
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

    if (!formData.emailOtp) {
      toast.error("Please enter email OTP");
      return;
    }

    try {
      const verifyEmailRes = await axiosInstance.post("/auth/confirmEmail", {
        email: formData.email,
        emailOtp: formData.emailOtp,
      });

      if (!verifyEmailRes.data.success) {
        toast.error("Email OTP verification failed");
        return;
      }

      if (!/^\d{10}$/.test(formData.phone_number)) {
        toast.error("Phone number must be exactly 10 digits");
        return;
      }

      const response = await axiosInstance.post(
        "/auth/signup_with_verification",
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

          <form onSubmit={handleSignupWithVerification} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <div className="relative">
                <input
                  id="name"
                  name="name"
                  placeholder="Enter Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border pl-10 pr-4 py-2 border-gray-300  rounded focus:outline-none focus:ring-2 focus:ring-[#0bbfe0]"
                  required
                />
                <User className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

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
                  className="w-full border border-gray-300 pl-10 pr-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#0bbfe0]"
                  required
                />
                <Mail className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
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
                  placeholder="Enter your phone number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  className="w-full border border-gray-300 pl-10 pr-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#0bbfe0]"
                  required
                />
                <Phone className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
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
                <input
                  id="emailOtp"
                  name="emailOtp"
                  placeholder="Enter your OTP here"
                  value={formData.emailOtp}
                  onChange={handleChange}
                  className="w-full border border-gray-300 pl-10 pr-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#0bbfe0]"
                  required
                />
                <Lock className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={handleEmailVerification}
                className="border border-[#0bbfe0] text-[#0bbfe0] px-4 py-2 rounded hover:bg-[#0bbfe0] hover:text-white transition-colors"
              >
                Send OTP
              </button>
              <button
                type="button"
                onClick={confirmEmailVerification}
                className="border border-[#0bbfe0] text-[#0bbfe0] px-4 py-2 rounded hover:bg-[#0bbfe0] hover:text-white transition-colors"
              >
                Verify OTP
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-[#0bbfe0] text-white py-2 rounded hover:bg-[#0999b3] transition-colors"
            >
              Sign Up <ArrowRight className="ml-2 h-4 w-4 inline-block" />
            </button>
          </form>

          <div className="flex justify-center mt-4">
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
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Select User Type</h2>
            <p className="text-gray-500 mb-4">
              Choose your role in the TRIPTO ecosystem
            </p>
            <div className="grid grid-cols-2 gap-4">
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
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

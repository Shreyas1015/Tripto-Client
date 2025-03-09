// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { IKContext, IKUpload } from "imagekitio-react";
// import axiosInstance from "../../API/axiosInstance";
// import secureLocalStorage from "react-secure-storage";
// import { toast } from "react-hot-toast";

// const PassengerProfileContent = () => {
//   const navigate = useNavigate();
//   const uid = localStorage.getItem("@secure.n.uid");
//   const decryptedUID = secureLocalStorage.getItem("uid");
//   const [previousEmail, setPreviousEmail] = useState("");
//   const [profileIMG, setProfileIMG] = useState("");
//   const [updatedProfileIMG, setUpdatedProfileIMG] = useState("");
//   const [isUploading, setIsUploading] = useState(false);

//   const [updatedProfileData, setUpdatedProfileData] = useState({
//     uid: decryptedUID,
//     name: "",
//     email: "",
//     emailOtp: "",
//     phone_number: "",
//   });

//   const handleEmailVerification = async () => {
//     try {
//       const res = await axiosInstance.post(
//         `${process.env.REACT_APP_BASE_URL}/passengers/sendProfileUpdateEmailVerification`,
//         { decryptedUID }
//       );

//       setPreviousEmail(res.data.email);
//       if (res.data.success) {
//         toast.success(
//           "Email verification code sent successfully to the email you previously registered with"
//         );
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
//           email: previousEmail,
//           emailOtp: updatedProfileData.emailOtp,
//         }
//       );

//       if (res.data.success) {
//         toast.success("Email verified successfully");
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("Invalid Otp");
//     }
//   };

//   const authenticator = async () => {
//     try {
//       const response = await fetch(
//         `${process.env.REACT_APP_BASE_URL}/passengers/passenger_document_auth`
//       );

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(
//           `Request failed with status ${response.status}: ${errorText}`
//         );
//       }

//       const data = await response.json();
//       const { signature, expire, token } = data;
//       console.log("Authentication parameters:", { signature, expire, token });
//       return { signature, expire, token };
//     } catch (error) {
//       console.error(`Authentication request failed: ${error.message}`);
//       throw new Error(`Authentication request failed: ${error.message}`);
//     }
//   };

//   useEffect(() => {
//     const fetchProfileData = async () => {
//       try {
//         const response = await axiosInstance.post(
//           `${process.env.REACT_APP_BASE_URL}/passengers/fetchProfileData`,
//           { decryptedUID }
//         );

//         if (response.status === 200) {
//           setUpdatedProfileData(response.data);
//         }
//       } catch (error) {
//         console.error("Error fetching Profile Data:", error.message);
//       }
//     };

//     const fetchProfileIMG = async () => {
//       try {
//         const response = await axiosInstance.post(
//           `${process.env.REACT_APP_BASE_URL}/passengers/fetchProfileIMG`,
//           { decryptedUID }
//         );

//         setUpdatedProfileIMG(response.data.link.profile_img);
//         console.log(response.data.link.profile_img);
//       } catch (error) {
//         console.error("Error fetching :", error.message);
//       }
//     };

//     fetchProfileData();
//     fetchProfileIMG();
//   }, [decryptedUID]);

//   const handleProfileEdit = async (e) => {
//     e.preventDefault();

//     try {
//       const verifyEmailRes = await axiosInstance.post(
//         `${process.env.REACT_APP_BASE_URL}/auth/confirmEmail`,
//         {
//           email: previousEmail,
//           emailOtp: updatedProfileData.emailOtp,
//         }
//       );

//       if (!verifyEmailRes.data.success) {
//         toast.error("Email OTP verification failed");
//         return;
//       }

//       const res = await axiosInstance.post(
//         `${process.env.REACT_APP_BASE_URL}/passengers/updateProfile`,
//         updatedProfileData
//       );

//       if (res.status === 200) {
//         if (updatedProfileData.email !== previousEmail) {
//           toast.success(
//             "Profile has been updated. Please login again with your updated email."
//           );
//           secureLocalStorage.clear();
//           localStorage.clear();
//           window.location.reload();
//           navigate("/");
//         } else {
//           toast.success("Profile is Updated Successfully");
//           // setUpdatedProfileData({ ...updatedProfileData, email: previousEmail });
//           // setUpdatedProfileIMG(updatedProfileIMG);
//           window.location.reload();
//         }
//       }
//     } catch (error) {
//       console.error("Error Updating Profile Data:", error);
//       toast.error("An error occurred while updating your Profile Data");
//     }
//   };

//   const BackToLogin = () => {
//     navigate("/");
//   };

//   const handleProfileImg = async (e) => {
//     e.preventDefault();
//     try {
//       const formData = {
//         profile_img: profileIMG,
//         uid: decryptedUID,
//       };

//       const res = await axiosInstance.post(
//         `${process.env.REACT_APP_BASE_URL}/passengers/uploadProfileImage`,
//         { formData, decryptedUID }
//       );

//       if (res.status === 200) {
//         toast.success("Profile Image uploaded!");
//         window.location.reload();
//       }
//     } catch (error) {
//       console.error("Error: ", error);
//       toast.error("An error occurred while uploading your Profile Image.");
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setUpdatedProfileData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
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

//   return (
//     <div className="container-fluid">
//       <div className="profile-div mb-4">
//         <h2>Passenger's Profile</h2>
//         <hr />
//         <div className="row my-5">
//           <div className="col-lg-3 border-end border-dark border-2 text-center">
//             <img
//               className="img-fluid profile-img"
//               src={updatedProfileIMG}
//               alt="Not available"
//             />
//             <form onSubmit={handleProfileImg}>
//               <input type="hidden" name="uid" value={decryptedUID} />
//               <div className="input-group me-5 py-3">
//                 <IKContext
//                   publicKey="public_ytabO1+xt+yMhICKtVeVGbWi/u8="
//                   urlEndpoint="https://ik.imagekit.io/TriptoServices"
//                   authenticator={authenticator}
//                 >
//                   <div className="input-group me-5 py-3">
//                     <IKUpload
//                       required
//                       className="form-control"
//                       fileName={`${decryptedUID}_passengerProfileIMG.jpg`}
//                       folder="Home/Tripto/passengers"
//                       tags={["tag1"]}
//                       useUniqueFileName={true}
//                       isPrivateFile={false}
//                       onUploadStart={() => {
//                         setIsUploading(true);
//                         toast.loading("Uploading image...");
//                       }}
//                       onSuccess={(r) => {
//                         setProfileIMG(r.url);
//                         setIsUploading(false);
//                         toast.dismiss(); // Remove loading toast
//                         toast.success("Uploaded successfully!");
//                       }}
//                       onError={(e) => {
//                         console.error("Upload Error:", e);
//                         setIsUploading(false);
//                         toast.dismiss();
//                         toast.error("Upload failed!");
//                       }}
//                     />
//                   </div>
//                 </IKContext>
//                 <input
//                   type="submit"
//                   className="input-group-text blue-buttons"
//                   value="Edit"
//                 />
//               </div>
//             </form>
//           </div>
//           <div className="col-lg-9 p-4 ">
//             <form onSubmit={handleProfileEdit}>
//               <input type="hidden" name="uid" value={decryptedUID} />
//               <div className="input-group mb-4">
//                 <span className="input-group-text">Name</span>
//                 <input
//                   name="name"
//                   type="text"
//                   className="form-control"
//                   required
//                   value={updatedProfileData.name || ""}
//                   onChange={handleChange}
//                 />
//               </div>
//               <div className="row">
//                 <div className="col-lg-6">
//                   <div className="input-group mb-4">
//                     <span className="input-group-text">Email</span>
//                     <input
//                       name="email"
//                       type="text"
//                       className="form-control"
//                       required
//                       value={updatedProfileData.email || ""}
//                       onChange={handleChange}
//                     />
//                     <button
//                       className="btn btn-sm"
//                       type="button"
//                       style={{ backgroundColor: "#0bbfe0", color: "white" }}
//                       onClick={handleEmailVerification}
//                     >
//                       Send OTP
//                     </button>
//                   </div>
//                 </div>
//                 <div className="col-lg-6">
//                   <div className="input-group">
//                     <input
//                       type="text"
//                       id="emailOtp"
//                       name="emailOtp"
//                       className="form-control"
//                       value={updatedProfileData.emailOtp || ""}
//                       placeholder="Enter your OTP here"
//                       onChange={handleChange}
//                       required
//                     />

//                     <button
//                       className="btn btn-sm"
//                       style={{ backgroundColor: "#0bbfe0", color: "white" }}
//                       type="button"
//                       onClick={confirmEmailVerification}
//                     >
//                       Verify OTP
//                     </button>
//                   </div>
//                 </div>
//               </div>

//               <div className="input-group mb-4">
//                 <span className="input-group-text">Phone Number</span>
//                 <input
//                   name="phone_number"
//                   type="text"
//                   className="form-control"
//                   required
//                   value={updatedProfileData.phone_number || ""}
//                   onChange={handleChange}
//                 />
//               </div>
//               <br />
//               <input
//                 type="submit"
//                 value="Edit Profile"
//                 className="form-control blue-buttons mt-4"
//               />
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PassengerProfileContent;

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IKContext, IKUpload } from "imagekitio-react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../API/axiosInstance";
import secureLocalStorage from "react-secure-storage";
import { toast } from "react-hot-toast";
import {
  User,
  Mail,
  Phone,
  Camera,
  Save,
  ArrowLeft,
  CheckCircle,
  X,
  Loader,
  Shield,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const PassengerProfileContent = () => {
  const navigate = useNavigate();
  const uid = localStorage.getItem("@secure.n.uid");
  const decryptedUID = secureLocalStorage.getItem("uid");
  const [previousEmail, setPreviousEmail] = useState("");
  const [profileIMG, setProfileIMG] = useState("");
  const [updatedProfileIMG, setUpdatedProfileIMG] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [expandedSection, setExpandedSection] = useState("personal");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const [updatedProfileData, setUpdatedProfileData] = useState({
    uid: decryptedUID,
    name: "",
    email: "",
    emailOtp: "",
    phone_number: "",
  });

  const handleEmailVerification = async () => {
    try {
      setIsVerifying(true);
      const res = await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/passengers/sendProfileUpdateEmailVerification`,
        { decryptedUID }
      );

      setPreviousEmail(res.data.email);
      if (res.data.success) {
        toast.success("Verification code sent to your registered email");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to send verification code");
    } finally {
      setIsVerifying(false);
    }
  };

  const confirmEmailVerification = async () => {
    try {
      setIsVerifying(true);
      const res = await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/auth/confirmEmail`,
        {
          email: previousEmail,
          emailOtp: updatedProfileData.emailOtp,
        }
      );

      if (res.data.success) {
        toast.success("Email verified successfully");
        setIsEmailVerified(true);
      }
    } catch (error) {
      console.error(error);
      toast.error("Invalid verification code");
    } finally {
      setIsVerifying(false);
    }
  };

  const authenticator = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/passengers/passenger_document_auth`
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Request failed with status ${response.status}: ${errorText}`
        );
      }

      const data = await response.json();
      const { signature, expire, token } = data;
      return { signature, expire, token };
    } catch (error) {
      console.error(`Authentication request failed: ${error.message}`);
      throw new Error(`Authentication request failed: ${error.message}`);
    }
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axiosInstance.post(
          `${process.env.REACT_APP_BASE_URL}/passengers/fetchProfileData`,
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
          `${process.env.REACT_APP_BASE_URL}/passengers/fetchProfileIMG`,
          {
            decryptedUID,
          }
        );

        setUpdatedProfileIMG(response.data.link.profile_img);
      } catch (error) {
        console.error("Error fetching profile image:", error.message);
      }
    };

    fetchProfileData();
    fetchProfileIMG();
  }, [decryptedUID]);

  const handleProfileEdit = async (e) => {
    e.preventDefault();

    try {
      const verifyEmailRes = await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/auth/confirmEmail`,
        {
          email: previousEmail,
          emailOtp: updatedProfileData.emailOtp,
        }
      );

      if (!verifyEmailRes.data.success) {
        toast.error("Email verification failed");
        return;
      }

      const res = await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/passengers/updateProfile`,
        { updatedProfileData, decryptedUID }
      );

      if (res.status === 200) {
        if (updatedProfileData.email !== previousEmail) {
          toast.success(
            "Profile updated. Please login again with your new email."
          );
          secureLocalStorage.clear();
          localStorage.clear();
          window.location.reload();
          navigate("/");
        } else {
          toast.success("Profile updated successfully");
          window.location.reload();
        }
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  const handleProfileImg = async (e) => {
    e.preventDefault();
    try {
      const formData = {
        profile_img: profileIMG,
        uid: decryptedUID,
      };

      const res = await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/passengers/uploadProfileImage`,
        {
          formData,
          decryptedUID,
        }
      );

      if (res.status === 200) {
        toast.success("Profile image updated!");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error: ", error);
      toast.error("Failed to upload profile image");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUpdatedProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const BackToLogin = () => {
    navigate("/");
  };

  if (!uid) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center min-h-screen p-4 text-center"
      >
        <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-xl max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Invalid URL</h2>
          <p className="mb-6 text-gray-700">
            Please provide a valid user ID to access your profile.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={BackToLogin}
            className="px-6 py-3 bg-blue-600 text-white rounded-full font-medium shadow-md hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="inline mr-2 h-5 w-5" />
            Back to Login
          </motion.button>
        </div>
      </motion.div>
    );
  }

  const tabVariants = {
    inactive: {
      opacity: 0.7,
      y: 0,
      transition: { duration: 0.3 },
    },
    active: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  const sectionVariants = {
    collapsed: { height: 60, overflow: "hidden" },
    expanded: { height: "auto", overflow: "visible" },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="flex justify-between items-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800">
            Passenger Profile
          </h1>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Profile Image & Tabs */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="lg:w-1/3"
          >
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden mb-6">
              <div className="relative">
                <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="absolute -bottom-16 left-1/2 transform -translate-x-1/2"
                >
                  <div className="relative">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="h-32 w-32 rounded-full border-4 border-white bg-white shadow-md overflow-hidden"
                    >
                      <img
                        src={
                          updatedProfileIMG ||
                          "/placeholder.svg?height=128&width=128"
                        }
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-md cursor-pointer"
                    >
                      <Camera className="h-5 w-5" />
                    </motion.div>
                  </div>
                </motion.div>
              </div>

              <div className="pt-20 pb-6 px-6 text-center">
                <h2 className="text-2xl font-bold text-gray-800">
                  {updatedProfileData.name || "Passenger Name"}
                </h2>
                <p className="text-gray-500 mt-1">
                  {updatedProfileData.email || "email@example.com"}
                </p>

                <form onSubmit={handleProfileImg} className="mt-6">
                  <input type="hidden" name="uid" value={decryptedUID} />
                  <div className="flex flex-col gap-4">
                    <div className="relative">
                      <IKContext
                        publicKey="public_ytabO1+xt+yMhICKtVeVGbWi/u8="
                        urlEndpoint="https://ik.imagekit.io/TriptoServices"
                        authenticator={authenticator}
                      >
                        <div className="relative">
                          <IKUpload
                            required
                            className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
                            fileName={`${decryptedUID}_passengerProfileIMG.jpg`}
                            folder="Home/Tripto/passengers"
                            tags={["tag1"]}
                            useUniqueFileName={true}
                            isPrivateFile={false}
                            onUploadStart={() => {
                              setIsUploading(true);
                              toast.loading("Uploading image...");
                            }}
                            onSuccess={(r) => {
                              setProfileIMG(r.url);
                              setIsUploading(false);
                              toast.dismiss();
                              toast.success("Uploaded successfully!");
                            }}
                            onError={(e) => {
                              console.error("Upload Error:", e);
                              setIsUploading(false);
                              toast.dismiss();
                              toast.error("Upload failed!");
                            }}
                          />
                          <motion.button
                            type="button"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className="w-full flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                          >
                            <Camera className="h-5 w-5 mr-2" />
                            {isUploading ? "Uploading..." : "Choose Photo"}
                          </motion.button>
                        </div>
                      </IKContext>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      type="submit"
                      disabled={!profileIMG || isUploading}
                      className={`px-4 py-2 rounded-lg font-medium shadow transition-colors ${
                        profileIMG && !isUploading
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      {isUploading ? (
                        <span className="flex items-center justify-center">
                          <Loader className="h-5 w-5 mr-2 animate-spin" />
                          Uploading...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center">
                          <Save className="h-5 w-5 mr-2" />
                          Update Photo
                        </span>
                      )}
                    </motion.button>
                  </div>
                </form>
              </div>

              <div className="flex border-t border-gray-200">
                <motion.button
                  variants={tabVariants}
                  animate={activeTab === "profile" ? "active" : "inactive"}
                  whileHover={{ backgroundColor: "rgba(243, 244, 246, 1)" }}
                  onClick={() => setActiveTab("profile")}
                  className={`flex-1 py-4 text-center font-medium transition-colors ${
                    activeTab === "profile"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Profile
                </motion.button>
                <motion.button
                  variants={tabVariants}
                  animate={activeTab === "settings" ? "active" : "inactive"}
                  whileHover={{ backgroundColor: "rgba(243, 244, 246, 1)" }}
                  onClick={() => setActiveTab("settings")}
                  className={`flex-1 py-4 text-center font-medium transition-colors ${
                    activeTab === "settings"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Settings
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Profile Form */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="lg:w-2/3"
          >
            <AnimatePresence mode="wait">
              {activeTab === "profile" && (
                <motion.div
                  key="profile"
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, y: -20 }}
                  variants={contentVariants}
                  className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-8"
                >
                  <form onSubmit={handleProfileEdit}>
                    <input type="hidden" name="uid" value={decryptedUID} />

                    {/* Personal Information Section */}
                    <motion.div
                      variants={sectionVariants}
                      animate={
                        expandedSection === "personal"
                          ? "expanded"
                          : "collapsed"
                      }
                      className="mb-6 overflow-hidden border border-gray-100 rounded-xl shadow-sm"
                    >
                      <motion.button
                        type="button"
                        onClick={() =>
                          setExpandedSection(
                            expandedSection === "personal" ? "" : "personal"
                          )
                        }
                        className="w-full flex items-center justify-between p-4 bg-gray-50 text-left"
                      >
                        <div className="flex items-center">
                          <User className="h-5 w-5 text-blue-600 mr-2" />
                          <h3 className="text-lg font-medium text-gray-800">
                            Personal Information
                          </h3>
                        </div>
                        {expandedSection === "personal" ? (
                          <ChevronUp className="h-5 w-5 text-gray-500" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-500" />
                        )}
                      </motion.button>

                      <div className="p-4">
                        <motion.div variants={itemVariants} className="mb-6">
                          <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Full Name
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <User className="h-5 w-5 text-gray-400" />
                            </div>
                            <motion.input
                              whileFocus={{
                                boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)",
                              }}
                              type="text"
                              id="name"
                              name="name"
                              value={updatedProfileData.name || ""}
                              onChange={handleChange}
                              required
                              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                              placeholder="Enter your full name"
                            />
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>

                    {/* Contact Information Section */}
                    <motion.div
                      variants={sectionVariants}
                      animate={
                        expandedSection === "contact" ? "expanded" : "collapsed"
                      }
                      className="mb-6 overflow-hidden border border-gray-100 rounded-xl shadow-sm"
                    >
                      <motion.button
                        type="button"
                        onClick={() =>
                          setExpandedSection(
                            expandedSection === "contact" ? "" : "contact"
                          )
                        }
                        className="w-full flex items-center justify-between p-4 bg-gray-50 text-left"
                      >
                        <div className="flex items-center">
                          <Mail className="h-5 w-5 text-blue-600 mr-2" />
                          <h3 className="text-lg font-medium text-gray-800">
                            Contact Information
                          </h3>
                        </div>
                        {expandedSection === "contact" ? (
                          <ChevronUp className="h-5 w-5 text-gray-500" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-500" />
                        )}
                      </motion.button>

                      <div className="p-4">
                        <motion.div variants={itemVariants} className="mb-6">
                          <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Email Address
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <motion.input
                              whileFocus={{
                                boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)",
                              }}
                              type="email"
                              id="email"
                              name="email"
                              value={updatedProfileData.email || ""}
                              onChange={handleChange}
                              required
                              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                              placeholder="Enter your email address"
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center">
                              <motion.button
                                type="button"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleEmailVerification}
                                disabled={isVerifying}
                                className="h-full px-4 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors flex items-center"
                              >
                                {isVerifying ? (
                                  <Loader className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Shield className="h-4 w-4" />
                                )}
                                <span className="ml-2 text-sm">Verify</span>
                              </motion.button>
                            </div>
                          </div>
                        </motion.div>

                        <AnimatePresence>
                          {previousEmail && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="mb-6"
                            >
                              <label
                                htmlFor="emailOtp"
                                className="block text-sm font-medium text-gray-700 mb-1"
                              >
                                Verification Code
                              </label>
                              <div className="relative">
                                <motion.input
                                  whileFocus={{
                                    boxShadow:
                                      "0 0 0 2px rgba(59, 130, 246, 0.5)",
                                  }}
                                  type="text"
                                  id="emailOtp"
                                  name="emailOtp"
                                  value={updatedProfileData.emailOtp || ""}
                                  onChange={handleChange}
                                  required
                                  className="block w-full pr-10 py-3 px-4 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                                  placeholder="Enter verification code"
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center">
                                  <motion.button
                                    type="button"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={confirmEmailVerification}
                                    disabled={
                                      isVerifying ||
                                      !updatedProfileData.emailOtp
                                    }
                                    className="h-full px-4 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors flex items-center"
                                  >
                                    {isVerifying ? (
                                      <Loader className="h-4 w-4 animate-spin" />
                                    ) : isEmailVerified ? (
                                      <CheckCircle className="h-4 w-4" />
                                    ) : (
                                      <span className="text-sm">Confirm</span>
                                    )}
                                  </motion.button>
                                </div>
                              </div>
                              <p className="mt-1 text-sm text-gray-500">
                                A verification code has been sent to your email
                                address.
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <motion.div variants={itemVariants} className="mb-6">
                          <label
                            htmlFor="phone_number"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Phone Number
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Phone className="h-5 w-5 text-gray-400" />
                            </div>
                            <motion.input
                              whileFocus={{
                                boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)",
                              }}
                              type="tel"
                              id="phone_number"
                              name="phone_number"
                              value={updatedProfileData.phone_number || ""}
                              onChange={handleChange}
                              required
                              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                              placeholder="Enter your phone number"
                            />
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>

                    <div className="flex gap-4 mt-8">
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        type="button"
                        onClick={() => window.location.reload()}
                        className="flex-1 flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        <X className="h-5 w-5 mr-2" />
                        Cancel
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        type="submit"
                        className="flex-1 flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Save className="h-5 w-5 mr-2" />
                        Save Changes
                      </motion.button>
                    </div>
                  </form>
                </motion.div>
              )}

              {activeTab === "settings" && (
                <motion.div
                  key="settings"
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, y: -20 }}
                  variants={contentVariants}
                  className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-8"
                >
                  <h2 className="text-xl font-bold text-gray-800 mb-6">
                    Account Settings
                  </h2>

                  <div className="space-y-6">
                    <motion.div
                      variants={itemVariants}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <h3 className="font-medium text-gray-800">
                          Email Notifications
                        </h3>
                        <p className="text-sm text-gray-500">
                          Receive email updates about your account
                        </p>
                      </div>
                      <div className="h-6 w-12 bg-blue-600 rounded-full p-1 cursor-pointer">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className="h-4 w-4 bg-white rounded-full transform translate-x-6"
                        />
                      </div>
                    </motion.div>

                    <motion.div
                      variants={itemVariants}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <h3 className="font-medium text-gray-800">
                          Two-Factor Authentication
                        </h3>
                        <p className="text-sm text-gray-500">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <div className="h-6 w-12 bg-gray-300 rounded-full p-1 cursor-pointer">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className="h-4 w-4 bg-white rounded-full"
                        />
                      </div>
                    </motion.div>

                    <motion.div
                      variants={itemVariants}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <h3 className="font-medium text-gray-800">
                          Privacy Settings
                        </h3>
                        <p className="text-sm text-gray-500">
                          Manage how your information is displayed
                        </p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 text-sm bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                      >
                        Manage
                      </motion.button>
                    </motion.div>

                    <motion.div
                      variants={itemVariants}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <h3 className="font-medium text-red-600">
                          Delete Account
                        </h3>
                        <p className="text-sm text-gray-500">
                          Permanently delete your account and all data
                        </p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 text-sm bg-white text-red-600 rounded-lg border border-red-300 hover:bg-red-50 transition-colors"
                      >
                        Delete
                      </motion.button>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default PassengerProfileContent;

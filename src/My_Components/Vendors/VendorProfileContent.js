// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import secureLocalStorage from "react-secure-storage";

// import axiosInstance from "../../API/axiosInstance";
// import toast from "react-hot-toast";
// import { ArrowLeft } from "lucide-react";
// import { IKContext, IKUpload } from "imagekitio-react";

// const VendorProfileContent = () => {
//   const navigate = useNavigate();
//   const uid = localStorage.getItem("@secure.n.uid");
//   const decryptedUID = secureLocalStorage.getItem("uid");
//   const [previousEmail, setPreviousEmail] = useState("");
//   const [profileIMG, setProfileIMG] = useState("");
//   const [updatedProfileIMG, setUpdatedProfileIMG] = useState("");
//   const [isUploading, setIsUploading] = useState(false);
//   const [isVerifying, setIsVerifying] = useState(false);
//   const [isEmailVerified, setIsEmailVerified] = useState(false);
//   const [profileData, setProfileData] = useState({
//     uid: decryptedUID,
//     name: "",
//     email: "",
//     emailOtp: "",
//     phone_number: "",
//   });

//   const handleEmailVerification = async () => {
//     try {
//       setIsVerifying(true);
//       const res = await axiosInstance.post(
//         `${process.env.REACT_APP_BASE_URL}/vendor/sendProfileUpdateEmailVerification`,
//         { decryptedUID }
//       );

//       setPreviousEmail(res.data.email);
//       if (res.data.success) {
//         toast.success("Verification code sent to your registered email");
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to send verification code");
//     } finally {
//       setIsVerifying(false);
//     }
//   };

//   const confirmEmailVerification = async () => {
//     try {
//       setIsVerifying(true);
//       const res = await axiosInstance.post(
//         `${process.env.REACT_APP_BASE_URL}/auth/confirmEmail`,
//         {
//           email: previousEmail,
//           emailOtp: profileData.emailOtp,
//         }
//       );

//       if (res.data.success) {
//         toast.success("Email verified successfully");
//         setIsEmailVerified(true);
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("Invalid verification code");
//     } finally {
//       setIsVerifying(false);
//     }
//   };

//   const authenticator = async () => {
//     try {
//       const response = await fetch(
//         `${process.env.REACT_APP_BASE_URL}/vendor/vendor_document_auth`
//       );

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(
//           `Request failed with status ${response.status}: ${errorText}`
//         );
//       }

//       const data = await response.json();
//       const { signature, expire, token } = data;
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
//           `${process.env.REACT_APP_BASE_URL}/vendor/fetchProfileData`,
//           {
//             decryptedUID,
//           }
//         );

//         if (response.status === 200) {
//           setProfileData(response.data);
//         }
//       } catch (error) {
//         console.error("Error fetching Profile Data:", error.message);
//       }
//     };

//     const fetchProfileIMG = async () => {
//       try {
//         const response = await axiosInstance.post(
//           `${process.env.REACT_APP_BASE_URL}/vendor/fetchProfileIMG`,
//           {
//             decryptedUID,
//           }
//         );

//         setUpdatedProfileIMG(response.data.link.profile_img);
//       } catch (error) {
//         console.error("Error fetching profile image:", error.message);
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
//           emailOtp: profileData.emailOtp,
//         }
//       );

//       if (!verifyEmailRes.data.success) {
//         toast.error("Email verification failed");
//         return;
//       }

//       const res = await axiosInstance.post(
//         `${process.env.REACT_APP_BASE_URL}/vendor/updateProfile`,
//         { profileData, decryptedUID }
//       );

//       if (res.status === 200) {
//         if (profileData.email !== previousEmail) {
//           toast.success(
//             "Profile updated. Please login again with your new email."
//           );
//           secureLocalStorage.clear();
//           localStorage.clear();
//           window.location.reload();
//           navigate("/");
//         } else {
//           toast.success("Profile updated successfully");
//           window.location.reload();
//         }
//       }
//     } catch (error) {
//       console.error("Error updating profile:", error);
//       toast.error("Failed to update profile");
//     }
//   };

//   const handleProfileImg = async (e) => {
//     e.preventDefault();
//     try {
//       const formData = {
//         profile_img: profileIMG,
//         uid: decryptedUID,
//       };

//       const res = await axiosInstance.post(
//         `${process.env.REACT_APP_BASE_URL}/vendor/uploadProfileImage`,
//         {
//           formData,
//           decryptedUID,
//         }
//       );

//       if (res.status === 200) {
//         toast.success("Profile image updated!");
//         window.location.reload();
//       }
//     } catch (error) {
//       console.error("Error: ", error);
//       toast.error("Failed to upload profile image");
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setProfileData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const BackToLogin = () => {
//     navigate("/");
//   };

//   if (!uid) {
//     return (
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="flex flex-col items-center justify-center min-h-screen p-4 text-center"
//       >
//         <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-xl max-w-md w-full">
//           <h2 className="text-2xl font-bold text-red-600 mb-4">Invalid URL</h2>
//           <p className="mb-6 text-gray-700">
//             Please provide a valid user ID to access your profile.
//           </p>
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={BackToLogin}
//             className="px-6 py-3 bg-blue-600 text-white rounded-full font-medium shadow-md hover:bg-blue-700 transition-colors"
//           >
//             <ArrowLeft className="inline mr-2 h-5 w-5" />
//             Back to Login
//           </motion.button>
//         </div>
//       </motion.div>
//     );
//   }

//   return (
//     <>
//       <div className="container-fluid">
//         <div className="profile-div mb-4">
//           <h2>Passenger's Profile</h2>
//           <hr />
//           <div className="row my-5">
//             <div className="col-lg-3 border-end border-dark border-2 text-center">
//               <img
//                 className="img-fluid profile-img"
//                 src={updatedProfileIMG}
//                 alt="Not available"
//               />
//               <form onSubmit={handleProfileImg}>
//                 <input type="hidden" name="uid" value={decryptedUID} />
//                 <div className="input-group me-5 py-3">
//                   <IKContext
//                     publicKey="public_ytabO1+xt+yMhICKtVeVGbWi/u8="
//                     urlEndpoint="https:ik.imagekit.io/TriptoServices"
//                     authenticator={authenticator}
//                   >
//                     <div className="input-group me-5 py-3">
//                       <IKUpload
//                         required
//                         className="form-control"
//                         fileName={`${decryptedUID}_vendorProfileIMG.jpg`}
//                         folder="Home/Tripto/passengers"
//                         tags={["tag1"]}
//                         useUniqueFileName={true}
//                         isPrivateFile={false}
//                         onUploadStart={() => {
//                           setIsUploading(true);
//                           toast.loading("Uploading image...");
//                         }}
//                         onSuccess={(r) => {
//                           setProfileIMG(r.url);
//                           setIsUploading(false);
//                           toast.dismiss();
//                           toast.success("Uploaded successfully!");
//                         }}
//                         onError={(e) => {
//                           console.error("Upload Error:", e);
//                           setIsUploading(false);
//                           toast.dismiss();
//                           toast.error("Upload failed!");
//                         }}
//                       />
//                     </div>
//                   </IKContext>
//                   <input
//                     type="submit"
//                     className="input-group-text blue-buttons"
//                     value="Edit"
//                   />
//                 </div>
//               </form>
//             </div>
//             <div className="col-lg-9 p-4 ">
//               <form onSubmit={handleProfileEdit}>
//                 <input type="hidden" name="uid" value={decryptedUID} />
//                 <div className="input-group mb-4">
//                   <span className="input-group-text">Name</span>
//                   <input
//                     name="name"
//                     type="text"
//                     className="form-control"
//                     required
//                     value={profileData.name || ""}
//                     onChange={handleChange}
//                   />
//                 </div>
//                 <div className="row">
//                   <div className="col-lg-6">
//                     <div className="input-group mb-4">
//                       <span className="input-group-text">Email</span>
//                       <input
//                         name="email"
//                         type="text"
//                         className="form-control"
//                         required
//                         value={profileData.email || ""}
//                         onChange={handleChange}
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
//                   <div className="col-lg-6">
//                     <div className="input-group">
//                       <input
//                         type="text"
//                         id="emailOtp"
//                         name="emailOtp"
//                         className="form-control"
//                         value={profileData.emailOtp || ""}
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
//                 </div>

//                 <div className="input-group mb-4">
//                   <span className="input-group-text">Phone Number</span>
//                   <input
//                     name="phone_number"
//                     type="text"
//                     className="form-control"
//                     required
//                     value={profileData.phone_number || ""}
//                     onChange={handleChange}
//                   />
//                 </div>
//                 <br />
//                 <input
//                   type="submit"
//                   value="Edit Profile"
//                   className="form-control blue-buttons mt-4"
//                 />
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default VendorProfileContent;
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import secureLocalStorage from "react-secure-storage";
import axiosInstance from "../../API/axiosInstance";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Camera,
  Edit,
  Mail,
  Phone,
  User,
  Wallet,
} from "lucide-react";
import { IKContext, IKUpload } from "imagekitio-react";

const VendorProfileContent = () => {
  const navigate = useNavigate();
  const uid = localStorage.getItem("@secure.n.uid");
  const decryptedUID = secureLocalStorage.getItem("uid");
  const [previousEmail, setPreviousEmail] = useState("");
  const [profileIMG, setProfileIMG] = useState("");
  const [updatedProfileIMG, setUpdatedProfileIMG] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
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
        `${process.env.REACT_APP_BASE_URL}/vendor/sendProfileUpdateEmailVerification`,
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
          emailOtp: profileData.emailOtp,
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
        `${process.env.REACT_APP_BASE_URL}/vendor/vendor_document_auth`
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
          `${process.env.REACT_APP_BASE_URL}/vendor/fetchProfileData`,
          {
            decryptedUID,
          }
        );

        if (response.status === 200) {
          setProfileData(response.data);
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

        setUpdatedProfileIMG(response.data.link.profile_img);
      } catch (error) {
        console.error("Error fetching profile image:", error.message);
      }
    };

    // Mock fetch wallet balance - in a real app, this would be an API call
    const fetchWalletBalance = async () => {
      // Simulate API call
      setWalletBalance(125.5);
    };

    fetchProfileData();
    fetchProfileIMG();
    fetchWalletBalance();
  }, [decryptedUID]);

  const handleProfileEdit = async (e) => {
    e.preventDefault();

    try {
      const verifyEmailRes = await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/auth/confirmEmail`,
        {
          email: previousEmail,
          emailOtp: profileData.emailOtp,
        }
      );

      if (!verifyEmailRes.data.success) {
        toast.error("Email verification failed");
        return;
      }

      const res = await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/vendor/updateProfile`,
        {
          profileData,
          decryptedUID,
        }
      );

      if (res.status === 200) {
        if (profileData.email !== previousEmail) {
          toast.success(
            "Profile updated. Please login again with your new email."
          );
          secureLocalStorage.clear();
          localStorage.clear();
          window.location.reload();
          navigate("/");
        } else {
          toast.success("Profile updated successfully");
          setIsEditing(false);
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
        `${process.env.REACT_APP_BASE_URL}/vendor/uploadProfileImage`,
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

    setProfileData((prevData) => ({
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

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-cyan-400 p-6">
          <h2 className="text-2xl font-bold text-white">Vendor Profile</h2>
          <p className="text-blue-50">Manage your account and wallet</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
          {/* Left Column - Profile Image */}
          <div className="md:col-span-1">
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  <img
                    src={
                      updatedProfileIMG ||
                      "/placeholder.svg?height=128&width=128"
                    }
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full shadow-md cursor-pointer"
                >
                  <Camera size={18} />
                </motion.div>
              </div>

              <h3 className="text-xl font-semibold mb-1">{profileData.name}</h3>
              <p className="text-gray-500 mb-4">{profileData.email}</p>

              {/* Wallet Card */}
              <motion.div
                whileHover={{ y: -5 }}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-4 text-white shadow-lg mb-6"
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">Wallet Balance</h4>
                  <Wallet size={20} />
                </div>
                <p className="text-2xl font-bold">
                  ₹{walletBalance.toFixed(2)}
                </p>
                <p className="text-xs text-blue-200 mt-2">
                  Last updated: {new Date().toLocaleDateString()}
                </p>
              </motion.div>

              {/* Image Upload Form */}
              <form onSubmit={handleProfileImg} className="w-full">
                <input type="hidden" name="uid" value={decryptedUID} />
                <div className="mb-4">
                  <IKContext
                    publicKey="public_ytabO1+xt+yMhICKtVeVGbWi/u8="
                    urlEndpoint="https:ik.imagekit.io/TriptoServices"
                    authenticator={authenticator}
                  >
                    <div className="flex flex-col space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Update Profile Picture
                      </label>
                      <IKUpload
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        fileName={`${decryptedUID}_vendorProfileIMG.jpg`}
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
                    </div>
                  </IKContext>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    disabled={isUploading}
                    className="w-full mt-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors duration-200"
                  >
                    {isUploading ? "Uploading..." : "Update Image"}
                  </motion.button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column - Profile Details */}
          <div className="md:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Personal Information</h3>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Edit size={16} />
                {isEditing ? "Cancel" : "Edit Profile"}
              </motion.button>
            </div>

            {isEditing ? (
              <form onSubmit={handleProfileEdit} className="space-y-4">
                <input type="hidden" name="uid" value={decryptedUID} />

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      name="name"
                      type="text"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      required
                      value={profileData.name || ""}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <div className="flex">
                      <div className="relative flex-grow">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                          name="email"
                          type="email"
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          required
                          value={profileData.email || ""}
                          onChange={handleChange}
                        />
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 transition-colors"
                        onClick={handleEmailVerification}
                        disabled={isVerifying}
                      >
                        {isVerifying ? "Sending..." : "Send OTP"}
                      </motion.button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Verification Code
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        id="emailOtp"
                        name="emailOtp"
                        className="flex-grow px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        value={profileData.emailOtp || ""}
                        placeholder="Enter OTP"
                        onChange={handleChange}
                        required
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 transition-colors"
                        onClick={confirmEmailVerification}
                        disabled={isVerifying}
                      >
                        {isVerifying ? "Verifying..." : "Verify"}
                      </motion.button>
                    </div>
                    {isEmailVerified && (
                      <p className="text-green-500 text-sm">
                        Email verified successfully!
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      name="phone_number"
                      type="text"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      required
                      value={profileData.phone_number || ""}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg shadow-md transition-all duration-200"
                >
                  Save Changes
                </motion.button>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Full Name</p>
                    <p className="font-medium">{profileData.name}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Email Address</p>
                    <p className="font-medium">{profileData.email}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Phone Number</p>
                    <p className="font-medium">{profileData.phone_number}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Account ID</p>
                    <p className="font-medium text-gray-700">{decryptedUID}</p>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">
                    Wallet Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-blue-600 mb-1">
                        Available Balance
                      </p>
                      <p className="font-bold text-xl">
                        ₹{walletBalance.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-blue-600 mb-1">
                        Pending Credits
                      </p>
                      <p className="font-medium">₹0.00</p>
                    </div>
                    <div>
                      <p className="text-sm text-blue-600 mb-1">
                        Last Transaction
                      </p>
                      <p className="font-medium">₹25.00 (Credit)</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => navigate("/wallet-history")}
                    className="flex-1 bg-white border border-blue-500 text-blue-500 font-medium py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    View Transaction History
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => navigate("/add-money")}
                    className="flex-1 bg-blue-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Add Money to Wallet
                  </motion.button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorProfileContent;

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
//vendor document verification : aadhar card,pan card , udyam aadhar , ghumasta license , profile photo , firm name , name , phone no, email
// import { Info } from "lucide-react";
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axiosInstance from "../../API/axiosInstance";
// import secureLocalStorage from "react-secure-storage";
// import { IKContext, IKUpload } from "imagekitio-react";
// import { motion } from "framer-motion";
// import toast from "react-hot-toast";

// const VendorProfileContent = () => {
//   const navigate = useNavigate();
//   const uid = localStorage.getItem("@secure.n.uid");
//   const decryptedUID = secureLocalStorage.getItem("uid");
//   const [previousEmail, setPreviousEmail] = useState("");
//   const [aadharFront, setAadharFront] = useState("");
//   const [aadharBack, setAadharBack] = useState("");
//   const [panCardFront, setPanCardFront] = useState("");
//   const [udyamAadhar, setUdyamAadhar] = useState("");
//   const [ghumastaLicense, setGhumastaLicense] = useState("");
//   const [profilePhoto, setProfilePhoto] = useState("");
//   const [firmName, setFirmName] = useState("");
//   const [profileData, setProfileData] = useState({
//     uid: decryptedUID,
//     name: "",
//     email: "",
//     emailOtp: "",
//     phone_number: "",
//   });
//   const [statusIndicators, setStatusIndicators] = useState({});
//   const [docsView, setDocsView] = useState({
//     aadharFront: "",
//     aadharBack: "",
//     panCardFront: "",
//     udyamAadhar: "",
//     ghumastaLicense: "",
//   });

//   useEffect(() => {
//     const fetchStatusIndicators = async () => {
//       try {
//         const response = await axiosInstance.post(
//           `${process.env.REACT_APP_BASE_URL}/vendor/fetchParticularDocStatus`,
//           { decryptedUID }
//         );

//         if (response.status === 200) {
//           setStatusIndicators(response.data);
//         }
//       } catch (error) {
//         console.error("Error fetching status indicators:", error.message);
//       }
//     };

//     const fetchProfileData = async () => {
//       try {
//         const response = await axiosInstance.post(
//           `${process.env.REACT_APP_BASE_URL}/vendor/fetchProfileData`,
//           { decryptedUID }
//         );

//         if (response.status === 200) {
//           setProfileData(response.data);
//         }
//       } catch (error) {
//         console.error("Error fetching status indicators:", error.message);
//       }
//     };

//     const fetchDocLinks = async () => {
//       try {
//         const response = await axiosInstance.post(
//           `${process.env.REACT_APP_BASE_URL}/vendor/fetchDocLinks`,
//           { decryptedUID }
//         );

//         setDocsView(response.data);
//         console.log(response.data);
//       } catch (error) {
//         console.error("Error fetching :", error.message);
//       }
//     };

//     fetchProfileData();
//     fetchStatusIndicators();
//     fetchDocLinks();
//   }, [decryptedUID]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setProfileData({ ...profileData, [name]: value });
//   };

//   const handleEmailVerification = async () => {
//     try {
//       const res = await axiosInstance.post(
//         `${process.env.REACT_APP_BASE_URL}/vendor/sendProfileUpdateEmailVerification`,
//         { decryptedUID }
//       );

//       setPreviousEmail(res.data.email);
//       if (res.data.success) {
//         alert(
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
//           emailOtp: profileData.emailOtp,
//         }
//       );

//       if (res.data.success) {
//         alert("Email verified successfully");
//       } else {
//         toast.error("Failed to verify Email Otp");
//       }
//     } catch (error) {
//       console.error(error);
//       alert("Invalid OTP");
//       toast.error("Invalid Otp");
//     }
//   };

//   const handleDocumentSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const formData = {
//         uid: decryptedUID,
//         aadharFront: aadharFront,
//         aadharBack: aadharBack,
//         panCardFront: panCardFront,
//         udyamAadhar: udyamAadhar,
//         ghumastaLicense: ghumastaLicense,
//         profilePhoto: profilePhoto,
//       };

//       if (formData === null) throw Error;

//       const response = await axiosInstance.post(
//         `${process.env.REACT_APP_BASE_URL}/vendor/document_upload`,
//         { formData, decryptedUID }
//       );

//       // Handle success
//       if (response.status === 200) {
//         console.log("Documents successfully uploaded!");
//         toast.success(
//           "Documents Successfully Uploaded! Please wait for the admin to verify your documents."
//         );
//         window.location.reload();
//       }
//     } catch (error) {
//       toast.error("An error occurred while uploading your documents.");
//       console.error("Error:", error);
//     }
//   };

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
//         toast.error("Email OTP verification failed");
//         return;
//       }

//       const res = await axiosInstance.post(
//         `${process.env.REACT_APP_BASE_URL}/vendor/updateProfile`,
//         { profileData, decryptedUID }
//       );

//       if (res.status === 200) {
//         if (profileData.email !== previousEmail) {
//           alert(
//             "Profile has been updated. Please login again with your updated email."
//           );
//           window.localStorage.removeItem("token");
//           window.localStorage.removeItem("user_type");
//           navigate("/");
//         } else {
//           alert("Profile is Updated Successfully");
//           window.location.reload();
//         }
//       } else {
//         console.error("Error updating profile");
//         alert("Error updating profile");
//       }
//     } catch (error) {
//       console.error("Error:", error);
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
//       console.log("Authentication parameters:", { signature, expire, token });
//       return { signature, expire, token };
//     } catch (error) {
//       console.error(`Authentication request failed: ${error.message}`);
//       throw new Error(`Authentication request failed: ${error.message}`);
//     }
//   };

//   const publicKey = "public_ytabO1+xt+yMhICKtVeVGbWi/u8=";
//   const urlEndpoint = "https://ik.imagekit.io/TriptoServices";

//   return (
//     <>
//       <form onSubmit={handleProfileEdit}>
//         <input type="hidden" name="uid" value={decryptedUID} />

//         <label htmlFor="name" className="block font-medium my-2">
//           Name
//         </label>
//         <input
//           name="name"
//           type="text"
//           className="border border-gray-300 rounded-lg w-full p-2"
//           onChange={handleChange}
//           value={profileData.name}
//         />
//         <label htmlFor="email" className="block font-medium my-2">
//           Email
//         </label>
//         <div className="flex items-center space-x-2">
//           <input
//             name="email"
//             type="text"
//             className="border border-gray-300 rounded-lg p-2 flex-grow"
//             required
//             value={profileData.email || ""}
//             onChange={handleChange}
//           />
//           <button
//             className="btn bg-gradient-to-r from-[#0bbfe0] to-[#077286] text-white"
//             type="button"
//             onClick={handleEmailVerification}
//           >
//             Send OTP
//           </button>
//         </div>

//         <label htmlFor="emailOtp" className="block font-medium my-2">
//           Email OTP
//         </label>
//         <div className="flex items-center space-x-2">
//           <input
//             type="text"
//             id="emailOtp"
//             name="emailOtp"
//             className="border border-gray-300 rounded-lg p-2 flex-grow"
//             value={profileData.emailOtp || ""}
//             placeholder="Enter your OTP here"
//             onChange={handleChange}
//             required
//           />
//           <button
//             className="btn btn bg-gradient-to-r from-[#0bbfe0] to-[#077286] text-white"
//             type="button"
//             onClick={confirmEmailVerification}
//           >
//             Verify OTP
//           </button>
//         </div>

//         <label htmlFor="phone" className="block font-medium my-2">
//           Phone Number
//         </label>
//         <input
//           name="phone_number"
//           type="text"
//           className="border border-gray-300 rounded-lg w-full p-2"
//           required
//           value={profileData.phone_number || ""}
//           onChange={handleChange}
//         />

//         <input
//           type="submit"
//           value="Edit Profile"
//           className="form-control bg-gradient-to-r from-[#0bbfe0] to-[#077286] text-white my-3"
//         />
//       </form>
//       <form onSubmit={handleDocumentSubmit}>
//         {statusIndicators.aadharFrontStatus === 1 ? (
//           ""
//         ) : (
//           <div className="py-2 px-4">
//             <label className="block text-md  mb-2" htmlFor="aadharFront">
//               Aadhar Card Front:
//             </label>

//             <div className="flex items-center justify-between mb-2">
//               <IKContext
//                 publicKey={publicKey}
//                 urlEndpoint={urlEndpoint}
//                 authenticator={authenticator}
//               >
//                 <IKUpload
//                   required
//                   className="form-control border border-gray-300 rounded-lg p-2 flex-1 mr-2"
//                   fileName={`${uid}_aadharFront.jpg`}
//                   folder="Home/Tripto/vendors"
//                   tags={["AadharFront"]}
//                   useUniqueFileName={false}
//                   isPrivateFile={false}
//                   onSuccess={(r) => {
//                     setAadharFront(r.url);
//                     toast.success("Uploaded");
//                   }}
//                   onError={(e) => console.log(e)}
//                 />
//               </IKContext>
//               {docsView.aadharFront ? (
//                 <button className="bg-blue-500 text-white rounded-lg btn btn-sm hover:bg-blue-600 mr-2">
//                   <a
//                     className="text-decoration-none"
//                     href={docsView.aadharFront}
//                     target="_blank"
//                     rel="noreferrer"
//                   >
//                     View Doc
//                   </a>
//                 </button>
//               ) : null}

//               <span
//                 className={`text-sm font-semibold px-3 py-1 rounded-full inline-block ${
//                   statusIndicators.aadharFrontStatus === 0
//                     ? "bg-yellow-500 text-white"
//                     : statusIndicators.aadharFrontStatus === 1
//                     ? "bg-green-500 text-white"
//                     : statusIndicators.aadharFrontStatus === 2
//                     ? "bg-red-500 text-white"
//                     : "bg-yellow-500 text-white"
//                 }`}
//               >
//                 {statusIndicators.aadharFrontStatus === 0
//                   ? "Pending"
//                   : statusIndicators.aadharFrontStatus === 1
//                   ? "Verified"
//                   : statusIndicators.aadharFrontStatus === 2
//                   ? "Rejected"
//                   : "Pending"}
//               </span>

//               {statusIndicators.aadharFrontStatus === 2 &&
//                 statusIndicators.aadharFrontRejectReason && (
//                   <div className="relative ml-2">
//                     <Info className="text-red-500 cursor-pointer" />

//                     <motion.div
//                       initial={{ opacity: 0, y: -10 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       exit={{ opacity: 0, y: -10 }}
//                       className="absolute right-0 mt-2 w-48 p-2 bg-white border border-gray-300 rounded shadow-lg z-10"
//                       style={{
//                         transform: "translateX(-100%)",
//                       }}
//                     >
//                       {statusIndicators.aadharFrontRejectReason}
//                     </motion.div>
//                   </div>
//                 )}
//             </div>
//           </div>
//         )}
//         {statusIndicators.aadharBackStatus === 1 ? (
//           ""
//         ) : (
//           <div className="py-2 px-4">
//             <label className="block text-md  mb-2" htmlFor="aadharBack">
//               Aadhar Card Back:
//             </label>

//             <div className="flex items-center justify-between mb-2">
//               <IKContext
//                 publicKey={publicKey}
//                 urlEndpoint={urlEndpoint}
//                 authenticator={authenticator}
//               >
//                 <IKUpload
//                   required
//                   className="form-control border border-gray-300 rounded-lg p-2 flex-1 mr-2"
//                   fileName={`${uid}_aadharBack.jpg`}
//                   folder="Home/Tripto/vendors"
//                   tags={["AadharBack"]}
//                   useUniqueFileName={false}
//                   isPrivateFile={false}
//                   onSuccess={(r) => {
//                     setAadharBack(r.url);
//                     alert("Uploaded");
//                   }}
//                   onError={(e) => console.log(e)}
//                 />
//               </IKContext>

//               {docsView.aadharBack ? (
//                 <button className="bg-blue-500 text-white rounded-lg btn btn-sm hover:bg-blue-600 mr-2">
//                   <a
//                     className="text-decoration-none"
//                     href={docsView.aadharBack}
//                     target="_blank"
//                     rel="noreferrer"
//                   >
//                     View Doc
//                   </a>
//                 </button>
//               ) : null}

//               <span
//                 className={`text-sm font-semibold px-3 py-1 rounded-full inline-block ${
//                   statusIndicators.aadharBackStatus === 0
//                     ? "bg-yellow-500 text-white"
//                     : statusIndicators.aadharBackStatus === 1
//                     ? "bg-green-500 text-white"
//                     : statusIndicators.aadharBackStatus === 2
//                     ? "bg-red-500 text-white"
//                     : "bg-yellow-500 text-white"
//                 }`}
//               >
//                 {statusIndicators.aadharBackStatus === 0
//                   ? "Pending"
//                   : statusIndicators.aadharBackStatus === 1
//                   ? "Verified"
//                   : statusIndicators.aadharBackStatus === 2
//                   ? "Rejected"
//                   : "Pending"}
//               </span>

//               {statusIndicators.aadharBackStatus === 2 &&
//                 statusIndicators.aadharBackRejectReason && (
//                   <div className="relative ml-2">
//                     <Info className="text-red-500 cursor-pointer" />

//                     <motion.div
//                       initial={{ opacity: 0, y: -10 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       exit={{ opacity: 0, y: -10 }}
//                       className="absolute right-0 mt-2 w-48 p-2 bg-white border border-gray-300 rounded shadow-lg z-10"
//                       style={{
//                         transform: "translateX(-100%)",
//                       }}
//                     >
//                       {statusIndicators.aadharBackRejectReason}
//                     </motion.div>
//                   </div>
//                 )}
//             </div>
//           </div>
//         )}

//         {statusIndicators.panCardFrontStatus === 1 ? (
//           ""
//         ) : (
//           <div className="py-2 px-4">
//             <label className="block text-md  mb-2" htmlFor="panCardFront">
//               Pan Card Front:
//             </label>

//             <div className="flex items-center justify-between mb-2">
//               <IKContext
//                 publicKey={publicKey}
//                 urlEndpoint={urlEndpoint}
//                 authenticator={authenticator}
//               >
//                 <IKUpload
//                   required
//                   className="form-control border border-gray-300 rounded-lg p-2 flex-1 mr-2"
//                   fileName={`${uid}_panCardFront.jpg`}
//                   folder="Home/Tripto/vendors"
//                   tags={["panCardFront"]}
//                   useUniqueFileName={false}
//                   isPrivateFile={false}
//                   onSuccess={(r) => {
//                     setPanCardFront(r.url);
//                     alert("Uploaded");
//                   }}
//                   onError={(e) => console.log(e)}
//                 />
//               </IKContext>
//               {docsView.panCardFront ? (
//                 <button className="bg-blue-500 text-white rounded-lg btn btn-sm hover:bg-blue-600 mr-2">
//                   <a
//                     className="text-decoration-none"
//                     href={docsView.panCardFront}
//                     target="_blank"
//                     rel="noreferrer"
//                   >
//                     View Doc
//                   </a>
//                 </button>
//               ) : null}

//               <span
//                 className={`text-sm font-semibold px-3 py-1 rounded-full inline-block ${
//                   statusIndicators.panCardFrontStatus === 0
//                     ? "bg-yellow-500 text-white"
//                     : statusIndicators.panCardFrontStatus === 1
//                     ? "bg-green-500 text-white"
//                     : statusIndicators.panCardFrontStatus === 2
//                     ? "bg-red-500 text-white"
//                     : "bg-yellow-500 text-white"
//                 }`}
//               >
//                 {statusIndicators.panCardFrontStatus === 0
//                   ? "Pending"
//                   : statusIndicators.panCardFrontStatus === 1
//                   ? "Verified"
//                   : statusIndicators.panCardFrontStatus === 2
//                   ? "Rejected"
//                   : "Pending"}
//               </span>

//               {statusIndicators.panCardFrontStatus === 2 &&
//                 statusIndicators.panCardFrontRejectReason && (
//                   <div className="relative ml-2">
//                     <Info className="text-red-500 cursor-pointer" />

//                     <motion.div
//                       initial={{ opacity: 0, y: -10 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       exit={{ opacity: 0, y: -10 }}
//                       className="absolute right-0 mt-2 w-48 p-2 bg-white border border-gray-300 rounded shadow-lg z-10"
//                       style={{
//                         transform: "translateX(-100%)",
//                       }}
//                     >
//                       {statusIndicators.panCardFrontRejectReason}
//                     </motion.div>
//                   </div>
//                 )}
//             </div>
//           </div>
//         )}

//         {statusIndicators.udyamAadharStatus === 1 ? (
//           ""
//         ) : (
//           <div className="py-2 px-4">
//             <label className="block text-md  mb-2" htmlFor="aadharBack">
//               Udyam Aadhar:
//             </label>

//             <div className="flex items-center justify-between mb-2">
//               <IKContext
//                 publicKey={publicKey}
//                 urlEndpoint={urlEndpoint}
//                 authenticator={authenticator}
//               >
//                 <IKUpload
//                   required
//                   className="form-control border border-gray-300 rounded-lg p-2 flex-1 mr-2"
//                   fileName={`${uid}_udyamAadhar.jpg`}
//                   folder="Home/Tripto/vendors"
//                   tags={["UdyamAadhar"]}
//                   useUniqueFileName={false}
//                   isPrivateFile={false}
//                   onSuccess={(r) => {
//                     setUdyamAadhar(r.url);
//                     alert("Uploaded");
//                   }}
//                   onError={(e) => console.log(e)}
//                 />
//               </IKContext>

//               {docsView.udyamAadhar ? (
//                 <button className="bg-blue-500 text-white rounded-lg btn btn-sm hover:bg-blue-600 mr-2">
//                   <a
//                     className="text-decoration-none"
//                     href={docsView.udyamAadhar}
//                     target="_blank"
//                     rel="noreferrer"
//                   >
//                     View Doc
//                   </a>
//                 </button>
//               ) : null}

//               <span
//                 className={`text-sm font-semibold px-3 py-1 rounded-full inline-block ${
//                   statusIndicators.udyamAadharStatus === 0
//                     ? "bg-yellow-500 text-white"
//                     : statusIndicators.udyamAadharStatus === 1
//                     ? "bg-green-500 text-white"
//                     : statusIndicators.udyamAadharStatus === 2
//                     ? "bg-red-500 text-white"
//                     : "bg-yellow-500 text-white"
//                 }`}
//               >
//                 {statusIndicators.udyamAadharStatus === 0
//                   ? "Pending"
//                   : statusIndicators.udyamAadharStatus === 1
//                   ? "Verified"
//                   : statusIndicators.udyamAadharStatus === 2
//                   ? "Rejected"
//                   : "Pending"}
//               </span>

//               {statusIndicators.udyamAadharStatus === 2 &&
//                 statusIndicators.udyamAadharRejectReason && (
//                   <div className="relative ml-2">
//                     <Info className="text-red-500 cursor-pointer" />

//                     <motion.div
//                       initial={{ opacity: 0, y: -10 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       exit={{ opacity: 0, y: -10 }}
//                       className="absolute right-0 mt-2 w-48 p-2 bg-white border border-gray-300 rounded shadow-lg z-10"
//                       style={{
//                         transform: "translateX(-100%)",
//                       }}
//                     >
//                       {statusIndicators.udyamAadharRejectReason}
//                     </motion.div>
//                   </div>
//                 )}
//             </div>
//           </div>
//         )}

//         {statusIndicators.ghumastaLicenseStatus === 1 ? (
//           ""
//         ) : (
//           <div className="py-2 px-4">
//             <label className="block text-md  mb-2" htmlFor="panCardFront">
//               Ghumasta License:
//             </label>

//             <div className="flex items-center justify-between mb-2">
//               <IKContext
//                 publicKey={publicKey}
//                 urlEndpoint={urlEndpoint}
//                 authenticator={authenticator}
//               >
//                 <IKUpload
//                   required
//                   className="form-control border border-gray-300 rounded-lg p-2 flex-1 mr-2"
//                   fileName={`${uid}_ghumastaLicense.jpg`}
//                   folder="Home/Tripto/vendors"
//                   tags={["ghumastaLicense"]}
//                   useUniqueFileName={false}
//                   isPrivateFile={false}
//                   onSuccess={(r) => {
//                     setGhumastaLicense(r.url);
//                     alert("Uploaded");
//                   }}
//                   onError={(e) => console.log(e)}
//                 />
//               </IKContext>
//               {docsView.ghumastaLicense ? (
//                 <button className="bg-blue-500 text-white rounded-lg btn btn-sm hover:bg-blue-600 mr-2">
//                   <a
//                     className="text-decoration-none"
//                     href={docsView.ghumastaLicense}
//                     target="_blank"
//                     rel="noreferrer"
//                   >
//                     View Doc
//                   </a>
//                 </button>
//               ) : null}

//               <span
//                 className={`text-sm font-semibold px-3 py-1 rounded-full inline-block ${
//                   statusIndicators.ghumastaLicenseStatus === 0
//                     ? "bg-yellow-500 text-white"
//                     : statusIndicators.ghumastaLicenseStatus === 1
//                     ? "bg-green-500 text-white"
//                     : statusIndicators.ghumastaLicenseStatus === 2
//                     ? "bg-red-500 text-white"
//                     : "bg-yellow-500 text-white"
//                 }`}
//               >
//                 {statusIndicators.ghumastaLicenseStatus === 0
//                   ? "Pending"
//                   : statusIndicators.ghumastaLicenseStatus === 1
//                   ? "Verified"
//                   : statusIndicators.ghumastaLicenseStatus === 2
//                   ? "Rejected"
//                   : "Pending"}
//               </span>

//               {statusIndicators.ghumastaLicenseStatus === 2 &&
//                 statusIndicators.ghumastaLicenseRejectReason && (
//                   <div className="relative ml-2">
//                     <Info className="text-red-500 cursor-pointer" />

//                     <motion.div
//                       initial={{ opacity: 0, y: -10 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       exit={{ opacity: 0, y: -10 }}
//                       className="absolute right-0 mt-2 w-48 p-2 bg-white border border-gray-300 rounded shadow-lg z-10"
//                       style={{
//                         transform: "translateX(-100%)",
//                       }}
//                     >
//                       {statusIndicators.ghumastaLicenseRejectReason}
//                     </motion.div>
//                   </div>
//                 )}
//             </div>
//           </div>
//         )}

//         {statusIndicators.profilePhoto === 1 ? (
//           ""
//         ) : (
//           <div className="py-2 px-4">
//             <label className="block text-md  mb-2" htmlFor="profilePhoto">
//               Profile Photo:
//             </label>

//             <div className="flex items-center justify-between mb-2">
//               <IKContext
//                 publicKey={publicKey}
//                 urlEndpoint={urlEndpoint}
//                 authenticator={authenticator}
//               >
//                 <IKUpload
//                   required
//                   className="form-control border border-gray-300 rounded-lg p-2 flex-1 mr-2"
//                   fileName={`${uid}_profilePhoto.jpg`}
//                   folder="Home/Tripto/vendors"
//                   tags={["profilePhoto"]}
//                   useUniqueFileName={false}
//                   isPrivateFile={false}
//                   onSuccess={(r) => {
//                     setProfilePhoto(r.url);
//                     alert("Uploaded");
//                   }}
//                   onError={(e) => console.log(e)}
//                 />
//               </IKContext>
//               {docsView.profilePhoto ? (
//                 <button className="bg-blue-500 text-white rounded-lg btn btn-sm hover:bg-blue-600 mr-2">
//                   <a
//                     className="text-decoration-none"
//                     href={docsView.profilePhoto}
//                     target="_blank"
//                     rel="noreferrer"
//                   >
//                     View Doc
//                   </a>
//                 </button>
//               ) : null}

//               <span
//                 className={`text-sm font-semibold px-3 py-1 rounded-full inline-block ${
//                   statusIndicators.profilePhotoStatus === 0
//                     ? "bg-yellow-500 text-white"
//                     : statusIndicators.profilePhotoStatus === 1
//                     ? "bg-green-500 text-white"
//                     : statusIndicators.profilePhotoStatus === 2
//                     ? "bg-red-500 text-white"
//                     : "bg-yellow-500 text-white"
//                 }`}
//               >
//                 {statusIndicators.profilePhotoStatus === 0
//                   ? "Pending"
//                   : statusIndicators.profilePhotoStatus === 1
//                   ? "Verified"
//                   : statusIndicators.profilePhotoStatus === 2
//                   ? "Rejected"
//                   : "Pending"}
//               </span>

//               {statusIndicators.profilePhotoStatus === 2 &&
//                 statusIndicators.profilePhotoRejectReason && (
//                   <div className="relative ml-2">
//                     <Info className="text-red-500 cursor-pointer" />

//                     <motion.div
//                       initial={{ opacity: 0, y: -10 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       exit={{ opacity: 0, y: -10 }}
//                       className="absolute right-0 mt-2 w-48 p-2 bg-white border border-gray-300 rounded shadow-lg z-10"
//                       style={{
//                         transform: "translateX(-100%)",
//                       }}
//                     >
//                       {statusIndicators.profilePhotoRejectReason}
//                     </motion.div>
//                   </div>
//                 )}
//             </div>
//           </div>
//         )}
//         <label htmlFor="firmName">
//           Firm Name
//           <input
//             name="firmName"
//             type="text"
//             className="border border-gray-300 rounded-lg w-full p-2"
//             onChange={(e) => {
//               setFirmName(e.target.value);
//             }}
//             value={firmName}
//           />
//         </label>
//         {statusIndicators.all_documents_status === 1 ? (
//           ""
//         ) : (
//           <input
//             type="submit"
//             value="Submit"
//             className="form-control bg-gradient-to-r from-[#0bbfe0] to-[#077286] text-white my-2"
//           />
//         )}
//       </form>
//     </>
//   );
// };

// export default VendorProfileContent;
"use client";

import {
  Info,
  Upload,
  CheckCircle,
  AlertCircle,
  User,
  FileText,
  Camera,
  Mail,
  Phone,
  Send,
  CheckSquare,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../API/axiosInstance";
import secureLocalStorage from "react-secure-storage";
import { IKContext, IKUpload } from "imagekitio-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const VendorProfileContent = () => {
  const navigate = useNavigate();
  const uid = localStorage.getItem("@secure.n.uid");
  const decryptedUID = secureLocalStorage.getItem("uid");
  const [previousEmail, setPreviousEmail] = useState("");
  const [aadharFront, setAadharFront] = useState("");
  const [aadharBack, setAadharBack] = useState("");
  const [panCardFront, setPanCardFront] = useState("");
  const [udyamAadhar, setUdyamAadhar] = useState("");
  const [ghumastaLicense, setGhumastaLicense] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");
  const [firmName, setFirmName] = useState("");
  const [profileData, setProfileData] = useState({
    uid: decryptedUID,
    name: "",
    email: "",
    emailOtp: "",
    phone_number: "",
  });
  const [statusIndicators, setStatusIndicators] = useState({});
  const [docsView, setDocsView] = useState({
    aadharFront: "",
    aadharBack: "",
    panCardFront: "",
    udyamAadhar: "",
    ghumastaLicense: "",
    profilePhoto: "",
  });
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    const fetchStatusIndicators = async () => {
      try {
        const response = await axiosInstance.post(
          `${process.env.REACT_APP_BASE_URL}/vendor/fetchParticularDocStatus`,
          { decryptedUID }
        );

        if (response.status === 200) {
          setStatusIndicators(response.data);
        }
      } catch (error) {
        console.error("Error fetching status indicators:", error.message);
      }
    };

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
        console.error("Error fetching profile data:", error.message);
      }
    };

    const fetchDocLinks = async () => {
      try {
        const response = await axiosInstance.post(
          `${process.env.REACT_APP_BASE_URL}/vendor/fetchDocLinks`,
          {
            decryptedUID,
          }
        );

        setDocsView(response.data);
      } catch (error) {
        console.error("Error fetching document links:", error.message);
      }
    };

    fetchProfileData();
    fetchStatusIndicators();
    fetchDocLinks();
  }, [decryptedUID]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handleEmailVerification = async () => {
    try {
      const res = await axiosInstance.post(
        ` ${process.env.REACT_APP_BASE_URL}/vendor/sendProfileUpdateEmailVerification`,
        { decryptedUID }
      );

      setPreviousEmail(res.data.email);
      if (res.data.success) {
        toast.success(
          "Email verification code sent successfully to your registered email"
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while sending email verification code");
    }
  };

  const confirmEmailVerification = async () => {
    try {
      const res = await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/auth/confirmEmail`,
        {
          email: previousEmail,
          emailOtp: profileData.emailOtp,
        }
      );

      if (res.data.success) {
        toast.success("Email verified successfully");
      } else {
        toast.error("Failed to verify Email OTP");
      }
    } catch (error) {
      console.error(error);
      toast.error("Invalid OTP");
    }
  };

  const handleDocumentSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = {
        uid: decryptedUID,
        aadharFront: aadharFront,
        aadharBack: aadharBack,
        panCardFront: panCardFront,
        udyamAadhar: udyamAadhar,
        ghumastaLicense: ghumastaLicense,
        profilePhoto: profilePhoto,
        firmName: firmName,
      };

      if (formData === null) throw Error;

      const response = await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/vendor/document_upload`,
        {
          formData,
          decryptedUID,
        }
      );

      if (response.status === 200) {
        toast.success(
          "Documents Successfully Uploaded! Please wait for the admin to verify your documents."
        );
        window.location.reload();
      }
    } catch (error) {
      toast.error("An error occurred while uploading your documents.");
      console.error("Error:", error);
    }
  };

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
        toast.error("Email OTP verification failed");
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
            "Profile has been updated. Please login again with your updated email."
          );
          window.localStorage.removeItem("token");
          window.localStorage.removeItem("user_type");
          navigate("/");
        } else {
          toast.success("Profile is Updated Successfully");
          window.location.reload();
        }
      } else {
        console.error("Error updating profile");
        toast.error("Error updating profile");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while updating your profile");
    }
  };

  const authenticator = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/vendor/drivers_document_auth`
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

  const publicKey = "public_ytabO1+xt+yMhICKtVeVGbWi/u8=";
  const urlEndpoint = "https://ik.imagekit.io/TriptoServices";

  const getStatusBadge = (status, rejectReason) => {
    let badgeClass =
      "text-sm font-medium px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 ";
    let statusText = "Pending";
    let icon = <AlertCircle className="w-4 h-4" />;

    if (status === 0) {
      badgeClass += "bg-amber-100 text-amber-700 border border-amber-200";
      statusText = "Pending";
      icon = <AlertCircle className="w-4 h-4" />;
    } else if (status === 1) {
      badgeClass += "bg-emerald-100 text-emerald-700 border border-emerald-200";
      statusText = "Verified";
      icon = <CheckCircle className="w-4 h-4" />;
    } else if (status === 2) {
      badgeClass += "bg-rose-100 text-rose-700 border border-rose-200";
      statusText = "Rejected";
      icon = <AlertCircle className="w-4 h-4" />;
    }

    return (
      <div className="flex items-center gap-2">
        <span className={badgeClass}>
          {icon}
          {statusText}
        </span>

        {status === 2 && rejectReason && (
          <div className="relative group">
            <Info className="text-rose-500 cursor-pointer w-5 h-5" />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 0, y: -10 }}
              whileHover={{ opacity: 1, y: 0 }}
              className="absolute right-0 mt-2 w-64 p-3 bg-white border border-gray-200 rounded-lg shadow-lg z-10 text-sm"
              style={{ transform: "translateX(-90%)" }}
            >
              <div className="font-medium text-gray-800 mb-1">
                Rejection Reason:
              </div>
              <div className="text-gray-600">{rejectReason}</div>
            </motion.div>
          </div>
        )}
      </div>
    );
  };

  const renderDocumentUpload = (
    label,
    fileName,
    setFunction,
    status,
    rejectReason,
    viewUrl
  ) => {
    if (status === 1) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-4"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <FileText className="text-[#00B7C2] w-5 h-5" />
            <h3 className="text-lg font-medium text-gray-800">{label}</h3>
          </div>

          {getStatusBadge(status, rejectReason)}
        </div>

        <div className="mt-4 flex flex-col md:flex-row items-start gap-4">
          <div className="w-full md:w-3/4">
            <IKContext
              publicKey={publicKey}
              urlEndpoint={urlEndpoint}
              authenticator={authenticator}
            >
              <IKUpload
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-[#e6f7f8] file:text-[#00B7C2] hover:file:bg-[#d0f0f2] cursor-pointer"
                fileName={`${uid}_${fileName}.jpg`}
                folder="Home/Tripto/vendors"
                tags={[fileName]}
                useUniqueFileName={false}
                isPrivateFile={false}
                onSuccess={(r) => {
                  setFunction(r.url);
                  toast.success(`${label} uploaded successfully`);
                }}
                onError={(e) => console.log(e)}
              />
            </IKContext>
          </div>

          {viewUrl && (
            <a
              href={viewUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#e6f7f8] text-[#008999] rounded-lg hover:bg-[#d0f0f2] transition-colors text-sm font-medium"
            >
              <FileText className="w-4 h-4" />
              View Document
            </a>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-gradient-to-r from-[#00B7C2] to-[#008999] rounded-2xl p-6 mb-8 text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold mb-2">Vendor Profile</h1>
            <p className="text-[#e6f7f8]">
              Manage your profile information and documents
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-3">
            {docsView.profilePhoto ? (
              <img
                src={docsView.profilePhoto || "/placeholder.svg"}
                alt="Profile"
                className="w-16 h-16 rounded-full border-2 border-white object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-[#00a6b0] flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
            )}
            <div>
              <h2 className="text-xl font-semibold">
                {profileData.name || "Vendor"}
              </h2>
              <p className="text-[#e6f7f8]">{firmName || "Your Business"}</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="mb-8">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-6 py-3 font-medium text-sm ${
              activeTab === "profile"
                ? "border-b-2 border-[#00B7C2] text-[#00B7C2]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Profile Information
          </button>
          <button
            onClick={() => setActiveTab("documents")}
            className={`px-6 py-3 font-medium text-sm ${
              activeTab === "documents"
                ? "border-b-2 border-[#00B7C2] text-[#00B7C2]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Documents
          </button>
        </div>
      </div>

      {activeTab === "profile" && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <h2 className="text-xl font-semibold mb-6 text-gray-800">
            Personal Information
          </h2>

          <form onSubmit={handleProfileEdit} className="space-y-6">
            <input type="hidden" name="uid" value={decryptedUID} />

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    name="name"
                    type="text"
                    className="pl-10 w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#00B7C2] focus:border-[#00B7C2] outline-none transition-all"
                    onChange={handleChange}
                    value={profileData.name || ""}
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="firmName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Firm Name
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    name="firmName"
                    type="text"
                    className="pl-10 w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#00B7C2] focus:border-[#00B7C2] outline-none transition-all"
                    onChange={(e) => setFirmName(e.target.value)}
                    value={firmName || ""}
                    placeholder="Enter your business name"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-grow">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    name="email"
                    type="email"
                    className="pl-10 w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#00B7C2] focus:border-[#00B7C2] outline-none transition-all"
                    required
                    value={profileData.email || ""}
                    onChange={handleChange}
                    placeholder="Enter your email address"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleEmailVerification}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#00B7C2] text-white rounded-lg hover:bg-[#008999] transition-colors font-medium"
                >
                  <Send className="w-4 h-4" />
                  Send OTP
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="emailOtp"
                className="block text-sm font-medium text-gray-700"
              >
                Email Verification Code
              </label>
              <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-grow">
                  <CheckSquare className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    id="emailOtp"
                    name="emailOtp"
                    className="pl-10 w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#00B7C2] focus:border-[#00B7C2] outline-none transition-all"
                    value={profileData.emailOtp || ""}
                    placeholder="Enter verification code"
                    onChange={handleChange}
                    required
                  />
                </div>
                <button
                  type="button"
                  onClick={confirmEmailVerification}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#00B7C2] text-white rounded-lg hover:bg-[#008999] transition-colors font-medium"
                >
                  <CheckCircle className="w-4 h-4" />
                  Verify OTP
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  name="phone_number"
                  type="text"
                  className="pl-10 w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#00B7C2] focus:border-[#00B7C2] outline-none transition-all"
                  required
                  value={profileData.phone_number || ""}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-[#00B7C2] to-[#008999] text-white rounded-lg hover:from-[#00a6b0] hover:to-[#007a89] transition-all font-medium flex items-center justify-center gap-2"
              >
                <User className="w-5 h-5" />
                Update Profile
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {activeTab === "documents" && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
            <h2 className="text-xl font-semibold mb-2 text-gray-800">
              Document Verification
            </h2>
            <p className="text-gray-500 mb-4">
              Upload your documents for verification
            </p>

            <div className="flex items-center gap-3 mb-6">
              <div
                className={`w-3 h-3 rounded-full ${
                  statusIndicators.all_documents_status === 1
                    ? "bg-green-500"
                    : "bg-amber-500"
                }`}
              ></div>
              <span className="text-sm font-medium text-gray-700">
                {statusIndicators.all_documents_status === 1
                  ? "All documents verified"
                  : "Verification in progress"}
              </span>
            </div>

            <form onSubmit={handleDocumentSubmit} className="space-y-4">
              {statusIndicators.profilePhotoStatus !== 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-4"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Camera className="text-[#00B7C2] w-5 h-5" />
                      <h3 className="text-lg font-medium text-gray-800">
                        Profile Photo
                      </h3>
                    </div>

                    {getStatusBadge(
                      statusIndicators.profilePhotoStatus,
                      statusIndicators.profilePhotoRejectReason
                    )}
                  </div>

                  <div className="mt-4 flex flex-col md:flex-row items-start gap-4">
                    <div className="w-full md:w-3/4">
                      <IKContext
                        publicKey={publicKey}
                        urlEndpoint={urlEndpoint}
                        authenticator={authenticator}
                      >
                        <IKUpload
                          required
                          className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-[#e6f7f8] file:text-[#00B7C2] hover:file:bg-[#d0f0f2] cursor-pointer"
                          fileName={`${uid}_profilePhoto.jpg`}
                          folder="Home/Tripto/vendors"
                          tags={["profilePhoto"]}
                          useUniqueFileName={false}
                          isPrivateFile={false}
                          onSuccess={(r) => {
                            setProfilePhoto(r.url);
                            toast.success(
                              "Profile photo uploaded successfully"
                            );
                          }}
                          onError={(e) => console.log(e)}
                        />
                      </IKContext>
                    </div>

                    {docsView.profilePhoto && (
                      <a
                        href={docsView.profilePhoto}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#e6f7f8] text-[#008999] rounded-lg hover:bg-[#d0f0f2] transition-colors text-sm font-medium"
                      >
                        <FileText className="w-4 h-4" />
                        View Photo
                      </a>
                    )}
                  </div>
                </motion.div>
              )}

              {renderDocumentUpload(
                "Aadhar Card Front",
                "aadharFront",
                setAadharFront,
                statusIndicators.aadharFrontStatus,
                statusIndicators.aadharFrontRejectReason,
                docsView.aadharFront
              )}

              {renderDocumentUpload(
                "Aadhar Card Back",
                "aadharBack",
                setAadharBack,
                statusIndicators.aadharBackStatus,
                statusIndicators.aadharBackRejectReason,
                docsView.aadharBack
              )}

              {renderDocumentUpload(
                "PAN Card",
                "panCardFront",
                setPanCardFront,
                statusIndicators.panCardFrontStatus,
                statusIndicators.panCardFrontRejectReason,
                docsView.panCardFront
              )}

              {renderDocumentUpload(
                "Udyam Aadhar",
                "udyamAadhar",
                setUdyamAadhar,
                statusIndicators.udyamAadharStatus,
                statusIndicators.udyamAadharRejectReason,
                docsView.udyamAadhar
              )}

              {renderDocumentUpload(
                "Ghumasta License",
                "ghumastaLicense",
                setGhumastaLicense,
                statusIndicators.ghumastaLicenseStatus,
                statusIndicators.ghumastaLicenseRejectReason,
                docsView.ghumastaLicense
              )}

              {statusIndicators.all_documents_status !== 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.6 }}
                  className="pt-4"
                >
                  <button
                    type="submit"
                    className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-[#00B7C2] to-[#008999] text-white rounded-lg hover:from-[#00a6b0] hover:to-[#007a89] transition-all font-medium flex items-center justify-center gap-2"
                  >
                    <Upload className="w-5 h-5" />
                    Submit Documents
                  </button>
                </motion.div>
              )}
            </form>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default VendorProfileContent;

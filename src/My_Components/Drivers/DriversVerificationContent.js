// import React, { useEffect, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useNavigate } from "react-router-dom";
// import { IKContext, IKUpload } from "imagekitio-react";
// import axiosInstance from "../../API/axiosInstance";
// import secureLocalStorage from "react-secure-storage";
// import toast from "react-hot-toast";

// import {
//   CheckCircle,
//   Clock,
//   X,
//   Upload,
//   Info,
//   Save,
//   RefreshCw,
// } from "lucide-react";

// export default function DriverDocumentVerification() {
//   const navigate = useNavigate();
//   const uid = localStorage.getItem("@secure.n.uid");
//   const decryptedUID = secureLocalStorage.getItem("uid");
//   const [showPopover, setShowPopover] = useState(false);
//   const [aadharFront, setAadharFront] = useState("");
//   const [aadharBack, setAadharBack] = useState("");
//   const [panCardFront, setPanCardFront] = useState("");
//   const [drivingLicenseFront, setDrivingLicenseFront] = useState("");
//   const [drivingLicenseBack, setDrivingLicenseBack] = useState("");
//   const [selfie, setSelfie] = useState("");
//   const [passbookOrCheque, setPassbookOrCheque] = useState("");
//   const [rc, setRc] = useState("");
//   const [puc, setPuc] = useState("");
//   const [insurance, setInsurance] = useState("");
//   const [permit, setPermit] = useState("");
//   const [fitnessCertificate, setFitnessCertificate] = useState("");
//   const [taxReceipt, setTaxReceipt] = useState("");
//   const [statusIndicators, setStatusIndicators] = useState({});
//   const [previousEmail, setPreviousEmail] = useState("");
//   const [dcdID, setDcdID] = useState("");
//   const [docsView, setDocsView] = useState({
//     aadharFront: "",
//     aadharBack: "",
//     panCardFront: "",
//     drivingLicenseFront: "",
//     drivingLicenseBack: "",
//     selfie: "",
//     passbookOrCheque: "",
//     rc: "",
//     puc: "",
//     insurance: "",
//     permit: "",
//     fitnessCertificate: "",
//     taxReceipt: "",
//   });
//   const [carDetails, setCarDetails] = useState({
//     uid: decryptedUID,
//     car_name: "",
//     model_year: "",
//     car_number: "",
//     car_type: "",
//     submit_status: "",
//   });

//   const [carDetails2, setCarDetails2] = useState({
//     uid: decryptedUID,
//     car_name: "",
//     model_year: "",
//     car_number: "",
//     car_type: "",
//     submit_status: "",
//   });
//   const [profileData, setProfileData] = useState({
//     uid: decryptedUID,
//     name: "",
//     email: "",
//     emailOtp: "",
//     phone_number: "",
//   });
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
//         `${process.env.REACT_APP_BASE_URL}/drivers/sendProfileUpdateEmailVerification`,
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
//           emailOtp: updatedProfileData.emailOtp,
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

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const formData = {
//         uid: decryptedUID,
//         dcd_id: dcdID,
//         // Personal Details
//         aadharFront: aadharFront,
//         aadharBack: aadharBack,
//         panCardFront: panCardFront,
//         drivingLicenseFront: drivingLicenseFront,
//         drivingLicenseBack: drivingLicenseBack,
//         selfie: selfie,
//         passbookOrCheque: passbookOrCheque,

//         // Car Details
//         rc: rc,
//         puc: puc,
//         insurance: insurance,
//         permit: permit,
//         fitnessCertificate: fitnessCertificate,
//         taxReceipt: taxReceipt,
//       };

//       if (formData === null) throw Error;

//       const response = await axiosInstance.post(
//         `${process.env.REACT_APP_BASE_URL}/drivers/document_upload`,
//         { formData, decryptedUID }
//       );

//       // Handle success
//       if (response.status === 200) {
//         console.log("Documents successfully uploaded!");
//         toast.success(
//           "Documents Successfully Uploaded! Please wait for the admin to verify your documents."
//         );
//         window.location.reload();
//       } else {
//         console.error("Error uploading documents");
//         toast.error("An error occurred while uploading your documents.");
//       }
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   };

//   const authenticator = async () => {
//     try {
//       const response = await fetch(
//         `${process.env.REACT_APP_BASE_URL}/drivers/drivers_document_auth`
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
//     const fetchStatusIndicators = async () => {
//       try {
//         const response = await axiosInstance.post(
//           `${process.env.REACT_APP_BASE_URL}/drivers/fetchParticularDocStatus`,
//           { decryptedUID }
//         );

//         if (response.status === 200) {
//           setStatusIndicators(response.data);
//         } else {
//           console.error("Failed to fetch status indicators");
//         }
//       } catch (error) {
//         console.error("Error fetching status indicators:", error.message);
//       }
//     };

//     const fetchProfileData = async () => {
//       try {
//         const response = await axiosInstance.post(
//           `${process.env.REACT_APP_BASE_URL}/drivers/fetchProfileData`,
//           { decryptedUID }
//         );

//         if (response.status === 200) {
//           setProfileData(response.data);
//         } else {
//           console.error("Failed to fetch Profile Data");
//         }
//       } catch (error) {
//         console.error("Error fetching status indicators:", error.message);
//       }
//     };

//     const fetchCarDetails = async () => {
//       try {
//         const response = await axiosInstance.post(
//           `${process.env.REACT_APP_BASE_URL}/drivers/fetchCarDetails`,
//           { decryptedUID }
//         );

//         setCarDetails2(response.data);
//         console.log("Car Details", response.data);
//       } catch (error) {
//         console.error("Error fetching :", error.message);
//       }
//     };

//     const fetchDcdID = async () => {
//       try {
//         const response = await axiosInstance.post(
//           `${process.env.REACT_APP_BASE_URL}/drivers/fetchDcdID`,
//           { decryptedUID }
//         );

//         setDcdID(response.data);
//         console.log("fetchDcdID :", response.data);
//       } catch (error) {
//         console.error("Error fetching :", error.message);
//       }
//     };

//     const fetchDocLinks = async () => {
//       try {
//         const response = await axiosInstance.post(
//           `${process.env.REACT_APP_BASE_URL}/drivers/fetchDocLinks`,
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
//     fetchCarDetails();
//     fetchDocLinks();
//     fetchDcdID();
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
//         `${process.env.REACT_APP_BASE_URL}/drivers/updateProfile`,
//         { updatedProfileData, decryptedUID }
//       );

//       if (res.status === 200) {
//         if (updatedProfileData.email !== previousEmail) {
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
//   const BackToLogin = () => {
//     navigate("/");
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setUpdatedProfileData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;

//     setCarDetails((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handleCarForm = async (e) => {
//     e.preventDefault();
//     console.log(carDetails);
//     try {
//       const res = await axiosInstance.post(
//         `${process.env.REACT_APP_BASE_URL}/drivers/uploadCarDetails`,
//         { carDetails, decryptedUID }
//       );

//       console.log("Response status:", res.status);

//       if (res.status === 400) {
//         alert("Invalid Car Number");
//       } else if (res.status === 200) {
//         alert("Car Details Uploaded Successfully");
//         window.location.reload();
//       } else {
//         alert("Failed to upload Car Details");
//       }
//     } catch (error) {
//       alert(
//         "Check Your Car Details, especially for the Car Number. It should be in the form of e.g., 'MH04CG7475'"
//       );
//       console.error("Error: ", error);
//     }
//   };

//   const generateYearOptions = () => {
//     const currentYear = new Date().getFullYear();
//     const years = [];

//     for (let year = currentYear; year >= currentYear - 50; year--) {
//       years.push(year);
//     }

//     return years.map((year, index) => (
//       <>
//         <option key={year} value={year}>
//           {year}
//         </option>
//       </>
//     ));
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

//   const publicKey = "public_ytabO1+xt+yMhICKtVeVGbWi/u8=";
//   const urlEndpoint = "https://ik.imagekit.io/TriptoServices";

//   return (
//     <>
//       <div className="min-h-screen bg-gray-50 p-8">
//         <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg mt-8">
//           <div className="bg-gradient-to-r from-[#0bbfe0] to-[#077286] text-white rounded-t-lg p-4">
//             <h1 className="text-2xl">Driver Document Verification</h1>
//             <p className="text-sm opacity-80">
//               Please fill in your details and upload the required documents
//             </p>
//           </div>
//           <div className="p-6">
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//               {/* Left Column: Personal and Car Information */}
//               <div>
//                 <div className="bg-white shadow-md rounded-lg mb-6">
//                   <div className="p-4">
//                     <h2 className="text-xl font-semibold mb-4">
//                       Personal Information
//                     </h2>
//                     <div className="space-y-4">
//                       <form onSubmit={handleProfileEdit}>
//                         <input type="hidden" name="uid" value={decryptedUID} />

//                         <label
//                           htmlFor="name"
//                           className="block font-medium my-2"
//                         >
//                           Name
//                         </label>
//                         <input
//                           name="name"
//                           type="text"
//                           className="border border-gray-300 rounded-lg w-full p-2"
//                           onChange={handleChange}
//                           value={profileData.name}
//                         />
//                         <label
//                           htmlFor="email"
//                           className="block font-medium my-2"
//                         >
//                           Email
//                         </label>
//                         <div className="flex items-center space-x-2">
//                           <input
//                             name="email"
//                             type="text"
//                             className="border border-gray-300 rounded-lg p-2 flex-grow"
//                             required
//                             value={updatedProfileData.email || ""}
//                             placeholder={profileData.email}
//                             onChange={handleChange}
//                           />
//                           <button
//                             className="btn bg-gradient-to-r from-[#0bbfe0] to-[#077286] text-white"
//                             type="button"
//                             onClick={handleEmailVerification}
//                           >
//                             Send OTP
//                           </button>
//                         </div>

//                         <label
//                           htmlFor="emailOtp"
//                           className="block font-medium my-2"
//                         >
//                           Email OTP
//                         </label>
//                         <div className="flex items-center space-x-2">
//                           <input
//                             type="text"
//                             id="emailOtp"
//                             name="emailOtp"
//                             className="border border-gray-300 rounded-lg p-2 flex-grow"
//                             value={updatedProfileData.emailOtp || ""}
//                             placeholder="Enter your OTP here"
//                             onChange={handleChange}
//                             required
//                           />
//                           <button
//                             className="btn btn bg-gradient-to-r from-[#0bbfe0] to-[#077286] text-white"
//                             type="button"
//                             onClick={confirmEmailVerification}
//                           >
//                             Verify OTP
//                           </button>
//                         </div>

//                         <label
//                           htmlFor="phone"
//                           className="block font-medium my-2"
//                         >
//                           Phone Number
//                         </label>
//                         <input
//                           name="phone_number"
//                           type="text"
//                           className="border border-gray-300 rounded-lg w-full p-2"
//                           required
//                           value={updatedProfileData.phone_number || ""}
//                           placeholder={profileData.phone_number}
//                           onChange={handleChange}
//                         />

//                         <input
//                           type="submit"
//                           value="Edit Profile"
//                           className="form-control bg-gradient-to-r from-[#0bbfe0] to-[#077286] text-white my-3"
//                         />
//                       </form>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="bg-white shadow-md rounded-lg">
//                   <div className="p-4 h-[505px]">
//                     <h2 className="text-xl font-semibold mb-4">
//                       Car Information
//                     </h2>
//                     <div className="space-y-4">
//                       <form onSubmit={handleCarForm}>
//                         <input type="hidden" name="uid" value={uid} />

//                         {carDetails2.submit_status === 1 ? (
//                           <div className="">
//                             <label
//                               htmlFor="car_name"
//                               className="block font-medium my-2"
//                             >
//                               Car Name
//                             </label>
//                             <input
//                               type="text"
//                               name="car_name"
//                               className="border border-gray-300 rounded-lg w-full p-2"
//                               onChange={handleInputChange}
//                               disabled
//                               value={carDetails2.car_name}
//                             />
//                           </div>
//                         ) : (
//                           <div className="">
//                             <label
//                               htmlFor="car_name"
//                               className="block font-medium my-2"
//                             >
//                               Car Name
//                             </label>
//                             <input
//                               type="text"
//                               name="car_name"
//                               className="border border-gray-300 rounded-lg w-full p-2"
//                               onChange={handleInputChange}
//                               required
//                               placeholder={carDetails2.car_name}
//                               value={carDetails.car_name}
//                             />
//                           </div>
//                         )}

//                         {carDetails2.submit_status === 1 ? (
//                           <div className="">
//                             <label
//                               htmlFor="modelYear"
//                               className="block font-medium my-2"
//                             >
//                               Model Year
//                             </label>
//                             <select
//                               className="border border-gray-300 rounded-lg w-full p-2"
//                               name="model_year"
//                               onChange={handleInputChange}
//                               value={carDetails2.model_year}
//                               disabled
//                             >
//                               {generateYearOptions()}
//                             </select>
//                           </div>
//                         ) : (
//                           <div className="">
//                             <label
//                               htmlFor="modelYear"
//                               className="block font-medium my-2"
//                             >
//                               Model Year
//                             </label>
//                             <select
//                               className="border border-gray-300 rounded-lg w-full p-2"
//                               name="model_year"
//                               onChange={handleInputChange}
//                               value={carDetails.model_year}
//                             >
//                               <option>Choose Model Year</option>
//                               {generateYearOptions()}
//                             </select>
//                           </div>
//                         )}

//                         {carDetails2.submit_status === 1 ? (
//                           <div className="">
//                             <label
//                               htmlFor="carNumber"
//                               className="block font-medium my-2"
//                             >
//                               Car Number
//                             </label>
//                             <input
//                               type="text"
//                               name="car_number"
//                               className="border border-gray-300 rounded-lg w-full p-2"
//                               onChange={handleInputChange}
//                               value={carDetails2.car_number}
//                               disabled
//                             />
//                           </div>
//                         ) : (
//                           <div className="">
//                             <label
//                               htmlFor="carNumber"
//                               className="block font-medium my-2"
//                             >
//                               Car Number
//                             </label>
//                             <input
//                               type="text"
//                               name="car_number"
//                               className="border border-gray-300 rounded-lg w-full p-2"
//                               onChange={handleInputChange}
//                               required
//                               placeholder={carDetails2.car_number}
//                               value={carDetails.car_number}
//                             />
//                           </div>
//                         )}

//                         {carDetails2.submit_status === 1 ? (
//                           <div className="">
//                             <label
//                               htmlFor="carType"
//                               className="block font-medium my-2"
//                             >
//                               Car Type
//                             </label>
//                             <select
//                               name="car_type"
//                               className="border border-gray-300 rounded-lg w-full p-2"
//                               onChange={handleInputChange}
//                               disabled
//                             >
//                               <option
//                                 value={
//                                   carDetails2.car_type == 1
//                                     ? "4+1 ( SEDAN )"
//                                     : carDetails2.car_type == 2
//                                     ? "6+1 ( SUV , MUV )"
//                                     : "H"
//                                 }
//                               >
//                                 {carDetails2.car_type == 1
//                                   ? "4+1 ( SEDAN )"
//                                   : carDetails2.car_type == 2
//                                   ? "6+1 ( SUV , MUV )"
//                                   : "H"}
//                               </option>
//                             </select>
//                           </div>
//                         ) : (
//                           <div className="">
//                             <label
//                               htmlFor="carType"
//                               className="block font-medium my-2"
//                             >
//                               Car Type
//                             </label>
//                             <select
//                               name="car_type"
//                               className="border border-gray-300 rounded-lg w-full p-2"
//                               onChange={handleInputChange}
//                               required
//                               value={carDetails.car_type}
//                             >
//                               <option>Choose Car Type</option>
//                               <option value={1}>4+1 ( SEDAN )</option>
//                               <option value={2}>6+1 ( SUV , MUV )</option>
//                             </select>
//                           </div>
//                         )}

//                         {carDetails2.submit_status === 1 ? (
//                           <>
//                             <p className="text-success text-xs my-2">
//                               Note: Car Details Are Saved Successfully !!.
//                             </p>
//                             <input
//                               className="form-control "
//                               type="submit"
//                               disabled
//                               value="Submit"
//                             />
//                           </>
//                         ) : (
//                           <>
//                             <p className="text-danger text-xs my-2">
//                               Note: Once the Car Details is submitted, you will
//                               not be able to update it again.
//                             </p>
//                             <input
//                               className="form-control bg-gradient-to-r from-[#0bbfe0] to-[#077286] text-white my-3"
//                               type="submit"
//                               value="Submit"
//                             />
//                           </>
//                         )}
//                       </form>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Right Column: Document Uploads */}
//               <div>
//                 <div className="bg-white rounded-lg shadow-md p-4">
//                   <h2 className="text-xl font-semibold">Documents</h2>

//                   <form onSubmit={handleSubmit}>
//                     <div className="h-[887px] overflow-y-auto pr-4">
//                       <div className="flex justify-between mb-4"></div>
//                       <AnimatePresence>
//                         {statusIndicators.all_documents_status === 1 ? (
//                           <>
//                             <div className="flex items-center space-x-2 mb-4">
//                               <CheckCircle size={24} />
//                               <p className="text-green-500 font-semibold">
//                                 All Documents Verified
//                               </p>
//                             </div>
//                           </>
//                         ) : (
//                           <>
//                             <input type="hidden" name="uid" value={uid} />
//                             <input type="hidden" name="dcd_id" value={dcdID} />
//                             {statusIndicators.aadharFrontStatus === 1 ? (
//                               ""
//                             ) : (
//                               <div className="py-2 px-4">
//                                 <label
//                                   className="block text-md  mb-2"
//                                   htmlFor="aadharFront"
//                                 >
//                                   Aadhar Card Front:
//                                 </label>

//                                 <div className="flex items-center justify-between mb-2">
//                                   <IKContext
//                                     publicKey={publicKey}
//                                     urlEndpoint={urlEndpoint}
//                                     authenticator={authenticator}
//                                   >
//                                     <IKUpload
//                                       required
//                                       className="form-control border border-gray-300 rounded-lg p-2 flex-1 mr-2"
//                                       fileName={`${uid}_aadharFront.jpg`}
//                                       folder="Home/Tripto/drivers"
//                                       tags={["AadharFront"]}
//                                       useUniqueFileName={false}
//                                       isPrivateFile={false}
//                                       onSuccess={(r) => {
//                                         setAadharFront(r.url);
//                                         toast.success("Uploaded");
//                                       }}
//                                       onError={(e) => console.log(e)}
//                                     />
//                                   </IKContext>
//                                   {docsView.aadharFront ? (
//                                     <button className="bg-blue-500 text-white rounded-lg btn btn-sm hover:bg-blue-600 mr-2">
//                                       <a
//                                         className="text-decoration-none"
//                                         href={docsView.aadharFront}
//                                         target="_blank"
//                                         rel="noreferrer"
//                                       >
//                                         View Doc
//                                       </a>
//                                     </button>
//                                   ) : null}

//                                   <span
//                                     className={`text-sm font-semibold px-3 py-1 rounded-full inline-block ${
//                                       statusIndicators.aadharFrontStatus === 0
//                                         ? "bg-yellow-500 text-white"
//                                         : statusIndicators.aadharFrontStatus ===
//                                           1
//                                         ? "bg-green-500 text-white"
//                                         : statusIndicators.aadharFrontStatus ===
//                                           2
//                                         ? "bg-red-500 text-white"
//                                         : "bg-yellow-500 text-white"
//                                     }`}
//                                   >
//                                     {statusIndicators.aadharFrontStatus === 0
//                                       ? "Pending"
//                                       : statusIndicators.aadharFrontStatus === 1
//                                       ? "Verified"
//                                       : statusIndicators.aadharFrontStatus === 2
//                                       ? "Rejected"
//                                       : "Pending"}
//                                   </span>

//                                   {statusIndicators.aadharFrontStatus === 2 &&
//                                     statusIndicators.aadharFrontRejectReason && (
//                                       <div className="relative ml-2">
//                                         <Info className="text-red-500 cursor-pointer" />

//                                         <motion.div
//                                           initial={{ opacity: 0, y: -10 }}
//                                           animate={{ opacity: 1, y: 0 }}
//                                           exit={{ opacity: 0, y: -10 }}
//                                           className="absolute right-0 mt-2 w-48 p-2 bg-white border border-gray-300 rounded shadow-lg z-10"
//                                           style={{
//                                             transform: "translateX(-100%)",
//                                           }}
//                                         >
//                                           {
//                                             statusIndicators.aadharFrontRejectReason
//                                           }
//                                         </motion.div>
//                                       </div>
//                                     )}
//                                 </div>
//                               </div>
//                             )}

//                             {statusIndicators.aadharBackStatus === 1 ? (
//                               ""
//                             ) : (
//                               <div className="py-2 px-4">
//                                 <label
//                                   className="block text-md  mb-2"
//                                   htmlFor="aadharBack"
//                                 >
//                                   Aadhar Card Back:
//                                 </label>

//                                 <div className="flex items-center justify-between mb-2">
//                                   <IKContext
//                                     publicKey={publicKey}
//                                     urlEndpoint={urlEndpoint}
//                                     authenticator={authenticator}
//                                   >
//                                     <IKUpload
//                                       required
//                                       className="form-control border border-gray-300 rounded-lg p-2 flex-1 mr-2"
//                                       fileName={`${uid}_aadharBack.jpg`}
//                                       folder="Home/Tripto/drivers"
//                                       tags={["AadharBack"]}
//                                       useUniqueFileName={false}
//                                       isPrivateFile={false}
//                                       onSuccess={(r) => {
//                                         setAadharBack(r.url);
//                                         alert("Uploaded");
//                                       }}
//                                       onError={(e) => console.log(e)}
//                                     />
//                                   </IKContext>

//                                   {docsView.aadharBack ? (
//                                     <button className="bg-blue-500 text-white rounded-lg btn btn-sm hover:bg-blue-600 mr-2">
//                                       <a
//                                         className="text-decoration-none"
//                                         href={docsView.aadharBack}
//                                         target="_blank"
//                                         rel="noreferrer"
//                                       >
//                                         View Doc
//                                       </a>
//                                     </button>
//                                   ) : null}

//                                   <span
//                                     className={`text-sm font-semibold px-3 py-1 rounded-full inline-block ${
//                                       statusIndicators.aadharBackStatus === 0
//                                         ? "bg-yellow-500 text-white"
//                                         : statusIndicators.aadharBackStatus ===
//                                           1
//                                         ? "bg-green-500 text-white"
//                                         : statusIndicators.aadharBackStatus ===
//                                           2
//                                         ? "bg-red-500 text-white"
//                                         : "bg-yellow-500 text-white"
//                                     }`}
//                                   >
//                                     {statusIndicators.aadharBackStatus === 0
//                                       ? "Pending"
//                                       : statusIndicators.aadharBackStatus === 1
//                                       ? "Verified"
//                                       : statusIndicators.aadharBackStatus === 2
//                                       ? "Rejected"
//                                       : "Pending"}
//                                   </span>

//                                   {statusIndicators.aadharBackStatus === 2 &&
//                                     statusIndicators.aadharBackRejectReason && (
//                                       <div className="relative ml-2">
//                                         <Info className="text-red-500 cursor-pointer" />

//                                         <motion.div
//                                           initial={{ opacity: 0, y: -10 }}
//                                           animate={{ opacity: 1, y: 0 }}
//                                           exit={{ opacity: 0, y: -10 }}
//                                           className="absolute right-0 mt-2 w-48 p-2 bg-white border border-gray-300 rounded shadow-lg z-10"
//                                           style={{
//                                             transform: "translateX(-100%)",
//                                           }}
//                                         >
//                                           {
//                                             statusIndicators.aadharBackRejectReason
//                                           }
//                                         </motion.div>
//                                       </div>
//                                     )}
//                                 </div>
//                               </div>
//                             )}

//                             {statusIndicators.panCardFrontStatus === 1 ? (
//                               ""
//                             ) : (
//                               <div className="py-2 px-4">
//                                 <label
//                                   className="block text-md  mb-2"
//                                   htmlFor="panCardFront"
//                                 >
//                                   Pan Card Front:
//                                 </label>

//                                 <div className="flex items-center justify-between mb-2">
//                                   <IKContext
//                                     publicKey={publicKey}
//                                     urlEndpoint={urlEndpoint}
//                                     authenticator={authenticator}
//                                   >
//                                     <IKUpload
//                                       required
//                                       className="form-control border border-gray-300 rounded-lg p-2 flex-1 mr-2"
//                                       fileName={`${uid}_panCardFront.jpg`}
//                                       folder="Home/Tripto/drivers"
//                                       tags={["panCardFront"]}
//                                       useUniqueFileName={false}
//                                       isPrivateFile={false}
//                                       onSuccess={(r) => {
//                                         setPanCardFront(r.url);
//                                         alert("Uploaded");
//                                       }}
//                                       onError={(e) => console.log(e)}
//                                     />
//                                   </IKContext>
//                                   {docsView.panCardFront ? (
//                                     <button className="bg-blue-500 text-white rounded-lg btn btn-sm hover:bg-blue-600 mr-2">
//                                       <a
//                                         className="text-decoration-none"
//                                         href={docsView.panCardFront}
//                                         target="_blank"
//                                         rel="noreferrer"
//                                       >
//                                         View Doc
//                                       </a>
//                                     </button>
//                                   ) : null}

//                                   <span
//                                     className={`text-sm font-semibold px-3 py-1 rounded-full inline-block ${
//                                       statusIndicators.panCardFrontStatus === 0
//                                         ? "bg-yellow-500 text-white"
//                                         : statusIndicators.panCardFrontStatus ===
//                                           1
//                                         ? "bg-green-500 text-white"
//                                         : statusIndicators.panCardFrontStatus ===
//                                           2
//                                         ? "bg-red-500 text-white"
//                                         : "bg-yellow-500 text-white"
//                                     }`}
//                                   >
//                                     {statusIndicators.panCardFrontStatus === 0
//                                       ? "Pending"
//                                       : statusIndicators.panCardFrontStatus ===
//                                         1
//                                       ? "Verified"
//                                       : statusIndicators.panCardFrontStatus ===
//                                         2
//                                       ? "Rejected"
//                                       : "Pending"}
//                                   </span>

//                                   {statusIndicators.panCardFrontStatus === 2 &&
//                                     statusIndicators.panCardFrontRejectReason && (
//                                       <div className="relative ml-2">
//                                         <Info className="text-red-500 cursor-pointer" />

//                                         <motion.div
//                                           initial={{ opacity: 0, y: -10 }}
//                                           animate={{ opacity: 1, y: 0 }}
//                                           exit={{ opacity: 0, y: -10 }}
//                                           className="absolute right-0 mt-2 w-48 p-2 bg-white border border-gray-300 rounded shadow-lg z-10"
//                                           style={{
//                                             transform: "translateX(-100%)",
//                                           }}
//                                         >
//                                           {
//                                             statusIndicators.panCardFrontRejectReason
//                                           }
//                                         </motion.div>
//                                       </div>
//                                     )}
//                                 </div>
//                               </div>
//                             )}

//                             {statusIndicators.drivingLicenseFrontStatus ===
//                             1 ? (
//                               ""
//                             ) : (
//                               <div className="py-2 px-4">
//                                 <label
//                                   className="block text-md  mb-2"
//                                   htmlFor="drivingLicenseFront"
//                                 >
//                                   Driving License Front:
//                                 </label>

//                                 <div className="flex items-center justify-between mb-2">
//                                   <IKContext
//                                     publicKey={publicKey}
//                                     urlEndpoint={urlEndpoint}
//                                     authenticator={authenticator}
//                                   >
//                                     <IKUpload
//                                       required
//                                       className="form-control border border-gray-300 rounded-lg p-2 flex-1 mr-2"
//                                       fileName={`${uid}_drivingLicenseFront.jpg`}
//                                       folder="Home/Tripto/drivers"
//                                       tags={["drivingLicenseFront"]}
//                                       useUniqueFileName={false}
//                                       isPrivateFile={false}
//                                       onSuccess={(r) => {
//                                         setDrivingLicenseFront(r.url);
//                                         alert("Uploaded");
//                                       }}
//                                       onError={(e) => console.log(e)}
//                                     />
//                                   </IKContext>
//                                   {docsView.drivingLicenseFront ? (
//                                     <>
//                                       <button className="bg-blue-500 text-white rounded-lg btn btn-sm hover:bg-blue-600 mr-2">
//                                         <a
//                                           className="text-decoration-none"
//                                           href={docsView.drivingLicenseFront}
//                                           target="_blank"
//                                           rel="noreferrer"
//                                         >
//                                           View Doc
//                                         </a>
//                                       </button>
//                                     </>
//                                   ) : null}

//                                   <span
//                                     className={`text-sm font-semibold px-3 py-1 rounded-full inline-block ${
//                                       statusIndicators.drivingLicenseFrontStatus ===
//                                       0
//                                         ? "bg-yellow-500 text-white"
//                                         : statusIndicators.drivingLicenseFrontStatus ===
//                                           1
//                                         ? "bg-green-500 text-white"
//                                         : statusIndicators.drivingLicenseFrontStatus ===
//                                           2
//                                         ? "bg-red-500 text-white"
//                                         : "bg-yellow-500 text-white"
//                                     }`}
//                                   >
//                                     {statusIndicators.drivingLicenseFrontStatus ===
//                                     0
//                                       ? "Pending"
//                                       : statusIndicators.drivingLicenseFrontStatus ===
//                                         1
//                                       ? "Verified"
//                                       : statusIndicators.drivingLicenseFrontStatus ===
//                                         2
//                                       ? "Rejected"
//                                       : "Pending"}
//                                   </span>

//                                   {statusIndicators.drivingLicenseFrontStatus ===
//                                     2 &&
//                                     statusIndicators.drivingLicenseFrontRejectReason && (
//                                       <div className="relative ml-2">
//                                         <Info className="text-red-500 cursor-pointer" />

//                                         <motion.div
//                                           initial={{ opacity: 0, y: -10 }}
//                                           animate={{ opacity: 1, y: 0 }}
//                                           exit={{ opacity: 0, y: -10 }}
//                                           className="absolute right-0 mt-2 w-48 p-2 bg-white border border-gray-300 rounded shadow-lg z-10"
//                                           style={{
//                                             transform: "translateX(-100%)",
//                                           }}
//                                         >
//                                           {
//                                             statusIndicators.drivingLicenseFrontRejectReason
//                                           }
//                                         </motion.div>
//                                       </div>
//                                     )}
//                                 </div>
//                               </div>
//                             )}

//                             {statusIndicators.drivingLicenseBackStatus === 1 ? (
//                               ""
//                             ) : (
//                               <div className="py-2 px-4">
//                                 <label
//                                   className="block text-md  mb-2"
//                                   htmlFor="drivingLicenseBack"
//                                 >
//                                   Driving License Back:
//                                 </label>

//                                 <div className="flex items-center justify-between mb-2">
//                                   <IKContext
//                                     publicKey={publicKey}
//                                     urlEndpoint={urlEndpoint}
//                                     authenticator={authenticator}
//                                   >
//                                     <IKUpload
//                                       required
//                                       className="form-control border border-gray-300 rounded-lg p-2 flex-1 mr-2"
//                                       fileName={`${uid}_drivingLicenseBack.jpg`}
//                                       folder="Home/Tripto/drivers"
//                                       tags={["drivingLicenseBack"]}
//                                       useUniqueFileName={false}
//                                       isPrivateFile={false}
//                                       onSuccess={(r) => {
//                                         setDrivingLicenseBack(r.url);
//                                         alert("Uploaded");
//                                       }}
//                                       onError={(e) => console.log(e)}
//                                     />
//                                   </IKContext>
//                                   {docsView.drivingLicenseBack ? (
//                                     <button className="bg-blue-500 text-white rounded-lg btn btn-sm hover:bg-blue-600 mr-2">
//                                       <a
//                                         className="text-decoration-none"
//                                         href={docsView.drivingLicenseBack}
//                                         target="_blank"
//                                         rel="noreferrer"
//                                       >
//                                         View Doc
//                                       </a>
//                                     </button>
//                                   ) : null}

//                                   <span
//                                     className={`text-sm font-semibold px-3 py-1 rounded-full inline-block ${
//                                       statusIndicators.drivingLicenseBackStatus ===
//                                       0
//                                         ? "bg-yellow-500 text-white"
//                                         : statusIndicators.drivingLicenseBackStatus ===
//                                           1
//                                         ? "bg-green-500 text-white"
//                                         : statusIndicators.drivingLicenseBackStatus ===
//                                           2
//                                         ? "bg-red-500 text-white"
//                                         : "bg-yellow-500 text-white"
//                                     }`}
//                                   >
//                                     {statusIndicators.drivingLicenseBackStatus ===
//                                     0
//                                       ? "Pending"
//                                       : statusIndicators.drivingLicenseBackStatus ===
//                                         1
//                                       ? "Verified"
//                                       : statusIndicators.drivingLicenseBackStatus ===
//                                         2
//                                       ? "Rejected"
//                                       : "Pending"}
//                                   </span>

//                                   {statusIndicators.drivingLicenseBackStatus ===
//                                     2 &&
//                                     statusIndicators.drivingLicenseBackRejectReason && (
//                                       <div className="relative ml-2">
//                                         <Info className="text-red-500 cursor-pointer" />

//                                         <motion.div
//                                           initial={{ opacity: 0, y: -10 }}
//                                           animate={{ opacity: 1, y: 0 }}
//                                           exit={{ opacity: 0, y: -10 }}
//                                           className="absolute right-0 mt-2 w-48 p-2 bg-white border border-gray-300 rounded shadow-lg z-10"
//                                           style={{
//                                             transform: "translateX(-100%)",
//                                           }}
//                                         >
//                                           {
//                                             statusIndicators.drivingLicenseBackRejectReason
//                                           }
//                                         </motion.div>
//                                       </div>
//                                     )}
//                                 </div>
//                               </div>
//                             )}
//                             {statusIndicators.selfieStatus === 1 ? (
//                               ""
//                             ) : (
//                               <div className="py-2 px-4">
//                                 <label
//                                   className="block text-md  mb-2"
//                                   htmlFor="selfie"
//                                 >
//                                   Passport Size Photo:
//                                 </label>

//                                 <div className="flex items-center justify-between mb-2">
//                                   <IKContext
//                                     publicKey={publicKey}
//                                     urlEndpoint={urlEndpoint}
//                                     authenticator={authenticator}
//                                   >
//                                     <IKUpload
//                                       required
//                                       className="form-control border border-gray-300 rounded-lg p-2 flex-1 mr-2"
//                                       fileName={`${uid}_selfie.jpg`}
//                                       folder="Home/Tripto/drivers"
//                                       tags={["selfie"]}
//                                       useUniqueFileName={false}
//                                       isPrivateFile={false}
//                                       onSuccess={(r) => {
//                                         setSelfie(r.url);
//                                         alert("Uploaded");
//                                       }}
//                                       onError={(e) => console.log(e)}
//                                     />
//                                   </IKContext>
//                                   {docsView.selfie ? (
//                                     <button className="bg-blue-500 text-white rounded-lg btn btn-sm hover:bg-blue-600 mr-2">
//                                       <a
//                                         className="text-decoration-none"
//                                         href={docsView.selfie}
//                                         target="_blank"
//                                         rel="noreferrer"
//                                       >
//                                         View Doc
//                                       </a>
//                                     </button>
//                                   ) : null}

//                                   <span
//                                     className={`text-sm font-semibold px-3 py-1 rounded-full inline-block ${
//                                       statusIndicators.selfieStatus === 0
//                                         ? "bg-yellow-500 text-white"
//                                         : statusIndicators.selfieStatus === 1
//                                         ? "bg-green-500 text-white"
//                                         : statusIndicators.selfieStatus === 2
//                                         ? "bg-red-500 text-white"
//                                         : "bg-yellow-500 text-white"
//                                     }`}
//                                   >
//                                     {statusIndicators.selfieStatus === 0
//                                       ? "Pending"
//                                       : statusIndicators.selfieStatus === 1
//                                       ? "Verified"
//                                       : statusIndicators.selfieStatus === 2
//                                       ? "Rejected"
//                                       : "Pending"}
//                                   </span>

//                                   {statusIndicators.selfieStatus === 2 &&
//                                     statusIndicators.selfieRejectReason && (
//                                       <div className="relative ml-2">
//                                         <Info className="text-red-500 cursor-pointer" />

//                                         <motion.div
//                                           initial={{ opacity: 0, y: -10 }}
//                                           animate={{ opacity: 1, y: 0 }}
//                                           exit={{ opacity: 0, y: -10 }}
//                                           className="absolute right-0 mt-2 w-48 p-2 bg-white border border-gray-300 rounded shadow-lg z-10"
//                                           style={{
//                                             transform: "translateX(-100%)",
//                                           }}
//                                         >
//                                           {statusIndicators.selfieRejectReason}
//                                         </motion.div>
//                                       </div>
//                                     )}
//                                 </div>
//                               </div>
//                             )}
//                             {statusIndicators.passbookOrChequeStatus === 1 ? (
//                               ""
//                             ) : (
//                               <div className="py-2 px-4">
//                                 <label
//                                   className="block text-md  mb-2"
//                                   htmlFor="passbookOrCheque"
//                                 >
//                                   Passbook Or Cheque:
//                                 </label>

//                                 <div className="flex items-center justify-between mb-2">
//                                   <IKContext
//                                     publicKey={publicKey}
//                                     urlEndpoint={urlEndpoint}
//                                     authenticator={authenticator}
//                                   >
//                                     <IKUpload
//                                       required
//                                       className="form-control border border-gray-300 rounded-lg p-2 flex-1 mr-2"
//                                       fileName={`${uid}_passbookOrCheque.jpg`}
//                                       folder="Home/Tripto/drivers"
//                                       tags={["passbookOrCheque"]}
//                                       useUniqueFileName={false}
//                                       isPrivateFile={false}
//                                       onSuccess={(r) => {
//                                         setPassbookOrCheque(r.url);
//                                         alert("Uploaded");
//                                       }}
//                                       onError={(e) => console.log(e)}
//                                     />
//                                   </IKContext>
//                                   {docsView.passbookOrCheque ? (
//                                     <button className="bg-blue-500 text-white rounded-lg btn btn-sm hover:bg-blue-600 mr-2">
//                                       <a
//                                         className="text-decoration-none"
//                                         href={docsView.passbookOrCheque}
//                                         target="_blank"
//                                         rel="noreferrer"
//                                       >
//                                         View Doc
//                                       </a>
//                                     </button>
//                                   ) : null}

//                                   <span
//                                     className={`text-sm font-semibold px-3 py-1 rounded-full inline-block ${
//                                       statusIndicators.passbookOrChequeStatus ===
//                                       0
//                                         ? "bg-yellow-500 text-white"
//                                         : statusIndicators.passbookOrChequeStatus ===
//                                           1
//                                         ? "bg-green-500 text-white"
//                                         : statusIndicators.passbookOrChequeStatus ===
//                                           2
//                                         ? "bg-red-500 text-white"
//                                         : "bg-yellow-500 text-white"
//                                     }`}
//                                   >
//                                     {statusIndicators.passbookOrChequeStatus ===
//                                     0
//                                       ? "Pending"
//                                       : statusIndicators.passbookOrChequeStatus ===
//                                         1
//                                       ? "Verified"
//                                       : statusIndicators.passbookOrChequeStatus ===
//                                         2
//                                       ? "Rejected"
//                                       : "Pending"}
//                                   </span>

//                                   {statusIndicators.passbookOrChequeStatus ===
//                                     2 &&
//                                     statusIndicators.passbookOrChequeRejectReason && (
//                                       <div className="relative ml-2">
//                                         <Info className="text-red-500 cursor-pointer" />

//                                         <motion.div
//                                           initial={{ opacity: 0, y: -10 }}
//                                           animate={{ opacity: 1, y: 0 }}
//                                           exit={{ opacity: 0, y: -10 }}
//                                           className="absolute right-0 mt-2 w-48 p-2 bg-white border border-gray-300 rounded shadow-lg z-10"
//                                           style={{
//                                             transform: "translateX(-100%)",
//                                           }}
//                                         >
//                                           {
//                                             statusIndicators.passbookOrChequeRejectReason
//                                           }
//                                         </motion.div>
//                                       </div>
//                                     )}
//                                 </div>
//                               </div>
//                             )}

//                             {statusIndicators.rcStatus === 1 ? (
//                               ""
//                             ) : (
//                               <div className="py-2 px-4">
//                                 <label
//                                   className="block text-md  mb-2"
//                                   htmlFor="rc"
//                                 >
//                                   RC :
//                                 </label>

//                                 <div className="flex items-center justify-between mb-2">
//                                   <IKContext
//                                     publicKey={publicKey}
//                                     urlEndpoint={urlEndpoint}
//                                     authenticator={authenticator}
//                                   >
//                                     <IKUpload
//                                       required
//                                       className="form-control border border-gray-300 rounded-lg p-2 flex-1 mr-2"
//                                       fileName={`${uid}_rc.jpg`}
//                                       folder="Home/Tripto/drivers"
//                                       tags={["rc"]}
//                                       useUniqueFileName={false}
//                                       isPrivateFile={false}
//                                       onSuccess={(r) => {
//                                         setRc(r.url);
//                                         alert("Uploaded");
//                                       }}
//                                       onError={(e) => console.log(e)}
//                                     />
//                                   </IKContext>
//                                   {docsView.rc ? (
//                                     <button className="bg-blue-500 text-white rounded-lg btn btn-sm hover:bg-blue-600 mr-2">
//                                       <a
//                                         className="text-decoration-none"
//                                         href={docsView.rc}
//                                         target="_blank"
//                                         rel="noreferrer"
//                                       >
//                                         View Doc
//                                       </a>
//                                     </button>
//                                   ) : null}

//                                   <span
//                                     className={`text-sm font-semibold px-3 py-1 rounded-full inline-block ${
//                                       statusIndicators.rcStatus === 0
//                                         ? "bg-yellow-500 text-white"
//                                         : statusIndicators.rcStatus === 1
//                                         ? "bg-green-500 text-white"
//                                         : statusIndicators.rcStatus === 2
//                                         ? "bg-red-500 text-white"
//                                         : "bg-yellow-500 text-white"
//                                     }`}
//                                   >
//                                     {statusIndicators.rcStatus === 0
//                                       ? "Pending"
//                                       : statusIndicators.rcStatus === 1
//                                       ? "Verified"
//                                       : statusIndicators.rcStatus === 2
//                                       ? "Rejected"
//                                       : "Pending"}
//                                   </span>

//                                   {statusIndicators.rcStatus === 2 &&
//                                     statusIndicators.rcRejectReason && (
//                                       <div className="relative ml-2">
//                                         <Info className="text-red-500 cursor-pointer" />

//                                         <motion.div
//                                           initial={{ opacity: 0, y: -10 }}
//                                           animate={{ opacity: 1, y: 0 }}
//                                           exit={{ opacity: 0, y: -10 }}
//                                           className="absolute right-0 mt-2 w-48 p-2 bg-white border border-gray-300 rounded shadow-lg z-10"
//                                           style={{
//                                             transform: "translateX(-100%)",
//                                           }}
//                                         >
//                                           {statusIndicators.rcRejectReason}
//                                         </motion.div>
//                                       </div>
//                                     )}
//                                 </div>
//                               </div>
//                             )}

//                             {statusIndicators.pucStatus === 1 ? (
//                               ""
//                             ) : (
//                               <div className="py-2 px-4">
//                                 <label
//                                   className="block text-md  mb-2"
//                                   htmlFor="puc"
//                                 >
//                                   PUC :
//                                 </label>

//                                 <div className="flex items-center justify-between mb-2">
//                                   <IKContext
//                                     publicKey={publicKey}
//                                     urlEndpoint={urlEndpoint}
//                                     authenticator={authenticator}
//                                   >
//                                     <IKUpload
//                                       required
//                                       className="form-control border border-gray-300 rounded-lg p-2 flex-1 mr-2"
//                                       fileName={`${uid}_puc.jpg`}
//                                       folder="Home/Tripto/drivers"
//                                       tags={["puc"]}
//                                       useUniqueFileName={false}
//                                       isPrivateFile={false}
//                                       onSuccess={(r) => {
//                                         setPuc(r.url);
//                                         alert("Uploaded");
//                                       }}
//                                       onError={(e) => console.log(e)}
//                                     />
//                                   </IKContext>
//                                   {docsView.puc ? (
//                                     <button className="bg-blue-500 text-white rounded-lg btn btn-sm hover:bg-blue-600 mr-2">
//                                       <a
//                                         className="text-decoration-none"
//                                         href={docsView.puc}
//                                         target="_blank"
//                                         rel="noreferrer"
//                                       >
//                                         View Doc
//                                       </a>
//                                     </button>
//                                   ) : null}

//                                   <span
//                                     className={`text-sm font-semibold px-3 py-1 rounded-full inline-block ${
//                                       statusIndicators.pucStatus === 0
//                                         ? "bg-yellow-500 text-white"
//                                         : statusIndicators.pucStatus === 1
//                                         ? "bg-green-500 text-white"
//                                         : statusIndicators.pucStatus === 2
//                                         ? "bg-red-500 text-white"
//                                         : "bg-yellow-500 text-white"
//                                     }`}
//                                   >
//                                     {statusIndicators.pucStatus === 0
//                                       ? "Pending"
//                                       : statusIndicators.pucStatus === 1
//                                       ? "Verified"
//                                       : statusIndicators.pucStatus === 2
//                                       ? "Rejected"
//                                       : "Pending"}
//                                   </span>

//                                   {statusIndicators.pucStatus === 2 &&
//                                     statusIndicators.pucRejectReason && (
//                                       <div className="relative ml-2">
//                                         <Info className="text-red-500 cursor-pointer" />

//                                         <motion.div
//                                           initial={{ opacity: 0, y: -10 }}
//                                           animate={{ opacity: 1, y: 0 }}
//                                           exit={{ opacity: 0, y: -10 }}
//                                           className="absolute right-0 mt-2 w-48 p-2 bg-white border border-gray-300 rounded shadow-lg z-10"
//                                           style={{
//                                             transform: "translateX(-100%)",
//                                           }}
//                                         >
//                                           {statusIndicators.pucRejectReason}
//                                         </motion.div>
//                                       </div>
//                                     )}
//                                 </div>
//                               </div>
//                             )}

//                             {statusIndicators.insuranceStatus === 1 ? (
//                               ""
//                             ) : (
//                               <div className="py-2 px-4">
//                                 <label
//                                   className="block text-md  mb-2"
//                                   htmlFor="insurance"
//                                 >
//                                   Insurance :
//                                 </label>

//                                 <div className="flex items-center justify-between mb-2">
//                                   <IKContext
//                                     publicKey={publicKey}
//                                     urlEndpoint={urlEndpoint}
//                                     authenticator={authenticator}
//                                   >
//                                     <IKUpload
//                                       required
//                                       className="form-control border border-gray-300 rounded-lg p-2 flex-1 mr-2"
//                                       fileName={`${uid}_insurance.jpg`}
//                                       folder="Home/Tripto/drivers"
//                                       tags={["insurance"]}
//                                       useUniqueFileName={false}
//                                       isPrivateFile={false}
//                                       onSuccess={(r) => {
//                                         setInsurance(r.url);
//                                         alert("Uploaded");
//                                       }}
//                                       onError={(e) => console.log(e)}
//                                     />
//                                   </IKContext>
//                                   {docsView.insurance ? (
//                                     <button className="bg-blue-500 text-white rounded-lg btn btn-sm hover:bg-blue-600 mr-2">
//                                       <a
//                                         className="text-decoration-none"
//                                         href={docsView.insurance}
//                                         target="_blank"
//                                         rel="noreferrer"
//                                       >
//                                         View Doc
//                                       </a>
//                                     </button>
//                                   ) : null}

//                                   <span
//                                     className={`text-sm font-semibold px-3 py-1 rounded-full inline-block ${
//                                       statusIndicators.insuranceStatus === 0
//                                         ? "bg-yellow-500 text-white"
//                                         : statusIndicators.insuranceStatus === 1
//                                         ? "bg-green-500 text-white"
//                                         : statusIndicators.insuranceStatus === 2
//                                         ? "bg-red-500 text-white"
//                                         : "bg-yellow-500 text-white"
//                                     }`}
//                                   >
//                                     {statusIndicators.insuranceStatus === 0
//                                       ? "Pending"
//                                       : statusIndicators.insuranceStatus === 1
//                                       ? "Verified"
//                                       : statusIndicators.insuranceStatus === 2
//                                       ? "Rejected"
//                                       : "Pending"}
//                                   </span>

//                                   {statusIndicators.insuranceStatus === 2 &&
//                                     statusIndicators.insuranceRejectReason && (
//                                       <div className="relative ml-2">
//                                         <Info className="text-red-500 cursor-pointer" />

//                                         <motion.div
//                                           initial={{ opacity: 0, y: -10 }}
//                                           animate={{ opacity: 1, y: 0 }}
//                                           exit={{ opacity: 0, y: -10 }}
//                                           className="absolute right-0 mt-2 w-48 p-2 bg-white border border-gray-300 rounded shadow-lg z-10"
//                                           style={{
//                                             transform: "translateX(-100%)",
//                                           }}
//                                         >
//                                           {
//                                             statusIndicators.insuranceRejectReason
//                                           }
//                                         </motion.div>
//                                       </div>
//                                     )}
//                                 </div>
//                               </div>
//                             )}

//                             {statusIndicators.permitStatus === 1 ? (
//                               ""
//                             ) : (
//                               <div className="py-2 px-4">
//                                 <label
//                                   className="block text-md  mb-2"
//                                   htmlFor="permit"
//                                 >
//                                   Permit :
//                                 </label>

//                                 <div className="flex items-center justify-between mb-2">
//                                   <IKContext
//                                     publicKey={publicKey}
//                                     urlEndpoint={urlEndpoint}
//                                     authenticator={authenticator}
//                                   >
//                                     <IKUpload
//                                       required
//                                       className="form-control border border-gray-300 rounded-lg p-2 flex-1 mr-2"
//                                       fileName={`${uid}_permit.jpg`}
//                                       folder="Home/Tripto/drivers"
//                                       tags={["permit"]}
//                                       useUniqueFileName={false}
//                                       isPrivateFile={false}
//                                       onSuccess={(r) => {
//                                         setPermit(r.url);
//                                         alert("Uploaded");
//                                       }}
//                                       onError={(e) => console.log(e)}
//                                     />
//                                   </IKContext>
//                                   {docsView.permit ? (
//                                     <button className="bg-blue-500 text-white rounded-lg btn btn-sm hover:bg-blue-600 mr-2">
//                                       <a
//                                         className="text-decoration-none"
//                                         href={docsView.permit}
//                                         target="_blank"
//                                         rel="noreferrer"
//                                       >
//                                         View Doc
//                                       </a>
//                                     </button>
//                                   ) : null}

//                                   <span
//                                     className={`text-sm font-semibold px-3 py-1 rounded-full inline-block ${
//                                       statusIndicators.permitStatus === 0
//                                         ? "bg-yellow-500 text-white"
//                                         : statusIndicators.permitStatus === 1
//                                         ? "bg-green-500 text-white"
//                                         : statusIndicators.permitStatus === 2
//                                         ? "bg-red-500 text-white"
//                                         : "bg-yellow-500 text-white"
//                                     }`}
//                                   >
//                                     {statusIndicators.permitStatus === 0
//                                       ? "Pending"
//                                       : statusIndicators.permitStatus === 1
//                                       ? "Verified"
//                                       : statusIndicators.permitStatus === 2
//                                       ? "Rejected"
//                                       : "Pending"}
//                                   </span>

//                                   {statusIndicators.permitStatus === 2 &&
//                                     statusIndicators.permitRejectReason && (
//                                       <div className="relative ml-2">
//                                         <Info className="text-red-500 cursor-pointer" />

//                                         <motion.div
//                                           initial={{ opacity: 0, y: -10 }}
//                                           animate={{ opacity: 1, y: 0 }}
//                                           exit={{ opacity: 0, y: -10 }}
//                                           className="absolute right-0 mt-2 w-48 p-2 bg-white border border-gray-300 rounded shadow-lg z-10"
//                                           style={{
//                                             transform: "translateX(-100%)",
//                                           }}
//                                         >
//                                           {statusIndicators.permitRejectReason}
//                                         </motion.div>
//                                       </div>
//                                     )}
//                                 </div>
//                               </div>
//                             )}

//                             {statusIndicators.fitnessCertificateStatus === 1 ? (
//                               ""
//                             ) : (
//                               <div className="py-2 px-4">
//                                 <label
//                                   className="block text-md  mb-2"
//                                   htmlFor="fitnessCertificate"
//                                 >
//                                   Fitness Certificate:
//                                 </label>

//                                 <div className="flex items-center justify-between mb-2">
//                                   <IKContext
//                                     publicKey={publicKey}
//                                     urlEndpoint={urlEndpoint}
//                                     authenticator={authenticator}
//                                   >
//                                     <IKUpload
//                                       required
//                                       className="form-control border border-gray-300 rounded-lg p-2 flex-1 mr-2"
//                                       fileName={`${uid}_fitnessCertificate.jpg`}
//                                       folder="Home/Tripto/drivers"
//                                       tags={["fitnessCertificate"]}
//                                       useUniqueFileName={false}
//                                       isPrivateFile={false}
//                                       onSuccess={(r) => {
//                                         setFitnessCertificate(r.url);
//                                         alert("Uploaded");
//                                       }}
//                                       onError={(e) => console.log(e)}
//                                     />
//                                   </IKContext>
//                                   {docsView.fitnessCertificate ? (
//                                     <button className="bg-blue-500 text-white rounded-lg btn btn-sm hover:bg-blue-600 mr-2">
//                                       <a
//                                         className="text-decoration-none"
//                                         href={docsView.fitnessCertificate}
//                                         target="_blank"
//                                         rel="noreferrer"
//                                       >
//                                         View Doc
//                                       </a>
//                                     </button>
//                                   ) : null}

//                                   <span
//                                     className={`text-sm font-semibold px-3 py-1 rounded-full inline-block ${
//                                       statusIndicators.fitnessCertificateStatus ===
//                                       0
//                                         ? "bg-yellow-500 text-white"
//                                         : statusIndicators.fitnessCertificateStatus ===
//                                           1
//                                         ? "bg-green-500 text-white"
//                                         : statusIndicators.fitnessCertificateStatus ===
//                                           2
//                                         ? "bg-red-500 text-white"
//                                         : "bg-yellow-500 text-white"
//                                     }`}
//                                   >
//                                     {statusIndicators.fitnessCertificateStatus ===
//                                     0
//                                       ? "Pending"
//                                       : statusIndicators.fitnessCertificateStatus ===
//                                         1
//                                       ? "Verified"
//                                       : statusIndicators.fitnessCertificateStatus ===
//                                         2
//                                       ? "Rejected"
//                                       : "Pending"}
//                                   </span>

//                                   {statusIndicators.fitnessCertificateStatus ===
//                                     2 &&
//                                     statusIndicators.fitnessCertificateRejectReason && (
//                                       <div className="relative ml-2">
//                                         <Info className="text-red-500 cursor-pointer" />

//                                         <motion.div
//                                           initial={{ opacity: 0, y: -10 }}
//                                           animate={{ opacity: 1, y: 0 }}
//                                           exit={{ opacity: 0, y: -10 }}
//                                           className="absolute right-0 mt-2 w-48 p-2 bg-white border border-gray-300 rounded shadow-lg z-10"
//                                           style={{
//                                             transform: "translateX(-100%)",
//                                           }}
//                                         >
//                                           {
//                                             statusIndicators.fitnessCertificateRejectReason
//                                           }
//                                         </motion.div>
//                                       </div>
//                                     )}
//                                 </div>
//                               </div>
//                             )}

//                             {statusIndicators.taxReceiptStatus === 1 ? (
//                               ""
//                             ) : (
//                               <div className="py-2 px-4">
//                                 <label
//                                   className="block text-md  mb-2"
//                                   htmlFor="taxReceipt"
//                                 >
//                                   Tax Receipt:
//                                 </label>

//                                 <div className="flex items-center justify-between mb-2">
//                                   <IKContext
//                                     publicKey={publicKey}
//                                     urlEndpoint={urlEndpoint}
//                                     authenticator={authenticator}
//                                   >
//                                     <IKUpload
//                                       required
//                                       className="form-control border border-gray-300 rounded-lg p-2 flex-1 mr-2"
//                                       fileName={`${uid}_taxReceipt.jpg`}
//                                       folder="Home/Tripto/drivers"
//                                       tags={["taxReceipt"]}
//                                       useUniqueFileName={false}
//                                       isPrivateFile={false}
//                                       onSuccess={(r) => {
//                                         setTaxReceipt(r.url);
//                                         alert("Uploaded");
//                                       }}
//                                       onError={(e) => console.log(e)}
//                                     />
//                                   </IKContext>
//                                   {docsView.taxReceipt ? (
//                                     <button className="bg-blue-500 text-white rounded-lg btn btn-sm hover:bg-blue-600 mr-2">
//                                       <a
//                                         className="text-decoration-none"
//                                         href={docsView.taxReceipt}
//                                         target="_blank"
//                                         rel="noreferrer"
//                                       >
//                                         View Doc
//                                       </a>
//                                     </button>
//                                   ) : null}

//                                   <span
//                                     className={`text-sm font-semibold px-3 py-1 rounded-full inline-block ${
//                                       statusIndicators.taxReceiptStatus === 0
//                                         ? "bg-yellow-500 text-white"
//                                         : statusIndicators.taxReceiptStatus ===
//                                           1
//                                         ? "bg-green-500 text-white"
//                                         : statusIndicators.taxReceiptStatus ===
//                                           2
//                                         ? "bg-red-500 text-white"
//                                         : "bg-yellow-500 text-white"
//                                     }`}
//                                   >
//                                     {statusIndicators.taxReceiptStatus === 0
//                                       ? "Pending"
//                                       : statusIndicators.taxReceiptStatus === 1
//                                       ? "Verified"
//                                       : statusIndicators.taxReceiptStatus === 2
//                                       ? "Rejected"
//                                       : "Pending"}
//                                   </span>

//                                   {statusIndicators.taxReceiptStatus === 2 &&
//                                     statusIndicators.taxReceiptRejectReason && (
//                                       <div className="relative ml-2">
//                                         <Info className="text-red-500 cursor-pointer" />

//                                         <motion.div
//                                           initial={{ opacity: 0, y: -10 }}
//                                           animate={{ opacity: 1, y: 0 }}
//                                           exit={{ opacity: 0, y: -10 }}
//                                           className="absolute right-0 mt-2 w-48 p-2 bg-white border border-gray-300 rounded shadow-lg z-10"
//                                           style={{
//                                             transform: "translateX(-100%)",
//                                           }}
//                                         >
//                                           {
//                                             statusIndicators.taxReceiptRejectReason
//                                           }
//                                         </motion.div>
//                                       </div>
//                                     )}
//                                 </div>
//                               </div>
//                             )}
//                           </>
//                         )}
//                       </AnimatePresence>
//                     </div>
//                     {statusIndicators.all_documents_status === 1 ? (
//                       ""
//                     ) : (
//                       <input
//                         type="submit"
//                         value="Submit"
//                         className="form-control bg-gradient-to-r from-[#0bbfe0] to-[#077286] text-white my-2"
//                       />
//                     )}
//                   </form>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }


"use client"

import { useEffect, useState } from "react"
import { AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { IKContext, IKUpload } from "imagekitio-react"
import axiosInstance from "../../API/axiosInstance"
import secureLocalStorage from "react-secure-storage"
import toast from "react-hot-toast"

import {
  CheckCircle,
  Upload,
  Save,
  RefreshCw,
  User,
  Car,
  FileText,
  Camera,
  CreditCard,
  Shield,
  Award,
  FileCheck,
  AlertCircle,
  ChevronDown,
  Eye,
  Mail,
  Phone,
  Calendar,
  Hash,
  Type,
  ArrowRight,
  Loader,
} from "lucide-react"

export default function DriverDocumentVerification() {
  const navigate = useNavigate()
  const uid = localStorage.getItem("@secure.n.uid")
  const decryptedUID = secureLocalStorage.getItem("uid")
  const [aadharFront, setAadharFront] = useState("")
  const [aadharBack, setAadharBack] = useState("")
  const [panCardFront, setPanCardFront] = useState("")
  const [drivingLicenseFront, setDrivingLicenseFront] = useState("")
  const [drivingLicenseBack, setDrivingLicenseBack] = useState("")
  const [selfie, setSelfie] = useState("")
  const [passbookOrCheque, setPassbookOrCheque] = useState("")
  const [rc, setRc] = useState("")
  const [puc, setPuc] = useState("")
  const [insurance, setInsurance] = useState("")
  const [permit, setPermit] = useState("")
  const [fitnessCertificate, setFitnessCertificate] = useState("")
  const [taxReceipt, setTaxReceipt] = useState("")
  const [statusIndicators, setStatusIndicators] = useState({})
  const [previousEmail, setPreviousEmail] = useState("")
  const [dcdID, setDcdID] = useState("")

  const [docsView, setDocsView] = useState({
    aadharFront: "",
    aadharBack: "",
    panCardFront: "",
    drivingLicenseFront: "",
    drivingLicenseBack: "",
    selfie: "",
    passbookOrCheque: "",
    rc: "",
    puc: "",
    insurance: "",
    permit: "",
    fitnessCertificate: "",
    taxReceipt: "",
  })
  const [carDetails, setCarDetails] = useState({
    uid: decryptedUID,
    car_name: "",
    model_year: "",
    car_number: "",
    car_type: "",
    submit_status: "",
  })

  const [carDetails2, setCarDetails2] = useState({
    uid: decryptedUID,
    car_name: "",
    model_year: "",
    car_number: "",
    car_type: "",
    submit_status: "",
  })
  const [profileData, setProfileData] = useState({
    uid: decryptedUID,
    name: "",
    email: "",
    emailOtp: "",
    phone_number: "",
  })
  const [updatedProfileData, setUpdatedProfileData] = useState({
    uid: decryptedUID,
    name: "",
    email: "",
    emailOtp: "",
    phone_number: "",
  })

  // UI state
  const [activeSection, setActiveSection] = useState("personal")
  const [isLoading, setIsLoading] = useState(true)
  const [uploadingDoc, setUploadingDoc] = useState(null)

  const handleEmailVerification = async () => {
    try {
      const res = await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/drivers/sendProfileUpdateEmailVerification`,
        { decryptedUID },
      )

      setPreviousEmail(res.data.email)
      if (res.data.success) {
        toast.success("Email verification code sent successfully to your registered email")
      }
    } catch (error) {
      console.error(error)
      toast.error("An error occurred while sending email verification code")
    }
  }

  const confirmEmailVerification = async () => {
    try {
      const res = await axiosInstance.post(`${process.env.REACT_APP_BASE_URL}/auth/confirmEmail`, {
        email: previousEmail,
        emailOtp: updatedProfileData.emailOtp,
      })

      if (res.data.success) {
        toast.success("Email verified successfully")
      } else {
        toast.error("Failed to verify Email Otp")
      }
    } catch (error) {
      console.error(error)
      toast.error("Invalid OTP")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const formData = {
        uid: decryptedUID,
        dcd_id: dcdID,
        // Personal Details
        aadharFront: aadharFront,
        aadharBack: aadharBack,
        panCardFront: panCardFront,
        drivingLicenseFront: drivingLicenseFront,
        drivingLicenseBack: drivingLicenseBack,
        selfie: selfie,
        passbookOrCheque: passbookOrCheque,

        // Car Details
        rc: rc,
        puc: puc,
        insurance: insurance,
        permit: permit,
        fitnessCertificate: fitnessCertificate,
        taxReceipt: taxReceipt,
      }

      if (formData === null) throw Error

      toast.promise(
        axiosInstance.post(`${process.env.REACT_APP_BASE_URL}/drivers/document_upload`, { formData, decryptedUID }),
        {
          loading: "Uploading documents...",
          success: () => {
            setTimeout(() => window.location.reload(), 1500)
            return "Documents successfully uploaded! Please wait for verification."
          },
          error: "Failed to upload documents. Please try again.",
        },
      )
    } catch (error) {
      console.error("Error:", error)
      toast.error("An error occurred while uploading your documents.")
    }
  }

  const authenticator = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/drivers/drivers_document_auth`)

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Request failed with status ${response.status}: ${errorText}`)
      }

      const data = await response.json()
      const { signature, expire, token } = data
      console.log("Authentication parameters:", { signature, expire, token })
      return { signature, expire, token }
    } catch (error) {
      console.error(`Authentication request failed: ${error.message}`)
      throw new Error(`Authentication request failed: ${error.message}`)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Fetch all data in parallel
        const [statusResponse, profileResponse, carResponse, docLinksResponse, dcdIDResponse] = await Promise.all([
          axiosInstance.post(`${process.env.REACT_APP_BASE_URL}/drivers/fetchParticularDocStatus`, { decryptedUID }),
          axiosInstance.post(`${process.env.REACT_APP_BASE_URL}/drivers/fetchProfileData`, { decryptedUID }),
          axiosInstance.post(`${process.env.REACT_APP_BASE_URL}/drivers/fetchCarDetails`, { decryptedUID }),
          axiosInstance.post(`${process.env.REACT_APP_BASE_URL}/drivers/fetchDocLinks`, { decryptedUID }),
          axiosInstance.post(`${process.env.REACT_APP_BASE_URL}/drivers/fetchDcdID`, { decryptedUID }),
        ])

        setStatusIndicators(statusResponse.data)
        setProfileData(profileResponse.data)
        setCarDetails2(carResponse.data)
        setDocsView(docLinksResponse.data)
        setDcdID(dcdIDResponse.data)

        // Set document states based on fetched links
        if (docLinksResponse.data.aadharFront) setAadharFront(docLinksResponse.data.aadharFront)
        if (docLinksResponse.data.aadharBack) setAadharBack(docLinksResponse.data.aadharBack)
        if (docLinksResponse.data.panCardFront) setPanCardFront(docLinksResponse.data.panCardFront)
        if (docLinksResponse.data.drivingLicenseFront) setDrivingLicenseFront(docLinksResponse.data.drivingLicenseFront)
        if (docLinksResponse.data.drivingLicenseBack) setDrivingLicenseBack(docLinksResponse.data.drivingLicenseBack)
        if (docLinksResponse.data.selfie) setSelfie(docLinksResponse.data.selfie)
        if (docLinksResponse.data.passbookOrCheque) setPassbookOrCheque(docLinksResponse.data.passbookOrCheque)
        if (docLinksResponse.data.rc) setRc(docLinksResponse.data.rc)
        if (docLinksResponse.data.puc) setPuc(docLinksResponse.data.puc)
        if (docLinksResponse.data.insurance) setInsurance(docLinksResponse.data.insurance)
        if (docLinksResponse.data.permit) setPermit(docLinksResponse.data.permit)
        if (docLinksResponse.data.fitnessCertificate) setFitnessCertificate(docLinksResponse.data.fitnessCertificate)
        if (docLinksResponse.data.taxReceipt) setTaxReceipt(docLinksResponse.data.taxReceipt)

        // Initialize updatedProfileData with current profile data
        setUpdatedProfileData({
          uid: decryptedUID,
          name: profileResponse.data.name || "",
          email: profileResponse.data.email || "",
          emailOtp: "",
          phone_number: profileResponse.data.phone_number || "",
        })
      } catch (error) {
        console.error("Error fetching data:", error.message)
        toast.error("Failed to load your data. Please refresh the page.")
      } finally {
        setIsLoading(false)
      }
    }

    if (decryptedUID) {
      fetchData()
    }
  }, [decryptedUID])

  const handleProfileEdit = async (e) => {
    e.preventDefault()

    try {
      const verifyEmailRes = await axiosInstance.post(`${process.env.REACT_APP_BASE_URL}/auth/confirmEmail`, {
        email: previousEmail,
        emailOtp: updatedProfileData.emailOtp,
      })

      if (!verifyEmailRes.data.success) {
        toast.error("Email OTP verification failed")
        return
      }

      toast.promise(
        axiosInstance.post(`${process.env.REACT_APP_BASE_URL}/drivers/updateProfile`, {
          updatedProfileData,
          decryptedUID,
        }),
        {
          loading: "Updating profile...",
          success: (res) => {
            if (updatedProfileData.email !== previousEmail) {
              setTimeout(() => {
                window.localStorage.removeItem("token")
                window.localStorage.removeItem("user_type")
                navigate("/")
              }, 2000)
              return "Profile updated. Please login again with your new email."
            } else {
              setTimeout(() => window.location.reload(), 1500)
              return "Profile updated successfully!"
            }
          },
          error: "Failed to update profile. Please try again.",
        },
      )
    } catch (error) {
      console.error("Error:", error)
      toast.error("An error occurred while updating your profile.")
    }
  }

  const BackToLogin = () => {
    navigate("/")
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    setUpdatedProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target

    setCarDetails((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleCarForm = async (e) => {
    e.preventDefault()

    try {
      toast.promise(
        axiosInstance.post(`${process.env.REACT_APP_BASE_URL}/drivers/uploadCarDetails`, { carDetails, decryptedUID }),
        {
          loading: "Saving car details...",
          success: (res) => {
            if (res.status === 200) {
              setTimeout(() => window.location.reload(), 1500)
              return "Car details saved successfully!"
            } else {
              return "Failed to save car details."
            }
          },
          error: (err) => {
            return "Check your car details. Car number should be in the format 'MH04CG7475'"
          },
        },
      )
    } catch (error) {
      console.error("Error: ", error)
    }
  }

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear()
    const years = []

    for (let year = currentYear; year >= currentYear - 50; year--) {
      years.push(year)
    }

    return years.map((year) => (
      <option key={year} value={year}>
        {year}
      </option>
    ))
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 0:
        return "bg-amber-500"
      case 1:
        return "bg-emerald-500"
      case 2:
        return "bg-rose-500"
      default:
        return "bg-amber-500"
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 0:
        return "Pending"
      case 1:
        return "Verified"
      case 2:
        return "Rejected"
      default:
        return "Pending"
    }
  }

  if (!uid) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full text-center">
          <AlertCircle size={48} className="mx-auto mb-4 text-rose-500" />
          <h2 className="text-2xl font-bold mb-4">Invalid URL</h2>
          <p className="mb-6 text-gray-600">Please provide a valid UID to access this page.</p>
          <button
            onClick={BackToLogin}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center mx-auto"
          >
            Back to Login
            <ArrowRight size={18} className="ml-2" />
          </button>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="animate-spin">
          <RefreshCw size={48} className="text-cyan-500" />
        </div>
        <p className="mt-4 text-lg font-medium text-gray-700">Loading your information...</p>
      </div>
    )
  }

  const publicKey = "public_ytabO1+xt+yMhICKtVeVGbWi/u8="
  const urlEndpoint = "https://ik.imagekit.io/TriptoServices"

  // Document sections
  const personalDocuments = [
    {
      id: "aadharFront",
      name: "Aadhar Front",
      status: statusIndicators.aadharFrontStatus,
      rejectReason: statusIndicators.aadharFrontRejectReason,
      viewUrl: docsView.aadharFront,
      fileName: `${uid}_aadharFront.jpg`,
      setFunc: setAadharFront,
      icon: <FileText className="text-cyan-600" />,
    },
    {
      id: "aadharBack",
      name: "Aadhar Back",
      status: statusIndicators.aadharBackStatus,
      rejectReason: statusIndicators.aadharBackRejectReason,
      viewUrl: docsView.aadharBack,
      fileName: `${uid}_aadharBack.jpg`,
      setFunc: setAadharBack,
      icon: <FileText className="text-cyan-600" />,
    },
    {
      id: "panCardFront",
      name: "PAN Card",
      status: statusIndicators.panCardFrontStatus,
      rejectReason: statusIndicators.panCardFrontRejectReason,
      viewUrl: docsView.panCardFront,
      fileName: `${uid}_panCardFront.jpg`,
      setFunc: setPanCardFront,
      icon: <CreditCard className="text-cyan-600" />,
    },
    {
      id: "drivingLicenseFront",
      name: "Driving License Front",
      status: statusIndicators.drivingLicenseFrontStatus,
      rejectReason: statusIndicators.drivingLicenseFrontRejectReason,
      viewUrl: docsView.drivingLicenseFront,
      fileName: `${uid}_drivingLicenseFront.jpg`,
      setFunc: setDrivingLicenseFront,
      icon: <FileCheck className="text-cyan-600" />,
    },
    {
      id: "drivingLicenseBack",
      name: "Driving License Back",
      status: statusIndicators.drivingLicenseBackStatus,
      rejectReason: statusIndicators.drivingLicenseBackRejectReason,
      viewUrl: docsView.drivingLicenseBack,
      fileName: `${uid}_drivingLicenseBack.jpg`,
      setFunc: setDrivingLicenseBack,
      icon: <FileCheck className="text-cyan-600" />,
    },
    {
      id: "selfie",
      name: "Passport Photo",
      status: statusIndicators.selfieStatus,
      rejectReason: statusIndicators.selfieRejectReason,
      viewUrl: docsView.selfie,
      fileName: `${uid}_selfie.jpg`,
      setFunc: setSelfie,
      icon: <Camera className="text-cyan-600" />,
    },
    {
      id: "passbookOrCheque",
      name: "Passbook/Cheque",
      status: statusIndicators.passbookOrChequeStatus,
      rejectReason: statusIndicators.passbookOrChequeRejectReason,
      viewUrl: docsView.passbookOrCheque,
      fileName: `${uid}_passbookOrCheque.jpg`,
      setFunc: setPassbookOrCheque,
      icon: <CreditCard className="text-cyan-600" />,
    },
  ]

  const vehicleDocuments = [
    {
      id: "rc",
      name: "RC",
      status: statusIndicators.rcStatus,
      rejectReason: statusIndicators.rcRejectReason,
      viewUrl: docsView.rc,
      fileName: `${uid}_rc.jpg`,
      setFunc: setRc,
      icon: <FileText className="text-cyan-600" />,
    },
    {
      id: "puc",
      name: "PUC",
      status: statusIndicators.pucStatus,
      rejectReason: statusIndicators.pucRejectReason,
      viewUrl: docsView.puc,
      fileName: `${uid}_puc.jpg`,
      setFunc: setPuc,
      icon: <Shield className="text-cyan-600" />,
    },
    {
      id: "insurance",
      name: "Insurance",
      status: statusIndicators.insuranceStatus,
      rejectReason: statusIndicators.insuranceRejectReason,
      viewUrl: docsView.insurance,
      fileName: `${uid}_insurance.jpg`,
      setFunc: setInsurance,
      icon: <Shield className="text-cyan-600" />,
    },
    {
      id: "permit",
      name: "Permit",
      status: statusIndicators.permitStatus,
      rejectReason: statusIndicators.permitRejectReason,
      viewUrl: docsView.permit,
      fileName: `${uid}_permit.jpg`,
      setFunc: setPermit,
      icon: <FileCheck className="text-cyan-600" />,
    },
    {
      id: "fitnessCertificate",
      name: "Fitness Certificate",
      status: statusIndicators.fitnessCertificateStatus,
      rejectReason: statusIndicators.fitnessCertificateRejectReason,
      viewUrl: docsView.fitnessCertificate,
      fileName: `${uid}_fitnessCertificate.jpg`,
      setFunc: setFitnessCertificate,
      icon: <Award className="text-cyan-600" />,
    },
    {
      id: "taxReceipt",
      name: "Tax Receipt",
      status: statusIndicators.taxReceiptStatus,
      rejectReason: statusIndicators.taxReceiptRejectReason,
      viewUrl: docsView.taxReceipt,
      fileName: `${uid}_taxReceipt.jpg`,
      setFunc: setTaxReceipt,
      icon: <FileText className="text-cyan-600" />,
    },
  ]

  const renderDocumentItem = (doc) => {
    // Skip if already verified
    if (doc.status === 1) return null

    return (
      <div key={doc.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-4">
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              {doc.icon}
              <h3 className="font-medium ml-2">{doc.name}</h3>
            </div>
            <div className="flex items-center space-x-2">
              {doc.viewUrl && (
                <a
                  href={doc.viewUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center text-xs bg-cyan-50 text-cyan-600 px-2 py-1 rounded-md hover:bg-cyan-100 transition-colors"
                >
                  <Eye size={14} className="mr-1" />
                  View
                </a>
              )}
              <span className={`text-xs px-2 py-1 rounded-md text-white ${getStatusColor(doc.status)}`}>
                {getStatusText(doc.status)}
              </span>
            </div>
          </div>

          {doc.status === 2 && doc.rejectReason && (
            <div className="bg-rose-50 text-rose-700 p-2 rounded-md text-xs mb-3 flex items-start">
              <AlertCircle size={14} className="mr-1 mt-0.5 flex-shrink-0" />
              <span>{doc.rejectReason}</span>
            </div>
          )}

          <div className="flex flex-col items-start mt-2">
            {uploadingDoc === doc.id ? (
              <div className="w-full flex items-center justify-center p-3 bg-gray-50 rounded-md">
                <Loader size={20} className="animate-spin text-cyan-500 mr-2" />
                <span className="text-sm text-gray-500">Uploading...</span>
              </div>
            ) : (
              <>
                <IKContext publicKey={publicKey} urlEndpoint={urlEndpoint} authenticator={authenticator}>
                  <IKUpload
                    className="w-full bg-gradient-to-r from-cyan-50 to-teal-50 border border-cyan-100 rounded-lg p-3 text-sm cursor-pointer hover:bg-gradient-to-r hover:from-cyan-100 hover:to-teal-100 transition-all duration-300"
                    fileName={doc.fileName}
                    folder="Home/Tripto/drivers"
                    tags={[doc.id]}
                    useUniqueFileName={false}
                    isPrivateFile={false}
                    onUploadStart={() => setUploadingDoc(doc.id)}
                    onSuccess={(r) => {
                      doc.setFunc(r.url)
                      setUploadingDoc(null)
                      toast.success(`${doc.name} uploaded successfully`)
                    }}
                    onError={(e) => {
                      console.log(e)
                      setUploadingDoc(null)
                      toast.error(`Failed to upload ${doc.name}`)
                    }}
                  />
                </IKContext>

                {doc.viewUrl && (
                  <div className="mt-2 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-md">
                    ✅ {doc.name} uploaded successfully
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-500 to-teal-600 rounded-t-2xl p-6 text-white">
          <h1 className="text-2xl md:text-3xl font-bold mb-2 flex items-center">
            <FileCheck className="mr-3" size={28} />
            Driver Document Verification
          </h1>
          <p className="opacity-90">Complete your profile and upload required documents to get verified</p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white border-b border-gray-200 flex overflow-x-auto">
          <button
            onClick={() => setActiveSection("personal")}
            className={`px-6 py-4 font-medium text-sm flex items-center whitespace-nowrap transition-colors ${activeSection === "personal"
                ? "text-cyan-600 border-b-2 border-cyan-500"
                : "text-gray-600 hover:text-cyan-500"
              }`}
          >
            <User size={18} className="mr-2" />
            Personal Information
          </button>
          <button
            onClick={() => setActiveSection("car")}
            className={`px-6 py-4 font-medium text-sm flex items-center whitespace-nowrap transition-colors ${activeSection === "car" ? "text-cyan-600 border-b-2 border-cyan-500" : "text-gray-600 hover:text-cyan-500"
              }`}
          >
            <Car size={18} className="mr-2" />
            Car Information
          </button>
          <button
            onClick={() => setActiveSection("documents")}
            className={`px-6 py-4 font-medium text-sm flex items-center whitespace-nowrap transition-colors ${activeSection === "documents"
                ? "text-cyan-600 border-b-2 border-cyan-500"
                : "text-gray-600 hover:text-cyan-500"
              }`}
          >
            <FileText size={18} className="mr-2" />
            Documents
          </button>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-b-2xl shadow-lg p-6">
          <AnimatePresence mode="wait">
            {activeSection === "personal" && (
              <div>
                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
                    <User className="mr-2 text-cyan-600" />
                    Personal Information
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Update your personal details below. Make sure your information is accurate.
                  </p>
                </div>

                <form onSubmit={handleProfileEdit} className="space-y-4">
                  <input type="hidden" name="uid" value={decryptedUID} />

                  <div className="space-y-2">
                    <label htmlFor="name" className="block font-medium text-gray-700">
                      Full Name
                    </label>
                    <div className="relative">
                      <User size={18} className="absolute left-3 top-3 text-gray-400" />
                      <input
                        name="name"
                        type="text"
                        className="pl-10 w-full py-2  border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                        onChange={handleChange}
                        value={updatedProfileData.name || ""}
                        placeholder={profileData.name}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="block font-medium text-gray-700">
                      Email Address
                    </label>
                    <div className="flex flex-col md:flex-row gap-2">
                      <div className="relative flex-grow">
                        <Mail size={18} className="absolute left-3 top-3 text-gray-400" />
                        <input
                          name="email"
                          type="email"
                          className="pl-10 w-full py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                          value={updatedProfileData.email || ""}
                          placeholder={profileData.email}
                          onChange={handleChange}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleEmailVerification}
                        className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-600 text-white rounded-lg hover:shadow-md transition-all duration-300 flex items-center justify-center"
                      >
                        <Mail size={16} className="mr-2" />
                        Send OTP
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="emailOtp" className="block font-medium text-gray-700">
                      Email Verification Code
                    </label>
                    <div className="flex flex-col md:flex-row gap-2">
                      <div className="relative flex-grow">
                        <Shield size={18} className="absolute left-3 top-3 text-gray-400" />
                        <input
                          type="text"
                          id="emailOtp"
                          name="emailOtp"
                          className="pl-10 w-full py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                          value={updatedProfileData.emailOtp || ""}
                          placeholder="Enter verification code"
                          onChange={handleChange}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={confirmEmailVerification}
                        className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-600 text-white rounded-lg hover:shadow-md transition-all duration-300 flex items-center justify-center"
                      >
                        <CheckCircle size={16} className="mr-2" />
                        Verify OTP
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="phone" className="block font-medium text-gray-700">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone size={18} className="absolute left-3 top-3 text-gray-400" />
                      <input
                        name="phone_number"
                        type="text"
                        className="pl-10 w-full py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                        value={updatedProfileData.phone_number || ""}
                        placeholder={profileData.phone_number}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center"
                  >
                    <Save size={18} className="mr-2" />
                    Update Profile
                  </button>
                </form>
              </div>
            )}

            {activeSection === "car" && (
              <div>
                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
                    <Car className="mr-2 text-cyan-600" />
                    Car Information
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Provide details about your vehicle. This information cannot be changed once submitted.
                  </p>
                </div>

                <form onSubmit={handleCarForm} className="space-y-4">
                  <input type="hidden" name="uid" value={decryptedUID} />

                  <div className="space-y-2">
                    <label htmlFor="car_name" className="block font-medium text-gray-700">
                      Car Name
                    </label>
                    <div className="relative">
                      <Car size={18} className="absolute left-3 top-3 text-gray-400" />
                      <input
                        type="text"
                        name="car_name"
                        className="pl-10 w-full py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                        onChange={handleInputChange}
                        required
                        placeholder={carDetails2.car_name || "Enter car name"}
                        value={carDetails.car_name || ""}
                        disabled={carDetails2.submit_status === 1}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="model_year" className="block font-medium text-gray-700">
                      Model Year
                    </label>
                    <div className="relative">
                      <Calendar size={18} className="absolute left-3 top-3 text-gray-400" />
                      <select
                        className="pl-10 w-full py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all appearance-none"
                        name="model_year"
                        onChange={handleInputChange}
                        value={carDetails2.submit_status === 1 ? carDetails2.model_year : carDetails.model_year}
                        disabled={carDetails2.submit_status === 1}
                      >
                        <option value="">Choose Model Year</option>
                        {generateYearOptions()}
                      </select>
                      <ChevronDown size={18} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="car_number" className="block font-medium text-gray-700">
                      Car Number
                    </label>
                    <div className="relative">
                      <Hash size={18} className="absolute left-3 top-3 text-gray-400" />
                      <input
                        type="text"
                        name="car_number"
                        className="pl-10 w-full py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                        onChange={handleInputChange}
                        required
                        placeholder={carDetails2.car_number || "Format: MH04CG7475"}
                        value={carDetails2.submit_status === 1 ? carDetails2.car_number : carDetails.car_number}
                        disabled={carDetails2.submit_status === 1}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="car_type" className="block font-medium text-gray-700">
                      Car Type
                    </label>
                    <div className="relative">
                      <Type size={18} className="absolute left-3 top-3 text-gray-400" />
                      <select
                        name="car_type"
                        className="pl-10 w-full py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all appearance-none"
                        onChange={handleInputChange}
                        required
                        value={carDetails2.submit_status === 1 ? carDetails2.car_type : carDetails.car_type}
                        disabled={carDetails2.submit_status === 1}
                      >
                        <option value="">Choose Car Type</option>
                        <option value={1}>4+1 (SEDAN)</option>
                        <option value={2}>6+1 (SUV, MUV)</option>
                      </select>
                      <ChevronDown size={18} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {carDetails2.submit_status === 1 ? (
                    <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 flex items-center">
                      <CheckCircle size={20} className="mr-2 flex-shrink-0" />
                      <p>Car details have been saved successfully. These details cannot be modified.</p>
                    </div>
                  ) : (
                    <>
                      <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 flex items-center">
                        <AlertCircle size={20} className="mr-2 flex-shrink-0" />
                        <p>Note: Once car details are submitted, you will not be able to update them again.</p>
                      </div>
                      <button
                        type="submit"
                        className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center"
                      >
                        <Save size={18} className="mr-2" />
                        Save Car Details
                      </button>
                    </>
                  )}
                </form>
              </div>
            )}

            {activeSection === "documents" && (
              <div>
                {statusIndicators.all_documents_status === 1 ? (
                  <div className="p-8 text-center">
                    <div>
                      <CheckCircle size={80} className="mx-auto text-emerald-500 mb-4" />
                    </div>
                    <h2 className="text-2xl font-bold text-emerald-700 mb-2">All Documents Verified!</h2>
                    <p className="text-gray-600 mb-6">
                      Congratulations! All your documents have been verified successfully.
                    </p>
                    <button
                      onClick={() => setActiveSection("personal")}
                      className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      Go to Profile
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                      <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
                        <FileText className="mr-2 text-cyan-600" />
                        Document Verification
                      </h2>
                      <p className="text-gray-600 mb-4">
                        Upload all required documents for verification. Make sure all documents are clear and legible.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-4 flex items-center">
                          <User className="mr-2 text-cyan-600" />
                          Personal Documents
                        </h3>
                        <div className="space-y-2">{personalDocuments.map((doc) => renderDocumentItem(doc))}</div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-4 flex items-center">
                          <Car className="mr-2 text-cyan-600" />
                          Vehicle Documents
                        </h3>
                        <div className="space-y-2">{vehicleDocuments.map((doc) => renderDocumentItem(doc))}</div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full mt-8 px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center"
                    >
                      <Upload size={18} className="mr-2" />
                      Submit Documents
                    </button>
                  </form>
                )}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}


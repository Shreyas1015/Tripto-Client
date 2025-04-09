// "use client"

// import { useEffect, useState } from "react"
// import { useNavigate } from "react-router-dom"
// import { IKContext, IKUpload } from "imagekitio-react"
// import axiosInstance from "../../API/axiosInstance"
// import secureLocalStorage from "react-secure-storage"
// import { toast } from "react-hot-toast"
// import { motion } from "framer-motion"
// import {
//   User,
//   Mail,
//   Phone,
//   MapPin,
//   Home,
//   City,
//   FileText,
//   Camera,
//   CheckCircle,
//   AlertCircle,
//   ArrowLeft,
//   Edit3,
//   Save,
//   RefreshCw,
// } from "react-feather"

// const PassengerProfileContent = () => {
//   const navigate = useNavigate()
//   const uid = localStorage.getItem("@secure.n.uid")
//   const decryptedUID = secureLocalStorage.getItem("uid")
//   const [previousEmail, setPreviousEmail] = useState("")
//   const [profileIMG, setProfileIMG] = useState("")
//   const [updatedProfileIMG, setUpdatedProfileIMG] = useState("")
//   const [isUploading, setIsUploading] = useState(false)
//   const [activeTab, setActiveTab] = useState("personal")
//   const [isVerified, setIsVerified] = useState(false)
//   const [isEditing, setIsEditing] = useState(false)
//   const [isLoading, setIsLoading] = useState(true)

//   const [updatedProfileData, setUpdatedProfileData] = useState({
//     uid: decryptedUID,
//     name: "",
//     email: "",
//     emailOtp: "",
//     phone_number: "",
//     street: "",
//     city: "",
//     state: "",
//     zip_code: "",
//   })

//   const handleEmailVerification = async () => {
//     try {
//       toast.loading("Sending verification code...")
//       const res = await axiosInstance.post(
//         `${process.env.REACT_APP_BASE_URL}/passengers/sendProfileUpdateEmailVerification`,
//         { decryptedUID },
//       )

//       setPreviousEmail(res.data.email)
//       toast.dismiss()
//       if (res.data.success) {
//         toast.success("Verification code sent to your registered email")
//       }
//     } catch (error) {
//       console.error(error)
//       toast.dismiss()
//       toast.error("Failed to send verification code")
//     }
//   }

//   const confirmEmailVerification = async () => {
//     try {
//       toast.loading("Verifying...")
//       const res = await axiosInstance.post(`${process.env.REACT_APP_BASE_URL}/auth/confirmEmail`, {
//         email: previousEmail,
//         emailOtp: updatedProfileData.emailOtp,
//       })

//       toast.dismiss()
//       if (res.data.success) {
//         setIsVerified(true)
//         toast.success("Email verified successfully")
//       }
//     } catch (error) {
//       console.error(error)
//       toast.dismiss()
//       toast.error("Invalid verification code")
//     }
//   }

//   const authenticator = async () => {
//     try {
//       const response = await fetch(`${process.env.REACT_APP_BASE_URL}/passengers/passenger_document_auth`)

//       if (!response.ok) {
//         const errorText = await response.text()
//         throw new Error(`Request failed with status ${response.status}: ${errorText}`)
//       }

//       const data = await response.json()
//       const { signature, expire, token } = data
//       return { signature, expire, token }
//     } catch (error) {
//       console.error(`Authentication request failed: ${error.message}`)
//       throw new Error(`Authentication request failed: ${error.message}`)
//     }
//   }

//   useEffect(() => {
//     const fetchProfileData = async () => {
//       setIsLoading(true)
//       try {
//         const response = await axiosInstance.post(`${process.env.REACT_APP_BASE_URL}/passengers/fetchProfileData`, {
//           decryptedUID,
//         })

//         if (response.status === 200) {
//           setUpdatedProfileData({
//             ...response.data,
//             street: response.data.street || "",
//             city: response.data.city || "",
//             state: response.data.state || "",
//             zip_code: response.data.zip_code || "",
//           })
//         }
//       } catch (error) {
//         console.error("Error fetching Profile Data:", error.message)
//         toast.error("Failed to load profile data")
//       }
//     }

//     const fetchProfileIMG = async () => {
//       try {
//         const response = await axiosInstance.post(`${process.env.REACT_APP_BASE_URL}/passengers/fetchProfileIMG`, {
//           decryptedUID,
//         })

//         setUpdatedProfileIMG(response.data.link.profile_img)
//       } catch (error) {
//         console.error("Error fetching profile image:", error.message)
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     fetchProfileData()
//     fetchProfileIMG()
//   }, [decryptedUID])

//   const handleProfileEdit = async (e) => {
//     e.preventDefault()

//     try {
//       toast.loading("Updating profile...")

//       // Only verify email if it has changed
//       if (updatedProfileData.email !== previousEmail && previousEmail) {
//         const verifyEmailRes = await axiosInstance.post(`${process.env.REACT_APP_BASE_URL}/auth/confirmEmail`, {
//           email: previousEmail,
//           emailOtp: updatedProfileData.emailOtp,
//         })

//         if (!verifyEmailRes.data.success) {
//           toast.dismiss()
//           toast.error("Email verification failed")
//           return
//         }
//       }

//       const res = await axiosInstance.post(
//         `${process.env.REACT_APP_BASE_URL}/passengers/updateProfile`,
//         updatedProfileData,
//       )

//       toast.dismiss()
//       if (res.status === 200) {
//         if (updatedProfileData.email !== previousEmail && previousEmail) {
//           toast.success("Profile updated. Please login again with your new email.")
//           secureLocalStorage.clear()
//           localStorage.clear()
//           window.location.reload()
//           navigate("/")
//         } else {
//           toast.success("Profile updated successfully")
//           setIsEditing(false)
//           window.location.reload()
//         }
//       }
//     } catch (error) {
//       console.error("Error Updating Profile Data:", error)
//       toast.dismiss()
//       toast.error("Failed to update profile")
//     }
//   }

//   const handleProfileImg = async (e) => {
//     e.preventDefault()
//     try {
//       toast.loading("Uploading profile image...")
//       const formData = {
//         profile_img: profileIMG,
//         uid: decryptedUID,
//       }

//       const res = await axiosInstance.post(`${process.env.REACT_APP_BASE_URL}/passengers/uploadProfileImage`, {
//         formData,
//         decryptedUID,
//       })

//       toast.dismiss()
//       if (res.status === 200) {
//         toast.success("Profile image updated")
//         window.location.reload()
//       }
//     } catch (error) {
//       console.error("Error: ", error)
//       toast.dismiss()
//       toast.error("Failed to upload profile image")
//     }
//   }

//   const handleChange = (e) => {
//     const { name, value } = e.target
//     setUpdatedProfileData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }))
//   }

//   const BackToLogin = () => {
//     navigate("/")
//   }

//   if (!uid) {
//     return (
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 0.5 }}
//         className="container text-center py-5"
//       >
//         <motion.div
//           initial={{ y: -20 }}
//           animate={{ y: 0 }}
//           transition={{ duration: 0.5, delay: 0.2 }}
//           className="bg-white rounded-lg shadow-lg p-5 max-w-md mx-auto"
//         >
//           <AlertCircle size={50} className="text-red-500 mb-3 mx-auto" />
//           <h2 className="text-2xl font-bold mb-4">Invalid Access</h2>
//           <p className="mb-4">Please provide a valid user ID to access this page.</p>
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={BackToLogin}
//             className="px-4 py-2 bg-gradient-to-r from-[#0bbfe0] to-cyan-400 text-white rounded-md shadow-md"
//           >
//             <ArrowLeft size={16} className="inline mr-2" />
//             Back to Login
//           </motion.button>
//         </motion.div>
//       </motion.div>
//     )
//   }

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <motion.div
//           animate={{ rotate: 360 }}
//           transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, ease: "linear" }}
//         >
//           <RefreshCw size={40} className="text-[#0bbfe0]" />
//         </motion.div>
//         <p className="ml-3 text-lg">Loading profile...</p>
//       </div>
//     )
//   }

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.5 }}
//       className="container mx-auto px-4 py-8"
//     >
//       <motion.div
//         initial={{ y: -20 }}
//         animate={{ y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="bg-white rounded-lg shadow-xl overflow-hidden"
//       >
//         {/* Header */}
//         <div className="bg-gradient-to-r from-[#0bbfe0] to-cyan-400 p-6">
//           <div className="flex flex-col md:flex-row items-center justify-between">
//             <h1 className="text-2xl md:text-3xl font-bold text-white mb-4 md:mb-0">Passenger Profile</h1>
//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={() => setIsEditing(!isEditing)}
//               className="px-4 py-2 bg-white text-[#0bbfe0] rounded-md shadow-md flex items-center"
//             >
//               {isEditing ? (
//                 <>
//                   <ArrowLeft size={16} className="mr-2" />
//                   Cancel Editing
//                 </>
//               ) : (
//                 <>
//                   <Edit3 size={16} className="mr-2" />
//                   Edit Profile
//                 </>
//               )}
//             </motion.button>
//           </div>
//         </div>

//         {/* Profile Content */}
//         <div className="p-6">
//           <div className="flex flex-col md:flex-row">
//             {/* Left Column - Profile Image */}
//             <motion.div
//               initial={{ x: -20, opacity: 0 }}
//               animate={{ x: 0, opacity: 1 }}
//               transition={{ duration: 0.5, delay: 0.2 }}
//               className="w-full md:w-1/3 flex flex-col items-center mb-6 md:mb-0"
//             >
//               <div className="relative mb-6 group">
//                 <motion.div
//                   whileHover={{ scale: 1.05 }}
//                   className="w-40 h-40 rounded-full overflow-hidden border-4 border-[#0bbfe0] shadow-lg"
//                 >
//                   <img
//                     className="w-full h-full object-cover"
//                     src={updatedProfileIMG || "https://via.placeholder.com/150?text=Profile"}
//                     alt="Profile"
//                   />
//                 </motion.div>
//                 {isEditing && (
//                   <motion.div
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     transition={{ duration: 0.3 }}
//                     className="absolute inset-0 flex items-center justify-center"
//                   >
//                     <form onSubmit={handleProfileImg} className="text-center">
//                       <input type="hidden" name="uid" value={decryptedUID} />
//                       <div className="mt-2">
//                         <IKContext
//                           publicKey="public_ytabO1+xt+yMhICKtVeVGbWi/u8="
//                           urlEndpoint="https://ik.imagekit.io/TriptoServices"
//                           authenticator={authenticator}
//                         >
//                           <div className="flex flex-col items-center">
//                             <label className="cursor-pointer bg-white bg-opacity-90 text-[#0bbfe0] p-2 rounded-full shadow-md hover:bg-opacity-100 transition-all">
//                               <Camera size={24} />
//                               <IKUpload
//                                 required
//                                 className="hidden"
//                                 fileName={`${decryptedUID}_passengerProfileIMG.jpg`}
//                                 folder="Home/Tripto/passengers"
//                                 tags={["tag1"]}
//                                 useUniqueFileName={true}
//                                 isPrivateFile={false}
//                                 onUploadStart={() => {
//                                   setIsUploading(true)
//                                   toast.loading("Uploading image...")
//                                 }}
//                                 onSuccess={(r) => {
//                                   setProfileIMG(r.url)
//                                   setIsUploading(false)
//                                   toast.dismiss()
//                                   toast.success("Image uploaded!")
//                                 }}
//                                 onError={(e) => {
//                                   console.error("Upload Error:", e)
//                                   setIsUploading(false)
//                                   toast.dismiss()
//                                   toast.error("Upload failed!")
//                                 }}
//                               />
//                             </label>
//                             {profileIMG && (
//                               <motion.button
//                                 whileHover={{ scale: 1.05 }}
//                                 whileTap={{ scale: 0.95 }}
//                                 type="submit"
//                                 className="mt-3 px-4 py-2 bg-gradient-to-r from-[#0bbfe0] to-cyan-400 text-white rounded-md shadow-md flex items-center"
//                                 disabled={isUploading}
//                               >
//                                 <Save size={16} className="mr-2" />
//                                 Save Image
//                               </motion.button>
//                             )}
//                           </div>
//                         </IKContext>
//                       </div>
//                     </form>
//                   </motion.div>
//                 )}
//               </div>

//               <h2 className="text-2xl font-bold text-gray-800 mb-2">{updatedProfileData.name || "Passenger Name"}</h2>
//               <div className="flex items-center text-gray-600 mb-6">
//                 <Mail size={16} className="mr-2" />
//                 <span>{updatedProfileData.email || "email@example.com"}</span>
//               </div>

//               {/* Navigation Tabs */}
//               <div className="w-full max-w-xs">
//                 <motion.button
//                   whileHover={{ scale: 1.03 }}
//                   whileTap={{ scale: 0.97 }}
//                   onClick={() => setActiveTab("personal")}
//                   className={`w-full mb-2 px-4 py-3 rounded-md flex items-center ${
//                     activeTab === "personal"
//                       ? "bg-gradient-to-r from-[#0bbfe0] to-cyan-400 text-white shadow-md"
//                       : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                   }`}
//                 >
//                   <User size={18} className="mr-3" />
//                   Personal Info
//                 </motion.button>

//                 <motion.button
//                   whileHover={{ scale: 1.03 }}
//                   whileTap={{ scale: 0.97 }}
//                   onClick={() => setActiveTab("address")}
//                   className={`w-full px-4 py-3 rounded-md flex items-center ${
//                     activeTab === "address"
//                       ? "bg-gradient-to-r from-[#0bbfe0] to-cyan-400 text-white shadow-md"
//                       : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                   }`}
//                 >
//                   <MapPin size={18} className="mr-3" />
//                   Address Details
//                 </motion.button>
//               </div>
//             </motion.div>

//             {/* Right Column - Profile Form */}
//             <motion.div
//               initial={{ x: 20, opacity: 0 }}
//               animate={{ x: 0, opacity: 1 }}
//               transition={{ duration: 0.5, delay: 0.3 }}
//               className="w-full md:w-2/3 md:pl-8"
//             >
//               <form onSubmit={handleProfileEdit}>
//                 <input type="hidden" name="uid" value={decryptedUID} />

//                 {/* Personal Info Tab */}
//                 {activeTab === "personal" && (
//                   <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
//                     <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
//                       <User size={20} className="mr-2 text-[#0bbfe0]" />
//                       Personal Information
//                     </h3>

//                     <div className="mb-4">
//                       <label className="block text-gray-700 text-sm font-medium mb-2">Full Name</label>
//                       <div className={`relative rounded-md shadow-sm ${!isEditing ? "bg-gray-50" : ""}`}>
//                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                           <User size={16} className="text-gray-400" />
//                         </div>
//                         <input
//                           name="name"
//                           type="text"
//                           className={`block w-full pl-10 pr-3 py-3 border ${!isEditing ? "border-gray-200 bg-gray-50" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-[#0bbfe0] focus:border-transparent`}
//                           required
//                           value={updatedProfileData.name || ""}
//                           onChange={handleChange}
//                           disabled={!isEditing}
//                         />
//                       </div>
//                     </div>

//                     <div className="mb-4">
//                       <label className="block text-gray-700 text-sm font-medium mb-2">Email Address</label>
//                       <div className="flex flex-col md:flex-row gap-3">
//                         <div className={`relative rounded-md shadow-sm flex-grow ${!isEditing ? "bg-gray-50" : ""}`}>
//                           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                             <Mail size={16} className="text-gray-400" />
//                           </div>
//                           <input
//                             name="email"
//                             type="email"
//                             className={`block w-full pl-10 pr-3 py-3 border ${!isEditing ? "border-gray-200 bg-gray-50" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-[#0bbfe0] focus:border-transparent`}
//                             required
//                             value={updatedProfileData.email || ""}
//                             onChange={handleChange}
//                             disabled={!isEditing}
//                           />
//                         </div>

//                         {isEditing && (
//                           <motion.button
//                             whileHover={{ scale: 1.05 }}
//                             whileTap={{ scale: 0.95 }}
//                             type="button"
//                             onClick={handleEmailVerification}
//                             className="px-4 py-3 bg-gradient-to-r from-[#0bbfe0] to-cyan-400 text-white rounded-md shadow-md whitespace-nowrap"
//                           >
//                             Send OTP
//                           </motion.button>
//                         )}
//                       </div>
//                     </div>

//                     {isEditing && (
//                       <motion.div
//                         initial={{ height: 0, opacity: 0 }}
//                         animate={{ height: "auto", opacity: 1 }}
//                         transition={{ duration: 0.3 }}
//                         className="mb-4"
//                       >
//                         <label className="block text-gray-700 text-sm font-medium mb-2">Verification Code</label>
//                         <div className="flex flex-col md:flex-row gap-3">
//                           <div className="relative rounded-md shadow-sm flex-grow">
//                             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                               <FileText size={16} className="text-gray-400" />
//                             </div>
//                             <input
//                               name="emailOtp"
//                               type="text"
//                               className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0bbfe0] focus:border-transparent"
//                               placeholder="Enter verification code"
//                               value={updatedProfileData.emailOtp || ""}
//                               onChange={handleChange}
//                             />
//                           </div>

//                           <motion.button
//                             whileHover={{ scale: 1.05 }}
//                             whileTap={{ scale: 0.95 }}
//                             type="button"
//                             onClick={confirmEmailVerification}
//                             className="px-4 py-3 bg-gradient-to-r from-green-500 to-green-400 text-white rounded-md shadow-md whitespace-nowrap"
//                           >
//                             <CheckCircle size={16} className="inline mr-2" />
//                             Verify
//                           </motion.button>
//                         </div>
//                         {isVerified && (
//                           <p className="mt-2 text-green-500 flex items-center">
//                             <CheckCircle size={16} className="mr-2" />
//                             Email verified successfully
//                           </p>
//                         )}
//                       </motion.div>
//                     )}

//                     <div className="mb-4">
//                       <label className="block text-gray-700 text-sm font-medium mb-2">Phone Number</label>
//                       <div className={`relative rounded-md shadow-sm ${!isEditing ? "bg-gray-50" : ""}`}>
//                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                           <Phone size={16} className="text-gray-400" />
//                         </div>
//                         <input
//                           name="phone_number"
//                           type="text"
//                           className={`block w-full pl-10 pr-3 py-3 border ${!isEditing ? "border-gray-200 bg-gray-50" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-[#0bbfe0] focus:border-transparent`}
//                           required
//                           value={updatedProfileData.phone_number || ""}
//                           onChange={handleChange}
//                           disabled={!isEditing}
//                         />
//                       </div>
//                     </div>
//                   </motion.div>
//                 )}

//                 {/* Address Tab */}
//                 {activeTab === "address" && (
//                   <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
//                     <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
//                       <MapPin size={20} className="mr-2 text-[#0bbfe0]" />
//                       Address Information
//                     </h3>

//                     <div className="mb-4">
//                       <label className="block text-gray-700 text-sm font-medium mb-2">Street Address</label>
//                       <div className={`relative rounded-md shadow-sm ${!isEditing ? "bg-gray-50" : ""}`}>
//                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                           <Home size={16} className="text-gray-400" />
//                         </div>
//                         <input
//                           name="street"
//                           type="text"
//                           className={`block w-full pl-10 pr-3 py-3 border ${!isEditing ? "border-gray-200 bg-gray-50" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-[#0bbfe0] focus:border-transparent`}
//                           value={updatedProfileData.street || ""}
//                           onChange={handleChange}
//                           disabled={!isEditing}
//                           placeholder="Enter your street address"
//                         />
//                       </div>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                       <div>
//                         <label className="block text-gray-700 text-sm font-medium mb-2">City</label>
//                         <div className={`relative rounded-md shadow-sm ${!isEditing ? "bg-gray-50" : ""}`}>
//                           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                             <City size={16} className="text-gray-400" />
//                           </div>
//                           <input
//                             name="city"
//                             type="text"
//                             className={`block w-full pl-10 pr-3 py-3 border ${!isEditing ? "border-gray-200 bg-gray-50" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-[#0bbfe0] focus:border-transparent`}
//                             value={updatedProfileData.city || ""}
//                             onChange={handleChange}
//                             disabled={!isEditing}
//                             placeholder="Enter your city"
//                           />
//                         </div>
//                       </div>

//                       <div>
//                         <label className="block text-gray-700 text-sm font-medium mb-2">State</label>
//                         <div className={`relative rounded-md shadow-sm ${!isEditing ? "bg-gray-50" : ""}`}>
//                           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                             <MapPin size={16} className="text-gray-400" />
//                           </div>
//                           <input
//                             name="state"
//                             type="text"
//                             className={`block w-full pl-10 pr-3 py-3 border ${!isEditing ? "border-gray-200 bg-gray-50" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-[#0bbfe0] focus:border-transparent`}
//                             value={updatedProfileData.state || ""}
//                             onChange={handleChange}
//                             disabled={!isEditing}
//                             placeholder="Enter your state"
//                           />
//                         </div>
//                       </div>
//                     </div>

//                     <div className="mb-4">
//                       <label className="block text-gray-700 text-sm font-medium mb-2">ZIP Code</label>
//                       <div className={`relative rounded-md shadow-sm ${!isEditing ? "bg-gray-50" : ""}`}>
//                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                           <FileText size={16} className="text-gray-400" />
//                         </div>
//                         <input
//                           name="zip_code"
//                           type="text"
//                           className={`block w-full pl-10 pr-3 py-3 border ${!isEditing ? "border-gray-200 bg-gray-50" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-[#0bbfe0] focus:border-transparent`}
//                           value={updatedProfileData.zip_code || ""}
//                           onChange={handleChange}
//                           disabled={!isEditing}
//                           placeholder="Enter your ZIP code"
//                         />
//                       </div>
//                     </div>
//                   </motion.div>
//                 )}

//                 {/* Submit Button */}
//                 {isEditing && (
//                   <motion.div
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.3 }}
//                     className="mt-6"
//                   >
//                     <motion.button
//                       whileHover={{ scale: 1.03 }}
//                       whileTap={{ scale: 0.97 }}
//                       type="submit"
//                       className="w-full py-3 bg-gradient-to-r from-[#0bbfe0] to-cyan-400 text-white rounded-md shadow-md flex items-center justify-center"
//                     >
//                       <Save size={18} className="mr-2" />
//                       Save Profile Changes
//                     </motion.button>
//                   </motion.div>
//                 )}
//               </form>
//             </motion.div>
//           </div>
//         </div>

//         {/* Footer */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.5, delay: 0.5 }}
//           className="bg-gray-50 p-6 border-t border-gray-200"
//         >
//           <div className="flex flex-col md:flex-row justify-between items-center">
//             <p className="text-gray-600 mb-4 md:mb-0">
//               Keep your profile information up to date for a better experience.
//             </p>
//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={BackToLogin}
//               className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md shadow-sm flex items-center"
//             >
//               <ArrowLeft size={16} className="mr-2" />
//               Back to Dashboard
//             </motion.button>
//           </div>
//         </motion.div>
//       </motion.div>
//     </motion.div>
//   )
// }

// export default PassengerProfileContent

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { IKContext, IKUpload } from "imagekitio-react"
import { useNavigate } from "react-router-dom"
import axiosInstance from "../../API/axiosInstance"
import secureLocalStorage from "react-secure-storage"
import { toast, Toaster } from "react-hot-toast"
import {
  User,
  Mail,
  Phone,
  Camera,
  Save,
  ArrowLeft,
  CheckCircle,
  Loader,
  Shield,
  MapPin,
  Home,
  Building,
  Map,
  Settings,
  Bell,
  Lock,
} from "lucide-react"

const PassengerProfileContent = () => {
  const navigate = useNavigate()
  const uid = localStorage.getItem("@secure.n.uid")
  const decryptedUID = secureLocalStorage.getItem("uid")
  const [previousEmail, setPreviousEmail] = useState("")
  const [profileIMG, setProfileIMG] = useState("")
  const [updatedProfileIMG, setUpdatedProfileIMG] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [activeTab, setActiveTab] = useState("personal")
  const [isVerifying, setIsVerifying] = useState(false)
  const [isEmailVerified, setIsEmailVerified] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [updatedProfileData, setUpdatedProfileData] = useState({
    uid: decryptedUID,
    name: "",
    email: "",
    emailOtp: "",
    phone_number: "",
    street: "",
    city: "",
    state: "",
    zip_code: "",
  })

  const handleEmailVerification = async () => {
    try {
      setIsVerifying(true)
      toast.loading("Sending verification code...")
      const res = await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/passengers/sendProfileUpdateEmailVerification`,
        { decryptedUID },
      )

      setPreviousEmail(res.data.email)
      toast.dismiss()
      if (res.data.success) {
        toast.success("Verification code sent to your registered email")
      }
    } catch (error) {
      console.error(error)
      toast.dismiss()
      toast.error("Failed to send verification code")
    } finally {
      setIsVerifying(false)
    }
  }

  const confirmEmailVerification = async () => {
    try {
      setIsVerifying(true)
      toast.loading("Verifying...")
      const res = await axiosInstance.post(`${process.env.REACT_APP_BASE_URL}/auth/confirmEmail`, {
        email: previousEmail,
        emailOtp: updatedProfileData.emailOtp,
      })

      toast.dismiss()
      if (res.data.success) {
        toast.success("Email verified successfully")
        setIsEmailVerified(true)
      } else {
        toast.error("Failed to verify Email OTP")
      }
    } catch (error) {
      console.error(error)
      toast.dismiss()
      toast.error("Invalid verification code")
    } finally {
      setIsVerifying(false)
    }
  }

  const authenticator = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/passengers/passenger_document_auth`)

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Request failed with status ${response.status}: ${errorText}`)
      }

      const data = await response.json()
      const { signature, expire, token } = data
      return { signature, expire, token }
    } catch (error) {
      console.error(`Authentication request failed: ${error.message}`)
      throw new Error(`Authentication request failed: ${error.message}`)
    }
  }

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axiosInstance.post(`${process.env.REACT_APP_BASE_URL}/passengers/fetchProfileData`, {
          decryptedUID,
        })

        console.log("Profile Data Response:", response.data)
        if (response.status === 200) {
          setUpdatedProfileData({
            ...response.data,
            street: response.data.street || "",
            city: response.data.city || "",
            state: response.data.state || "",
            zip_code: response.data.zip_code || "",
          })
        }
      } catch (error) {
        console.error("Error fetching Profile Data:", error.message)
        toast.error("Failed to load profile data")
      }
    }

    const fetchProfileIMG = async () => {
      try {
        const response = await axiosInstance.post(`${process.env.REACT_APP_BASE_URL}/passengers/fetchProfileIMG`, {
          decryptedUID,
        })

        setUpdatedProfileIMG(response.data.link.profile_img)
      } catch (error) {
        console.error("Error fetching profile image:", error.message)
      }
    }

    if (decryptedUID) {
      fetchProfileData()
      fetchProfileIMG()
    }
  }, [decryptedUID])

  const handleProfileEdit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Only verify if OTP was entered and email changed
      if (updatedProfileData.emailOtp && updatedProfileData.email !== previousEmail) {
        const verifyEmailRes = await axiosInstance.post(`${process.env.REACT_APP_BASE_URL}/auth/confirmEmail`, {
          email: previousEmail,
          emailOtp: updatedProfileData.emailOtp,
        })

        if (!verifyEmailRes.data.success) {
          toast.error("Email verification failed")
          setIsSubmitting(false)
          return
        }
      }

      const res = await axiosInstance.post(`${process.env.REACT_APP_BASE_URL}/passengers/updateProfile`, {
        ...updatedProfileData,
        decryptedUID,
      })

      if (res.status === 200) {
        if (updatedProfileData.email !== previousEmail && previousEmail) {
          toast.success("Profile updated. Please login again with your new email.")
          secureLocalStorage.clear()
          localStorage.clear()
          navigate("/")
        } else {
          toast.success("Profile updated successfully")
        }
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("Failed to update profile")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleProfileImg = async (e) => {
    e.preventDefault()
    try {
      const formData = {
        profile_img: profileIMG,
        uid: decryptedUID,
      }

      const res = await axiosInstance.post(`${process.env.REACT_APP_BASE_URL}/passengers/uploadProfileImage`, {
        formData,
        decryptedUID,
      })

      if (res.status === 200) {
        toast.success("Profile image updated!")
        setUpdatedProfileIMG(profileIMG)
      }
    } catch (error) {
      console.error("Error: ", error)
      toast.error("Failed to upload profile image")
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    setUpdatedProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const backToLogin = () => {
    navigate("/")
  }

  if (!uid) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Invalid Access</h2>
          <p className="text-gray-600 mb-6">Please provide a valid user ID to access this page.</p>
          <button
            onClick={backToLogin}
            className="px-6 py-2 bg-[#0bbfe0] text-white rounded-md hover:bg-[#077286] transition-colors flex items-center justify-center mx-auto"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">

      <div className="max-w-6xl mx-auto">

        {/* Profile Card */}
        {/* <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6"> */}
        <div className="bg-gradient-to-r from-[#0bbfe0] to-[#077286] px-6 py-8 text-white relative rounded-lg shadow-md overflow-hidden">
          <div className="flex items-center">
            <div className="relative mr-6">
              <div className="h-24 w-24 rounded-full bg-white/20 backdrop-blur-sm overflow-hidden border-4 border-white/30">
                {updatedProfileIMG ? (
                  <img
                    src={updatedProfileIMG || "/placeholder.svg"}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-[#0bbfe0] text-white text-3xl font-bold">
                    {updatedProfileData.name ? updatedProfileData.name.charAt(0).toUpperCase() : "P"}
                  </div>
                )}
              </div>
              <form onSubmit={handleProfileImg} className="absolute -bottom-2 -right-2">
                <div className="relative">
                  <IKContext
                    publicKey="public_ytabO1+xt+yMhICKtVeVGbWi/u8="
                    urlEndpoint="https://ik.imagekit.io/TriptoServices"
                    authenticator={authenticator}
                  >
                    <IKUpload
                      required
                      className="opacity-0 absolute inset-0 w-10 h-10 cursor-pointer z-10"
                      fileName={`${decryptedUID}_passengerProfileIMG.jpg`}
                      folder="Home/Tripto/passengers"
                      tags={["profile"]}
                      useUniqueFileName={true}
                      isPrivateFile={false}
                      onUploadStart={() => {
                        setIsUploading(true)
                        toast.loading("Uploading image...")
                      }}
                      onSuccess={(r) => {
                        setProfileIMG(r.url)
                        setIsUploading(false)
                        toast.dismiss()
                        toast.success("Upload successful!")
                      }}
                      onError={(e) => {
                        console.error("Upload Error:", e)
                        setIsUploading(false)
                        toast.dismiss()
                        toast.error("Upload failed")
                      }}
                    />
                    <button
                      type="button"
                      className="bg-white text-[#0bbfe0] p-2 rounded-full shadow-md hover:bg-blue-50"
                    >
                      <Camera className="h-4 w-4" />
                    </button>
                  </IKContext>
                </div>
                {profileIMG && (
                  <button
                    type="submit"
                    className="absolute left-full ml-2 bg-white text-[#0bbfe0] p-2 rounded-full shadow-md hover:bg-blue-50"
                  >
                    <Save className="h-4 w-4" />
                  </button>
                )}
              </form>
            </div>
            <div>
              <h2 className="text-2xl font-bold">{updatedProfileData.name || "Passenger Name"}</h2>
              <p className="text-blue-100">{updatedProfileData.email || "email@example.com"}</p>
              <p className="text-blue-100 mt-1">{updatedProfileData.phone_number || "Phone number not provided"}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab("personal")}
              className={`py-4 px-6 font-medium text-sm border-b-2 ${activeTab === "personal"
                ? "border-[#0bbfe0] text-[#0bbfe0]"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
            >
              <User className="inline-block h-4 w-4 mr-2" />
              Personal Info
            </button>
            <button
              onClick={() => setActiveTab("address")}
              className={`py-4 px-6 font-medium text-sm border-b-2 ${activeTab === "address"
                ? "border-[#0bbfe0] text-[#0bbfe0]"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
            >
              <MapPin className="inline-block h-4 w-4 mr-2" />
              Address
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`py-4 px-6 font-medium text-sm border-b-2 ${activeTab === "settings"
                ? "border-[#0bbfe0] text-[#0bbfe0]"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
            >
              <Settings className="inline-block h-4 w-4 mr-2" />
              Settings
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {activeTab === "personal" && (
              <motion.div
                key="personal"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <form onSubmit={handleProfileEdit}>
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={updatedProfileData.name || ""}
                          onChange={handleChange}
                          required
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-[#0bbfe0] focus:border-[#0bbfe0]"
                          placeholder="Your full name"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={updatedProfileData.email || ""}
                          onChange={handleChange}
                          required
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-[#0bbfe0] focus:border-[#0bbfe0]"
                          placeholder="Your email address"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center">
                          <button
                            type="button"
                            onClick={handleEmailVerification}
                            disabled={isVerifying}
                            className="h-full px-4 bg-[#0bbfe0] text-white rounded-r-md hover:bg-[#077286] transition-colors flex items-center"
                          >
                            {isVerifying ? (
                              <Loader className="h-4 w-4 animate-spin" />
                            ) : (
                              <Shield className="h-4 w-4" />
                            )}
                            <span className="ml-2 text-sm">Verify</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {previousEmail && (
                      <div>
                        <label htmlFor="emailOtp" className="block text-sm font-medium text-gray-700 mb-1">
                          Verification Code
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Shield className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            id="emailOtp"
                            name="emailOtp"
                            value={updatedProfileData.emailOtp || ""}
                            onChange={handleChange}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-[#0bbfe0] focus:border-[#0bbfe0]"
                            placeholder="Enter verification code"
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center">
                            <button
                              type="button"
                              onClick={confirmEmailVerification}
                              disabled={isVerifying || !updatedProfileData.emailOtp || isEmailVerified}
                              className={`h-full px-4 rounded-r-md transition-colors flex items-center ${isEmailVerified
                                ? "bg-green-600 text-white hover:bg-green-700"
                                : "bg-[#0bbfe0] text-white hover:bg-[#077286]"
                                }`}
                            >
                              {isVerifying ? (
                                <Loader className="h-4 w-4 animate-spin" />
                              ) : isEmailVerified ? (
                                <>
                                  <CheckCircle className="h-4 w-4" />
                                  <span className="ml-2 text-sm">Verified</span>
                                </>
                              ) : (
                                <span className="text-sm">Confirm</span>
                              )}
                            </button>
                          </div>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                          A verification code has been sent to your email address.
                        </p>
                      </div>
                    )}

                    <div>
                      <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="tel"
                          id="phone_number"
                          name="phone_number"
                          value={updatedProfileData.phone_number || ""}
                          onChange={handleChange}
                          required
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-[#0bbfe0] focus:border-[#0bbfe0]"
                          placeholder="Your phone number"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-[#0bbfe0] text-white rounded-md hover:bg-[#077286] transition-colors flex items-center"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </motion.div>
            )}

            {activeTab === "address" && (
              <motion.div
                key="address"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <form onSubmit={handleProfileEdit}>
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
                        Street Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Home className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="street"
                          name="street"
                          value={updatedProfileData.street || ""}
                          onChange={handleChange}
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-[#0bbfe0] focus:border-[#0bbfe0]"
                          placeholder="Your street address"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                          City
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Building className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            id="city"
                            name="city"
                            value={updatedProfileData.city || ""}
                            onChange={handleChange}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-[#0bbfe0] focus:border-[#0bbfe0]"
                            placeholder="Your city"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                          State
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Map className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            id="state"
                            name="state"
                            value={updatedProfileData.state || ""}
                            onChange={handleChange}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-[#0bbfe0] focus:border-[#0bbfe0]"
                            placeholder="Your state"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="zip_code" className="block text-sm font-medium text-gray-700 mb-1">
                          ZIP Code
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MapPin className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            id="zip_code"
                            name="zip_code"
                            value={updatedProfileData.zip_code || ""}
                            onChange={handleChange}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-[#0bbfe0] focus:border-[#0bbfe0]"
                            placeholder="Your ZIP code"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-[#0bbfe0] text-white rounded-md hover:bg-[#077286] transition-colors flex items-center"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </motion.div>
            )}

            {activeTab === "settings" && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-6">
                  <div className="bg-blue-50 border-l-4 border-[#0bbfe0] p-4 rounded-r-md">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <Bell className="h-5 w-5 text-[#0bbfe0]" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-[#077286]">Account Settings</h3>
                        <p className="mt-2 text-sm text-[#077286]">
                          Manage your account settings and preferences here.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-800">Change Password</h3>
                        <p className="text-sm text-gray-500">Update your account password</p>
                      </div>
                      <button className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors flex items-center">
                        <Lock className="mr-2 h-4 w-4" />
                        Change
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-800">Email Notifications</h3>
                        <p className="text-sm text-gray-500">Receive email updates about your account</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0bbfe0]"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-800">SMS Notifications</h3>
                        <p className="text-sm text-gray-500">Receive text messages for trip updates</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" value="" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0bbfe0]"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-800">Language</h3>
                        <p className="text-sm text-gray-500">Choose your preferred language</p>
                      </div>
                      <select className="bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0bbfe0]">
                        <option>English</option>
                        <option>Spanish</option>
                        <option>French</option>
                        <option>German</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium text-red-600">Delete Account</h3>
                        <p className="text-sm text-gray-500">Permanently delete your account and all data</p>
                      </div>
                      <button className="px-4 py-2 bg-white border border-red-300 rounded-md text-red-600 hover:bg-red-50 transition-colors">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
    // </div>
  )
}

export default PassengerProfileContent


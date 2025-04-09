import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  Star,
  Send,
  ThumbsUp,
  CheckCircle,
  Clock,
  Shield,
  Navigation,
  Droplet,
  Music,
  Coffee,
  Smartphone,
  Wifi,
  MessageSquare,
  Smile,
  Meh,
  Frown,
  ChevronDown,
  ChevronUp,
  Car,
  User,
  ArrowLeft,
} from "lucide-react"
import axiosInstance from "../../API/axiosInstance"
import secureLocalStorage from "react-secure-storage"
import toast from "react-hot-toast"

export default function RateDriver() {
  const location = useLocation()
  const navigate = useNavigate()
  const uid = localStorage.getItem("@secure.n.uid")
  const decryptedUID = secureLocalStorage.getItem("uid")

  // Basic rating state
  const [overallRating, setOverallRating] = useState(5)
  const [review, setReview] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [expandedSection, setExpandedSection] = useState(null)

  // Detailed rating metrics
  const [detailedRatings, setDetailedRatings] = useState({
    drivingSkill: 5,
    vehicleCleanliness: 5,
    navigationEfficiency: 5,
    safetyScore: 5,
    communication: 5,
    professionalism: 5,
  })

  // Amenities feedback
  const [amenitiesFeedback, setAmenitiesFeedback] = useState({
    wifi: false,
    phoneChargers: false,
    musicOptions: false,
    temperatureControl: false,
    waterBottles: false,
    sanitizer: false,
  })

  // Quick feedback options
  const [selectedFeedback, setSelectedFeedback] = useState([])

  const feedbackOptions = [
    { id: 1, text: "Excellent driving", type: "positive" },
    { id: 2, text: "Very professional", type: "positive" },
    { id: 3, text: "Clean vehicle", type: "positive" },
    { id: 4, text: "Great conversation", type: "positive" },
    { id: 5, text: "Knew the best route", type: "positive" },
    { id: 6, text: "Arrived on time", type: "positive" },
    { id: 7, text: "Safe driving", type: "positive" },
    { id: 8, text: "Driving too fast", type: "negative" },
    { id: 9, text: "Car not clean", type: "negative" },
    { id: 10, text: "Took longer route", type: "negative" },
    { id: 11, text: "Arrived late", type: "negative" },
    { id: 12, text: "Unprofessional behavior", type: "negative" },
  ]

  const rideDetails = location.state?.rideDetails
  console.log("rideDetails", rideDetails)

  useEffect(() => {
    if (!rideDetails) {
      // Redirect if no ride details are available
      navigate(`/passengerdashboard?uid=${uid}`)
    }
  }, [rideDetails, navigate, uid])

  const handleDetailedRatingChange = (metric, value) => {
    setDetailedRatings((prev) => ({
      ...prev,
      [metric]: value,
    }))

    // Update overall rating based on average of detailed ratings
    const ratings = Object.values({ ...detailedRatings, [metric]: value })
    const average = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
    setOverallRating(Math.round(average))
  }

  const toggleAmenity = (amenity) => {
    setAmenitiesFeedback((prev) => ({
      ...prev,
      [amenity]: !prev[amenity],
    }))
  }

  const toggleFeedbackOption = (id) => {
    if (selectedFeedback.includes(id)) {
      setSelectedFeedback((prev) => prev.filter((item) => item !== id))
    } else {
      setSelectedFeedback((prev) => [...prev, id])
    }
  }

  const toggleSection = (section) => {
    if (expandedSection === section) {
      setExpandedSection(null)
    } else {
      setExpandedSection(section)
    }
  }

  const nextStep = () => {
    setCurrentStep((prev) => prev + 1)
  }

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (isSubmitting) return

    setIsSubmitting(true)

    try {
      // Calculate average of detailed ratings
      const ratingValues = Object.values(detailedRatings)
      const averageRating = ratingValues.reduce((sum, rating) => sum + rating, 0) / ratingValues.length

      // Get selected feedback text
      const feedbackText = selectedFeedback
        .map((id) => feedbackOptions.find((option) => option.id === id)?.text)
        .filter(Boolean)
        .join(", ")

      // Combine custom review with selected feedback
      const combinedReview = review
        ? `${review}${feedbackText ? ` | Quick feedback: ${feedbackText}` : ""}`
        : feedbackText
          ? `Quick feedback: ${feedbackText}`
          : ""

      // Prepare amenities data
      const amenitiesData = Object.entries(amenitiesFeedback)
        .filter(([_, value]) => value)
        .map(([key, _]) => key)

      const res = await axiosInstance.post(`${process.env.REACT_APP_BASE_URL}/passengers/rateDriver`, {
        decryptedUID,
        rideId: rideDetails.bookingId,
        driverId: rideDetails.driverId,
        rating: Math.round(averageRating), // Overall rating for backward compatibility
        review: combinedReview,
        detailedRatings,
        amenities: amenitiesData,
        feedbackOptions: selectedFeedback,
      })

      console.log("Response to submit : ", res.data)

      if (res.status === 200) {
        setIsSubmitted(true)
        toast.success("Thank you for your detailed feedback!")

        // Redirect after a short delay
        setTimeout(() => {
          navigate(`/passengerdashboard?uid=${uid}`)
        }, 3000)
      }

    } catch (error) {
      console.error("Error submitting rating:", error)
      toast.error("Error submitting your rating. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!rideDetails) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e6f7fb] to-[#e0f2f7] flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#0bbfe0] to-[#077286] p-4 text-white  top-0 z-10">
        <div className="container mx-auto flex items-center">
          <button onClick={() => navigate(`/passengerdashboard?uid=${uid}`)} className="mr-4">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-xl font-bold">Rate Your Experience</h1>
            <p className="text-sm opacity-80">Your feedback helps improve our service</p>
          </div>
        </div>
      </header>

      <div className="flex-1 container mx-auto max-w-2xl px-4 py-6">
        <AnimatePresence mode="wait">
          {isSubmitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <div className="p-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <ThumbsUp className="w-12 h-12 text-green-600" />
                </motion.div>
                <h2 className="text-2xl font-bold text-[#077286] mb-2">Thank You!</h2>
                <p className="text-gray-600 mb-6">
                  Your detailed feedback helps us improve our service and rewards great drivers.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(`/passengerdashboard?uid=${uid}`)}
                  className="bg-[#0bbfe0] hover:bg-[#0999b3] text-white px-6 py-3 rounded-lg font-medium"
                >
                  Back to Dashboard
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <>
              {/* Progress Indicator */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">Step {currentStep} of 3</span>
                  <span className="text-sm font-medium text-gray-600">
                    {Math.round((currentStep / 3) * 100)}% Complete
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className="bg-[#0bbfe0] h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(currentStep / 3) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  ></motion.div>
                </div>
              </div>

              {/* Ride Summary Card */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-white rounded-xl shadow-md overflow-hidden mb-6"
              >
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-gray-200 mr-4 overflow-hidden flex-shrink-0">
                      {rideDetails.driverPhoto ? (
                        <img
                          src={rideDetails.driverPhoto || "/placeholder.svg"}
                          alt={rideDetails.driverName || "Driver"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#0bbfe0] text-white text-xl font-bold">
                          {(rideDetails.driverName || "D").charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{rideDetails.driverName || "Your Driver"}</h3>
                      <div className="flex items-center text-sm text-gray-500">
                        <Car size={14} className="mr-1" />
                        <span>{rideDetails.carModel || (rideDetails.selected_car === 1 ? "Sedan" : "SUV")}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50">
                  <div className="flex items-start">
                    <div className="mt-1 mr-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <div className="w-0.5 h-10 bg-gray-300 mx-auto my-1"></div>
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    </div>
                    <div className="flex-1">
                      <div className="mb-3">
                        <p className="text-xs text-gray-500">Pickup</p>
                        <p className="text-sm font-medium">{rideDetails.pickup_location || "Pickup Location"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Dropoff</p>
                        <p className="text-sm font-medium">{rideDetails.drop_location || "Dropoff Location"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Rating Steps */}
              <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-xl shadow-md overflow-hidden mb-6"
                  >
                    <div className="p-6">
                      <h2 className="text-xl font-bold text-gray-800 mb-4">How was your trip?</h2>

                      {/* Overall Rating */}
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Overall Rating</label>
                        <div className="flex justify-center">
                          <div className="flex space-x-3">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <motion.button
                                key={star}
                                type="button"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setOverallRating(star)}
                                className="focus:outline-none"
                              >
                                <Star
                                  className={`w-12 h-12 ${star <= overallRating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                                    }`}
                                />
                              </motion.button>
                            ))}
                          </div>
                        </div>
                        <p className="text-center mt-2 text-sm text-gray-600">
                          {overallRating === 5
                            ? "Excellent!"
                            : overallRating === 4
                              ? "Very Good"
                              : overallRating === 3
                                ? "Good"
                                : overallRating === 2
                                  ? "Fair"
                                  : "Poor"}
                        </p>
                      </div>

                      {/* Quick Feedback Options */}
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          What went well? (Select all that apply)
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {feedbackOptions
                            .filter((option) => option.type === "positive")
                            .map((option) => (
                              <motion.button
                                key={option.id}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => toggleFeedbackOption(option.id)}
                                className={`px-3 py-2 rounded-full text-sm ${selectedFeedback.includes(option.id)
                                  ? "bg-[#0bbfe0] text-white"
                                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                  }`}
                              >
                                {option.text}
                              </motion.button>
                            ))}
                        </div>
                      </div>

                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Any issues? (Select all that apply)
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {feedbackOptions
                            .filter((option) => option.type === "negative")
                            .map((option) => (
                              <motion.button
                                key={option.id}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => toggleFeedbackOption(option.id)}
                                className={`px-3 py-2 rounded-full text-sm ${selectedFeedback.includes(option.id)
                                  ? "bg-rose-500 text-white"
                                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                  }`}
                              >
                                {option.text}
                              </motion.button>
                            ))}
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={nextStep}
                          className="bg-[#0bbfe0] text-white px-6 py-2 rounded-lg font-medium"
                        >
                          Next
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-xl shadow-md overflow-hidden mb-6"
                  >
                    <div className="p-6">
                      <h2 className="text-xl font-bold text-gray-800 mb-4">Rate specific aspects</h2>

                      {/* Detailed Ratings */}
                      <div className="space-y-6">
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center">
                              <Shield size={16} className="mr-2 text-[#0bbfe0]" />
                              Safety
                            </label>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <motion.button
                                  key={star}
                                  type="button"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleDetailedRatingChange("safetyScore", star)}
                                  className="focus:outline-none"
                                >
                                  <Star
                                    className={`w-6 h-6 ${star <= detailedRatings.safetyScore
                                      ? "text-yellow-400 fill-yellow-400"
                                      : "text-gray-300"
                                      }`}
                                  />
                                </motion.button>
                              ))}
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                              className="bg-[#0bbfe0] h-1.5 rounded-full"
                              style={{ width: `${(detailedRatings.safetyScore / 5) * 100}%` }}
                            ></div>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center">
                              <Droplet size={16} className="mr-2 text-[#0bbfe0]" />
                              Vehicle Cleanliness
                            </label>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <motion.button
                                  key={star}
                                  type="button"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleDetailedRatingChange("vehicleCleanliness", star)}
                                  className="focus:outline-none"
                                >
                                  <Star
                                    className={`w-6 h-6 ${star <= detailedRatings.vehicleCleanliness
                                      ? "text-yellow-400 fill-yellow-400"
                                      : "text-gray-300"
                                      }`}
                                  />
                                </motion.button>
                              ))}
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                              className="bg-[#0bbfe0] h-1.5 rounded-full"
                              style={{ width: `${(detailedRatings.vehicleCleanliness / 5) * 100}%` }}
                            ></div>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center">
                              <Navigation size={16} className="mr-2 text-[#0bbfe0]" />
                              Navigation Efficiency
                            </label>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <motion.button
                                  key={star}
                                  type="button"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleDetailedRatingChange("navigationEfficiency", star)}
                                  className="focus:outline-none"
                                >
                                  <Star
                                    className={`w-6 h-6 ${star <= detailedRatings.navigationEfficiency
                                      ? "text-yellow-400 fill-yellow-400"
                                      : "text-gray-300"
                                      }`}
                                  />
                                </motion.button>
                              ))}
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                              className="bg-[#0bbfe0] h-1.5 rounded-full"
                              style={{ width: `${(detailedRatings.navigationEfficiency / 5) * 100}%` }}
                            ></div>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center">
                              <Clock size={16} className="mr-2 text-[#0bbfe0]" />
                              Punctuality
                            </label>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <motion.button
                                  key={star}
                                  type="button"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleDetailedRatingChange("drivingSkill", star)}
                                  className="focus:outline-none"
                                >
                                  <Star
                                    className={`w-6 h-6 ${star <= detailedRatings.drivingSkill
                                      ? "text-yellow-400 fill-yellow-400"
                                      : "text-gray-300"
                                      }`}
                                  />
                                </motion.button>
                              ))}
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                              className="bg-[#0bbfe0] h-1.5 rounded-full"
                              style={{ width: `${(detailedRatings.drivingSkill / 5) * 100}%` }}
                            ></div>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center">
                              <MessageSquare size={16} className="mr-2 text-[#0bbfe0]" />
                              Communication
                            </label>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <motion.button
                                  key={star}
                                  type="button"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleDetailedRatingChange("communication", star)}
                                  className="focus:outline-none"
                                >
                                  <Star
                                    className={`w-6 h-6 ${star <= detailedRatings.communication
                                      ? "text-yellow-400 fill-yellow-400"
                                      : "text-gray-300"
                                      }`}
                                  />
                                </motion.button>
                              ))}
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                              className="bg-[#0bbfe0] h-1.5 rounded-full"
                              style={{ width: `${(detailedRatings.communication / 5) * 100}%` }}
                            ></div>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center">
                              <User size={16} className="mr-2 text-[#0bbfe0]" />
                              Professionalism
                            </label>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <motion.button
                                  key={star}
                                  type="button"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleDetailedRatingChange("professionalism", star)}
                                  className="focus:outline-none"
                                >
                                  <Star
                                    className={`w-6 h-6 ${star <= detailedRatings.professionalism
                                      ? "text-yellow-400 fill-yellow-400"
                                      : "text-gray-300"
                                      }`}
                                  />
                                </motion.button>
                              ))}
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                              className="bg-[#0bbfe0] h-1.5 rounded-full"
                              style={{ width: `${(detailedRatings.professionalism / 5) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between mt-6">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={prevStep}
                          className="border border-[#0bbfe0] text-[#0bbfe0] px-6 py-2 rounded-lg font-medium"
                        >
                          Back
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={nextStep}
                          className="bg-[#0bbfe0] text-white px-6 py-2 rounded-lg font-medium"
                        >
                          Next
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-xl shadow-md overflow-hidden mb-6"
                  >
                    <div className="p-6">
                      <h2 className="text-xl font-bold text-gray-800 mb-4">Additional Feedback</h2>

                      {/* Amenities Feedback */}
                      <div className="mb-6">
                        <button
                          onClick={() => toggleSection("amenities")}
                          className="flex items-center justify-between w-full text-left font-medium text-gray-700 mb-2"
                        >
                          <span className="flex items-center">
                            <Coffee size={16} className="mr-2 text-[#0bbfe0]" />
                            Which amenities were provided?
                          </span>
                          {expandedSection === "amenities" ? (
                            <ChevronUp size={18} className="text-gray-500" />
                          ) : (
                            <ChevronDown size={18} className="text-gray-500" />
                          )}
                        </button>

                        {expandedSection === "amenities" && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="grid grid-cols-2 gap-3 mt-3"
                          >
                            <div
                              onClick={() => toggleAmenity("wifi")}
                              className={`flex items-center p-3 rounded-lg cursor-pointer ${amenitiesFeedback.wifi
                                ? "bg-[#0bbfe0] bg-opacity-10 border-[#0bbfe0] border"
                                : "bg-gray-50 border border-gray-200"
                                }`}
                            >
                              <Wifi
                                size={18}
                                className={`mr-2 ${amenitiesFeedback.wifi ? "text-[#0bbfe0]" : "text-gray-500"}`}
                              />
                              <span
                                className={`text-sm ${amenitiesFeedback.wifi ? "font-medium text-[#0bbfe0]" : "text-gray-700"}`}
                              >
                                WiFi Hotspot
                              </span>
                              {amenitiesFeedback.wifi && <CheckCircle size={16} className="ml-auto text-[#0bbfe0]" />}
                            </div>

                            <div
                              onClick={() => toggleAmenity("phoneChargers")}
                              className={`flex items-center p-3 rounded-lg cursor-pointer ${amenitiesFeedback.phoneChargers
                                ? "bg-[#0bbfe0] bg-opacity-10 border-[#0bbfe0] border"
                                : "bg-gray-50 border border-gray-200"
                                }`}
                            >
                              <Smartphone
                                size={18}
                                className={`mr-2 ${amenitiesFeedback.phoneChargers ? "text-[#0bbfe0]" : "text-gray-500"}`}
                              />
                              <span
                                className={`text-sm ${amenitiesFeedback.phoneChargers ? "font-medium text-[#0bbfe0]" : "text-gray-700"}`}
                              >
                                Phone Chargers
                              </span>
                              {amenitiesFeedback.phoneChargers && (
                                <CheckCircle size={16} className="ml-auto text-[#0bbfe0]" />
                              )}
                            </div>

                            <div
                              onClick={() => toggleAmenity("musicOptions")}
                              className={`flex items-center p-3 rounded-lg cursor-pointer ${amenitiesFeedback.musicOptions
                                ? "bg-[#0bbfe0] bg-opacity-10 border-[#0bbfe0] border"
                                : "bg-gray-50 border border-gray-200"
                                }`}
                            >
                              <Music
                                size={18}
                                className={`mr-2 ${amenitiesFeedback.musicOptions ? "text-[#0bbfe0]" : "text-gray-500"}`}
                              />
                              <span
                                className={`text-sm ${amenitiesFeedback.musicOptions ? "font-medium text-[#0bbfe0]" : "text-gray-700"}`}
                              >
                                Music Options
                              </span>
                              {amenitiesFeedback.musicOptions && (
                                <CheckCircle size={16} className="ml-auto text-[#0bbfe0]" />
                              )}
                            </div>

                            <div
                              onClick={() => toggleAmenity("temperatureControl")}
                              className={`flex items-center p-3 rounded-lg cursor-pointer ${amenitiesFeedback.temperatureControl
                                ? "bg-[#0bbfe0] bg-opacity-10 border-[#0bbfe0] border"
                                : "bg-gray-50 border border-gray-200"
                                }`}
                            >
                              <Droplet
                                size={18}
                                className={`mr-2 ${amenitiesFeedback.temperatureControl ? "text-[#0bbfe0]" : "text-gray-500"}`}
                              />
                              <span
                                className={`text-sm ${amenitiesFeedback.temperatureControl ? "font-medium text-[#0bbfe0]" : "text-gray-700"}`}
                              >
                                Temperature Control
                              </span>
                              {amenitiesFeedback.temperatureControl && (
                                <CheckCircle size={16} className="ml-auto text-[#0bbfe0]" />
                              )}
                            </div>

                            <div
                              onClick={() => toggleAmenity("waterBottles")}
                              className={`flex items-center p-3 rounded-lg cursor-pointer ${amenitiesFeedback.waterBottles
                                ? "bg-[#0bbfe0] bg-opacity-10 border-[#0bbfe0] border"
                                : "bg-gray-50 border border-gray-200"
                                }`}
                            >
                              <Coffee
                                size={18}
                                className={`mr-2 ${amenitiesFeedback.waterBottles ? "text-[#0bbfe0]" : "text-gray-500"}`}
                              />
                              <span
                                className={`text-sm ${amenitiesFeedback.waterBottles ? "font-medium text-[#0bbfe0]" : "text-gray-700"}`}
                              >
                                Water Bottles
                              </span>
                              {amenitiesFeedback.waterBottles && (
                                <CheckCircle size={16} className="ml-auto text-[#0bbfe0]" />
                              )}
                            </div>

                            <div
                              onClick={() => toggleAmenity("sanitizer")}
                              className={`flex items-center p-3 rounded-lg cursor-pointer ${amenitiesFeedback.sanitizer
                                ? "bg-[#0bbfe0] bg-opacity-10 border-[#0bbfe0] border"
                                : "bg-gray-50 border border-gray-200"
                                }`}
                            >
                              <Droplet
                                size={18}
                                className={`mr-2 ${amenitiesFeedback.sanitizer ? "text-[#0bbfe0]" : "text-gray-500"}`}
                              />
                              <span
                                className={`text-sm ${amenitiesFeedback.sanitizer ? "font-medium text-[#0bbfe0]" : "text-gray-700"}`}
                              >
                                Hand Sanitizer
                              </span>
                              {amenitiesFeedback.sanitizer && (
                                <CheckCircle size={16} className="ml-auto text-[#0bbfe0]" />
                              )}
                            </div>
                          </motion.div>
                        )}
                      </div>

                      {/* Written Review */}
                      <div className="mb-6">
                        <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center">
                          <MessageSquare size={16} className="mr-2 text-[#0bbfe0]" />
                          Additional Comments (Optional)
                        </label>
                        <textarea
                          value={review}
                          onChange={(e) => setReview(e.target.value)}
                          placeholder="Share more details about your experience..."
                          className="w-full border border-gray-300 rounded-lg p-3 h-32 resize-none focus:ring-2 focus:ring-[#0bbfe0] focus:border-[#0bbfe0]"
                        ></textarea>
                      </div>

                      {/* Mood Selection */}
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          How did this ride make you feel?
                        </label>
                        <div className="flex justify-center space-x-6">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            type="button"
                            className="flex flex-col items-center"
                          >
                            <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center mb-1">
                              <Frown size={24} className="text-rose-500" />
                            </div>
                            <span className="text-xs text-gray-600">Disappointed</span>
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            type="button"
                            className="flex flex-col items-center"
                          >
                            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-1">
                              <Meh size={24} className="text-amber-500" />
                            </div>
                            <span className="text-xs text-gray-600">Okay</span>
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            type="button"
                            className="flex flex-col items-center"
                          >
                            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-1">
                              <Smile size={24} className="text-emerald-500" />
                            </div>
                            <span className="text-xs text-gray-600">Happy</span>
                          </motion.button>
                        </div>
                      </div>

                      {/* Rating Summary */}
                      <div className="bg-gray-50 p-4 rounded-lg mb-6">
                        <h3 className="font-medium text-gray-800 mb-2">Your Rating Summary</h3>
                        <div className="flex items-center mb-2">
                          <div className="flex mr-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                size={16}
                                className={`${star <= overallRating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                                  }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">Overall Rating</span>
                        </div>
                        <p className="text-xs text-gray-500">
                          Your detailed feedback helps us improve our service and rewards great drivers.
                        </p>
                      </div>

                      <div className="flex justify-between">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={prevStep}
                          className="border border-[#0bbfe0] text-[#0bbfe0] px-6 py-2 rounded-lg font-medium"
                        >
                          Back
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleSubmit}
                          disabled={isSubmitting}
                          className="bg-[#0bbfe0] text-white px-6 py-2 rounded-lg font-medium flex items-center"
                        >
                          {isSubmitting ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Submitting...
                            </>
                          ) : (
                            <>
                              Submit Rating <Send size={16} className="ml-2" />
                            </>
                          )}
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}


import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, Send, ThumbsUp } from "lucide-react";
import axiosInstance from "../../API/axiosInstance";
import secureLocalStorage from "react-secure-storage";
import toast from "react-hot-toast";

export default function RateDriver() {
  const location = useLocation();
  const navigate = useNavigate();
  const uid = localStorage.getItem("@secure.n.uid");
  const decryptedUID = secureLocalStorage.getItem("uid");
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const rideDetails = location.state?.rideDetails;

  if (!rideDetails) {
    // Redirect if no ride details are available
    navigate(`/passengerdashboard?uid=${uid}`);
    return null;
  }

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/passengers/rateDriver`,
        {
          decryptedUID,
          rideId: rideDetails.id,
          driverId: rideDetails.driverId,
          rating,
          review,
        }
      );

      setIsSubmitted(true);
      toast.success("Thank you for your feedback!");

      // Redirect after a short delay
      setTimeout(() => {
        navigate(`/passengerdashboard?uid=${uid}`);
      }, 2000);
    } catch (error) {
      console.error("Error submitting rating:", error);
      toast.error("Error submitting your rating. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e6f7fb] to-[#e0f2f7] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden"
      >
        {isSubmitted ? (
          <div className="p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ThumbsUp className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#077286] mb-2">
              Thank You!
            </h2>
            <p className="text-gray-600 mb-6">
              Your feedback helps improve our service.
            </p>
            <button
              onClick={() => navigate(`/passengerdashboard?uid=${uid}`)}
              className="bg-[#0bbfe0] hover:bg-[#0999b3] text-white px-6 py-2 rounded-md"
            >
              Back to Dashboard
            </button>
          </div>
        ) : (
          <>
            <div className="bg-gradient-to-r from-[#0bbfe0] to-[#077286] p-6 text-white">
              <h1 className="text-2xl font-bold">Rate Your Driver</h1>
              <p className="text-[#e0f2f7]">How was your experience?</p>
            </div>

            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Driver Info */}
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-gray-200 mr-4 overflow-hidden">
                    {rideDetails.driverPhoto ? (
                      <img
                        src={rideDetails.driverPhoto || "/placeholder.svg"}
                        alt={rideDetails.driverName || "Driver"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#0bbfe0] text-white text-2xl font-bold">
                        {(rideDetails.driverName || "D").charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">
                      {rideDetails.driverName || "Your Driver"}
                    </h3>
                    <p className="text-gray-600">
                      {rideDetails.carModel ||
                        (rideDetails.selected_car === 1 ? "Sedan" : "SUV")}
                    </p>
                  </div>
                </div>

                {/* Star Rating */}
                <div className="space-y-2">
                  <label className="text-lg font-semibold">Your Rating</label>
                  <div className="flex justify-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleRatingChange(star)}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`w-10 h-10 ${
                            star <= rating
                              ? "text-yellow-500 fill-yellow-500"
                              : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Review */}
                <div className="space-y-2">
                  <label className="text-lg font-semibold">
                    Your Review (Optional)
                  </label>
                  <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Share your experience with the driver..."
                    className="w-full border rounded-md p-3 h-32 resize-none"
                  ></textarea>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center bg-[#0bbfe0] hover:bg-[#0999b3] text-white py-3 rounded-md font-semibold"
                >
                  {isSubmitting ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      Submit Rating <Send className="ml-2 h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}

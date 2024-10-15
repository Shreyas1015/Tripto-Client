import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./Pages/LoginPage";
import SignUpPage from "./Pages/SignUpPage";
import ForgetPass from "./Pages/ForgetPass";
import ResetPass from "./Pages/ResetPass";
import PassengerDashboard from "./Pages/Passengers/PassengerDashboard";
import PassengerHomePage from "./Pages/Passengers/PassengerHomePage";
import PassenegerProfile from "./Pages/Passengers/PassengerProfile";
import DriversDocumentVerification from "./Pages/Drivers/DriversDocumentVerification";
import DriversHomePage from "./Pages/Drivers/DriversHomePage";
import DriversDashboard from "./Pages/Drivers/DriversDashboard";
// import secureLocalStorage from "react-secure-storage";
import PassengerTripPage from "./Pages/Passengers/PassengerTripPage";
import PassengerOneWayTripPage from "./Pages/Passengers/PassengerOneWayTripPage";
import RoundTripPage from "./Pages/Passengers/RoundTripPage";
import BookingDetailsPage from "./Pages/Drivers/BookingDetailsPage";
import PassengerCarTpeSelectionPage from "./Pages/Passengers/PassengerCarTypeSelectionPage";
import axiosInstance from "./API/axiosInstance";
import Loading from "./My_Components/Loading";
import toast from "react-hot-toast";

const App = () => {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    // Request Interceptor
    const requestInterceptor = axiosInstance.interceptors.request.use(
      (config) => {
        setLoading(true);
        return config;
      },
      (error) => {
        setLoading(false);
        return Promise.reject(error);
      }
    );

    // Response Interceptor
    const responseInterceptor = axiosInstance.interceptors.response.use(
      (response) => {
        setLoading(false); // Stop loading on successful response
        return response;
      },
      (error) => {
        setLoading(false); // Stop loading on error

        // Display a toast error message based on error type
        if (error.response) {
          // Server responded with a status code other than 2xx
          toast.error(
            `Error: ${error.response.data.message || "Something went wrong!"}`
          );
        } else if (error.request) {
          // Request was made but no response received
          toast.error("Error: No response from the server. Please try again.");
        } else {
          // Something went wrong in setting up the request
          toast.error(`Error: ${error.message}`);
        }

        return Promise.reject(error);
      }
    );

    // Cleanup function to remove interceptors
    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  return (
    <>
      <Router>
        <Loading show={loading} />
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          <>
            <Route
              path="/passengerdashboard"
              element={<PassengerDashboard />}
            />
            <Route path="/passengerhomepage" element={<PassengerHomePage />} />
            <Route path="/passengerprofile" element={<PassenegerProfile />} />
            <Route path="/passengertrip" element={<PassengerTripPage />} />
            <Route path="/oneWayTrip" element={<PassengerOneWayTripPage />} />
            <Route path="/roundTrip" element={<RoundTripPage />} />
            <Route
              path="/car-type-selection"
              element={<PassengerCarTpeSelectionPage />}
            />
          </>

          <>
            <Route
              path="/driversdocumentverification"
              element={<DriversDocumentVerification />}
            />
            <Route path="/drivershomepage" element={<DriversHomePage />} />
            <Route path="/driversdashboard" element={<DriversDashboard />} />
            <Route path="/booking-details" element={<BookingDetailsPage />} />
          </>

          <Route path="/forgetPass" element={<ForgetPass />} />
          <Route path="/resetPass" element={<ResetPass />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;

import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./Pages/LoginPage";
import SignUpPage from "./Pages/SignUpPage";
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
import BusinessStatsPage from "./Pages/Admin/BusinessStatsPage";
import AdminDriverVerificationPage from "./Pages/Admin/AdminDriverVerificationPage";

const App = () => {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const requestInterceptor = axiosInstance.interceptors.request.use(
      (config) => {
        // Skip loading if the flag is set
        if (!config.skipLoading) {
          setLoading(true);
        }
        return config;
      },
      (error) => {
        setLoading(false);
        return Promise.reject(error);
      }
    );

    const responseInterceptor = axiosInstance.interceptors.response.use(
      (response) => {
        // Skip loading if the flag is set
        if (!response.config.skipLoading) {
          setLoading(false);
        }
        return response;
      },
      (error) => {
        if (!error.config?.skipLoading) {
          setLoading(false);
        }
        return Promise.reject(error);
      }
    );

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
          {/* Passenger Routes  */}
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
          {/* Driver Routes */}
          <>
            <Route
              path="/driversdocumentverification"
              element={<DriversDocumentVerification />}
            />
            <Route path="/drivershomepage" element={<DriversHomePage />} />
            <Route path="/driversdashboard" element={<DriversDashboard />} />
            <Route path="/booking-details" element={<BookingDetailsPage />} />
          </>
          {/* Admin Routes */}
          <>
            <Route
              path="/admin-business-stats"
              element={<BusinessStatsPage />}
            />
            <Route
              path="/admin-driver-verification"
              element={<AdminDriverVerificationPage />}
            />
          </>
          {/* Vendor Routes */}
          <>
            <Route path="/vendorsdashboard" element={<DriversDashboard />} />
          </>
        </Routes>
      </Router>
    </>
  );
};

export default App;

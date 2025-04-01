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
import VendorDashboard from "./Pages/Vendors/VendorsDashboard";
import VendorsProfilePage from "./Pages/Vendors/VendorsProfilePage";
import VendorsTripBookingPage from "./Pages/Vendors/VendorsTripBookingPage";
import AdminPassengerDetailsPage from "./Pages/Admin/AdminPassengerDetailsPage";
import VendorTripSelectionPage from "./Pages/Vendors/VendorTripSelectionPage";
import VendorRoundTripPage from "./Pages/Vendors/VendorRoundTripPage";
import VendorOneWayTripPage from "./Pages/Vendors/VendorOneWayTripPage";
import VendorCarTypeSelectionPage from "./Pages/Vendors/VendorCarTypeSelectionPage";
import PassengerWaitingForDriverPage from "./Pages/Passengers/PassengerWaitingForDriverPage";
import PassengerRideDetailsPage from "./Pages/Passengers/PassengerRideDetailsPage";
import PassengerRateDriverPage from "./Pages/Passengers/PassengerRateDriverPage";
import PassengerRoundTripConfirmationPage from "./Pages/Passengers/PassengerRoundTripConfirmationPage";
import DriverNavigatonPage from "./Pages/Drivers/DriverNavigatonPage";
import AdminPassengerTripHistoryPage from "./Pages/Admin/AdminPassengerTripHistoryPage";
import AdminDriverDetailsPage from "./Pages/Admin/AdminDriverDetailsPage";

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
            <Route
              path="/waiting-for-driver"
              element={<PassengerWaitingForDriverPage />}
            />
            <Route
              path="/ride-details"
              element={<PassengerRideDetailsPage />}
            />
            <Route path="/rate-driver" element={<PassengerRateDriverPage />} />
            <Route
              path="/round-trip-confirmation"
              element={<PassengerRoundTripConfirmationPage />}
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
            <Route
              path="/driver-navigation"
              element={<DriverNavigatonPage />}
            />
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
            <Route
              path="/admin-passenger-details"
              element={<AdminPassengerDetailsPage />}
            />
            <Route
              path="/admin-passenger-trip-history"
              element={<AdminPassengerTripHistoryPage />}
            />
            <Route
              path="/admin-edit-driver"
              element={<AdminDriverDetailsPage />}
            />
          </>
          {/* Vendor Routes */}
          <>
            <Route path="/vendordashboard" element={<VendorDashboard />} />
            <Route path="/vendorprofile" element={<VendorsProfilePage />} />
            <Route path="/vendortrip" element={<VendorTripSelectionPage />} />
            <Route
              path="/vendor/round-trip"
              element={<VendorRoundTripPage />}
            />
            <Route
              path="/vendor/one-way-trip"
              element={<VendorOneWayTripPage />}
            />
            <Route
              path="/vendor/car-type-selection"
              element={<VendorCarTypeSelectionPage />}
            />
          </>
        </Routes>
      </Router>
    </>
  );
};

export default App;

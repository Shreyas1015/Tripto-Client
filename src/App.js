import React from "react";
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

const App = () => {
  return (
    <>
      <Router>
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

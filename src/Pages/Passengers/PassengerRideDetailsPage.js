import React from "react";
import PassengerLayout from "../../My_Components/Passengers/PassengerSidebar";
import RideDetails from "../../My_Components/Passengers/PassengerRideDetailsContent";

const PassengerRideDetailsPage = () => {
  return (
    <div>
      <PassengerLayout>
        <RideDetails />
      </PassengerLayout>
    </div>
  );
};

export default PassengerRideDetailsPage;

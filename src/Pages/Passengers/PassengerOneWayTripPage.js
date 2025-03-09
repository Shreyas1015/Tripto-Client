import React from "react";
import PassengerLayout from "../../My_Components/Passengers/PassengerSidebar";
import PassengerOneWayTripContent from "../../My_Components/Passengers/PassengerOneWayTripContent";

const PassengerOneWayTripPage = () => {
  return (
    <div>
      <PassengerLayout>
        <PassengerOneWayTripContent />
      </PassengerLayout>
    </div>
  );
};

export default PassengerOneWayTripPage;

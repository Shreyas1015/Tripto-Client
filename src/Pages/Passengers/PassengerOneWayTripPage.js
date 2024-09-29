import React from "react";
import PassengerSidebar from "../../My_Components/Passengers/PassengerSidebar";
import PassengerOneWayTripContent from "../../My_Components/Passengers/PassengerOneWayTripContent";

const PassengerOneWayTripPage = () => {
  return (
    <div>
      <PassengerSidebar contentComponent={<PassengerOneWayTripContent />} />
    </div>
  );
};

export default PassengerOneWayTripPage;

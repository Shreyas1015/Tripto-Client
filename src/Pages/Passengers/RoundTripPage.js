import React from "react";
import PassengerSidebar from "../../My_Components/Passengers/PassengerSidebar";
import PassengerRoundTripContent from "../../My_Components/Passengers/PassengerRoundTripContent";

const RoundTripPage = () => {
  return (
    <div>
      <PassengerSidebar contentComponent={<PassengerRoundTripContent />} />
    </div>
  );
};

export default RoundTripPage;

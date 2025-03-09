import React from "react";
import PassengerLayout from "../../My_Components/Passengers/PassengerSidebar";
import PassengerRoundTripContent from "../../My_Components/Passengers/PassengerRoundTripContent";

const RoundTripPage = () => {
  return (
    <div>
      <PassengerLayout>
        <PassengerRoundTripContent />
      </PassengerLayout>
    </div>
  );
};

export default RoundTripPage;

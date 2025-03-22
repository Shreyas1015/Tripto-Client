import React from "react";
import PassengerLayout from "../../My_Components/Passengers/PassengerSidebar";
import RoundTripConfirmation from "../../My_Components/Passengers/PassengerRoundTripConfirmationContent";

const PassengerRoundTripConfirmationPage = () => {
  return (
    <div>
      <PassengerLayout>
        <RoundTripConfirmation />
      </PassengerLayout>
    </div>
  );
};

export default PassengerRoundTripConfirmationPage;

import React from "react";
import PassengerLayout from "../../My_Components/Passengers/PassengerSidebar";
import PaseengerTripSelectionButtonsContent from "../../My_Components/Passengers/PaseengerTripSelectionButtonsContent";

const PassengerTripPage = () => {
  return (
    <>
      <PassengerLayout>
        <PaseengerTripSelectionButtonsContent />
      </PassengerLayout>
    </>
  );
};

export default PassengerTripPage;

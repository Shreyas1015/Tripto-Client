import React from "react";
import PassengerSidebar from "../../My_Components/Passengers/PassengerSidebar";
import PaseengerTripSelectionButtonsContent from "../../My_Components/Passengers/PaseengerTripSelectionButtonsContent";

const PassengerTripPage = () => {
  return (
    <>
      <PassengerSidebar
        contentComponent={<PaseengerTripSelectionButtonsContent />}
      />
    </>
  );
};

export default PassengerTripPage;

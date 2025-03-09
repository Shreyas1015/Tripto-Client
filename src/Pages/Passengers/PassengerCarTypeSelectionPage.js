import React from "react";
import PassengerLayout from "../../My_Components/Passengers/PassengerSidebar";
import CarTypeSelection from "../../My_Components/Passengers/PassenegerCarTypeSelectionContent";

const PassengerCarTpeSelectionPage = () => {
  return (
    <>
      <PassengerLayout>
        <CarTypeSelection />
      </PassengerLayout>
    </>
  );
};

export default PassengerCarTpeSelectionPage;

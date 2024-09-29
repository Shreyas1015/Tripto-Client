import React from "react";
import PassengerSidebar from "../../My_Components/Passengers/PassengerSidebar";
import CarTypeSelection from "../../My_Components/Passengers/PassenegerCarTypeSelectionContent";

const PassengerCarTpeSelectionPage = () => {
  return (
    <>
      <PassengerSidebar contentComponent={<CarTypeSelection />} />
    </>
  );
};

export default PassengerCarTpeSelectionPage;

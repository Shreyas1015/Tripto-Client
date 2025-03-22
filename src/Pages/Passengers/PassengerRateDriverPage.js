import React from "react";
import PassengerLayout from "../../My_Components/Passengers/PassengerSidebar";
import RateDriver from "../../My_Components/Passengers/PassengerRateDriverContent";

const PassengerRateDriverPage = () => {
  return (
    <div>
      <PassengerLayout>
        <RateDriver />
      </PassengerLayout>
    </div>
  );
};

export default PassengerRateDriverPage;

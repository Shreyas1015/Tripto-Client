import React from "react";
import PassengerLayout from "../../My_Components/Passengers/PassengerSidebar";
import PassengerHomeContent from "../../My_Components/Passengers/PassengerHomeContent";

const PassengerHomePage = () => {
  return (
    <>
      <PassengerLayout>
        <PassengerHomeContent />
      </PassengerLayout>
    </>
  );
};

export default PassengerHomePage;

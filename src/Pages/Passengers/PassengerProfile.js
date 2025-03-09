import React from "react";
import PassengerLayout from "../../My_Components/Passengers/PassengerSidebar";
import PassengerProfileContent from "../../My_Components/Passengers/PassengerProfileContent";

const PassengerProfile = () => {
  return (
    <>
      <PassengerLayout>
        <PassengerProfileContent />
      </PassengerLayout>
    </>
  );
};

export default PassengerProfile;

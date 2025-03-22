import React from "react";
import PassengerLayout from "../../My_Components/Passengers/PassengerSidebar";
import WaitingForDriver from "../../My_Components/Passengers/PassengerWaitingForDriverContent";

const PassengerWaitingForDriverPage = () => {
  return (
    <div>
      <PassengerLayout>
        <WaitingForDriver />
      </PassengerLayout>
    </div>
  );
};

export default PassengerWaitingForDriverPage;

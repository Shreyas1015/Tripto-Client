import React from "react";
import DriversSidebar from "../../My_Components/Drivers/DriversSidebar";
import DriversHomeContent from "../../My_Components/Drivers/DriversHomeContent";

const DriversHomePage = () => {
  return (
    <>
      <DriversSidebar contentComponent={<DriversHomeContent />} />
    </>
  );
};

export default DriversHomePage;

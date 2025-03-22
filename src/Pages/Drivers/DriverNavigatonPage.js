import React from "react";
import DriverNavigation from "../../My_Components/Drivers/DriverNavigationContent";
import DriversSidebar from "../../My_Components/Drivers/DriversSidebar";

const DriverNavigatonPage = () => {
  return <DriversSidebar contentComponent={<DriverNavigation />} />;
};

export default DriverNavigatonPage;

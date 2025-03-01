import React from "react";
import VendorDashboardContent from "../../My_Components/Vendors/VendorDashboardContent";
import VendorsSidebar from "../../My_Components/Vendors/VendorsSidebar";

const VendorDashboard = () => {
  return (
    <>
      <VendorsSidebar contentComponent={<VendorDashboardContent />} />
    </>
  );
};

export default VendorDashboard;

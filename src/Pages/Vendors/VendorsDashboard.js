import React from "react";
import VendorDashboardContent from "../../My_Components/Vendors/VendorDashboardContent";
import VendorLayout from "../../My_Components/Vendors/VendorsSidebar";

const VendorDashboard = () => {
  return (
    <>
      <VendorLayout>
        <VendorDashboardContent />
      </VendorLayout>
    </>
  );
};

export default VendorDashboard;

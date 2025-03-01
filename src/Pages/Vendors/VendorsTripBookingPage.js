import React from "react";
import VendorsSidebar from "../../My_Components/Vendors/VendorsSidebar";
import VendorTripBookingContent from "../../My_Components/Vendors/VendorTripBookingContent";

const VendorsTripBookingPage = () => {
  return (
    <div>
      <VendorsSidebar contentComponent={<VendorTripBookingContent />} />
    </div>
  );
};

export default VendorsTripBookingPage;

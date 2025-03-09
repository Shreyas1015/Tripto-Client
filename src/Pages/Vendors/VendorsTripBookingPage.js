import React from "react";
import VendorTripBookingContent from "../../My_Components/Vendors/VendorTripBookingContent";
import VendorLayout from "../../My_Components/Vendors/VendorsSidebar";

const VendorsTripBookingPage = () => {
  return (
    <div>
      <VendorLayout>
        <VendorTripBookingContent />
      </VendorLayout>
    </div>
  );
};

export default VendorsTripBookingPage;

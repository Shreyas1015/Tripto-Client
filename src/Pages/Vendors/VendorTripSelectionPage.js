import React from "react";
import VendorTripSelectionContent from "../../My_Components/Vendors/VendorTripSelectionContent";
import VendorLayout from "../../My_Components/Vendors/VendorsSidebar";

const VendorTripSelectionPage = () => {
  return (
    <div>
      <VendorLayout>
        <VendorTripSelectionContent />
      </VendorLayout>
    </div>
  );
};

export default VendorTripSelectionPage;

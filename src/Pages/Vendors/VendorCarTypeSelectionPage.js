import React from "react";
import VendorLayout from "../../My_Components/Vendors/VendorsSidebar";
import VendorCarTypeSelection from "../../My_Components/Vendors/VendorCarTypeSelectionContent";

const VendorCarTypeSelectionPage = () => {
  return (
    <>
      <VendorLayout>
        <VendorCarTypeSelection />
      </VendorLayout>
    </>
  );
};

export default VendorCarTypeSelectionPage;

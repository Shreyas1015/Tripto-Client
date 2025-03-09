import React from "react";
import VendorProfileContent from "../../My_Components/Vendors/VendorProfileContent";
import VendorLayout from "../../My_Components/Vendors/VendorsSidebar";

const VendorsProfilePage = () => {
  return (
    <div>
      <VendorLayout>
        <VendorProfileContent />
      </VendorLayout>
    </div>
  );
};

export default VendorsProfilePage;

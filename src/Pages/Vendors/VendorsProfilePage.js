import React from "react";
import VendorsSidebar from "../../My_Components/Vendors/VendorsSidebar";
import VendorProfileContent from "../../My_Components/Vendors/VendorProfileContent";

const VendorsProfilePage = () => {
  return (
    <div>
      <VendorsSidebar contentComponent={<VendorProfileContent />} />
    </div>
  );
};

export default VendorsProfilePage;

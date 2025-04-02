import React from "react";
import AdminSidebar from "../../My_Components/Admin/AdminSidebar";
import AdminVendorFleetOverview from "../../My_Components/Admin/AdminVendorFleetOverviewContent";

const AdminVendorFleetOverviewPage = () => {
  return (
    <div>
      <AdminSidebar contentComponent={<AdminVendorFleetOverview />} />
    </div>
  );
};

export default AdminVendorFleetOverviewPage;

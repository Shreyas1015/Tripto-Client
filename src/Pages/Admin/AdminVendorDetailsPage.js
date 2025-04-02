import React from "react";
import AdminSidebar from "../../My_Components/Admin/AdminSidebar";
import AdminVendorDashboard from "../../My_Components/Admin/AdminVendorDetailsContent";

const AdminVendorDetailsPage = () => {
  return (
    <div>
      <AdminSidebar contentComponent={<AdminVendorDashboard />} />
    </div>
  );
};

export default AdminVendorDetailsPage;

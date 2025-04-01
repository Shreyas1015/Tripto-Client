import React from "react";
import AdminSidebar from "../../My_Components/Admin/AdminSidebar";
import AdminDriverDashboard from "../../My_Components/Admin/AdminDriverDetailsContent";

const AdminDriverDetailsPage = () => {
  return (
    <>
      <AdminSidebar contentComponent={<AdminDriverDashboard />} />
    </>
  );
};

export default AdminDriverDetailsPage;

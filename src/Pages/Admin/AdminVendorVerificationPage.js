import React from "react";
import AdminSidebar from "../../My_Components/Admin/AdminSidebar";
import AdminVendorVerification from "../../My_Components/Admin/AdminVendorVerificationContent";

const AdminVendorVerificationPage = () => {
  return (
    <>
      <AdminSidebar contentComponent={<AdminVendorVerification />} />
    </>
  );
};

export default AdminVendorVerificationPage;

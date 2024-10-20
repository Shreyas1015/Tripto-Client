import React from "react";
import AdminSidebar from "../../My_Components/Admin/AdminSidebar";
import AdminDriverVerificationContent from "../../My_Components/Admin/AdminDriverVerificationContent";

const AdminDriverVerificationPage = () => {
  return (
    <>
      <AdminSidebar contentComponent={<AdminDriverVerificationContent />} />
    </>
  );
};

export default AdminDriverVerificationPage;

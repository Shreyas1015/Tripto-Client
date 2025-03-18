import React from "react";
import AdminSidebar from "../../My_Components/Admin/AdminSidebar";
import AdminPassengerDetailContent from "../../My_Components/Admin/AdminPassengerDetailsContent";

const AdminPassengerDetailsPage = () => {
  return (
    <div>
      <AdminSidebar contentComponent={<AdminPassengerDetailContent />} />
    </div>
  );
};

export default AdminPassengerDetailsPage;

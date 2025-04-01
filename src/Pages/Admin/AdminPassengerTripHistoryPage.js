import React from "react";
import AdminSidebar from "../../My_Components/Admin/AdminSidebar";
import AdminPassengerTripHistory from "../../My_Components/Admin/AdminPassengerTripHistoryContent";

const AdminPassengerTripHistoryPage = () => {
  return (
    <>
      <AdminSidebar contentComponent={<AdminPassengerTripHistory />} />
    </>
  );
};

export default AdminPassengerTripHistoryPage;

import React from "react";
import AdminSidebar from "../../My_Components/Admin/AdminSidebar";
import BusinessStatsContent from "../../My_Components/Admin/BusinessStatsContent";

const BusinessStatsPage = () => {
  return (
    <>
      <AdminSidebar contentComponent={<BusinessStatsContent />} />
    </>
  );
};

export default BusinessStatsPage;

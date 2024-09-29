import React from "react";
import DriversSidebar from "../../My_Components/Drivers/DriversSidebar";
import BookingDetailsContent from "../../My_Components/Drivers/BookingDetailsContent";

const BookingDetailsPage = () => {
  return (
    <>
      <DriversSidebar contentComponent={<BookingDetailsContent />} />
    </>
  );
};

export default BookingDetailsPage;

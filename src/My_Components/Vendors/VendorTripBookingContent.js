import React from "react";

const VendorTripBookingContent = () => {
  return (
    <div>
      <h1>Vendor Trip Booking Content</h1>
      <form>
        <label>
          Vendor ID:
          <input type="text" name="vendor_id" />
        </label>
        <label>
          Trip ID:
          <input type="text" name="trip_id" />
        </label>
        <label>
          User ID:
          <input type="text" name="user_id" />
        </label>
        <label>
          Payment ID:
          <input type="text" name="payment_id" />
        </label>
        <label>
          Booking Date:
          <input type="text" name="booking_date" />
        </label>
        <label>
          Booking Status:
          <input type="text" name="booking_status" />
        </label>
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
};

export default VendorTripBookingContent;

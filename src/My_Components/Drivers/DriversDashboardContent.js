import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import axiosInstance from "../../API/axiosInstance";

const DriversDashboardContent = () => {
  const navigate = useNavigate();
  const [bookingsInfo, setBookingsInfo] = useState([]);
  const [passengerInfo, setPassengerInfo] = useState([]);
  const uid = localStorage.getItem("@secure.n.uid");
  const decryptedUID = secureLocalStorage.getItem("uid");

  useEffect(() => {
    const fetchBookingsDataTable = async () => {
      try {
        const res = await axiosInstance.post(
          `${process.env.REACT_APP_BASE_URL}/drivers/fetchBookingsDataTable`,
          { decryptedUID }
        );
        setBookingsInfo(res.data.bookingInfo);
        setPassengerInfo(res.data.passengerInfo);
        console.log(res.data);
      } catch (error) {
        console.error("Bookings Data Fetch Error: ", error.message);
      }
    };

    fetchBookingsDataTable();
  }, [decryptedUID]);

  const BackToLogin = () => {
    navigate("/");
  };

  if (!uid) {
    return (
      <>
        <div className="container text-center fw-bold">
          <h2>INVALID URL. Please provide a valid UID.</h2>
          <button onClick={BackToLogin} className="btn blue-buttons">
            Back to Login
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="container-fluid">
        <h2>Drivers Dashboard</h2>
        <hr />
        <div className="table-responsive">
          <table className="table text-center table-bordered rounded-3">
            <thead className="table-dark">
              <tr>
                <th className="px-4">Sr No.</th>
                <th className="px-4">Pick-Up Location</th>
                <th className="px-4">Drop Location</th>
                <th>Pick-Up Date & Time</th>
                <th>Return Date & Time</th>
                <th>No. Of Days</th>
                <th>Trip Type</th>
                <th>Trip Status</th>
                <th>Distance</th>
                <th>Selected Car</th>
                <th>Total Amount</th>
                <th>Passenger Name</th>
                <th>Passenger Phone No.</th>
              </tr>
            </thead>
            <tbody>
              {bookingsInfo.map((booking, index) => (
                <tr key={index}>
                  <th>{index + 1}</th>
                  <td>{booking.pickup_location}</td>
                  <td>{booking.drop_location}</td>
                  <td>{booking.pickup_date_time}</td>
                  <td>{booking.drop_date_time}</td>
                  <td>{booking.no_of_days}</td>
                  <td>
                    {booking.trip_type === 1 ? "One Way Trip" : "Round Trip"}
                  </td>
                  <td>
                    {booking.trip_status === 0
                      ? "Pending"
                      : booking.trip_status === 1
                      ? "Accepted"
                      : "Completed"}
                  </td>
                  <td>{booking.distance} KM</td>
                  <td>
                    {booking.selected_car === 1
                      ? "( 4 + 1 SEDAN )"
                      : "( 6 + 1 SUV , MUV )"}
                  </td>
                  <td>{booking.price}</td>
                  <td>{passengerInfo[index].name}</td>
                  <td>{passengerInfo[index].phone_number}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default DriversDashboardContent;

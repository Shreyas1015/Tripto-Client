import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../API/axiosInstance";
import secureLocalStorage from "react-secure-storage";

const BookingDetailsContent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const bid = new URLSearchParams(location.search).get("bid");
  const uid = localStorage.getItem("@secure.n.uid");
  const decryptedUID = secureLocalStorage.getItem("uid");
  const [bookingsData, setBookingsData] = useState([]);

  useEffect(() => {
    const fetchParticularBookingsDetails = async () => {
      try {
        const res = await axiosInstance.post(
          `${process.env.REACT_APP_BASE_URL}/drivers/fetchParticularBookingsDetails`,
          { decryptedUID, bid }
        );
        if (res.status === 200) {
          setBookingsData(res.data);
          console.log(res.data);
        } else {
          alert("Error Fetching Bookings Details!");
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchParticularBookingsDetails();
  }, [decryptedUID, bid]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/drivers/driverAcceptBooking`,
        { decryptedUID, bid, bookingsData }
      );
      if (res.status === 200) {
        alert("Booking has been accepted!");
      }
    } catch (error) {
      console.log(error);
      alert("Error Submitting Details , Car Type does not match");
    }
  };
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
        <h2>Booking Detail </h2>
        <hr />
        <div className="bookings">
          <form onSubmit={handleSubmit}>
            <div className="card my-3 mx-auto" style={{ width: "40rem" }}>
              <img
                src="/Images/2-Cars.png"
                className="card-img-top"
                alt="Booking"
              />
              <div className="card-body">
                <h5 className="card-title">
                  {bookingsData.trip_type === 1 ? "One Way Trip" : "Round Trip"}
                </h5>
                <div className="input-group mb-3">
                  <button className="btn btn-dark">Pick-Up Location</button>
                  <input
                    id="pickup_location"
                    type="text"
                    name="pickup_location"
                    value={bookingsData.pickup_location}
                    readOnly
                    className="form-control"
                  />
                </div>
                <input
                  type="text"
                  name="drop_location"
                  value={bookingsData.drop_location}
                  readOnly
                  className="form-control mb-2"
                />
                <input
                  type="text"
                  name="pickup_date_time"
                  value={new Date(bookingsData.pickup_date_time).toLocaleString(
                    "en-GB",
                    {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                      hour12: true,
                    }
                  )}
                  readOnly
                  className="form-control mb-2"
                />
                {bookingsData.trip_type === 1 ? (
                  ""
                ) : (
                  <>
                    {" "}
                    <input
                      type="text"
                      name="drop_date_time"
                      value={new Date(
                        bookingsData.drop_date_time || ""
                      ).toLocaleString("en-GB", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true,
                      })}
                      readOnly
                      className="form-control mb-2"
                    />
                  </>
                )}
                <input
                  type="text"
                  name="no_of_days"
                  value={bookingsData.no_of_days || ""}
                  readOnly
                  className="form-control mb-2"
                />
                <input
                  type="text"
                  name="distance"
                  value={bookingsData.distance || ""}
                  readOnly
                  className="form-control mb-2"
                />
                <input
                  type="text"
                  name="selected_car"
                  value={
                    bookingsData.selected_car === 1
                      ? "( 4 + 1 SEDAN )"
                      : "( 6 + 1 SUV , MUV )"
                  }
                  readOnly
                  className="form-control mb-2"
                />
                <input
                  type="text"
                  name="price"
                  value={bookingsData.price || ""}
                  readOnly
                  className="form-control mb-2"
                />
                <div className="row">
                  <div className="col-lg-6">
                    <button type="submit" className="btn blue-buttons">
                      Accept Trip
                    </button>
                  </div>
                  <div className="col-lg-6">
                    <Link to={`/drivershomepage?uid=${decryptedUID}`}>
                      <button className="btn blue-buttons">Back</button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default BookingDetailsContent;

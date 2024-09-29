import React from "react";
import DasboardNavbar from "../../My_Components/DasboardNavbar";
import AdminSidebar from "../../My_Components/Admin/AdminSidebar";
import { useLocation, useNavigate } from "react-router-dom";
import Home2 from "../../My_Components/Admin/Home2";

const AdminDashboard = ({ token }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const uid = new URLSearchParams(location.search).get("uid");

  console.log("Received Token:", token);

  const storedToken = localStorage.getItem("token");

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

  if (!storedToken) {
    return (
      <>
        <div className="container text-center fw-bold">
          <h2>LOGIN TO ACCESS FURTHER</h2>
          <button onClick={BackToLogin} className="btn blue-buttons">
            Back to Login
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <DasboardNavbar />
      <div className="container-fluid">
        <div className="row">
          {/* Sidebar  */}
          <div
            className="col-lg-3 col-md-3 col-sm-3 col-3 sidebar"
            style={{ backgroundColor: "#272727", height: "auto" }}
          >
            <AdminSidebar />
          </div>
          {/* Content */}
          <div className="col-lg-9 col-md-9 col-sm-9 col-9">
            <Home2 />
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;

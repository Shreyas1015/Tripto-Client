import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const uid = new URLSearchParams(location.search).get("uid");

  const handleLogout = () => {
    window.localStorage.removeItem("token");
    navigate("/");
    alert("Logged Out Successfully");
  };

  return (
    <>
      {/* My Profile */}
      <ul className="m-4 p-0" style={{ listStyle: "none" }}>
        <Link className="text-decoration-none" to={`/adminprofile?uid=${uid}`}>
          <li className="py-3 px-3 sidebar-li my-2 blue-buttons rounded-3">
            <i className="fa-solid fa-user fa-bounce me-2"></i> My Profile
          </li>
        </Link>

        <Link
          className="text-decoration-none"
          to={`/admindashboard?uid=${uid}`}
        >
          <li className="py-3 px-3 sidebar-li my-2 blue-buttons rounded-3">
            <i className="fa-brands fa-windows fa-bounce me-2"></i> Dashboard
          </li>
        </Link>
        <li
          className="py-3 px-3 sidebar-li my-2 blue-buttons rounded-3"
          onClick={handleLogout}
        >
          <i className="fa-solid fa-arrow-right-from-bracket fa-bounce me-2" />
          Logout
        </li>
      </ul>
    </>
  );
};

export default AdminSidebar;

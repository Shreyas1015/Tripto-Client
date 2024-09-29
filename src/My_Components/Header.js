import React, { useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";
import axiosInstance from "../API/axiosInstance";

const Header = () => {
  const [profileData, setProfileData] = useState({}); // use empty object to avoid undefined errors

  const decryptedUID = secureLocalStorage.getItem("uid");

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axiosInstance.post(
          `${process.env.REACT_APP_BASE_URL}/passengers/fetchProfileData`,
          { decryptedUID }
        );

        if (response.status === 200) {
          setProfileData(response.data);
        }
      } catch (error) {
        console.error("Error fetching Profile Data:", error.message);
      }
    };

    fetchProfileData();
  }, [decryptedUID]);

  return (
    <header>
      <h5 className="text-lg font-semibold">
        Hello {profileData?.name ? profileData.name : "Guest"}!!
      </h5>
      <h1 className="text-3xl font-bold mt-2">Welcome Back</h1>
      <hr className="my-4 border-black/50" />
    </header>
  );
};

export default Header;

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IKContext, IKUpload } from "imagekitio-react";
import axiosInstance from "../../API/axiosInstance";
import secureLocalStorage from "react-secure-storage";

const PassengerProfileContent = () => {
  const navigate = useNavigate();
  const uid = localStorage.getItem("@secure.n.uid");
  const decryptedUID = secureLocalStorage.getItem("uid");
  const decryptedUT = secureLocalStorage.getItem("user_type");

  const userType = localStorage.getItem("@secure.n.user_type");

  console.log("User Id : ", uid);
  console.log("UserType :", userType);

  const [previousEmail, setPreviousEmail] = useState("");
  const [profileIMG, setProfileIMG] = useState("");
  const [updatedProfileIMG, setUpdatedProfileIMG] = useState("");

  const [profileData, setProfileData] = useState({
    uid: decryptedUID,
    user_type: decryptedUT,
    name: "",
    email: "",
    emailOtp: "",
    phone_number: "",
  });
  const [updatedProfileData, setUpdatedProfileData] = useState({
    uid: decryptedUID,
    user_type: decryptedUT,
    name: "",
    email: "",
    emailOtp: "",
    phone_number: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleEmailVerification = async () => {
    try {
      const res = await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/passengers/sendProfileUpdateEmailVerification`,
        { decryptedUID }
      );

      setPreviousEmail(res.data.email);
      if (res.data.success) {
        alert(
          "Email verification code sent successfully to the email you previously registered with"
        );
      } else {
        setErrorMessage("Failed to send email verification code");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage(
        "An error occurred while sending email verification code"
      );
    }
  };

  const confirmEmailVerification = async () => {
    try {
      const res = await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/auth/confirmEmail`,
        {
          email: previousEmail,
          emailOtp: updatedProfileData.emailOtp,
        }
      );

      if (res.data.success) {
        alert("Email verified successfully");
      } else {
        setErrorMessage("Failed to verify Email Otp");
      }
    } catch (error) {
      console.error(error);
      alert("Invalid OTP");
      setErrorMessage("Invalid Otp");
    }
  };

  const authenticator = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/passengers/passenger_document_auth`
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Request failed with status ${response.status}: ${errorText}`
        );
      }

      const data = await response.json();
      const { signature, expire, token } = data;
      console.log("Authentication parameters:", { signature, expire, token });
      return { signature, expire, token };
    } catch (error) {
      console.error(`Authentication request failed: ${error.message}`);
      throw new Error(`Authentication request failed: ${error.message}`);
    }
  };

  useEffect(() => {
    
    const fetchProfileData = async () => {
      try {
        const response = await axiosInstance.post(
          `${process.env.REACT_APP_BASE_URL}/passengers/fetchProfileData`,
          { decryptedUID }
        );

        if (response.status === 200) {
          setProfileData(response.data);
        } else {
          console.error("Failed to fetch Profile Data");
        }
      } catch (error) {
        console.error("Error fetching Profile Data:", error.message);
      }
    };

    const fetchProfileIMG = async () => {
      try {
        const response = await axiosInstance.post(
          `${process.env.REACT_APP_BASE_URL}/passengers/fetchProfileIMG`,
          { decryptedUID }
        );

        setUpdatedProfileIMG(response.data.link.profile_img);
        console.log(response.data.link.profile_img);
      } catch (error) {
        console.error("Error fetching :", error.message);
      }
    };

    fetchProfileData();
    fetchProfileIMG();
  }, [decryptedUID]);

  const handleProfileEdit = async (e) => {
    e.preventDefault();

    try {
      const verifyEmailRes = await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/auth/confirmEmail`,
        {
          email: previousEmail,
          emailOtp: updatedProfileData.emailOtp,
        }
      );

      if (!verifyEmailRes.data.success) {
        setErrorMessage("Email OTP verification failed");
        return;
      }

      const res = await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/passengers/updateProfile`,
        updatedProfileData
      );

      if (res.status === 200) {
        if (updatedProfileData.email !== previousEmail) {
          alert(
            "Profile has been updated. Please login again with your updated email."
          );
          window.localStorage.removeItem("user_type");
          navigate("/");
        } else {
          alert("Profile is Updated Successfully");
          window.location.reload();
        }
      } else {
        console.error("Error updating profile");
        alert("Error updating profile");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const BackToLogin = () => {
    navigate("/");
  };

  const handleProfileImg = async (e) => {
    e.preventDefault();
    try {
      const formData = {
        profile_img: profileIMG,
        uid: decryptedUID,
      };

      const res = await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/passengers/uploadProfileImage`,
        { formData, decryptedUID }
      );

      if (res.status === 200) {
        console.log("Profile Image uploaded!");
        alert("Profile Image uploaded!");
        window.location.reload();
      } else {
        console.error("Error uploading Profile Image");
        alert("An error occurred while uploading your Profile Image.");
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUpdatedProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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
    <div className="container-fluid">
      <div className="profile-div mb-4">
        <h2>Passenger's Profile</h2>
        <hr />
        <div className="row my-5">
          <div className="col-lg-3 border-end border-dark border-2 text-center">
            <img
              className="img-fluid profile-img"
              src={updatedProfileIMG}
              alt="Not available"
            />
            <form onSubmit={handleProfileImg}>
              <input type="hidden" name="uid" value={decryptedUID} />
              <div className="input-group me-5 py-3">
                <IKContext
                  publicKey="public_ytabO1+xt+yMhICKtVeVGbWi/u8="
                  urlEndpoint="https://ik.imagekit.io/TriptoServices"
                  authenticator={authenticator}
                >
                  <IKUpload
                    required
                    className="form-control"
                    fileName={`${decryptedUID}_passengerProfileIMG.jpg`}
                    folder="Home/Tripto/passengers"
                    tags={["tag1"]}
                    useUniqueFileName={true}
                    isPrivateFile={false}
                    onSuccess={(r) => {
                      setProfileIMG(r.url);
                      alert("Uploaded");
                    }}
                    onError={(e) => console.log(e)}
                  />
                </IKContext>
                <input
                  type="submit"
                  className="input-group-text blue-buttons"
                  value="Edit"
                />
              </div>
            </form>
          </div>
          <div className="col-lg-9 p-4 ">
            <form onSubmit={handleProfileEdit}>
              <input type="hidden" name="uid" value={decryptedUID} />
              <input type="hidden" name="user_type" value={decryptedUT} />
              <div className="input-group mb-4">
                <span className="input-group-text">Name</span>
                <input
                  name="name"
                  type="text"
                  className="form-control"
                  required
                  value={updatedProfileData.name || ""}
                  placeholder={profileData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="row">
                <div className="col-lg-6">
                  <div className="input-group mb-4">
                    <span className="input-group-text">Email</span>
                    <input
                      name="email"
                      type="text"
                      className="form-control"
                      required
                      value={updatedProfileData.email || ""}
                      placeholder={profileData.email}
                      onChange={handleChange}
                    />
                    <button
                      className="btn btn-sm"
                      type="button"
                      style={{ backgroundColor: "#0bbfe0", color: "white" }}
                      onClick={handleEmailVerification}
                    >
                      Send OTP
                    </button>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="input-group">
                    <input
                      type="text"
                      id="emailOtp"
                      name="emailOtp"
                      className="form-control"
                      value={updatedProfileData.emailOtp || ""}
                      placeholder="Enter your OTP here"
                      onChange={handleChange}
                      required
                    />

                    <button
                      className="btn btn-sm"
                      style={{ backgroundColor: "#0bbfe0", color: "white" }}
                      type="button"
                      onClick={confirmEmailVerification}
                    >
                      Verify OTP
                    </button>
                  </div>
                </div>
              </div>

              <div className="input-group mb-4">
                <span className="input-group-text">Phone Number</span>
                <input
                  name="phone_number"
                  type="text"
                  className="form-control"
                  required
                  value={updatedProfileData.phone_number || ""}
                  placeholder={profileData.phone_number}
                  onChange={handleChange}
                />
              </div>
              <br />
              <input
                type="submit"
                value="Edit Profile"
                className="form-control blue-buttons mt-4"
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PassengerProfileContent;

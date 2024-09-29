import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IKContext, IKUpload } from "imagekitio-react";
import axiosInstance from "../../API/axiosInstance";
import TotalDocsCards from "./TotalDocsCards";
import secureLocalStorage from "react-secure-storage";

const DriversVerificationContent = () => {
  const navigate = useNavigate();
  const uid = localStorage.getItem("@secure.n.uid");
  const decryptedUID = secureLocalStorage.getItem("uid");

  const [aadharFront, setAadharFront] = useState("");
  const [aadharBack, setAadharBack] = useState("");
  const [panCardFront, setPanCardFront] = useState("");
  const [drivingLicenseFront, setDrivingLicenseFront] = useState("");
  const [drivingLicenseBack, setDrivingLicenseBack] = useState("");
  const [selfie, setSelfie] = useState("");
  const [passbookOrCheque, setPassbookOrCheque] = useState("");
  const [rc, setRc] = useState("");
  const [puc, setPuc] = useState("");
  const [insurance, setInsurance] = useState("");
  const [permit, setPermit] = useState("");
  const [fitnessCertificate, setFitnessCertificate] = useState("");
  const [taxReceipt, setTaxReceipt] = useState("");
  const [statusIndicators, setStatusIndicators] = useState({});
  const [previousEmail, setPreviousEmail] = useState("");
  const [dcdID, setDcdID] = useState("");
  const [docsView, setDocsView] = useState({
    aadharFront: "",
    aadharBack: "",
    panCardFront: "",
    drivingLicenseFront: "",
    drivingLicenseBack: "",
    selfie: "",
    passbookOrCheque: "",
    rc: "",
    puc: "",
    insurance: "",
    permit: "",
    fitnessCertificate: "",
    taxReceipt: "",
  });
  const [carDetails, setCarDetails] = useState({
    uid: decryptedUID,
    car_name: "",
    model_year: "",
    car_number: "",
    car_type: "",
    submit_status: "",
  });
  const [totalDocs, setTotalDocs] = useState({
    uid: decryptedUID,
    total_documents: "",
    verified_documents: "",
    pending_documents: "",
  });
  const [carDetails2, setCarDetails2] = useState({
    uid: decryptedUID,
    car_name: "",
    model_year: "",
    car_number: "",
    car_type: "",
    submit_status: "",
  });
  const [profileData, setProfileData] = useState({
    uid: decryptedUID,
    name: "",
    email: "",
    emailOtp: "",
    phone_number: "",
  });
  const [updatedProfileData, setUpdatedProfileData] = useState({
    uid: decryptedUID,
    name: "",
    email: "",
    emailOtp: "",
    phone_number: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleEmailVerification = async () => {
    try {
      const res = await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/drivers/sendProfileUpdateEmailVerification`,
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = {
        uid: decryptedUID,
        dcd_id: dcdID,
        // Personal Details
        aadharFront: aadharFront,
        aadharBack: aadharBack,
        panCardFront: panCardFront,
        drivingLicenseFront: drivingLicenseFront,
        drivingLicenseBack: drivingLicenseBack,
        selfie: selfie,
        passbookOrCheque: passbookOrCheque,

        // Car Details
        rc: rc,
        puc: puc,
        insurance: insurance,
        permit: permit,
        fitnessCertificate: fitnessCertificate,
        taxReceipt: taxReceipt,
      };

      if (formData === null) throw Error;

      const response = await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/drivers/document_upload`,
        formData
      );

      // Handle success
      if (response.status === 200) {
        console.log("Documents successfully uploaded!");
        alert(
          "Documents Successfully Uploaded! Please wait for the admin to verify your documents."
        );
        window.location.reload();
      } else {
        console.error("Error uploading documents");
        alert("An error occurred while uploading your documents.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const authenticator = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/drivers/drivers_document_auth`
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
    const fetchStatusIndicators = async () => {
      try {
        const response = await axiosInstance.post(
          `${process.env.REACT_APP_BASE_URL}/drivers/fetchParticularDocStatus`,
          { decryptedUID }
        );

        if (response.status === 200) {
          setStatusIndicators(response.data);
        } else {
          console.error("Failed to fetch status indicators");
        }
      } catch (error) {
        console.error("Error fetching status indicators:", error.message);
      }
    };

    const fetchProfileData = async () => {
      try {
        const response = await axiosInstance.post(
          `${process.env.REACT_APP_BASE_URL}/drivers/fetchProfileData`,
          { decryptedUID }
        );

        if (response.status === 200) {
          setProfileData(response.data);
        } else {
          console.error("Failed to fetch Profile Data");
        }
      } catch (error) {
        console.error("Error fetching status indicators:", error.message);
      }
    };

    const fetchCarDetails = async () => {
      try {
        const response = await axiosInstance.post(
          `${process.env.REACT_APP_BASE_URL}/drivers/fetchCarDetails`,
          { decryptedUID }
        );

        setCarDetails2(response.data);
        console.log("Car Details", response.data);
      } catch (error) {
        console.error("Error fetching :", error.message);
      }
    };

    const handleTotalDocs = async () => {
      try {
        const response = await axiosInstance.post(
          `${process.env.REACT_APP_BASE_URL}/drivers/handleTotalDocs`,
          { decryptedUID }
        );

        setTotalDocs(response.data);
        console.log("setTotalDocs :", response.data);
      } catch (error) {
        console.error("Error fetching :", error.message);
      }
    };

    const fetchDcdID = async () => {
      try {
        const response = await axiosInstance.post(
          `${process.env.REACT_APP_BASE_URL}/drivers/fetchDcdID`,
          { decryptedUID }
        );

        setDcdID(response.data);
        console.log("fetchDcdID :", response.data);
      } catch (error) {
        console.error("Error fetching :", error.message);
      }
    };

    const fetchDocLinks = async () => {
      try {
        const response = await axiosInstance.post(
          `${process.env.REACT_APP_BASE_URL}/drivers/fetchDocLinks`,
          { decryptedUID }
        );

        setDocsView(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching :", error.message);
      }
    };

    fetchProfileData();
    fetchStatusIndicators();
    fetchCarDetails();
    handleTotalDocs();
    fetchDocLinks();
    fetchDcdID();
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
        `${process.env.REACT_APP_BASE_URL}/drivers/updateProfile`,
        updatedProfileData
      );

      if (res.status === 200) {
        if (updatedProfileData.email !== previousEmail) {
          alert(
            "Profile has been updated. Please login again with your updated email."
          );
          window.localStorage.removeItem("token");
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

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUpdatedProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setCarDetails((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCarForm = async (e) => {
    e.preventDefault();

    try {
      const res = await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/drivers/uploadCarDetails`,
        carDetails
      );

      console.log("Response status:", res.status);

      if (res.status === 400) {
        alert("Invalid Car Number");
      } else if (res.status === 200) {
        alert("Car Details Uploaded Successfully");
        window.location.reload();
      } else {
        alert("Failed to upload Car Details");
      }
    } catch (error) {
      alert(
        "Check Your Car Details, especially for the Car Number. It should be in the form of e.g., 'MH04CG7475'"
      );
      console.error("Error: ", error);
    }
  };

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];

    for (let year = currentYear; year >= currentYear - 50; year--) {
      years.push(year);
    }

    return years.map((year, index) => (
      <>
        <option key={year} value={year}>
          {year}
        </option>
      </>
    ));
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

  const publicKey = "public_ytabO1+xt+yMhICKtVeVGbWi/u8=";
  const urlEndpoint = "https://ik.imagekit.io/TriptoServices";

  return (
    <div className="container-fluid">
      <div className="profile-div mb-4">
        <h2>Drivers Profile</h2>
        <hr />
        <div className="row my-5">
          <div className="col-lg-3 border-end border-dark border-2 text-center">
            <img
              className="img-fluid profile-img"
              src={docsView.selfie}
              alt="Not available"
            />
          </div>
          <div className="col-lg-9 p-4 ">
            <form onSubmit={handleProfileEdit}>
              <input type="hidden" name="uid" value={decryptedUID} />
              <div className="input-group mb-3">
                <span className="input-group-text">Name</span>
                <input
                  name="name"
                  type="text"
                  className="form-control"
                  onChange={handleChange}
                  value={profileData.name}
                />
              </div>
              <div className="row">
                <div className="col-lg-6">
                  <div className="input-group mb-3">
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

              <div className="input-group mb-3">
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
              <input
                type="submit"
                value="Edit Profile"
                className="form-control blue-buttons"
              />
            </form>
          </div>
        </div>
      </div>
      <div className="car-details-div mb-5">
        <h2>Car Details</h2>
        <hr />
        <form onSubmit={handleCarForm}>
          <input type="hidden" name="uid" value={uid} />
          <div className="row mt-5 mb-3">
            <div className="col-lg-6">
              {carDetails2.submit_status === 1 ? (
                <div className="input-group ">
                  <span className="input-group-text">Name</span>
                  <input
                    type="text"
                    name="car_name"
                    className="form-control"
                    onChange={handleInputChange}
                    disabled
                    value={carDetails2.car_name}
                  />
                </div>
              ) : (
                <div className="input-group ">
                  <span className="input-group-text">Name</span>
                  <input
                    type="text"
                    name="car_name"
                    className="form-control"
                    onChange={handleInputChange}
                    required
                    placeholder={carDetails2.car_name}
                    value={carDetails.car_name}
                  />
                </div>
              )}
            </div>
            <div className="col-lg-6">
              {carDetails2.submit_status === 1 ? (
                <div className="input-group">
                  <label className="input-group-text">Model Year</label>
                  <select
                    className="form-select"
                    name="model_year"
                    onChange={handleInputChange}
                    value={carDetails2.model_year}
                    disabled
                  >
                    {generateYearOptions()}
                  </select>
                </div>
              ) : (
                <div className="input-group">
                  <label className="input-group-text">Model Year</label>
                  <select
                    className="form-select"
                    name="model_year"
                    onChange={handleInputChange}
                    value={carDetails.model_year}
                  >
                    <option>Choose Model Year</option>
                    {generateYearOptions()}
                  </select>
                </div>
              )}
            </div>
          </div>
          <div className="row my-4">
            <div className="col-lg-6">
              {carDetails2.submit_status === 1 ? (
                <div className="input-group ">
                  <span className="input-group-text">Car Number</span>
                  <input
                    type="text"
                    name="car_number"
                    className="form-control"
                    onChange={handleInputChange}
                    value={carDetails2.car_number}
                    disabled
                  />
                </div>
              ) : (
                <div className="input-group ">
                  <span className="input-group-text">Car Number</span>
                  <input
                    type="text"
                    name="car_number"
                    className="form-control"
                    onChange={handleInputChange}
                    required
                    placeholder={carDetails2.car_number}
                    value={carDetails.car_number}
                  />
                </div>
              )}
            </div>
            <div className="col-lg-6">
              {carDetails2.submit_status === 1 ? (
                <div className="input-group">
                  <label className="input-group-text">Car Type</label>
                  <select
                    name="car_type"
                    className="form-select"
                    onChange={handleInputChange}
                    disabled
                  >
                    <option
                      value={
                        carDetails2.car_type == 1
                          ? "4+1 ( SEDAN )"
                          : carDetails2.car_type == 2
                          ? "6+1 ( SUV , MUV )"
                          : "H"
                      }
                    >
                      {carDetails2.car_type == 1
                        ? "4+1 ( SEDAN )"
                        : carDetails2.car_type == 2
                        ? "6+1 ( SUV , MUV )"
                        : "H"}
                    </option>
                  </select>
                </div>
              ) : (
                <div className="input-group">
                  <label className="input-group-text">Car Type</label>
                  <select
                    name="car_type"
                    className="form-select"
                    onChange={handleInputChange}
                    required
                    value={carDetails.car_type}
                  >
                    <option>Choose Car Type</option>
                    <option value={1}>4+1 ( SEDAN )</option>
                    <option value={2}>6+1 ( SUV , MUV )</option>
                  </select>
                </div>
              )}
            </div>
          </div>
          {carDetails2.submit_status === 1 ? (
            ""
          ) : (
            <>
              <p className="text-danger">
                Note: Once the form is submitted, you will not be able to update
                it again.
              </p>
              <input
                className="form-control blue-buttons"
                type="submit"
                value="Submit"
              />
            </>
          )}
        </form>
      </div>
      {carDetails2.submit_status === 1 ? (
        <div className="document-div">
          <h2>Drivers Document Verification</h2>
          <hr />
          <div className="row">
            <div className="col-lg-4">
              <TotalDocsCards
                doc_name="Total Documents"
                value={totalDocs.total_documents}
              />
            </div>
            <div className="col-lg-4">
              <TotalDocsCards
                doc_name="Verified Documents"
                value={totalDocs.verified_documents}
              />
            </div>
            <div className="col-lg-4">
              <TotalDocsCards
                doc_name="Pending Documents"
                value={
                  totalDocs.pending_documents == null
                    ? 0
                    : totalDocs.pending_documents
                }
              />
            </div>
          </div>
          {statusIndicators.all_documents_status === 1 ? (
            <h4 className="text-success">
              All Documents Have Been Successfully verified
            </h4>
          ) : (
            <form onSubmit={handleSubmit}>
              <input type="hidden" name="uid" value={uid} />
              <input type="hidden" name="dcd_id" value={dcdID} />

              <table className="table table-bordered">
                <thead className="text-center">
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Form</th>
                    <th scope="col">View Doc</th>
                    <th scope="col">Verification Status</th>
                  </tr>
                </thead>
                <tbody>
                  {statusIndicators.aadharFrontStatus === 1 ? (
                    ""
                  ) : (
                    <tr>
                      <th className="text-center pt-4" scope="row">
                        1
                      </th>
                      <td className="my-2 px-3">
                        <label className="form-label" htmlFor="aadharFront">
                          Aadhar Card Front:
                        </label>
                        <div className="doc">
                          <IKContext
                            publicKey={publicKey}
                            urlEndpoint={urlEndpoint}
                            authenticator={authenticator}
                          >
                            <IKUpload
                              required
                              className="form-control"
                              fileName={`${uid}_aadharFront.jpg`}
                              folder="Home/Tripto/drivers"
                              tags={["tag1"]}
                              useUniqueFileName={false}
                              isPrivateFile={false}
                              onSuccess={(r) => {
                                setAadharFront(r.url);
                                alert("Uploaded");
                              }}
                              onError={(e) => console.log(e)}
                            />
                          </IKContext>
                        </div>
                      </td>
                      <td className="text-center pt-4">
                        <button className="btn blue-buttons">
                          <a
                            className="text-decoration-none"
                            href={docsView.aadharFront}
                            target="_blank"
                            rel="noreferrer"
                          >
                            View Doc
                          </a>
                        </button>
                      </td>
                      <td className="text-center pt-4">
                        {statusIndicators.aadharFrontStatus === 0
                          ? "Pending"
                          : statusIndicators.aadharFrontStatus === 1
                          ? "Verified"
                          : statusIndicators.aadharFrontStatus === 2
                          ? "Rejected"
                          : "Unknown"}
                      </td>
                    </tr>
                  )}
                  {statusIndicators.aadharBackStatus === 1 ? (
                    ""
                  ) : (
                    <tr>
                      <th className="text-center pt-4" scope="row">
                        2
                      </th>
                      <td className="my-2 px-3">
                        <label className="form-label" htmlFor="aadharBack">
                          Aadhar Card Back:
                        </label>
                        <div className="doc">
                          <IKContext
                            publicKey={publicKey}
                            urlEndpoint={urlEndpoint}
                            authenticator={authenticator}
                          >
                            <IKUpload
                              required
                              className="form-control"
                              fileName={`${uid}_aadharBack.jpg`}
                              folder="Home/Tripto/drivers"
                              tags={["tag1"]}
                              useUniqueFileName={false}
                              isPrivateFile={false}
                              onSuccess={(r) => {
                                setAadharBack(r.url);
                                alert("Uploaded");
                              }}
                              onError={(e) => console.log(e)}
                            />
                          </IKContext>
                        </div>
                      </td>
                      <td className="text-center pt-4">
                        <button className="btn blue-buttons">
                          <a
                            className="text-decoration-none "
                            href={docsView.aadharBack}
                            target="_blank"
                            rel="noreferrer"
                          >
                            View Doc
                          </a>
                        </button>
                      </td>
                      <td className="text-center pt-4">
                        {statusIndicators.aadharBackStatus === 0
                          ? "Pending"
                          : statusIndicators.aadharBackStatus === 1
                          ? "Verified"
                          : statusIndicators.aadharBackStatus === 2
                          ? "Rejected"
                          : "Unknown"}
                      </td>
                    </tr>
                  )}
                  {statusIndicators.panCardFrontStatus === 1 ? (
                    ""
                  ) : (
                    <tr>
                      <th className="text-center pt-4" scope="row">
                        3
                      </th>
                      <td className="my-2 px-3">
                        <label className="form-label" htmlFor="panCardFront">
                          Pan Card Front:
                        </label>
                        <div className="doc">
                          <IKContext
                            publicKey={publicKey}
                            urlEndpoint={urlEndpoint}
                            authenticator={authenticator}
                          >
                            <IKUpload
                              required
                              className="form-control"
                              fileName={`${uid}_panCardFront.jpg`}
                              folder="Home/Tripto/drivers"
                              tags={["tag1"]}
                              useUniqueFileName={false}
                              isPrivateFile={false}
                              onSuccess={(r) => {
                                setPanCardFront(r.url);
                                alert("Uploaded");
                              }}
                              onError={(e) => console.log(e)}
                            />
                          </IKContext>
                        </div>
                      </td>
                      <td className="text-center pt-4">
                        <button className="btn blue-buttons">
                          <a
                            className="text-decoration-none "
                            href={docsView.panCardFront}
                            target="_blank"
                            rel="noreferrer"
                          >
                            View Doc
                          </a>
                        </button>
                      </td>
                      <td className="text-center pt-4">
                        {statusIndicators.panCardFrontStatus === 0
                          ? "Pending"
                          : statusIndicators.panCardFrontStatus === 1
                          ? "Verified"
                          : statusIndicators.panCardFrontStatus === 2
                          ? "Rejected"
                          : "Unknown"}
                      </td>
                    </tr>
                  )}
                  {statusIndicators.drivingLicenseFrontStatus === 1 ? (
                    ""
                  ) : (
                    <tr>
                      <th className="text-center pt-4" scope="row">
                        4
                      </th>
                      <td className="my-2 px-3">
                        <label
                          className="form-label"
                          htmlFor="drivingLicenseFront"
                        >
                          Driving License Front :
                        </label>
                        <div className="doc">
                          <IKContext
                            publicKey={publicKey}
                            urlEndpoint={urlEndpoint}
                            authenticator={authenticator}
                          >
                            <IKUpload
                              required
                              className="form-control"
                              fileName={`${uid}_drivingLicenseFront.jpg`}
                              folder="Home/Tripto/drivers"
                              tags={["tag1"]}
                              useUniqueFileName={false}
                              isPrivateFile={false}
                              onSuccess={(r) => {
                                setDrivingLicenseFront(r.url);
                                alert("Uploaded");
                              }}
                              onError={(e) => console.log(e)}
                            />
                          </IKContext>
                        </div>
                      </td>
                      <td className="text-center pt-4">
                        <button className="btn blue-buttons">
                          <a
                            className="text-decoration-none "
                            href={docsView.drivingLicenseFront}
                            target="_blank"
                            rel="noreferrer"
                          >
                            View Doc
                          </a>
                        </button>
                      </td>
                      <td className="text-center pt-4">
                        {statusIndicators.drivingLicenseFrontStatus === 0
                          ? "Pending"
                          : statusIndicators.drivingLicenseFrontStatus === 1
                          ? "Verified"
                          : statusIndicators.drivingLicenseFrontStatus === 2
                          ? "Rejected"
                          : "Unknown"}
                      </td>
                    </tr>
                  )}
                  {statusIndicators.drivingLicenseBackStatus === 1 ? (
                    ""
                  ) : (
                    <tr>
                      <th className="text-center pt-4" scope="row">
                        5
                      </th>
                      <td className="my-2 px-3">
                        <label
                          className="form-label"
                          htmlFor="drivingLicenseBack"
                        >
                          Driving License Back:
                        </label>
                        <div className="doc">
                          <IKContext
                            publicKey={publicKey}
                            urlEndpoint={urlEndpoint}
                            authenticator={authenticator}
                          >
                            <IKUpload
                              required
                              className="form-control"
                              fileName={`${uid}_drivingLicenseBack.jpg`}
                              folder="Home/Tripto/drivers"
                              tags={["tag1"]}
                              useUniqueFileName={false}
                              isPrivateFile={false}
                              onSuccess={(r) => {
                                setDrivingLicenseBack(r.url);
                                alert("Uploaded");
                              }}
                              onError={(e) => console.log(e)}
                            />
                          </IKContext>
                        </div>
                      </td>
                      <td className="text-center pt-4">
                        <button className="btn blue-buttons">
                          <a
                            className="text-decoration-none "
                            href={docsView.drivingLicenseBack}
                            target="_blank"
                            rel="noreferrer"
                          >
                            View Doc
                          </a>
                        </button>
                      </td>
                      <td className="text-center pt-4">
                        {statusIndicators.drivingLicenseBackStatus === 0
                          ? "Pending"
                          : statusIndicators.drivingLicenseBackStatus === 1
                          ? "Verified"
                          : statusIndicators.drivingLicenseBackStatus === 2
                          ? "Rejected"
                          : "Unknown"}
                      </td>
                    </tr>
                  )}
                  {statusIndicators.selfieStatus === 1 ? (
                    ""
                  ) : (
                    <tr>
                      <th className="text-center pt-4" scope="row">
                        6
                      </th>
                      <td className="my-2 px-3">
                        <label className="form-label" htmlFor="selfie">
                          Selfie :
                        </label>
                        <div className="doc">
                          <IKContext
                            publicKey={publicKey}
                            urlEndpoint={urlEndpoint}
                            authenticator={authenticator}
                          >
                            <IKUpload
                              required
                              className="form-control"
                              fileName={`${uid}_selfie.jpg`}
                              folder="Home/Tripto/drivers"
                              tags={["tag1"]}
                              useUniqueFileName={false}
                              isPrivateFile={false}
                              onSuccess={(r) => {
                                setSelfie(r.url);
                                alert("Uploaded");
                              }}
                              onError={(e) => console.log(e)}
                            />
                          </IKContext>
                        </div>
                      </td>
                      <td className="text-center pt-4">
                        <button className="btn blue-buttons">
                          <a
                            className="text-decoration-none "
                            href={docsView.selfie}
                            target="_blank"
                            rel="noreferrer"
                          >
                            View Doc
                          </a>
                        </button>
                      </td>
                      <td className="text-center pt-4">
                        {statusIndicators.selfieStatus === 0
                          ? "Pending"
                          : statusIndicators.selfieStatus === 1
                          ? "Verified"
                          : statusIndicators.selfieStatus === 2
                          ? "Rejected"
                          : "Unknown"}
                      </td>
                    </tr>
                  )}
                  {statusIndicators.passbookOrChequeStatus === 1 ? (
                    ""
                  ) : (
                    <tr>
                      <th className="text-center pt-4" scope="row">
                        7
                      </th>
                      <td className="my-2 px-3">
                        <label
                          className="form-label"
                          htmlFor="passbookOrCheque"
                        >
                          Passbook / Cheque : ( Optional )
                        </label>
                        <div className="doc">
                          <IKContext
                            publicKey={publicKey}
                            urlEndpoint={urlEndpoint}
                            authenticator={authenticator}
                          >
                            <IKUpload
                              className="form-control"
                              fileName={`${uid}_passbook/chequebook.jpg`}
                              folder="Home/Tripto/drivers"
                              tags={["tag1"]}
                              useUniqueFileName={false}
                              isPrivateFile={false}
                              onSuccess={(r) => {
                                setPassbookOrCheque(r.url);
                                alert("Uploaded");
                              }}
                              onError={(e) => console.log(e)}
                            />
                          </IKContext>
                        </div>
                      </td>
                      <td className="text-center pt-4">
                        <button className="btn blue-buttons">
                          <a
                            className="text-decoration-none "
                            href={docsView.passbookOrCheque}
                            target="_blank"
                            rel="noreferrer"
                          >
                            View Doc
                          </a>
                        </button>
                      </td>
                      <td className="text-center pt-4">
                        {statusIndicators.passbookOrChequeStatus === 0
                          ? "Pending"
                          : statusIndicators.passbookOrChequeStatus === 1
                          ? "Verified"
                          : statusIndicators.passbookOrChequeStatus === 2
                          ? "Rejected"
                          : "Unknown"}
                      </td>
                    </tr>
                  )}
                  {statusIndicators.rcStatus === 1 ? (
                    ""
                  ) : (
                    <tr>
                      <th className="text-center pt-4" scope="row">
                        8
                      </th>
                      <td className="my-2 px-3">
                        <label className="form-label" htmlFor="rc">
                          RC
                        </label>
                        <div className="doc">
                          <IKContext
                            publicKey={publicKey}
                            urlEndpoint={urlEndpoint}
                            authenticator={authenticator}
                          >
                            <IKUpload
                              required
                              className="form-control"
                              fileName={`${uid}_rc.jpg`}
                              folder="Home/Tripto/drivers"
                              tags={["tag1"]}
                              useUniqueFileName={false}
                              isPrivateFile={false}
                              onSuccess={(r) => {
                                setRc(r.url);
                                alert("Uploaded");
                              }}
                              onError={(e) => console.log(e)}
                            />
                          </IKContext>
                        </div>
                      </td>
                      <td className="text-center pt-4">
                        <button className="btn blue-buttons">
                          <a
                            className="text-decoration-none "
                            href={docsView.rc}
                            target="_blank"
                            rel="noreferrer"
                          >
                            View Doc
                          </a>
                        </button>
                      </td>
                      <td className="text-center pt-4">
                        {statusIndicators.rcStatus === 0
                          ? "Pending"
                          : statusIndicators.rcStatus === 1
                          ? "Verified"
                          : statusIndicators.rcStatus === 2
                          ? "Rejected"
                          : "Unknown"}
                      </td>
                    </tr>
                  )}
                  {statusIndicators.pucStatus === 1 ? (
                    ""
                  ) : (
                    <tr>
                      <th className="text-center pt-4" scope="row">
                        9
                      </th>
                      <td className="my-2 px-3">
                        <label className="form-label" htmlFor="puc">
                          PUC
                        </label>
                        <div className="doc">
                          <IKContext
                            publicKey={publicKey}
                            urlEndpoint={urlEndpoint}
                            authenticator={authenticator}
                          >
                            <IKUpload
                              required
                              className="form-control"
                              fileName={`${uid}_puc.jpg`}
                              folder="Home/Tripto/drivers"
                              tags={["tag1"]}
                              useUniqueFileName={false}
                              isPrivateFile={false}
                              onSuccess={(r) => {
                                setPuc(r.url);
                                alert("Uploaded");
                              }}
                              onError={(e) => console.log(e)}
                            />
                          </IKContext>
                        </div>
                      </td>
                      <td className="text-center pt-4">
                        <button className="btn blue-buttons">
                          <a
                            className="text-decoration-none "
                            href={docsView.puc}
                            target="_blank"
                            rel="noreferrer"
                          >
                            View Doc
                          </a>
                        </button>
                      </td>
                      <td className="text-center pt-4">
                        {statusIndicators.pucStatus === 0
                          ? "Pending"
                          : statusIndicators.pucStatus === 1
                          ? "Verified"
                          : statusIndicators.pucStatus === 2
                          ? "Rejected"
                          : "Unknown"}
                      </td>
                    </tr>
                  )}
                  {statusIndicators.insuranceStatus === 1 ? (
                    ""
                  ) : (
                    <tr>
                      <th className="text-center pt-4" scope="row">
                        10
                      </th>
                      <td className="my-2 px-3">
                        <label className="form-label" htmlFor="insurance">
                          Isurance
                        </label>
                        <div className="doc">
                          <IKContext
                            publicKey={publicKey}
                            urlEndpoint={urlEndpoint}
                            authenticator={authenticator}
                          >
                            <IKUpload
                              required
                              className="form-control"
                              fileName={`${uid}_insurance.jpg`}
                              folder="Home/Tripto/drivers"
                              tags={["tag1"]}
                              useUniqueFileName={false}
                              isPrivateFile={false}
                              onSuccess={(r) => {
                                setInsurance(r.url);
                                alert("Uploaded");
                              }}
                              onError={(e) => console.log(e)}
                            />
                          </IKContext>
                        </div>
                      </td>
                      <td className="text-center pt-4">
                        <button className="btn blue-buttons">
                          <a
                            className="text-decoration-none "
                            href={docsView.insurance}
                            target="_blank"
                            rel="noreferrer"
                          >
                            View Doc
                          </a>
                        </button>
                      </td>
                      <td className="text-center pt-4">
                        {statusIndicators.insuranceStatus === 0
                          ? "Pending"
                          : statusIndicators.insuranceStatus === 1
                          ? "Verified"
                          : statusIndicators.insuranceStatus === 2
                          ? "Rejected"
                          : "Unknown"}
                      </td>
                    </tr>
                  )}
                  {statusIndicators.permitStatus === 1 ? (
                    ""
                  ) : (
                    <tr>
                      <th className="text-center pt-4" scope="row">
                        11
                      </th>
                      <td className="my-2 px-3">
                        <label className="form-label" htmlFor="permit">
                          Permit
                        </label>
                        <div className="doc">
                          <IKContext
                            publicKey={publicKey}
                            urlEndpoint={urlEndpoint}
                            authenticator={authenticator}
                          >
                            <IKUpload
                              required
                              className="form-control"
                              fileName={`${uid}_permit.jpg`}
                              folder="Home/Tripto/drivers"
                              tags={["tag1"]}
                              useUniqueFileName={false}
                              isPrivateFile={false}
                              onSuccess={(r) => {
                                setPermit(r.url);
                                alert("Uploaded");
                              }}
                              onError={(e) => console.log(e)}
                            />
                          </IKContext>
                        </div>
                      </td>
                      <td className="text-center pt-4">
                        <button className="btn blue-buttons">
                          <a
                            className="text-decoration-none "
                            href={docsView.permit}
                            target="_blank"
                            rel="noreferrer"
                          >
                            View Doc
                          </a>
                        </button>
                      </td>
                      <td className="text-center pt-4">
                        {statusIndicators.permitStatus === 0
                          ? "Pending"
                          : statusIndicators.permitStatus === 1
                          ? "Verified"
                          : statusIndicators.permitStatus === 2
                          ? "Rejected"
                          : "Unknown"}
                      </td>
                    </tr>
                  )}
                  {statusIndicators.fitnessCertificateStatus === 1 ? (
                    ""
                  ) : (
                    <tr>
                      <th className="text-center pt-4" scope="row">
                        12
                      </th>
                      <td className="my-2 px-3">
                        <label
                          className="form-label"
                          htmlFor="fitnessCertificate"
                        >
                          Fitness Certificate : ( Optional )
                        </label>
                        <div className="doc">
                          <IKContext
                            publicKey={publicKey}
                            urlEndpoint={urlEndpoint}
                            authenticator={authenticator}
                          >
                            <IKUpload
                              className="form-control"
                              fileName={`${uid}_fitnessCertificate.jpg`}
                              folder="Home/Tripto/drivers"
                              tags={["tag1"]}
                              useUniqueFileName={false}
                              isPrivateFile={false}
                              onSuccess={(r) => {
                                setFitnessCertificate(r.url);
                                alert("Uploaded");
                              }}
                              onError={(e) => console.log(e)}
                            />
                          </IKContext>
                        </div>
                      </td>
                      <td className="text-center pt-4">
                        <button className="btn blue-buttons">
                          <a
                            className="text-decoration-none "
                            href={docsView.fitnessCertificate}
                            target="_blank"
                            rel="noreferrer"
                          >
                            View Doc
                          </a>
                        </button>
                      </td>
                      <td className="text-center pt-4">
                        {statusIndicators.fitnessCertificateStatus === 0
                          ? "Pending"
                          : statusIndicators.fitnessCertificateStatus === 1
                          ? "Verified"
                          : statusIndicators.fitnessCertificateStatus === 2
                          ? "Rejected"
                          : "Unknown"}
                      </td>
                    </tr>
                  )}
                  {statusIndicators.taxReceiptStatus === 1 ? (
                    ""
                  ) : (
                    <tr>
                      <th className="text-center pt-4" scope="row">
                        13
                      </th>
                      <td className="my-2 px-3">
                        <label className="form-label" htmlFor="taxReceipt">
                          Tax Receipt : ( Optional )
                        </label>
                        <div className="doc">
                          <IKContext
                            publicKey={publicKey}
                            urlEndpoint={urlEndpoint}
                            authenticator={authenticator}
                          >
                            <IKUpload
                              className="form-control"
                              fileName={`${uid}_taxReceipt.jpg`}
                              folder="Home/Tripto/drivers"
                              tags={["tag1"]}
                              useUniqueFileName={false}
                              isPrivateFile={false}
                              onSuccess={(r) => {
                                setTaxReceipt(r.url);
                                alert("Uploaded");
                              }}
                              onError={(e) => console.log(e)}
                            />
                          </IKContext>
                        </div>
                      </td>
                      <td className="text-center pt-4">
                        <button className="btn blue-buttons">
                          <a
                            className="text-decoration-none "
                            href={docsView.taxReceipt}
                            target="_blank"
                            rel="noreferrer"
                          >
                            View Doc
                          </a>
                        </button>
                      </td>
                      <td className="text-center pt-4">
                        {statusIndicators.taxReceiptStatus === 0
                          ? "Pending"
                          : statusIndicators.taxReceiptStatus === 1
                          ? "Verified"
                          : statusIndicators.taxReceiptStatus === 2
                          ? "Rejected"
                          : "Unknown"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              <input
                className="btn form-control blue-buttons"
                type="submit"
                value={"Submit Documents"}
              ></input>
            </form>
          )}
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default DriversVerificationContent;

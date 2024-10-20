import { Star } from "lucide-react";
import React, { useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";
import axiosInstance from "../../API/axiosInstance";

const DriversHeader = () => {
  const [driverDetails, setDriverDetails] = useState({});
  const decryptedUID = secureLocalStorage.getItem("uid");

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axiosInstance.post(
          `${process.env.REACT_APP_BASE_URL}/drivers/fetchProfileData`,
          { decryptedUID }
        );

        if (response.status === 200) {
          setDriverDetails(response.data);
          console.log(response.data);
        }
      } catch (error) {
        console.error("Error fetching status indicators:", error.message);
      }
    };

    fetchProfileData();
  }, [decryptedUID]);

  // Function to extract the first name from the full name
  const getFirstName = (fullName) => {
    return fullName ? fullName.split(" ")[0] : "Driver";
  };

  return (
    <div>
      <header className="bg-gradient-to-r from-[#0bbfe0] to-[#077286] text-white p-6 rounded-b-3xl shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <div className="rounded-full w-16 h-16 bg-gray-300 mr-4"></div>
            <div>
              {/* Display the first name of the driver if available */}
              <h1 className="text-3xl uppercase font-bold">
                {getFirstName(driverDetails.name)} Driver
              </h1>
              <div className="flex items-center">
                <Star className="w-5 h-5 text-yellow-400" />
                {/* Display the driver's rating if available, else fallback to 0 */}
                <span className="ml-1 text-lg">
                  {driverDetails.rating || "0.0"}
                </span>
              </div>
            </div>
          </div>
          <div className="flex space-x-6">
            <div className="text-center">
              <div>Total Trips</div>
              {/* Display the total trips if available, else fallback to 0 */}
              <div className="text-3xl font-bold">
                {driverDetails.totalTrips || "0"}
              </div>
            </div>
            <div className="text-center">
              <div>Total Earnings</div>
              {/* Display the total earnings if available, else fallback to $0 */}
              <div className="text-3xl font-bold">
                ${driverDetails.totalEarnings || "0"}
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default DriversHeader;

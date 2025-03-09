// import React from "react";
// import PassengerSidebar from "../../My_Components/Passengers/PassengerSidebar";
// import PassengerDashboardContent from "../../My_Components/Passengers/PassengerDashboardContent";

// const PassengerDashboard = () => {
//   return (
//     <>
//       <PassengerSidebar contentComponent={<PassengerDashboardContent />} />
//     </>
//   );
// };

// export default PassengerDashboard;

import React from "react";
import PassengerLayout from "../../My_Components/Passengers/PassengerSidebar";
import PassengerDashboardContent from "../../My_Components/Passengers/PassengerDashboardContent";

const PassengerDashboard = () => {
  return (
    <PassengerLayout>
      <PassengerDashboardContent />
    </PassengerLayout>
  );
};

export default PassengerDashboard;

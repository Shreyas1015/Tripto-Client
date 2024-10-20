// import React, { useEffect, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   Eye,
//   Check,
//   X,
//   AlertCircle,
//   Search,
//   ArrowLeft,
//   User,
//   Badge,
// } from "lucide-react";
// import axiosInstance from "../../API/axiosInstance";
// import secureLocalStorage from "react-secure-storage";

// const DocumentCard = ({ document, onStatusChange, onViewDocument }) => {
//   return (
//     <div className="border rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg">
//       <div className="p-4">
//         <div className="aspect-video relative mb-4">
//           <img
//             src={document.file}
//             alt={document.title}
//             className="object-cover w-full h-full rounded-md"
//           />
//           <span
//             className={`absolute top-2 right-2 px-2 py-1 rounded-md text-white ${
//               document.status === "Approved"
//                 ? "bg-green-500"
//                 : document.status === "Rejected"
//                 ? "bg-red-500"
//                 : "bg-yellow-500"
//             }`}
//           >
//             {document.status}
//           </span>
//           {document.newUpload && (
//             <span className="absolute top-2 left-2 px-2 py-1 rounded-md text-white bg-blue-500">
//               New Upload
//             </span>
//           )}
//         </div>
//         <h3 className="text-lg font-semibold mb-2">{document.title}</h3>
//         <div className="flex space-x-2">
//           <button
//             className="border border-gray-300 px-3 py-1 rounded-md flex items-center"
//             onClick={() => onViewDocument(document)}
//           >
//             <Eye className="w-4 h-4 mr-2" /> View
//           </button>
//           {document.status !== "Approved" && (
//             <button
//               className="border border-gray-300 px-3 py-1 rounded-md flex items-center"
//               onClick={() => onStatusChange(document.id, "Approved")}
//             >
//               <Check className="w-4 h-4 mr-2" /> Approve
//             </button>
//           )}
//           {document.status !== "Rejected" && (
//             <button
//               className="border border-gray-300 px-3 py-1 rounded-md flex items-center"
//               onClick={() => onStatusChange(document.id, "Rejected")}
//             >
//               <X className="w-4 h-4 mr-2" /> Reject
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// const DriverDocuments = ({ driver, onBackToList }) => {
//   const [driverDocuments, setDriverDocuments] = useState(
//     documents.filter((doc) => doc.driverId === driver.id)
//   );
//   const [viewingDocument, setViewingDocument] = useState(null);
//   const [rejectionReason, setRejectionReason] = useState("");
//   const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);

//   const handleStatusChange = (id, newStatus) => {
//     if (newStatus === "Rejected") {
//       setIsRejectionModalOpen(true);
//       setViewingDocument(driverDocuments.find((doc) => doc.id === id));
//     } else {
//       setDriverDocuments((prevDocs) =>
//         prevDocs.map((doc) =>
//           doc.id === id ? { ...doc, status: newStatus, newUpload: false } : doc
//         )
//       );
//     }
//   };

//   const submitRejection = () => {
//     setDriverDocuments((prevDocs) =>
//       prevDocs.map((doc) =>
//         doc.id === viewingDocument.id
//           ? { ...doc, status: "Rejected", rejectionReason, newUpload: false }
//           : doc
//       )
//     );
//     setIsRejectionModalOpen(false);
//     setRejectionReason("");
//   };

// const documentCounts = driverDocuments.reduce(
//   (acc, doc) => {
//     acc.total++;
//     acc[doc.status.toLowerCase()]++;
//     return acc;
//   },
//   { total: 0, approved: 0, pending: 0, rejected: 0 }
// );

//   return (
// <div className="space-y-8">
// {/* <div className="flex items-center justify-between">
//   <button className="text-gray-600 flex items-center" onClick={onBackToList}>
//     <ArrowLeft className="w-4 h-4 mr-2" /> Back to Driver List
//   </button>
//   <div className="flex items-center space-x-4">
//     <img
//       src={driver.avatar}
//       alt={driver.name}
//       className="h-12 w-12 rounded-full object-cover"
//     />
//     <div>
//       <h2 className="text-2xl font-bold">{driver.name}</h2>
//       <span
//         className={`px-2 py-1 rounded-md text-white ${
//           driver.status === "Approved"
//             ? "bg-green-500"
//             : driver.status === "Rejected"
//             ? "bg-red-500"
//             : "bg-yellow-500"
//         }`}
//       >
//         {driver.status}
//       </span>
//     </div>
//   </div>
// </div>; */}

// <div className="grid grid-cols-4 gap-4">
//   <div className="border p-4 rounded-lg">
//     <h3 className="text-lg font-semibold">Total Documents</h3>
//     <p className="text-3xl font-bold">{documentCounts.total}</p>
//   </div>
//   <div className="border p-4 rounded-lg">
//     <h3 className="text-lg font-semibold">Pending</h3>
//     <p className="text-3xl font-bold text-yellow-500">
//       {documentCounts.pending}
//     </p>
//   </div>
//   <div className="border p-4 rounded-lg">
//     <h3 className="text-lg font-semibold">Approved</h3>
//     <p className="text-3xl font-bold text-green-500">
//       {documentCounts.approved}
//     </p>
//   </div>
//   <div className="border p-4 rounded-lg">
//     <h3 className="text-lg font-semibold">Rejected</h3>
//     <p className="text-3xl font-bold text-red-500">
//       {documentCounts.rejected}
//     </p>
//   </div>
// </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {driverDocuments.map((doc) => (
//           <DocumentCard
//             key={doc.id}
//             document={doc}
//             onStatusChange={handleStatusChange}
//             onViewDocument={setViewingDocument}
//           />
//         ))}
//       </div>

//       {/* Document View Modal */}
//       {viewingDocument && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
//           <div className="bg-white p-6 rounded-lg max-w-3xl w-full">
//             <h3 className="text-xl font-bold mb-4">{viewingDocument.title}</h3>
//             <img
//               src={viewingDocument.file}
//               alt={viewingDocument.title}
//               className="aspect-video object-contain w-full"
//             />
//             {viewingDocument.status === "Rejected" && (
//               <div className="mt-4 p-4 bg-red-100 rounded-md">
//                 <h4 className="font-semibold flex items-center">
//                   <AlertCircle className="w-5 h-5 mr-2 text-red-500" />
//                   Rejection Reason
//                 </h4>
//                 <p>{viewingDocument.rejectionReason}</p>
//               </div>
//             )}
//             <button
//               className="mt-4 border px-4 py-2 rounded-md"
//               onClick={() => setViewingDocument(null)}
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Rejection Modal */}
//       {isRejectionModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
//           <div className="bg-white p-6 rounded-lg max-w-xl w-full">
//             <h3 className="text-xl font-bold mb-4">
//               Reject {viewingDocument.title}
//             </h3>
//             <textarea
//               value={rejectionReason}
//               onChange={(e) => setRejectionReason(e.target.value)}
//               className="w-full p-2 border rounded-md"
//               placeholder="Enter reason for rejection"
//             />
//             <div className="mt-4 flex justify-end space-x-2">
//               <button
//                 className="border px-4 py-2 rounded-md"
//                 onClick={() => setIsRejectionModalOpen(false)}
//               >
//                 Cancel
//               </button>
//               <button
//                 className="bg-red-500 text-white px-4 py-2 rounded-md"
//                 onClick={submitRejection}
//               >
//                 Reject
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// const AdminDriverVerificationContent = () => {
//   const [selectedDriver, setSelectedDriver] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const decryptedUID = secureLocalStorage.getItem("uid");
//   const [drivers, setDrivers] = useState([]);

//   useEffect(() => {
//     const fetchAllDriversList = async () => {
//       try {
//         const res = await axiosInstance.post(
//           `${process.env.REACT_APP_BASE_URL}/admin/fetchAllDriversList`,
//           {
//             decryptedUID,
//           }
//         );
//         setDrivers(res.data);
//         console.log(res.data);
//       } catch (error) {
//         console.error("Error fetching drivers list:", error.message);
//       }
//     };

//     fetchAllDriversList();
//   }, [decryptedUID]);

//   const filteredDrivers = drivers.filter((driver) =>
//     driver.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="min-h-screen p-8">
//       <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-8">
//         <h1 className="text-3xl font-bold text-[#0bbfe0] mb-8">
//           Driver Document Verification
//         </h1>

//         {selectedDriver ? (
//           <DriverDocuments
//             driver={selectedDriver}
//             onBackToList={() => setSelectedDriver(null)}
//           />
//         ) : (
//           <>
//             <div className="mb-4 flex justify-between items-center">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                 <input
//                   type="text"
//                   placeholder="Search drivers..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="pl-10 pr-4 py-2 w-64"
//                 />
//               </div>
//             </div>

//             <table className="min-w-full border-collapse bg-white rounded-lg shadow overflow-hidden">
//               <thead className="bg-gray-100 text-left">
//                 <tr>
//                   <th className="p-4 font-medium text-gray-600">Driver</th>
//                   <th className="p-4 font-medium text-gray-600">Status</th>
//                   <th className="p-4 font-medium text-gray-600">Action</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 {filteredDrivers.map((driver) => (
//                   <tr
//                     key={driver.did}
//                     className="hover:bg-gray-50 transition-colors"
//                   >
//                     <td className="p-4 flex items-center space-x-3">
//                       <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
//                         {driver.avatar ? (
//                           <img
//                             src={driver.profile_img}
//                             alt={driver.name}
//                             className="h-10 w-10 rounded-full object-cover"
//                           />
//                         ) : (
//                           <User className="h-5 w-5 text-gray-500" />
//                         )}
//                       </div>
//                       <span className="text-gray-800 font-medium">
//                         {driver.name}
//                       </span>
//                     </td>
//                     <td className="p-4">
//                       <span
//                         className={`px-3 py-2 rounded-md text-white text-sm font-semibold ${
//                           driver.all_documents_status === 1
//                             ? "bg-green-500"
//                             : "bg-yellow-500"
//                         }`}
//                       >
//                         {driver.all_documents_status === 1
//                           ? "Accepted"
//                           : "Pending"}
//                       </span>
//                     </td>
//                     <td className="p-4">
//                       <button
//                         onClick={() => setSelectedDriver(driver.did)}
//                         className="bg-black text-white px-4 py-2 rounded-md "
//                       >
//                         View Documents
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminDriverVerificationContent;
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  Check,
  X,
  AlertCircle,
  Search,
  ArrowLeft,
  User,
  Badge,
} from "lucide-react";
import axiosInstance from "../../API/axiosInstance";
import secureLocalStorage from "react-secure-storage";
import toast from "react-hot-toast";

const DocumentCard = ({ document, onApprove, onReject, onView, newUpload }) => {
  return (
    <AnimatePresence>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="border p-4 rounded-lg shadow-md bg-white"
      >
        {document.status === 2 && newUpload && (
          <span className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-3 py-2 rounded-full">
            New Upload
          </span>
        )}
        <h3 className="text-lg font-semibold mb-2">{document.title}</h3>
        {document.url ? (
          <img
            src={document.url}
            alt={document.title}
            className="w-full h-80 mb-3 rounded-lg object-cover"
          />
        ) : (
          <p className="text-gray-500 mb-3">No document uploaded.</p>
        )}
        <p className="mb-4">
          <span className="font-bold">Status: </span>
          <span
            className={`${
              document.status === 0
                ? "text-yellow-500"
                : document.status === 1
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {document.status === 0
              ? "Pending"
              : document.status === 1
              ? "Approved"
              : "Rejected"}
          </span>
        </p>
        <div className="flex space-x-2">
          <button
            className="bg-white text-slate-700 border-zinc-500 border-1 px-2 py-2 rounded-md hover:bg-green-600 transition flex items-center space-x-1"
            onClick={() => onView(document.url)}
          >
            <Eye />
            <span>View</span>
          </button>
          <button
            className="bg-white text-slate-700 border-zinc-500 border-1 px-2 py-2 rounded-md hover:bg-green-600 transition flex items-center space-x-1"
            onClick={() => onApprove(document.key)}
            disabled={document.status === 1 && !newUpload}
          >
            <Check />
            <span>Approve</span>
          </button>
          <button
            className="bg-white text-slate-700 border-zinc-500 border-1 px-2 py-2 rounded-md hover:bg-green-600 transition flex items-center space-x-1"
            onClick={() => onReject(document.key)}
            disabled={document.status === 2 && !newUpload}
          >
            <X />
            <span>Reject</span>
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

const DriverDocuments = ({ driverId, onBackToList }) => {
  const [driverData, setDriverData] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [viewingDocument, setViewingDocument] = useState(null);
  const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const decryptedUID = secureLocalStorage.getItem("uid");

  // Fetch driver documents when component mounts
  useEffect(() => {
    const fetchAdminParticularDriverDocuments = async () => {
      try {
        const response = await axiosInstance.post(
          `${process.env.REACT_APP_BASE_URL}/admin/fetchAdminParticularDriverDocuments`,
          { decryptedUID, driverId }
        );
        setDriverData(response.data);
        console.log("Particular Driver : ", response.data);
      } catch (error) {
        console.error("Error fetching driver documents:", error);
        toast.error("Failed to fetch driver documents. Please try again."); // Set error message
      }
    };

    fetchAdminParticularDriverDocuments();
  }, [driverId, decryptedUID]);

  const handleStatusChange = async (documentKey, newStatus) => {
    try {
      const data = {
        documentKey,
        newStatus,
        reason: rejectionReason,
        decryptedUID,
        driverId,
      };

      console.log("Sending data:", data);

      const response = await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/admin/handleDocumentStatusChange`,
        data
      );

      if (response.status === 200) {
        // Ensure you are correctly updating the driver data by targeting the first element in the array
        setDriverData((prevData) => {
          if (!prevData || prevData.length === 0) return prevData; // handle case where driverData might be empty
          const updatedDriverData = [...prevData]; // create a copy of the existing array
          updatedDriverData[0] = {
            ...updatedDriverData[0], // copy the existing driver object
            [documentKey]: newStatus, // update the specific document status
          };
          return updatedDriverData; // return the updated array
        });

        setRejectionReason("");
        toast.success("Document status updated successfully.");
      }
    } catch (error) {
      console.error("Error updating document status:", error);
      toast.error("Failed to update document status. Please try again.");
    }
  };

  const submitRejection = async () => {
    if (!viewingDocument) return;

    const rejectionStatus = 2;
    await handleStatusChange(viewingDocument.statusKey, rejectionStatus);
    setIsRejectionModalOpen(false);
  };

  const handleViewDocument = (url) => {
    setViewingDocument(url);
    setIsViewModalOpen(true);
  };

  const isNewUpload = (documentUpdatedAt, reasonUpdatedAt) => {
    return new Date(documentUpdatedAt) > new Date(reasonUpdatedAt);
  };

  if (!driverData) return <div>Loading...</div>;

  const documents = [
    {
      key: "aadharFront",
      statusKey: "aadharFrontStatus",
      title: "Aadhar Front",
    },
    { key: "aadharBack", statusKey: "aadharBackStatus", title: "Aadhar Back" },
    {
      key: "drivingLicenseFront",
      statusKey: "drivingLicenseFrontStatus",
      title: "Driving License Front",
    },
    {
      key: "drivingLicenseBack",
      statusKey: "drivingLicenseBackStatus",
      title: "Driving License Back",
    },
    {
      key: "panCardFront",
      statusKey: "panCardFrontStatus",
      title: "Pan Card Front",
    },
    {
      key: "fitnessCertificate",
      statusKey: "fitnessCertificateStatus",
      title: "Fitness Certificate",
    },
    { key: "insurance", statusKey: "insuranceStatus", title: "Insurance" },
    { key: "puc", statusKey: "pucStatus", title: "PUC" },
    { key: "rc", statusKey: "rcStatus", title: "RC" },
    { key: "selfie", statusKey: "selfieStatus", title: "Selfie" },
    { key: "taxReceipt", statusKey: "taxReceiptStatus", title: "Tax Receipt" },
    {
      key: "passbookOrCheque",
      statusKey: "passbookOrChequeStatus",
      title: "Passbook or Cheque",
    },
    { key: "permit", statusKey: "permitStatus", title: "Permit" },
  ];

  const handleAllDocsStatus = async (newStatus) => {
    try {
      const data = {
        decryptedUID,
        driverId,
        newStatus,
      };

      const response = await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/admin/handleAllDocsStatus`,
        data
      );

      if (response.status === 200) {
        setDriverData((prevData) => {
          if (!prevData || prevData.length === 0) return prevData;
          const updatedDriverData = [...prevData];
          updatedDriverData[0] = {
            ...updatedDriverData[0],
            all_documents_status: newStatus,
          };
          return updatedDriverData;
        });
        if (response.data.status === 1) {
          toast.success("Driver Verified Successfully !!");
        } else {
          toast.error("Driver Rejected !!");
        }
      }
    } catch (error) {
      console.error("Error updating all documents status:", error);
      toast.error("Failed to update all documents status. Please try again.");
    }
  };

  const totalDocuments = documents.length;
  const acceptedDocuments = documents.filter(
    (doc) => driverData.length > 0 && driverData[0][doc.statusKey] === 1
  ).length;
  const pendingDocuments = documents.filter(
    (doc) => driverData.length > 0 && driverData[0][doc.statusKey] === 0
  ).length;
  const rejectedDocuments = documents.filter(
    (doc) => driverData.length > 0 && driverData[0][doc.statusKey] === 2
  ).length;

  return (
    <div className="space-y-8">
      {/* Display error message */}
      <div className="flex items-center justify-between">
        <button
          className="text-gray-600 flex items-center"
          onClick={onBackToList}
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Driver List
        </button>
        <div className="flex items-center space-x-4">
          <User className="h-12 w-12 rounded-full object-cover mx-2 p-1 border-slate-600 border-2" />
          <div>
            <h2 className="text-2xl my-2 font-bold">
              {driverData.length > 0 && driverData[0].name
                ? driverData[0].name
                : "N/A"}
            </h2>
            <span
              className={`px-2 py-1 rounded-md text-sm text-white ${
                driverData[0].all_documents_status === 1
                  ? "bg-green-500"
                  : driverData[0].all_documents_status === 2
                  ? "bg-red-500"
                  : "bg-yellow-500"
              }`}
            >
              {driverData[0].all_documents_status === 1
                ? "Verified"
                : driverData[0].all_documents_status === 2
                ? "Rejected "
                : "Pending"}
            </span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <div className="border p-4 rounded-lg">
          <h3 className="text-lg font-semibold">Total Documents</h3>
          <p className="text-3xl font-bold">{totalDocuments}</p>
        </div>
        <div className="border p-4 rounded-lg">
          <h3 className="text-lg font-semibold">Pending</h3>
          <p className="text-3xl font-bold text-yellow-500">
            {pendingDocuments}
          </p>
        </div>
        <div className="border p-4 rounded-lg">
          <h3 className="text-lg font-semibold">Approved</h3>
          <p className="text-3xl font-bold text-green-500">
            {acceptedDocuments}
          </p>
        </div>
        <div className="border p-4 rounded-lg">
          <h3 className="text-lg font-semibold">Rejected</h3>
          <p className="text-3xl font-bold text-red-500">{rejectedDocuments}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documents.map((doc) => {
          // Check if driverData is not empty and access the first element
          const driverDoc =
            driverData.length > 0 ? driverData[0][doc.key] : null;
          const docStatus =
            driverData.length > 0 ? driverData[0][doc.statusKey] : null;
          console.log("Checking new upload for:", doc.key);
          console.log(
            "Document Updated At:",
            driverData[0][`${doc.key}_updated_at`]
          );
          console.log(
            "Reason Updated At:",
            driverData[0][`${doc.key}Reason_updated_at`]
          );

          return (
            <DocumentCard
              key={doc.key}
              document={{
                title: doc.title,
                url: driverDoc,
                status: docStatus,
                key: doc.statusKey,
              }}
              newUpload={isNewUpload(
                driverData[0][`${doc.key}_updated_at`],
                driverData[0][`${doc.key}Reason_updated_at`]
              )}
              onApprove={(key) => handleStatusChange(key, 1)}
              onReject={(key) => {
                setViewingDocument({ key: doc.key, statusKey: doc.statusKey });
                setIsRejectionModalOpen(true);
              }}
              onView={handleViewDocument}
            />
          );
        })}
      </div>

      <div className="flex space-x-4">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded-md"
          onClick={() => handleAllDocsStatus(1)}
        >
          Accept Driver
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded-md"
          onClick={() => handleAllDocsStatus(2)}
        >
          Reject Driver
        </button>
      </div>
      {isViewModalOpen && viewingDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg max-w-xl w-full max-h-full overflow-y-auto">
            <img
              src={viewingDocument}
              alt="Document"
              className="w-full h-auto rounded-md"
            />
            <button
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md"
              onClick={() => setIsViewModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {isRejectionModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Rejection Reason</h3>
            <textarea
              className="border border-gray-300 rounded-md w-full mb-4"
              rows="3"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
            <div className="flex justify-between">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                onClick={submitRejection}
              >
                Submit
              </button>
              <button
                className="border border-gray-300 px-4 py-2 rounded-md"
                onClick={() => setIsRejectionModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AdminDriverVerificationContent = () => {
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const decryptedUID = secureLocalStorage.getItem("uid");
  const [drivers, setDrivers] = useState([]);
  const [error, setError] = useState(""); // Added error state

  useEffect(() => {
    const fetchAllDriversList = async () => {
      try {
        const res = await axiosInstance.post(
          `${process.env.REACT_APP_BASE_URL}/admin/fetchAllDriversList`,
          {
            decryptedUID,
          }
        );
        setDrivers(res.data);
        console.log(res.data);
      } catch (error) {
        console.error("Error fetching drivers list:", error.message);
        setError("Failed to fetch drivers list. Please try again."); // Set error message
      }
    };

    fetchAllDriversList();
  }, [decryptedUID]);

  const filteredDrivers = drivers.filter((driver) =>
    driver.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-[#0bbfe0] mb-8">
          Driver Document Verification
        </h1>
        {error && <div className="text-red-500">{error}</div>}{" "}
        {/* Display error message */}
        {selectedDriver ? (
          <DriverDocuments
            driverId={selectedDriver} // Ensure correct prop is passed
            onBackToList={() => setSelectedDriver(null)}
          />
        ) : (
          <>
            <div className="mb-4 flex justify-between items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search drivers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-64"
                />
              </div>
            </div>

            <table className="min-w-full border-collapse bg-white rounded-lg shadow overflow-hidden">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="p-4 font-medium text-gray-600">Driver</th>
                  <th className="p-4 font-medium text-gray-600">Status</th>
                  <th className="p-4 font-medium text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredDrivers.map((driver) => (
                  <tr
                    key={driver.did}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-4 flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-500" />
                      </div>
                      <span className="text-gray-800 font-medium">
                        {driver.name}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-2 rounded-md text-white text-sm font-semibold ${
                          driver.all_documents_status === 1
                            ? "bg-green-500"
                            : driver.all_documents_status === 2
                            ? "bg-red-500"
                            : "bg-yellow-500"
                        }`}
                      >
                        {driver.all_documents_status === 1
                          ? "Verified"
                          : driver.all_documents_status === 2
                          ? "Rejected "
                          : "Pending"}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => setSelectedDriver(driver.did)}
                        className="bg-black text-white px-4 py-2 rounded-md "
                      >
                        View Documents
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDriverVerificationContent;

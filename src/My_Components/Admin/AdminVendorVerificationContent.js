import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  Check,
  X,
  AlertCircle,
  Search,
  ArrowLeft,
  User,
  Building,
  FileText,
  RefreshCw,
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
            src={document.url || "/placeholder.svg"}
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
            className="bg-white text-slate-700 border-zinc-500 border px-2 py-2 rounded-md hover:bg-gray-100 transition flex items-center space-x-1"
            onClick={() => onView(document.url)}
            disabled={!document.url}
          >
            <Eye className="h-4 w-4" />
            <span>View</span>
          </button>
          <button
            className="bg-white text-slate-700 border-zinc-500 border px-2 py-2 rounded-md hover:bg-green-100 hover:text-green-700 hover:border-green-500 transition flex items-center space-x-1"
            onClick={() => onApprove(document.key)}
            disabled={document.status === 1 && !newUpload}
          >
            <Check className="h-4 w-4" />
            <span>Approve</span>
          </button>
          <button
            className="bg-white text-slate-700 border-zinc-500 border px-2 py-2 rounded-md hover:bg-red-100 hover:text-red-700 hover:border-red-500 transition flex items-center space-x-1"
            onClick={() => onReject(document.key)}
            disabled={document.status === 2 && !newUpload}
          >
            <X className="h-4 w-4" />
            <span>Reject</span>
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

const VendorDocuments = ({ vendorId, onBackToList }) => {
  const [vendorData, setVendorData] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [viewingDocument, setViewingDocument] = useState(null);
  const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const decryptedUID = secureLocalStorage.getItem("uid");

  // Fetch vendor documents when component mounts
  useEffect(() => {
    const fetchAdminParticularVendorDocuments = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.post(
          `${process.env.REACT_APP_BASE_URL}/admin/fetchAdminParticularVendorDocuments`,
          { decryptedUID, vendorId }
        );
        setVendorData(response.data);
        console.log("Particular Vendor: ", response.data);
      } catch (error) {
        console.error("Error fetching vendor documents:", error);
        toast.error("Failed to fetch vendor documents. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminParticularVendorDocuments();
  }, [vendorId, decryptedUID]);

  const handleStatusChange = async (documentKey, newStatus) => {
    try {
      const data = {
        documentKey,
        newStatus,
        reason: rejectionReason,
        decryptedUID,
        vendorId,
      };

      console.log("Sending data:", data);

      const response = await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/admin/handleVendorDocumentStatusChange`,
        data
      );

      if (response.status === 200) {
        // Ensure you are correctly updating the vendor data by targeting the first element in the array
        setVendorData((prevData) => {
          if (!prevData || prevData.length === 0) return prevData; // handle case where vendorData might be empty
          const updatedVendorData = [...prevData]; // create a copy of the existing array
          updatedVendorData[0] = {
            ...updatedVendorData[0], // copy the existing vendor object
            [documentKey]: newStatus, // update the specific document status
          };
          return updatedVendorData; // return the updated array
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
    if (!documentUpdatedAt || !reasonUpdatedAt) return false;

    const docUpdatedAt = new Date(documentUpdatedAt);
    const reasonUpdatedAtDate = new Date(reasonUpdatedAt);

    return docUpdatedAt > reasonUpdatedAtDate;
  };

  const handleAllDocsStatus = async (newStatus) => {
    try {
      const data = {
        decryptedUID,
        vendorId,
        newStatus,
      };

      const response = await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/admin/handleAllVendorDocsStatus`,
        data
      );

      if (response.status === 200) {
        setVendorData((prevData) => {
          if (!prevData || prevData.length === 0) return prevData;
          const updatedVendorData = [...prevData];
          updatedVendorData[0] = {
            ...updatedVendorData[0],
            all_documents_status: newStatus,
          };
          return updatedVendorData;
        });

        if (newStatus === 1) {
          toast.success("Vendor Verified Successfully!");
        } else {
          toast.error("Vendor Rejected!");
        }
      }
    } catch (error) {
      console.error("Error updating all documents status:", error);
      toast.error("Failed to update all documents status. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!vendorData || vendorData.length === 0) {
    return (
      <div className="text-center text-gray-500">No vendor data found</div>
    );
  }

  const documents = [
    {
      key: "aadharFront",
      statusKey: "aadharFrontStatus",
      title: "Aadhar Front",
    },
    {
      key: "aadharBack",
      statusKey: "aadharBackStatus",
      title: "Aadhar Back",
    },
    {
      key: "panCardFront",
      statusKey: "panCardFrontStatus",
      title: "PAN Card",
    },
    {
      key: "udyamAadhar",
      statusKey: "udyamAadharStatus",
      title: "Udyam Aadhar",
    },
    {
      key: "ghumastaLicense",
      statusKey: "ghumastaLicenseStatus",
      title: "Ghumasta License",
    },
    {
      key: "profilePhoto",
      statusKey: "profilePhotoStatus",
      title: "Profile Photo",
    },
  ];

  const totalDocuments = documents.length;
  const acceptedDocuments = documents.filter(
    (doc) => vendorData[0][doc.statusKey] === 1
  ).length;
  const pendingDocuments = documents.filter(
    (doc) => vendorData[0][doc.statusKey] === 0
  ).length;
  const rejectedDocuments = documents.filter(
    (doc) => vendorData[0][doc.statusKey] === 2
  ).length;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <button
          className="text-gray-600 flex items-center hover:text-gray-900 transition-colors"
          onClick={onBackToList}
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Vendor List
        </button>
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            {vendorData[0].profilePhoto ? (
              <img
                src={vendorData[0].profilePhoto || "/placeholder.svg"}
                alt={vendorData[0].name}
                className="h-full w-full object-cover"
              />
            ) : (
              <User className="h-6 w-6 text-gray-500" />
            )}
          </div>
          <div>
            <h2 className="text-2xl my-2 font-bold">
              {vendorData[0].name || "N/A"}
            </h2>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <span
                className={`px-2 py-1 rounded-md text-sm text-white ${
                  vendorData[0].all_documents_status === 1
                    ? "bg-green-500"
                    : vendorData[0].all_documents_status === 2
                    ? "bg-red-500"
                    : "bg-yellow-500"
                }`}
              >
                {vendorData[0].all_documents_status === 1
                  ? "Verified"
                  : vendorData[0].all_documents_status === 2
                  ? "Rejected"
                  : "Pending"}
              </span>
              {vendorData[0].firm_name && (
                <span className="text-gray-600 flex items-center">
                  <Building className="h-4 w-4 mr-1" />
                  {vendorData[0].firm_name}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="border p-4 rounded-lg shadow-sm bg-white">
          <h3 className="text-lg font-semibold text-gray-700">
            Total Documents
          </h3>
          <p className="text-3xl font-bold text-gray-900">{totalDocuments}</p>
        </div>
        <div className="border p-4 rounded-lg shadow-sm bg-white">
          <h3 className="text-lg font-semibold text-gray-700">Pending</h3>
          <p className="text-3xl font-bold text-yellow-500">
            {pendingDocuments}
          </p>
        </div>
        <div className="border p-4 rounded-lg shadow-sm bg-white">
          <h3 className="text-lg font-semibold text-gray-700">Approved</h3>
          <p className="text-3xl font-bold text-green-500">
            {acceptedDocuments}
          </p>
        </div>
        <div className="border p-4 rounded-lg shadow-sm bg-white">
          <h3 className="text-lg font-semibold text-gray-700">Rejected</h3>
          <p className="text-3xl font-bold text-red-500">{rejectedDocuments}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documents.map((doc) => {
          const vendorDoc = vendorData[0][doc.key];
          const docStatus = vendorData[0][doc.statusKey];

          return (
            <DocumentCard
              key={doc.key}
              document={{
                title: doc.title,
                url: vendorDoc,
                status: docStatus,
                key: doc.statusKey,
              }}
              newUpload={isNewUpload(
                vendorData[0][`${doc.key}_updated_at`],
                vendorData[0][`${doc.key}Reason_updated_at`]
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

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-md font-medium transition-colors flex items-center justify-center"
          onClick={() => handleAllDocsStatus(1)}
        >
          <Check className="h-5 w-5 mr-2" />
          Verify Vendor
        </button>
        <button
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-md font-medium transition-colors flex items-center justify-center"
          onClick={() => handleAllDocsStatus(2)}
        >
          <X className="h-5 w-5 mr-2" />
          Reject Vendor
        </button>
      </div>

      {/* View Document Modal */}
      {isViewModalOpen && viewingDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Document Preview</h3>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setIsViewModalOpen(false)}
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <img
              src={viewingDocument || "/placeholder.svg"}
              alt="Document"
              className="w-full h-auto rounded-md"
            />
            <div className="mt-4 flex justify-end">
              <button
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md transition-colors"
                onClick={() => setIsViewModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {isRejectionModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Rejection Reason</h3>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setIsRejectionModalOpen(false)}
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <p className="text-gray-600 mb-4">
              Please provide a reason for rejecting this document:
            </p>
            <textarea
              className="border border-gray-300 rounded-md w-full p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
              placeholder="Enter rejection reason..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
            <div className="flex justify-end gap-3">
              <button
                className="border border-gray-300 hover:bg-gray-100 px-4 py-2 rounded-md transition-colors"
                onClick={() => setIsRejectionModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
                onClick={submitRejection}
                disabled={!rejectionReason.trim()}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AdminVendorVerification = () => {
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const decryptedUID = secureLocalStorage.getItem("uid");

  useEffect(() => {
    const fetchAllVendorsList = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.post(
          `${process.env.REACT_APP_BASE_URL}/admin/fetchAllVendorsList`,
          {
            decryptedUID,
          }
        );
        setVendors(res.data);
        console.log("Vendors list:", res.data);
      } catch (error) {
        console.error("Error fetching vendors list:", error.message);
        setError("Failed to fetch vendors list. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllVendorsList();
  }, [decryptedUID]);

  const filteredVendors = vendors.filter(
    (vendor) =>
      vendor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.firm_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.phone_number?.includes(searchTerm)
  );

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8">
          Vendor Document Verification
        </h1>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {selectedVendor ? (
          <VendorDocuments
            vendorId={selectedVendor}
            onBackToList={() => setSelectedVendor(null)}
          />
        ) : (
          <>
            <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="relative w-full md:w-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search vendors by name, firm, email or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="text-gray-600 text-sm">
                {filteredVendors.length}{" "}
                {filteredVendors.length === 1 ? "vendor" : "vendors"} found
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
              </div>
            ) : filteredVendors.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No vendors found
                </h3>
                <p className="text-gray-500">
                  {searchTerm
                    ? "Try adjusting your search terms"
                    : "There are no vendors in the system yet"}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse bg-white rounded-lg shadow overflow-hidden">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-4 text-left font-medium text-gray-600">
                        Vendor
                      </th>
                      <th className="p-4 text-left font-medium text-gray-600 hidden md:table-cell">
                        Firm Name
                      </th>
                      <th className="p-4 text-left font-medium text-gray-600 hidden lg:table-cell">
                        Contact
                      </th>
                      <th className="p-4 text-left font-medium text-gray-600">
                        Status
                      </th>
                      <th className="p-4 text-left font-medium text-gray-600">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredVendors.map((vendor) => (
                      <tr
                        key={vendor.vid}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="p-4 flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                            {vendor.profilePhoto ? (
                              <img
                                src={vendor.profilePhoto || "/placeholder.svg"}
                                alt={vendor.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <User className="h-5 w-5 text-gray-500" />
                            )}
                          </div>
                          <div>
                            <span className="text-gray-800 font-medium block">
                              {vendor.name || "N/A"}
                            </span>
                            <span className="text-gray-500 text-sm block md:hidden">
                              {vendor.firm_name || "No firm name"}
                            </span>
                          </div>
                        </td>
                        <td className="p-4 hidden md:table-cell">
                          <div className="flex items-center">
                            <Building className="h-4 w-4 text-gray-400 mr-2" />
                            <span>{vendor.firm_name || "N/A"}</span>
                          </div>
                        </td>
                        <td className="p-4 hidden lg:table-cell">
                          <div className="space-y-1">
                            <div className="text-sm text-gray-600">
                              {vendor.email}
                            </div>
                            <div className="text-sm text-gray-600">
                              {vendor.phone_number}
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-3 py-1 rounded-full text-white text-sm font-medium ${
                              vendor.all_documents_status === 1
                                ? "bg-green-500"
                                : vendor.all_documents_status === 2
                                ? "bg-red-500"
                                : "bg-yellow-500"
                            }`}
                          >
                            {vendor.all_documents_status === 1
                              ? "Verified"
                              : vendor.all_documents_status === 2
                              ? "Rejected"
                              : "Pending"}
                          </span>
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => setSelectedVendor(vendor.vid)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors text-sm font-medium"
                          >
                            View Documents
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminVendorVerification;

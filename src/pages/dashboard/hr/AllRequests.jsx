import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Check, X, Clock } from "lucide-react";
import Swal from "sweetalert2";
import useDatabaseUser from "../../../hooks/useDatabaseUser";

const AllRequests = () => {
  const { dbUser, loading } = useDatabaseUser();
  const [requests, setRequests] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");

  // 🔹 Fetch requests
  const fetchRequests = useCallback(async () => {
    if (!dbUser?.email) return;
    try {
      setLoadingData(true);
      console.log("📋 Fetching requests for HR:", dbUser.email);
      const res = await axios.get(
        `http://localhost:3000/requests?hrEmail=${dbUser.email}`,
        { timeout: 5000 },
      );
      console.log("✅ Requests loaded:", res.data);
      setRequests(res.data || []);
    } catch (error) {
      console.error("❌ Error fetching requests:", error.message);
      setRequests([]);
    } finally {
      setLoadingData(false);
    }
  }, [dbUser]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  // 🔹 Filter requests by status
  const filteredRequests =
    filterStatus === "all"
      ? requests
      : requests.filter((r) => r.status === filterStatus);

  // 🔹 Approve request
  const handleApprove = async (requestId) => {
    try {
      await axios.patch(`http://localhost:3000/requests/${requestId}`, {
        status: "approved",
      });

      fetchRequests();

      Swal.fire({
        icon: "success",
        title: "Approved",
        text: "Request approved successfully",
      });
    } catch (error) {
      console.error(error);
      const message =
        error.response?.data?.code === "PACKAGE_LIMIT"
          ? "Package limit reached. Please upgrade your plan."
          : "Failed to approve request";
      Swal.fire("Error", message, "error");
    }
  };

  // 🔹 Reject request
  const handleReject = async (requestId) => {
    try {
      await axios.patch(`http://localhost:3000/requests/${requestId}`, {
        status: "rejected",
      });
      fetchRequests();

      Swal.fire({
        icon: "success",
        title: "Rejected",
        text: "Request rejected",
      });
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to reject request", "error");
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-primary mb-4">Asset Requests</h2>

        {/* Filter */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setFilterStatus("all")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filterStatus === "all"
                ? "bg-primary text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterStatus("pending")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filterStatus === "pending"
                ? "bg-yellow-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilterStatus("approved")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filterStatus === "approved"
                ? "bg-green-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Approved
          </button>
          <button
            onClick={() => setFilterStatus("rejected")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filterStatus === "rejected"
                ? "bg-red-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Rejected
          </button>
        </div>
      </div>

      {loadingData ? (
        <div className="flex justify-center items-center h-[50vh]">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="text-center py-12 bg-base-100 rounded-lg">
          <p className="text-gray-500 text-lg">No requests found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-lg shadow">
            <thead>
              <tr className="bg-base-200 border-b">
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Asset
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Request Date
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Note
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold">
                  Status
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((req) => (
                <tr
                  key={req._id}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium">{req.employeeName}</p>
                      <p className="text-sm text-gray-500">
                        {req.employeeEmail}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {req.assetImage && (
                        <img
                          src={req.assetImage}
                          alt="asset"
                          className="w-10 h-10 rounded"
                        />
                      )}
                      <p className="font-medium">{req.assetName}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(req.requestDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-[220px]">
                    <span title={req.note || ""}>
                      {req.note ? req.note : "–"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                        req.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : req.status === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {req.status === "approved" && <Check size={16} />}
                      {req.status === "rejected" && <X size={16} />}
                      {req.status === "pending" && <Clock size={16} />}
                      {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {req.status === "pending" && (
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleApprove(req._id)}
                          className="btn btn-sm btn-success text-white"
                        >
                          <Check size={16} /> Approve
                        </button>
                        <button
                          onClick={() => handleReject(req._id)}
                          className="btn btn-sm btn-error text-white"
                        >
                          <X size={16} /> Reject
                        </button>
                      </div>
                    )}
                    {req.status !== "pending" && (
                      <span className="text-gray-400">–</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllRequests;

import { useEffect, useMemo, useState } from "react";
import useDatabaseUser from "../../../hooks/useDatabaseUser";
import axiosInstance from "../../../lib/axiosConfig";

const statusStyles = {
  pending: "badge-warning",
  approved: "badge-success",
  rejected: "badge-error",
};

const MyRequests = () => {
  const { dbUser, loading } = useDatabaseUser();
  const [requests, setRequests] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!dbUser?.email) return;

    const fetchRequests = async () => {
      try {
        setLoadingData(true);
        const res = await axiosInstance.get(
          `/requests?employeeEmail=${dbUser.email}`,
          { timeout: 5000 },
        );
        setRequests(res.data || []);
      } catch (error) {
        console.error("Error fetching requests:", error.message);
        setRequests([]);
      } finally {
        setLoadingData(false);
      }
    };

    fetchRequests();
  }, [dbUser]);

  const filteredRequests = useMemo(() => {
    return (requests || []).filter((request) => {
      const matchesStatus =
        statusFilter === "all" || request.status === statusFilter;
      const keyword = searchTerm.toLowerCase();
      const matchesSearch =
        request.assetName?.toLowerCase().includes(keyword) ||
        request.assetType?.toLowerCase().includes(keyword) ||
        request.companyName?.toLowerCase().includes(keyword);
      return matchesStatus && matchesSearch;
    });
  }, [requests, statusFilter, searchTerm]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-primary mb-2">My Requests</h2>
        <p className="text-gray-600">
          Track all asset requests and their approval status.
        </p>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Search by asset, type, or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input input-bordered w-full"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="select select-bordered w-full"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
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
        <div className="overflow-x-auto bg-white rounded-xl shadow">
          <table className="table">
            <thead>
              <tr>
                <th>Asset</th>
                <th>Type</th>
                <th>Company</th>
                <th>Requested</th>
                <th>Status</th>
                <th>Note</th>
                <th>Decision</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((request) => (
                <tr key={request._id}>
                  <td>{request.assetName}</td>
                  <td>{request.assetType}</td>
                  <td>{request.companyName}</td>
                  <td>
                    {request.requestDate
                      ? new Date(request.requestDate).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        statusStyles[request.status] || "badge-ghost"
                      }`}
                    >
                      {request.status}
                    </span>
                  </td>
                  <td className="max-w-55 whitespace-pre-line">
                    {request.note || "-"}
                  </td>
                  <td className="max-w-55 whitespace-pre-line">
                    {request.status === "rejected"
                      ? request.rejectionReason || "Rejected"
                      : request.status === "approved"
                        ? request.approvalDate
                          ? `Approved on ${new Date(request.approvalDate).toLocaleDateString()}`
                          : "Approved"
                        : "Pending"}
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

export default MyRequests;

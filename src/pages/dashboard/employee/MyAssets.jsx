import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { RotateCcw, Printer } from "lucide-react";
import Swal from "sweetalert2";
import useDatabaseUser from "../../../hooks/useDatabaseUser";

const MyAssets = () => {
  const { dbUser, loading } = useDatabaseUser();
  const [assets, setAssets] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  // 🔹 Fetch assigned assets
  const fetchAssets = useCallback(async () => {
    if (!dbUser?.email) return;
    try {
      setLoadingData(true);
      console.log("📦 Fetching assigned assets for:", dbUser.email);
      const res = await axios.get(
        `http://localhost:3000/assigned-assets?email=${dbUser.email}`,
        { timeout: 5000 },
      );
      console.log("✅ Assets loaded:", res.data);
      setAssets(res.data || []);
    } catch (error) {
      console.error("❌ Error fetching assets:", error.message);
      setAssets([]);
    } finally {
      setLoadingData(false);
    }
  }, [dbUser]);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  // 🔹 Filter assets
  const filteredAssets = assets.filter((asset) => {
    const matchesName = asset.productName
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType =
      typeFilter === "all" || asset.productType === typeFilter;
    return matchesName && matchesType;
  });

  const handlePrint = () => {
    window.print();
  };

  // 🔹 Return asset
  const handleReturn = async (assetId) => {
    try {
      const result = await Swal.fire({
        title: "Return Asset?",
        text: "Are you sure you want to return this asset?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#10b981",
        cancelButtonColor: "#ef4444",
        confirmButtonText: "Yes, Return it",
      });

      if (result.isConfirmed) {
        await axios.patch(
          `http://localhost:3000/assigned-assets/${assetId}/return`,
          { employeeEmail: dbUser.email },
        );

        fetchAssets();
        Swal.fire("Returned!", "Asset returned successfully.", "success");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to return asset", "error");
    }
  };

  return (
    <div className="p-6">
      <style>
        {`@media print {
          body * { visibility: hidden; }
          .print-area, .print-area * { visibility: visible; }
          .print-area { position: absolute; left: 0; top: 0; width: 100%; }
          .no-print { display: none !important; }
        }`}
      </style>

      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary">My Assets</h2>
          <p className="text-sm text-gray-500">
            {filteredAssets.length} asset(s) assigned
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="btn btn-outline btn-sm gap-2 no-print"
        >
          <Printer size={16} /> Print
        </button>
      </div>

      <div className="no-print grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          placeholder="Search assets..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input input-bordered w-full"
        />

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="select select-bordered w-full"
        >
          <option value="all">All Types</option>
          <option value="Returnable">Returnable</option>
          <option value="Non-returnable">Non-returnable</option>
        </select>
      </div>

      {loadingData ? (
        <div className="flex justify-center items-center h-[50vh]">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : filteredAssets.length === 0 ? (
        <div className="text-center py-12 bg-base-100 rounded-lg">
          <p className="text-gray-500 text-lg">No assets assigned yet</p>
        </div>
      ) : (
        <div className="print-area overflow-x-auto bg-white rounded-xl shadow">
          <table className="table">
            <thead>
              <tr>
                <th>Asset</th>
                <th>Type</th>
                <th>Company</th>
                <th>Request Date</th>
                <th>Approval Date</th>
                <th>Status</th>
                <th className="no-print">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssets.map((asset) => (
                <tr key={asset._id}>
                  <td>
                    <div className="flex items-center gap-3">
                      {asset.productImage && (
                        <img
                          src={asset.productImage}
                          alt={asset.productName}
                          className="w-10 h-10 rounded object-cover"
                        />
                      )}
                      <span className="font-medium">{asset.productName}</span>
                    </div>
                  </td>
                  <td>{asset.productType}</td>
                  <td>{asset.companyName || "N/A"}</td>
                  <td className="text-sm">
                    {asset.requestDate
                      ? new Date(asset.requestDate).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="text-sm">
                    {asset.approvalDate
                      ? new Date(asset.approvalDate).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        asset.status === "assigned"
                          ? "badge-primary"
                          : "badge-warning"
                      }`}
                    >
                      {asset.status || "assigned"}
                    </span>
                  </td>
                  <td className="no-print">
                    {asset.productType === "Returnable" &&
                      asset.status === "assigned" && (
                        <button
                          onClick={() => handleReturn(asset._id)}
                          className="btn btn-xs btn-outline"
                        >
                          <RotateCcw size={14} /> Return
                        </button>
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

export default MyAssets;

import { useCallback, useEffect, useState } from "react";
import axiosInstance from "../../../lib/axiosConfig";
import Swal from "sweetalert2";
import useDatabaseUser from "../../../hooks/useDatabaseUser";

const RequestAsset = () => {
  const { dbUser, loading } = useDatabaseUser();
  const [assets, setAssets] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState("");
  const [requesting, setRequesting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [requestNote, setRequestNote] = useState("");

  // 🔹 Fetch available assets
  const fetchAssets = useCallback(async () => {
    if (!dbUser?.email) return;
    try {
      setLoadingData(true);
      console.log("🔍 Fetching available assets for user:", dbUser.email);

      const res = await axiosInstance.get(`/available-assets`, {
        timeout: 5000,
      });
      console.log("✅ Available assets:", res.data);
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
  const filteredAssets = assets.filter((asset) =>
    asset.productName?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // 🔹 Request asset
  const handleRequest = async (assetId) => {
    if (!assetId) {
      Swal.fire("Error", "Please select an asset", "error");
      return;
    }

    try {
      setRequesting(true);
      const asset = assets.find((a) => a._id === assetId);

      const requestData = {
        assetId: asset._id,
        assetName: asset.productName,
        assetImage: asset.productImage,
        assetType: asset.productType,
        employeeEmail: dbUser.email,
        employeeName: dbUser.name,
        hrEmail: asset.hrEmail,
        companyName: asset.companyName,
        requestDate: new Date(),
        status: "pending",
        note: requestNote,
      };

      await axiosInstance.post("/requests", requestData);

      Swal.fire({
        icon: "success",
        title: "Request Sent",
        text: "Your request has been sent to HR",
      });

      setSelectedAsset("");
      setRequestNote("");
    } catch (error) {
      console.error(error);
      const apiMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to send request";
      Swal.fire("Error", apiMessage, "error");
    } finally {
      setRequesting(false);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-primary mb-6">Request Asset</h2>
        <p className="text-gray-600 mb-6">
          Browse and request assets from your company's inventory
        </p>

        {/* Search */}
        <input
          type="text"
          placeholder="Search assets..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input input-bordered w-full max-w-md"
        />
      </div>

      {loadingData ? (
        <div className="flex justify-center items-center h-[50vh]">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : filteredAssets.length === 0 ? (
        <div className="text-center py-12 bg-base-100 rounded-lg">
          <p className="text-gray-500 text-lg">No assets available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssets.map((asset) => (
            <div
              key={asset._id}
              className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all hover:shadow-xl border-2 ${
                selectedAsset === asset._id
                  ? "border-primary"
                  : "border-transparent"
              }`}
              onClick={() => setSelectedAsset(asset._id)}
            >
              {/* Image */}
              {asset.productImage && (
                <img
                  src={asset.productImage}
                  alt={asset.productName}
                  className="w-full h-48 object-cover bg-gray-200"
                />
              )}

              {/* Content */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-primary mb-2">
                  {asset.productName}
                </h3>

                <div className="space-y-3 mb-5">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Type:</span>
                    <span className="font-medium">{asset.productType}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Available:</span>
                    <span className="font-bold text-lg">
                      {asset.availableQuantity}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total:</span>
                    <span className="text-sm">{asset.productQuantity}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Status:</span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        asset.availableQuantity > 0
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {asset.availableQuantity > 0
                        ? "Available"
                        : "Out of Stock"}
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => {
                    if (asset.availableQuantity === 0) return;
                    setSelectedAsset(asset._id);
                    document.getElementById("requestModal").showModal();
                  }}
                  disabled={asset.availableQuantity === 0}
                  className={`w-full btn btn-sm gap-2 ${
                    asset.availableQuantity === 0
                      ? "btn-disabled"
                      : "btn-primary"
                  }`}
                >
                  {asset.availableQuantity === 0 ? "Out of Stock" : "Request"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Request Modal */}
      <dialog id="requestModal" className="modal modal-middle z-40">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Request Note</h3>
          <textarea
            className="textarea textarea-bordered w-full min-h-[120px]"
            placeholder="Add a note for HR (optional)"
            value={requestNote}
            onChange={(e) => setRequestNote(e.target.value)}
          ></textarea>

          <div className="modal-action">
            <button
              className="btn"
              onClick={() => document.getElementById("requestModal").close()}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={() => {
                const targetId = selectedAsset;
                document.getElementById("requestModal").close();
                handleRequest(targetId);
              }}
              disabled={!selectedAsset || requesting}
            >
              {requesting ? "Requesting..." : "Submit Request"}
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default RequestAsset;

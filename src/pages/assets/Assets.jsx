import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useDatabaseUser from "../../hooks/useDatabaseUser";
import axiosInstance from "../../lib/axiosConfig";
import Swal from "sweetalert2";

const Assets = () => {
  const { user } = useAuth();
  const { dbUser, loading } = useDatabaseUser();
  const [assets, setAssets] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [requestNote, setRequestNote] = useState("");

  useEffect(() => {
    if (!user || loading) return;

    const fetchAssets = async () => {
      setFetching(true);
      try {
        const res = await axiosInstance.get("/available-assets");
        setAssets(res.data || []);
      } catch (error) {
        console.error("Error fetching assets:", error.message);
        setAssets([]);
      } finally {
        setFetching(false);
      }
    };

    fetchAssets();
  }, [user, loading]);

  const isEmployee = dbUser?.role === "employee";

  const handleRequest = async () => {
    if (!selectedAsset || !dbUser?.email) return;
    try {
      const requestData = {
        assetId: selectedAsset._id,
        assetName: selectedAsset.productName,
        assetImage: selectedAsset.productImage,
        assetType: selectedAsset.productType,
        employeeEmail: dbUser.email,
        employeeName: dbUser.name,
        hrEmail: selectedAsset.hrEmail,
        companyName: selectedAsset.companyName,
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

      setSelectedAsset(null);
      setRequestNote("");
    } catch (error) {
      console.error("Request error:", error.message);
      Swal.fire("Error", "Failed to send request", "error");
    }
  };

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold">All Assets</h2>
          <p className="mt-3 text-gray-500">
            Browse currently available assets across all companies.
          </p>
        </div>

        {!user ? (
          <div className="bg-white rounded-2xl shadow p-8 text-center">
            <p className="text-gray-600">
              Please log in to view available assets.
            </p>
            <div className="mt-6 flex justify-center gap-4 flex-wrap">
              <Link
                to="/login"
                className="px-6 py-3 rounded-xl bg-primary text-white font-semibold"
              >
                Login
              </Link>
              <Link
                to="/register?role=employee"
                className="px-6 py-3 rounded-xl border font-semibold"
              >
                Join as Employee
              </Link>
            </div>
          </div>
        ) : fetching || loading ? (
          <div className="flex justify-center">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : assets.length === 0 ? (
          <p className="text-center text-gray-500">No assets available.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {assets.map((asset) => (
              <div
                key={asset._id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden"
              >
                <div className="h-44 bg-base-200">
                  {asset.productImage ? (
                    <img
                      src={asset.productImage}
                      alt={asset.productName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-400">
                      No image
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold">{asset.productName}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Company: {asset.companyName || "N/A"}
                  </p>
                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-base-100 rounded-lg p-3">
                      <p className="text-gray-500">Available</p>
                      <p className="font-semibold">{asset.availableQuantity}</p>
                    </div>
                    <div className="bg-base-100 rounded-lg p-3">
                      <p className="text-gray-500">Total</p>
                      <p className="font-semibold">{asset.productQuantity}</p>
                    </div>
                  </div>

                  {isEmployee && (
                    <button
                      className="btn btn-primary btn-sm w-full mt-5"
                      onClick={() => {
                        if (asset.availableQuantity <= 0) return;
                        setSelectedAsset(asset);
                        document
                          .getElementById("assetRequestModal")
                          .showModal();
                      }}
                      disabled={asset.availableQuantity <= 0}
                    >
                      {asset.availableQuantity <= 0
                        ? "Out of Stock"
                        : "Request"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isEmployee && (
        <dialog id="assetRequestModal" className="modal modal-middle z-40">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">
              Request Note for {selectedAsset?.productName || "Asset"}
            </h3>
            <textarea
              className="textarea textarea-bordered w-full min-h-[120px]"
              placeholder="Add a note for HR (optional)"
              value={requestNote}
              onChange={(e) => setRequestNote(e.target.value)}
            ></textarea>
            <div className="modal-action">
              <button
                className="btn"
                onClick={() =>
                  document.getElementById("assetRequestModal").close()
                }
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  document.getElementById("assetRequestModal").close();
                  handleRequest();
                }}
                disabled={!selectedAsset}
              >
                Submit Request
              </button>
            </div>
          </div>
        </dialog>
      )}
    </section>
  );
};

export default Assets;

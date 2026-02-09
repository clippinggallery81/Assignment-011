import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Trash2, UserPlus } from "lucide-react";
import Swal from "sweetalert2";
import useDatabaseUser from "../../../hooks/useDatabaseUser";
import AssignAssetModal from "../../../components/modals/AssignAssetModal";

const AssetList = () => {
  const { dbUser, loading } = useDatabaseUser();

  const [assets, setAssets] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [assetToAssign, setAssetToAssign] = useState(null);

  const [name, setName] = useState("");
  const [type, setType] = useState("Returnable");
  const [quantity, setQuantity] = useState("");
  const totalPages = Math.max(Math.ceil(total / limit), 1);

  // 🔹 Load assets by HR email
  const fetchAssets = useCallback(async () => {
    if (!dbUser?.email) return;
    try {
      setLoadingData(true);
      const res = await axios.get(
        `http://localhost:3000/assets?email=${dbUser.email}&page=${page}&limit=${limit}`,
      );

      if (Array.isArray(res.data)) {
        setAssets(res.data);
        setTotal(res.data.length);
      } else {
        setAssets(res.data.data || []);
        setTotal(res.data.total || 0);
      }
    } catch (error) {
      console.error("Error fetching assets:", error);
      setAssets([]);
      setTotal(0);
    } finally {
      setLoadingData(false);
    }
  }, [dbUser, page, limit]);

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

  // 🔹 Open edit modal
  const openEditModal = (asset) => {
    setSelectedAsset(asset);
    setName(asset.productName);
    setType(asset.productType);
    setQuantity(asset.productQuantity);
    document.getElementById("editModal").showModal();
  };

  // 🔹 Update asset
  const handleUpdate = async () => {
    if (!name || !quantity) {
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "Please fill all fields",
        confirmButtonColor: "#0EA5E9",
        customClass: { container: "z-50" },
      });
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:3000/assets/${selectedAsset._id}`,
        {
          productName: name,
          productType: type,
          productQuantity: Number(quantity),
        },
      );

      console.log("Update response:", response.data);

      // Close modal first
      const modal = document.getElementById("editModal");
      if (modal) modal.close();

      // Fetch updated assets
      await new Promise((resolve) => setTimeout(resolve, 300));
      await fetchAssets();

      // Show success message
      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Asset updated successfully",
        confirmButtonColor: "#0EA5E9",
        customClass: { container: "z-50" },
      });

      // Reset form
      setName("");
      setType("Returnable");
      setQuantity("");
      setSelectedAsset(null);
    } catch (error) {
      console.error("Update error:", error.response?.data || error.message);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to update asset",
        confirmButtonColor: "#0EA5E9",
        customClass: { container: "z-50" },
      });
    }
  };

  // 🔹 Delete asset
  const handleDelete = (id) => {
    Swal.fire({
      title: "Delete Asset?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#EF4444",
      customClass: { container: "z-50" },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:3000/assets/${id}`);
          await fetchAssets();

          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "Asset removed successfully",
            confirmButtonColor: "#0EA5E9",
            customClass: { container: "z-50" },
          });
        } catch (error) {
          console.error("Delete error:", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to delete asset",
            confirmButtonColor: "#0EA5E9",
            customClass: { container: "z-50" },
          });
        }
      }
    });
  };

  // 🔹 Open assign modal
  const openAssignModal = (asset) => {
    setAssetToAssign(asset);
    // Use a small timeout to ensure the DOM has updated
    setTimeout(() => {
      const modal = document.getElementById("assignModal");
      if (modal) modal.showModal();
    }, 0);
  };

  return (
    <div className="bg-white rounded-2xl shadow p-6 mt-8 md:mt-0">
      <h2 className="text-xl font-bold mb-4">Asset List</h2>

      {loadingData ? (
        <div className="flex justify-center items-center h-[40vh]">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Type</th>
                <th>Quantity</th>
                <th>Available</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((asset) => (
                <tr key={asset._id}>
                  <td>
                    <img
                      src={asset.productImage}
                      className="w-12 h-12 rounded object-cover"
                    />
                  </td>
                  <td>{asset.productName}</td>
                  <td>{asset.productType}</td>
                  <td>{asset.productQuantity}</td>
                  <td>{asset.availableQuantity}</td>
                  <td className="flex gap-2">
                    <button
                      className="btn btn-sm btn-outline"
                      onClick={() => openEditModal(asset)}
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      className="btn btn-sm btn-outline btn-info"
                      onClick={() => openAssignModal(asset)}
                      disabled={asset.availableQuantity <= 0}
                    >
                      <UserPlus size={16} />
                    </button>
                    <button
                      className="btn btn-sm btn-outline btn-error"
                      onClick={() => handleDelete(asset._id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-gray-500">
          Page {page} of {totalPages}
        </p>
        <div className="join">
          <button
            className="btn btn-sm join-item"
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
          >
            Previous
          </button>
          <button
            className="btn btn-sm join-item"
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      </div>

      {/* 🔹 EDIT MODAL */}
      <dialog id="editModal" className="modal modal-middle z-40">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Edit Asset</h3>

          <input
            className="input input-bordered w-full mb-3"
            placeholder="Asset Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <select
            className="select select-bordered w-full mb-3"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="Returnable">Returnable</option>
            <option value="Non-returnable">Non-returnable</option>
          </select>

          <input
            type="number"
            className="input input-bordered w-full mb-4"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />

          <div className="modal-action">
            <button
              className="btn"
              onClick={() => document.getElementById("editModal").close()}
            >
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleUpdate}>
              Save Changes
            </button>
          </div>
        </div>
      </dialog>

      {/* 🔹 ASSIGN MODAL */}
      <AssignAssetModal
        asset={assetToAssign}
        hrEmail={dbUser?.email}
        companyName={dbUser?.companyName}
        onAssignSuccess={() => {
          fetchAssets();
          setAssetToAssign(null);
        }}
      />
    </div>
  );
};

export default AssetList;

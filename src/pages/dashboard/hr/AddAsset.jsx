import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import useDatabaseUser from "../../../hooks/useDatabaseUser";
import axiosInstance from "../../../lib/axiosConfig";

const imageUploadClient = axios.create({
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

delete imageUploadClient.defaults.headers.common.Authorization;

const AddAsset = () => {
  const { dbUser, loading } = useDatabaseUser();

  const [productName, setProductName] = useState("");
  const [productType, setProductType] = useState("Returnable");
  const [productQuantity, setProductQuantity] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploading, setUploading] = useState(false);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  // 🔴 Security: only HR can access
  if (dbUser?.role !== "hr") {
    return (
      <p className="text-center text-red-500 font-semibold">
        Access Denied (HR only)
      </p>
    );
  }

  // Image preview
  const handleImageChange = (file) => {
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleAddAsset = async (e) => {
    e.preventDefault();

    if (!imageFile) {
      Swal.fire("Error", "Please upload an image", "error");
      return;
    }

    setUploading(true);

    try {
      // 🔹 Upload image to ImgBB
      const formData = new FormData();
      formData.append("image", imageFile);

      const imageHostKey = import.meta.env.VITE_image_host_key;
      if (!imageHostKey) {
        Swal.fire("Error", "Image upload key is missing", "error");
        return;
      }

      const imgRes = await imageUploadClient.post(
        `https://api.imgbb.com/1/upload?key=${imageHostKey}`,
        formData,
      );

      const imageUrl = imgRes.data.data.display_url;

      // 🔹 Asset object
      const assetData = {
        productName,
        productImage: imageUrl,
        productType,
        productQuantity: Number(productQuantity),
        hrEmail: dbUser.email, // ✅ MUST
        companyName: dbUser.companyName, // ✅ MUST
      };

      // 🔹 Save to backend
      await axiosInstance.post("/assets", assetData);

      Swal.fire({
        icon: "success",
        title: "Asset Added",
        text: "Asset successfully added to inventory",
      });

      // Reset form
      setProductName("");
      setProductQuantity("");
      setProductType("Returnable");
      setImageFile(null);
      setImagePreview("");
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to add asset", "error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-primary mb-6">Add New Asset</h2>

        <form onSubmit={handleAddAsset} className="space-y-5">
          {/* Product Name */}
          <div>
            <label className="label">Asset Name</label>
            <input
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              required
              className="input input-bordered w-full"
              placeholder="Laptop / Chair / Monitor"
            />
          </div>

          {/* Product Type */}
          <div>
            <label className="label">Asset Type</label>
            <select
              value={productType}
              onChange={(e) => setProductType(e.target.value)}
              className="select select-bordered w-full"
            >
              <option value="Returnable">Returnable</option>
              <option value="Non-returnable">Non-returnable</option>
            </select>
          </div>

          {/* Quantity */}
          <div>
            <label className="label">Quantity</label>
            <input
              type="number"
              min="1"
              value={productQuantity}
              onChange={(e) => setProductQuantity(e.target.value)}
              required
              className="input input-bordered w-full"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="label">Asset Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e.target.files[0])}
              className="file-input file-input-bordered w-full"
            />

            {imagePreview && (
              <img
                src={imagePreview}
                alt="preview"
                className="mt-4 w-32 h-32 object-cover rounded-xl border"
              />
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={uploading}
            className="w-full py-3 rounded-xl bg-primary text-white font-semibold hover:scale-[1.02] transition disabled:opacity-50"
          >
            {uploading ? "Adding Asset..." : "Add Asset"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddAsset;

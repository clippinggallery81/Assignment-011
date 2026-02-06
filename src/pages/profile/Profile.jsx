import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { User, Camera } from "lucide-react";
import axios from "axios";
import Swal from "sweetalert2";

const Profile = () => {
  const { user } = useAuth();

  const [dbUser, setDbUser] = useState(null);
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [photoURL, setPhotoURL] = useState("");
  const [imageUploadLoading, setImageUploadLoading] = useState(false);
  const [profileUpdateLoading, setProfileUpdateLoading] = useState(false);

  // Load user
  useEffect(() => {
    if (user?.email) {
      axios
        .get(`http://localhost:3000/user?email=${user.email}`)
        .then((res) => {
          setDbUser(res.data);
          setName(res.data?.name || "");
          setDob(res.data?.dob || "");
          setCompanyName(res.data?.companyName || "");
          setPhotoURL(res.data?.photoURL || "");
        });
    }
  }, [user]);

  if (!dbUser) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  // Upload image to imgbb
  const handleImageUpload = async (file) => {
    if (!file) return;

    setImageUploadLoading(true);
    setNewImage(file);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const imgRes = await axios.post(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host_key}`,
        formData,
      );

      setPhotoURL(imgRes.data.data.display_url);
      setImageUploadLoading(false);

      // Swal.fire({
      //   icon: "success",
      //   title: "Success!",
      //   text: "Profile picture uploaded successfully",
      //   confirmButtonColor: "#0EA5E9",
      //   timer: 2000,
      // });
    } catch (error) {
      setImageUploadLoading(false);
      setNewImage(null);
      console.error("Error uploading image:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to upload image",
        confirmButtonColor: "#0EA5E9",
      });
    }
  };

  // Save profile to database
  const handleSave = async () => {
    setProfileUpdateLoading(true);

    try {
      await axios.put(`http://localhost:3000/users/${dbUser.email}`, {
        name,
        dob,
        companyName,
        photoURL,
      });

      setDbUser({ ...dbUser, name, dob, companyName, photoURL });
      setNewImage(null);
      setProfileUpdateLoading(false);

      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Profile updated successfully",
        confirmButtonColor: "#0EA5E9",
      });
    } catch (error) {
      setProfileUpdateLoading(false);
      console.error("Error updating profile:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update profile",
        confirmButtonColor: "#0EA5E9",
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-primary">My Profile</h2>

        {/* Avatar */}
        <div className="flex items-center gap-6 mb-8">
          <div className="relative">
            {photoURL ? (
              <img
                src={photoURL}
                className="w-24 h-24 rounded-full object-cover border-2 border-primary"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                <User size={36} className="text-primary" />
              </div>
            )}

            <label
              className={`absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer ${imageUploadLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {imageUploadLoading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                <Camera size={16} />
              )}
              <input
                type="file"
                hidden
                onChange={(e) => handleImageUpload(e.target.files[0])}
                disabled={imageUploadLoading}
              />
            </label>
          </div>

          <div>
            <h3 className="font-semibold">{name || dbUser.name}</h3>
            <p className="text-sm text-gray-500">{dbUser.email}</p>
            {imageUploadLoading && (
              <p className="text-xs text-primary font-semibold mt-1">
                Uploading image...
              </p>
            )}
            {newImage && !imageUploadLoading && (
              <p className="text-xs text-green-600 font-semibold mt-1">
                ✓ Image uploaded
              </p>
            )}
          </div>
        </div>

        {/* Form */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="label">Full Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={profileUpdateLoading}
              className="input input-bordered w-full disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label className="label">Date of Birth</label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              disabled={profileUpdateLoading}
              className="input input-bordered w-full disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label className="label">Email</label>
            <input
              value={dbUser.email}
              readOnly
              className="input input-bordered w-full bg-gray-100"
            />
          </div>

          <div>
            <label className="label">Role</label>
            <input
              value={dbUser.role}
              readOnly
              className="input input-bordered w-full bg-gray-100 capitalize"
            />
          </div>

          {dbUser.role === "hr" && (
            <div>
              <label className="label">Company Name</label>
              <input
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                disabled={profileUpdateLoading}
                className="input input-bordered w-full disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          )}
        </div>

        <button
          onClick={handleSave}
          disabled={profileUpdateLoading || imageUploadLoading}
          className="mt-8 px-8 py-3 rounded-xl bg-primary text-white font-semibold hover:scale-[1.03] transition disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 flex items-center gap-2"
        >
          {profileUpdateLoading ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </button>
      </div>
    </div>
  );
};

export default Profile;

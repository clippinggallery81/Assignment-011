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
          // If user is HR, prefer companyLogo; otherwise prefer photoURL
          setPhotoURL(res.data?.photoURL || res.data?.companyLogo || "");
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

      // Replace the old image with the new one
      const newImageUrl = imgRes.data.data.display_url;
      setPhotoURL(newImageUrl);
      setImageUploadLoading(false);
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
      const updateData = {
        name,
        dob,
        companyName,
      };

      // Only update image field if a new image was uploaded
      if (newImage || photoURL) {
        if (dbUser.role === "hr") {
          // For HR, store image in companyLogo (replace existing)
          updateData.companyLogo = photoURL;
        } else {
          // For employees, store in photoURL
          updateData.photoURL = photoURL;
        }
      }

      await axios.put(
        `http://localhost:3000/users/${dbUser.email}`,
        updateData,
      );

      // Update local state accordingly (keep single image field)
      const updatedUser = { ...dbUser, name, dob, companyName };
      if (dbUser.role === "hr") {
        updatedUser.companyLogo = photoURL || dbUser.companyLogo;
      } else {
        updatedUser.photoURL = photoURL || dbUser.photoURL;
      }

      setDbUser(updatedUser);
      setNewImage(null);
      setProfileUpdateLoading(false);

      // Notify other parts of the app (e.g., Navbar) to refetch DB user
      try {
        window.dispatchEvent(new Event("dbUserUpdated"));
      } catch (error) {
        console.error("Error dispatching dbUserUpdated event:", error);
      }

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

  // determine which image to show: HR -> companyLogo, Employee -> photoURL
  const displayedImage =
    dbUser?.role === "hr"
      ? photoURL || dbUser?.companyLogo
      : photoURL || dbUser?.photoURL;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-primary">My Profile</h2>

        {/* Avatar */}
        <div className="flex items-center gap-6 mb-8">
          <div className="relative">
            {displayedImage ? (
              <img
                src={displayedImage}
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

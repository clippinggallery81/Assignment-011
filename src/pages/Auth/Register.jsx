import { useState } from "react";
import { useForm } from "react-hook-form";
import joinUs from "../../assets/join-us.jpg";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";

const imageUploadClient = axios.create({
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

delete imageUploadClient.defaults.headers.common.Authorization;

const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultRole = searchParams.get("role") || "employee";

  const [role, setRole] = useState(defaultRole);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setRole(defaultRole);
  }, [defaultRole]);

  const { registerUser, updateUserProfile } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleRegistration = async (data) => {
    setLoading(true);
    setError("");
    try {
      sessionStorage.setItem("skipSyncUser", "1");
      // Step 1: Register user with Firebase
      const userCredential = await registerUser(data.email, data.password);
      const user = userCredential.user;
      console.log("User registered successfully:", user);

      let imageUrl = "";

      // Step 2: Upload image for both HR Manager and Employee
      if (data.profilePicture && data.profilePicture[0]) {
        const imageFile = data.profilePicture[0];
        const formData = new FormData();
        formData.append("image", imageFile);
        const image_API_URL = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host_key}`;

        const imageResponse = await imageUploadClient.post(
          image_API_URL,
          formData,
        );
        imageUrl = imageResponse.data.data.display_url;
        const uploadType = role === "hr" ? "Company logo" : "Profile picture";
        console.log(`${uploadType} uploaded successfully:`, imageUrl);
      }

      // Step 3: Update user profile
      const userProfile = {
        displayName: data.name,
      };

      if (imageUrl) {
        userProfile.photoURL = imageUrl;
      }

      await updateUserProfile(userProfile);

      // Step 4: Save user to MongoDB with role-specific fields
      const mongoData = {
        name: data.name,
        email: data.email,
        dob: data.dob,
        role: role,
      };

      // Add HR-specific fields
      if (role === "hr") {
        mongoData.companyName = data.companyName;
        mongoData.companyLogo = imageUrl || null;
        mongoData.packageLimit = 5;
        mongoData.currentEmployees = 0;
        mongoData.subscription = "basic";
      } else {
        mongoData.photoURL = imageUrl || null;
      }

      const response = await axios.post(
        "http://localhost:3000/users",
        mongoData,
      );
      console.log("User saved in DB:", response.data);

      navigate("/");
    } catch (err) {
      console.error("Error during registration:", err);
      sessionStorage.removeItem("skipSyncUser");
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // const handleGoogleSignIn = () => {
  //   signInWithGoogle()
  //     .then((result) => {
  //       const user = result.user;
  //       console.log("Google sign-in successful:", user);

  //       axios
  //         .post("http://localhost:3000/users", {
  //           name: user.displayName,
  //           email: user.email,
  //           role: "employee",
  //           photoURL: user.photoURL,
  //         })
  //         .then(() => navigate("/"));
  //     })
  //     .catch((error) => {
  //       console.error("Error with Google sign-in:", error);
  //     });
  // };

  return (
    <div className="flex items-center justify-center mt-10 px-2 md:px-0">
      <div className="grid md:grid-cols-2 gap-10 max-w-7xl w-full items-stretch">
        <div className="hidden md:flex bg-white rounded-2xl shadow-xl">
          <img
            src={joinUs}
            alt="join"
            className="w-full h-full object-contain rounded-2xl"
          />
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-primary text-center">
            Register
          </h2>

          <div className="mb-4 focus:outline-none">
            <label className="label">Register As</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="select select-bordered w-full"
            >
              <option value="employee">Employee</option>
              <option value="hr">HR Manager</option>
            </select>
          </div>

          <form
            onSubmit={handleSubmit(handleRegistration)}
            className="space-y-4"
          >
            {role === "hr" && (
              <div>
                <label className="label">Company Name</label>
                <input
                  {...register("companyName", {
                    required: "Company name is required",
                  })}
                  placeholder="Enter company name"
                  className="input input-bordered w-full focus:outline-none"
                />
                {errors.companyName && (
                  <p className="text-red-500 text-sm">
                    {errors.companyName.message}
                  </p>
                )}
              </div>
            )}

            <div>
              <label className="label">Full Name</label>
              <input
                {...register("name", { required: "Full name is required" })}
                placeholder="Enter your name"
                className="input input-bordered w-full focus:outline-none"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            {role === "hr" ? (
              <div>
                <label className="label">Company Logo</label>
                <input
                  type="file"
                  {...register("profilePicture", {
                    required: "Company logo is required",
                  })}
                  className="file-input file-input-bordered w-full focus:outline-none"
                />
                {errors.profilePicture && (
                  <p className="text-red-500 text-sm">
                    {errors.profilePicture.message}
                  </p>
                )}
              </div>
            ) : (
              <div>
                <label className="label">Profile Picture</label>
                <input
                  type="file"
                  {...register("profilePicture", {
                    required: "Profile picture is required",
                  })}
                  className="file-input file-input-bordered w-full focus:outline-none"
                />
                {errors.profilePicture && (
                  <p className="text-red-500 text-sm">
                    {errors.profilePicture.message}
                  </p>
                )}
              </div>
            )}

            <div>
              <label className="label">Email</label>
              <input
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Please enter a valid email",
                  },
                })}
                placeholder="Enter email"
                className="input input-bordered w-full focus:outline-none"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="label">Password</label>

              <div className="relative flex items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                    pattern: {
                      value:
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/,
                      message:
                        "Must include uppercase, lowercase, number & special character",
                    },
                  })}
                  placeholder="Password should be at least 6 characters"
                  className="input input-bordered w-full pr-12 focus:outline-none"
                />

                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 flex items-center cursor-pointer text-gray-500"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </span>
              </div>

              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label className="label">Date of Birth</label>
              <input
                type="date"
                {...register("dob", { required: "Date of birth is required" })}
                className="input input-bordered w-full focus:outline-none"
              />
              {errors.dob && (
                <p className="text-red-500 text-sm">{errors.dob.message}</p>
              )}
            </div>

            {error && (
              <div className="alert alert-error">
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-white font-semibold
              bg-primary hover:scale-[1.02] transition-all duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Registering..." : "Register"}
            </button>

            <div className="divider">or</div>

            {/* <button
              onClick={handleGoogleSignIn}
              type="button"
              className="w-full py-2 rounded-xl border flex items-center justify-center gap-3 hover:bg-base-200 transition"
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/281/281764.png"
                className="w-5"
                alt="google"
              />
              Sign in with Google
            </button> */}

            <p className="text-sm text-base-content/50 text-center mt-6">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;

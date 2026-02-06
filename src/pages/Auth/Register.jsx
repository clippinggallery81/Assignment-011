import { useState } from "react";
import { useForm } from "react-hook-form";
import joinUs from "../../assets/join-us.jpg";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";

const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultRole = searchParams.get("role") || "employee";

  const [role, setRole] = useState(defaultRole);

  useEffect(() => {
    setRole(defaultRole);
  }, [defaultRole]);

  const [showPassword, setShowPassword] = useState(false);

  const { registerUser, signInWithGoogle, updateUserProfile } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleRegistration = (data) => {
    const registrationData = { role, ...data };
    console.log("Registration data:", registrationData);
    const profilePicture = registrationData.profilePicture[0];

    registerUser(registrationData.email, registrationData.password)
      .then((userCredential) => {
        const user = userCredential.user;
        const formData = new FormData();
        formData.append("image", profilePicture);
        const image_API_URL = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host_key}`;

        axios.post(image_API_URL, formData).then(
          (response) => {
            const imageUrl = response.data.data.display_url;
            console.log("Image uploaded successfully:", imageUrl);

            const userProfile = {
              displayName: registrationData.name,
              photoURL: imageUrl,
            };

            updateUserProfile(userProfile)
              .then(() => {
                console.log("User profile updated successfully");
                navigate("/");
              })
              .catch((error) => {
                console.error("Error updating user profile:", error);
              });
          },
          (error) => {
            console.error("Error uploading image:", error);
          },
        );

        console.log("User registered successfully:", user);
        navigate("/");
      })
      .catch((error) => {
        console.error("Error registering user:", error);
      });
  };

  const handleGoogleSignIn = () => {
    signInWithGoogle()
      .then((result) => {
        const user = result.user;
        console.log("Google sign-in successful:", user);
        navigate("/");
      })
      .catch((error) => {
        console.error("Error with Google sign-in:", error);
      });
  };

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
                  {...register("companyName", { required: true })}
                  placeholder="Enter company name"
                  className="input input-bordered w-full focus:outline-none"
                />
                {errors.companyName?.type === "required" && (
                  <p className="text-red-500 text-sm">
                    Company name is required.
                  </p>
                )}
              </div>
            )}

            <div>
              <label className="label">Full Name</label>
              <input
                {...register("name", { required: true })}
                placeholder="Enter your name"
                className="input input-bordered w-full focus:outline-none"
                required
              />
              {errors.name?.type === "required" && (
                <p className="text-red-500 text-sm">Full name is required.</p>
              )}
            </div>

            <div>
              <label className="label">
                {role === "hr" ? "Company Logo" : "Profile Picture"}
              </label>
              <input
                type="file"
                {...register("profilePicture", { required: true })}
                className="file-input file-input-bordered w-full focus:outline-none"
              />
              {errors.profilePicture?.type === "required" && (
                <p className="text-red-500 text-sm">
                  Profile picture is required.
                </p>
              )}
            </div>

            <div>
              <label className="label">Email</label>
              <input
                type="email"
                {...register("email", { required: true })}
                placeholder="Enter email"
                className="input input-bordered w-full focus:outline-none"
              />
              {errors.email?.type === "required" && (
                <p className="text-red-500 text-sm">Email is required.</p>
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
                {...register("dob", { required: true })}
                className="input input-bordered w-full focus:outline-none"
              />
              {errors.dob?.type === "required" && (
                <p className="text-red-500 text-sm">
                  Date of birth is required.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl text-white font-semibold
              bg-primary hover:scale-[1.02] transition-all duration-300 shadow-md"
            >
              Register
            </button>

            <div className="divider">or</div>

            <button
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
            </button>

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

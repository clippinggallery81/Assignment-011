import { useState } from "react";
import signInImg from "../../assets/signin-img.png";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const { loginUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleLogin = (data) => {
    console.log("Login data:", data);
    loginUser(data.email, data.password)
      .then((userCredential) => {
        const user = userCredential.user;
        const from = location?.state?.from?.pathname || "/";
        navigate(from);
        console.log("User logged in successfully:", user);
      })
      .catch((error) => {
        console.error("Error logging in user:", error);
      });
  };

  // const handleGoogleSignIn = () => {
  //   signInWithGoogle()
  //     .then((result) => {
  //       const user = result.user;
  //       navigate("/");
  //       console.log("Google sign-in successful:", user);
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
            src={signInImg}
            alt="login"
            className="w-full h-full object-contain rounded-2xl"
          />
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-primary text-center">
            Welcome Back
          </h2>

          <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
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
                  placeholder="Password"
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

            <button
              type="submit"
              className="w-full py-3 rounded-xl text-white font-semibold
              bg-primary hover:scale-[1.02] transition-all duration-300 shadow-md"
            >
              Login
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
              Continue with Google
            </button> */}

            <p className="text-sm text-base-content/50 text-center mt-6">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary hover:underline">
                Register
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

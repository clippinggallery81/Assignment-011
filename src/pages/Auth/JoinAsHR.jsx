import React from "react";
import joinUs from "../../assets/join-us.jpg";
import { Link } from "react-router";
import { useForm } from "react-hook-form";

const JoinAsHR = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleHrRegistration = (data) => {
    console.log("Registration data:", data);
  };
  return (
    <div className="min-h-screen flex items-center justify-center mt-10">
      <div className="grid md:grid-cols-2 gap-10 max-w-7xl w-full items-stretch">
        <div className="hidden md:flex bg-white rounded-2xl shadow-xl">
          <img
            src={joinUs}
            alt="register"
            className="w-full h-full rounded-2xl object-contain"
          />
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-primary text-center">
            Join as HR
          </h2>

          <form
            onSubmit={handleSubmit(handleHrRegistration)}
            className="space-y-4"
          >
            <div>
              <label className="label">Company Name</label>
              <input
                type="text"
                {...register("companyName", {
                  required: true,
                })}
                placeholder="Enter company name"
                className="input input-bordered w-full focus:outline-none "
              />
              {errors.companyName?.type === "required" && (
                <p className="text-red-500 text-sm">
                  Company name is required.
                </p>
              )}
            </div>

            <div>
              <label className="label">Full Name</label>
              <input
                type="text"
                {...register("fullName", { required: true })}
                placeholder="Enter your name"
                className="input input-bordered w-full focus:outline-none"
              />
              {errors.fullName?.type === "required" && (
                <p className="text-red-500 text-sm">Full name is required.</p>
              )}
            </div>

            <div>
              <label className="label">Company Logo</label>
              <input
                type="file"
                {...register("companyLogo", {
                  required: true,
                })}
                className="file-input file-input-bordered w-full focus:outline-none"
              />
              {errors.companyLogo?.type === "required" && (
                <p className="text-red-500 text-sm">
                  Company logo is required.
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
              <input
                type="password"
                {...register("password", {
                  required: true,
                  minLength: 6,
                  pattern:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
                })}
                placeholder="Minimum 6 characters"
                className="input input-bordered w-full focus:outline-none"
              />
              {errors.password?.type === "required" && (
                <p className="text-red-500 text-sm">Password is required.</p>
              )}
              {errors.password?.type === "minLength" && (
                <p className="text-red-500 text-sm">
                  Password must be at least 6 characters.
                </p>
              )}
              {errors.password?.type === "pattern" && (
                <p className="text-red-500 text-sm">
                  Password must contain uppercase, lowercase, number, and
                  special character.
                </p>
              )}
            </div>

            <div>
              <label className="label">Date of Birth</label>
              <input
                type="date"
                {...register("dateOfBirth", {
                  required: true,
                })}
                className="input input-bordered w-full focus:outline-none"
              />
              {errors.dateOfBirth?.type === "required" && (
                <p className="text-red-500 text-sm">
                  Date of birth is required.
                </p>
              )}
            </div>

            <div>
              <label className="label">Role</label>
              <input
                type="text"
                {...register("role")}
                value="HR"
                readOnly
                className="input input-bordered w-full focus:outline-none bg-gray-100 cursor-not-allowed"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl text-white font-semibold
              bg-primary
              hover:scale-[1.02] transition-all duration-300 shadow-md"
            >
              Register as HR
            </button>

            <div className="divider">or</div>

            <div className="flex justify-center items-center gap-5">
              <Link
                to="/login"
                className="block text-center text-primary hover:underline"
              >
                Login
              </Link>
              {" | "}
              <Link
                to="/joinAsEmployee"
                className="block text-center text-primary hover:underline"
              >
                Join as Employee
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JoinAsHR;

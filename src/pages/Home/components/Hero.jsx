import React from "react";
import { Link } from "react-router-dom";
import heroImg from "../../../assets/signin-img.png";

const Hero = () => {
  return (
    <section className="flex justify-center items-center l mt-10 px-2 md:px-0">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        <div className="text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Manage Your Company Assets{" "}
            <span className="text-primary">Smarter</span>
          </h1>

          <p className="mt-4 text-gray-500 max-w-md">
            Track laptops, chairs, and equipment easily. Keep everything
            organized with AssetVerse.
          </p>

          <div className="mt-6 flex gap-4">
            <Link
              to="/register?role=hr"
              className="px-6 py-3 rounded-xl text-white font-semibold
              bg-primary shadow-md hover:scale-[1.03] transition-all"
            >
              Join as HR
            </Link>

            <Link
              to="/register?role=employee"
              className="px-6 py-3 rounded-xl border font-semibold
              hover:bg-base-200 transition"
            >
              Join as Employee
            </Link>
          </div>
        </div>

        <div className="flex justify-center">
          <img
            src={heroImg}
            alt="hero"
            className="w-full max-w-md rounded-2xl"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;

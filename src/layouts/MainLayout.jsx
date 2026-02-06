import React from "react";
import { Outlet } from "react-router";
import Footer from "../pages/Shared/Footer/Footer";
import Navbar from "../pages/Shared/Navbar/Navbar";

const MainLayout = () => {
  return (
    <div className="max-w-7xl mx-auto p-3 md:p-0">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
};

export default MainLayout;

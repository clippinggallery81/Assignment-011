import React from "react";
import useAuth from "../hooks/useAuth";
import { CircleLoader } from "react-spinners";
import { Navigate } from "react-router";
import { useLocation } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <CircleLoader
        color="primary"
        className="flex justify-center items-center min-h-screen"
      />
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return children;
};

export default PrivateRoute;

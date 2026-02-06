import React from "react";
import useAuth from "../hooks/useAuth";
import { CircleLoader } from "react-spinners";
import { Navigate } from "react-router";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <CircleLoader
        color="primary"
        className="flex justify-center items-center min-h-screen"
      />
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;

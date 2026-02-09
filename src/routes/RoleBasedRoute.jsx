import React from "react";
import useAuth from "../hooks/useAuth";
import useDatabaseUser from "../hooks/useDatabaseUser";
import { CircleLoader } from "react-spinners";
import { Navigate, useLocation } from "react-router-dom";

const RoleBasedRoute = ({ children, requiredRole }) => {
  const { user, loading: authLoading } = useAuth();
  const { dbUser, loading: dbLoading } = useDatabaseUser();
  const location = useLocation();

  if (authLoading || dbLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <CircleLoader color="#0EA5E9" size={50} />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  if (!dbUser) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  // Check if user has the required role
  if (dbUser.role !== requiredRole) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default RoleBasedRoute;

import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home/Home/Home";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import Profile from "../pages/profile/Profile";
import Assets from "../pages/assets/Assets";
import PrivateRoute from "./PrivateRoute";
import RoleBasedRoute from "./RoleBasedRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import AssetList from "../pages/dashboard/hr/AssetList";
import MyAssets from "../pages/dashboard/employee/MyAssets";
import Dashboard from "../pages/dashboard/Dashboard";
import AddAsset from "../pages/dashboard/hr/AddAsset";
import Packages from "../pages/Home/components/Packages";
import RequestAsset from "../pages/dashboard/employee/RequestAsset";
import MyTeam from "../pages/dashboard/employee/MyTeam";
import MyRequests from "../pages/dashboard/employee/MyRequests";
import AllRequests from "../pages/dashboard/hr/AllRequests";
import AssignedEmployees from "../pages/dashboard/hr/AssignedEmployees";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "/assets",
        Component: Assets,
      },
      {
        path: "/register",
        Component: Register,
      },
      {
        path: "/login",
        Component: Login,
      },
      {
        path: "/profile",
        Component: Profile,
      },
    ],
  },

  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "assets",
        element: (
          <RoleBasedRoute requiredRole="hr">
            <AssetList />
          </RoleBasedRoute>
        ),
      },
      {
        path: "my-assets",
        element: (
          <RoleBasedRoute requiredRole="employee">
            <MyAssets />
          </RoleBasedRoute>
        ),
      },
      {
        path: "add-asset",
        element: (
          <RoleBasedRoute requiredRole="hr">
            <AddAsset />
          </RoleBasedRoute>
        ),
      },
      {
        path: "all-requests",
        element: (
          <RoleBasedRoute requiredRole="hr">
            <AllRequests />
          </RoleBasedRoute>
        ),
      },
      {
        path: "assigned-employees",
        element: (
          <RoleBasedRoute requiredRole="hr">
            <AssignedEmployees />
          </RoleBasedRoute>
        ),
      },
      {
        path: "upgrade",
        element: <Packages />,
      },
      {
        path: "request-asset",
        element: (
          <RoleBasedRoute requiredRole="employee">
            <RequestAsset />
          </RoleBasedRoute>
        ),
      },
      {
        path: "my-requests",
        element: (
          <RoleBasedRoute requiredRole="employee">
            <MyRequests />
          </RoleBasedRoute>
        ),
      },
      {
        path: "my-team",
        element: (
          <RoleBasedRoute requiredRole="employee">
            <MyTeam />
          </RoleBasedRoute>
        ),
      },
    ],
  },
]);

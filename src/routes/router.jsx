import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home/Home/Home";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import Profile from "../pages/profile/Profile";
import PrivateRoute from "./PrivateRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import AssetList from "../pages/dashboard/hr/AssetList";
import MyAssets from "../pages/dashboard/employee/MyAssets";
import Dashboard from "../pages/dashboard/Dashboard";
import AddAsset from "../pages/dashboard/hr/AddAsset";
import Packages from "../pages/Home/components/Packages";
import RequestAsset from "../pages/dashboard/employee/RequestAsset";
import MyTeam from "../pages/dashboard/employee/MyTeam";
import AllRequests from "../pages/dashboard/hr/AllRequests";

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
        element: <AssetList />,
      },
      {
        path: "my-assets",
        element: <MyAssets />,
      },
      {
        path: "add-asset",
        element: <AddAsset />,
      },
      {
        path: "all-requests",
        element: <AllRequests />,
      },
      {
        path: "upgrade",
        element: <Packages />,
      },
      {
        path: "request-asset",
        element: <RequestAsset />,
      },
      {
        path: "my-team",
        element: <MyTeam />,
      },
    ],
  },
]);

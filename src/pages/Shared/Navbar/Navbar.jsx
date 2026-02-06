import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Logo from "../../../components/logo/Logo";
import useAuth from "../../../hooks/useAuth";
import useDatabaseUser from "../../../hooks/useDatabaseUser";
import { useLocation } from "react-router-dom";
import { User } from "lucide-react";

const Navbar = () => {
  const { user, logOutUser } = useAuth();
  const { dbUser } = useDatabaseUser();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogOut = () => {
    logOutUser()
      .then(() => {
        console.log("User logged out successfully");
        navigate("/login");
      })
      .catch((error) => {
        console.error("Error logging out user:", error);
      });
  };

  const links = (
    <div className="flex flex-col lg:flex-row gap-4">
      <li>
        <NavLink
          to={"/"}
          className={({ isActive }) =>
            isActive
              ? "text-primary font-bold border-b-2 border-primary pb-1 rounded-none"
              : ""
          }
        >
          Home
        </NavLink>
      </li>

      <li>
        <NavLink
          to={"/assets"}
          className={({ isActive }) =>
            isActive
              ? "text-primary font-bold border-b-2 border-primary pb-1 rounded-none"
              : ""
          }
        >
          Assets
        </NavLink>
      </li>
      <li>
        <NavLink
          to={"/dashboard"}
          className={({ isActive }) =>
            isActive
              ? "text-primary font-bold border-b-2 border-primary pb-1 rounded-none"
              : ""
          }
        >
          Dashboard
        </NavLink>
      </li>

      {!user && (
        <>
          <li>
            <NavLink
              to="/register?role=hr"
              className={({ isActive }) =>
                isActive && location.search === "?role=hr"
                  ? "text-primary font-bold border-b-2 border-primary pb-1 rounded-none"
                  : ""
              }
            >
              Join as HR
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/register?role=employee"
              className={({ isActive }) =>
                isActive && location.search === "?role=employee"
                  ? "text-primary font-bold border-b-2 border-primary pb-1 rounded-none"
                  : ""
              }
            >
              Join as Employee
            </NavLink>
          </li>
        </>
      )}
    </div>
  );
  return (
    <div className="navbar bg-white shadow-lg mt-7 px-5 rounded-lg">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />{" "}
            </svg>
          </div>
          <ul
            tabIndex="-1"
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            {links}
          </ul>
        </div>
        <Logo />
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal">{links}</ul>
      </div>
      <div className="navbar-end">
        {user ? (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="cursor-pointer">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="profile"
                  className="w-10 h-10 rounded-full object-cover border-2 border-primary"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center">
                  <User size={18} className="text-primary" />
                </div>
              )}
            </label>

            <ul
              tabIndex={0}
              className="dropdown-content menu p-3 shadow bg-base-100 rounded-xl w-52 mt-3"
            >
              <li className="text-center mb-2">
                <p className="text-sm font-semibold">
                  {dbUser?.name || user.displayName}
                </p>
                <p className="text-xs truncate">{user.email}</p>
              </li>

              <div className="divider my-1"></div>

              <li>
                <Link to="/dashboard">Dashboard</Link>
              </li>

              <li>
                <Link to="/profile">Profile</Link>
              </li>

              <div className="divider my-1"></div>

              <li>
                <button onClick={handleLogOut}>Logout</button>
              </li>
            </ul>
          </div>
        ) : (
          <Link
            to="/login"
            className="px-6 py-2 rounded-xl text-white font-semibold bg-primary shadow-md hover:scale-[1.03] transition-all"
          >
            Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;

import { NavLink, Outlet } from "react-router-dom";
import { useState } from "react";
import useDatabaseUser from "../hooks/useDatabaseUser";
import { MdFormatListBulletedAdd, MdViewList, MdHome } from "react-icons/md";
import { PiGitPullRequest } from "react-icons/pi";
import { GrUserManager } from "react-icons/gr";
import { GiTeamUpgrade } from "react-icons/gi";
import { CgProfile } from "react-icons/cg";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdClose } from "react-icons/md";
import Navbar from "../pages/Shared/Navbar/Navbar";

const DashboardLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { dbUser, loading } = useDatabaseUser();

  if (loading || !dbUser) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  const role = dbUser.role;

  const btnClass =
    "w-full flex items-center gap-3 bg-white text-black rounded-lg hover:scale-105 transition-transform px-3 py-2";

  return (
    <div className="max-w-7xl mx-auto">
      <Navbar />

      <div className="max-w-7xl mx-auto grid grid-cols-4 bg-base-100 mt-10 relative">
        {/* Hamburger Menu Button - Only visible on mobile */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden absolute top-0 right-0 p-4 text-2xl text-primary z-50"
        >
          {menuOpen ? <MdClose /> : <GiHamburgerMenu />}
        </button>

        <aside
          className={`min-h-screen col-span-4 p-4 rounded-lg bg-base-200 shadow-lg absolute md:relative md:col-span-1 w-full md:w-auto transition-all z-40 ${
            menuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
        >
          <h2 className="text-xl font-bold text-primary mb-6">Dashboard</h2>

          <ul
            className="menu gap-2 text-base-content"
            onClick={() => setMenuOpen(false)}
          >
            {role === "hr" && (
              <>
                <li>
                  <NavLink
                    to="/dashboard"
                    end
                    className={({ isActive }) =>
                      isActive
                        ? `text-primary font-bold pb-1 rounded-lg ${btnClass}`
                        : btnClass
                    }
                  >
                    <MdHome /> Dashboard Home
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dashboard/assets"
                    className={({ isActive }) =>
                      isActive
                        ? `text-primary font-bold pb-1 rounded-lg ${btnClass}`
                        : btnClass
                    }
                  >
                    <MdViewList /> Asset List
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dashboard/add-asset"
                    className={({ isActive }) =>
                      isActive
                        ? `text-primary font-bold pb-1 rounded-lg ${btnClass}`
                        : btnClass
                    }
                  >
                    <MdFormatListBulletedAdd /> Add Asset
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dashboard/all-requests"
                    className={({ isActive }) =>
                      isActive
                        ? `text-primary font-bold pb-1 rounded-lg ${btnClass}`
                        : btnClass
                    }
                  >
                    <PiGitPullRequest /> All Requests
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dashboard/assigned-employees"
                    className={({ isActive }) =>
                      isActive
                        ? `text-primary font-bold pb-1 rounded-lg ${btnClass}`
                        : btnClass
                    }
                  >
                    <GrUserManager /> Employee List
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/dashboard/upgrade"
                    className={({ isActive }) =>
                      isActive
                        ? `text-primary font-bold pb-1 rounded-lg ${btnClass}`
                        : btnClass
                    }
                  >
                    <GiTeamUpgrade /> Upgrade Package
                  </NavLink>
                </li>
                <div className="divider my-2"></div>
                <li>
                  <NavLink to="/profile" className={btnClass}>
                    <CgProfile /> Profile
                  </NavLink>
                </li>
              </>
            )}

            {role === "employee" && (
              <>
                <li>
                  <NavLink
                    to="/dashboard"
                    end
                    className={({ isActive }) =>
                      isActive
                        ? `text-primary font-bold pb-1 rounded-lg ${btnClass}`
                        : btnClass
                    }
                  >
                    <MdHome /> Dashboard Home
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dashboard/my-assets"
                    className={({ isActive }) =>
                      isActive
                        ? `text-primary font-bold pb-1 rounded-lg ${btnClass}`
                        : btnClass
                    }
                  >
                    <MdViewList /> My Assets
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dashboard/request-asset"
                    className={({ isActive }) =>
                      isActive
                        ? `text-primary font-bold pb-1 rounded-lg ${btnClass}`
                        : btnClass
                    }
                  >
                    <PiGitPullRequest /> Request Asset
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dashboard/my-requests"
                    className={({ isActive }) =>
                      isActive
                        ? `text-primary font-bold pb-1 rounded-lg ${btnClass}`
                        : btnClass
                    }
                  >
                    <PiGitPullRequest /> My Requests
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dashboard/my-team"
                    className={({ isActive }) =>
                      isActive
                        ? `text-primary font-bold pb-1 rounded-lg ${btnClass}`
                        : btnClass
                    }
                  >
                    <GrUserManager /> My Team
                  </NavLink>
                </li>
                <div className="divider my-2"></div>
                <li>
                  <NavLink to="/profile" className={btnClass}>
                    <CgProfile /> Profile
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </aside>

        <main className="col-span-4 md:col-span-3 lg:col-span-3 p-6 bg-base-100 w-full">
          <Outlet />
        </main>
      </div>

      {/* Overlay for mobile menu */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-30"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default DashboardLayout;

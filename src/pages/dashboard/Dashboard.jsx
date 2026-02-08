import HRDashboardHome from "./hr/HRDashboardHome";
import EmployeeDashboardHome from "./employee/EmployeeDashboardHome";
import useDatabaseUser from "../../hooks/useDatabaseUser";

const Dashboard = () => {
  const { dbUser, loading } = useDatabaseUser();

  // 🔄 Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  // ❌ No DB user found
  if (!dbUser) {
    return (
      <p className="text-center text-red-500 font-semibold mt-20">
        User not found in database
      </p>
    );
  }

  // 🔑 Role-based dashboard
  if (dbUser.role === "hr") {
    return <HRDashboardHome dbUser={dbUser} />;
  }

  return <EmployeeDashboardHome dbUser={dbUser} />;
};

export default Dashboard;

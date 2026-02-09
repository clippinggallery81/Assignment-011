import { useEffect, useState } from "react";
import axiosInstance from "../../../lib/axiosConfig";
import { Package, Building2, Clock } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { Link } from "react-router-dom";

const COLORS = ["#0EA5E9", "#22C55E", "#F59E0B"];

const EmployeeDashboardHome = ({ dbUser }) => {
  const [stats, setStats] = useState({
    assignedAssets: 0,
    teamMembers: 0,
    pendingRequests: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const startTime = Date.now();

      try {
        console.log("📊 Fetching dashboard stats for:", dbUser.email);

        const [assetsRes, employeeAffiliationsRes, requestsRes] =
          await Promise.all([
            axiosInstance
              .get(`/assigned-assets?email=${dbUser.email}`, { timeout: 5000 })
              .catch(() => ({ data: [] })),
            axiosInstance
              .get(`/affiliations?employeeEmail=${dbUser.email}`, {
                timeout: 5000,
              })
              .catch(() => ({ data: [] })),
            axiosInstance
              .get(`/requests?employeeEmail=${dbUser.email}`, {
                timeout: 5000,
              })
              .catch(() => ({ data: [] })),
          ]);

        console.log("✅ All stats fetched successfully");

        const pendingCount = (requestsRes.data || []).filter(
          (r) => r.status === "pending",
        ).length;

        const assignedAssets = assetsRes.data || [];
        const employeeAffiliations = employeeAffiliationsRes.data || [];
        const companyName = employeeAffiliations[0]?.companyName || "";

        let companyAffiliations = [];
        if (companyName) {
          const companyRes = await axiosInstance
            .get(`/affiliations?companyName=${companyName}`, { timeout: 5000 })
            .catch(() => ({ data: [] }));
          companyAffiliations = companyRes.data || [];
        }

        const uniqueTeamEmails = new Set(
          companyAffiliations
            .filter((item) => item.employeeEmail !== dbUser.email)
            .map((item) => item.employeeEmail)
            .filter(Boolean),
        );

        setStats({
          assignedAssets: assignedAssets.length || 0,
          teamMembers: uniqueTeamEmails.size,
          pendingRequests: pendingCount,
        });

        const elapsedTime = Date.now() - startTime;
        console.log(`⏱️  Completed in ${elapsedTime}ms`);
      } catch (error) {
        console.error("❌ Error fetching stats:", error.message);
        setStats({
          assignedAssets: 0,
          teamMembers: 0,
          pendingRequests: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    if (dbUser?.email) {
      fetchStats();
    }
  }, [dbUser]);

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-[60vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  const pieData = [
    { name: "Assigned", value: stats.assignedAssets },
    { name: "Pending", value: stats.pendingRequests },
    { name: "Team", value: stats.teamMembers },
  ];

  const barData = [
    { name: "Assigned", value: stats.assignedAssets },
    { name: "Team", value: stats.teamMembers },
    { name: "Pending", value: stats.pendingRequests },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <h2 className="text-2xl font-bold mb-2">Welcome, {dbUser.name} 👋</h2>
      <p className="text-gray-500 mb-8">
        Here’s a summary of your assets & companies
      </p>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard
          title="Assigned Assets"
          value={stats.assignedAssets}
          icon={<Package size={28} />}
          to="/dashboard/my-assets"
        />
        <StatCard
          title="Team Members"
          value={stats.teamMembers}
          icon={<Building2 size={28} />}
          to="/dashboard/my-team"
        />
        <StatCard
          title="Pending Requests"
          value={stats.pendingRequests}
          icon={<Clock size={28} />}
          to="/dashboard/my-requests"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-4">
            Asset Activity Overview
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                  label
                >
                  {pieData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-4">My Dashboard Stats</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} barSize={36}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#0EA5E9" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, to }) => {
  const cardClasses =
    "bg-white p-6 rounded-xl shadow flex items-center gap-4 transition hover:shadow-md hover:-translate-y-0.5";

  const content = (
    <>
      <div className="p-3 bg-primary/10 rounded-lg text-primary">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <h3 className="text-3xl font-bold">{value}</h3>
      </div>
    </>
  );

  if (!to) {
    return <div className={cardClasses}>{content}</div>;
  }

  return (
    <Link to={to} className={`${cardClasses} cursor-pointer`}>
      {content}
    </Link>
  );
};

export default EmployeeDashboardHome;

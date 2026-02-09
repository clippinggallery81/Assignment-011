import { useEffect, useState } from "react";
import axios from "axios";
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
import { Boxes, PackageCheck, Users, ClipboardList } from "lucide-react";
import { Link } from "react-router-dom";

const COLORS = ["#0EA5E9", "#22C55E"];

const HRDashboardHome = ({ dbUser }) => {
  const [assets, setAssets] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!dbUser?.email) {
      return;
    }

    Promise.all([
      axios.get(`http://localhost:3000/assets?email=${dbUser.email}`),
      axios.get(`http://localhost:3000/requests?hrEmail=${dbUser.email}`),
    ])
      .then(([assetsRes, requestsRes]) => {
        setAssets(assetsRes.data || []);
        setRequests(requestsRes.data || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
      });
  }, [dbUser]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  // 🔹 Calculations from DB
  const totalAssets = assets.length;

  const assignedAssets = assets.reduce(
    (sum, a) => sum + (a.productQuantity - a.availableQuantity),
    0,
  );

  const returnableCount = assets.filter(
    (a) => a.productType === "Returnable",
  ).length;

  const nonReturnableCount = assets.filter(
    (a) => a.productType === "Non-returnable",
  ).length;

  const chartData = [
    { name: "Returnable", value: returnableCount },
    { name: "Non-returnable", value: nonReturnableCount },
  ];

  const pendingRequests = requests.filter((r) => r.status === "pending").length;

  const requestCounts = requests.reduce((acc, req) => {
    const key = req.assetName || "Unknown";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const topRequestedData = Object.entries(requestCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  return (
    <div className="p-6 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold">Welcome, {dbUser.name} 👋</h2>
        <p className="text-gray-500">
          Manage assets & employees for{" "}
          <span className="font-semibold text-primary">
            {dbUser.companyName}
          </span>
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <StatCard
          title="Total Assets"
          value={totalAssets}
          icon={<Boxes size={24} />}
          to="/dashboard/assets"
        />
        <StatCard
          title="Assigned Assets"
          value={assignedAssets}
          icon={<PackageCheck size={24} />}
          to="/dashboard/assigned-employees"
        />
        <StatCard
          title="Employees"
          value={`${dbUser.currentEmployees || 0}/${dbUser.packageLimit}`}
          icon={<Users size={24} />}
          to="/dashboard/assigned-employees"
        />
        <StatCard
          title="Pending Requests"
          value={pendingRequests}
          icon={<ClipboardList size={24} />}
          to="/dashboard/all-requests"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-4">
            Asset Type Distribution
          </h3>

          {assets.length === 0 ? (
            <p className="text-center text-gray-400 py-10">No assets found</p>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={90}
                    label
                  >
                    {chartData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Top Requested Assets */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-4">Top Requested Assets</h3>
          {topRequestedData.length === 0 ? (
            <p className="text-center text-gray-400 py-10">No requests yet</p>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topRequestedData} barSize={36}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#0EA5E9" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* 🔹 Reusable Stat Card */
const StatCard = ({ title, value, icon, to }) => {
  const cardClasses =
    "bg-white p-6 rounded-xl shadow flex items-center gap-4 transition hover:shadow-md hover:-translate-y-0.5";

  const content = (
    <>
      <div className="bg-primary/10 p-3 rounded-lg text-primary">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <h3 className="text-2xl font-bold">{value}</h3>
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

export default HRDashboardHome;

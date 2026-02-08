import { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Boxes, PackageCheck, Users, ClipboardList } from "lucide-react";

const COLORS = ["#0EA5E9", "#22C55E"];

const HRDashboardHome = ({ dbUser }) => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!dbUser?.email) {
      return;
    }

    axios
      .get(`http://localhost:3000/assets?email=${dbUser.email}`)
      .then((res) => {
        setAssets(res.data || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching assets:", error);
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
        />
        <StatCard
          title="Assigned Assets"
          value={assignedAssets}
          icon={<PackageCheck size={24} />}
        />
        <StatCard
          title="Employees"
          value={`${dbUser.currentEmployees || 0}/${dbUser.packageLimit}`}
          icon={<Users size={24} />}
        />
        <StatCard
          title="Pending Requests"
          value={0}
          icon={<ClipboardList size={24} />}
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

        {/* Placeholder */}
        <div className="bg-white p-6 rounded-xl shadow flex items-center justify-center text-gray-400">
          📊 Top Requested Assets (Coming Soon)
        </div>
      </div>
    </div>
  );
};

/* 🔹 Reusable Stat Card */
const StatCard = ({ title, value, icon }) => (
  <div className="bg-white p-6 rounded-xl shadow flex items-center gap-4">
    <div className="bg-primary/10 p-3 rounded-lg text-primary">{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <h3 className="text-2xl font-bold">{value}</h3>
    </div>
  </div>
);

export default HRDashboardHome;

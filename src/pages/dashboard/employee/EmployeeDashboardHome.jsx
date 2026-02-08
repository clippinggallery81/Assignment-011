import { Package, Building2, Clock } from "lucide-react";

const EmployeeDashboardHome = ({ dbUser }) => {
  return (
    <div className="p-6">
      {/* Header */}
      <h2 className="text-2xl font-bold mb-2">Welcome, {dbUser.name} 👋</h2>
      <p className="text-gray-500 mb-8">
        Here’s a summary of your assets & companies
      </p>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Assigned Assets"
          value="0"
          icon={<Package size={28} />}
        />
        <StatCard title="Companies" value="0" icon={<Building2 size={28} />} />
        <StatCard
          title="Pending Requests"
          value="0"
          icon={<Clock size={28} />}
        />
      </div>

      {/* Info */}
      <div className="mt-10 bg-base-100 p-6 rounded-xl shadow">
        <h3 className="text-lg font-semibold mb-2">Account Info</h3>
        <ul className="text-gray-600 space-y-2">
          <li>• Role: Employee</li>
          <li>• Email: {dbUser.email}</li>
        </ul>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon }) => {
  return (
    <div className="bg-white p-5 rounded-xl shadow flex items-center gap-4">
      <div className="p-3 bg-primary/10 rounded-lg text-primary">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <h3 className="text-2xl font-bold">{value}</h3>
      </div>
    </div>
  );
};

export default EmployeeDashboardHome;

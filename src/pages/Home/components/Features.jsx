import React from "react";
import {
  Laptop,
  ClipboardList,
  Users,
  Bell,
  BarChart3,
  Shield,
} from "lucide-react";

const features = [
  {
    title: "Smart Asset Inventory",
    desc: "Keep track of all company equipment in one organized inventory.",
    icon: <Laptop size={28} />,
  },
  {
    title: "Request & Approval Flow",
    desc: "Employees can request assets and HR can approve with one click.",
    icon: <ClipboardList size={28} />,
  },
  {
    title: "Multi-Company Support",
    desc: "Employees can work with multiple companies at the same time.",
    icon: <Users size={28} />,
  },
  {
    title: "Notice Board",
    desc: "Share company announcements directly on employee dashboards.",
    icon: <Bell size={28} />,
  },
  {
    title: "Analytics Dashboard",
    desc: "Visual charts help HR understand asset usage trends.",
    icon: <BarChart3 size={28} />,
  },
  {
    title: "Secure Access",
    desc: "Role-based access keeps company data safe and private.",
    icon: <Shield size={28} />,
  },
];

const Features = () => {
  return (
    <section className="py-20 bg-base-100 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">
            Powerful <span className="text-primary">Features</span>
          </h2>
          <p className="mt-3 text-gray-500 max-w-xl mx-auto">
            Everything you need to manage assets and teams efficiently.
          </p>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                {item.icon}
              </div>

              <h3 className="font-semibold text-lg">{item.title}</h3>

              <p className="text-sm text-gray-500 mt-2">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;

import React from "react";
import { Package, Users, ShieldCheck, Workflow } from "lucide-react";

const About = () => {
  const features = [
    {
      title: "Asset Tracking",
      desc: "Track laptops, chairs, and equipment in real time across your organization.",
      icon: <Package size={32} />,
    },
    {
      title: "Employee Management",
      desc: "Manage employees and assign assets easily from one central dashboard.",
      icon: <Users size={32} />,
    },
    {
      title: "Loss Prevention",
      desc: "Reduce asset loss with clear ownership and return tracking.",
      icon: <ShieldCheck size={32} />,
    },
    {
      title: "Simple Workflow",
      desc: "Request, approve, assign, and return assets with a smooth workflow.",
      icon: <Workflow size={32} />,
    },
  ];

  return (
    <section className="py-20 bg-base-100 px-2 md:px-0">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">
            Why Choose <span className="text-primary">AssetVerse</span>
          </h2>
          <p className="mt-3 text-gray-500 max-w-xl mx-auto">
            Everything you need to manage company assets and employees in one
            simple platform.
          </p>
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-lg transition"
            >
              <div className="w-14 h-14 mx-auto rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
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

export default About;

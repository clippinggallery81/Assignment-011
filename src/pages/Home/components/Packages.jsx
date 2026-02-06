import React from "react";
import { Check } from "lucide-react";

const Packages = () => {
  const packages = [
    {
      name: "Basic",
      price: 5,
      limit: 5,
      features: ["Asset Tracking", "Employee Management", "Basic Support"],
      popular: false,
    },
    {
      name: "Standard",
      price: 8,
      limit: 10,
      features: [
        "All Basic features",
        "Advanced Analytics",
        "Priority Support",
      ],
      popular: true,
    },
    {
      name: "Premium",
      price: 15,
      limit: 20,
      features: ["All Standard features", "Custom Branding", "24/7 Support"],
      popular: false,
    },
  ];
  return (
    <section className="py-20  px-4">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">
            Simple <span className="text-primary">Pricing</span> Plans
          </h2>
          <p className="mt-3 text-gray-500">
            Choose a package that fits your company size.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {packages.map((pkg, idx) => (
            <div
              key={idx}
              className={`bg-white rounded-2xl shadow-lg p-8 relative ${
                pkg.popular ? "border-2 border-primary" : ""
              }`}
            >
              {pkg.popular && (
                <span className="absolute -top-3 right-6 bg-primary text-white text-xs px-3 py-1 rounded-full">
                  Most Popular
                </span>
              )}

              <h3 className="text-xl font-semibold">{pkg.name}</h3>

              <p className="mt-3 text-3xl font-bold">
                ${pkg.price}
                <span className="text-sm font-normal text-gray-500">
                  /month
                </span>
              </p>

              <p className="text-sm text-gray-500 mt-1">
                Up to {pkg.limit} employees
              </p>

              <ul className="mt-6 space-y-3">
                {pkg.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <Check size={16} className="text-primary" />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                className={`mt-8 w-full py-3 rounded-xl font-semibold transition ${
                  pkg.popular
                    ? "bg-primary text-white"
                    : "border hover:bg-base-200"
                }`}
              >
                Get Started
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Packages;

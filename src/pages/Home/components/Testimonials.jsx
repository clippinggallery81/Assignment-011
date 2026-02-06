import React from "react";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Ahmed",
    role: "HR Manager",
    company: "TechNova",
    comment:
      "AssetVerse completely changed how we manage company equipment. Everything is now organized and transparent.",
  },
  {
    name: "Rakib Hasan",
    role: "Software Engineer",
    company: "CloudByte",
    comment:
      "Requesting assets is super easy now. I can track my assigned items anytime.",
  },
  {
    name: "Jessica Lee",
    role: "Operations Lead",
    company: "NextGen Labs",
    comment:
      "We reduced asset loss dramatically after switching to AssetVerse. Highly recommended!",
  },
];

const stats = [
  { label: "Companies Using AssetVerse", value: "100+" },
  { label: "Assets Managed", value: "5,000+" },
  { label: "Active Employees", value: "2,000+" },
  { label: "Customer Satisfaction", value: "98%" },
];

const Testimonials = () => {
  return (
    <section className="py-20 bg-base-100 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">
            Trusted by <span className="text-primary">Growing Teams</span>
          </h2>
          <p className="mt-3 text-gray-500 max-w-xl mx-auto">
            See what our users say about managing assets with AssetVerse.
          </p>
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {testimonials.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition"
            >
              <div className="flex gap-1 text-yellow-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>

              <p className="text-sm text-gray-600 mb-4">"{item.comment}"</p>

              <h4 className="font-semibold">{item.name}</h4>
              <p className="text-xs text-gray-500">
                {item.role}, {item.company}
              </p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((stat, idx) => (
            <div key={idx}>
              <h3 className="text-3xl font-bold text-primary">{stat.value}</h3>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

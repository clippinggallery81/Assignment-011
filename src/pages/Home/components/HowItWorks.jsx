import React from "react";
import { UserPlus, ClipboardCheck, PackageCheck } from "lucide-react";

const steps = [
  {
    step: "01",
    title: "Register Your Account",
    desc: "HR managers register their company and employees join independently.",
    icon: <UserPlus size={28} />,
  },
  {
    step: "02",
    title: "Add & Request Assets",
    desc: "HR adds assets while employees request what they need.",
    icon: <ClipboardCheck size={28} />,
  },
  {
    step: "03",
    title: "Approve & Track",
    desc: "HR approves requests and tracks asset assignments in real time.",
    icon: <PackageCheck size={28} />,
  },
];

const HowItWorks = () => {
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">
            How <span className="text-primary">It Works</span>
          </h2>
          <p className="mt-3 text-gray-500 max-w-xl mx-auto">
            Get started with AssetVerse in just three simple steps.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-md p-8 text-center hover:shadow-lg transition"
            >
              <div className="text-primary text-sm font-semibold">
                STEP {item.step}
              </div>

              <div className="w-14 h-14 mx-auto rounded-xl bg-primary/10 text-primary flex items-center justify-center my-4">
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

export default HowItWorks;

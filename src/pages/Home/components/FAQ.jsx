const faqs = [
  {
    q: "What is AssetVerse?",
    a: "AssetVerse is a corporate asset management system that helps companies track equipment and manage employee assignments.",
  },
  {
    q: "Can employees join multiple companies?",
    a: "Yes, employees can request assets from multiple companies and become affiliated after approval.",
  },
  {
    q: "How does asset tracking work?",
    a: "HR adds assets to inventory, employees request items, and HR approves assignments. Everything is tracked digitally.",
  },
  {
    q: "Is AssetVerse suitable for small teams?",
    a: "Absolutely. AssetVerse offers flexible packages starting from small teams to growing organizations.",
  },
];

const FAQ = () => {
  return (
    <section className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">
            Frequently Asked <span className="text-primary">Questions</span>
          </h2>
          <p className="mt-3 text-gray-500">
            Find quick answers to common questions about AssetVerse.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-4">
          {faqs.map((item, idx) => (
            <div
              key={idx}
              className="collapse collapse-arrow bg-white shadow-sm rounded-xl"
            >
              <input
                type="radio"
                name="faq-accordion"
                defaultChecked={idx === 0}
              />
              <div className="collapse-title font-medium">{item.q}</div>
              <div className="collapse-content text-sm text-gray-500">
                <p>{item.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;

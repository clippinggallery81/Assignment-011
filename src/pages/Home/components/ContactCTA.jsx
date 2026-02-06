import { Link } from "react-router-dom";

const ContactCTA = () => {
  return (
    <section className="py-20  px-4">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold">
          Ready to Manage Your Assets Smarter?
        </h2>

        <p className="mt-4  max-w-xl mx-auto">
          Join AssetVerse today and simplify how your company tracks and manages
          assets.
        </p>

        <div className="mt-8 flex justify-center gap-4 flex-wrap">
          <Link
            to="/register?role=hr"
            className="px-8 py-3 rounded-xl bg-white text-primary font-semibold
            hover:scale-[1.05] transition shadow"
          >
            Join as HR
          </Link>

          <Link
            to="/register?role=employee"
            className="px-8 py-3 rounded-xl border border-white text-white font-semibold bg-primary
             hover:scale-105 transition"
          >
            Join as Employee
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ContactCTA;

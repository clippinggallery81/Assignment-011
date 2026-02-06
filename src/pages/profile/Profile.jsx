import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import { User } from "lucide-react";

const Profile = () => {
  const { user } = useAuth(); // firebase user
  // পরে backend user আনলে এখানে dbUser use করবে

  const [name, setName] = useState(user?.displayName || "");
  const [dob, setDob] = useState("");

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-primary">My Profile</h2>

        {/* Avatar */}
        <div className="flex items-center gap-6 mb-8">
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt="profile"
              className="w-24 h-24 rounded-full object-cover border-primary border-2"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-primary/10 border flex items-center justify-center">
              <User size={36} className="text-primary" />
            </div>
          )}

          <div>
            <h3 className="font-semibold">{user?.displayName || "User"}</h3>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>

        {/* Form */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="label">Full Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input input-bordered w-full"
            />
          </div>

          <div>
            <label className="label">Date of Birth</label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="input input-bordered w-full"
            />
          </div>

          <div>
            <label className="label">Email</label>
            <input
              value={user?.email}
              readOnly
              className="input input-bordered w-full bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="label">Role</label>
            <input
              value="Employee / HR"
              readOnly
              className="input input-bordered w-full bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* HR হলে পরে Company Name দেখাবে */}
          {/* 
          <div>
            <label className="label">Company Name</label>
            <input
              value={dbUser?.companyName}
              readOnly
              className="input input-bordered w-full bg-gray-100"
            />
          </div>
          */}
        </div>

        <button className="mt-8 px-8 py-3 rounded-xl bg-primary text-white font-semibold hover:scale-[1.03] transition">
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Profile;

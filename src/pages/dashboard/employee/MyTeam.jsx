import { useCallback, useEffect, useMemo, useState } from "react";
import axiosInstance from "../../../lib/axiosConfig";
import { Mail, Building2 } from "lucide-react";
import useDatabaseUser from "../../../hooks/useDatabaseUser";

const MyTeam = () => {
  const { dbUser, loading } = useDatabaseUser();
  const [affiliations, setAffiliations] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [teamMembers, setTeamMembers] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // 🔹 Load affiliations for current employee
  const fetchAffiliations = useCallback(async () => {
    if (!dbUser?.email) return;
    try {
      setLoadingData(true);
      const res = await axiosInstance.get(
        `/affiliations?employeeEmail=${dbUser.email}`,
        { timeout: 5000 },
      );

      const items = res.data || [];
      setAffiliations(items);

      if (!selectedCompany && items.length > 0) {
        setSelectedCompany(items[0].companyName);
      }
    } catch (error) {
      console.error("❌ Error fetching affiliations:", error.message);
      setAffiliations([]);
    } finally {
      setLoadingData(false);
    }
  }, [dbUser, selectedCompany]);

  // 🔹 Load team members for selected company
  const fetchTeamMembers = useCallback(async () => {
    if (!selectedCompany) {
      setTeamMembers([]);
      return;
    }

    try {
      setLoadingData(true);
      const affRes = await axiosInstance.get(
        `/affiliations?companyName=${selectedCompany}`,
        { timeout: 5000 },
      );

      const companyAffiliations = (affRes.data || []).filter(
        (item) => item.employeeEmail !== dbUser.email,
      );

      const emails = companyAffiliations
        .map((item) => item.employeeEmail)
        .filter(Boolean);

      let users = [];
      if (emails.length > 0) {
        const usersRes = await axiosInstance.get(
          `/users-by-emails?emails=${emails.join(",")}`,
          { timeout: 5000 },
        );
        users = usersRes.data || [];
      }

      const userMap = new Map(users.map((u) => [u.email, u]));

      const members = companyAffiliations.map((item) => {
        const user = userMap.get(item.employeeEmail) || {};
        return {
          _id: item.employeeEmail,
          name: item.employeeName || user.name,
          email: item.employeeEmail,
          companyName: item.companyName,
          joinDate: item.affiliationDate,
          dob: user.dob,
          profileImage: user.profileImage || user.photoURL || null,
        };
      });

      setTeamMembers(members);
    } catch (error) {
      console.error("❌ Error fetching team members:", error.message);
      setTeamMembers([]);
    } finally {
      setLoadingData(false);
    }
  }, [dbUser, selectedCompany]);

  useEffect(() => {
    fetchAffiliations();
  }, [fetchAffiliations]);

  useEffect(() => {
    fetchTeamMembers();
  }, [fetchTeamMembers]);

  const companyOptions = useMemo(
    () => affiliations.map((item) => item.companyName),
    [affiliations],
  );

  // 🔹 Filter team members
  const filteredMembers = teamMembers.filter((member) => {
    const nameMatch = member.name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const emailMatch = member.email
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    return nameMatch || emailMatch;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-primary mb-2">My Team</h2>

        {companyOptions.length === 0 ? (
          <p className="text-gray-500 mb-6">
            No company affiliation yet. Request an asset to get affiliated.
          </p>
        ) : (
          <p className="text-gray-500 mb-6">
            {filteredMembers.length} team members in this company
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            className="select select-bordered w-full"
            disabled={companyOptions.length === 0}
          >
            {companyOptions.map((company) => (
              <option key={company} value={company}>
                {company}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Search team members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input input-bordered w-full"
            disabled={companyOptions.length === 0}
          />
        </div>
      </div>

      {loadingData ? (
        <div className="flex justify-center items-center h-[50vh]">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : companyOptions.length === 0 ? (
        <div className="text-center py-12 bg-base-100 rounded-lg">
          <p className="text-gray-500 text-lg">No company affiliation yet</p>
        </div>
      ) : filteredMembers.length === 0 ? (
        <div className="text-center py-12 bg-base-100 rounded-lg">
          <p className="text-gray-500 text-lg">No team members found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member) => (
            <div
              key={member._id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6 border-l-4 border-primary"
            >
              {/* Avatar */}
              <div className="flex items-center gap-4 mb-4">
                {member.profileImage ? (
                  <img
                    src={member.profileImage}
                    alt={member.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-linear-to-br from-primary to-primary/70 flex items-center justify-center text-white text-xl font-bold">
                    {member.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-bold text-gray-800">
                    {member.name}
                  </h3>
                  <p className="text-sm text-gray-500">Employee</p>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                {/* Email */}
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-primary" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm font-medium">{member.email}</p>
                  </div>
                </div>

                {/* Company */}
                <div className="flex items-center gap-3">
                  <Building2 size={18} className="text-primary" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Company</p>
                    <p className="text-sm font-medium">{member.companyName}</p>
                  </div>
                </div>
              </div>

              {/* Join Date */}
              {member.joinDate && (
                <div className="mt-4 pt-4 border-t text-xs text-gray-500">
                  <p>
                    Joined{" "}
                    {new Date(member.joinDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTeam;

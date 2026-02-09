import { useEffect, useState, useCallback } from "react";
import axiosInstance from "../../../lib/axiosConfig";
import Swal from "sweetalert2";
import useDatabaseUser from "../../../hooks/useDatabaseUser";
import { RotateCcw, Trash2 } from "lucide-react";

const AssignedEmployees = () => {
  const { dbUser, loading } = useDatabaseUser();
  const [teamMembers, setTeamMembers] = useState([]);
  const [employeeCount, setEmployeeCount] = useState(0);
  const [fetching, setFetching] = useState(false);

  // Fetch employees and asset counts
  const fetchTeamMembers = useCallback(async () => {
    if (!dbUser?.companyName) return;

    setFetching(true);
    try {
      const [affRes, assignmentsRes] = await Promise.all([
        axiosInstance.get(`/affiliations?companyName=${dbUser.companyName}`),
        axiosInstance.get(
          `/company-assignments?companyName=${dbUser.companyName}`,
        ),
      ]);

      const affiliations = affRes.data || [];
      const assignments = assignmentsRes.data || [];

      setEmployeeCount(affiliations.length);

      const emails = affiliations.map((item) => item.employeeEmail);
      let users = [];
      if (emails.length > 0) {
        const usersRes = await axiosInstance.get(
          `/users-by-emails?emails=${emails.join(",")}`,
        );
        users = usersRes.data || [];
      }

      const userMap = new Map(users.map((u) => [u.email, u]));
      const assetCountMap = assignments.reduce((acc, item) => {
        acc[item.employeeEmail] = (acc[item.employeeEmail] || 0) + 1;
        return acc;
      }, {});

      const members = affiliations.map((item) => {
        const user = userMap.get(item.employeeEmail) || {};
        return {
          _id: item.employeeEmail,
          name: item.employeeName || user.name,
          email: item.employeeEmail,
          joinDate: item.affiliationDate,
          assetCount: assetCountMap[item.employeeEmail] || 0,
          profileImage: user.profileImage || user.photoURL || null,
        };
      });

      setTeamMembers(members);
    } catch (error) {
      console.error("Error fetching team members:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load employees",
        confirmButtonColor: "#0EA5E9",
      });
    } finally {
      setFetching(false);
    }
  }, [dbUser]);

  useEffect(() => {
    if (dbUser?.companyName) {
      fetchTeamMembers();
    }
  }, [dbUser, fetchTeamMembers]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  // Remove employee from team
  const handleRemove = (employeeEmail) => {
    Swal.fire({
      title: "Remove Employee?",
      text: "All assigned assets will be returned",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Remove",
      confirmButtonColor: "#0EA5E9",
      customClass: { container: "z-50" },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosInstance.patch(`/affiliations/remove`, {
            employeeEmail,
            companyName: dbUser.companyName,
          });
          await fetchTeamMembers();

          Swal.fire({
            icon: "success",
            title: "Removed!",
            text: "Employee removed and assets returned",
            confirmButtonColor: "#0EA5E9",
          });
        } catch (error) {
          console.error("Return error:", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to return asset",
            confirmButtonColor: "#0EA5E9",
          });
        }
      }
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow p-6 mt-8 md:mt-0">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <div>
          <h2 className="text-xl font-bold">My Employee List</h2>
          <p className="text-sm text-gray-500">
            {employeeCount}/{dbUser.packageLimit || 0} employees used
          </p>
        </div>
        <button
          className="btn btn-sm btn-outline"
          onClick={fetchTeamMembers}
          disabled={fetching}
        >
          <RotateCcw size={16} />
          Refresh
        </button>
      </div>

      {teamMembers.length === 0 ? (
        <p className="text-center text-gray-500 py-8">No employees yet</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Email</th>
                <th>Join Date</th>
                <th>Assets Count</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {teamMembers.map((member) => (
                <tr key={member._id}>
                  <td>
                    <div className="flex items-center gap-3">
                      {member.profileImage ? (
                        <img
                          src={member.profileImage}
                          alt={member.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-semibold">
                          {member.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="font-semibold">{member.name}</span>
                    </div>
                  </td>
                  <td className="text-sm">{member.email}</td>
                  <td className="text-sm">
                    {member.joinDate
                      ? new Date(member.joinDate).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td>
                    <span className="badge badge-primary">
                      {member.assetCount}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-xs btn-outline btn-error"
                      onClick={() => handleRemove(member.email)}
                    >
                      <Trash2 size={14} /> Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AssignedEmployees;

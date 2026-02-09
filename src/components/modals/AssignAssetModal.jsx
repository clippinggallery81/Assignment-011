import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const AssignAssetModal = ({ asset, companyName, onAssignSuccess }) => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingEmployees, setFetchingEmployees] = useState(false);

  // Fetch employees when modal opens or when asset changes
  useEffect(() => {
    if (asset) {
      console.log("Asset selected, fetching employees...");
      fetchEmployees();
    }
  }, [asset]);

  const fetchEmployees = async () => {
    setFetchingEmployees(true);
    try {
      console.log("🔍 Fetching all employees (role=employee)");
      const url = `http://localhost:3000/team-members?role=employee`;
      console.log("📡 Request URL:", url);
      const res = await axios.get(url);
      console.log("✅ Employees fetched:", res.data);
      if (res.data && res.data.length === 0) {
        console.warn("⚠️ No employees found in database!");
      }
      setEmployees(res.data || []);
    } catch (error) {
      console.error("❌ Error fetching employees:", error);
      setEmployees([]);
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          "Failed to load employees: " +
          (error.response?.data?.message || error.message),
        confirmButtonColor: "#0EA5E9",
      });
    } finally {
      setFetchingEmployees(false);
    }
  };

  const handleAssign = async () => {
    if (!selectedEmployee) {
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "Please select an employee",
        confirmButtonColor: "#0EA5E9",
      });
      return;
    }

    if (asset.availableQuantity <= 0) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No available quantity for this asset",
        confirmButtonColor: "#0EA5E9",
      });
      return;
    }

    setLoading(true);
    try {
      const employee = employees.find((emp) => emp._id === selectedEmployee);

      // Create assignment directly
      const assignment = {
        assetId: asset._id,
        productName: asset.productName,
        productImage: asset.productImage,
        productType: asset.productType,
        employeeEmail: employee.email,
        employeeName: employee.name,
        companyName: companyName,
        status: "assigned",
      };

      // Using a direct assignment endpoint (you may need to modify backend)
      await axios.post("http://localhost:3000/assign-asset", assignment);

      // Close modal
      document.getElementById("assignModal").close();

      // Reset
      setSelectedEmployee("");

      Swal.fire({
        icon: "success",
        title: "Assigned!",
        text: `Asset assigned to ${employee.name}`,
        confirmButtonColor: "#0EA5E9",
      });

      // Trigger refresh
      if (onAssignSuccess) onAssignSuccess();
    } catch (error) {
      console.error("Assign error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to assign asset",
        confirmButtonColor: "#0EA5E9",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <dialog id="assignModal" className="modal modal-middle z-50">
      <div className="modal-box w-full max-w-md">
        <h3 className="font-bold text-lg mb-4">Assign Asset</h3>

        {asset && (
          <div className="mb-4 p-3 bg-gray-100 rounded">
            <p className="font-semibold">{asset.productName}</p>
            <p className="text-sm text-gray-600">
              Available: {asset.availableQuantity}
            </p>
          </div>
        )}

        <label className="label">
          <span className="label-text font-semibold">Select Employee</span>
        </label>

        {fetchingEmployees ? (
          <div className="flex justify-center py-4">
            <span className="loading loading-spinner loading-sm text-primary"></span>
          </div>
        ) : employees.length === 0 ? (
          <div className="alert alert-warning mb-4">
            <p className="text-sm">No employees found in your company</p>
          </div>
        ) : (
          <select
            className="select select-bordered w-full mb-4"
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
          >
            <option value="">-- Choose Employee --</option>
            {employees.map((employee) => (
              <option key={employee._id} value={employee._id}>
                {employee.name} ({employee.email})
              </option>
            ))}
          </select>
        )}

        <div className="modal-action">
          <button
            className="btn"
            onClick={() => {
              document.getElementById("assignModal").close();
              setSelectedEmployee("");
            }}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleAssign}
            disabled={loading || fetchingEmployees}
          >
            {loading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              "Assign"
            )}
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default AssignAssetModal;

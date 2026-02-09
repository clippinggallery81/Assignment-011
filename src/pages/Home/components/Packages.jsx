import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import useDatabaseUser from "../../../hooks/useDatabaseUser";
import useAuth from "../../../hooks/useAuth";

const Packages = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { dbUser } = useDatabaseUser();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState("");
  const [payments, setPayments] = useState([]);

  const isUpgradeView = location.pathname.includes("/dashboard/upgrade");
  const isHR = dbUser?.role === "hr";
  const hasActivePackage = isHR && payments.length > 0;
  const latestPayment = payments.length > 0 ? payments[0] : null;
  const currentPackageName = latestPayment?.packageName?.toLowerCase();

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await axios.get("http://localhost:3000/packages");
        const items = res.data || [];
        const withPopular = items.map((pkg) => ({
          ...pkg,
          limit: pkg.employeeLimit,
          popular: pkg.name === "Standard",
        }));
        setPackages(withPopular);
      } catch (error) {
        console.error("Error fetching packages:", error.message);
        setPackages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  useEffect(() => {
    const fetchPayments = async () => {
      if (!isUpgradeView || !isHR || !dbUser?.email) return;
      try {
        const res = await axios.get(
          `http://localhost:3000/payments?hrEmail=${dbUser.email}`,
        );
        setPayments(res.data || []);
      } catch (error) {
        console.error("Error fetching payments:", error.message);
        setPayments([]);
      }
    };

    fetchPayments();
  }, [isUpgradeView, isHR, dbUser]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const success = params.get("success");
    const sessionId = params.get("session_id");

    if (!isUpgradeView || !isHR || !success || !sessionId) return;

    const confirmPayment = async () => {
      try {
        const confirmKey = `confirmed_session_${sessionId}`;
        if (sessionStorage.getItem(confirmKey) === "1") {
          return;
        }

        await axios.post("http://localhost:3000/confirm-payment", {
          sessionId,
        });

        sessionStorage.setItem(confirmKey, "1");

        try {
          window.dispatchEvent(new Event("dbUserUpdated"));
        } catch (error) {
          console.error("Error dispatching dbUserUpdated event:", error);
        }
      } catch (error) {
        console.error("Confirm payment error:", error.message);
      } finally {
        navigate(location.pathname, { replace: true });
      }
    };

    confirmPayment();
  }, [location.search, isUpgradeView, isHR, location.pathname, navigate]);

  const handleUpgrade = async (pkg) => {
    if (!isHR || !dbUser?.email || hasActivePackage) return;
    try {
      setProcessingId(pkg._id);
      const res = await axios.post(
        "http://localhost:3000/create-checkout-session",
        {
          packageId: pkg._id,
          hrEmail: dbUser.email,
        },
      );

      if (res.data?.url) {
        window.location.href = res.data.url;
      }
    } catch (error) {
      console.error("Upgrade error:", error.message);
    } finally {
      setProcessingId("");
    }
  };
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

        {isUpgradeView && isHR && hasActivePackage && (
          <div className="mb-10 bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-semibold">Current Package</h3>
            <p className="text-sm text-gray-500 mt-1">
              Your plan is active. Further upgrades are disabled.
            </p>

            <div className="mt-4 grid sm:grid-cols-2 gap-4">
              <div className="border rounded-xl p-4">
                <p className="text-xs text-gray-500">Package</p>
                <p className="text-lg font-semibold">
                  {latestPayment?.packageName || dbUser?.subscription || "N/A"}
                </p>
              </div>
              <div className="border rounded-xl p-4">
                <p className="text-xs text-gray-500">Employee Limit</p>
                <p className="text-lg font-semibold">
                  {dbUser?.packageLimit || latestPayment?.employeeLimit || 0}
                </p>
              </div>
              <div className="border rounded-xl p-4">
                <p className="text-xs text-gray-500">Amount</p>
                <p className="text-lg font-semibold">
                  ${latestPayment?.amount ?? 0}
                </p>
              </div>
              <div className="border rounded-xl p-4">
                <p className="text-xs text-gray-500">Last Paid</p>
                <p className="text-lg font-semibold">
                  {latestPayment?.paymentDate
                    ? new Date(latestPayment.paymentDate).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {loading ? (
            <div className="col-span-full flex justify-center">
              <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
          ) : (
            packages.map((pkg, idx) => {
              const isCurrentPlan =
                isUpgradeView &&
                isHR &&
                hasActivePackage &&
                currentPackageName &&
                pkg.name?.toLowerCase() === currentPackageName;

              const isUpgradeDisabled =
                isUpgradeView && isHR && hasActivePackage && !isCurrentPlan;

              return (
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
                    } ${processingId === pkg._id ? "opacity-70" : ""}`}
                    onClick={() => {
                      if (isUpgradeView && isHR) {
                        handleUpgrade(pkg);
                        return;
                      }

                      if (!user) {
                        navigate("/login");
                        return;
                      }

                      navigate("/dashboard/upgrade");
                    }}
                    disabled={processingId === pkg._id || isUpgradeDisabled}
                  >
                    {isUpgradeView && isHR
                      ? processingId === pkg._id
                        ? "Processing..."
                        : isCurrentPlan
                          ? "Current Plan"
                          : "Upgrade"
                      : "Get Started"}
                  </button>
                </div>
              );
            })
          )}
        </div>

        {isUpgradeView && isHR && (
          <div className="mt-12 bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Payment History</h3>
            {payments.length === 0 ? (
              <p className="text-gray-500">No payments yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Package</th>
                      <th>Employees</th>
                      <th>Amount</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment) => (
                      <tr key={payment._id}>
                        <td>{payment.packageName}</td>
                        <td>{payment.employeeLimit}</td>
                        <td>${payment.amount}</td>
                        <td>
                          {payment.paymentDate
                            ? new Date(payment.paymentDate).toLocaleDateString()
                            : "N/A"}
                        </td>
                        <td>
                          <span className="badge badge-success">
                            {payment.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Packages;

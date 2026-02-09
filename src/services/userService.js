import axios from "axios";

/**
 * Sync user to backend database after Firebase login
 * If user doesn't exist in DB, create them automatically
 */
export const syncUserToBackend = async (user, additionalData = {}) => {
  if (!user?.email) return null;

  try {
    console.log("Syncing user to backend:", user.email);

    // First, check if user exists
    try {
      const existingRes = await axios.get(`http://localhost:3000/user/${user.email}`);
      console.log("✅ User already exists in database:", existingRes.data);
      return existingRes.data;
    } catch (error) {
      if (error.response?.status === 404) {
        // User doesn't exist, create them
        console.log("User not in database, creating...");

        // Determine role from email or default to employee
        const isHR = additionalData?.role === "hr" || user.email.includes("hr");
        const role = isHR ? "hr" : "employee";
        const companyName = additionalData?.companyName;

        const newUserPayload = {
          name: user.displayName || user.email.split("@")[0],
          email: user.email,
          password: "", // Backend doesn't need password for Firebase users
          role: role,
          photoURL: user.photoURL || null,
          packageLimit: role === "hr" ? 20 : undefined,
        };

        if (role === "hr") {
          newUserPayload.companyName = companyName || "";
        }

        const newUserRes = await axios.post(
          "http://localhost:3000/users",
          newUserPayload,
        );

        console.log("✅ User created in database:", newUserRes.data);
        return newUserRes.data;
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error("❌ Error syncing user:", error.message);
    return null;
  }
};

/**
 * Get or create user in backend
 */
export const getOrCreateUser = async (firebaseUser) => {
  return await syncUserToBackend(firebaseUser);
};

export default syncUserToBackend;

import { useEffect, useState } from "react";
import axios from "axios";
import useAuth from "./useAuth";

const useDatabaseUser = () => {
  const { user } = useAuth();
  const [dbUser, setDbUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      axios
        .get(`http://localhost:3000/user?email=${user.email}`)
        .then((res) => {
          setDbUser(res.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          setLoading(false);
        });
    }
  }, [user]);

  return { dbUser, loading };
};

export default useDatabaseUser;

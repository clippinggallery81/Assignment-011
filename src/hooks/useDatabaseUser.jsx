import { useEffect, useState, useRef } from "react";
import axios from "axios";
import useAuth from "./useAuth";

const useDatabaseUser = () => {
  const { user } = useAuth();
  const [dbUser, setDbUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const mountedRef = useRef(true);

  const fetchDbUser = () => {
    if (!user?.email) return;
    setLoading(true);
    axios
      .get(`http://localhost:3000/user/${user.email}`)
      .then((res) => {
        if (mountedRef.current) {
          setDbUser(res.data);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        if (mountedRef.current) {
          setLoading(false);
        }
      });
  };

  useEffect(() => {
    mountedRef.current = true;

    if (!user?.email) {
      // nothing to do
      Promise.resolve().then(() => {
        if (mountedRef.current) {
          setDbUser(null);
          setLoading(false);
        }
      });
      return;
    }

    fetchDbUser();

    const onDbUserUpdated = () => {
      fetchDbUser();
    };

    window.addEventListener("dbUserUpdated", onDbUserUpdated);

    return () => {
      mountedRef.current = false;
      window.removeEventListener("dbUserUpdated", onDbUserUpdated);
    };
  }, [user?.email]);

  return { dbUser, loading };
};

export default useDatabaseUser;

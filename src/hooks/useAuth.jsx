import { useContext } from "react";
import { AuthContext } from "../context/authContext/AuthContext";

const useAuth = () => {
  return useContext(AuthContext);
};

export default useAuth;

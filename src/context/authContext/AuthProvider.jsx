import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth } from "../../firebase/firebase.init";
import { AuthContext } from "./AuthContext";
import { syncUserToBackend } from "../../services/userService";
import axios from "axios";

const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    if (storedToken) {
      axios.defaults.headers.common.Authorization = `Bearer ${storedToken}`;
    }
  }, []);

  const registerUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const loginUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signInWithGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  const logOutUser = () => {
    setLoading(true);
    localStorage.removeItem("accessToken");
    delete axios.defaults.headers.common.Authorization;
    return signOut(auth);
  };

  const updateUserProfile = (profile) => {
    return updateProfile(auth.currentUser, profile);
  };

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        console.log("🔐 User logged in:", currentUser.email);
        const skipSync = sessionStorage.getItem("skipSyncUser") === "1";
        if (skipSync) {
          sessionStorage.removeItem("skipSyncUser");
        } else {
          // Sync user to backend database
          await syncUserToBackend(currentUser);
        }

        try {
          const tokenRes = await axios.post("http://localhost:3000/jwt", {
            email: currentUser.email,
          });
          if (tokenRes.data?.token) {
            localStorage.setItem("accessToken", tokenRes.data.token);
            axios.defaults.headers.common.Authorization = `Bearer ${tokenRes.data.token}`;
          }
        } catch (error) {
          console.error("JWT fetch error:", error.message);
        }
      }
      setUser(currentUser);
      setLoading(false);
    });

    return () => unSubscribe();
  }, []);

  const authInfo = {
    user,
    loading,
    registerUser,
    loginUser,
    signInWithGoogle,
    logOutUser,
    updateUserProfile,
  };
  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;

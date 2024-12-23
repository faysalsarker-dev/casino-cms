/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import {
  getAuth,

  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,

} from "firebase/auth";

import useAxios from "../hooks/useAxios/useAxios";
import useAxiosSecure from "../hooks/useAxiosSecure/useAxiosSecure";
import app from "../config/firebase.config";
import { ContextData } from "./../utility/ContextData";
import toast from "react-hot-toast";

const auth = getAuth(app);

const AuthContext = ({ children }) => {
  const axiosCommon = useAxios();
  const axiosSecure = useAxiosSecure();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkLogin = async (email) => {
    try {
      const response = await axiosCommon.get(`/users/checkAdmin/${email}`);
      const isAdmins = response.data; 
  
      return isAdmins; 
    } catch (error) {
      console.error("Error checking admin login:", error.message);
      throw new Error("Failed to check admin login");
    }
  };
  

  // Sign user in with email and password
  const signIn = async (email, password) => {
    setLoading(true);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential;
  };



  // Log out
  const logOut = () => {
    setLoading(true);
    return signOut(auth);
  };




 


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const loggedEmail = { email: currentUser.email };
        axiosSecure.post("/jwt", loggedEmail).then((res) => {
          console.log("token response", res.data);
        });

        setLoading(false);
      } else {
        setLoading(false);
        setUser(null);
        axiosSecure.post("/logout").then((res) => {
          console.log(res.data);
        });
      }
    });
    return () => {
      unsubscribe();
    };
  }, [user, axiosSecure]);

  const contextData = {
  
    signIn,
    user,
    logOut,
    loading,
    setLoading,
    setUser,
    checkLogin
 
  };

  return (
    <ContextData.Provider value={contextData}>
      {children}
    </ContextData.Provider>
  );
};

export default AuthContext;

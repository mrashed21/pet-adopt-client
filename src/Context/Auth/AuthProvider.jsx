/* eslint-disable react/prop-types */
import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    onAuthStateChanged,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    updateProfile,
  } from "firebase/auth";
  
  import axios from "axios";
  import { createContext, useEffect, useState } from "react";
  import { toast } from "react-toastify";
import { auth } from "../../Firebase/firebase.config";
//   import { auth } from "../firebase/firebase.config";
  
  // eslint-disable-next-line react-refresh/only-export-components
  export const AuthContext = createContext();
  
  const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    // Register with Email
    const handleRegister = (email, password) => {
      const result = createUserWithEmailAndPassword(auth, email, password);
      axios.post("https://server-seven-beta-45.vercel.app/users/add", {
        email: result?.user?.email,
        name: result?.user?.name,
        photoURL: result?.user?.photoURL,
      });
      return result;
    };
  
    const handleLogin = (email, password) => {
      return signInWithEmailAndPassword(auth, email, password);
    };
    //   Update Profile
    const handleName = (name, profile) => {
      return updateProfile(auth.currentUser, {
        displayName: name,
        photoURL: profile,
      });
    };
    //   Google Login
    const googleProvider = new GoogleAuthProvider();
  
    const handleLoginGoogle = () => {
      return signInWithPopup(auth, googleProvider)
        .then((result) => {
          const user = result.user;
          axios
            .post("https://server-seven-beta-45.vercel.app/users/add", {
              email: user?.email,
              name: user?.displayName,
              photoURL: user?.photoURL,
            })
            .then(() => {
              // console.log("User info sent to database");
            })
            .catch((error) => {
              console.error("Error saving user info:", error);
            });
          return user;
        })
        .catch((error) => {
          console.error("Google login failed:", error);
          throw error;
        });
    };
  
    //   Reset Password
    const handleReseTPassword = (email) => {
      return sendPasswordResetEmail(auth, email);
    };
    // Logout
    const logOut = () => {
      return signOut(auth).then(() => {
        toast.success("Logout Successfully");
      });
    };
  
    const authInfo = {
      handleRegister,
      handleLogin,
      handleLoginGoogle,
      handleName,
      logOut,
      user,
      setUser,
      loading,
      setLoading,
      handleReseTPassword,
    };
    // Unsubcribe
    useEffect(() => {
      const unSubcribe = onAuthStateChanged(auth, (currentUser) => {
        setLoading(false);
        setUser(currentUser);
        if (currentUser?.email) {
          axios.post(
            "https://server-seven-beta-45.vercel.app/jwt",
            { email: currentUser?.email },
            { withCredentials: true }
          );
        } else {
          axios.post(
            "https://server-seven-beta-45.vercel.app/logout",
            {},
            {
              withCredentials: true,
            }
          );
        }
      });
      return () => {
        unSubcribe();
      };
    }, []);
    if (loading) {
      return (
        <div className="flex justify-center items-center h-screen">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      );
    }
    return (
      <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
    );
  };
  
  export default AuthProvider;
  
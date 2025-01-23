/* eslint-disable react/prop-types */

import {
  createUserWithEmailAndPassword,
  GithubAuthProvider,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { auth } from "../../Firebase/firebase.config";

// import useAxiosSecure from "../../Hooks/UseAxiosSecure/useAxiosSecure";
import useAxiosPublic from "../../Hooks/PublikAxios/PublicAxios";
import { saveUser } from "../../utilites/utilite";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);
  const axiosSecure = useAxiosPublic();
  const handleRegister = async (email, password, name, photoURL) => {
    setLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(result.user, {
        displayName: name,
        photoURL: photoURL || "",
      });
      const updatedUser = auth.currentUser;
      await axiosSecure.post("/users/add", {
        email: updatedUser.email,
        name: name,
        photoURL: photoURL || "",
        role: "user",
      });
      setUser({
        ...updatedUser,
        displayName: name,
        photoURL: photoURL || "",
      });

      toast.success("Registration successful!");
      return result;
    } catch (error) {
      toast.error(error.message || "Registration failed.");
      throw error;
    } finally {
      setLoading(false);
    }
  };
  const handleLogin = async (email, password) => {
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      toast.success("Login successful!");
      return result;
    } catch (error) {
      toast.error(error.message || "Login failed.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Google Login
  const googleProvider = new GoogleAuthProvider();
  const handleLoginGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      toast.success("Google login successful!");
      return result;
    } catch (error) {
      toast.error(error.message || "Google login failed.");
      throw error;
    } finally {
      setLoading(false);
    }
  };
  // Github Login
  const githubProvider = new GithubAuthProvider();

  const handleLoginGithub = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, githubProvider);
      const user = result.user;
      // Save user to database
      await axiosSecure.post("/users/add", {
        email: user.email || "No Email Provided",
        name: user.displayName || "Anonymous",
        photoURL: user.photoURL || "",
        role: "user",
      });

      toast.success("GitHub login successful!");
      return result;
    } catch (error) {
      console.error("GitHub Login Error:", error);
      toast.error(error.message || "GitHub login failed.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Reset Password
  const handleReseTPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent!");
    } catch (error) {
      toast.error(error.message || "Failed to send password reset email.");
    }
  };

  // Logout
  const logOut = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      toast.success("Logout successful!");
      setUser(null);
    } catch (error) {
      toast.error("Failed to logout.");
    } finally {
      setLoading(false);
    }
  };
  const logout = async () => {
    return signOut(auth);
  };

  // Update Profile
  const updateUserProfile = async (name, photoURL) => {
    try {
      await updateProfile(auth.currentUser, { displayName: name, photoURL });
      setUser({ ...auth.currentUser, displayName: name, photoURL });
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to update profile.");
      throw error;
    }
  };

  // onAuthStateChange
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser?.displayName) {
        setUser(currentUser);

        setLoading(false);

        // Get JWT token
        const result = await axiosSecure.post("/jwt", {
          email: currentUser?.email,
        });
        localStorage.setItem("token", result.data.token);
        // save user information in the database if he is new
        const userRole = await saveUser(currentUser);
        setRole(userRole);
      } else {
        setUser(currentUser);
        localStorage.removeItem("token");
        setLoading(false);
      }
    });
    return () => {
      return unsubscribe();
    };
  }, [axiosSecure]);

  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
  //     // Set user immediately without waiting for additional checks
  //     setUser(currentUser);

  //     // If user exists, proceed with additional operations
  //     if (currentUser) {
  //       try {
  //         // Get JWT token
  //         const result = await axiosSecure.post("/jwt", {
  //           email: currentUser?.email,
  //         });
  //         localStorage.setItem("token", result.data.token);

  //         // save user information in the database if he is new
  //         const userRole = await saveUser(currentUser);
  //         setRole(userRole);
  //       } catch (error) {
  //         console.error("Error processing user login:", error);
  //       } finally {
  //         setLoading(false);
  //       }
  //     } else {
  //       localStorage.removeItem("token");
  //       setLoading(false);
  //     }
  //   });
  //   return () => unsubscribe();
  // }, [axiosSecure]);
  const authInfo = {
    handleRegister,
    handleLogin,
    handleLoginGoogle,
    handleName: updateProfile,
    handleReseTPassword,
    logOut,
    user,
    setUser,
    loading,
    setLoading,
    updateUserProfile,
    handleLoginGithub,
    role,
    logout,
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

// /* eslint-disable react/prop-types */

// import {
//   createUserWithEmailAndPassword,
//   GoogleAuthProvider,
//   onAuthStateChanged,
//   sendPasswordResetEmail,
//   signInWithEmailAndPassword,
//   signInWithPopup,
//   signOut,
//   updateProfile,
// } from "firebase/auth";
// import { createContext, useEffect, useState } from "react";
// import { toast } from "react-toastify";
// import { auth } from "../../Firebase/firebase.config";
// import useAxiosSecure from "../../Hooks/UseAxiosSecure/useAxiosSecure";

// // eslint-disable-next-line react-refresh/only-export-components
// export const AuthContext = createContext();

// const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   // Register with Email
//   const handleRegister = (email, password) => {
//     const result = createUserWithEmailAndPassword(auth, email, password);
//     useAxiosSecure.post("users/add", {
//       email: result?.user?.email,
//       name: result?.user?.name,
//       photoURL: result?.user?.photoURL,
//     });
//     return result;
//   };

//   const handleLogin = (email, password) => {
//     return signInWithEmailAndPassword(auth, email, password);
//   };
//   //   Update Profile
//   const handleName = (name, profile) => {
//     return updateProfile(auth.currentUser, {
//       displayName: name,
//       photoURL: profile,
//     });
//   };
//   //   Google Login
//   const googleProvider = new GoogleAuthProvider();

//   const handleLoginGoogle = () => {
//     return signInWithPopup(auth, googleProvider)
//       .then((result) => {
//         const user = result.user;
//         useAxiosSecure
//           .post("/users/add", {
//             email: user?.email,
//             name: user?.displayName,
//             photoURL: user?.photoURL,
//           })
//           .then(() => {
//             // console.log("User info sent to database");
//           })
//           .catch((error) => {
//             console.error("Error saving user info:", error);
//           });
//         return user;
//       })
//       .catch((error) => {
//         console.error("Google login failed:", error);
//         throw error;
//       });
//   };

//   //   Reset Password
//   const handleReseTPassword = (email) => {
//     return sendPasswordResetEmail(auth, email);
//   };
//   // Logout
//   const logOut = () => {
//     return signOut(auth).then(() => {
//       toast.success("Logout Successfully");
//     });
//   };

//   const authInfo = {
//     handleRegister,
//     handleLogin,
//     handleLoginGoogle,
//     handleName,
//     logOut,
//     user,
//     setUser,
//     loading,
//     setLoading,
//     handleReseTPassword,
//   };
//   // Unsubcribe
//   useEffect(() => {
//     const unSubcribe = onAuthStateChanged(auth, (currentUser) => {
//       setLoading(false);
//       setUser(currentUser);
//       if (currentUser?.email) {
//         useAxiosSecure.post(
//           `/jwt`,
//           { email: currentUser?.email },
//           { withCredentials: true }
//         );
//       } else {
//         useAxiosSecure.post(
//           "/logout",
//           {},
//           {
//             withCredentials: true,
//           }
//         );
//       }
//     });
//     return () => {
//       unSubcribe();
//     };
//   }, []);
//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <span className="loading loading-spinner loading-lg"></span>
//       </div>
//     );
//   }
//   return (
//     <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
//   );
// };

// export default AuthProvider;

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
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { auth } from "../../Firebase/firebase.config";
import useAxiosSecure from "../../Hooks/UseAxiosSecure/useAxiosSecure";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const axiosSecure = useAxiosSecure();

  // Register with Email
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

      // Save user to database
      // await axiosSecure.post("/users/add", {
      //   email: result.user.email,
      //   name: name,
      //   photoURL: photoURL || "",
      //   role: "user",
      // });

      toast.success("Registration successful!");
      setLoading(false);
      return result;
    } catch (error) {
      setLoading(false);
      toast.error(error.message || "Registration failed.");
      throw error;
    }
  };

  // Login with Email
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
      // const user = result.user;

      // Save user to database
      // await axiosSecure.post("/users/add", {
      //   email: user.email,
      //   name: user.displayName,
      //   photoURL: user.photoURL,
      //   role: "user",
      // });

      toast.success("Google login successful!");
      return result;
    } catch (error) {
      toast.error(error.message || "Google login failed.");
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
  const UpdateProfile = async (name, photoURL) => {
    try {
      await updateProfile(auth.currentUser, {
        displayName: name,
        photoURL,
      });
      toast.success("Profile updated successfully!");

      // Update local user state
      setUser({
        ...auth.currentUser,
        displayName: name,
        photoURL,
      });
    } catch (error) {
      toast.error("Failed to update profile.");
      throw error;
    }
  };

  // Monitor Auth State
  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(false);
      setUser(currentUser);

      if (currentUser?.email) {
        // Save user info to the database on login
        try {
          await axiosSecure.post("/users/add", {
            email: currentUser.email,
            name: currentUser.displayName || "Anonymous",
            photoURL: currentUser.photoURL || "",
            role: "user",
          });
        } catch (error) {
          console.error("Error saving user info to the database:", error);
        }
      }
    });

    return () => {
      unSubscribe();
    };
  }, [axiosSecure]);

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
    UpdateProfile,
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

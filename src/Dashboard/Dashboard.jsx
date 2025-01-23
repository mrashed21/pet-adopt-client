// import { Avatar, Button, Typography } from "@material-tailwind/react";
// import { useContext } from "react";
// import {
//   FaDonate,
//   FaHandsHelping,
//   FaHome,
//   FaList,
//   FaPlusCircle,
//   FaUser,
// } from "react-icons/fa";
// import { NavLink, Outlet, useNavigate } from "react-router-dom";
// import { AuthContext } from "../Context/Auth/AuthProvider";
// import Admin from "../Page/Admin/Admin";

// const Dashboard = () => {
//   const { user, logOut, role } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const handleLogout = async () => {
//     try {
//       await logOut();
//       navigate("/login"); // Redirect to login after logout
//     } catch (error) {
//       console.error("Error logging out:", error);
//     }
//   };

//   return (
//     <div className=" bg-gray-50 flex flex-col">
//       {/* Header Navbar */}
//       <header className="bg-[#E0E0E0] dark:bg-[#06071D] shadow-md px-6 py-4 flex justify-between items-center">
//         <Typography variant="h4" className="dark:text-gray-300 font-bold">
//           Dashboard
//         </Typography>
//         <div className="flex items-center gap-4">
//           <Avatar
//             src={user?.photoURL}
//             alt="User Avatar"
//             size="sm"
//             className="border-2 border-blue-500"
//           />

//           <Button color="blue" size="sm" onClick={handleLogout}>
//             Logout
//           </Button>
//         </div>
//       </header>

//       {/* Main Content */}
//       <section className="flex flex-col lg:flex-row w-full  mt-4">
//         {/* Sidebar make it fixed and scroll  */}
//         <aside className="w-full lg:w-3/12 bg-gray-300 shadow-lg rounded-lg p-4  ">
//           <div className="flex flex-col gap-2">
//             <NavLink
//               to="/"
//               className={({ isActive }) =>
//                 `flex items-center gap-3 p-3 rounded-lg transition-colors ${
//                   isActive
//                     ? "bg-blue-500 text-white"
//                     : "hover:bg-blue-100 text-gray-700"
//                 }`
//               }
//             >
//               <FaHome size={20} />
//               Home
//             </NavLink>
//             <NavLink
//               to="profile"
//               className={({ isActive }) =>
//                 `flex items-center gap-3 p-3 rounded-lg transition-colors ${
//                   isActive
//                     ? "bg-blue-500 text-white"
//                     : "hover:bg-blue-100 text-gray-700"
//                 }`
//               }
//             >
//               <FaUser size={20} />
//               Profile
//             </NavLink>
//             <NavLink
//               to="add-pet"
//               className={({ isActive }) =>
//                 `flex items-center gap-3 p-3 rounded-lg transition-colors ${
//                   isActive
//                     ? "bg-blue-500 text-white"
//                     : "hover:bg-blue-100 text-gray-700"
//                 }`
//               }
//             >
//               <FaPlusCircle size={20} />
//               Add a Pet
//             </NavLink>
//             <NavLink
//               to="my-added"
//               className={({ isActive }) =>
//                 `flex items-center gap-3 p-3 rounded-lg transition-colors ${
//                   isActive
//                     ? "bg-blue-500 text-white"
//                     : "hover:bg-blue-100 text-gray-700"
//                 }`
//               }
//             >
//               <FaList size={20} />
//               My Added Pets
//             </NavLink>
//             <NavLink
//               to="adopt-request"
//               className={({ isActive }) =>
//                 `flex items-center gap-3 p-3 rounded-lg transition-colors ${
//                   isActive
//                     ? "bg-blue-500 text-white"
//                     : "hover:bg-blue-100 text-gray-700"
//                 }`
//               }
//             >
//               <FaHandsHelping size={20} />
//               Adoption Request
//             </NavLink>
//             <NavLink
//               to="add-donation"
//               className={({ isActive }) =>
//                 `flex items-center gap-3 p-3 rounded-lg transition-colors ${
//                   isActive
//                     ? "bg-blue-500 text-white"
//                     : "hover:bg-blue-100 text-gray-700"
//                 }`
//               }
//             >
//               <FaDonate size={20} />
//               Create Donation Campaign
//             </NavLink>
//             <NavLink
//               to="my-compain"
//               className={({ isActive }) =>
//                 `flex items-center gap-3 p-3 rounded-lg transition-colors ${
//                   isActive
//                     ? "bg-blue-500 text-white"
//                     : "hover:bg-blue-100 text-gray-700"
//                 }`
//               }
//             >
//               <FaList size={20} />
//               My Donation Campaigns
//             </NavLink>
//             <NavLink
//               to="my-donation"
//               className={({ isActive }) =>
//                 `flex items-center gap-3 p-3 rounded-lg transition-colors ${
//                   isActive
//                     ? "bg-blue-500 text-white"
//                     : "hover:bg-blue-100 text-gray-700"
//                 }`
//               }
//             >
//               <FaHandsHelping size={20} />
//               My Donations
//             </NavLink>
//           </div>
//           {role === "admin" && (
//             <>
//               <Admin />
//             </>
//           )}
//         </aside>

//         {/* Main Dashboard Content */}
//         <main className="w-full lg:w-9/12 mx-auto bg-white shadow-lg rounded-lg ml-4">
//           <Outlet />
//         </main>
//       </section>
//     </div>
//   );
// };

// export default Dashboard;
import { Avatar, Button, Typography } from "@material-tailwind/react";
import React, { useContext, useState } from "react";
import {
  FaBars,
  FaDonate,
  FaHandsHelping,
  FaHome,
  FaList,
  FaPlusCircle,
  FaTimes,
  FaUser,
} from "react-icons/fa";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/Auth/AuthProvider";
import Admin from "../Page/Admin/Admin";

const Dashboard = () => {
  const { user, logOut, role } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  const NavItems = () => (
    <div className="flex flex-col gap-2 h-full overflow-y-auto">
      <NavLink
        to="/"
        onClick={handleNavLinkClick}
        className={({ isActive }) =>
          `flex items-center gap-3 p-3 rounded-lg transition-colors ${
            isActive
              ? "bg-blue-500 text-white"
              : "hover:bg-blue-100 text-gray-700"
          }`
        }
      >
        <FaHome size={20} />
        Home
      </NavLink>
      <NavLink
        to="profile"
        onClick={handleNavLinkClick}
        className={({ isActive }) =>
          `flex items-center gap-3 p-3 rounded-lg transition-colors ${
            isActive
              ? "bg-blue-500 text-white"
              : "hover:bg-blue-100 text-gray-700"
          }`
        }
      >
        <FaUser size={20} />
        Profile
      </NavLink>
      <NavLink
        to="add-pet"
        onClick={handleNavLinkClick}
        className={({ isActive }) =>
          `flex items-center gap-3 p-3 rounded-lg transition-colors ${
            isActive
              ? "bg-blue-500 text-white"
              : "hover:bg-blue-100 text-gray-700"
          }`
        }
      >
        <FaPlusCircle size={20} />
        Add a Pet
      </NavLink>
      <NavLink
        to="my-added"
        onClick={handleNavLinkClick}
        className={({ isActive }) =>
          `flex items-center gap-3 p-3 rounded-lg transition-colors ${
            isActive
              ? "bg-blue-500 text-white"
              : "hover:bg-blue-100 text-gray-700"
          }`
        }
      >
        <FaList size={20} />
        My Added Pets
      </NavLink>
      <NavLink
        to="adopt-request"
        onClick={handleNavLinkClick}
        className={({ isActive }) =>
          `flex items-center gap-3 p-3 rounded-lg transition-colors ${
            isActive
              ? "bg-blue-500 text-white"
              : "hover:bg-blue-100 text-gray-700"
          }`
        }
      >
        <FaHandsHelping size={20} />
        Adoption Request
      </NavLink>
      <NavLink
        to="add-donation"
        onClick={handleNavLinkClick}
        className={({ isActive }) =>
          `flex items-center gap-3 p-3 rounded-lg transition-colors ${
            isActive
              ? "bg-blue-500 text-white"
              : "hover:bg-blue-100 text-gray-700"
          }`
        }
      >
        <FaDonate size={20} />
        Create Donation Campaign
      </NavLink>
      <NavLink
        to="my-compain"
        onClick={handleNavLinkClick}
        className={({ isActive }) =>
          `flex items-center gap-3 p-3 rounded-lg transition-colors ${
            isActive
              ? "bg-blue-500 text-white"
              : "hover:bg-blue-100 text-gray-700"
          }`
        }
      >
        <FaList size={20} />
        My Donation Campaigns
      </NavLink>
      <NavLink
        to="my-donation"
        onClick={handleNavLinkClick}
        className={({ isActive }) =>
          `flex items-center gap-3 p-3 rounded-lg transition-colors ${
            isActive
              ? "bg-blue-500 text-white"
              : "hover:bg-blue-100 text-gray-700"
          }`
        }
      >
        <FaHandsHelping size={20} />
        My Donations
      </NavLink>
      {role === "admin" && <Admin onLinkClick={handleNavLinkClick} />}
    </div>
  );

  return (
    <div className="bg-gray-50 flex flex-col min-h-screen">
      {/* Fixed Header Navbar */}
      <header className="fixed top-0 left-0 right-0 bg-[#E0E0E0] dark:bg-[#06071D] shadow-md px-6 py-4 flex justify-between items-center z-50">
        <Typography variant="h4" className="dark:text-gray-300 font-bold">
          Dashboard
        </Typography>
        <div className="flex items-center gap-4">
          <Avatar
            src={user?.photoURL}
            alt="User Avatar"
            size="sm"
            className="border-2 border-blue-500"
          />
          <Button color="blue" size="sm" onClick={handleLogout}>
            Logout
          </Button>
          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden focus:outline-none text-white"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? <FaTimes size={24}  /> : <FaBars size={24} />}
          </button>
        </div>
      </header>

      {/* Main Content with Responsive Layout */}
      <section className="flex flex-col lg:flex-row w-full mt-20 h-[calc(100vh-5rem)]">
        {/* Sidebar for Desktop */}
        <aside className="hidden lg:block lg:w-3/12 bg-gray-300 shadow-lg rounded-lg p-4 h-full overflow-y-auto sticky top-20">
          <NavItems />
        </aside>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={toggleMobileMenu}
          >
            <div
              className="fixed top-16 left-0 right-0 bg-white shadow-lg p-4 rounded-b-lg max-h-[calc(100vh-4rem)] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <NavItems />
            </div>
          </div>
        )}

        {/* Main Dashboard Content */}
        <main className="w-full lg:w-9/12 mx-auto bg-white shadow-lg rounded-lg lg:ml-4 mt-4 lg:mt-0 h-full overflow-y-auto">
          <Outlet />
        </main>
      </section>
    </div>
  );
};

export default Dashboard;

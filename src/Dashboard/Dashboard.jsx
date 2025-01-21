import { Avatar, Button, Typography } from "@material-tailwind/react";
import { useContext } from "react";
import {
  FaDonate,
  FaHandsHelping,
  FaHome,
  FaList,
  FaPlusCircle,
  FaUser,
} from "react-icons/fa";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/Auth/AuthProvider";

const Dashboard = () => {
  const { user, logOut } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/login"); // Redirect to login after logout
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header Navbar */}
      <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
        <Typography variant="h4" className="text-blue-600 font-bold">
          Dashboard
        </Typography>
        <div className="flex items-center gap-4">
          <Avatar
            src={user?.photoURL || "https://via.placeholder.com/150"}
            alt="User Avatar"
            size="sm"
            className="border-2 border-blue-500"
          />
          <Typography variant="small" className="text-gray-700">
            {user?.displayName || "User"}
          </Typography>
          <Button color="red" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <section className="flex w-full  mt-4">
        {/* Sidebar */}
        <aside className="w-3/12 bg-white shadow-lg rounded-lg p-4">
          <div className="flex flex-col gap-2">
            <NavLink
              to="/"
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
          </div>
        </aside>

        {/* Main Dashboard Content */}
        <main className="w-9/12 mx-auto bg-white shadow-lg rounded-lg ml-4">
          <Outlet />
        </main>
      </section>
    </div>
  );
};

export default Dashboard;

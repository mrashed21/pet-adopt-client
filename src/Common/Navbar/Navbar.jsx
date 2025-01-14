import { Avatar, Switch } from "@material-tailwind/react";
import { useContext, useEffect, useState } from "react";
import { IoMdClose, IoMdMenu } from "react-icons/io";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../Context/Auth/AuthProvider";

const Navbar = () => {
  const { user, logOut } = useContext(AuthContext);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isDarkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  // Handle theme toggle
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  // Toggle handlers
  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  // Common styling for links
  const activeStyle = "text-red-500 font-medium";
  const normalStyle = "text-gray-900 dark:text-gray-200 hover:text-gray-700";

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/pet-listing", label: "Pet Listing" },
    { path: "/donation", label: "Donation Campaigns" },
  ];

  // Render navigation links
  const NavLinks = () =>
    navLinks.map((link) => (
      <NavLink
        key={link.path}
        to={link.path}
        className={({ isActive }) => (isActive ? activeStyle : normalStyle)}
      >
        {link.label}
      </NavLink>
    ));

  // Render dropdown for logged-in user
  const UserDropdown = () => (
    <div className="relative">
      <Avatar
        src={
          user.photoURL || "https://docs.material-tailwind.com/img/face-2.jpg"
        }
        alt="avatar"
        onClick={toggleDropdown}
        withBorder
        className="cursor-pointer"
      />
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#06071D] rounded-lg shadow-lg py-2 z-50">
          <NavLink to="/dashboard" className={`block px-4 py-2 ${normalStyle}`}>
            Dashboard
          </NavLink>
          <button
            onClick={logOut}
            className="block w-full text-left px-4 py-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );

  return (
    <nav className="bg-gray-300 dark:bg-[#06071D] shadow-lg py-2 border-b-2">
      <div className="px-4 w-11/12 mx-auto flex justify-between items-center py-1">
        {/* Logo */}
        <NavLink to="/" className="flex items-center space-x-2">
          <div className="h-10 w-10 rounded-full ">
            <img
              className="w-full h-full rounded-full"
              src="https://www.clipartmax.com/png/small/237-2376831_adopt-a-pet-pet-adoption.png"
              alt="Pet Adoption Logo"
            />
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-gray-200">
            PetAdopt
          </span>
        </NavLink>

        {/* Center Links */}
        <div className="hidden lg:flex space-x-8">
          <NavLinks />
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-4">
          {user?.email ? (
            <UserDropdown />
          ) : (
            <div className="hidden lg:flex space-x-4">
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive ? activeStyle : normalStyle
                }
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  isActive ? activeStyle : normalStyle
                }
              >
                Register
              </NavLink>
            </div>
          )}

          {/* Theme Switch */}
          <div className="hidden lg:block">
            <Switch
              checked={isDarkMode}
              onChange={() => setDarkMode(!isDarkMode)}
              color="blue"
            />
          </div>

          {/* Mobile Menu */}
          <div className="lg:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-900 dark:text-gray-200 text-3xl"
            >
              {isMenuOpen ? <IoMdClose /> : <IoMdMenu />}
            </button>
            {isMenuOpen && (
              <div className="absolute top-12 right-0 w-60 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-5 z-50">
                <div className="mb-4">
                  <Switch
                    checked={isDarkMode}
                    onChange={() => setDarkMode(!isDarkMode)}
                    color="blue"
                  />
                </div>
                <div className="flex flex-col space-y-4">
                  <NavLinks />
                  {user?.email ? (
                    <>
                      <NavLink
                        to="/dashboard"
                        className={`block ${normalStyle}`}
                      >
                        Dashboard
                      </NavLink>
                      <button
                        onClick={logOut}
                        className="text-red-500 hover:bg-red-100 dark:hover:bg-red-900 rounded-md p-2"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <NavLink
                        to="/login"
                        className={({ isActive }) =>
                          isActive ? activeStyle : normalStyle
                        }
                      >
                        Login
                      </NavLink>
                      <NavLink
                        to="/register"
                        className={({ isActive }) =>
                          isActive ? activeStyle : normalStyle
                        }
                      >
                        Register
                      </NavLink>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

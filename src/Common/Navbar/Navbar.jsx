import { Avatar, Button, Switch } from "@material-tailwind/react";
import { useEffect, useState } from "react";

import { IoMdClose, IoMdMenu } from "react-icons/io";
import { NavLink } from "react-router-dom";
// import { AuthContext } from "../../Context/Auth/AuthProvide";

const Navbar = () => {
  // const { user, logOut } = useContext(AuthContext);
  const user = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  // Handle theme toggle
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const handleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Active link style
  const activeStyle = "text-blue-500 font-medium";
  const normalStyle = "text-gray-900 dark:text-gray-200 hover:text-gray-700";

  return (
    <>
      <nav className="bg-white dark:bg-gray-900 shadow-lg py-2 ">
        <div className="px-4 lg:w-11/12 mx-auto flex justify-between items-center py-1">
          {/* Navbar start */}

          <NavLink className="w-10 text-3xl text-gray-900 dark:text-gray-200">
            <img
              className="w-full"
              src="https://www.clipartmax.com/png/small/237-2376831_adopt-a-pet-pet-adoption.png"
              alt=""
            />
          </NavLink>

          {/* Navbar center */}
          {user && user?.email ? (
            <div className="hidden lg:flex space-x-4">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? activeStyle : normalStyle
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/pet-listing"
                className={({ isActive }) =>
                  isActive ? activeStyle : normalStyle
                }
              >
                Pet Listing
              </NavLink>
              <NavLink
                to="/donation"
                className={({ isActive }) =>
                  isActive ? activeStyle : normalStyle
                }
              >
                Donation Campaigns
              </NavLink>
            </div>
          ) : (
            <div className="hidden lg:flex space-x-4">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? activeStyle : normalStyle
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/pet-listing"
                className={({ isActive }) =>
                  isActive ? activeStyle : normalStyle
                }
              >
                Pet Listing
              </NavLink>
              <NavLink
                to="/donation"
                className={({ isActive }) =>
                  isActive ? activeStyle : normalStyle
                }
              >
                Donation Campaigns
              </NavLink>
            </div>
          )}

          {/* Navbar end */}
          <div className="flex items-center space-x-4">
            {user && user?.email ? (
              <>
                <Avatar
                  src={
                    user?.photoURL ||
                    "https://docs.material-tailwind.com/img/face-2.jpg"
                  }
                  alt="avatar"
                  withBorder={true}
                  className="p-0.5"
                />
                <Button
                  color="blue"
                  className="hidden lg:block"
                  onClick={() => {
                    logOut();
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <div className="flex space-x-4 items-center">
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
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
                color="blue"
              />
            </div>

            {/*Dropdown Navbar  */}
            <div className="lg:hidden">
              <div className="relative flex items-center">
                <button
                  onClick={handleDropdown}
                  className="text-gray-900 dark:text-gray-200 text-3xl hover:text-gray-700"
                >
                  {isOpen ? <IoMdClose /> : <IoMdMenu />}
                </button>

                {isOpen && (
                  <div className="absolute top-10 -z-10 -right-4 w-96  flex flex-col items-center justify-center py-5 h-96 bg-white dark:bg-gray-800 rounded-l-lg shadow-md">
                    <Switch
                      checked={darkMode}
                      onChange={() => setDarkMode(!darkMode)}
                      color="blue"
                      className="mb-5"
                    />

                    {user && user?.email ? (
                      <div className=" flex flex-col items-center space-y-4 mt-5">
                        <NavLink
                          to="/"
                          className={({ isActive }) =>
                            isActive ? activeStyle : normalStyle
                          }
                        >
                          Home
                        </NavLink>
                        <NavLink
                          to="/pet-listing"
                          className={({ isActive }) =>
                            isActive ? activeStyle : normalStyle
                          }
                        >
                          Pet Listing
                        </NavLink>
                        <NavLink
                          to="/donation"
                          className={({ isActive }) =>
                            isActive ? activeStyle : normalStyle
                          }
                        >
                          Donation Campaigns
                        </NavLink>
                        <div className="mt-4">
                          <Button
                            color="blue"
                            onClick={() => {
                              logOut();
                            }}
                          >
                            Logout
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className=" flex flex-col items-center mt-5 space-y-4">
                        <NavLink
                          to="/"
                          className={({ isActive }) =>
                            isActive ? activeStyle : normalStyle
                          }
                        >
                          Home
                        </NavLink>
                        <NavLink
                          to="/pet-listing"
                          className={({ isActive }) =>
                            isActive ? activeStyle : normalStyle
                          }
                        >
                          Pet Listing
                        </NavLink>
                        <NavLink
                          to="/donation"
                          className={({ isActive }) =>
                            isActive ? activeStyle : normalStyle
                          }
                        >
                          Donation Campaigns
                        </NavLink>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;

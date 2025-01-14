import { createBrowserRouter } from "react-router-dom";
import Login from "../Components/Login/Login";
import Register from "../Components/Register/Register";
import AuthProvider from "../Context/Auth/AuthProvider";
import Dashboard from "../Dashboard/Dashboard";
import MainLayOut from "../Layout/MainLayOut";
import Home from "../Page/Home/Home/Home";
import PetListing from "../Page/PetListing/PetContainer/PetListing";
import AddPetForm from "../Page/AddPetFrom/AddPetFrom";

const Routes = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthProvider>
        <MainLayOut />
      </AuthProvider>
    ),
    errorElement: <h1>Error</h1>,
    children: [
      { path: "/", element: <Home /> },
      { path: "/pet-listing", element: <PetListing /> },
      { path: "/contact", element: <h2>Contact</h2> },

      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
    ],
  },
  { path: "/dashboard", element: <Dashboard />,
    children: [
      { path: "/dashboard", element: <h1>Dashboard</h1> },
      { path: "dashboard/add-pet", element: <AddPetForm/> },
    ],
   },
]);

export default Routes;

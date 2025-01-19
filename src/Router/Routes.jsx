import { createBrowserRouter } from "react-router-dom";
import Login from "../Components/Login/Login";
import Register from "../Components/Register/Register";
import AuthProvider from "../Context/Auth/AuthProvider";
import AdoptRequest from "../Dashboard/AdoptRequest/AdoptRequest";
import Dashboard from "../Dashboard/Dashboard";
import DashBoardHome from "../Dashboard/Home/DashBoardHome";
import MainLayOut from "../Layout/MainLayOut";
import AddPetForm from "../Page/AddPetFrom/AddPetFrom";
import AddDonation from "../Page/Donation/AddDonation/AddDonation";
import Home from "../Page/Home/Home/Home";
import MyAdded from "../Page/MyAdded/MyAdded";
import PetListing from "../Page/PetListing/PetContainer/PetListing";
import PetDetails from "../Page/PetListing/PetDetails/PetDetails";
import UpdatePet from "../Page/UpdatePet/UpdatePet";
import UserProfile from "../Page/UserProfile/UserProfile";
import PrivateRoute from "./PrivateRoute";
import DonationPage from "../Page/Donation/DonationPage/DonationPage";

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
      { path: "/pets/:id", element: <PetDetails /> },
      { path: "/donation", element: <DonationPage/> },

      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
    ],
  },
  {
    path: "dashboard",
    element: (
      <AuthProvider>
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      </AuthProvider>
    ),
    children: [
      { path: "dashboard", element: <DashBoardHome /> },
      { path: "profile", element: <UserProfile /> },
      { path: "add-pet", element: <AddPetForm /> },
      { path: "my-added", element: <MyAdded /> },
      { path: "add-donation", element: <AddDonation /> },
      { path: "adopt-request", element: <AdoptRequest /> },
      { path: "update-pet/:id", element: <UpdatePet /> },
    ],
  },
]);

export default Routes;

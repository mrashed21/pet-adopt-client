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
import DonationDetails from "../Page/Donation/DonationCard/DonationDetails/DonationDetails";
import DonationPage from "../Page/Donation/DonationPage/DonationPage";
import Home from "../Page/Home/Home/Home";
import MyAdded from "../Page/MyAdded/MyAdded";
import PetListing from "../Page/PetListing/PetContainer/PetListing";
import PetDetails from "../Page/PetListing/PetDetails/PetDetails";
import UpdatePet from "../Page/UpdatePet/UpdatePet";
import UserProfile from "../Page/UserProfile/UserProfile";
import PrivateRoute from "./PrivateRoute";

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
      {
        path: "/pets/:id",
        element: (
          <PrivateRoute>
            <PetDetails />
          </PrivateRoute>
        ),
      },
      { path: "/donation", element: <DonationPage /> },
      {
        path: "/donation/:id",
        element: (
          <PrivateRoute>
            <DonationDetails />
          </PrivateRoute>
        ),
      },

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
      {
        path: "dashboard",
        element: (
          <PrivateRoute>
            <DashBoardHome />
          </PrivateRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <PrivateRoute>
            <UserProfile />
          </PrivateRoute>
        ),
      },
      {
        path: "add-pet",
        element: (
          <PrivateRoute>
            <AddPetForm />
          </PrivateRoute>
        ),
      },
      {
        path: "my-added",
        element: (
          <PrivateRoute>
            <MyAdded />
          </PrivateRoute>
        ),
      },
      {
        path: "add-donation",
        element: (
          <PrivateRoute>
            <AddDonation />
          </PrivateRoute>
        ),
      },
      {
        path: "adopt-request",
        element: (
          <PrivateRoute>
            <AdoptRequest />
          </PrivateRoute>
        ),
      },
      {
        path: "update-pet/:id",
        element: (
          <PrivateRoute>
            <UpdatePet />
          </PrivateRoute>
        ),
      },
    ],
  },
]);

export default Routes;

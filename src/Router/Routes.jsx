import { createBrowserRouter } from "react-router-dom";
import Login from "../Components/Login/Login";
import Register from "../Components/Register/Register";
import AdoptRequest from "../Dashboard/AdoptRequest/AdoptRequest";
import Dashboard from "../Dashboard/Dashboard";
// import DashBoardHome from "../Dashboard/Home/DashBoardHome";
import { HelmetProvider } from "react-helmet-async";
import MainLayOut from "../Layout/MainLayOut";
import AddPetForm from "../Page/AddPetFrom/AddPetFrom";
import AdminDonation from "../Page/Admin/AdminDonation/AdminDonation";
import AllUser from "../Page/Admin/AllUser/AllUser";
import PetsTable from "../Page/Admin/PetsTable/PetsTable";
import AddDonation from "../Page/Donation/AddDonation/AddDonation";
import DonationDetails from "../Page/Donation/DonationCard/DonationDetails/DonationDetails";
import DonationPage from "../Page/Donation/DonationPage/DonationPage";
import MyCompain from "../Page/Donation/MyCompain/MyCompain";
import MyDonation from "../Page/Donation/MyDonation/MyDonation";
import UpdateDonation from "../Page/Donation/UpdateDonation/UpdateDonation";
import Home from "../Page/Home/Home/Home";
import MyAdded from "../Page/MyAdded/MyAdded";
import PetListing from "../Page/PetListing/PetContainer/PetListing";
import PetDetails from "../Page/PetListing/PetDetails/PetDetails";
import UpdatePet from "../Page/UpdatePet/UpdatePet";
import UserProfile from "../Page/UserProfile/UserProfile";
import PrivateRoute from "./PrivateRoute";
import Welcome from "../Dashboard/Welcome/Welcome";

const Routes = createBrowserRouter([
  {
    path: "/",
    element: <MainLayOut />,
    errorElement: <h1>Error</h1>,
    children: [
      { path: "/", element: <Home /> },
      { path: "/pet-listing", element: <PetListing /> },
      {
        path: "/pets/:id",
        element: <PetDetails />,
      },
      { path: "/donation", element: <DonationPage /> },
      {
        path: "/donations/:id",
        element: <DonationDetails />,
      },

      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <HelmetProvider>
          {" "}
          <Dashboard />
        </HelmetProvider>
      </PrivateRoute>
    ),
    children: [
      {path: "", element: <Welcome/>},
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
        path: "/dashboard/edit-donation/:id",
        element: (
          <PrivateRoute>
            <UpdateDonation />
          </PrivateRoute>
        ),
      },
      {
        path: "my-compain",
        element: (
          <PrivateRoute>
            <MyCompain />
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
      {
        path: "my-donation",
        element: (
          <PrivateRoute>
            <MyDonation />
          </PrivateRoute>
        ),
      },
      {
        path: "all-user",
        element: (
          <PrivateRoute>
            <AllUser />
          </PrivateRoute>
        ),
      },
      {
        path: "all-pet",
        element: (
          <PrivateRoute>
            <PetsTable />
          </PrivateRoute>
        ),
      },
      {
        path: "all-donation",
        element: (
          <PrivateRoute>
            <AdminDonation />
          </PrivateRoute>
        ),
      },
    ],
  },
]);

export default Routes;

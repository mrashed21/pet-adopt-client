import { createBrowserRouter } from "react-router-dom";
import Login from "../Components/Login/Login";
import Register from "../Components/Register/Register";
import AuthProvider from "../Context/Auth/AuthProvider";
import MainLayOut from "../Layout/MainLayOut";
import Home from "../Page/Home/Home/Home";

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
      { path: "/about", element: <h2>About</h2> },
      { path: "/contact", element: <h2>Contact</h2> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
    ],
  },
]);

export default Routes;

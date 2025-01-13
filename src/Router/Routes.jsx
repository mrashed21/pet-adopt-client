import { createBrowserRouter } from "react-router-dom";
import MainLayOut from "../Layout/MainLayOut";

const Routes = createBrowserRouter([
  {
    path: "/",
    element: <MainLayOut />,
    errorElement: <h1>Error</h1>,
  },
]);

export default Routes;



import { createBrowserRouter } from "react-router-dom";

const Routes = createBrowserRouter([
  {
    path: "/",
    element: <h1>main</h1>,
    errorElement: <h1>Error</h1>,
  },
]);

export default Routes;

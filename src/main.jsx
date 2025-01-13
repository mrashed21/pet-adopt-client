// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import "./index.css";

// createRoot(document.getElementById("root")).render(<StrictMode></StrictMode>);

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import Routes from "./Router/Routes";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={Routes}></RouterProvider>
  </StrictMode>
);

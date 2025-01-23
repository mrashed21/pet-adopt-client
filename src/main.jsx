// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import "./index.css";

// createRoot(document.getElementById("root")).render(<StrictMode></StrictMode>);

// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import { RouterProvider } from "react-router-dom";
// import "./index.css";
// import Routes from "./Router/Routes";

// createRoot(document.getElementById("root")).render(
//   <StrictMode>
//     <RouterProvider router={Routes}></RouterProvider>
//   </StrictMode>
// );

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import AuthProvider from "./Context/Auth/AuthProvider";
import "./index.css";
import Routes from "./Router/Routes";

// Create a QueryClient instance
const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      {" "}
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={Routes} />
      </QueryClientProvider>
    </AuthProvider>
  </StrictMode>
);

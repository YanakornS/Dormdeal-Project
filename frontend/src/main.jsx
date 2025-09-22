import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import router from "./routers/Router";
import { RouterProvider } from "react-router";
import AuthProvider from "./context/AuthContext";
import { CookiesProvider } from "react-cookie";
import SuspenseContent from "./loading/SuspenseContent";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Suspense fallback={<SuspenseContent />}>
    <CookiesProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </CookiesProvider>
    </Suspense>
  </StrictMode>
);

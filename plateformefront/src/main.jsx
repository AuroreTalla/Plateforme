import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from "react-router-dom";

import { AuthProvider } from "./Pages/Inscription/AuthProvider.jsx";
import router from './Routes/AppRoutes.jsx';

if (typeof global === "undefined") {
  window.global = window;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);

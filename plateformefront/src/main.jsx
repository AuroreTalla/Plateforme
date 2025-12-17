import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from "react-router-dom";


import { AuthProvider } from "./Composants/Authentification/AuthProvider.jsx";
import router from './Routes/AppRoutes.jsx';

import './index.css' 


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

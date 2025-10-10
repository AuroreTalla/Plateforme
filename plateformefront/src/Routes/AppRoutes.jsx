import { createBrowserRouter } from 'react-router-dom';
import { ProtectedRoute } from "./ProtectedRoute.jsx";
import { Navigate } from "react-router-dom";

// Pages
import PageAcceuil from '../Pages/Acceuil/PageAcceuil.jsx';
import Apropos from '../Composants/NavBar/Apropos.jsx';
import Inscription from '../Pages/Inscription/Inscription.jsx';
import ActivationCode from '../Pages/Inscription/ActivationCode.jsx';
import Dashboard from '../Pages/Dashboard/Dashboard.jsx';
import Math from '../Pages/Matiere/Math/Math.jsx';
import Chim from '../Pages/Matiere/Chim/Chim.jsx';
import Phys from '../Pages/Matiere/Phys/Phys.jsx';
import CoursM from '../Pages/Matiere/Math/CoursM.jsx';
import ExoM from '../Pages/Matiere/Math/ExoM.jsx';
import CoursP from '../Pages/Matiere/Phys/CoursP.jsx';
import ExoP from '../Pages/Matiere/Phys/ExoP.jsx';
import CoursC from '../Pages/Matiere/Chim/CoursC.jsx';
import ExoC from '../Pages/Matiere/Chim/ExoC.jsx';
import Forum from '../Pages/Forum/Forum.jsx';



// 🔹 Router
const router = createBrowserRouter([

  { path: "*", element: <Navigate to="/" replace /> },

  { path: "/", element: <PageAcceuil /> },
  { path: "apropos", element: <Apropos /> },
  { path: "inscription", element: <Inscription /> },
  { path: "activationcode", element: <ActivationCode /> },
  {
    path: "dashboard",
    element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
    children: [
      { path: "forum", element: <Forum /> },
      { path: "math", element: <Math />, children: [
        { path: "coursM", element: <CoursM /> },
        { path: "exoM", element: <ExoM /> },
      ]},
      { path: "phys", element: <Phys />, children: [
        { path: "coursP", element: <CoursP /> },
        { path: "exoP", element: <ExoP /> },
      ]},
      { path: "chim", element: <Chim />, children: [
        { path: "coursC", element: <CoursC /> },
        { path: "exoC", element: <ExoC /> },
      ]},
    ],
  },
]);

export default router;

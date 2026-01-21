import { createBrowserRouter, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";

// Layouts
import Layout from "../Composants/Layout/GlobalLayout";
import DashboardLayout from "../Composants/Layout/DashboardLayout";

// Public pages
import PageAcceuil from "../Pages/Acceuil/PageAcceuil";
import Apropos from "../Composants/NavBar/Apropos";
import Inscription from "../Pages/Inscription/Inscription";
import ActivationCode from "../Pages/Inscription/ActivationCode";
import Connexion from "../Pages/Connexion/Connexion";

// Dashboard pages
import Dashboard from "../Pages/Dashboard/Dashboard";
import Forum from "../Pages/Forum/Forum";
import InfoProf from "../Pages/Admin/InfoProf";
import Math from "../Pages/Matiere/Math/Math";
import Phys from "../Pages/Matiere/Phys/Phys";
import Chim from "../Pages/Matiere/Chim/Chim";
import CoursM from "../Pages/Matiere/Math/CoursM";
import ExoM from "../Pages/Matiere/Math/ExoM";
import CoursP from "../Pages/Matiere/Phys/CoursP";
import ExoP from "../Pages/Matiere/Phys/ExoP";
import CoursC from "../Pages/Matiere/Chim/CoursC";
import ExoC from "../Pages/Matiere/Chim/ExoC";

// Pages Communes
import Parametre from "../Pages/Parametre/Parametre";
import Feedback from "../Pages/Feedback/Feedback";

// Pages Professeur
import MesDemandes from "../Pages/Demandes/MesDemandes";

// Pages Admin
import UsersList from "../Pages/Admin/UsersList";
import ForumsAdmin from "../Pages/Admin/ForumsAdmin";
import { MatiereList, MatiereCreate } from "../Pages/Admin/Matiere/MatierePages";
import { DemandesProf, DemandesMatieres } from "../Pages/Admin/Demandes/DemandesAdmin";

const router = createBrowserRouter([



  // Public
  { path: "/inscription", element: <Inscription /> },
  { path: "/activationcode", element: <ActivationCode /> },
  { path: "/connexion", element: <Connexion /> },
  {
    element: <Layout />,
    children: [
      { path: "/", element: <PageAcceuil /> },
      { path: "/apropos", element: <Apropos /> },
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <Dashboard /> },

          { path: "forum/:sujet?", element: <Forum /> },
          { path: "infoprof", element: <InfoProf /> },

          {
            path: "math",
            element: <Math />,
            children: [
              { index: true, element: <CoursM /> },
              { path: "cours", element: <CoursM /> },
              { path: "exo", element: <ExoM /> },
            ],
          },

          {
            path: "phys",
            element: <Phys />,
            children: [
              { index: true, element: <CoursP /> },
              { path: "cours", element: <CoursP /> },
              { path: "exo", element: <ExoP /> },
            ],
          },

          // Routes Communes
          { path: "parametre", element: <Parametre /> },
          { path: "feedback", element: <Feedback /> },

          // Routes Professeur
          { path: "demandes", element: <MesDemandes /> },

          // Routes Admin
          { path: "users", element: <UsersList /> },
          { path: "forums", element: <ForumsAdmin /> },
          {
            path: "matieres",
            children: [
              { path: "list", element: <MatiereList /> },
              { path: "create", element: <MatiereCreate /> },
            ]
          },
          {
            path: "demandes",
            children: [
              { path: "prof", element: <DemandesProf /> },
              { path: "matieres", element: <DemandesMatieres /> },
            ]
          },

          {
            path: "chim",
            element: <Chim />,
            children: [
              { index: true, element: <CoursC /> },
              { path: "cours", element: <CoursC /> },
              { path: "exo", element: <ExoC /> },
            ],
          },
        ],
      },


    ]
  },
  { path: "*", element: <Navigate to="/" replace /> },
]);

export default router;

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
import MotDePasseOublie from "../Pages/Connexion/MotDePasseOublie";


// Dashboard pages
import Dashboard from "../Pages/Dashboard/Dashboard";
import Forum from "../Pages/Forum/Forum";
import InfoProf from "../Pages/Admin/InfoProf";

import MatierePage from "../Pages/Matiere/Matiere";

// Pages Communes
import Parametre from "../Pages/Parametre/Parametre";
import ReinitialiserMotDePasse from "../Pages/Parametre/ReinitialiserMotDePasse";
import Feedback from "../Pages/Feedback/Feedback";

// Pages Professeur
import MesDemandes from "../Pages/Demandes/MesDemandes";

// Pages Admin
import UsersList from "../Pages/Admin/UsersList";
import ForumsAdmin from "../Pages/Admin/ForumsAdmin";
import MatiereList from "../Pages/Admin/Matiere/MatiereList";
import MatiereCreate from "../Pages/Admin/Matiere/MatiereCreate";
import DemandesProf from "../Pages/Admin/Demandes/DemandesProf";
import DemandesMatieres from "../Pages/Admin/Demandes/DemandesMatieres";

const router = createBrowserRouter([



  // Public
  { path: "/inscription", element: <Inscription /> },
  { path: "/activationcode", element: <ActivationCode /> },
  { path: "/connexion", element: <Connexion /> },
  { path: "/mot-de-passe-oublie", element: <MotDePasseOublie /> },
  { path: "/reinitialiser-mot-de-passe", element: <ReinitialiserMotDePasse /> },
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
          { path: "matiere/:matiereId/cours", element: <MatierePage defaultTab="cours" /> },
          { path: "matiere/:matiereId/exercices", element: <MatierePage defaultTab="exercices" /> },

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
        ],
      },
    ]
  },
  { path: "*", element: <Navigate to="/" replace /> },
]);

export default router;

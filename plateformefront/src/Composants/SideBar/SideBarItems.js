import DashboardIcon from "@mui/icons-material/Dashboard";
import MenuBookIcon from '@mui/icons-material/MenuBook';
import DescriptionIcon from "@mui/icons-material/Description";
import ChatIcon from '@mui/icons-material/Chat';
import ForumIcon from '@mui/icons-material/Forum';
import CalculateIcon from "@mui/icons-material/Calculate";
import ScienceIcon from "@mui/icons-material/Science";
import BiotechIcon from "@mui/icons-material/Biotech";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AddIcon from "@mui/icons-material/Add";
import ListIcon from "@mui/icons-material/List";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import SettingsIcon from "@mui/icons-material/Settings";
import GroupsIcon from "@mui/icons-material/Groups";
import AssessmentIcon from "@mui/icons-material/Assessment";
import FeedbackIcon from '@mui/icons-material/Feedback';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import MoreIcon from '@mui/icons-material/More';


export const SideBarItems = {
  ELEVE: [
    {
      id: "dashboard",
      icon: DashboardIcon,
      text: "Dashboard",
      path: "/dashboard",
    },
    {
      id: "cours",
      icon: MenuBookIcon,
      text: "Cours",
      hasSubMenu: true,
      subItems: [],
    },
    {
      id: "exo",
      icon: DescriptionIcon,
      text: "Exercices",
      hasSubMenu: true,
      subItems: [],
    },
    {
      id: "forums",
      icon: ChatIcon,
      text: "Forums",
      hasSubMenu: true,
      subItems: [],
    },
    {
      id: "parametre",
      icon: SettingsIcon,
      text: "Paramètres",
      path: "/dashboard/parametre",
    },
    {
      id: "feedback",
      icon: ForumIcon,
      text: "Feedback",
      path: "/dashboard/feedback",
    },
  ],

  PROFESSEUR: [
    {
      id: "dashboard",
      icon: DashboardIcon,
      text: "Dashboard",
      path: "/dashboard",
    },
    {
      id: "cours",
      icon: MenuBookIcon,
      text: "Cours",
      hasSubMenu: true,
      subItems: [],
    },
    {
      id: "exo",
      icon: DescriptionIcon,
      text: "Exercices",
      hasSubMenu: true,
      subItems: [],
    },
    {
      id: "forums",
      icon: ChatIcon,
      text: "Forums",
      hasSubMenu: true,
      subItems: [],
    },
    {
      id: "demandes",
      icon: AddIcon,
      text: "Mes Demandes",
      path: "/dashboard/demandes",
    },
    {
      id: "parametre",
      icon: SettingsIcon,
      text: "Paramètres",
      path: "/dashboard/parametre",
    },
    {
      id: "feedback",
      icon: ForumIcon,
      text: "Feedback",
      path: "/dashboard/feedback",
    },
  ],

  ADMIN: [
    {
      id: "dashboard",
      icon: DashboardIcon,
      text: "Dashboard",
      path: "/dashboard",
    },
    {
      id: "cours",
      icon: MenuBookIcon,
      text: "Cours",
      hasSubMenu: true,
      subItems: [],
    },
    {
      id: "exo",
      icon: DescriptionIcon,
      text: "Exercices",
      hasSubMenu: true,
      subItems: [],
    },
    {
      id: "users",
      icon: AccountCircleIcon,
      text: "Utilisateurs",
      path: "/dashboard/users",
    },
    {
      id: "gestion-matieres",
      icon: MenuBookIcon,
      text: "Gestion Matières",
      hasSubMenu: true,
      subItems: [
        { id: "listMatieres", icon: ListIcon, text: "Liste des matières", path: "/dashboard/matieres/list" },
        { id: "addMatiere", icon: AddIcon, text: "Créer une matière", path: "/dashboard/matieres/create" },
      ],
    },
    {
      id: "tous-forums",
      icon: ChatIcon,
      text: "Forums",
      path: "/dashboard/forums"
    },
    {
      id: "demandes-prof",
      icon: VerifiedUserIcon,
      text: "Demandes",
      hasSubMenu: true,
      subItems: [
        { id: "demandesProf", icon: PersonAddIcon, text: "Demandes Professeurs", path: "/dashboard/demandes/prof" },
        { id: "demandesMatieres", icon: MoreIcon, text: "Demandes Matières", path: "/dashboard/demandes/matieres" },
      ],
    },
    {
      id: "parametre",
      icon: SettingsIcon,
      text: "Paramètres",
      path: "/dashboard/parametre",
    },
    {
      id: "feedback",
      icon: FeedbackIcon,
      text: "Feedback",
      path: "/dashboard/feedback",
    },
  ],
};

const matiereIcons = {
  "Mathématiques": CalculateIcon,
  "Physique": ScienceIcon,
  "Chimie": BiotechIcon,
};

export function buildCoursSubItems(matieres) {
  return matieres.map((m) => ({
    id: `cours-${m.id}`,
    icon: matiereIcons[m.nom] || CalculateIcon,
    text: m.nom,
    path: `/dashboard/matiere/${m.id}/cours`,
  }));
}

export function buildExercicesSubItems(matieres) {
  return matieres.map((m) => ({
    id: `exo-${m.id}`,
    icon: matiereIcons[m.nom] || CalculateIcon,
    text: m.nom,
    path: `/dashboard/matiere/${m.id}/exercices`,
  }));
}

export function buildForumSubItems(matieres) {
  return matieres.map((m) => ({
    id: `forum-${m.id}`,
    icon: matiereIcons[m.nom] || ChatIcon,
    text: m.nom,
    path: `/dashboard/forum/${m.groupeId}`,
  }));
}
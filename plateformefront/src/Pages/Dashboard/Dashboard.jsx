import { useEffect, useContext } from "react";
import { Box } from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../Inscription/AuthContext";
import Sidebar from "../../Composants/SideBar.jsx";

export default function Dashboard() {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    if (!currentUser) navigate("/", { replace: true });
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  return (
    <Box display="flex" className="h-screen">
      <Sidebar name={currentUser.name} email={currentUser.email} />
      <Box flex={1} p={3} className="bg-gray-50">
        <Outlet />
      </Box>
    </Box>
  );
}

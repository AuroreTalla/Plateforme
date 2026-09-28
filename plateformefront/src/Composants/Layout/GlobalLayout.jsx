import NavBar from "../NavBar/NavBar.jsx";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="h-screen flex flex-col">
      <NavBar />
      <div className="flex-1 min-h-0 pt-20">
        <Outlet />
      </div>
    </div>
  );
}
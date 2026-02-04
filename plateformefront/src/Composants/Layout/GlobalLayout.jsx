import NavBar from "../NavBar/NavBar.jsx";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="h-screen flex flex-col">
      <NavBar />
      <div className="flex-1 overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
}

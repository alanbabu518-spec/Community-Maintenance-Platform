import { Link, Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

function DashboardLayout() {
  return (
    <div>
      <header>
        <h2>Community Maintenance</h2>

        <nav>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/home">Home</Link>
        </nav>
      </header>

      <div>
        <Sidebar />

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;

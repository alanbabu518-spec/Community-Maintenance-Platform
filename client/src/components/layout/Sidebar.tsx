import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside>
      <h2>Menu</h2>

      <nav>
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/maintenance">Maintenance</NavLink>
        <NavLink to="/technicians">Technicians</NavLink>
        <NavLink to="/announcements">Announcements</NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;

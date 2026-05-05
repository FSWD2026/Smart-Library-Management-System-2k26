import { NavLink } from "react-router-dom";
import { FiGrid, FiBook, FiUsers, FiRefreshCw } from "react-icons/fi";

const links = [
  { to: "/admin/dashboard", icon: FiGrid, label: "Dashboard" },
  { to: "/admin/books", icon: FiBook, label: "Books" },
  { to: "/admin/users", icon: FiUsers, label: "Users" },
  { to: "/admin/borrows", icon: FiRefreshCw, label: "Borrows" },
];

const Sidebar = () => (
  <aside className="w-56 min-h-screen bg-gray-900 border-r border-gray-800 px-3 py-6 hidden md:block">
    <nav className="space-y-1">
      {links.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
              isActive
                ? "bg-indigo-600 text-white"
                : "text-gray-400 hover:bg-gray-800 hover:text-white"
            }`
          }
        >
          <Icon size={17} />
          {label}
        </NavLink>
      ))}
    </nav>
  </aside>
);

export default Sidebar;

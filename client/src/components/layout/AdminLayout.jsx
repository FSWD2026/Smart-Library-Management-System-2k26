import { NavLink, Outlet } from "react-router-dom";
import {
  FiGrid,
  FiBook,
  FiUsers,
  FiRefreshCw,
  FiAlertTriangle,
} from "react-icons/fi";

const links = [
  { to: "/admin/dashboard", icon: FiGrid, label: "Dashboard" },
  { to: "/admin/books", icon: FiBook, label: "Manage Books" },
  { to: "/admin/users", icon: FiUsers, label: "Manage Users" },
  { to: "/admin/borrows", icon: FiRefreshCw, label: "All Borrows" },
];

const AdminLayout = () => (
  <div className="flex min-h-[calc(100vh-64px)]">
    {/* Sidebar */}
    <aside className="hidden md:flex flex-col w-60 bg-gray-900 border-r border-gray-800 px-3 py-6 shrink-0">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-3">
        Admin Panel
      </p>
      <nav className="space-y-1">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
                isActive
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`
            }
          >
            <Icon size={17} /> {label}
          </NavLink>
        ))}
      </nav>
    </aside>

    {/* Mobile Admin Nav */}
    <div className="md:hidden w-full">
      <div className="flex overflow-x-auto gap-2 p-3 bg-gray-900 border-b border-gray-800">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-800 text-gray-400"
              }`
            }
          >
            <Icon size={14} /> {label}
          </NavLink>
        ))}
      </div>
      <div className="p-4">
        <Outlet />
      </div>
    </div>

    {/* Main content */}
    <main className="hidden md:block flex-1 p-8 overflow-auto">
      <Outlet />
    </main>
  </div>
);

export default AdminLayout;

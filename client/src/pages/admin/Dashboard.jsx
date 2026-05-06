import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../utils/axios";
import StatCard from "../../components/ui/StatCard";
import {
  FiUsers,
  FiBookOpen,
  FiRefreshCw,
  FiAlertCircle,
  FiDollarSign,
  FiActivity,
} from "react-icons/fi";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/admin/stats")
      .then((r) => setStats(r.data.stats))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const quickLinks = [
    {
      to: "/admin/books",
      label: "Manage Books",
      icon: FiBookOpen,
      color: "text-indigo-400",
    },
    {
      to: "/admin/users",
      label: "Manage Users",
      icon: FiUsers,
      color: "text-purple-400",
    },
    {
      to: "/admin/borrows",
      label: "View Borrows",
      icon: FiRefreshCw,
      color: "text-blue-400",
    },
    {
      to: "/admin/borrows?status=overdue",
      label: "Overdue Books",
      icon: FiAlertCircle,
      color: "text-red-400",
    },
  ];

  return (
    <div className="animate-slide-up">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-1">Library management overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
        <StatCard
          icon={FiUsers}
          label="Total Users"
          value={loading ? "..." : stats?.totalUsers}
          color="bg-blue-500/20 text-blue-400"
          sub="Registered members"
        />
        <StatCard
          icon={FiBookOpen}
          label="Total Books"
          value={loading ? "..." : stats?.totalBooks}
          color="bg-indigo-500/20 text-indigo-400"
          sub="In collection"
        />
        <StatCard
          icon={FiActivity}
          label="Total Borrows"
          value={loading ? "..." : stats?.totalBorrows}
          color="bg-purple-500/20 text-purple-400"
          sub="All time"
        />
        <StatCard
          icon={FiRefreshCw}
          label="Active Borrows"
          value={loading ? "..." : stats?.activeBorrows}
          color="bg-green-500/20 text-green-400"
          sub="Currently out"
        />
        <StatCard
          icon={FiAlertCircle}
          label="Overdue Books"
          value={loading ? "..." : stats?.overdueBorrows}
          color="bg-red-500/20 text-red-400"
          sub="Past due date"
        />
        <StatCard
          icon={FiDollarSign}
          label="Fines Collected"
          value={
            loading ? "..." : stats ? `₹${stats.totalFinesCollected}` : null
          }
          color="bg-yellow-500/20 text-yellow-400"
          sub="Total penalties"
        />
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickLinks.map(({ to, label, icon: Icon, color }) => (
            <Link
              key={to}
              to={to}
              className="card hover:border-indigo-500/30 transition-all hover:-translate-y-1 duration-200 flex items-center gap-3 p-4"
            >
              <Icon className={`text-xl ${color}`} />
              <span className="text-gray-300 text-sm font-medium">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

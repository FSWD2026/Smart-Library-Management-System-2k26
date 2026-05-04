import { useEffect, useState } from "react";
import API from "../../utils/axios";
import {
  FiUsers,
  FiBookOpen,
  FiRefreshCw,
  FiAlertCircle,
  FiDollarSign,
} from "react-icons/fi";

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="card hover:border-indigo-500/30 transition-all hover:-translate-y-1 duration-300">
    <div
      className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${color}`}
    >
      <Icon className="text-xl" />
    </div>
    <p className="text-gray-400 text-sm mb-1">{label}</p>
    <p className="text-3xl font-bold text-white">{value ?? "-"}</p>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    API.get("/admin/stats")
      .then((r) => setStats(r.data.stats))
      .catch(() => {});
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 animate-slide-up">
      <h1 className="text-3xl font-bold text-white mb-8">Admin Dashboard</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          icon={FiUsers}
          label="Total Users"
          value={stats?.totalUsers}
          color="bg-blue-500/20 text-blue-400"
        />
        <StatCard
          icon={FiBookOpen}
          label="Total Books"
          value={stats?.totalBooks}
          color="bg-indigo-500/20 text-indigo-400"
        />
        <StatCard
          icon={FiRefreshCw}
          label="Total Borrows"
          value={stats?.totalBorrows}
          color="bg-purple-500/20 text-purple-400"
        />
        <StatCard
          icon={FiBookOpen}
          label="Active Borrows"
          value={stats?.activeBorrows}
          color="bg-green-500/20 text-green-400"
        />
        <StatCard
          icon={FiAlertCircle}
          label="Overdue Books"
          value={stats?.overdueBorrows}
          color="bg-red-500/20 text-red-400"
        />
        <StatCard
          icon={FiDollarSign}
          label="Fines Collected"
          value={stats ? `₹${stats.totalFinesCollected}` : null}
          color="bg-yellow-500/20 text-yellow-400"
        />
      </div>
    </div>
  );
};

export default Dashboard;

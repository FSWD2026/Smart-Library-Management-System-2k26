const StatCard = ({ icon: Icon, label, value, color, sub }) => (
  <div className="card hover:border-indigo-500/30 transition-all duration-300 hover:-translate-y-1 group">
    <div
      className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${color}`}
    >
      <Icon className="text-xl" />
    </div>
    <p className="text-gray-400 text-sm mb-1">{label}</p>
    <p className="text-3xl font-bold text-white">{value ?? "—"}</p>
    {sub && <p className="text-gray-500 text-xs mt-1">{sub}</p>}
  </div>
);

export default StatCard;

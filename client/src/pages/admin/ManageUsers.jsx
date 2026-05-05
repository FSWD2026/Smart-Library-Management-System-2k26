import { useEffect, useState } from "react";
import API from "../../utils/axios";
import toast from "react-hot-toast";
import ConfirmModal from "../../components/ui/ConfirmModal";
import { FiShield, FiTrash2, FiSearch } from "react-icons/fi";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const loadUsers = async () => {
    try {
      const res = await API.get("/admin/users", {
        params: { search, limit: 50 },
      });
      setUsers(res.data.users);
    } catch {}
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const toggleRole = async (id) => {
    try {
      const res = await API.put(`/admin/users/${id}/role`);
      toast.success(res.data.message);
      loadUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    }
  };

  const handleDelete = async () => {
    try {
      await API.delete(`/admin/users/${deleteId}`);
      toast.success("User deleted");
      setDeleteId(null);
      loadUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-8">Manage Users</h1>

      <div className="relative mb-6">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          className="input pl-11"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && loadUsers()}
        />
      </div>

      <div className="card overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800">
              {["User", "Email", "Role", "Verified", "Actions"].map((h) => (
                <th
                  key={h}
                  className="text-left text-gray-400 font-medium px-6 py-4"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {users.map((u) => (
              <tr
                key={u._id}
                className="hover:bg-gray-800/50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-sm">
                      {u.name?.[0]?.toUpperCase()}
                    </div>
                    <span className="font-medium text-gray-200">{u.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-400">{u.email}</td>
                <td className="px-6 py-4">
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${u.role === "Admin" ? "bg-purple-500/20 text-purple-400 border-purple-500/30" : "bg-gray-700 text-gray-400 border-gray-600"}`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${u.isVerified ? "text-green-400" : "text-red-400"}`}
                  >
                    {u.isVerified ? "✓ Verified" : "✗ Unverified"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleRole(u._id)}
                      className="p-2 bg-purple-600/20 hover:bg-purple-600/40 text-purple-400 rounded-lg transition-colors"
                      title="Toggle Role"
                    >
                      <FiShield size={15} />
                    </button>
                    <button
                      onClick={() => setDeleteId(u._id)}
                      className="p-2 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-lg transition-colors"
                    >
                      <FiTrash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {deleteId && (
        <ConfirmModal
          message="Delete this user permanently?"
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
};

export default ManageUsers;

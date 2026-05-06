import { useEffect, useState } from "react";
import API from "../../utils/axios";
import toast from "react-hot-toast";
import ConfirmModal from "../../components/ui/ConfirmModal";
import Loader from "../../components/ui/Loader";
import { FiShield, FiTrash2, FiSearch, FiCheck, FiX } from "react-icons/fi";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const loadUsers = async (q = "") => {
    try {
      const res = await API.get("/admin/users", {
        params: { search: q, limit: 100 },
      });
      setUsers(res.data.users);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleSearch = (e) => {
    const val = e.target.value;
    setSearch(val);
    loadUsers(val);
  };

  const toggleRole = async (id) => {
    try {
      const res = await API.put(`/admin/users/${id}/role`);
      toast.success(res.data.message);
      loadUsers(search);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update role");
    }
  };

  const handleDelete = async () => {
    try {
      await API.delete(`/admin/users/${deleteId}`);
      toast.success("User deleted successfully");
      setDeleteId(null);
      loadUsers(search);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete user");
    }
  };

  if (loading) return <Loader fullScreen={false} />;

  return (
    <div className="animate-slide-up">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Manage Users</h1>
        <p className="text-gray-400 mt-1">{users.length} registered users</p>
      </div>

      <div className="relative mb-6">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          className="input pl-11"
          placeholder="Search by name or email..."
          value={search}
          onChange={handleSearch}
        />
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-800/50">
                {["User", "Email", "Role", "Verified", "Joined", "Actions"].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left text-gray-400 font-medium px-5 py-4"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {users.map((u) => (
                <tr
                  key={u._id}
                  className="hover:bg-gray-800/30 transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-sm text-white shrink-0">
                        {u.name?.[0]?.toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-200">
                        {u.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-400">{u.email}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`badge ${
                        u.role === "Admin"
                          ? "bg-purple-500/20 text-purple-400 border-purple-500/30"
                          : "bg-gray-700/50 text-gray-400 border-gray-600/50"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    {u.isVerified ? (
                      <span className="flex items-center gap-1 text-green-400 text-xs">
                        <FiCheck size={12} /> Verified
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-400 text-xs">
                        <FiX size={12} /> Unverified
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-gray-500 text-xs">
                    {new Date(u.createdAt).toLocaleDateString("en-IN")}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleRole(u._id)}
                        className="p-2 bg-purple-600/20 hover:bg-purple-600/40 text-purple-400 rounded-lg transition-colors"
                        title="Toggle Role"
                      >
                        <FiShield size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteId(u._id)}
                        className="p-2 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-lg transition-colors"
                        title="Delete User"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {users.length === 0 && (
            <div className="text-center py-16 text-gray-500">
              <p>No users found</p>
            </div>
          )}
        </div>
      </div>

      {deleteId && (
        <ConfirmModal
          message="Delete this user permanently? All their data will be removed."
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
};

export default ManageUsers;

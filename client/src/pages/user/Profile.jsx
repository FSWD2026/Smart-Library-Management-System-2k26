import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMyProfile } from "../../redux/slices/authSlice";
import API from "../../utils/axios";
import toast from "react-hot-toast";
import { FiUser, FiLock, FiCamera } from "react-icons/fi";

const Profile = () => {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const [name, setName] = useState(user?.name || "");
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(user?.avatar?.url || "");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("name", name);
      if (avatar) fd.append("avatar", avatar);
      await API.put("/user/me/update", fd);
      toast.success("Profile updated");
      dispatch(getMyProfile());
    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.put("/user/me/password", {
        oldPassword,
        newPassword,
      });
      toast.success(res.data.message);
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-6 animate-slide-up">
      <h1 className="text-3xl font-bold text-white">My Profile</h1>

      {/* Profile Update */}
      <div className="card">
        <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
          <FiUser className="text-indigo-400" /> Personal Info
        </h2>
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-indigo-600 flex items-center justify-center text-2xl font-bold overflow-hidden">
                {preview ? (
                  <img
                    src={preview}
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  user?.name?.[0]?.toUpperCase()
                )}
              </div>
              <label className="absolute -bottom-2 -right-2 w-7 h-7 bg-indigo-600 hover:bg-indigo-500 rounded-full flex items-center justify-center cursor-pointer transition-colors">
                <FiCamera size={13} />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </label>
            </div>
            <div>
              <p className="text-gray-400 text-sm">
                Role:{" "}
                <span
                  className={`font-medium ${user?.role === "Admin" ? "text-purple-400" : "text-indigo-400"}`}
                >
                  {user?.role}
                </span>
              </p>
              <p className="text-gray-400 text-sm">{user?.email}</p>
            </div>
          </div>
          <input
            className="input"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>

      {/* Password Change */}
      <div className="card">
        <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
          <FiLock className="text-indigo-400" /> Change Password
        </h2>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <input
            className="input"
            type="password"
            placeholder="Current Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
          <input
            className="input"
            type="password"
            placeholder="New Password (min 8 chars)"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={8}
          />
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMyProfile } from "../../redux/slices/authSlice";
import API from "../../utils/axios";
import toast from "react-hot-toast";
import { FiUser, FiLock, FiCamera, FiMail, FiShield } from "react-icons/fi";

const Profile = () => {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const [name, setName] = useState(user?.name || "");
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(user?.avatar?.url || "");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);
  const [passLoading, setPassLoading] = useState(false);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatar(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      const fd = new FormData();
      fd.append("name", name);
      if (avatar) fd.append("avatar", avatar);
      await API.put("/user/me/update", fd);
      toast.success("Profile updated successfully");
      dispatch(getMyProfile());
      setAvatar(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPassLoading(true);
    try {
      const res = await API.put("/user/me/password", {
        oldPassword,
        newPassword,
      });
      toast.success(res.data.message);
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password");
    } finally {
      setPassLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-6 animate-slide-up">
      <div>
        <h1 className="text-3xl font-bold text-white">My Profile</h1>
        <p className="text-gray-400 mt-1">Manage your account information</p>
      </div>

      {/* Profile Info */}
      <div className="card">
        <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
          <FiUser className="text-indigo-400" /> Personal Information
        </h2>

        <form onSubmit={handleProfileUpdate} className="space-y-5">
          {/* Avatar */}
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white">
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
              <label className="absolute -bottom-1.5 -right-1.5 w-7 h-7 bg-indigo-600 hover:bg-indigo-500 rounded-full flex items-center justify-center cursor-pointer transition-colors shadow-lg">
                <FiCamera size={13} className="text-white" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </label>
            </div>
            <div>
              <p className="text-gray-300 font-medium">{user?.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <FiMail className="text-gray-500" size={13} />
                <p className="text-gray-500 text-sm">{user?.email}</p>
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <FiShield className="text-gray-500" size={13} />
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    user?.role === "Admin"
                      ? "bg-purple-500/20 text-purple-400"
                      : "bg-indigo-500/20 text-indigo-400"
                  }`}
                >
                  {user?.role}
                </span>
              </div>
            </div>
          </div>

          <div>
            <label className="text-gray-400 text-sm mb-1.5 block">
              Full Name
            </label>
            <input
              className="input"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={profileLoading}
          >
            {profileLoading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>

      {/* Change Password */}
      <div className="card">
        <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
          <FiLock className="text-indigo-400" /> Change Password
        </h2>

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="text-gray-400 text-sm mb-1.5 block">
              Current Password
            </label>
            <input
              type="password"
              className="input"
              placeholder="Enter current password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-1.5 block">
              New Password
            </label>
            <input
              type="password"
              className="input"
              placeholder="Min 8 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>
          <button type="submit" className="btn-primary" disabled={passLoading}>
            {passLoading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;

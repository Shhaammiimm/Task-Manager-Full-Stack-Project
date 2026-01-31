import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useState } from "react";
import ProfileModal from "./ProfileModal";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const [showProfile, setShowProfile] = useState(false);

  return (
    <>
      <nav className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📋</span>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Task Manager</h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={toggle}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                title={dark ? "Light mode" : "Dark mode"}
              >
                {dark ? "☀️" : "🌙"}
              </button>
              <span className="text-gray-700 dark:text-gray-300 font-medium">
                {user?.firstName} {user?.lastName}
              </span>
              <button
                onClick={() => setShowProfile(true)}
                className="bg-primary hover:bg-secondary text-white px-4 py-2 rounded-lg transition-colors"
              >
                Profile
              </button>
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}
    </>
  );
}

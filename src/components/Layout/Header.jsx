// src\components\Layout\Header.jsx

import React from "react";
import { Menu, X, LogOut } from "lucide-react";

const Header = ({ isOpen, setIsOpen }) => {
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.reload();
    }
  };

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = user.name;
  const userEmail = user.email;
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Page Title */}
      <div className="flex-1 lg:ml-0 ml-2">
        <h2 className="text-xl font-semibold text-slate-800"></h2>
      </div>

      {/* User Info & Actions */}
      <div className="flex items-center gap-4">
        <div className="hidden sm:block text-right">
          <p className="text-sm font-medium text-slate-700">{userName}</p>
          <p className="text-xs text-slate-500">{userEmail}</p>
        </div>

        {/* User Avatar */}
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
          {userInitial}
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          title="Logout"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
};

export default Header;

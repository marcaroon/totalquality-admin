// src\components\Layout\Sidebar.jsx

import React from "react";
import {
  Home,
  Users,
  Briefcase,
  Calendar,
  Newspaper,
  MessageSquare,
  ClipboardList,
  FileText,
  BarChart,
  MailX,
} from "lucide-react";

const Sidebar = ({ activeMenu, setActiveMenu, isOpen, setIsOpen }) => {
  const menuItems = [
    // { id: "dashboard", label: "Dashboard", icon: Home },
    // { id: "users", label: "Users", icon: Users },
    { id: "hero", label: "Hero Image", icon: MailX },
    { id: "services", label: "Services", icon: Briefcase },
    { id: "events", label: "Events", icon: Calendar },
    { id: "news", label: "Articles", icon: Newspaper },
    { id: "careers", label: "Careers", icon: FileText },
    { id: "applications", label: "Applications", icon: ClipboardList },
    { id: "forum", label: "Forum", icon: MessageSquare },
    { id: "assessments", label: "Assessments", icon: BarChart },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-slate-900 text-white
        transform transition-transform duration-200 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        {/* Logo Section */}
        <div className="p-4 border-b border-slate-800">
          <h1 className="text-xl font-bold">Admin Panel</h1>
          {/* <p className="text-sm text-slate-400">Total Quality</p> */}
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveMenu(item.id);
                  setIsOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg
                  transition-colors duration-150
                  ${
                    activeMenu === item.id
                      ? "bg-blue-600 text-white"
                      : "text-slate-300 hover:bg-slate-800"
                  }
                `}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;

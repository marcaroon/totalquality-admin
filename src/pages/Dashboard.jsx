// src\pages\Dashboard.jsx

import React, { useState, useEffect } from "react";
import {
  Users,
  Briefcase,
  ClipboardList,
  Calendar,
  TrendingUp,
} from "lucide-react";
import api from "../services/api";

const Dashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    careers: 0,
    applications: 0,
    events: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      // Fetch all stats in parallel
      const [usersRes, careersRes, applicationsRes, eventsRes] =
        await Promise.all([
          api.get("/users/count").catch(() => ({ data: { count: 0 } })),
          api.get("/careers/count").catch(() => ({ data: { count: 0 } })),
          api.get("/applications/count").catch(() => ({ data: { count: 0 } })),
          api.get("/events/count").catch(() => ({ data: { count: 0 } })),
        ]);

      setStats({
        users: usersRes.data.count || 0,
        careers: careersRes.data.count || 0,
        applications: applicationsRes.data.count || 0,
        events: eventsRes.data.count || 0,
      });
      setError(null);
    } catch (err) {
      console.error("Error fetching dashboard stats:", err);
      setError("Failed to load dashboard statistics");
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      label: "Total Users",
      value: stats.users,
      icon: Users,
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
    },
    {
      label: "Active Careers",
      value: stats.careers,
      icon: Briefcase,
      color: "bg-green-500",
      bgColor: "bg-green-50",
      textColor: "text-green-700",
    },
    {
      label: "Applications",
      value: stats.applications,
      icon: ClipboardList,
      color: "bg-purple-500",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700",
    },
    {
      label: "Upcoming Events",
      value: stats.events,
      icon: Calendar,
      color: "bg-orange-500",
      bgColor: "bg-orange-50",
      textColor: "text-orange-700",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Dashboard</h2>
        <p className="text-slate-600 mt-1">
          Welcome back! Here's your overview.
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm p-6 border border-slate-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}
                >
                  <Icon className="text-white" size={24} />
                </div>
              </div>
              <p className="text-slate-600 text-sm mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-slate-800">
                {stat.value.toLocaleString()}
              </p>
            </div>
          );
        })}
      </div>

      {/* Welcome Card */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            Welcome to Admin Panel
          </h3>
          <p className="text-slate-600 mb-4">
            Gunakan menu di sebelah kiri untuk mengelola konten website company
            profile Anda. Setiap modul menyediakan fitur CRUD lengkap untuk
            memudahkan pengelolaan data.
          </p>
          <div className="space-y-2 text-sm text-slate-600">
            <p>
              • <strong>Users:</strong> Kelola data pengguna dan profil mereka
            </p>
            <p>
              • <strong>Services:</strong> Tambah dan edit layanan perusahaan
            </p>
            <p>
              • <strong>Careers:</strong> Post lowongan pekerjaan baru
            </p>
            <p>
              • <strong>Applications:</strong> Review aplikasi kandidat
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <button className="w-full px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-left">
              <span className="font-medium">Add New Career</span>
              <p className="text-sm text-blue-600 mt-1">
                Post a new job opening
              </p>
            </button>
            <button className="w-full px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-left">
              <span className="font-medium">Create Event</span>
              <p className="text-sm text-green-600 mt-1">
                Schedule a new event
              </p>
            </button>
            <button className="w-full px-4 py-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors text-left">
              <span className="font-medium">Publish News</span>
              <p className="text-sm text-purple-600 mt-1">
                Share company updates
              </p>
            </button>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default Dashboard;

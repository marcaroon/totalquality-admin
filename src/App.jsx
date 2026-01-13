// src/App.jsx

import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import MainLayout from "./components/Layout/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ServiceList from "./pages/Services/ServiceList";
import authService from "./services/authService";
import EventList from "./pages/Events/EventList";
import NewsList from "./pages/News/NewsList";
import CareerList from "./pages/Career/CareerList";
import ApplicationList from "./pages/Application/ApplicationList";
import ForumList from "./pages/Forum/ForumList";
import AssessmentList from "./pages/Assessment/AssessmentList";

function AppContent() {
  const [activeMenu, setActiveMenu] = useState("dashboard");

  const renderContent = () => {
    switch (activeMenu) {
      case "dashboard":
        return <Dashboard />;

      case "users":
        return (
          <div className="text-center py-20 text-slate-600">
            Users page - Coming soon
          </div>
        );

      case "services":
        return <ServiceList />;

      case "events":
        return <EventList />;

      case "news":
        return <NewsList />;

      case "careers":
        return <CareerList />;

      case "applications":
        return <ApplicationList />;

      case "forum":
        return <ForumList />;

      case "assessments":
        return <AssessmentList />;

      default:
        return <Dashboard />;
    }
  };

  return (
    <ProtectedRoute>
      <MainLayout activeMenu={activeMenu} setActiveMenu={setActiveMenu}>
        {renderContent()}
      </MainLayout>
    </ProtectedRoute>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      const authenticated =
        authService.isAuthenticated() && authService.isAdmin();
      setIsAuthenticated(authenticated);
      setIsChecking(false);
    };

    checkAuth();
  }, []);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
        />
        <Route
          path="/*"
          element={
            isAuthenticated ? <AppContent /> : <Navigate to="/login" replace />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

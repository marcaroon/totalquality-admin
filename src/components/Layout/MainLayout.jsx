// src\components\Layout\Header.jsx

import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

const MainLayout = ({ children, activeMenu, setActiveMenu }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      <Sidebar
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header isOpen={isOpen} setIsOpen={setIsOpen} />

        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;

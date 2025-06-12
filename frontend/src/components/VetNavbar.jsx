import React, { useState } from "react";
import { LayoutDashboard, User, Bell, Stethoscope } from "lucide-react";

const VetSidebar = () => {
  const [activeItem, setActiveItem] = useState("/vet/dashboard");

  const navItems = [
    {
      to: "/vet/dashboard",
      icon: LayoutDashboard,
      label: "Dashboard"
    },
    {
      to: "/vet/profile",
      icon: User,
      label: "Profile"
    },
    {
      to: "/vet/alert",
      icon: Bell,
      label: "Alert"
    }
  ];

  const handleNavClick = (path) => {
    setActiveItem(path);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <nav className="fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-blue-50 to-white border-r border-gray-200 flex flex-col shadow-lg z-50">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">VetCare</h2>
              <p className="text-sm text-gray-500">Veterinary Portal</p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 pt-6 px-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeItem === item.to;
              
              return (
                <li key={item.to}>
                  <button
                    onClick={() => handleNavClick(item.to)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                      isActive
                        ? "bg-blue-100 text-blue-700 border-l-4 border-blue-600"
                        : "text-gray-600 hover:bg-gray-100 hover:text-blue-600"
                    }`}
                  >
                    <IconComponent 
                      className={`w-5 h-5 transition-colors duration-200`}
                    />
                    <span className="font-medium">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 text-center">
              © 2025 VetCare System
            </p>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="ml-64 flex-1 p-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {navItems.find(item => item.to === activeItem)?.label || "Dashboard"}
          </h1>
          <p className="text-gray-600">
            Welcome to the veterinary dashboard. Click on the sidebar items to navigate.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VetSidebar;
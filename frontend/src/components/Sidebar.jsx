import React from "react";
import { 
  LayoutDashboard, 
  User, 
  Bell, 
  UserCheck, 
  Heart, 
  History, 
  ShoppingBag,
  Users,
  ChevronLeft,
  ChevronRight,
  Home,
  Stethoscope,
  ClipboardCheck
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSidebar } from "../context/SidebarContext";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isCollapsed, toggleSidebar } = useSidebar();

  const navItems = [
    {
      section: "Main",
      items: [
        {
          to: "/home",
          icon: LayoutDashboard,
          label: "Dashboard"
        },
        {
          to: "/profile",
          icon: User,
          label: "Profile"
        },
        {
          to: "/alertPage",
          icon: Bell,
          label: "Alerts"
        },
        {
          to: "/vet/diagnosis",
          icon: ClipboardCheck,
          label: "Vet Diagnosis"
        }
      ]
    },
    {
      section: "Cattle Management",
      items: [
        {
          to: "/cowprofile",
          icon: Users,
          label: "Cow Profile"
        },
        {
          to: "/breeding",
          icon: Heart,
          label: "Breeding"
        },
        {
          to: "/history",
          icon: History,
          label: "History"
        }
      ]
    },
    {
      section: "Services",
      items: [
        {
          to: "/vets",
          icon: UserCheck,
          label: "Veterinarians"
        },
        {
          to: "/shopPage",
          icon: ShoppingBag,
          label: "Shop"
        }
      ]
    }
  ];

  const handleNavClick = (path) => {
    navigate(path);
  };

  return (
    <aside className={`fixed top-0 left-0 h-full bg-white border-r border-gray-200 shadow-sm transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
      {/* Logo and Title */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
        {!isCollapsed && <h1 className="text-xl font-bold text-gray-900">Cow Genix</h1>}
        <button
          onClick={toggleSidebar}
          className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        {navItems.map((section) => (
          <div key={section.section} className="mb-6">
            {!isCollapsed && (
              <h3 className="px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                {section.section}
              </h3>
            )}
            <ul className="space-y-1">
              {section.items.map((item) => {
                const IconComponent = item.icon;
                const isActive = location.pathname === item.to;
                
                return (
                  <li key={item.to}>
                    <button
                      onClick={() => handleNavClick(item.to)}
                      className={`w-full flex items-center space-x-3 px-6 py-2.5 transition-all duration-200 group ${
                        isActive
                          ? "bg-green-50 text-green-700 border-l-4 border-green-600"
                          : "text-gray-600 hover:bg-gray-50 hover:text-green-600"
                      }`}
                      title={isCollapsed ? item.label : ""}
                    >
                      <IconComponent 
                        className={`w-5 h-5 transition-colors duration-200`}
                      />
                      {!isCollapsed && (
                        <span className="font-medium">{item.label}</span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
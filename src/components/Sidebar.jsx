import { useState,useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Users, 
  Plus, 
  Calendar, 
  UserCheck, 
  BarChart3, 
  Settings,
  Menu,
  X,
  Sparkles,
  FolderOpen,
  DollarSign,
  Receipt,
  LogOut
} from "lucide-react";

import { BioContext } from '../context/authContext';





const Sidebar = () => {

  const { user } = useContext(BioContext);

  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: FolderOpen, label: "All Projects", path: "/list-projects" },
    { icon: Users, label: "Customers", path: "/customer-list" },
    { icon: Plus, label: "Add Customer", path: "/add-customer" },
    { icon: Receipt, label: "Invoices", path: "/invoices" },
    { icon: Calendar, label: "Calendar", path: "/calendar" },
    { icon: UserCheck, label: "Staff", path: "/staff" },
    { icon: BarChart3, label: "Analytics", path: "/analytics" },
    { icon: DollarSign, label: "Expenses", path: "/expenses" },
    { icon: Settings, label: "Settings", path: "/settings" },
    { icon: LogOut, label: "Logout", path: "/logout" },
  ];

  return (
    <div className={`bg-gradient-to-b from-purple-900 to-indigo-900 text-white transition-all duration-300 ${
      isCollapsed ? "w-16" : "w-64"
    } min-h-screen relative`}>
      
      {/* Header */}
      <div className="p-4 border-b border-white/20">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <Sparkles className="h-6 w-6 text-yellow-400" />
              <span className="font-bold text-lg">Ozrit CRM</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-white hover:bg-white/20"
          >
            {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="p-2 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link key={item.path} to={item.path}>
              <Button
                variant="ghost"
                className={`w-full justify-start text-white hover:bg-white/20 transition-all duration-200 ${
                  isActive ? "bg-white/20 border-l-4 border-yellow-400" : ""
                } ${isCollapsed ? "px-2" : "px-3"}`}
              >
                <Icon className={`h-4 w-4 ${isCollapsed ? "" : "mr-3"}`} />
                {!isCollapsed && <span>{item.label}</span>}
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      {!isCollapsed && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-white/10 rounded-lg p-3 backdrop-blur-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                A
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{ user?.name}</div>
                <div className="text-xs text-purple-200 truncate">{user?.email}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;

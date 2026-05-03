"use client"

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Calendar,
  LogOut,
  User as UserIcon
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, logout } = useAuth();

  const menuItems = [
    { id: 'schedule', label: 'Weekly Schedule', icon: LayoutDashboard },
    { id: 'teachers', label: 'Teachers', icon: Users },
    { id: 'classes', label: 'Classes', icon: GraduationCap },
    { id: 'courses', label: 'Courses', icon: BookOpen },
  ];

  return (
    <aside
      className={`relative h-screen bg-card border-r border-border transition-all duration-300 flex flex-col ${isCollapsed ? 'w-20' : 'w-64'
        }`}
    >
      <div className="p-6 flex items-center gap-3">
        <div className="bg-primary p-2 rounded-lg shrink-0">
          <Calendar className="w-6 h-6 text-primary-foreground" />
        </div>
        {!isCollapsed && (
          <span className="font-bold text-lg tracking-tight truncate">Scheduler</span>
        )}
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${isActive
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!isCollapsed && <span className="font-medium">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {user && (
        <div className="p-4 border-t border-border space-y-2">
          {!isCollapsed && (
            <div className="px-3 py-2 flex items-center gap-3 bg-muted/30 rounded-xl border border-border/50">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <UserIcon className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">{user.username}</p>
                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">{user.role}</p>
              </div>
            </div>
          )}
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 p-3 text-destructive hover:bg-destructive/10 rounded-xl transition-all"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!isCollapsed && <span className="font-medium">Logout</span>}
          </button>
        </div>
      )}

      <div className="p-4 border-t border-border">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center gap-3 p-3 text-muted-foreground hover:text-foreground transition-colors"
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          {!isCollapsed && <span className="font-medium">Collapse</span>}
        </button>
      </div>

      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 bg-border text-foreground w-6 h-6 rounded-full flex items-center justify-center border border-border shadow-md hover:scale-110 transition-all md:flex hidden"
      >
        {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>
    </aside>
  );
}

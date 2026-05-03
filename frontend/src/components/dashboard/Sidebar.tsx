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
    { id: 'courses', label: 'Subjects', icon: BookOpen },
  ];

  return (
    <aside
      className={`relative h-screen bg-card border-r border-border transition-all duration-300 flex-col hidden md:flex ${isCollapsed ? 'w-20' : 'w-64'
        }`}
    >
      <div className="p-4 flex items-center justify-between border-b border-border mb-2">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="bg-primary p-2 rounded-lg shrink-0">
            <Calendar className="w-5 h-5 text-primary-foreground" />
          </div>
          {!isCollapsed && (
            <span className="font-bold text-lg tracking-tight truncate">Scheduler</span>
          )}
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 text-muted-foreground hover:text-foreground transition-colors hover:bg-muted rounded-lg"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
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
              {!isCollapsed && <span className="font-medium text-sm">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border mt-auto">
        <div className={`flex flex-col ${isCollapsed ? 'items-center' : 'items-start'} gap-1`}>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            {new Date().getFullYear()} © Scheduler
          </p>
          {!isCollapsed && (
            <p className="text-[9px] text-muted-foreground/60 font-medium">
              All Rights Reserved.
            </p>
          )}
        </div>
      </div>
    </aside>
  );
}

import { Calendar, RefreshCw, User as UserIcon, Menu, X, LayoutDashboard, Users, GraduationCap, BookOpen, LogOut } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/lib/auth";
import { useState } from 'react';

interface HeaderProps {
  onRefresh: () => Promise<void>;
  onGenerate: () => Promise<void>;
  loading: boolean;
  activeTab: string;
  setActiveTab?: (tab: string) => void;
  isAdmin: boolean;
}

export function Header({ onRefresh, onGenerate, loading, activeTab, setActiveTab, isAdmin }: HeaderProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefresh();
    setIsRefreshing(false);
  };

  const menuItems = [
    { id: 'schedule', label: 'Schedule', icon: LayoutDashboard },
    { id: 'teachers', label: 'Teachers', icon: Users },
    { id: 'classes', label: 'Classes', icon: GraduationCap },
    { id: 'courses', label: 'Subjects', icon: BookOpen },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-3 rounded-xl md:hidden">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Scheduler</h1>
              <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">School Management Panel</p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 bg-muted rounded-lg text-foreground"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        <div className="flex gap-3 items-center w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <div className="hidden md:flex gap-3 items-center">
            <ThemeToggle />
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-colors border border-input bg-background hover:bg-accent h-11 px-6 shadow-sm"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </button>
            <button
              onClick={logout}
              className="inline-flex items-center justify-center rounded-xl p-3 text-destructive hover:bg-destructive/10 border border-transparent hover:border-destructive/20 transition-all"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-card border border-border rounded-2xl p-4 shadow-xl space-y-2 animate-in slide-in-from-top-4 duration-200">
          <div className="grid grid-cols-2 gap-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab?.(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all ${isActive
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                    : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="font-medium text-sm">{item.label}</span>
                </button>
              );
            })}
          </div>
          <div className="pt-2 border-t border-border flex justify-between items-center">
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground p-2"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh Data
            </button>
            <button
              onClick={logout}
              className="flex items-center gap-2 text-sm font-medium text-destructive p-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

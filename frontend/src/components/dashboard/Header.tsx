"use client";

import { useState } from "react";
import { Calendar, RefreshCw, User as UserIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/lib/auth";

interface HeaderProps {
  onRefresh: () => Promise<void>;
  onGenerate: () => Promise<void>;
  loading: boolean;
  activeTab: string;
  isAdmin: boolean;
}

export function Header({ onRefresh, onGenerate, loading, activeTab, isAdmin }: HeaderProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { user } = useAuth();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefresh();
    setIsRefreshing(false);
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div className="flex items-center gap-3">
        <div className="bg-primary/10 p-3 rounded-xl">
          <Calendar className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Timetable Scheduler</h1>
          <p className="text-muted-foreground">School Management and Schedule Panel</p>
        </div>
      </div>
      <div className="flex gap-3 items-center">
        {/* Welcome Message */}
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-xl border border-border mr-2">
          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
            <UserIcon className="w-3 h-3 text-primary" />
          </div>
          <span className="text-sm font-medium">
            Welcome, <span className="font-bold text-primary">{user ? user.username : "Viewer"}</span>
          </span>
        </div>

        <ThemeToggle />
        <button 
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-6 shadow-sm"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? "Refreshing..." : "Refresh"}
        </button>
        {(activeTab === 'schedule' && isAdmin) && (
          <Button size="lg" onClick={onGenerate} disabled={loading} className="gap-2 shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 h-11 rounded-xl">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? "Generating..." : "Generate Schedule"}
          </Button>
        )}
      </div>
    </div>
  );
}

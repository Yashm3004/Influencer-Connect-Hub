import React from "react";
import { Link, useLocation } from "wouter";
import { Sparkles, Compass, CalendarCheck, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [location] = useLocation();

  const isActive = (path: string) => {
    return location === path || location.startsWith(`${path}/`);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center px-4 md:px-8">
        <Link href="/" className="mr-8 flex items-center gap-2 transition-opacity hover:opacity-80">
          <Sparkles className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold tracking-tight text-white">
            Influence<span className="text-primary">Hub</span>
          </span>
        </Link>
        <div className="flex flex-1 items-center justify-between">
          <div className="hidden md:flex items-center gap-1">
            <Link href="/explore">
              <div className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-white/5 hover:text-white ${isActive("/explore") ? "bg-white/10 text-white" : "text-muted-foreground"}`}>
                <Compass className="h-4 w-4" />
                Explore
              </div>
            </Link>
            <Link href="/bookings">
              <div className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-white/5 hover:text-white ${isActive("/bookings") && location !== "/dashboard" ? "bg-white/10 text-white" : "text-muted-foreground"}`}>
                <CalendarCheck className="h-4 w-4" />
                Bookings
              </div>
            </Link>
            <Link href="/dashboard">
              <div className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-white/5 hover:text-white ${isActive("/dashboard") ? "bg-white/10 text-white" : "text-muted-foreground"}`}>
                <BarChart3 className="h-4 w-4" />
                Dashboard
              </div>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/explore">
              <Button variant="default" className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold shadow-[0_0_20px_rgba(0,229,255,0.3)]">
                Find Talent
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

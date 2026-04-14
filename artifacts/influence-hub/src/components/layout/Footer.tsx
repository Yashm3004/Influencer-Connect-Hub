import React from "react";
import { Link } from "wouter";
import { Sparkles, Twitter, Instagram, Youtube, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-background/50 py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid gap-8 md:grid-cols-4 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <Sparkles className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold tracking-tight text-white">
                Influence<span className="text-primary">Hub</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs mb-6 leading-relaxed">
              The premier marketplace connecting elite brands with top-tier influencers, celebrities, and digital creators.
            </p>
            <div className="flex items-center gap-4 text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors"><Twitter className="h-5 w-5" /></a>
              <a href="#" className="hover:text-primary transition-colors"><Instagram className="h-5 w-5" /></a>
              <a href="#" className="hover:text-primary transition-colors"><Youtube className="h-5 w-5" /></a>
              <a href="#" className="hover:text-primary transition-colors"><Linkedin className="h-5 w-5" /></a>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Platform</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/explore" className="hover:text-primary transition-colors">Explore Talent</Link></li>
              <li><Link href="/dashboard" className="hover:text-primary transition-colors">Business Dashboard</Link></li>
              <li><Link href="/bookings" className="hover:text-primary transition-colors">My Bookings</Link></li>
              <li><a href="#" className="hover:text-primary transition-colors">How it Works</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Categories</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/explore?category=influencer" className="hover:text-primary transition-colors">Influencers</Link></li>
              <li><Link href="/explore?category=youtuber" className="hover:text-primary transition-colors">YouTubers</Link></li>
              <li><Link href="/explore?category=fashion_model" className="hover:text-primary transition-colors">Fashion Models</Link></li>
              <li><Link href="/explore?category=celebrity" className="hover:text-primary transition-colors">Celebrities</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Company</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} InfluenceHub. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            Built for ambitious brands
          </p>
        </div>
      </div>
    </footer>
  );
}

import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Search, Filter, Star, Shield, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useListTalents, useListCategories } from "@workspace/api-client-react";

function formatFollowers(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(0)}K`;
  return `${count}`;
}

const stagger = {
  container: { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } },
  item: { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } },
};

const CATEGORIES = [
  { value: "all", label: "All Categories" },
  { value: "influencer", label: "Influencers" },
  { value: "youtuber", label: "YouTubers" },
  { value: "fashion_model", label: "Fashion Models" },
  { value: "celebrity", label: "Celebrities" },
  { value: "brand_ambassador", label: "Brand Ambassadors" },
];

const RATE_FILTERS = [
  { value: "all", label: "Any Budget" },
  { value: "5000", label: "Up to $5,000" },
  { value: "10000", label: "Up to $10,000" },
  { value: "25000", label: "Up to $25,000" },
  { value: "50000", label: "Up to $50,000" },
];

export default function Explore() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [maxRate, setMaxRate] = useState("all");

  const { data: talents, isLoading } = useListTalents({
    category: category === "all" ? undefined : category,
    search: search || undefined,
    maxRate: maxRate !== "all" ? Number(maxRate) : undefined,
  });

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-extrabold text-white mb-2">Explore Talent</h1>
          <p className="text-muted-foreground text-lg">Find the perfect creator for your brand campaign</p>
        </motion.div>

        {/* Filters */}
        <motion.div
          className="mb-8 flex flex-col md:flex-row gap-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, niche, or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-card border-white/10 text-white placeholder:text-muted-foreground focus:border-primary/50"
            />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full md:w-52 bg-card border-white/10 text-white">
              <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-white/10">
              {CATEGORIES.map((c) => (
                <SelectItem key={c.value} value={c.value} className="text-white hover:bg-white/5">
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={maxRate} onValueChange={setMaxRate}>
            <SelectTrigger className="w-full md:w-48 bg-card border-white/10 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-white/10">
              {RATE_FILTERS.map((r) => (
                <SelectItem key={r.value} value={r.value} className="text-white hover:bg-white/5">
                  {r.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>

        {/* Results count */}
        {talents && (
          <motion.p
            className="text-muted-foreground text-sm mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {talents.length} {talents.length === 1 ? "creator" : "creators"} found
          </motion.p>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-card rounded-2xl overflow-hidden animate-pulse">
                <div className="h-52 bg-white/5" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-white/5 rounded w-2/3" />
                  <div className="h-3 bg-white/5 rounded w-1/2" />
                  <div className="h-3 bg-white/5 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && talents?.length === 0 && (
          <div className="text-center py-24">
            <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No creators found</h3>
            <p className="text-muted-foreground mb-6">Try adjusting your filters</p>
            <Button onClick={() => { setSearch(""); setCategory("all"); setMaxRate("all"); }} variant="outline" className="border-white/10 text-white hover:bg-white/5">
              Clear Filters
            </Button>
          </div>
        )}

        {/* Grid */}
        {!isLoading && talents && talents.length > 0 && (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
            variants={stagger.container}
            initial="hidden"
            animate="visible"
          >
            {talents.map((talent) => (
              <motion.div key={talent.id} variants={stagger.item}>
                <Link href={`/talent/${talent.id}`}>
                  <div className="group cursor-pointer bg-card border border-white/5 rounded-2xl overflow-hidden hover:border-primary/20 hover:shadow-[0_0_30px_rgba(0,229,255,0.08)] transition-all duration-300 h-full flex flex-col">
                    <div className="relative h-52 bg-gradient-to-br from-primary/20 via-secondary/10 to-background flex items-center justify-center overflow-hidden flex-shrink-0">
                      {talent.profileImageUrl ? (
                        <img src={talent.profileImageUrl} alt={talent.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center text-3xl font-black text-primary">
                          {talent.name.charAt(0)}
                        </div>
                      )}
                      {talent.verified && (
                        <div className="absolute top-3 right-3 bg-primary text-primary-foreground rounded-full p-1.5">
                          <Shield className="w-3 h-3" />
                        </div>
                      )}
                      {!talent.available && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <Badge className="bg-black/80 text-muted-foreground border-white/10">Unavailable</Badge>
                        </div>
                      )}
                      <div className="absolute bottom-3 left-3">
                        <Badge className="bg-black/60 text-white border-0 text-xs capitalize">
                          {talent.category.replace("_", " ")}
                        </Badge>
                      </div>
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="font-bold text-white group-hover:text-primary transition-colors text-base">{talent.name}</h3>
                        {talent.avgRating && (
                          <div className="flex items-center gap-1 text-xs text-yellow-400 flex-shrink-0 ml-2">
                            <Star className="w-3 h-3 fill-current" />
                            <span>{talent.avgRating.toFixed(1)}</span>
                          </div>
                        )}
                      </div>
                      {talent.location && (
                        <p className="text-xs text-muted-foreground mb-2">{talent.location}</p>
                      )}
                      {talent.niche && (
                        <p className="text-xs text-muted-foreground/70 mb-3 line-clamp-1">{talent.niche}</p>
                      )}
                      {talent.platforms && talent.platforms.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {talent.platforms.slice(0, 3).map((p) => (
                            <Badge key={p} className="bg-white/5 text-muted-foreground border-0 text-xs py-0">{p}</Badge>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5">
                        <div>
                          <div className="text-xs text-muted-foreground">Followers</div>
                          <div className="text-sm font-bold text-white">{formatFollowers(talent.followerCount)}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-muted-foreground">Per Post</div>
                          <div className="text-sm font-bold text-primary">${talent.ratePerPost.toLocaleString()}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

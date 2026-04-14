import { motion } from "framer-motion";
import { Link } from "wouter";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { TrendingUp, Users, CalendarCheck, DollarSign, Activity, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  useGetPlatformStats,
  useGetBookingsByCategory,
  useGetRecentActivity,
  useListBookings,
} from "@workspace/api-client-react";

function formatCurrency(amount: number): string {
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(0)}K`;
  return `$${amount}`;
}

const ACTIVITY_TYPE_CONFIG: Record<string, { label: string; color: string }> = {
  booking_created: { label: "New Booking", color: "text-blue-400" },
  booking_accepted: { label: "Booking Accepted", color: "text-green-400" },
  booking_completed: { label: "Campaign Completed", color: "text-primary" },
  talent_joined: { label: "Talent Joined", color: "text-secondary" },
  review_posted: { label: "Review Posted", color: "text-yellow-400" },
};

const CATEGORY_COLORS = ["hsl(186 100% 50%)", "hsl(262 83% 66%)", "hsl(33 100% 60%)", "hsl(320 80% 60%)", "hsl(160 80% 50%)"];

const stagger = {
  container: { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } },
  item: { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } },
};

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useGetPlatformStats();
  const { data: byCategory } = useGetBookingsByCategory();
  const { data: activity } = useGetRecentActivity();
  const { data: bookings } = useListBookings({});

  const statCards = stats
    ? [
        { label: "Total Talents", value: stats.totalTalents.toString(), icon: <Users className="w-5 h-5" />, color: "text-primary" },
        { label: "Total Bookings", value: stats.totalBookings.toString(), icon: <CalendarCheck className="w-5 h-5" />, color: "text-secondary" },
        { label: "Active Campaigns", value: stats.activeBookings.toString(), icon: <Activity className="w-5 h-5" />, color: "text-yellow-400" },
        { label: "Revenue Generated", value: formatCurrency(stats.totalRevenue), icon: <DollarSign className="w-5 h-5" />, color: "text-green-400" },
      ]
    : [];

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-extrabold text-white mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Platform overview and analytics</p>
        </motion.div>

        {/* Stats Grid */}
        {statsLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-card rounded-2xl h-28 animate-pulse" />
            ))}
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
            variants={stagger.container}
            initial="hidden"
            animate="visible"
          >
            {statCards.map((card) => (
              <motion.div key={card.label} variants={stagger.item}>
                <div className="bg-card border border-white/5 rounded-2xl p-5">
                  <div className={`mb-3 ${card.color}`}>{card.icon}</div>
                  <div className="text-2xl font-black text-white mb-1">{card.value}</div>
                  <div className="text-xs text-muted-foreground">{card.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart */}
          <motion.div
            className="lg:col-span-2 bg-card border border-white/5 rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-lg font-bold text-white mb-2">Bookings by Category</h2>
            <p className="text-muted-foreground text-sm mb-6">Campaign distribution across talent types</p>
            {byCategory && byCategory.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={byCategory} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <XAxis dataKey="category" tick={{ fill: "hsl(240 5% 65%)", fontSize: 12 }} tickFormatter={(v) => v.replace("_", " ")} />
                  <YAxis tick={{ fill: "hsl(240 5% 65%)", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ background: "hsl(240 10% 6%)", border: "1px solid hsl(240 10% 15%)", borderRadius: "8px", color: "#fff" }}
                    cursor={{ fill: "rgba(255,255,255,0.03)" }}
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {byCategory.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-48">
                <p className="text-muted-foreground text-sm">No booking data yet</p>
              </div>
            )}
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            className="bg-card border border-white/5 rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-lg font-bold text-white mb-2">Recent Activity</h2>
            <p className="text-muted-foreground text-sm mb-5">Latest platform events</p>
            {!activity || activity.length === 0 ? (
              <div className="text-center py-8">
                <Activity className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground text-sm">No recent activity</p>
              </div>
            ) : (
              <div className="space-y-3">
                {activity.slice(0, 8).map((item) => {
                  const config = ACTIVITY_TYPE_CONFIG[item.type];
                  return (
                    <div key={item.id} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-xs font-medium truncate">{item.entityName}</p>
                        <p className="text-muted-foreground text-xs truncate">{item.description}</p>
                        {config && (
                          <span className={`text-xs ${config.color}`}>{config.label}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>

          {/* Recent Bookings */}
          <motion.div
            className="lg:col-span-3 bg-card border border-white/5 rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-white">Recent Bookings</h2>
                <p className="text-muted-foreground text-sm">Latest campaign requests</p>
              </div>
              <Link href="/bookings">
                <Button variant="ghost" className="text-primary hover:text-primary/80 gap-2 text-sm">
                  View all <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
            {!bookings || bookings.length === 0 ? (
              <div className="text-center py-8">
                <CalendarCheck className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground text-sm">No bookings yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {bookings.slice(0, 5).map((booking) => (
                  <Link key={booking.id} href={`/bookings/${booking.id}`}>
                    <div className="flex items-center justify-between p-3 rounded-xl hover:bg-white/3 transition-colors cursor-pointer group border border-transparent hover:border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                          {booking.talent?.profileImageUrl ? (
                            <img src={booking.talent.profileImageUrl} alt={booking.talent.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-primary text-xs font-black">{booking.talent?.name?.charAt(0) ?? "?"}</span>
                          )}
                        </div>
                        <div>
                          <p className="text-white text-sm font-semibold group-hover:text-primary transition-colors">{booking.campaignName}</p>
                          <p className="text-muted-foreground text-xs">{booking.talent?.name} &bull; {booking.businessName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-primary text-sm font-bold">${booking.budget.toLocaleString()}</span>
                        <Badge className={`text-xs ${booking.status === "completed" ? "bg-primary/10 text-primary border-primary/20" : booking.status === "accepted" ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"}`}>
                          {booking.status}
                        </Badge>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

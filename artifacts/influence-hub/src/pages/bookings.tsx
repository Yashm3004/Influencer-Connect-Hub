import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { CalendarCheck, ArrowRight, Clock, CheckCircle, XCircle, AlertCircle, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useListBookings, getListBookingsQueryKey } from "@workspace/api-client-react";

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  pending: { label: "Pending", color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20", icon: <Clock className="w-3.5 h-3.5" /> },
  accepted: { label: "Accepted", color: "bg-green-500/10 text-green-400 border-green-500/20", icon: <CheckCircle className="w-3.5 h-3.5" /> },
  completed: { label: "Completed", color: "bg-primary/10 text-primary border-primary/20", icon: <Star className="w-3.5 h-3.5" /> },
  rejected: { label: "Rejected", color: "bg-red-500/10 text-red-400 border-red-500/20", icon: <XCircle className="w-3.5 h-3.5" /> },
  cancelled: { label: "Cancelled", color: "bg-muted/10 text-muted-foreground border-white/10", icon: <AlertCircle className="w-3.5 h-3.5" /> },
};

const stagger = {
  container: { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } },
  item: { hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0, transition: { duration: 0.4 } } },
};

export default function Bookings() {
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: bookings, isLoading } = useListBookings(
    { status: statusFilter === "all" ? undefined : statusFilter },
    { query: { queryKey: getListBookingsQueryKey({ status: statusFilter === "all" ? undefined : statusFilter }) } }
  );

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          className="mb-10 flex items-end justify-between"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="text-4xl font-extrabold text-white mb-2">My Bookings</h1>
            <p className="text-muted-foreground">Track all your campaign requests and collaborations</p>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-44 bg-card border-white/10 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-white/10">
              <SelectItem value="all" className="text-white hover:bg-white/5">All Statuses</SelectItem>
              {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                <SelectItem key={k} value={k} className="text-white hover:bg-white/5">{v.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>

        {isLoading && (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-card rounded-2xl h-28 animate-pulse" />
            ))}
          </div>
        )}

        {!isLoading && (!bookings || bookings.length === 0) && (
          <div className="text-center py-24">
            <CalendarCheck className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No bookings yet</h3>
            <p className="text-muted-foreground mb-6">Start by finding and booking a talent</p>
            <Link href="/explore">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold gap-2">
                Explore Talent <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        )}

        {!isLoading && bookings && bookings.length > 0 && (
          <motion.div
            className="space-y-4"
            variants={stagger.container}
            initial="hidden"
            animate="visible"
          >
            {bookings.map((booking) => {
              const status = STATUS_CONFIG[booking.status] ?? STATUS_CONFIG.pending;
              return (
                <motion.div key={booking.id} variants={stagger.item}>
                  <Link href={`/bookings/${booking.id}`}>
                    <div className="group bg-card border border-white/5 rounded-2xl p-5 hover:border-primary/20 hover:bg-card/80 transition-all duration-300 cursor-pointer">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1 min-w-0">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                            {booking.talent?.profileImageUrl ? (
                              <img src={booking.talent.profileImageUrl} alt={booking.talent.name} className="w-full h-full object-cover rounded-xl" />
                            ) : (
                              <span className="text-primary font-black text-lg">
                                {booking.talent?.name?.charAt(0) ?? "?"}
                              </span>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <h3 className="font-bold text-white group-hover:text-primary transition-colors truncate">
                                {booking.campaignName}
                              </h3>
                              <Badge className={`${status.color} flex items-center gap-1 text-xs py-0.5 flex-shrink-0`}>
                                {status.icon} {status.label}
                              </Badge>
                            </div>
                            <p className="text-muted-foreground text-sm truncate">
                              {booking.talent?.name ?? "Unknown Talent"} &bull; {booking.businessName}
                            </p>
                            <div className="flex items-center gap-4 mt-2">
                              <span className="text-xs text-muted-foreground/70 capitalize">
                                {booking.campaignType?.replace("_", " ")}
                              </span>
                              <span className="text-xs font-bold text-primary">
                                ${booking.budget.toLocaleString()}
                              </span>
                              <span className="text-xs text-muted-foreground/60">
                                {new Date(booking.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
}

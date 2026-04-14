import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useParams } from "wouter";
import { ArrowLeft, Send, Clock, CheckCircle, XCircle, Star, User, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  useGetBooking,
  useListMessages,
  useCreateMessage,
  useUpdateBooking,
  getGetBookingQueryKey,
  getListMessagesQueryKey,
} from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  pending: { label: "Pending", color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" },
  accepted: { label: "Accepted", color: "bg-green-500/10 text-green-400 border-green-500/20" },
  completed: { label: "Completed", color: "bg-primary/10 text-primary border-primary/20" },
  rejected: { label: "Rejected", color: "bg-red-500/10 text-red-400 border-red-500/20" },
  cancelled: { label: "Cancelled", color: "bg-white/5 text-muted-foreground border-white/10" },
};

export default function BookingDetail() {
  const params = useParams<{ id: string }>();
  const id = parseInt(params.id, 10);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");
  const [senderName, setSenderName] = useState("");
  const [senderRole, setSenderRole] = useState<"business" | "manager">("business");

  const { data: booking, isLoading } = useGetBooking(id, {
    query: { enabled: !!id, queryKey: getGetBookingQueryKey(id) },
  });

  const { data: messages } = useListMessages(
    { bookingId: id },
    { query: { enabled: !!id, queryKey: getListMessagesQueryKey({ bookingId: id }) } }
  );

  const createMessage = useCreateMessage();
  const updateBooking = useUpdateBooking();

  const handleSendMessage = async () => {
    if (!message.trim() || !senderName.trim()) {
      toast({ title: "Please fill in your name and message", variant: "destructive" });
      return;
    }
    try {
      await createMessage.mutateAsync({
        bookingId: id,
        senderName,
        senderRole,
        content: message,
      });
      setMessage("");
      queryClient.invalidateQueries({ queryKey: getListMessagesQueryKey({ bookingId: id }) });
      toast({ title: "Message sent!" });
    } catch {
      toast({ title: "Error", description: "Failed to send message.", variant: "destructive" });
    }
  };

  const handleUpdateStatus = async (status: string) => {
    try {
      await updateBooking.mutateAsync({ id, status });
      queryClient.invalidateQueries({ queryKey: getGetBookingQueryKey(id) });
      toast({ title: `Booking status updated to ${status}` });
    } catch {
      toast({ title: "Error", description: "Failed to update status.", variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-12 px-4">
        <div className="container mx-auto max-w-4xl animate-pulse space-y-4">
          <div className="h-8 bg-card rounded w-1/4" />
          <div className="h-48 bg-card rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Booking not found</h2>
          <Link href="/bookings"><Button variant="outline" className="border-white/10 text-white">Back to Bookings</Button></Link>
        </div>
      </div>
    );
  }

  const status = STATUS_CONFIG[booking.status] ?? STATUS_CONFIG.pending;

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Link href="/bookings">
            <Button variant="ghost" className="text-muted-foreground hover:text-white mb-6 gap-2 pl-0">
              <ArrowLeft className="w-4 h-4" /> Back to Bookings
            </Button>
          </Link>
        </motion.div>

        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Booking Info */}
          <div className="bg-card border border-white/5 rounded-2xl p-6">
            <div className="flex items-start justify-between flex-wrap gap-4 mb-5">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl font-extrabold text-white">{booking.campaignName}</h1>
                  <Badge className={`${status.color} text-xs`}>{status.label}</Badge>
                </div>
                <p className="text-muted-foreground">
                  {booking.talent?.name ?? "Unknown Talent"} &bull; {booking.businessName}
                </p>
              </div>
              <Select value={booking.status} onValueChange={handleUpdateStatus}>
                <SelectTrigger className="w-40 bg-background border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-white/10">
                  {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                    <SelectItem key={k} value={k} className="text-white hover:bg-white/5">{v.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Budget", value: `$${booking.budget.toLocaleString()}` },
                { label: "Campaign Type", value: booking.campaignType?.replace("_", " ") ?? "N/A" },
                { label: "Start Date", value: booking.startDate ?? "TBD" },
                { label: "End Date", value: booking.endDate ?? "TBD" },
              ].map((item) => (
                <div key={item.label} className="bg-background/50 rounded-xl p-3">
                  <div className="text-xs text-muted-foreground mb-1">{item.label}</div>
                  <div className="text-sm font-semibold text-white capitalize">{item.value}</div>
                </div>
              ))}
            </div>
            {booking.campaignDescription && (
              <div className="mt-5 pt-5 border-t border-white/5">
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">Campaign Description</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{booking.campaignDescription}</p>
              </div>
            )}
            <div className="mt-5 pt-5 border-t border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Building className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Business</div>
                  <div className="text-sm font-semibold text-white">{booking.businessName}</div>
                  <div className="text-xs text-muted-foreground">{booking.businessEmail}</div>
                </div>
              </div>
              {booking.talent && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center overflow-hidden">
                    {booking.talent.profileImageUrl ? (
                      <img src={booking.talent.profileImageUrl} alt={booking.talent.name} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-4 h-4 text-secondary" />
                    )}
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Talent</div>
                    <div className="text-sm font-semibold text-white">{booking.talent.name}</div>
                    {booking.talent.managerName && (
                      <div className="text-xs text-muted-foreground">Manager: {booking.talent.managerName}</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Messages */}
          <div className="bg-card border border-white/5 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5">
              <h2 className="text-lg font-bold text-white">Messages</h2>
              <p className="text-muted-foreground text-sm">Communicate with the talent manager</p>
            </div>
            <div className="p-6 space-y-4 min-h-[200px] max-h-[400px] overflow-y-auto">
              {(!messages || messages.length === 0) ? (
                <div className="text-center py-8">
                  <Star className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground text-sm">No messages yet. Start the conversation.</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    className={`flex ${msg.senderRole === "business" ? "justify-end" : "justify-start"}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${msg.senderRole === "business" ? "bg-primary/15 border border-primary/20" : "bg-background border border-white/5"}`}>
                      <div className="text-xs text-muted-foreground mb-1">{msg.senderName}</div>
                      <p className="text-white text-sm">{msg.content}</p>
                      <p className="text-xs text-muted-foreground/60 mt-1">{new Date(msg.createdAt).toLocaleString()}</p>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
            <div className="px-6 py-4 border-t border-white/5 space-y-3">
              <div className="flex gap-3">
                <input
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="Your name"
                  className="flex-1 bg-background border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                />
                <Select value={senderRole} onValueChange={(v) => setSenderRole(v as "business" | "manager")}>
                  <SelectTrigger className="w-36 bg-background border-white/10 text-white text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-white/10">
                    <SelectItem value="business" className="text-white hover:bg-white/5">Business</SelectItem>
                    <SelectItem value="manager" className="text-white hover:bg-white/5">Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-3">
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="bg-background border-white/10 text-white placeholder:text-muted-foreground min-h-[80px] resize-none"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.metaKey) handleSendMessage();
                  }}
                />
                <Button onClick={handleSendMessage} disabled={createMessage.isPending} className="bg-primary text-primary-foreground hover:bg-primary/90 self-end px-4 gap-2">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useParams } from "wouter";
import { ArrowLeft, Star, Shield, MapPin, Users, TrendingUp, MessageCircle, CheckCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetTalent, useListReviews, useCreateBooking, getGetTalentQueryKey, getListReviewsQueryKey } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

function formatFollowers(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(0)}K`;
  return `${count}`;
}

const CAMPAIGN_TYPES = [
  { value: "social_post", label: "Social Media Post" },
  { value: "video_review", label: "Video Review" },
  { value: "brand_ambassador", label: "Brand Ambassador" },
  { value: "live_event", label: "Live Event" },
  { value: "product_launch", label: "Product Launch" },
];

export default function TalentProfile() {
  const params = useParams<{ id: string }>();
  const id = parseInt(params.id, 10);
  const { toast } = useToast();
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [form, setForm] = useState({
    businessName: "",
    businessEmail: "",
    campaignName: "",
    campaignDescription: "",
    budget: "",
    campaignType: "social_post",
    startDate: "",
    endDate: "",
  });

  const { data: talent, isLoading: talentLoading } = useGetTalent(id, {
    query: { enabled: !!id, queryKey: getGetTalentQueryKey(id) },
  });

  const { data: reviews } = useListReviews(
    { talentId: id },
    { query: { enabled: !!id, queryKey: getListReviewsQueryKey({ talentId: id }) } }
  );

  const createBooking = useCreateBooking();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!talent) return;
    try {
      await createBooking.mutateAsync({
        talentId: talent.id,
        businessName: form.businessName,
        businessEmail: form.businessEmail,
        campaignName: form.campaignName,
        campaignDescription: form.campaignDescription,
        budget: parseFloat(form.budget),
        campaignType: form.campaignType,
        startDate: form.startDate || undefined,
        endDate: form.endDate || undefined,
      });
      setBookingSuccess(true);
      toast({ title: "Booking request sent!", description: "The talent manager will respond shortly." });
    } catch {
      toast({ title: "Error", description: "Failed to send booking request.", variant: "destructive" });
    }
  };

  if (talentLoading) {
    return (
      <div className="min-h-screen py-12 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="animate-pulse space-y-6">
            <div className="h-64 bg-card rounded-2xl" />
            <div className="h-8 bg-card rounded w-1/3" />
            <div className="h-4 bg-card rounded w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  if (!talent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Talent not found</h2>
          <Link href="/explore">
            <Button variant="outline" className="border-white/10 text-white">Back to Explore</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-5xl">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Link href="/explore">
            <Button variant="ghost" className="text-muted-foreground hover:text-white mb-6 gap-2 pl-0">
              <ArrowLeft className="w-4 h-4" /> Back to Explore
            </Button>
          </Link>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Profile Card */}
          <div className="lg:col-span-1 space-y-5">
            <div className="bg-card border border-white/5 rounded-2xl overflow-hidden">
              <div className="relative h-56 bg-gradient-to-br from-primary/20 via-secondary/10 to-background flex items-center justify-center">
                {talent.profileImageUrl ? (
                  <img src={talent.profileImageUrl} alt={talent.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-28 h-28 rounded-full bg-primary/20 flex items-center justify-center text-4xl font-black text-primary">
                    {talent.name.charAt(0)}
                  </div>
                )}
                {talent.verified && (
                  <div className="absolute top-4 right-4 bg-primary text-primary-foreground rounded-full px-3 py-1 flex items-center gap-1 text-xs font-bold">
                    <Shield className="w-3 h-3" /> Verified
                  </div>
                )}
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between mb-1">
                  <h1 className="text-xl font-extrabold text-white">{talent.name}</h1>
                  {talent.avgRating && (
                    <div className="flex items-center gap-1 text-yellow-400">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-bold">{talent.avgRating.toFixed(1)}</span>
                    </div>
                  )}
                </div>
                <Badge className="bg-primary/10 text-primary border-primary/20 capitalize mb-3">
                  {talent.category.replace("_", " ")}
                </Badge>
                {talent.location && (
                  <div className="flex items-center gap-1.5 text-muted-foreground text-sm mb-3">
                    <MapPin className="w-3.5 h-3.5" />
                    {talent.location}
                  </div>
                )}
                <p className="text-muted-foreground text-sm leading-relaxed">{talent.bio}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-card border border-white/5 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Stats</h3>
              {[
                { label: "Followers", value: formatFollowers(talent.followerCount), icon: <Users className="w-4 h-4" /> },
                { label: "Engagement Rate", value: talent.engagementRate ? `${talent.engagementRate}%` : "N/A", icon: <TrendingUp className="w-4 h-4" /> },
                { label: "Total Bookings", value: talent.totalBookings.toString(), icon: <CheckCircle className="w-4 h-4" /> },
                { label: "Reviews", value: reviews?.length.toString() ?? "0", icon: <Star className="w-4 h-4" /> },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    {stat.icon} {stat.label}
                  </div>
                  <span className="font-bold text-white text-sm">{stat.value}</span>
                </div>
              ))}
            </div>

            {/* Pricing */}
            <div className="bg-card border border-white/5 rounded-2xl p-5 space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Pricing</h3>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">Per Post</span>
                <span className="font-black text-primary text-lg">${talent.ratePerPost.toLocaleString()}</span>
              </div>
              {talent.ratePerCampaign && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">Full Campaign</span>
                  <span className="font-black text-secondary text-lg">${talent.ratePerCampaign.toLocaleString()}</span>
                </div>
              )}
            </div>

            {/* Platforms */}
            {talent.platforms && talent.platforms.length > 0 && (
              <div className="bg-card border border-white/5 rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Platforms</h3>
                <div className="flex flex-wrap gap-2">
                  {talent.platforms.map((p) => (
                    <Badge key={p} className="bg-white/5 text-white border-white/10">{p}</Badge>
                  ))}
                </div>
              </div>
            )}

            {talent.managerName && (
              <div className="bg-card border border-white/5 rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Manager</h3>
                <p className="text-white font-semibold">{talent.managerName}</p>
                {talent.managerEmail && <p className="text-muted-foreground text-sm mt-1">{talent.managerEmail}</p>}
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Book Button */}
            {!bookingSuccess && !showBookingForm && (
              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                <Button
                  onClick={() => setShowBookingForm(true)}
                  disabled={!talent.available}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-lg h-14 shadow-[0_0_30px_rgba(0,229,255,0.3)] gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  {talent.available ? "Book This Talent" : "Currently Unavailable"}
                </Button>
              </motion.div>
            )}

            {/* Success */}
            {bookingSuccess && (
              <motion.div
                className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6 text-center"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-white mb-2">Booking Request Sent!</h3>
                <p className="text-muted-foreground mb-4">The manager will review and respond to your request.</p>
                <Link href="/bookings">
                  <Button variant="outline" className="border-green-500/30 text-green-400 hover:bg-green-500/10">
                    View My Bookings
                  </Button>
                </Link>
              </motion.div>
            )}

            {/* Booking Form */}
            {showBookingForm && !bookingSuccess && (
              <motion.div
                className="bg-card border border-white/5 rounded-2xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="text-xl font-bold text-white mb-6">Send Booking Request</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-muted-foreground text-sm">Business Name *</Label>
                      <Input required value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} placeholder="Your company name" className="bg-background border-white/10 text-white" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-muted-foreground text-sm">Business Email *</Label>
                      <Input required type="email" value={form.businessEmail} onChange={(e) => setForm({ ...form, businessEmail: e.target.value })} placeholder="contact@company.com" className="bg-background border-white/10 text-white" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground text-sm">Campaign Name *</Label>
                    <Input required value={form.campaignName} onChange={(e) => setForm({ ...form, campaignName: e.target.value })} placeholder="e.g. Summer Product Launch 2025" className="bg-background border-white/10 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground text-sm">Campaign Description</Label>
                    <Textarea value={form.campaignDescription} onChange={(e) => setForm({ ...form, campaignDescription: e.target.value })} placeholder="Describe your campaign goals, target audience, and any specific requirements..." className="bg-background border-white/10 text-white min-h-[100px]" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-muted-foreground text-sm">Budget (USD) *</Label>
                      <Input required type="number" min="1" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} placeholder="10000" className="bg-background border-white/10 text-white" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-muted-foreground text-sm">Campaign Type *</Label>
                      <Select value={form.campaignType} onValueChange={(v) => setForm({ ...form, campaignType: v })}>
                        <SelectTrigger className="bg-background border-white/10 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-white/10">
                          {CAMPAIGN_TYPES.map((t) => (
                            <SelectItem key={t.value} value={t.value} className="text-white hover:bg-white/5">{t.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-muted-foreground text-sm">Start Date</Label>
                      <Input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="bg-background border-white/10 text-white" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-muted-foreground text-sm">End Date</Label>
                      <Input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className="bg-background border-white/10 text-white" />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button type="button" variant="ghost" onClick={() => setShowBookingForm(false)} className="text-muted-foreground hover:text-white flex-1">
                      Cancel
                    </Button>
                    <Button type="submit" disabled={createBooking.isPending} className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold flex-1 gap-2">
                      <Send className="w-4 h-4" />
                      {createBooking.isPending ? "Sending..." : "Send Request"}
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Reviews */}
            <div className="bg-card border border-white/5 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-5">Reviews</h2>
              {!reviews || reviews.length === 0 ? (
                <div className="text-center py-8">
                  <Star className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No reviews yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <motion.div
                      key={review.id}
                      className="border border-white/5 rounded-xl p-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="font-semibold text-white text-sm">{review.reviewerName}</div>
                          {review.reviewerCompany && (
                            <div className="text-xs text-muted-foreground">{review.reviewerCompany}</div>
                          )}
                        </div>
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-white/20"}`} />
                          ))}
                        </div>
                      </div>
                      {review.comment && <p className="text-muted-foreground text-sm leading-relaxed">{review.comment}</p>}
                      <p className="text-xs text-muted-foreground/60 mt-2">{new Date(review.createdAt).toLocaleDateString()}</p>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

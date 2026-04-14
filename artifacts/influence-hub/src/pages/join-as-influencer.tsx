import { useState } from "react";
import { useLocation } from "wouter";
import { useCreateTalent } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  User,
  BarChart3,
  Phone,
  Sparkles,
  Instagram,
  Youtube,
  Twitter,
  Globe,
  Star,
  Users,
  TrendingUp,
  DollarSign,
} from "lucide-react";

const CATEGORIES = [
  { value: "influencer", label: "Influencer", icon: "🌟" },
  { value: "youtuber", label: "YouTuber", icon: "▶️" },
  { value: "fashion_model", label: "Fashion Model", icon: "👗" },
  { value: "celebrity", label: "Celebrity", icon: "🏆" },
  { value: "brand_ambassador", label: "Brand Ambassador", icon: "📢" },
];

const PLATFORMS = [
  { value: "Instagram", icon: <Instagram className="h-4 w-4" /> },
  { value: "YouTube", icon: <Youtube className="h-4 w-4" /> },
  { value: "Twitter", icon: <Twitter className="h-4 w-4" /> },
  { value: "TikTok", icon: <Globe className="h-4 w-4" /> },
  { value: "Facebook", icon: <Globe className="h-4 w-4" /> },
  { value: "LinkedIn", icon: <Globe className="h-4 w-4" /> },
  { value: "Spotify", icon: <Globe className="h-4 w-4" /> },
  { value: "Snapchat", icon: <Globe className="h-4 w-4" /> },
];

const STEPS = [
  { id: 1, label: "Basic Info", icon: <User className="h-4 w-4" /> },
  { id: 2, label: "Audience & Rates", icon: <BarChart3 className="h-4 w-4" /> },
  { id: 3, label: "Contact", icon: <Phone className="h-4 w-4" /> },
];

type FormData = {
  name: string;
  category: string;
  bio: string;
  location: string;
  niche: string;
  profileImageUrl: string;
  followerCount: string;
  engagementRate: string;
  ratePerPost: string;
  ratePerCampaign: string;
  platforms: string[];
  managerName: string;
  managerEmail: string;
};

const INITIAL: FormData = {
  name: "",
  category: "",
  bio: "",
  location: "",
  niche: "",
  profileImageUrl: "",
  followerCount: "",
  engagementRate: "",
  ratePerPost: "",
  ratePerCampaign: "",
  platforms: [],
  managerName: "",
  managerEmail: "",
};

export default function JoinAsInfluencer() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(INITIAL);
  const [submitted, setSubmitted] = useState(false);
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const createTalent = useCreateTalent();

  const set = (field: keyof FormData, value: string | string[]) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const togglePlatform = (platform: string) => {
    set(
      "platforms",
      form.platforms.includes(platform)
        ? form.platforms.filter((p) => p !== platform)
        : [...form.platforms, platform]
    );
  };

  const canNext = () => {
    if (step === 1) return form.name.trim() && form.category && form.bio.trim().length >= 30;
    if (step === 2)
      return (
        form.followerCount && Number(form.followerCount) > 0 && form.ratePerPost && form.platforms.length > 0
      );
    return true;
  };

  const handleSubmit = async () => {
    try {
      await createTalent.mutateAsync({
        name: form.name,
        category: form.category,
        bio: form.bio,
        profileImageUrl: form.profileImageUrl || undefined,
        followerCount: Number(form.followerCount),
        engagementRate: form.engagementRate ? Number(form.engagementRate) : undefined,
        ratePerPost: Number(form.ratePerPost),
        ratePerCampaign: form.ratePerCampaign ? Number(form.ratePerCampaign) : undefined,
        platforms: form.platforms,
        niche: form.niche || undefined,
        location: form.location || undefined,
        managerName: form.managerName || undefined,
        managerEmail: form.managerEmail || undefined,
      });
      setSubmitted(true);
    } catch {
      toast({
        title: "Submission failed",
        description: "Something went wrong. Please check your details and try again.",
        variant: "destructive",
      });
    }
  };

  if (submitted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mb-6 ring-4 ring-primary/20">
            <CheckCircle2 className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">You're on the list!</h1>
          <p className="text-muted-foreground mb-2">
            <span className="text-white font-medium">{form.name}</span>, your profile has been submitted for review.
          </p>
          <p className="text-muted-foreground text-sm mb-8">
            Our team will verify your profile and it will go live within 24–48 hours. You'll be notified at{" "}
            <span className="text-primary">{form.managerEmail || "your email"}</span>.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="border-white/10 hover:bg-white/5" onClick={() => navigate("/explore")}>
              Browse Talent
            </Button>
            <Button className="bg-primary text-primary-foreground font-bold hover:bg-primary/90" onClick={() => { setForm(INITIAL); setStep(1); setSubmitted(false); }}>
              Add Another
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm text-primary mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            For Creators & Influencers
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">
            List Your Profile on <span className="text-primary">InfluenceHub</span>
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Get discovered by thousands of brands, businesses, and agencies actively looking for talent like you.
          </p>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-3 mb-10">
          {[
            { icon: <Users className="h-4 w-4 text-primary" />, value: "16+", label: "Active Creators" },
            { icon: <TrendingUp className="h-4 w-4 text-primary" />, value: "₹2.5Cr+", label: "Campaigns Run" },
            { icon: <Star className="h-4 w-4 text-primary" />, value: "Free", label: "To List Profile" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-white/5 bg-white/[0.02] p-4 text-center">
              <div className="flex justify-center mb-1">{s.icon}</div>
              <div className="text-lg font-bold text-white">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-between mb-8">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center flex-1">
              <button
                onClick={() => step > s.id && setStep(s.id)}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                  step === s.id
                    ? "bg-primary/10 text-primary border border-primary/30"
                    : step > s.id
                    ? "text-primary/60 cursor-pointer hover:text-primary"
                    : "text-muted-foreground cursor-not-allowed"
                }`}
              >
                <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                  step > s.id ? "bg-primary text-black" : step === s.id ? "bg-primary/20 text-primary" : "bg-white/5 text-muted-foreground"
                }`}>
                  {step > s.id ? "✓" : s.id}
                </span>
                <span className="hidden sm:block">{s.label}</span>
              </button>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-px mx-2 ${step > s.id ? "bg-primary/40" : "bg-white/10"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Form card */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 md:p-8">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Tell us about yourself</h2>
                <p className="text-sm text-muted-foreground">Your public profile starts here</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-white/80">Full Name *</label>
                <Input
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-primary/50 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Category *</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => set("category", cat.value)}
                      className={`flex items-center gap-2 rounded-lg border p-3 text-sm font-medium transition-all text-left ${
                        form.category === cat.value
                          ? "border-primary bg-primary/10 text-white"
                          : "border-white/10 bg-white/[0.02] text-muted-foreground hover:border-white/20 hover:text-white"
                      }`}
                    >
                      <span>{cat.icon}</span>
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-white/80">Niche / Specialty</label>
                <Input
                  value={form.niche}
                  onChange={(e) => set("niche", e.target.value)}
                  placeholder="e.g. Fashion & Lifestyle, Tech Reviews, Fitness"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-primary/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-white/80">Location</label>
                <Input
                  value={form.location}
                  onChange={(e) => set("location", e.target.value)}
                  placeholder="e.g. Mumbai, India"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-primary/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-white/80">
                  Bio *{" "}
                  <span className="text-xs text-muted-foreground font-normal">
                    ({form.bio.length}/500 — minimum 30 characters)
                  </span>
                </label>
                <Textarea
                  value={form.bio}
                  onChange={(e) => set("bio", e.target.value)}
                  maxLength={500}
                  rows={4}
                  placeholder="Tell brands what makes you unique — your story, content style, audience, and past collaborations..."
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-primary/50 resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-white/80">Profile Photo URL</label>
                <Input
                  value={form.profileImageUrl}
                  onChange={(e) => set("profileImageUrl", e.target.value)}
                  placeholder="https://example.com/your-photo.jpg"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-primary/50"
                />
                <p className="text-xs text-muted-foreground">Paste a public URL to your profile photo (optional)</p>
              </div>
            </div>
          )}

          {/* Step 2: Audience & Rates */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Audience & Pricing</h2>
                <p className="text-sm text-muted-foreground">Help brands understand your reach and rates</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-white/80 flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-primary" /> Total Followers *
                  </label>
                  <Input
                    type="number"
                    value={form.followerCount}
                    onChange={(e) => set("followerCount", e.target.value)}
                    placeholder="e.g. 500000"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-primary/50"
                  />
                  <p className="text-xs text-muted-foreground">Combined across all platforms</p>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-white/80 flex items-center gap-1.5">
                    <TrendingUp className="h-3.5 w-3.5 text-primary" /> Engagement Rate %
                  </label>
                  <Input
                    type="number"
                    step="0.1"
                    value={form.engagementRate}
                    onChange={(e) => set("engagementRate", e.target.value)}
                    placeholder="e.g. 4.5"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-primary/50"
                  />
                  <p className="text-xs text-muted-foreground">Average likes + comments / followers</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-white/80 flex items-center gap-1.5">
                    <DollarSign className="h-3.5 w-3.5 text-primary" /> Rate per Post (₹) *
                  </label>
                  <Input
                    type="number"
                    value={form.ratePerPost}
                    onChange={(e) => set("ratePerPost", e.target.value)}
                    placeholder="e.g. 25000"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-primary/50"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-white/80 flex items-center gap-1.5">
                    <DollarSign className="h-3.5 w-3.5 text-primary" /> Rate per Campaign (₹)
                  </label>
                  <Input
                    type="number"
                    value={form.ratePerCampaign}
                    onChange={(e) => set("ratePerCampaign", e.target.value)}
                    placeholder="e.g. 150000"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-primary/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Active Platforms *</label>
                <p className="text-xs text-muted-foreground -mt-1">Select all platforms where you create content</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {PLATFORMS.map((p) => (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => togglePlatform(p.value)}
                      className={`flex items-center gap-2 rounded-lg border p-2.5 text-sm font-medium transition-all ${
                        form.platforms.includes(p.value)
                          ? "border-primary bg-primary/10 text-white"
                          : "border-white/10 bg-white/[0.02] text-muted-foreground hover:border-white/20 hover:text-white"
                      }`}
                    >
                      {p.icon}
                      {p.value}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Contact / Manager Info */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Contact & Manager Details</h2>
                <p className="text-sm text-muted-foreground">Brands will reach out to you through this contact</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-white/80">Manager / Contact Name</label>
                <Input
                  value={form.managerName}
                  onChange={(e) => set("managerName", e.target.value)}
                  placeholder="e.g. Rahul Sharma (or your own name)"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-primary/50"
                />
                <p className="text-xs text-muted-foreground">This is the person brands will contact for bookings</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-white/80">Contact Email</label>
                <Input
                  type="email"
                  value={form.managerEmail}
                  onChange={(e) => set("managerEmail", e.target.value)}
                  placeholder="bookings@yourname.com"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-primary/50"
                />
              </div>

              {/* Summary card */}
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 space-y-3">
                <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider">Profile Summary</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Name</span>
                    <p className="text-white font-medium truncate">{form.name || "—"}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Category</span>
                    <p className="text-white font-medium capitalize">{form.category.replace("_", " ") || "—"}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Followers</span>
                    <p className="text-white font-medium">
                      {form.followerCount ? Number(form.followerCount).toLocaleString("en-IN") : "—"}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Rate / Post</span>
                    <p className="text-white font-medium">
                      {form.ratePerPost ? `₹${Number(form.ratePerPost).toLocaleString("en-IN")}` : "—"}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Location</span>
                    <p className="text-white font-medium">{form.location || "—"}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Platforms</span>
                    <p className="text-white font-medium">{form.platforms.join(", ") || "—"}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5">
            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-white gap-2"
              onClick={() => setStep((s) => s - 1)}
              disabled={step === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>
            {step < 3 ? (
              <Button
                className="bg-primary text-primary-foreground font-bold hover:bg-primary/90 gap-2 shadow-[0_0_20px_rgba(0,229,255,0.25)]"
                onClick={() => setStep((s) => s + 1)}
                disabled={!canNext()}
              >
                Continue
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                className="bg-primary text-primary-foreground font-bold hover:bg-primary/90 gap-2 shadow-[0_0_20px_rgba(0,229,255,0.25)] min-w-[140px]"
                onClick={handleSubmit}
                disabled={createTalent.isPending}
              >
                {createTalent.isPending ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Submitting…
                  </span>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Submit Profile
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

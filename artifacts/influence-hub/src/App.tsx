import React, { useEffect, useRef } from "react";
import { Switch, Route, Router as WouterRouter, useLocation, Redirect } from "wouter";
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ClerkProvider, SignIn, SignUp, Show, useClerk } from "@clerk/react";
import NotFound from "@/pages/not-found";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

import Home from "@/pages/home";
import Explore from "@/pages/explore";
import TalentProfile from "@/pages/talent-profile";
import Bookings from "@/pages/bookings";
import BookingDetail from "@/pages/booking-detail";
import Dashboard from "@/pages/dashboard";
import JoinAsInfluencer from "@/pages/join-as-influencer";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;
const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

if (!clerkPubKey) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY");
}

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || "/"
    : path;
}

function ScrollToTop() {
  const [pathname] = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

const clerkAppearance = {
  variables: {
    colorPrimary: "hsl(186 100% 50%)",
    colorBackground: "hsl(240 12% 10%)",
    colorInputBackground: "hsl(240 10% 15%)",
    colorText: "white",
    colorTextSecondary: "hsl(240 5% 70%)",
    borderRadius: "0.75rem",
  },
  elements: {
    card: "shadow-2xl !bg-transparent border-0",
    formButtonPrimary: "!bg-gradient-to-r !from-cyan-400 !to-purple-500 hover:!opacity-90 font-bold !border-0",
    rootBox: "w-full",
    formFieldInput: "!border-white/20 focus:!border-cyan-400",
    socialButtonsBlockButton: "!border-white/20 hover:!border-white/40",
  },
};

const SIGN_IN_BENEFITS = [
  { icon: "🔍", text: "Access 16+ verified influencers & celebrities" },
  { icon: "📱", text: "Sign in with Google, Apple, or mobile number" },
  { icon: "💬", text: "Message talent managers directly" },
  { icon: "📊", text: "Track your campaigns on the dashboard" },
];

const SIGN_UP_BENEFITS = [
  { icon: "📲", text: "OTP sent to your email or mobile to verify" },
  { icon: "🚀", text: "List your brand and start booking today" },
  { icon: "🤝", text: "Connect with India's top influencers" },
  { icon: "💰", text: "All pricing in ₹ INR, no hidden fees" },
  { icon: "✅", text: "Free to register — pay only when you book" },
];

function AuthLayout({ children, title, subtitle, benefits, footerText, footerLink, footerLabel }: {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  benefits: { icon: string; text: string }[];
  footerText: string;
  footerLink: string;
  footerLabel: string;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left panel — vivid gradient branding */}
      <div className="hidden lg:flex lg:w-[48%] xl:w-[45%] flex-col justify-between relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #00e5ff 0%, #7c3aed 55%, #0a0a1a 100%)" }}>
        {/* Decorative blobs */}
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full opacity-30"
          style={{ background: "radial-gradient(circle, #ffffff55 0%, transparent 70%)" }} />
        <div className="absolute bottom-10 right-0 h-96 w-96 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #a855f755 0%, transparent 70%)" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #00e5ff33 0%, transparent 60%)" }} />

        <div className="relative z-10 p-12">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-14">
            <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center shadow-lg">
              <span className="text-white font-black text-xl">✦</span>
            </div>
            <span className="text-2xl font-extrabold text-white tracking-tight">Influence<span className="text-cyan-200">Hub</span></span>
          </div>

          <h2 className="text-4xl font-extrabold text-white leading-tight mb-4 drop-shadow-lg">{title}</h2>
          <p className="text-white/80 text-base mb-10 leading-relaxed max-w-xs">{subtitle}</p>

          <ul className="space-y-5">
            {benefits.map((b, i) => (
              <li key={i} className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center flex-shrink-0 shadow">
                  <span className="text-xl">{b.icon}</span>
                </div>
                <span className="text-white font-medium text-sm">{b.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative z-10 px-12 pb-10 flex items-center gap-3">
          <div className="h-px flex-1 bg-white/20" />
          <span className="text-white/60 text-xs font-medium tracking-wide">Trusted by brands across India</span>
          <div className="h-px flex-1 bg-white/20" />
        </div>
      </div>

      {/* Right panel — dark form area */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 bg-[hsl(240_10%_6%)]">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 justify-center mb-8 lg:hidden">
            <div className="h-9 w-9 rounded-xl flex items-center justify-center shadow-lg"
              style={{ background: "linear-gradient(135deg, #00e5ff, #7c3aed)" }}>
              <span className="text-white font-black text-lg">✦</span>
            </div>
            <span className="text-xl font-extrabold text-white">Influence<span className="text-cyan-400">Hub</span></span>
          </div>

          {/* Glow card behind form */}
          <div className="relative rounded-2xl p-[1px]"
            style={{ background: "linear-gradient(135deg, rgba(0,229,255,0.25), rgba(124,58,237,0.25))" }}>
            <div className="rounded-2xl bg-[hsl(240_10%_9%)] px-6 py-6">
              {children}
            </div>
          </div>

          <p className="text-center text-sm text-white/50 mt-6">
            {footerText}{" "}
            <a href={`${basePath}${footerLink}`}
              className="font-semibold text-transparent bg-clip-text hover:opacity-80 transition"
              style={{ backgroundImage: "linear-gradient(90deg, #00e5ff, #a855f7)" }}>
              {footerLabel}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

function SignInPage() {
  // To update login providers, app branding, or OAuth settings use the Auth
  // pane in the workspace toolbar. More information can be found in the Replit docs.
  return (
    <AuthLayout
      title="Welcome back to InfluenceHub"
      subtitle="Sign in to manage your campaigns, connect with talent, and grow your brand."
      benefits={SIGN_IN_BENEFITS}
      footerText="New to InfluenceHub?"
      footerLink="/sign-up"
      footerLabel="Register as Customer →"
    >
      <SignIn
        routing="path"
        path={`${basePath}/sign-in`}
        signUpUrl={`${basePath}/sign-up`}
        appearance={clerkAppearance}
      />
    </AuthLayout>
  );
}

function SignUpPage() {
  // To update login providers, app branding, or OAuth settings use the Auth
  // pane in the workspace toolbar. More information can be found in the Replit docs.
  return (
    <AuthLayout
      title="Register as a Customer"
      subtitle="Create your free account in seconds. Enter your email or mobile number and we'll send you a one-time OTP to verify."
      benefits={SIGN_UP_BENEFITS}
      footerText="Already have an account?"
      footerLink="/sign-in"
      footerLabel="Sign in →"

    >
      <div className="mb-5 flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
        <span className="text-xl mt-0.5">📲</span>
        <div>
          <p className="text-sm font-semibold text-white">OTP Verification Included</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            After you enter your details, a one-time verification code will be sent to your email (or mobile number if enabled) to confirm your account.
          </p>
        </div>
      </div>
      <SignUp
        routing="path"
        path={`${basePath}/sign-up`}
        signInUrl={`${basePath}/sign-in`}
        appearance={clerkAppearance}
      />
    </AuthLayout>
  );
}

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const qc = useQueryClient();
  const prevUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (prevUserIdRef.current !== undefined && prevUserIdRef.current !== userId) {
        qc.clear();
      }
      prevUserIdRef.current = userId;
    });
    return unsubscribe;
  }, [addListener, qc]);

  return null;
}

function Router() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground dark">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/sign-in/*?" component={SignInPage} />
          <Route path="/sign-up/*?" component={SignUpPage} />
          <Route path="/explore" component={Explore} />
          <Route path="/talent/:id" component={TalentProfile} />
          <Route path="/bookings" component={Bookings} />
          <Route path="/bookings/:id" component={BookingDetail} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/join" component={JoinAsInfluencer} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <ClerkQueryClientCacheInvalidator />
        <TooltipProvider>
          <Router />
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

function App() {
  return (
    <WouterRouter base={basePath}>
      <ClerkProviderWithRoutes />
    </WouterRouter>
  );
}

export default App;

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
    colorBackground: "hsl(240 10% 7%)",
    colorInputBackground: "hsl(240 10% 10%)",
    colorText: "white",
    colorTextSecondary: "hsl(240 5% 64%)",
    borderRadius: "0.75rem",
  },
  elements: {
    card: "shadow-2xl border border-white/10 !bg-transparent",
    formButtonPrimary: "bg-primary hover:bg-primary/90 font-bold",
    rootBox: "w-full",
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
    <div className="min-h-screen bg-background flex">
      {/* Left panel — branding & benefits */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[42%] flex-col justify-between p-12 bg-gradient-to-br from-primary/10 via-secondary/5 to-background border-r border-white/5">
        <div>
          <div className="flex items-center gap-2 mb-12">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-black font-black text-lg">✦</span>
            </div>
            <span className="text-xl font-bold text-white">Influence<span className="text-primary">Hub</span></span>
          </div>
          <h2 className="text-3xl font-extrabold text-white leading-tight mb-3">{title}</h2>
          <p className="text-muted-foreground text-base mb-10 leading-relaxed">{subtitle}</p>
          <ul className="space-y-4">
            {benefits.map((b, i) => (
              <li key={i} className="flex items-center gap-3">
                <span className="text-2xl">{b.icon}</span>
                <span className="text-white/80 text-sm">{b.text}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="text-xs text-muted-foreground/60 flex items-center gap-2">
          <span className="h-1 w-1 rounded-full bg-primary inline-block" />
          Trusted by brands across India
        </div>
      </div>

      {/* Right panel — auth form */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 justify-center mb-8 lg:hidden">
            <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-black font-black">✦</span>
            </div>
            <span className="text-lg font-bold text-white">Influence<span className="text-primary">Hub</span></span>
          </div>
          {children}
          <p className="text-center text-sm text-muted-foreground mt-6">
            {footerText}{" "}
            <a href={`${basePath}${footerLink}`} className="text-primary hover:underline font-medium">
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

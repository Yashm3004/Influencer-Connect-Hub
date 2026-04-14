import { useEffect, useRef } from "react";
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

function SignInPage() {
  // To update login providers, app branding, or OAuth settings use the Auth
  // pane in the workspace toolbar. More information can be found in the Replit docs.
  return (
    <div className="flex min-h-screen items-center justify-center bg-background py-12">
      <SignIn
        routing="path"
        path={`${basePath}/sign-in`}
        signUpUrl={`${basePath}/sign-up`}
        appearance={{
          variables: {
            colorPrimary: "hsl(186 100% 50%)",
            colorBackground: "hsl(240 10% 7%)",
            colorInputBackground: "hsl(240 10% 10%)",
            colorText: "white",
            colorTextSecondary: "hsl(240 5% 64%)",
            borderRadius: "0.75rem",
          },
          elements: {
            card: "shadow-2xl border border-white/10",
            formButtonPrimary: "bg-primary hover:bg-primary/90 font-bold",
          },
        }}
      />
    </div>
  );
}

function SignUpPage() {
  // To update login providers, app branding, or OAuth settings use the Auth
  // pane in the workspace toolbar. More information can be found in the Replit docs.
  return (
    <div className="flex min-h-screen items-center justify-center bg-background py-12">
      <SignUp
        routing="path"
        path={`${basePath}/sign-up`}
        signInUrl={`${basePath}/sign-in`}
        appearance={{
          variables: {
            colorPrimary: "hsl(186 100% 50%)",
            colorBackground: "hsl(240 10% 7%)",
            colorInputBackground: "hsl(240 10% 10%)",
            colorText: "white",
            colorTextSecondary: "hsl(240 5% 64%)",
            borderRadius: "0.75rem",
          },
          elements: {
            card: "shadow-2xl border border-white/10",
            formButtonPrimary: "bg-primary hover:bg-primary/90 font-bold",
          },
        }}
      />
    </div>
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

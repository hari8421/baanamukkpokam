import { useState, useCallback, createContext, useContext } from "react";
import { AnimatePresence } from "framer-motion";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { LandingPage } from "./pages/LandingPage";
import { AuthPage } from "./pages/AuthPage";
import { DashboardPage } from "./pages/DashboardPage";
import { TravelViewPage } from "./pages/TravelViewPage";
import { PostTravelPage } from "./pages/PostTravelPage";
import { TravelerProfilePage } from "./pages/TravelerProfilePage";
import { RelivePage } from "./pages/RelivePage";

// Initialize Convex client
const convexUrl = import.meta.env.VITE_CONVEX_URL;
const convex = convexUrl ? new ConvexReactClient(convexUrl) : null;

// Client-side routing
type Route =
  | "landing"
  | "auth"
  | "dashboard"
  | "travel-view"
  | "post-travel"
  | "traveler-profile"
  | "relive";

interface AppState {
  route: Route;
  user: {
    id: string;
    name: string;
    email: string;
    convexId?: string;
  } | null;
  viewingTravelId: string | null;
  viewingTravelerId: string | null;
  guestMode: boolean;
}

const defaultState: AppState = {
  route: "landing",
  user: null,
  viewingTravelId: null,
  viewingTravelerId: null,
  guestMode: false,
};

interface AppContextType {
  state: AppState;
  hasConvex: boolean;
  navigate: (
    route: Route,
    opts?: {
      travelId?: string;
      travelerId?: string;
      guestMode?: boolean;
    }
  ) => void;
  login: (user: {
    id: string;
    name: string;
    email: string;
    convexId?: string;
  }) => void;
  logout: () => void;
}

export const AppContext = createContext<AppContextType | null>(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppContext");
  return ctx;
}

export function App() {
  const [state, setState] = useState<AppState>(defaultState);

  const navigate = useCallback(
    (
      route: Route,
      opts?: {
        travelId?: string;
        travelerId?: string;
        guestMode?: boolean;
      }
    ) => {
      setState((s) => ({
        ...s,
        route,
        viewingTravelId: opts?.travelId ?? s.viewingTravelId,
        viewingTravelerId: opts?.travelerId ?? s.viewingTravelerId,
        guestMode: opts?.guestMode ?? s.guestMode,
      }));
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    []
  );

  const login = useCallback(
    (user: { id: string; name: string; email: string; convexId?: string }) => {
      setState((s) => ({
        ...s,
        user,
        guestMode: false,
        route: "dashboard",
      }));
    },
    []
  );

  const logout = useCallback(() => {
    setState((s) => ({
      ...s,
      user: null,
      guestMode: false,
      route: "landing",
    }));
  }, []);

  const renderRoute = () => {
    switch (state.route) {
      case "landing":
        return <LandingPage key="landing" />;
      case "auth":
        return <AuthPage key="auth" />;
      case "dashboard":
        return <DashboardPage key="dashboard" />;
      case "travel-view":
        return <TravelViewPage key="travel-view" />;
      case "post-travel":
        return <PostTravelPage key="post-travel" />;
      case "traveler-profile":
        return <TravelerProfilePage key="traveler-profile" />;
      case "relive":
        return <RelivePage key="relive" />;
      default:
        return <LandingPage key="landing" />;
    }
  };

  const appContent = (
    <AppContext.Provider value={{ state, hasConvex: !!convex, navigate, login, logout }}>
      <div className="min-h-screen bg-vintage-parchment">
        <AnimatePresence mode="wait">{renderRoute()}</AnimatePresence>
      </div>
    </AppContext.Provider>
  );

  // Wrap in ConvexProvider if configured
  if (convex) {
    return <ConvexProvider client={convex}>{appContent}</ConvexProvider>;
  }

  return appContent;
}

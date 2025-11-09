import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import ChatPage from "@/pages/ChatPage";
import MessagesPage from "@/pages/MessagesPage";
import LawyersPage from "@/pages/LawyersPage";
import VaultPage from "@/pages/VaultPage";
import SettingsPage from "@/pages/SettingsPage";
import RoleSelection from "@/pages/RoleSelection";
import LawyerOnboarding from "@/pages/LawyerOnboarding";
import LawyerDashboard from "@/pages/LawyerDashboard";
import NotFound from "@/pages/not-found";

function AuthenticatedRouter() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, show landing page
  if (!user) {
    return <Landing />;
  }

  // If user doesn't have a role yet, show role selection
  if (!user.role || user.role === "user") {
    if (user.role === "user") {
      // Regular user flow
      return (
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/chat" component={ChatPage} />
          <Route path="/messages" component={MessagesPage} />
          <Route path="/lawyers" component={LawyersPage} />
          <Route path="/vault" component={VaultPage} />
          <Route path="/settings" component={SettingsPage} />
          <Route component={NotFound} />
        </Switch>
      );
    } else {
      // No role assigned yet
      return <RoleSelection />;
    }
  }

  // If user is a lawyer but hasn't created profile
  if (user.role === "lawyer" && !user.lawyerProfile) {
    return (
      <Switch>
        <Route path="/" component={LawyerOnboarding} />
        <Route path="/lawyer-onboarding" component={LawyerOnboarding} />
        <Route component={LawyerOnboarding} />
      </Switch>
    );
  }

  // Lawyer with profile - show lawyer dashboard
  if (user.role === "lawyer") {
    return (
      <Switch>
        <Route path="/" component={LawyerDashboard} />
        <Route path="/lawyer-dashboard" component={LawyerDashboard} />
        <Route path="/chat" component={ChatPage} />
        <Route path="/messages" component={MessagesPage} />
        <Route path="/settings" component={SettingsPage} />
        <Route component={NotFound} />
      </Switch>
    );
  }

  return <NotFound />;
}

function DashboardLayout() {
  const { user, isLoading } = useAuth();
  
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  // Don't show sidebar for unauthenticated users or role selection
  if (isLoading || !user || !user.role) {
    return <AuthenticatedRouter />;
  }

  // Don't show sidebar for lawyer onboarding
  if (user.role === "lawyer" && !user.lawyerProfile) {
    return <AuthenticatedRouter />;
  }

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1">
          <header className="flex items-center justify-between p-4 border-b">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <ThemeToggle />
          </header>
          <main className="flex-1 overflow-auto">
            <AuthenticatedRouter />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <DashboardLayout />
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

// src/App.tsx

import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Sidebar from "@/components/layout/Sidebar";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/AuthPage";
import CampaignHistoryPage from "./pages/CampaignHistoryPage";
import CreateCampaignPage from "./pages/CreateCampaignPage";
import ApiDocPage from "./pages/ApiDocPage";
import AudiencePage from "./pages/AudiencePage";
import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";

// Loading Screen
const LoadingScreen = () => (
  <div className="flex h-screen items-center justify-center text-lg font-semibold">
    Loading...
  </div>
);

// Protected route
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/auth" replace />;
  return <>{children}</>;
};

// Auth-only route
const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  if (user) return <Navigate to="/" replace />;
  return <>{children}</>;
};

// Main layout with sidebar
const MainLayout = ({
  children,
  collapsed,
  setCollapsed,
}: {
  children: React.ReactNode;
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
}) => (
  <div className="flex h-screen overflow-hidden">
    <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
    <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-neutral-900">
      {children}
    </main>
  </div>
);

// Route configuration
const AppRoutes = ({
  sidebarCollapsed,
  setSidebarCollapsed,
}: {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (val: boolean) => void;
}) => {
  return (
    <Routes>
      <Route
        path="/auth"
        element={
          <AuthRoute>
            <AuthPage />
          </AuthRoute>
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed}>
              <Index />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/campaigns"
        element={
          <ProtectedRoute>
            <MainLayout collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed}>
              <CampaignHistoryPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/campaigns/new"
        element={
          <ProtectedRoute>
            <MainLayout collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed}>
              <CreateCampaignPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/api-docs"
        element={
          <ProtectedRoute>
            <MainLayout collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed}>
              <ApiDocPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/audience"
        element={
          <ProtectedRoute>
            <MainLayout collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed}>
              <AudiencePage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <MainLayout collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed}>
              <ReportsPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <MainLayout collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed}>
              <SettingsPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

// Query client for react-query
const queryClient = new QueryClient();

// App entry
const App = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <AppRoutes
              sidebarCollapsed={sidebarCollapsed}
              setSidebarCollapsed={setSidebarCollapsed}
            />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;


import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Activities from "./pages/Activities";  
import LoginForm from "./components/auth/LoginForm";
import NotFound from "./pages/NotFound";
import { Activity } from "lucide-react";
import ActivitiesPaginated from "./pages/ActiviesPagination";
import CreateActivity from "./pages/CreateActivityPage";
import StudentAssignmentDetails from "./pages/StudentAssignmentDetails";

const queryClient = new QueryClient();

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-purple-50">
      <LoginForm />
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/activities" element={<ActivitiesPaginated />} />
          <Route path="/activity" element={<Activity />} />
          <Route path="/activitiespagination" element={<ActivitiesPaginated />} />
          <Route path="/activities/create" element={<CreateActivity />} />
          <Route path="/logout" element={<Navigate to="/" />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="/studentassignmentdetails/:activityId" element={<StudentAssignmentDetails />} />
          <Route path="*" element={<NotFound />} />s
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

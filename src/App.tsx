import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import ScrollToTop from "./components/ScrollToTop";
import Index from "./pages/Index";
import ClassroomPage from "./pages/ClassroomPage";
import CourseDetailPage from "./pages/CourseDetailPage";
import BrainPopPage from "./pages/BrainPopPage";
import TechieBitesPage from "./pages/TechieBitesPage";
import TimePassPage from "./pages/TimePassPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/classroom" element={<ClassroomPage />} />
            <Route path="/classroom/:slug" element={<CourseDetailPage />} />
            <Route path="/brainpops" element={<BrainPopPage />} />
            <Route path="/techiebites" element={<TechieBitesPage />} />
            <Route path="/timepass" element={<TimePassPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;

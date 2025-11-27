import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { MainLayout } from "./layout/MainLayout";
import { ScalePage } from "./pages/ScalePage";
import { VisualNarrativePage } from "./pages/VisualNarrativePage";
import { ChatPage } from "./pages/ChatPage";
import { ReportPage } from "./pages/ReportPage";
import { InterventionPage } from "./pages/InterventionPage";
import { AuthPage } from "./pages/AuthPage";
import { ReadingPage } from "./pages/ReadingPage";
import { InterviewPage } from "./pages/InterviewPage";
import { SchoolDashboardPage } from "./pages/SchoolDashboardPage";

export const App = () => {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/scale" replace />} />
          <Route path="/login" element={<AuthPage mode="login" />} />
          <Route path="/register" element={<AuthPage mode="register" />} />
          <Route path="/scale" element={<ScalePage />} />
          <Route path="/visual-narrative" element={<VisualNarrativePage />} />
          <Route path="/reading" element={<ReadingPage />} />
          <Route path="/interview" element={<InterviewPage />} />
          <Route path="/diagnosis" element={<ChatPage />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/school/dashboard" element={<SchoolDashboardPage />} />
          <Route path="/intervention" element={<InterventionPage />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
};

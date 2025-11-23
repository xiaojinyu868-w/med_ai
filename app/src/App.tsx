import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { MainLayout } from './layout/MainLayout';
import { ScalePage } from './pages/ScalePage';
import { VisualNarrativePage } from './pages/VisualNarrativePage';
import { ChatPage } from './pages/ChatPage';
import { ReportPage } from './pages/ReportPage';
import { InterventionPage } from './pages/InterventionPage';

export const App = () => {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/scale" replace />} />
          <Route path="/scale" element={<ScalePage />} />
          <Route path="/visual-narrative" element={<VisualNarrativePage />} />
          <Route path="/diagnosis" element={<ChatPage />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/intervention" element={<InterventionPage />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
};

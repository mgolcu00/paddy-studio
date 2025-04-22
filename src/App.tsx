import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { AuthProvider } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { Toaster } from '@/components/ui/toaster';

import {
  LandingPage,
  AuthPage,
  UserDashboard,
  ProjectOverview,
  EditorPage,
  PricingPage,
  LegalPage,
  NotFoundPage,
  UserSettingsPage
} from '@/pages';

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/privacy-policy" element={<LegalPage />} />
            <Route path="/terms" element={<LegalPage />} />
            
            {/* Protected Routes */}
            <Route 
              path="/console" 
              element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/console/:projectId" 
              element={
                <ProtectedRoute>
                  <ProjectOverview />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/console/editor/:projectId/:pageId"
              element={
                <ProtectedRoute>
                  <EditorPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/console/settings"
              element={
                <ProtectedRoute>
                  <UserSettingsPage /> 
                </ProtectedRoute>
              }
            />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
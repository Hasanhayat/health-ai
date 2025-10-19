import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from './components/ui/sonner';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { DashboardPage } from './pages/DashboardPage';
import { FamilyMemberDetailsPage } from './pages/FamilyMemberDetailsPage';
import { isAuthenticated } from './services/auth';

export default function App() {
  return (
    <Router>
      <Toaster position="top-center" richColors />
      <Routes>
        <Route
          path="/"
          element={isAuthenticated() ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />}
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/family-member/:id"
          element={
            <ProtectedRoute>
              <FamilyMemberDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="*"
          element={isAuthenticated() ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </Router>
  );
}

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import NotFound from "./pages/OtherPage/NotFound";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import SpeechGenerator from "./pages/SpeechGenerator";
import SpeakingTips from "./pages/SpeakingTips";
import SpeechHistory from "./pages/SpeechHistory";
import UserProfiles from "./pages/UserProfiles";
import { AuthProvider, useAuth } from "./context/AuthContext";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/signin" replace />;
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout - Protected */}
          <Route element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }>
            <Route index path="/" element={<SpeechGenerator />} />
            <Route path="/speaking-tips" element={<SpeakingTips />} />
            <Route path="/speech-history" element={<SpeechHistory />} />
            <Route path="/profile" element={<UserProfiles />} />
          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

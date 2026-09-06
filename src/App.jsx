import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import { Navigate } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import MedLayout from '@/components/med/Layout';
import Welcome from '@/pages/Welcome';
import Scan from '@/pages/Scan';
import Library from '@/pages/Library';
import MedicationDetail from '@/pages/MedicationDetail';
import Allergies from '@/pages/Allergies';
import Profile from '@/pages/Profile';
import Alarms from '@/pages/Alarms';
import Household from '@/pages/Household';
import { MemberProvider } from '@/lib/MemberContext';
import { LanguageProvider } from '@/lib/LanguageProvider';
import { ProfileProvider } from '@/lib/ProfileContext';
import ProfileGate from '@/components/ProfileGate';
import RememberGate from '@/components/RememberGate';

// Inner app that only renders once the providers are mounted. Decides what to
// show based on auth/loading state, then mounts the route tree.
const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth.
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app. Public auth routes are outside the guard; everything
  // else is nested under ProtectedRoute → RememberGate → ProfileGate → MedLayout
  // so a user must be signed in, acknowledged, and have a profile to reach the
  // working screens.
  return (
    <Routes>
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/welcome" replace />} />}>
        <Route element={<RememberGate />}>
        <Route element={<MemberProvider><ProfileProvider><ProfileGate /></ProfileProvider></MemberProvider>}>
          <Route element={<MedLayout />}>
            <Route path="/" element={<Scan />} />
            <Route path="/library" element={<Library />} />
            <Route path="/medication" element={<MedicationDetail />} />
            <Route path="/allergies" element={<Allergies />} />
            <Route path="/alarms" element={<Alarms />} />
            <Route path="/household" element={<Household />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>
        </Route>
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


// Root component: wraps the app in the auth, query, language and router
// providers, plus the toast notifier, then renders AuthenticatedApp.
function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <LanguageProvider>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        </LanguageProvider>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App
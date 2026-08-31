import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';

// Spinner shown while auth is being verified.
const DefaultFallback = () => (
  <div className="fixed inset-0 flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
  </div>
);

// Route guard: only renders its child routes when the user is authenticated.
// While auth is loading it shows a spinner; if the user isn't registered it
// shows the not-registered screen; otherwise it redirects unauthenticated
// users to the provided element (the Welcome page).
export default function ProtectedRoute({ fallback = <DefaultFallback />, unauthenticatedElement }) {
  const { isAuthenticated, isLoadingAuth, authChecked, authError, checkUserAuth } = useAuth();

  // Kick off an auth check if we haven't done one yet this session.
  useEffect(() => {
    if (!authChecked && !isLoadingAuth) {
      checkUserAuth();
    }
  }, [authChecked, isLoadingAuth, checkUserAuth]);

  // Still checking — show the spinner.
  if (isLoadingAuth || !authChecked) {
    return fallback;
  }

  // Auth errors: not-registered gets a dedicated screen; anything else is
  // treated as unauthenticated.
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    }
    return unauthenticatedElement;
  }

  if (!isAuthenticated) {
    return unauthenticatedElement;
  }

  // Authenticated — render the nested routes.
  return <Outlet />;
}
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import Landing from './pages/Landing';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import AuthCallback from './pages/AuthCallback';

import DashboardLayout from './pages/dashboard/DashboardLayout';
import Create from './pages/dashboard/Create';
import MyReels from './pages/dashboard/MyReels';
import Credits from './pages/dashboard/Credits';
import Settings from './pages/dashboard/Settings';

function Protected({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-void">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-stroke border-t-accent" />
      </div>
    );
  }
  return user ? children : <Navigate to="/signin" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/auth/callback" element={<AuthCallback />} />

      <Route
        path="/app"
        element={
          <Protected>
            <DashboardLayout />
          </Protected>
        }
      >
        <Route index element={<Navigate to="create" replace />} />
        <Route path="create" element={<Create />} />
        <Route path="reels" element={<MyReels />} />
        <Route path="credits" element={<Credits />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

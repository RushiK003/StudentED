import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import HabitTracker from './pages/HabitTracker';
import TeacherUpload from './pages/TeacherUpload';
import AcademicView from './pages/AcademicView';
import DoubtForum from './pages/DoubtForum';
import TeacherDoubts from './pages/TeacherDoubts';
import TeacherAnalytics from './pages/TeacherAnalytics';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return <Layout>{children}</Layout>;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/habits"
            element={
              <ProtectedRoute>
                <HabitTracker />
              </ProtectedRoute>
            }
          />
          <Route
            path="/academic"
            element={
              <ProtectedRoute>
                <AcademicView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/classes"
            element={
              <ProtectedRoute>
                <TeacherUpload />
              </ProtectedRoute>
            }
          />
          <Route
            path="/forum"
            element={
              <ProtectedRoute>
                <DoubtForum />
              </ProtectedRoute>
            }
          />
          <Route
            path="/review-doubts"
            element={
              <ProtectedRoute>
                <TeacherDoubts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <TeacherAnalytics />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" />} />
          {/* Placeholder for other routes */}
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

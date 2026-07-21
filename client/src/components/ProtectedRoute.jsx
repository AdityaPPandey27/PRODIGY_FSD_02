import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute acts as a wrapper for routes that require the user to be logged in.
 * If the user is authenticated, it renders the child components.
 * If not, it redirects them to the login page.
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // While checking the auth status on initial load, show a loading spinner or blank screen
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-brand-600"></div>
      </div>
    );
  }

  // If not authenticated, redirect to the login page, replacing the current history entry
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the requested page
  return children;
};

export default ProtectedRoute;
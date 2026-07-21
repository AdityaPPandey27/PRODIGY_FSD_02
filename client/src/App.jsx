import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components & Layouts
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Departments from './pages/Departments';
import Employees from './pages/Employees';
import AddEmployee from './pages/AddEmployee';
import EditEmployee from './pages/EditEmployee';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes wrapped in DashboardLayout */}
        <Route 
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* These routes will render inside the <Outlet /> of DashboardLayout */}
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Placeholders for future routes, mapping them to Dashboard temporarily so they don't crash */}
          <Route path="/employees" element={<Employees />} />
          <Route path="/employees/add" element={<AddEmployee />} />
          <Route path="/employees/edit/:id" element={<EditEmployee />} />
          <Route path="/departments" element={<Departments />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Redirect root to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
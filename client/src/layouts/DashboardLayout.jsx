import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar Component */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Navbar Component */}
        <Navbar toggleSidebar={toggleSidebar} />

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6">
          {/* Outlet is where React Router will inject our page components (Dashboard, Employees, etc.) */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
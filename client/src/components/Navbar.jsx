import { FiMenu, FiBell } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ toggleSidebar }) => {
  const { user } = useAuth();

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 shadow-sm">
      {/* Left side: Hamburger menu for mobile */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 lg:hidden"
        >
          <FiMenu size={24} />
        </button>
        
        {/* We can dynamically inject page titles here later if needed, leaving it blank for now */}
        <h2 className="hidden text-lg font-semibold text-gray-800 sm:block">
          Welcome back, {user?.name?.split(' ')[0] || 'Admin'}
        </h2>
      </div>

      {/* Right side: User profile & Notifications */}
      <div className="flex items-center gap-4">
        <button className="relative rounded-full p-2 text-gray-500 hover:bg-gray-100">
          <FiBell size={20} />
          {/* Notification Dot indicator */}
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
        </button>
        
        <div className="flex items-center gap-3 border-l pl-4 border-gray-200">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-brand-700 font-bold">
            {/* Display first letter of admin's name */}
            {user?.name?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div className="hidden flex-col sm:flex">
            <span className="text-sm font-medium text-gray-700">{user?.name || 'Administrator'}</span>
            <span className="text-xs text-gray-500">System Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
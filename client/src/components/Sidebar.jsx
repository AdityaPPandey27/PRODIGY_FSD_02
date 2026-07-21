import { NavLink } from 'react-router-dom';
import { FiHome, FiUsers, FiBriefcase, FiUser, FiLogOut, FiX } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { logout } = useAuth();

  // Navigation items array for easy mapping
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <FiHome size={20} /> },
    { name: 'Employees', path: '/employees', icon: <FiUsers size={20} /> },
    { name: 'Departments', path: '/departments', icon: <FiBriefcase size={20} /> },
    { name: 'Profile', path: '/profile', icon: <FiUser size={20} /> },
  ];

  return (
    <>
      {/* Mobile Overlay (Darkens background when sidebar is open on small screens) */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/50 transition-opacity lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 transform flex-col justify-between bg-brand-900 text-white transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } flex`}
      >
        <div>
          {/* Sidebar Header */}
          <div className="flex h-16 items-center justify-between px-6 bg-brand-950">
            <span className="text-xl font-bold tracking-wider text-white">
              Admin<span className="text-brand-400">Portal</span>
            </span>
            {/* Close button for mobile */}
            <button onClick={toggleSidebar} className="text-gray-300 hover:text-white lg:hidden">
              <FiX size={24} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="mt-6 flex flex-col gap-2 px-4">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-brand-600 text-white'
                      : 'text-gray-300 hover:bg-brand-800 hover:text-white'
                  }`
                }
              >
                {item.icon}
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer (Logout) */}
        <div className="p-4">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-300 transition-colors hover:bg-red-500/10 hover:text-red-400"
          >
            <FiLogOut size={20} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
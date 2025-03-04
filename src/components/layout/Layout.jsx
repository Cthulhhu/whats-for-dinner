import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import MobileMenu from './MobileMenu';

const Layout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop Sidebar - Hidden on mobile */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      
      {/* Mobile Menu - Hidden on desktop */}
      <MobileMenu />
      
      {/* Main Content - Adjusted for different screen sizes */}
      <main className="flex-1 pt-4 px-4 pb-8 sm:px-6 lg:ml-60 lg:px-8">
        {/* Extra top padding on mobile to account for the fixed header */}
        <div className="mt-16 lg:mt-0">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import Sidebar from './Sidebar';

const Layout = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const showSidebar = location.pathname === '/' || 
                       location.pathname.startsWith('/library') || 
                       location.pathname.startsWith('/wishlist') ||
                       location.pathname.startsWith('/compare');

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  // Page transition animation
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 700);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0a0a] relative">
      {/* Red gradient overlay for depth */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-70">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-red-950/15"></div>
        <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-transparent to-red-900/12"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-red-950/8 via-transparent to-red-900/8"></div>
      </div>
      
      <Navbar onMenuClick={showSidebar ? toggleSidebar : undefined} />
      <div className="flex flex-grow relative">
        {showSidebar && (
          <>
            {/* Mobile Overlay */}
            {sidebarOpen && (
              <div 
                className="fixed inset-0 bg-black/70 z-30 lg:hidden animate-fade-in"
                onClick={closeSidebar}
              />
            )}
            {/* Sidebar - Hidden on mobile unless open */}
            <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform ease-out`} style={{ transitionDuration: '400ms' }}>
              <Sidebar onLinkClick={closeSidebar} />
            </div>
          </>
        )}
        <main className={`flex-grow ${showSidebar ? 'lg:ml-64' : ''} transition-all relative z-10 min-h-full`} style={{ transitionDuration: '400ms' }}>
          <div className={`min-h-full ${isAnimating ? 'animate-fade-in' : ''}`}>
            <Outlet />
          </div>
        </main>
      </div>
      {!showSidebar && <Footer />}
    </div>
  );
};

export default Layout;


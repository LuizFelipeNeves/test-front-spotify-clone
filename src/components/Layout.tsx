import { type ReactNode, useState } from 'react';
import { Sidebar } from './Sidebar';
import { Menu, X } from 'lucide-react';

interface LayoutProps {
  children?: ReactNode;
  className?: string;
}

export function Layout({ children, className = '' }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className={`flex h-screen bg-black text-white ${className}`}>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 bg-gray-900 rounded-lg md:hidden hover:bg-gray-800 transition-colors"
        aria-label="Toggle menu"
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={closeSidebar}
        className="z-50"
      />
      
      {/* Main Content Area */}
      <main className="flex-1 overflow-auto md:ml-0">
        <div className="pt-16 md:pt-0">
          {children}
        </div>
      </main>
    </div>
  );
}

export default Layout;
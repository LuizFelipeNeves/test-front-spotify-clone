import { type ReactNode } from 'react';
import { Sidebar } from './Sidebar';

interface LayoutProps {
  children?: ReactNode;
  className?: string;
}

export function Layout({ children, className = '' }: LayoutProps) {
  return (
    <div className={`flex h-screen bg-black text-white ${className}`}>
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}

export default Layout;
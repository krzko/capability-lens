'use client';

import { FC, ReactNode } from 'react';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen">
      <div className="hidden md:flex md:w-64 md:flex-col">
        <Sidebar />
      </div>
      <div className="flex flex-1 flex-col">
        <main className="flex-1 overflow-y-auto bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;

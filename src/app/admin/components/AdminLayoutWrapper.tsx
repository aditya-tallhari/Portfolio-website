'use client';

import { usePathname } from 'next/navigation';
import { AuthGuard } from '../AuthGuard';
import { AdminSidebar } from './AdminSidebar';

export const AdminLayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <AuthGuard>
      <div className="h-screen bg-[var(--bg-primary)] flex overflow-hidden">
        <AdminSidebar />
        <main className="flex-1 min-w-0 overflow-y-auto p-6 lg:p-10 scroll-smooth">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
};

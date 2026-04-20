import { AuthProvider } from './context/AuthContext';
import { ColorModeProvider } from '@/providers/ColorModeProvider';
import { AdminLayoutWrapper } from './components/AdminLayoutWrapper';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ColorModeProvider>
      <AuthProvider>
        <AdminLayoutWrapper>
          {children}
        </AdminLayoutWrapper>
      </AuthProvider>
    </ColorModeProvider>
  );
}

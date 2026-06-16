'use client';

import { AuthProvider } from '@/hooks/useAuth';
import { NotyfProvider } from '@/components/NotyfProvider';

export default function Providers({ children }) {
  return (
    <AuthProvider>
      <NotyfProvider>
        {children}
      </NotyfProvider>
    </AuthProvider>
  );
}

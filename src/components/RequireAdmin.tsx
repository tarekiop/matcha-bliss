import { Navigate } from 'react-router-dom';
import { isAdminAuthenticated } from '@/lib/admin-auth';

export function RequireAdmin({ children }: { children: React.ReactNode }) {
  if (!isAdminAuthenticated()) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
}

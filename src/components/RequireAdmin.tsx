import { Navigate } from 'react-router-dom';

export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const ok = sessionStorage.getItem('matcha_admin_auth') === '1';
  if (!ok) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
}

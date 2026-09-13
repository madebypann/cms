import { Bell, Sun } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Topbar() {
  const { user } = useAuth();
  const initial = user?.email?.[0]?.toUpperCase() || '?';

  return (
    <header className="topbar">
      <div className="topbar-brand">School CMS</div>
    </header>
  );
}
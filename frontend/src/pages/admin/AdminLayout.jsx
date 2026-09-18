import { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Image, FileText, LogOut, ChevronDown, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Topbar from '../../components/Topbar';
import { CONTENT_CATEGORIES } from '../../config/contentCategories';
import { TEXT_SECTIONS } from '../../config/textSections';

export default function AdminLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isContentActive = location.pathname.startsWith('/controlpanel/content');
  const [contentOpen, setContentOpen] = useState(isContentActive);

  const isTextActive = location.pathname.startsWith('/controlpanel/text');
  const [textOpen, setTextOpen] = useState(isTextActive);

  const handleLogout = async () => {
    await logout();
    navigate('/controlpanel/login');
  };

  const linkClass = ({ isActive }) => (isActive ? 'active' : '');

  return (
    <div className="admin-shell">
      <Topbar />
      <div className="admin-shell-body">
        <aside className="admin-sidebar">
          <nav className="admin-nav">
            <NavLink to="/controlpanel" end className={linkClass}>
              <LayoutDashboard size={16} /> Dashboard
            </NavLink>

            <button
              type="button"
              className={`admin-nav-toggle ${isContentActive ? 'active' : ''}`}
              onClick={() => setContentOpen((prev) => !prev)}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Image size={16} /> Content
              </span>
              {contentOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>

            {contentOpen && (
              <div className="admin-submenu">
                {CONTENT_CATEGORIES.map((c) => (
                  <NavLink key={c.key} to={`/controlpanel/content/${c.key}`} className={linkClass}>
                    {c.label}
                  </NavLink>
                ))}
              </div>
            )}

            <button
              type="button"
              className={`admin-nav-toggle ${isTextActive ? 'active' : ''}`}
              onClick={() => setTextOpen((prev) => !prev)}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <FileText size={16} /> Teks
              </span>
              {textOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>

            {textOpen && (
              <div className="admin-submenu">
                {TEXT_SECTIONS.map((s) => (
                  <NavLink key={s.key} to={`/controlpanel/text/${s.key}`} className={linkClass}>
                    {s.label}
                  </NavLink>
                ))}
              </div>
            )}
          </nav>

          <div className="admin-sidebar-footer">
            <div className="admin-user-email">{user?.email}</div>
            <button
              onClick={handleLogout}
              className="btn btn-secondary"
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        </aside>

        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
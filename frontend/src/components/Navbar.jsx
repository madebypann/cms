import { NavLink } from 'react-router-dom';

export default function Navbar() {
  const linkClass = ({ isActive }) => (isActive ? 'active' : '');

  return (
    <header className="public-navbar">
      <NavLink to="/" className="public-navbar-brand">
        Nama Sekolah
      </NavLink>
      <nav className="public-navbar-links">
        <NavLink to="/" end className={linkClass}>Beranda</NavLink>
        <NavLink to="/tentang" className={linkClass}>Tentang</NavLink>

        <div className="navbar-dropdown">
          <button className="navbar-dropdown-trigger">Akademik ▾</button>
          <div className="navbar-dropdown-menu">
            <a href="/akademik#kurikulum">Kurikulum</a>
            <a href="/akademik#ekstrakurikuler">Ekstrakurikuler</a>
            <a href="/akademik#guru">Guru</a>
          </div>
        </div>

        <NavLink to="/prestasi" className={linkClass}>Prestasi</NavLink>
        <NavLink to="/fasilitas" className={linkClass}>Fasilitas</NavLink>
      </nav>
    </header>
  );
}
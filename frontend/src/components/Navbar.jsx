import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolledPast, setScrolledPast] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolledPast(window.scrollY > 10);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // kunci scroll body selagi menu mobile terbuka, supaya konten di belakang tidak ikut geser
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const isSolid = !isHome || scrolledPast;

  const linkClass = ({ isActive }) => (isActive ? 'active' : '');

  const closeMobileMenu = () => setMobileOpen(false);

  const logoSrc = isSolid ? '/logo-black.png' : '/logo-white.png';

  return (
    <>
      <header className={`public-navbar ${isSolid ? 'scrolled' : ''}`}>
        <NavLink to="/" className="public-navbar-brand" onClick={closeMobileMenu}>
          <img src={logoSrc} alt="Logo Sekolah" className="public-navbar-logo" />
        </NavLink>

        <nav className="public-navbar-links">
          <NavLink to="/" end className={linkClass}>Beranda</NavLink>
          <NavLink to="/tentang" className={linkClass}>Tentang</NavLink>
          <NavLink to="/akademik" className={linkClass}>Akademik</NavLink>
          <NavLink to="/prestasi" className={linkClass}>Prestasi</NavLink>
          <NavLink to="/fasilitas" className={linkClass}>Fasilitas</NavLink>
        </nav>

        <button className="navbar-burger" onClick={() => setMobileOpen(true)} aria-label="Buka menu">
          <Menu size={26} />
        </button>
      </header>

      {/* Backdrop gelap di belakang panel, klik untuk menutup */}
      <div
        className={`navbar-mobile-backdrop ${mobileOpen ? 'open' : ''}`}
        onClick={closeMobileMenu}
      />

      {/* Panel drawer dari kiri */}
      <div className={`navbar-mobile-menu ${mobileOpen ? 'open' : ''}`}>
        <div className="navbar-mobile-header">
          <img src="/logo-black.png" alt="Logo Sekolah" className="navbar-mobile-logo" />
          <button className="navbar-mobile-close" onClick={closeMobileMenu} aria-label="Tutup menu">
            <X size={24} />
          </button>
        </div>

        <NavLink to="/" end className={linkClass} onClick={closeMobileMenu}>Beranda</NavLink>
        <NavLink to="/tentang" className={linkClass} onClick={closeMobileMenu}>Tentang</NavLink>
        <NavLink to="/akademik" className={linkClass} onClick={closeMobileMenu}>Akademik</NavLink>
        <NavLink to="/prestasi" className={linkClass} onClick={closeMobileMenu}>Prestasi</NavLink>
        <NavLink to="/fasilitas" className={linkClass} onClick={closeMobileMenu}>Fasilitas</NavLink>
      </div>
    </>
  );
}
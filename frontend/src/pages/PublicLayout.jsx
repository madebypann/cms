import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PopupAd from '../components/PopupAd';

export default function PublicLayout() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="public-body">
      <PopupAd />
      <Navbar />
      <main className={isHome ? '' : 'public-page-offset'}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
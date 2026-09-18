import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import api from '../lib/api';

export default function PopupAd() {
  const [popup, setPopup] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // cuma tampil sekali per sesi browser (tidak muncul terus tiap pindah halaman)
    const alreadyShown = sessionStorage.getItem('popup_shown');
    if (alreadyShown) return;

    api
      .get('/galleries?category=popup')
      .then((res) => {
        if (res.data.length > 0) {
          setPopup(res.data[0]); // ambil yang pertama/terbaru saja
          setVisible(true);
          sessionStorage.setItem('popup_shown', 'true');
        }
      })
      .catch(() => {});
  }, []);

  if (!visible || !popup) return null;

  const handleImageClick = () => {
    if (popup.redirect_url) {
      window.open(popup.redirect_url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="popup-overlay" onClick={() => setVisible(false)}>
      <div className="popup-box" onClick={(e) => e.stopPropagation()}>
        <button className="popup-close" onClick={() => setVisible(false)} aria-label="Tutup">
          <X size={18} />
        </button>

        {popup.redirect_url ? (
          <div className="popup-image-link" onClick={handleImageClick}>
            <img src={popup.image_url} alt={popup.title || 'Iklan'} />
          </div>
        ) : (
          <img src={popup.image_url} alt={popup.title || 'Iklan'} style={{ width: '100%', display: 'block' }} />
        )}
      </div>
    </div>
  );
}
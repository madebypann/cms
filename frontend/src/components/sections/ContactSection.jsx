import { WHATSAPP_NUMBER, WHATSAPP_DISPLAY, INSTAGRAM_USERNAME } from '../../config/contactInfo';

function WhatsAppIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.04 2c-5.52 0-10 4.48-10 10 0 1.77.46 3.44 1.27 4.89L2 22l5.25-1.38a9.94 9.94 0 0 0 4.79 1.22h.01c5.52 0 10-4.48 10-10s-4.49-10.85-10.01-10.84zm0 18.15h-.01a8.14 8.14 0 0 1-4.15-1.14l-.3-.18-3.12.82.83-3.04-.19-.31a8.15 8.15 0 0 1-1.25-4.34c0-4.5 3.66-8.16 8.16-8.16 2.18 0 4.22.85 5.77 2.39a8.1 8.1 0 0 1 2.39 5.78c0 4.5-3.67 8.16-8.15 8.18zm4.47-6.11c-.24-.12-1.45-.72-1.68-.8-.22-.08-.39-.12-.55.12-.16.24-.63.8-.78.96-.14.16-.28.18-.53.06-.24-.12-1.03-.38-1.96-1.21-.72-.65-1.21-1.44-1.35-1.68-.14-.24-.02-.37.11-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.33-.76-1.82-.2-.48-.4-.42-.55-.42-.14 0-.3-.02-.46-.02-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.7 2.6 4.13 3.64.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.45-.59 1.65-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

export default function ContactSection() {
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Halo, saya ingin bertanya tentang TKI Baiturrahman')}`;
  const igLink = `https://instagram.com/${INSTAGRAM_USERNAME}`;

  return (
    <section className="kontak-section" id="kontak">
      <div className="kontak-wrapper">
        <div className="kontak-text">
          <span className="kontak-eyebrow">Hubungi Kami</span>
          <h2 className="kontak-title">Ada Pertanyaan?</h2>
          <p className="kontak-desc">
            Jangan ragu untuk menghubungi kami melalui WhatsApp atau Instagram.
            Tim kami siap membantu menjawab pertanyaan seputar pendaftaran dan informasi sekolah.
          </p>
        </div>

        <div className="kontak-buttons">
          <a href={waLink} target="_blank" rel="noopener noreferrer" className="kontak-btn kontak-btn-whatsapp">
            <span className="kontak-btn-icon">
              <WhatsAppIcon />
            </span>
            <span className="kontak-btn-label">
              WhatsApp
              <small>{WHATSAPP_DISPLAY}</small>
            </span>
          </a>

          <a href={igLink} target="_blank" rel="noopener noreferrer" className="kontak-btn kontak-btn-instagram">
            <span className="kontak-btn-icon">
              <InstagramIcon />
            </span>
            <span className="kontak-btn-label">
              Instagram
              <small>@{INSTAGRAM_USERNAME}</small>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
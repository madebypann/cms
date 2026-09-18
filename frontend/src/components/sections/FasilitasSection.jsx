import { useGalleryCategory } from '../../hooks/useGalleryCategory';

export default function FasilitasSection() {
  const { loading, items } = useGalleryCategory('fasilitas');

  if (loading || items.length === 0) return null;

  return (
    <section className="fasilitas-section">
      <span className="fasilitas-eyebrow">Sarana & Prasarana</span>
      <h2 className="fasilitas-title">Fasilitas Sekolah</h2>
      <p className="fasilitas-subtitle">
        Fasilitas lengkap dan nyaman untuk mendukung proses belajar dan tumbuh kembang anak.
      </p>

      <div className="fasilitas-grid">
        {items.map((item) => (
          <div className="fasilitas-card" key={item.id}>
            <img src={item.image_url} alt={item.title || ''} />
            <div className="fasilitas-overlay">
              {item.title && <p className="fasilitas-name">{item.title}</p>}
              {item.description && <p className="fasilitas-desc">{item.description}</p>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
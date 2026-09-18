import { useGalleryCategory } from '../../hooks/useGalleryCategory';

export default function PengurusYayasanSection() {
  const { loading, items } = useGalleryCategory('pengurus_yayasan');

  if (loading || items.length === 0) return null;

  return (
    <section className="pengurus-section">
      <span className="pengurus-eyebrow">Struktur Organisasi</span>
      <h2 className="pengurus-title">Pengurus Yayasan</h2>

      <div className="pengurus-grid">
        {items.map((item) => (
          <div className="pengurus-card" key={item.id}>
            <img src={item.image_url} alt={item.title || ''} className="pengurus-photo" />
            <div className="pengurus-info">
              {item.title && <p className="pengurus-name">{item.title}</p>}
              {item.description && <p className="pengurus-role">{item.description}</p>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
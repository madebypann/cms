import { useGalleryCategory } from '../../hooks/useGalleryCategory';

export default function GuruSection() {
  const { loading, items } = useGalleryCategory('guru');

  if (loading || items.length === 0) return null;

  return (
    <section className="guru-section" id="guru">
      <span className="guru-eyebrow">Tenaga Pengajar</span>
      <h2 className="guru-title">Guru Kami</h2>

      <div className="guru-grid">
        {items.map((item) => (
          <div className="guru-card" key={item.id}>
            <img src={item.image_url} alt={item.title || ''} className="guru-photo" />
            <div className="guru-info">
              {item.title && <p className="guru-name">{item.title}</p>}
              {item.description && <p className="guru-role">{item.description}</p>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
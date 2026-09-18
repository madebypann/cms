import { useGalleryCategory } from '../../hooks/useGalleryCategory';

export default function PrestasiSection() {
  const { loading, items } = useGalleryCategory('prestasi');

  if (loading || items.length === 0) return null;

  return (
    <section className="prestasi-section">
      <span className="prestasi-eyebrow">Pencapaian Kami</span>
      <h2 className="prestasi-title">PRESTASI SEKOLAH</h2>
      <p className="prestasi-subtitle">
        Berbagai penghargaan dan pencapaian yang telah diraih oleh siswa dan sekolah kami.
      </p>

      <div className="prestasi-grid">
        {items.map((item) => (
          <div className="prestasi-card" key={item.id}>
            <img src={item.image_url} alt={item.title || ''} />

            {item.title && <p className="prestasi-name-static">{item.title}</p>}

            <div className="prestasi-overlay">
              {item.title && <p className="prestasi-name">{item.title}</p>}
              {item.description && <p className="prestasi-desc">{item.description}</p>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
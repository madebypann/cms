import { useContentSection } from '../../hooks/useContentSection';

export default function StrategiPembelajaranSection() {
  const { loading, items } = useContentSection('strategi_pembelajaran');

  if (loading || items.length === 0) return null;

  return (
    <section className="strategi-section">
      <span className="strategi-eyebrow">Pendekatan Kami</span>
      <h2 className="strategi-title">Strategi Pembelajaran</h2>
      <p className="strategi-subtitle">
        Pendekatan yang kami terapkan untuk mengembangkan potensi setiap siswa secara optimal,
        baik dari sisi akademik maupun karakter.
      </p>

      <div className="strategi-grid">
        {items.map((item, i) => (
          <div className="strategi-card" key={i}>
            <span className="strategi-quote-mark">&rdquo;</span>
            <div className="strategi-card-badge">{String(i + 1).padStart(2, '0')}</div>
            <p className="strategi-card-text">{item}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
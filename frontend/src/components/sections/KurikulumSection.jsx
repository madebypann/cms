import { useContentSection } from '../../hooks/useContentSection';

export default function KurikulumSection() {
  const { loading, items } = useContentSection('kurikulum');

  if (loading || items.length === 0) return null;

  return (
    <section className="kurikulum-section" id="kurikulum">
      <span className="kurikulum-eyebrow">Pendekatan Belajar</span>
      <h2 className="kurikulum-title">Kurikulum</h2>

      <div className="kurikulum-grid">
        {items.map((item, i) => (
          <div className="kurikulum-card" key={i}>
            <span className="kurikulum-quote-mark">&rdquo;</span>
            <div className="kurikulum-badge">{String(i + 1).padStart(2, '0')}</div>
            <p className="kurikulum-text">{item}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
import { useContentSection } from '../../hooks/useContentSection';

export default function EkstrakurikulerSection() {
  const { loading, items } = useContentSection('ekstrakurikuler');

  if (loading || items.length === 0) return null;

  return (
    <section className="ekskul-section" id="ekstrakurikuler">
      <div className="ekskul-inner">
        <span className="ekskul-eyebrow">Kembangkan Minat & Bakat</span>
        <h2 className="ekskul-title">Ekstrakurikuler</h2>
        <p className="ekskul-subtitle">
          Berbagai kegiatan di luar jam pelajaran untuk mengasah bakat dan minat siswa.
        </p>

        <div className="ekskul-grid">
          {items.map((item, i) => (
            <div className="ekskul-card" key={i}>
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
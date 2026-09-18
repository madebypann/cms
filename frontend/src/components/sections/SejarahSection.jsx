import { useContentSection } from '../../hooks/useContentSection';

export default function SejarahSection() {
  const { loading, body } = useContentSection('sejarah');

  if (loading || !body) return null;

  return (
    <section className="sejarah-section">
      <div className="sejarah-grid">
        <div className="sejarah-label-col">
          <span className="sejarah-eyebrow">Perjalanan Kami</span>
          <h2 className="sejarah-title">Sejarah Sekolah</h2>
          <p className="sejarah-caption">
            Kisah berdirinya dan perkembangan sekolah kami dari waktu ke waktu.
          </p>
        </div>

        <div className="sejarah-content-col">
          <p className="sejarah-text">{body}</p>
        </div>
      </div>
    </section>
  );
}
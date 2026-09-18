import { Target, Radar } from 'lucide-react';
import { useContentSection } from '../../hooks/useContentSection';

export default function VisiMisiSection() {
  const visi = useContentSection('visi');
  const misi = useContentSection('misi');

  const hasVisi = !visi.loading && visi.body;
  const hasMisi = !misi.loading && misi.items.length > 0;

  if (!hasVisi && !hasMisi) return null;

  return (
    <section className="vm-section">
      <div className="vm-inner">
        <span className="vm-eyebrow">Arah & Tujuan</span>
        <h2 className="vm-title">Visi &amp; Misi</h2>

        <div className="vm-cards">
          {hasVisi && (
            <div className="vm-card">
              <div className="vm-label-col">
                <Target size={160} className="vm-label-bg-icon" />
                <span className="vm-label-text">Visi</span>
              </div>
              <div className="vm-content-col">
                <p className="vm-visi-text">{visi.body}</p>
              </div>
            </div>
          )}

          {hasMisi && (
            <div className="vm-card">
              <div className="vm-label-col">
                <Radar size={160} className="vm-label-bg-icon" />
                <span className="vm-label-text">Misi</span>
              </div>
              <div className="vm-content-col">
                <ul className="vm-misi-list">
                  {misi.items.map((item, i) => (
                    <li className="vm-misi-item" key={i}>
                      <span className="vm-misi-number">{i + 1}</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
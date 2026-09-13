import { useRef, useState, useEffect, useLayoutEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useGalleryCategory } from '../../hooks/useGalleryCategory';

const GAP = 20;

export default function KegiatanUnggulanSection() {
  const { loading, items } = useGalleryCategory('kegiatan_unggulan');
  const firstCardRef = useRef(null);

  const [index, setIndex] = useState(0);
  const [withTransition, setWithTransition] = useState(true);
  const [step, setStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const count = items.length;
  const loopedItems = count > 0 ? [...items, ...items, ...items] : [];

  useEffect(() => {
    if (count > 0) setIndex(count);
  }, [count]);

  useEffect(() => {
    const measure = () => {
      if (firstCardRef.current) setStep(firstCardRef.current.offsetWidth + GAP);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [count]);

  useLayoutEffect(() => {
    if (!withTransition) {
      const id = requestAnimationFrame(() => setWithTransition(true));
      return () => cancelAnimationFrame(id);
    }
  }, [withTransition]);

  if (loading || count === 0) return null;

  const goTo = (direction) => {
    if (isAnimating) return; // abaikan klik selama animasi sebelumnya belum selesai
    setIsAnimating(true);
    setWithTransition(true);
    setIndex((prev) => prev + (direction === 'right' ? 1 : -1));
  };

  const handleTransitionEnd = () => {
    if (index >= count * 2) {
      setWithTransition(false);
      setIndex((prev) => prev - count);
    } else if (index < count) {
      setWithTransition(false);
      setIndex((prev) => prev + count);
    }
    setIsAnimating(false); // 1 siklus selesai, boleh terima klik berikutnya
  };

  return (
    <section className="kegiatan-section">
      <div className="kegiatan-inner">
        <span className="kegiatan-eyebrow">Dokumentasi</span>
        <h2 className="kegiatan-title">Kegiatan Unggulan</h2>

        <div className="kegiatan-carousel">
          <div className="kegiatan-viewport">
            <div
              className="kegiatan-slider"
              style={{
                transform: `translateX(-${index * step}px)`,
                transition: withTransition ? 'transform 0.4s ease' : 'none',
              }}
              onTransitionEnd={handleTransitionEnd}
            >
              {loopedItems.map((item, i) => (
                <div className="kegiatan-card" key={`${item.id}-${i}`} ref={i === 0 ? firstCardRef : null}>
                  <img src={item.image_url} alt={item.title || ''} />
                  {item.title && (
                    <div className="kegiatan-card-body">
                      <p className="kegiatan-card-title">{item.title}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="kegiatan-nav">
          <button className="kegiatan-nav-btn" onClick={() => goTo('left')} aria-label="Sebelumnya">
            <ChevronLeft size={20} />
          </button>
          <button className="kegiatan-nav-btn" onClick={() => goTo('right')} aria-label="Berikutnya">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}
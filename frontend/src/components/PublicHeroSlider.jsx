import { useEffect, useState } from 'react';
import api from '../lib/api';

export default function PublicHeroSlider() {
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    api.get('/hero').then((res) => setSlides(res.data)).catch(console.error);
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides]);

  const overlay = (
    <div className="public-hero-overlay">
      <h1>TKI Baiturrahman</h1>
      <h2>Mengedepankan pendidikan agama Islam & membentuk Akhlakul Karimah sejak dini</h2>
    </div>
  );

  if (slides.length === 0) {
    return (
      <div className="public-hero-empty" style={{ position: 'relative' }}>
        {overlay}
      </div>
    );
  }

  return (
    <div className="public-hero">
      <img src={slides[current].image_url} alt="Banner sekolah" />
      {overlay}

      {slides.length > 1 && (
        <div className="public-hero-dots">
          {slides.map((s, i) => (
            <button
              key={s.id}
              className={`public-hero-dot ${i === current ? 'active' : ''}`}
              onClick={() => setCurrent(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
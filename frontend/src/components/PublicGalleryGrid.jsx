import { useEffect, useState } from 'react';
import api from '../lib/api';

export default function PublicGalleryGrid({ category, title, id, variant }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.get(`/galleries?category=${category}`).then((res) => setItems(res.data)).catch(console.error);
  }, [category]);

  const sectionClass = variant === 'blue' ? 'public-section public-section-blue' : 'public-section';

  const content = (
    <>
      {title && <h2 className="public-section-title">{title}</h2>}

      {items.length === 0 ? (
        <p className="public-empty-state">Belum ada data.</p>
      ) : (
        <div className="public-gallery-grid">
          {items.map((item) => (
            <div className="public-gallery-card" key={item.id}>
              <img src={item.image_url} alt={item.title || ''} />
              {(item.title || item.description) && (
                <div className="public-gallery-card-body">
                  {item.title && <p className="public-gallery-card-title">{item.title}</p>}
                  {item.description && <p className="public-gallery-card-desc">{item.description}</p>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );

  if (variant === 'blue') {
    return (
      <section className={sectionClass} id={id}>
        <div className="public-section-inner">{content}</div>
      </section>
    );
  }

  return (
    <section className={sectionClass} id={id}>
      {content}
    </section>
  );
}
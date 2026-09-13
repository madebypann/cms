import { useEffect, useState } from 'react';
import { BookOpen, Users, Target, Lightbulb, Heart, Star } from 'lucide-react';
import api from '../lib/api';

const ICONS = [BookOpen, Users, Target, Lightbulb, Heart, Star];

export default function PublicListSection({ sectionKey, title, subtitle, id, variant = 'cards' }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api
      .get(`/content/${sectionKey}`)
      .then((res) => setItems(res.data.items || []))
      .catch(() => setItems([]));
  }, [sectionKey]);

  if (items.length === 0) return null;

  return (
    <section className="public-section" id={id}>
      <h2 className="public-section-title">{title}</h2>
      {subtitle && <p className="public-section-intro">{subtitle}</p>}

      {variant === 'timeline' && (
        <ul className="public-timeline">
          {items.map((item, i) => (
            <li className="public-timeline-item" key={i}>
              <div className="public-timeline-dot">{i + 1}</div>
              <p className="public-timeline-text">{item}</p>
            </li>
          ))}
        </ul>
      )}

      {variant === 'stacked' && (
        <ul className="public-stacked-list">
          {items.map((item, i) => (
            <li className="public-stacked-item" key={i}>
              <div className="public-stacked-number">{i + 1}</div>
              <p className="public-stacked-text">{item}</p>
            </li>
          ))}
        </ul>
      )}

      {variant === 'cards' && (
        <ul className="public-list-cards">
          {items.map((item, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <li className="public-list-card" key={i}>
                <div className="public-list-icon">
                  <Icon size={22} />
                </div>
                <p className="public-list-card-text">{item}</p>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
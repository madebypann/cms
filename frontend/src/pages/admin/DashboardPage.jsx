import { useEffect, useState } from 'react';
import api from '../../lib/api';
import { CONTENT_CATEGORIES } from '../../config/contentCategories';

export default function DashboardPage() {
  const [counts, setCounts] = useState({});

  useEffect(() => {
    const loadCounts = async () => {
      const results = {};

      // hero (banner) dihitung terpisah karena endpointnya beda
      const heroRes = await api.get('/hero/all');
      results.banner = heroRes.data.length;

      // sisanya lewat endpoint galleries, per kategori
      const galleryCategories = CONTENT_CATEGORIES.filter((c) => c.key !== 'banner');
      await Promise.all(
        galleryCategories.map(async (c) => {
          const res = await api.get(`/galleries/all?category=${c.key}`);
          results[c.key] = res.data.length;
        })
      );

      setCounts(results);
    };

    loadCounts().catch(console.error);
  }, []);

  return (
    <div>
      <h2 className="page-title">Dashboard</h2>
      <p className="page-subtitle">Ringkasan jumlah konten yang tersimpan.</p>

      <div className="stat-grid">
        {CONTENT_CATEGORIES.map((c) => (
          <div className="stat-card" key={c.key}>
            <div className="stat-card-label">{c.label}</div>
            <div className="stat-card-value">{counts[c.key] ?? '...'}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
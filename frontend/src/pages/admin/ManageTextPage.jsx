import { useEffect, useState } from 'react';
import api from '../../lib/api';
import { useToast } from '../../context/ToastContext';

// setiap section punya "type": 'text' (paragraf biasa) atau 'list' (poin-poin dinamis)
const SECTIONS = [
  { key: 'visi', label: 'Visi', type: 'text' },
  { key: 'misi', label: 'Misi', type: 'list' },
  { key: 'sejarah', label: 'Sejarah Sekolah', type: 'text' },
  { key: 'strategi_pembelajaran', label: 'Strategi Pembelajaran', type: 'list' },
  { key: 'kurikulum', label: 'Kurikulum', type: 'list' },
  { key: 'ekstrakurikuler', label: 'Ekstrakurikuler', type: 'list' },
];

export default function ManageTextPage() {
  const { showToast } = useToast();
  const [dataMap, setDataMap] = useState({});
  const [drafts, setDrafts] = useState({});
  const [saving, setSaving] = useState(null);

  const loadData = async () => {
    const res = await api.get('/content');
    const map = {};
    res.data.forEach((item) => { map[item.section_key] = item; });
    setDataMap(map);

    const initialDrafts = {};
    SECTIONS.forEach((s) => {
      initialDrafts[s.key] = {
        body: map[s.key]?.body || '',
        items: map[s.key]?.items?.length > 0 ? map[s.key].items : [''],
      };
    });
    setDrafts(initialDrafts);
  };

  useEffect(() => {
    loadData();
  }, []);

  const updateBody = (key, value) => {
    setDrafts((prev) => ({ ...prev, [key]: { ...prev[key], body: value } }));
  };

  const updateItem = (key, index, value) => {
    setDrafts((prev) => {
      const newItems = [...prev[key].items];
      newItems[index] = value;
      return { ...prev, [key]: { ...prev[key], items: newItems } };
    });
  };

  const addItem = (key) => {
    setDrafts((prev) => ({
      ...prev,
      [key]: { ...prev[key], items: [...prev[key].items, ''] },
    }));
  };

  const removeItem = (key, index) => {
    setDrafts((prev) => {
      const newItems = prev[key].items.filter((_, i) => i !== index);
      return { ...prev, [key]: { ...prev[key], items: newItems.length > 0 ? newItems : [''] } };
    });
  };

  const handleSave = async (section) => {
    setSaving(section.key);
    try {
      const exists = !!dataMap[section.key];
      const draft = drafts[section.key];

      const payload =
        section.type === 'list'
          ? { items: draft.items.filter((i) => i.trim() !== '') }
          : { body: draft.body };

      if (exists) {
        await api.put(`/content/${section.key}`, payload);
      } else {
        await api.post('/content', { section_key: section.key, ...payload });
      }

      showToast(`${section.label} berhasil disimpan`, 'success');
      loadData();
    } catch (err) {
      showToast('Gagal menyimpan: ' + (err.response?.data?.error || err.message), 'error');
    } finally {
      setSaving(null);
    }
  };

  return (
    <div>
      <h2>Kelola Teks</h2>

      <div style={{ display: 'grid', gap: 24 }}>
        {SECTIONS.map((section) => (
          <div key={section.key} style={{ border: '1px solid #444', borderRadius: 8, padding: 16 }}>
            <h3>{section.label}</h3>

            {section.type === 'text' && (
              <div style={{ marginBottom: 8 }}>
                <textarea
                  value={drafts[section.key]?.body || ''}
                  onChange={(e) => updateBody(section.key, e.target.value)}
                  rows={5}
                  style={{ width: '100%', padding: 8 }}
                />
              </div>
            )}

            {section.type === 'list' && (
              <div style={{ marginBottom: 8 }}>
                {drafts[section.key]?.items.map((item, index) => (
                  <div key={index} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                    <input
                      value={item}
                      onChange={(e) => updateItem(section.key, index, e.target.value)}
                      style={{ flex: 1, padding: 8 }}
                      placeholder={`Poin ${index + 1}`}
                    />
                    <button onClick={() => removeItem(section.key, index)} style={{ color: 'red' }}>
                      Hapus
                    </button>
                  </div>
                ))}
                <button onClick={() => addItem(section.key)}>+ Tambah Poin</button>
              </div>
            )}

            <button onClick={() => handleSave(section)} disabled={saving === section.key} style={{ marginTop: 8 }}>
              {saving === section.key ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
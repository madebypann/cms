import { useEffect, useState } from 'react';
import api from '../../lib/api';
import { useToast } from '../../context/ToastContext';

export default function ManageTextSection({ section }) {
  const { showToast } = useToast();
  const [exists, setExists] = useState(false);
  const [body, setBody] = useState('');
  const [items, setItems] = useState(['']);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/content/${section.key}`);
      setExists(true);
      setBody(res.data.body || '');
      setItems(res.data.items?.length > 0 ? res.data.items : ['']);
    } catch {
      setExists(false);
      setBody('');
      setItems(['']);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [section.key]);

  const updateItem = (index, value) => {
    setItems((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const addItem = () => setItems((prev) => [...prev, '']);

  const removeItem = (index) => {
    setItems((prev) => {
      const next = prev.filter((_, i) => i !== index);
      return next.length > 0 ? next : [''];
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload =
        section.type === 'list'
          ? { items: items.filter((i) => i.trim() !== '') }
          : { body };

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
      setSaving(false);
    }
  };

  if (loading) return <p style={{ color: 'var(--adm-text-muted)' }}>Memuat...</p>;

  return (
    <div>
      <h2 className="page-title">{section.label}</h2>
      <p className="page-subtitle">
        {section.type === 'list'
          ? 'Kelola poin-poin untuk section ini.'
          : 'Kelola isi teks untuk section ini.'}
      </p>

      <div className="card">
        {section.type === 'text' && (
          <div className="form-group">
            <label>Isi</label>
            <textarea
              className="form-textarea"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={6}
            />
          </div>
        )}

        {section.type === 'list' && (
          <div className="form-group">
            <label>Poin-poin</label>
            {items.map((item, index) => (
              <div key={index} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <input
                  className="form-input"
                  value={item}
                  onChange={(e) => updateItem(index, e.target.value)}
                  placeholder={`Poin ${index + 1}`}
                />
                <button className="icon-btn icon-btn-danger" onClick={() => removeItem(index)} type="button">
                  ×
                </button>
              </div>
            ))}
            <button className="btn btn-secondary" onClick={addItem} type="button" style={{ marginTop: 4 }}>
              + Tambah Poin
            </button>
          </div>
        )}

        <button className="btn btn-primary" onClick={handleSave} disabled={saving} style={{ marginTop: 16 }}>
          {saving ? 'Menyimpan...' : 'Simpan'}
        </button>
      </div>
    </div>
  );
}
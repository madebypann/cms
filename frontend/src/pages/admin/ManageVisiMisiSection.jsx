import { useEffect, useState } from 'react';
import api from '../../lib/api';
import { useToast } from '../../context/ToastContext';

export default function ManageVisiMisiSection() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);

  const [visiExists, setVisiExists] = useState(false);
  const [visiBody, setVisiBody] = useState('');
  const [savingVisi, setSavingVisi] = useState(false);

  const [misiExists, setMisiExists] = useState(false);
  const [misiItems, setMisiItems] = useState(['']);
  const [savingMisi, setSavingMisi] = useState(false);

  const loadData = async () => {
    setLoading(true);

    try {
      const res = await api.get('/content/visi');
      setVisiExists(true);
      setVisiBody(res.data.body || '');
    } catch {
      setVisiExists(false);
      setVisiBody('');
    }

    try {
      const res = await api.get('/content/misi');
      setMisiExists(true);
      setMisiItems(res.data.items?.length > 0 ? res.data.items : ['']);
    } catch {
      setMisiExists(false);
      setMisiItems(['']);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveVisi = async () => {
    setSavingVisi(true);
    try {
      if (visiExists) {
        await api.put('/content/visi', { body: visiBody });
      } else {
        await api.post('/content', { section_key: 'visi', body: visiBody });
      }
      showToast('Visi berhasil disimpan', 'success');
      loadData();
    } catch (err) {
      showToast('Gagal menyimpan Visi: ' + (err.response?.data?.error || err.message), 'error');
    } finally {
      setSavingVisi(false);
    }
  };

  const updateMisiItem = (index, value) => {
    setMisiItems((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const addMisiItem = () => setMisiItems((prev) => [...prev, '']);

  const removeMisiItem = (index) => {
    setMisiItems((prev) => {
      const next = prev.filter((_, i) => i !== index);
      return next.length > 0 ? next : [''];
    });
  };

  const handleSaveMisi = async () => {
    setSavingMisi(true);
    try {
      const payload = { items: misiItems.filter((i) => i.trim() !== '') };
      if (misiExists) {
        await api.put('/content/misi', payload);
      } else {
        await api.post('/content', { section_key: 'misi', ...payload });
      }
      showToast('Misi berhasil disimpan', 'success');
      loadData();
    } catch (err) {
      showToast('Gagal menyimpan Misi: ' + (err.response?.data?.error || err.message), 'error');
    } finally {
      setSavingMisi(false);
    }
  };

  if (loading) return <p style={{ color: 'var(--adm-text-muted)' }}>Memuat...</p>;

  return (
    <div>
      <h2 className="page-title">Visi & Misi</h2>
      <p className="page-subtitle">Kelola pernyataan visi dan poin-poin misi sekolah.</p>

      <div className="card" style={{ marginBottom: 20 }}>
        <h3 style={{ marginTop: 0 }}>Visi</h3>
        <div className="form-group">
          <label>Isi</label>
          <textarea
            className="form-textarea"
            value={visiBody}
            onChange={(e) => setVisiBody(e.target.value)}
            rows={4}
          />
        </div>
        <button className="btn btn-primary" onClick={handleSaveVisi} disabled={savingVisi}>
          {savingVisi ? 'Menyimpan...' : 'Simpan Visi'}
        </button>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Misi</h3>
        <div className="form-group">
          <label>Poin-poin</label>
          {misiItems.map((item, index) => (
            <div key={index} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <input
                className="form-input"
                value={item}
                onChange={(e) => updateMisiItem(index, e.target.value)}
                placeholder={`Poin ${index + 1}`}
              />
              <button className="icon-btn icon-btn-danger" onClick={() => removeMisiItem(index)} type="button">
                ×
              </button>
            </div>
          ))}
          <button className="btn btn-secondary" onClick={addMisiItem} type="button" style={{ marginTop: 4 }}>
            + Tambah Poin
          </button>
        </div>
        <button className="btn btn-primary" onClick={handleSaveMisi} disabled={savingMisi} style={{ marginTop: 16 }}>
          {savingMisi ? 'Menyimpan...' : 'Simpan Misi'}
        </button>
      </div>
    </div>
  );
}
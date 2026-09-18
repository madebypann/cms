import { useEffect, useState } from 'react';
import { Search, RefreshCw, Trash2, Pencil, Plus } from 'lucide-react';
import api from '../../lib/api';
import ToggleSwitch from '../../components/ToggleSwitch';
import Modal from '../../components/Modal';
import PaginationBar from '../../components/PaginationBar';
import { useToast } from '../../context/ToastContext';
import { useConfirm } from '../../context/ConfirmContext';

const formatDate = (iso) => {
  if (!iso) return '-';
  return new Date(iso).toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function ManageHeroTab({ aspectRatio = '16 / 6', aspectLabel = '' }) {
  const { showToast } = useToast();
  const confirm = useConfirm();
  const [slides, setSlides] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState(new Set());

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [createOpen, setCreateOpen] = useState(false);
  const [createFile, setCreateFile] = useState(null);
  const [createPreview, setCreatePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [editSlide, setEditSlide] = useState(null);
  const [editFile, setEditFile] = useState(null);
  const [editPreview, setEditPreview] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);

  const loadSlides = () => {
    api.get('/hero/all').then((res) => setSlides(res.data)).catch(console.error);
  };

  useEffect(() => {
    loadSlides();
  }, []);

  const filtered = slides.filter((s) => s.id.includes(search.trim()));
  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleRowsPerPageChange = (value) => {
    setRowsPerPage(value);
    setPage(1);
  };

  const openCreate = () => {
    setCreateFile(null);
    setCreatePreview(null);
    setCreateOpen(true);
  };

  const handleCreateFileChange = (e) => {
    const f = e.target.files[0];
    setCreateFile(f);
    setCreatePreview(f ? URL.createObjectURL(f) : null);
  };

  const handleCreateSubmit = async () => {
    if (!createFile) return showToast('Pilih gambar terlebih dahulu', 'error');
    const formData = new FormData();
    formData.append('image', createFile);

    setUploading(true);
    try {
      await api.post('/hero', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setCreateOpen(false);
      showToast('Banner berhasil ditambahkan', 'success');
      loadSlides();
    } catch (err) {
      showToast('Gagal upload: ' + (err.response?.data?.error || err.message), 'error');
    } finally {
      setUploading(false);
    }
  };

  const openEdit = (slide) => {
    setEditSlide(slide);
    setEditFile(null);
    setEditPreview(slide.image_url);
  };

  const handleEditFileChange = (e) => {
    const f = e.target.files[0];
    setEditFile(f);
    setEditPreview(f ? URL.createObjectURL(f) : editSlide.image_url);
  };

  const handleEditSubmit = async () => {
    if (!editFile) {
      setEditSlide(null);
      return;
    }
    const formData = new FormData();
    formData.append('image', editFile);

    setSavingEdit(true);
    try {
      await api.put(`/hero/${editSlide.id}/image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setEditSlide(null);
      showToast('Banner berhasil diperbarui', 'success');
      loadSlides();
    } catch (err) {
      showToast('Gagal mengganti gambar: ' + (err.response?.data?.error || err.message), 'error');
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDelete = async (id) => {
    const ok = await confirm('Hapus gambar banner ini?');
    if (!ok) return;
    await api.delete(`/hero/${id}`);
    showToast('Banner dihapus', 'success');
    loadSlides();
  };

  const toggleActive = async (slide) => {
    await api.put(`/hero/${slide.id}`, { is_active: !slide.is_active });
    loadSlides();
  };

  const toggleSelectAll = () => {
    const pageIds = pageItems.map((s) => s.id);
    const allSelected = pageIds.every((id) => selectedIds.has(id));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allSelected) {
        pageIds.forEach((id) => next.delete(id));
      } else {
        pageIds.forEach((id) => next.add(id));
      }
      return next;
    });
  };

  const toggleSelectOne = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleBulkDelete = async () => {
    const ok = await confirm(`Hapus ${selectedIds.size} banner terpilih?`);
    if (!ok) return;
    await Promise.all([...selectedIds].map((id) => api.delete(`/hero/${id}`)));
    setSelectedIds(new Set());
    showToast('Banner terpilih berhasil dihapus', 'success');
    loadSlides();
  };

  const allPageSelected = pageItems.length > 0 && pageItems.every((s) => selectedIds.has(s.id));

  return (
    <div>
      <h2 className="page-title">Banner</h2>
      <p className="page-subtitle">
        Kelola gambar banner yang tampil di halaman Beranda.
        {aspectLabel && ` Rasio disarankan: ${aspectLabel}`}
      </p>

      <div className="table-toolbar">
        <div className="search-box">
          <Search size={16} color="var(--adm-text-muted)" />
          <input placeholder="Cari ID..." value={search} onChange={handleSearchChange} />
        </div>
        <div className="table-toolbar-right">
          <button className="refresh-btn" onClick={loadSlides} title="Refresh">
            <RefreshCw size={16} />
          </button>
          <button className="btn btn-primary" onClick={openCreate} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Plus size={16} /> Create
          </button>
        </div>
      </div>

      {selectedIds.size > 0 && (
        <div className="bulk-bar">
          <span>{selectedIds.size} data terpilih</span>
          <button className="btn btn-danger" onClick={handleBulkDelete}>Hapus Terpilih</button>
        </div>
      )}

      <PaginationBar
        page={currentPage}
        totalPages={totalPages}
        rowsPerPage={rowsPerPage}
        totalItems={filtered.length}
        onPageChange={setPage}
        onRowsPerPageChange={handleRowsPerPageChange}
      />

      <table className="data-table">
        <thead>
          <tr>
            <th className="checkbox-cell">
              <input type="checkbox" checked={allPageSelected} onChange={toggleSelectAll} />
            </th>
            <th>Created At</th>
            <th>Gambar</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {pageItems.map((slide) => (
            <tr key={slide.id}>
              <td className="checkbox-cell">
                <input
                  type="checkbox"
                  checked={selectedIds.has(slide.id)}
                  onChange={() => toggleSelectOne(slide.id)}
                />
              </td>
              <td>{formatDate(slide.created_at)}</td>
              <td>
                <div className="table-thumb-ratio" style={{ aspectRatio }}>
                  <img src={slide.image_url} alt="" />
                </div>
              </td>
              <td>
                <ToggleSwitch checked={slide.is_active} onChange={() => toggleActive(slide)} showLabel />
              </td>
              <td>
                <div className="table-actions">
                  <button className="icon-btn" onClick={() => openEdit(slide)} title="Edit">
                    <Pencil size={14} />
                  </button>
                  <button className="icon-btn icon-btn-danger" onClick={() => handleDelete(slide.id)} title="Hapus">
                    <Trash2 size={14} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {pageItems.length === 0 && (
            <tr>
              <td colSpan={5} style={{ textAlign: 'center', color: 'var(--adm-text-muted)' }}>
                Belum ada banner.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Tambah Banner">
        {createPreview && (
          <div className="image-preview-box" style={{ aspectRatio }}>
            <img src={createPreview} alt="Preview" />
          </div>
        )}
        {aspectLabel && <span className="image-preview-caption">Rasio disarankan: {aspectLabel}</span>}
        <div className="form-group">
          <label>Gambar</label>
          <input type="file" accept="image/*" onChange={handleCreateFileChange} />
        </div>
        <button className="btn btn-primary" onClick={handleCreateSubmit} disabled={uploading}>
          {uploading ? 'Mengupload...' : 'Upload'}
        </button>
      </Modal>

      <Modal open={!!editSlide} onClose={() => setEditSlide(null)} title="Edit Banner">
        {editPreview && (
          <div className="image-preview-box" style={{ aspectRatio }}>
            <img src={editPreview} alt="Preview" />
          </div>
        )}
        {aspectLabel && <span className="image-preview-caption">Rasio disarankan: {aspectLabel}</span>}
        <div className="form-group">
          <label>Ganti Gambar (opsional)</label>
          <input type="file" accept="image/*" onChange={handleEditFileChange} />
        </div>
        <button className="btn btn-primary" onClick={handleEditSubmit} disabled={savingEdit}>
          {savingEdit ? 'Menyimpan...' : 'Simpan'}
        </button>
      </Modal>
    </div>
  );
}
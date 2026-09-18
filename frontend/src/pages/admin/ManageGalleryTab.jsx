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

export default function ManageGalleryTab({ category, config }) {
  const {
    label,
    hasDescription = true,
    hasRedirect = false,
    titleLabel = 'Judul',
    descriptionLabel = 'Deskripsi',
    aspectRatio = '4 / 3',
    aspectLabel = '',
  } = config;

  const { showToast } = useToast();
  const confirm = useConfirm();

  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState(new Set());

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [createOpen, setCreateOpen] = useState(false);
  const [createTitle, setCreateTitle] = useState('');
  const [createDesc, setCreateDesc] = useState('');
  const [createRedirect, setCreateRedirect] = useState('');
  const [createFile, setCreateFile] = useState(null);
  const [createPreview, setCreatePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [editItem, setEditItem] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editRedirect, setEditRedirect] = useState('');
  const [editFile, setEditFile] = useState(null);
  const [editPreview, setEditPreview] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);

  const loadItems = () => {
    api.get(`/galleries/all?category=${category}`).then((res) => setItems(res.data)).catch(console.error);
  };

  useEffect(() => {
    loadItems();
    setSearch('');
    setSelectedIds(new Set());
    setPage(1);
  }, [category]);

  const filtered = items.filter((i) => (i.title || '').toLowerCase().includes(search.toLowerCase()));
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
    setCreateTitle('');
    setCreateDesc('');
    setCreateRedirect('');
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
    formData.append('category', category);
    formData.append('title', createTitle);
    formData.append('description', createDesc);
    formData.append('redirect_url', createRedirect);

    setUploading(true);
    try {
      await api.post('/galleries', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setCreateOpen(false);
      showToast(`${label} berhasil ditambahkan`, 'success');
      loadItems();
    } catch (err) {
      showToast('Gagal upload: ' + (err.response?.data?.error || err.message), 'error');
    } finally {
      setUploading(false);
    }
  };

  const openEdit = (item) => {
    setEditItem(item);
    setEditTitle(item.title || '');
    setEditDesc(item.description || '');
    setEditRedirect(item.redirect_url || '');
    setEditFile(null);
    setEditPreview(item.image_url);
  };

  const handleEditFileChange = (e) => {
    const f = e.target.files[0];
    setEditFile(f);
    setEditPreview(f ? URL.createObjectURL(f) : editItem.image_url);
  };

  const handleEditSubmit = async () => {
    setSavingEdit(true);
    try {
      await api.put(`/galleries/${editItem.id}`, {
        title: editTitle,
        description: editDesc,
        redirect_url: editRedirect,
      });

      if (editFile) {
        const formData = new FormData();
        formData.append('image', editFile);
        await api.put(`/galleries/${editItem.id}/image`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      setEditItem(null);
      showToast(`${label} berhasil diperbarui`, 'success');
      loadItems();
    } catch (err) {
      showToast('Gagal menyimpan: ' + (err.response?.data?.error || err.message), 'error');
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDelete = async (id) => {
    const ok = await confirm('Hapus foto ini?');
    if (!ok) return;
    await api.delete(`/galleries/${id}`);
    showToast('Foto dihapus', 'success');
    loadItems();
  };

  const toggleActive = async (item) => {
    await api.put(`/galleries/${item.id}`, { is_active: !item.is_active });
    loadItems();
  };

  const toggleSelectAll = () => {
    const pageIds = pageItems.map((i) => i.id);
    const allSelected = pageIds.every((id) => selectedIds.has(id));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allSelected) pageIds.forEach((id) => next.delete(id));
      else pageIds.forEach((id) => next.add(id));
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
    const ok = await confirm(`Hapus ${selectedIds.size} foto terpilih?`);
    if (!ok) return;
    await Promise.all([...selectedIds].map((id) => api.delete(`/galleries/${id}`)));
    setSelectedIds(new Set());
    showToast('Foto terpilih berhasil dihapus', 'success');
    loadItems();
  };

  const allPageSelected = pageItems.length > 0 && pageItems.every((i) => selectedIds.has(i.id));

  return (
    <div>
      <h2 className="page-title">{label}</h2>
      {aspectLabel && <p className="page-subtitle">Rasio foto yang disarankan: {aspectLabel}</p>}

      <div className="table-toolbar">
        <div className="search-box">
          <Search size={16} color="var(--adm-text-muted)" />
          <input placeholder="Cari judul..." value={search} onChange={handleSearchChange} />
        </div>
        <div className="table-toolbar-right">
          <button className="refresh-btn" onClick={loadItems} title="Refresh">
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
            <th>Foto</th>
            <th>{titleLabel}{hasDescription ? ` & ${descriptionLabel}` : ''}</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {pageItems.map((item) => (
            <tr key={item.id}>
              <td className="checkbox-cell">
                <input type="checkbox" checked={selectedIds.has(item.id)} onChange={() => toggleSelectOne(item.id)} />
              </td>
              <td>{formatDate(item.created_at)}</td>
              <td>
                <div className="table-thumb-ratio" style={{ aspectRatio }}>
                  <img src={item.image_url} alt="" />
                </div>
              </td>
              <td>
                <strong>{item.title || '(tanpa judul)'}</strong>
                {hasDescription && item.description && (
                  <>
                    <br />
                    <span style={{ color: 'var(--adm-text-muted)', fontSize: 13 }}>{item.description}</span>
                  </>
                )}
                {hasRedirect && item.redirect_url && (
                  <>
                    <br />
                    <span style={{ color: 'var(--adm-primary)', fontSize: 12 }}>{item.redirect_url}</span>
                  </>
                )}
              </td>
              <td>
                <ToggleSwitch checked={item.is_active} onChange={() => toggleActive(item)} showLabel />
              </td>
              <td>
                <div className="table-actions">
                  <button className="icon-btn" onClick={() => openEdit(item)} title="Edit">
                    <Pencil size={14} />
                  </button>
                  <button className="icon-btn icon-btn-danger" onClick={() => handleDelete(item.id)} title="Hapus">
                    <Trash2 size={14} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {pageItems.length === 0 && (
            <tr>
              <td colSpan={6} style={{ textAlign: 'center', color: 'var(--adm-text-muted)' }}>
                Belum ada {label.toLowerCase()}.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title={`Tambah ${label}`}>
        {createPreview && (
          <div className="image-preview-box" style={{ aspectRatio }}>
            <img src={createPreview} alt="Preview" />
          </div>
        )}
        {aspectLabel && <span className="image-preview-caption">Rasio disarankan: {aspectLabel}</span>}

        <div className="form-group">
          <label>{titleLabel}</label>
          <input className="form-input" value={createTitle} onChange={(e) => setCreateTitle(e.target.value)} />
        </div>
        {hasDescription && (
          <div className="form-group">
            <label>{descriptionLabel}</label>
            <textarea className="form-textarea" rows={3} value={createDesc} onChange={(e) => setCreateDesc(e.target.value)} />
          </div>
        )}
        {hasRedirect && (
          <div className="form-group">
            <label>Link Redirect</label>
            <input
              className="form-input"
              placeholder="https://contoh.com"
              value={createRedirect}
              onChange={(e) => setCreateRedirect(e.target.value)}
            />
          </div>
        )}
        <div className="form-group">
          <label>Gambar</label>
          <input type="file" accept="image/*" onChange={handleCreateFileChange} />
        </div>
        <button className="btn btn-primary" onClick={handleCreateSubmit} disabled={uploading}>
          {uploading ? 'Mengupload...' : 'Upload'}
        </button>
      </Modal>

      <Modal open={!!editItem} onClose={() => setEditItem(null)} title={`Edit ${label}`}>
        {editPreview && (
          <div className="image-preview-box" style={{ aspectRatio }}>
            <img src={editPreview} alt="Preview" />
          </div>
        )}
        {aspectLabel && <span className="image-preview-caption">Rasio disarankan: {aspectLabel}</span>}

        <div className="form-group">
          <label>{titleLabel}</label>
          <input className="form-input" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
        </div>
        {hasDescription && (
          <div className="form-group">
            <label>{descriptionLabel}</label>
            <textarea className="form-textarea" rows={3} value={editDesc} onChange={(e) => setEditDesc(e.target.value)} />
          </div>
        )}
        {hasRedirect && (
          <div className="form-group">
            <label>Link Redirect</label>
            <input
              className="form-input"
              placeholder="https://contoh.com"
              value={editRedirect}
              onChange={(e) => setEditRedirect(e.target.value)}
            />
          </div>
        )}
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
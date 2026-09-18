const express = require('express');
const multer = require('multer');
const { randomUUID } = require('crypto');
const { supabaseAdmin } = require('../lib/supabaseClient');
const { requireAuth } = require('../middleware/requireAuth');

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

const BUCKET = 'school-images';

// GET /api/galleries?category=xxx -> ambil yang AKTIF saja, untuk halaman publik
router.get('/', async (req, res) => {
  const { category } = req.query;

  let query = supabaseAdmin
    .from('galleries')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (category) {
    query = query.eq('category', category);
  }

  const { data, error } = await query;

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// GET /api/galleries/all?category=xxx -> ambil SEMUA (termasuk nonaktif), khusus admin
router.get('/all', requireAuth, async (req, res) => {
  const { category } = req.query;

  let query = supabaseAdmin
    .from('galleries')
    .select('*')
    .order('created_at', { ascending: false });

  if (category) {
    query = query.eq('category', category);
  }

  const { data, error } = await query;

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// POST /api/galleries -> upload foto baru ke kategori tertentu
router.post('/', requireAuth, upload.single('image'), async (req, res) => {
  try {
    const { category, title, description, redirect_url } = req.body;
    const file = req.file;

    if (!category) {
      return res.status(400).json({ error: 'category wajib diisi (misal: prestasi, fasilitas)' });
    }
    if (!file) {
      return res.status(400).json({ error: 'File gambar wajib diupload (field name: image)' });
    }

    const ext = file.originalname.split('.').pop();
    const filePath = `galleries/${category}/${randomUUID()}.${ext}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(filePath, file.buffer, { contentType: file.mimetype });

    if (uploadError) return res.status(500).json({ error: uploadError.message });

    const { data: urlData } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(filePath);

    const { data, error } = await supabaseAdmin
      .from('galleries')
      .insert({
        category,
        title: title || null,
        description: description || null,
        redirect_url: redirect_url || null,
        image_url: urlData.publicUrl,
        image_path: filePath,
      })
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });

    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/galleries/:id -> update teks/status (tanpa ganti gambar)
router.put('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const { title, description, is_active, category, redirect_url } = req.body;

  const { data, error } = await supabaseAdmin
    .from('galleries')
    .update({ title, description, is_active, category, redirect_url })
    .eq('id', id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// PUT /api/galleries/:id/image -> ganti gambar
router.put('/:id/image', requireAuth, upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'File gambar wajib diupload (field name: image)' });
    }

    const { data: existing, error: findError } = await supabaseAdmin
      .from('galleries')
      .select('image_path, category')
      .eq('id', id)
      .single();

    if (findError) return res.status(404).json({ error: 'Data galeri tidak ditemukan' });

    const ext = file.originalname.split('.').pop();
    const newPath = `galleries/${existing.category}/${randomUUID()}.${ext}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(newPath, file.buffer, { contentType: file.mimetype });

    if (uploadError) return res.status(500).json({ error: uploadError.message });

    const { data: urlData } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(newPath);

    const { data, error } = await supabaseAdmin
      .from('galleries')
      .update({ image_url: urlData.publicUrl, image_path: newPath })
      .eq('id', id)
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });

    if (existing?.image_path) {
      await supabaseAdmin.storage.from(BUCKET).remove([existing.image_path]);
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/galleries/:id -> hapus data + gambarnya
router.delete('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;

  const { data: existing, error: findError } = await supabaseAdmin
    .from('galleries')
    .select('image_path')
    .eq('id', id)
    .single();

  if (findError) return res.status(404).json({ error: 'Data galeri tidak ditemukan' });

  const { error } = await supabaseAdmin.from('galleries').delete().eq('id', id);
  if (error) return res.status(500).json({ error: error.message });

  if (existing?.image_path) {
    await supabaseAdmin.storage.from(BUCKET).remove([existing.image_path]);
  }

  res.status(204).send();
});

module.exports = router;
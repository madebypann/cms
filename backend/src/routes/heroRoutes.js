const express = require('express');
const multer = require('multer');
const { randomUUID } = require('crypto');
const { supabaseAdmin } = require('../lib/supabaseClient');
const { requireAuth } = require('../middleware/requireAuth');

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 4 * 1024 * 1024 }, // maksimal 5MB
});

const BUCKET = 'school-images';


// GET /api/hero -> ambil hero yang AKTIF saja, untuk halaman publik (tidak perlu login)
router.get('/', async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('hero_slides')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// GET /api/hero/all -> ambil SEMUA hero (termasuk nonaktif), khusus admin
router.get('/all', requireAuth, async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('hero_slides')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// POST /api/hero -> upload gambar baru + buat data hero slide
router.post('/', requireAuth, upload.single('image'), async (req, res) => {
  try {
    const { title, subtitle } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'File gambar wajib diupload (field name: image)' });
    }

    const ext = file.originalname.split('.').pop();
    const filePath = `hero/${randomUUID()}.${ext}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(filePath, file.buffer, { contentType: file.mimetype });

    if (uploadError) {
      return res.status(500).json({ error: uploadError.message });
    }

    const { data: urlData } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(filePath);

    const { data, error } = await supabaseAdmin
      .from('hero_slides')
      .insert({
        title: title || null,
        subtitle: subtitle || null,
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

// PUT /api/hero/:id -> update teks/urutan/status aktif (tanpa ganti gambar)
router.put('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const { title, subtitle, sort_order, is_active } = req.body;

  const { data, error } = await supabaseAdmin
    .from('hero_slides')
    .update({ title, subtitle, sort_order, is_active })
    .eq('id', id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// PUT /api/hero/:id/image -> ganti gambar yang sudah ada
router.put('/:id/image', requireAuth, upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'File gambar wajib diupload (field name: image)' });
    }

    // 1. ambil dulu data lama, kita butuh image_path lamanya untuk dihapus nanti
    const { data: existing, error: findError } = await supabaseAdmin
      .from('hero_slides')
      .select('image_path')
      .eq('id', id)
      .single();

    if (findError) return res.status(404).json({ error: 'Data hero tidak ditemukan' });

    // 2. upload file baru dengan nama baru (bukan overwrite nama lama)
    const ext = file.originalname.split('.').pop();
    const newPath = `hero/${randomUUID()}.${ext}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(newPath, file.buffer, { contentType: file.mimetype });

    if (uploadError) return res.status(500).json({ error: uploadError.message });

    const { data: urlData } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(newPath);

    // 3. update record dengan URL & path baru
    const { data, error } = await supabaseAdmin
      .from('hero_slides')
      .update({ image_url: urlData.publicUrl, image_path: newPath })
      .eq('id', id)
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });

    // 4. baru sekarang hapus file lama dari Storage
    if (existing?.image_path) {
      await supabaseAdmin.storage.from(BUCKET).remove([existing.image_path]);
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/hero/:id -> hapus data + gambarnya
router.delete('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;

  // 1. ambil dulu image_path-nya sebelum data dihapus
  const { data: existing, error: findError } = await supabaseAdmin
    .from('hero_slides')
    .select('image_path')
    .eq('id', id)
    .single();

  if (findError) return res.status(404).json({ error: 'Data hero tidak ditemukan' });

  // 2. hapus record dari database
  const { error } = await supabaseAdmin.from('hero_slides').delete().eq('id', id);
  if (error) return res.status(500).json({ error: error.message });

  // 3. hapus file gambar dari Storage
  if (existing?.image_path) {
    await supabaseAdmin.storage.from(BUCKET).remove([existing.image_path]);
  }

  res.status(204).send();
});

module.exports = router;

module.exports = router;
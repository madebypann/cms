const express = require('express');
const { supabaseAdmin } = require('../lib/supabaseClient');
const { requireAuth } = require('../middleware/requireAuth');

const router = express.Router();

// GET /api/content -> ambil semua section (dipakai admin maupun publik)
router.get('/', async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('content_sections')
    .select('*');

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.json(data);
});

// GET /api/content/:key -> ambil satu section berdasarkan section_key
router.get('/:key', async (req, res) => {
  const { key } = req.params;
  const { data, error } = await supabaseAdmin
    .from('content_sections')
    .select('*')
    .eq('section_key', key)
    .single();

  if (error) return res.status(404).json({ error: 'Section tidak ditemukan' });
  res.json(data);
});

// POST /api/content -> buat section baru
router.post('/', requireAuth, async (req, res) => {
  const { section_key, title, body, items } = req.body;

  if (!section_key) {
    return res.status(400).json({ error: 'section_key wajib diisi' });
  }

  const { data, error } = await supabaseAdmin
    .from('content_sections')
    .insert({ section_key, title, body, items })
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.status(201).json(data);
});

// PUT /api/content/:key -> update section yang sudah ada
router.put('/:key', requireAuth, async (req, res) => {
  const { key } = req.params;
  const { title, body, items } = req.body;

  const { data, error } = await supabaseAdmin
    .from('content_sections')
    .update({ title, body, items })
    .eq('section_key', key)
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.json(data);
});

// DELETE /api/content/:key -> hapus section
router.delete('/:key', requireAuth,async (req, res) => {
  const { key } = req.params;

  const { error } = await supabaseAdmin
    .from('content_sections')
    .delete()
    .eq('section_key', key);

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.status(204).send();
});

module.exports = router;
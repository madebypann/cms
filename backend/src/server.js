require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { supabaseAdmin } = require('./lib/supabaseClient');
const contentRoutes = require('./routes/contentRoutes');
const heroRoutes = require('./routes/heroRoutes');
const galleryRoutes = require('./routes/galleryRoutes');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Halo, server backend jalan!');
});

app.get('/test-db', async (req, res) => {
  const { data, error } = await supabaseAdmin.from('hero_slides').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Koneksi ke Supabase berhasil!', data });
});

app.use('/api/content', contentRoutes);
app.use('/api/hero', heroRoutes);
app.use('/api/galleries', galleryRoutes);

app.listen(PORT, () => {
  console.log(`Server jalan di http://localhost:${PORT}`);
});
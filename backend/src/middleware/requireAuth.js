const { supabaseAuthClient } = require('../lib/supabaseClient');

async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Token tidak ditemukan. Silakan login.' });
  }

  const { data, error } = await supabaseAuthClient.auth.getUser(token);

  if (error || !data?.user) {
    return res.status(401).json({ error: 'Token tidak valid atau sudah kedaluwarsa.' });
  }

  req.user = data.user; // simpan info user ke request, siapa tau dibutuhkan handler nanti
  next(); // lolos, lanjut ke handler berikutnya
}

module.exports = { requireAuth };
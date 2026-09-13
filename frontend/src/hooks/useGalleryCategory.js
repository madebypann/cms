import { useEffect, useState } from 'react';
import api from '../lib/api';

/**
 * Hook untuk ambil semua foto AKTIF dari 1 kategori galeri.
 * Dipakai oleh section manapun yang menampilkan foto (Kegiatan Unggulan,
 * Prestasi, Fasilitas, Pengurus Yayasan, Guru, dst).
 *
 * Return: { loading, items }
 */
export function useGalleryCategory(category) {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/galleries?category=${category}`)
      .then((res) => setItems(res.data))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [category]);

  return { loading, items };
}
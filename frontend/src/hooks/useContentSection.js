import { useEffect, useState } from 'react';
import api from '../lib/api';

/**
 * Hook untuk ambil data 1 section teks dari content_sections.
 * Dipakai oleh section bertipe teks (Visi, Sejarah) maupun list (Misi, Kurikulum, dst)
 * karena keduanya sama-sama datang dari tabel yang sama, cuma beda field yang dipakai.
 *
 * Return: { loading, body, items }
 * - body: string (untuk section bertipe teks)
 * - items: array of string (untuk section bertipe list)
 */
export function useContentSection(sectionKey) {
  const [loading, setLoading] = useState(true);
  const [body, setBody] = useState('');
  const [items, setItems] = useState([]);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/content/${sectionKey}`)
      .then((res) => {
        setBody(res.data.body || '');
        setItems(res.data.items || []);
      })
      .catch(() => {
        // section belum pernah dibuat di database -> anggap kosong, bukan error fatal
        setBody('');
        setItems([]);
      })
      .finally(() => setLoading(false));
  }, [sectionKey]);

  return { loading, body, items };
}
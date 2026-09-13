import { useParams } from 'react-router-dom';
import ManageHeroTab from './ManageHeroTab';
import ManageGalleryTab from './ManageGalleryTab';
import { CONTENT_CATEGORIES } from '../../config/contentCategories';

export default function ContentCategoryPage() {
  const { category } = useParams();
  const found = CONTENT_CATEGORIES.find((c) => c.key === category);

  if (!found) {
    return <p>Kategori tidak ditemukan.</p>;
  }

  if (category === 'banner') {
    return <ManageHeroTab />;
  }

  return <ManageGalleryTab category={category} label={found.label} hasDescription={found.hasDescription} />;
}
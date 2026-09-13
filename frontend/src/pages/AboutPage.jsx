import PublicTextSection from '../components/PublicTextSection';
import PublicListSection from '../components/PublicListSection';
import PublicGalleryGrid from '../components/PublicGalleryGrid';

export default function AboutPage() {
  return (
    <div>
      <PublicTextSection sectionKey="sejarah" title="Sejarah Sekolah" />
      <PublicTextSection sectionKey="visi" title="Visi" variant="blue" />
      <PublicListSection sectionKey="misi" title="Misi" variant="stacked" />
      <PublicGalleryGrid category="pengurus_yayasan" title="Pengurus Yayasan" />
    </div>
  );
}
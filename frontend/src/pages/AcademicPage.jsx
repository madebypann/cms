import PublicListSection from '../components/PublicListSection';
import PublicGalleryGrid from '../components/PublicGalleryGrid';

export default function AcademicPage() {
  return (
    <div>
      <PublicListSection sectionKey="kurikulum" title="Kurikulum" id="kurikulum" variant="timeline" />
      <PublicListSection sectionKey="ekstrakurikuler" title="Ekstrakurikuler" id="ekstrakurikuler" variant="timeline" />
      <PublicGalleryGrid category="guru" title="Guru" id="guru" />
    </div>
  );
}
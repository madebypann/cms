import { useParams } from 'react-router-dom';
import ManageTextSection from './ManageTextSection';
import ManageVisiMisiSection from './ManageVisiMisiSection';
import { TEXT_SECTIONS } from '../../config/textSections';

export default function TextSectionPage() {
  const { sectionKey } = useParams();
  const found = TEXT_SECTIONS.find((s) => s.key === sectionKey);

  if (!found) {
    return <p>Section tidak ditemukan.</p>;
  }

  if (found.type === 'visi_misi') {
    return <ManageVisiMisiSection />;
  }

  return <ManageTextSection section={found} />;
}
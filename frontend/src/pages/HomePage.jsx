import PublicHeroSlider from '../components/PublicHeroSlider';
import StrategiPembelajaranSection from '../components/sections/StrategiPembelajaranSection';
import KegiatanUnggulanSection from '../components/sections/KegiatanUnggulanSection';
import ContactSection from '../components/sections/ContactSection';

export default function HomePage() {
  return (
    <div>
      <PublicHeroSlider />
      <StrategiPembelajaranSection />
      <KegiatanUnggulanSection />
      <ContactSection />
    </div>
  );
}
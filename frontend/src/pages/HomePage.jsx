import PublicHeroSlider from '../components/PublicHeroSlider';
import StrategiPembelajaranSection from '../components/sections/StrategiPembelajaranSection';
import KegiatanUnggulanSection from '../components/sections/KegiatanUnggulanSection';
import PublicContactPlaceholder from '../components/PublicContactPlaceholder';

export default function HomePage() {
  return (
    <div>
      <PublicHeroSlider />
      <StrategiPembelajaranSection />
      <KegiatanUnggulanSection />
      <PublicContactPlaceholder />
    </div>
  );
}
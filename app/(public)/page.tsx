import HeroSection from "@/components/public/hero/HeroSection";
import StatsBar from "@/components/public/stats/StatsBar";
import WhyUsSection from "@/components/public/why-us/WhyUsSection";
import ImageCarousel from "@/components/public/ImageCarousel";
import ProgramsSection from "@/components/public/programs/ProgramsSection";
import NewsSection from "@/components/public/news/NewsSection";
import DownloadsSection from "@/components/public/DownloadsSection";
import CtaSection from "@/components/public/cta/CtaSection";
import { getSetting } from "@/lib/db/settings";
import { getCarouselImages, getNewsImages } from "@/lib/db/media";
import { getPublishedDownloads } from "@/lib/db/downloads";

export default async function HomePage() {
  const year = new Date().getFullYear();
  const startYear = new Date().getMonth() >= 7 ? year : year - 1;
  const academicYear = `${startYear}/${startYear + 1}`;

  const [heroDesktop, heroMobile, heroLegacy, carouselImages, newsImages, downloads] =
    await Promise.all([
      getSetting("hero_image_url_desktop").catch(() => ""),
      getSetting("hero_image_url_mobile").catch(() => ""),
      getSetting("hero_image_url").catch(() => ""),
      getCarouselImages(),
      getNewsImages(),
      getPublishedDownloads(),
    ]);

  const desktopUrl = heroDesktop || heroLegacy || undefined;
  const mobileUrl  = heroMobile  || heroLegacy || undefined;

  return (
    <div>
      <HeroSection desktopUrl={desktopUrl} mobileUrl={mobileUrl} />
      <StatsBar />
      <WhyUsSection />
      <ImageCarousel slides={carouselImages} />
      <ProgramsSection />
      <NewsSection images={newsImages} />
      <DownloadsSection downloads={downloads} />
      <CtaSection academicYear={academicYear} />
    </div>
  );
}

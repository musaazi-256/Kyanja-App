import HeroSection from "@/components/public/hero/HeroSection";
import TrustBar from "@/components/public/trust/TrustBar";
import ProgramsSection from "@/components/public/programs/ProgramsSection";
import HowToApplySection from "@/components/public/admissions/HowToApplySection";
import ImageCarousel from "@/components/public/ImageCarousel";
import TestimonialsSection from "@/components/public/testimonials/TestimonialsSection";
import WhyUsSection from "@/components/public/why-us/WhyUsSection";
import NewsSection from "@/components/public/news/NewsSection";
import DownloadsSection from "@/components/public/DownloadsSection";
import NewsletterSection from "@/components/public/newsletter/NewsletterSection";
import CtaSection from "@/components/public/cta/CtaSection";
import { getSetting } from "@/lib/db/settings";
import { getCarouselImages, getNewsImages } from "@/lib/db/media";
import { getPublishedDownloads } from "@/lib/db/downloads";
import { getPublishedTestimonials } from "@/lib/db/testimonials";

export default async function HomePage() {
  const year = new Date().getFullYear();
  const startYear = new Date().getMonth() >= 7 ? year : year - 1;
  const academicYear = `${startYear}/${startYear + 1}`;

  const [heroDesktop, heroMobile, heroLegacy, carouselImages, newsImages, downloads, testimonials] =
    await Promise.all([
      getSetting("hero_image_url_desktop").catch(() => ""),
      getSetting("hero_image_url_mobile").catch(() => ""),
      getSetting("hero_image_url").catch(() => ""),
      getCarouselImages(),
      getNewsImages(),
      getPublishedDownloads(),
      getPublishedTestimonials(),
    ]);

  const desktopUrl = heroDesktop || heroLegacy || undefined;
  const mobileUrl  = heroMobile  || heroLegacy || undefined;

  return (
    <div>
      <HeroSection desktopUrl={desktopUrl} mobileUrl={mobileUrl} />
      <TrustBar />
      <ProgramsSection />
      <HowToApplySection />
      <ImageCarousel slides={carouselImages} />
      <TestimonialsSection testimonials={testimonials} />
      <WhyUsSection />
      <NewsSection images={newsImages} />
      <DownloadsSection downloads={downloads} />
      <NewsletterSection />
      <CtaSection academicYear={academicYear} />
    </div>
  );
}

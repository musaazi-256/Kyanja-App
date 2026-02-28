import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  BookOpen,
  Users,
  Star,
  ArrowRight,
  GraduationCap,
  Heart,
  Globe,
} from "lucide-react";
import HeroSection from "@/components/public/hero/HeroSection";
import ImageCarousel from "@/components/public/ImageCarousel";
import DownloadsSection from "@/components/public/DownloadsSection";
import AnimatedCounter from "@/components/public/AnimatedCounter";
import { getSetting } from "@/lib/db/settings";

export default async function HomePage() {
  const year = new Date().getFullYear();
  const startYear = new Date().getMonth() >= 7 ? year : year - 1;
  const academicYear = `${startYear}/${startYear + 1}`;

  // Fetch hero image URLs; fall back to legacy single key; ignore errors (e.g. missing credentials locally)
  const [heroDesktop, heroMobile, heroLegacy] = await Promise.all([
    getSetting("hero_image_url_desktop").catch(() => ""),
    getSetting("hero_image_url_mobile").catch(() => ""),
    getSetting("hero_image_url").catch(() => ""),
  ]);
  const desktopUrl = heroDesktop || heroLegacy || undefined;
  const mobileUrl  = heroMobile  || heroLegacy || undefined;

  return (
    <div>
      <HeroSection desktopUrl={desktopUrl} mobileUrl={mobileUrl} />

      {/* Stats bar */}
      <section className="bg-blue-900 text-white py-6 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { end: 500, suffix: "+", label: "Students Enrolled" },
            { end: 40, suffix: "+", label: "Qualified Teachers" },
            { end: 20, suffix: "+", label: "Years of Excellence" },
            { end: 98, suffix: "%", label: "Promotion Rate" },
          ].map(({ end, suffix, label }) => (
            <div key={label}>
              <p className="text-3xl font-bold text-blue-300">
                <AnimatedCounter end={end} suffix={suffix} />
              </p>
              <p className="text-white/60 text-sm mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why choose us */}
      <section className="py-24 px-4 bg-slate-50 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-blue-100 rounded-full blur-3xl opacity-50 pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-amber-100 rounded-full blur-3xl opacity-50 pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-semibold tracking-wider uppercase text-sm mb-2 block">
              Our Core Values
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
              Why Kyanja Junior School?
            </h2>
            <div className="w-24 h-1 bg-blue-500 mx-auto rounded-full mb-6"></div>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
              We believe every child has unique potential. Our nurturing
              environment is thoughtfully designed to help them discover,
              explore, and develop their exceptional talents.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: BookOpen,
                title: "Quality Curriculum",
                desc: "Uganda National Curriculum implemented by experienced, passionate educators dedicated to academic excellence.",
                colorClass: "bg-blue-100 text-blue-600",
              },
              {
                icon: Heart,
                title: "Holistic Development",
                desc: "We nurture emotional intelligence, creativity, and social skills alongside a strong academic foundation.",
                colorClass: "bg-rose-100 text-rose-600",
              },
              {
                icon: Users,
                title: "Small Class Sizes",
                desc: "Smaller classes mean more individual attention and a stronger, supportive teacher-student relationship.",
                colorClass: "bg-amber-100 text-amber-600",
              },
              {
                icon: GraduationCap,
                title: "Experienced Staff",
                desc: "Our qualified and dedicated teachers bring years of specialized experience in early and primary education.",
                colorClass: "bg-emerald-100 text-emerald-600",
              },
              {
                icon: Globe,
                title: "Safe Environment",
                desc: "A secure, child-friendly campus where students feel safe, valued, and inspired to learn every day.",
                colorClass: "bg-purple-100 text-purple-600",
              },
              {
                icon: Star,
                title: "Proven Track Record",
                desc: "Consistently strong academic results with many alumni thriving and excelling in top secondary schools.",
                colorClass: "bg-indigo-100 text-indigo-600",
              },
            ].map(({ icon: Icon, title, desc, colorClass }, index) => (
              <Card
                key={title}
                className="border-0 bg-white hover:-translate-y-2 transition-all duration-300 rounded-2xl group overflow-hidden"
              >
                <CardContent className="pt-10 pb-8 px-8 text-center flex flex-col items-center h-full relative z-10">
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 ${colorClass}`}>
                    <Icon className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors">
                    {title}
                  </h3>
                  <p className="text-slate-600 text-base leading-relaxed">
                    {desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Image Carousel Showcase */}
      <ImageCarousel />

      {/* Programs preview */}
      <section className="py-24 px-4 bg-linear-to-b from-white to-slate-50 relative">
        <div className="max-w-6xl mx-auto mt-8">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-semibold tracking-wider uppercase text-sm mb-2 block">
              Educational Journey
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
              Our Programs
            </h2>
            <div className="w-24 h-1 bg-blue-500 mx-auto rounded-full mb-6"></div>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              We offer comprehensive educational programs tailored to meet the developmental
              needs of every child at each critical stage of their learning journey.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              {
                name: "Early Childhood",
                desc: "Baby Class to Top Class",
                age: "Ages 3–5",
                color: "bg-amber-50 group-hover:bg-amber-100 border-amber-200",
                iconColor: "text-amber-600 bg-amber-100",
                icon: Heart,
              },
              {
                name: "Lower Primary",
                desc: "Primary 1 to Primary 4",
                age: "Ages 6–9",
                color: "bg-blue-50 group-hover:bg-blue-100 border-blue-200",
                iconColor: "text-blue-600 bg-blue-100",
                icon: BookOpen,
              },
              {
                name: "Upper Primary",
                desc: "Primary 5 to Primary 7",
                age: "Ages 10–13",
                color: "bg-emerald-50 group-hover:bg-emerald-100 border-emerald-200",
                iconColor: "text-emerald-600 bg-emerald-100",
                icon: GraduationCap,
              },
            ].map(({ name, desc, age, color, iconColor, icon: Icon }) => (
              <div
                key={name}
                className="p-6 md:p-8 rounded-[2rem] border border-slate-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 group relative overflow-hidden bg-white cursor-pointer flex flex-col h-full items-center text-center"
              >
                {/* Decorative blob */}
                <div className={`absolute -top-12 -right-12 w-48 h-48 rounded-full opacity-[0.03] transition-transform duration-700 group-hover:scale-150 ${color.split(' ')[0]}`}></div>
                
                {/* Top Section: Icon */}
                <div className="mb-8 relative z-10 w-fit">
                  <div className={`w-16 h-16 rounded-[1.25rem] flex items-center justify-center shadow-[inset_0_2px_10px_rgba(255,255,255,0.6)] ${iconColor}`}>
                    <Icon className="w-8 h-8" strokeWidth={2} />
                  </div>
                  <div className="absolute inset-0 bg-white/20 blur-md rounded-2xl mix-blend-overlay"></div>
                </div>
                
                {/* Main Content Area */}
                <div className="flex flex-col items-center grow relative z-10 w-full">
                  <div className="inline-flex items-center justify-center px-3 py-1.5 rounded-full text-[11px] font-bold tracking-widest uppercase mb-4 bg-slate-50 text-slate-500 w-fit">
                    {age}
                  </div>
                  
                  <h3 className="text-[1.4rem] font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors tracking-tight">{name}</h3>
                  <p className="text-slate-500 text-[15px] leading-relaxed mb-8 max-w-[200px] sm:max-w-none">{desc}</p>
                  
                  <div className="flex items-center justify-center text-[15px] font-bold text-blue-600 group-hover:text-blue-700 mt-auto w-fit">
                    Learn more
                    <ArrowRight className="w-[18px] h-[18px] ml-1.5 transform group-hover:translate-x-1.5 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 py-6 text-base font-semibold shadow-md hover:shadow-lg transition-all">
              <Link href="/programs">
                Explore All Programs <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Downloads Section */}
      <DownloadsSection />

      {/* CTA */}
      <section className="py-20 px-4 bg-blue-900 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Join the Kyanja Family?
          </h2>
          <p className="text-white/70 mb-8">
            Applications for {academicYear} are now open. Secure your
            child&apos;s place today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-white text-[#1e3a5f] hover:bg-white/90 font-semibold active:scale-95 transition-all shadow-xl"
            >
              <Link href="/admissions/apply">Start Application</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 active:scale-95 transition-all"
            >
              <Link href="/admissions">Learn About Admissions</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

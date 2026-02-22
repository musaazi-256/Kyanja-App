import Image from "next/image";
import Link from "next/link";

interface Props {
  desktopUrl?: string;
  mobileUrl?: string;
}

export default function HeroSection({ desktopUrl, mobileUrl }: Props) {
  return (
    <section className="relative bg-white py-10 md:py-14 overflow-hidden">
      {/* Container card */}
      <div className="container bg-blue-900 mx-auto px-6 py-8 md:py-10 rounded-3xl flex flex-col lg:flex-row items-center gap-8 justify-between">

        {/* Left Column */}
        <div className="w-full lg:w-1/2 z-10 lg:pr-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[6rem] font-light text-white mb-6 leading-[1.1] text-center lg:text-left">
            <span className="font-bold">Education</span> is
            <br />a <span className="font-medium">Treasure</span>
          </h1>

          <p className="text-blue-300 text-sm text-center lg:text-left mb-10 max-w-md mx-auto lg:mx-0">
            Our mission: To produce a well-rounded, educated learner who is
            spiritual, moral, social, focused, holistic, and self-reliant.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center lg:justify-start items-center gap-6">
            <Link
              href="/admissions"
              className="bg-[#fbbf24] hover:bg-yellow-400 text-black font-semibold py-3.5 px-8 rounded-full transition-transform hover:scale-105 shadow-sm"
            >
              Enroll Your Child
            </Link>

            <a
              href="https://www.youtube.com/@KyanjaJuniorSchool"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Watch Kyanja Junior School on YouTube"
              className="flex items-center gap-3 text-white font-bold text-sm tracking-wide hover:opacity-80 transition-opacity group"
            >
              <span className="flex items-center justify-center w-10 h-10 bg-[#0052FF] group-hover:bg-blue-700 transition-colors rounded-full text-white shadow-md">
                <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4.5 3.5l12 6.5-12 6.5v-13z" />
                </svg>
              </span>
              <span className="underline decoration-2 underline-offset-4 decoration-blue-400">
                SEE HOW IT WORKS
              </span>
            </a>
          </div>
        </div>

        {/* Right Column — hidden on mobile if no mobile image uploaded */}
        <div className={`w-full lg:w-1/2 relative flex items-center justify-center${!mobileUrl ? ' hidden lg:flex' : ''}`}>

          {/* Decorative blobs (desktop only) */}
          <div className="hidden lg:block absolute top-0 right-0 w-40 h-40 bg-[#fbbf24] rounded-full mix-blend-multiply opacity-80 translate-x-12 -translate-y-12 z-0" />
          <div className="hidden lg:block absolute bottom-4 left-4 w-12 h-12 bg-blue-400 rounded-full z-0 -translate-x-8 translate-y-8" />
          <div className="hidden lg:block absolute top-1/2 left-0 w-4 h-4 bg-purple-400 rounded-full z-0 -translate-x-6" />
          <div className="hidden lg:block absolute bottom-0 right-10 w-6 h-6 bg-green-500 rounded-full z-0 translate-y-10" />

          {/* Mobile image — visible below lg, hidden on desktop */}
          {mobileUrl && (
            <div className="relative w-full aspect-video overflow-hidden rounded-2xl shadow-lg z-10 lg:hidden">
              <Image
                src={mobileUrl}
                alt="Kyanja Junior School"
                fill
                priority
                className="object-cover object-center"
                sizes="100vw"
              />
            </div>
          )}

          {/* Desktop image — visible on lg+, hidden on mobile */}
          {desktopUrl ? (
            <div className="relative w-full aspect-4/3 overflow-hidden rounded-3xl shadow-lg z-10 hidden lg:block">
              <Image
                src={desktopUrl}
                alt="Kyanja Junior School"
                fill
                priority
                className="object-cover object-center"
                sizes="50vw"
              />
            </div>
          ) : (
            <div className="relative w-full aspect-4/3 rounded-3xl z-10 bg-blue-800/50 border-2 border-dashed border-blue-600 hidden lg:flex items-center justify-center">
              <p className="text-blue-400 text-sm text-center px-4">
                Upload a desktop hero image<br />via the admin Media Library
              </p>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}

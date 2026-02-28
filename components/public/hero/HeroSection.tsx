import Image from "next/image";
import Link from "next/link";

interface Props {
  desktopUrl?: string;
  mobileUrl?: string;
}

export default function HeroSection({ desktopUrl, mobileUrl }: Props) {
  return (
    <section className="relative bg-white py-10 md:py-14 overflow-hidden ">
      {/* Container card */}
      <div className="container bg-blue-900 lg:mx-auto mx-auto sm:mx-auto rounded-3xl overflow-hidden flex flex-col lg:flex-row items-center lg:items-stretch gap-8 lg:gap-0">
        {/* Left Column */}
        <div className="w-full lg:w-2/5 z-10   md:mt-10 lg:my-40 ms:mt-10 mt-8 ml-10  my-10 items-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl min-[1040px]:text-[4.8rem] xl:text-[6rem] font-light text-white mb-6 leading-[1.1] text-center lg:text-left">
            <span className="font-bold text-blue-400">Education</span> is
            <br />a <span className="font-bold">Treasure</span>
          </h1>

          <p className="text-white text-sm text-center lg:text-left mb-10 max-w-md mx-auto lg:mx-0">
            Our mission is to produce a well-rounded, educated learner who is
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

            <Link
              href="/about"
              className="text-white font-semibold py-3.5 px-8 rounded-full border-2 border-white/40 hover:border-white hover:bg-white/10 transition-all"
            >
              Contact Us
            </Link>
          </div>
        </div>

        {/* Mobile image — sits below text in the stacked column, hidden on desktop */}
        {mobileUrl && (
          <div className="w-full lg:hidden">
            <Image
              src={mobileUrl}
              alt="Kyanja Junior School"
              width={0}
              height={0}
              sizes="100vw"
              priority
              className="w-full h-auto rounded-2xl shadow-lg object-contain"
            />
          </div>
        )}

        {/* Right Column — desktop only, fills the remaining 60% of the card */}
        <div className="hidden lg:flex lg:w-3/5 relative self-stretch">
          {desktopUrl ? (
            <div className="absolute inset-0 overflow-hidden z-10">
              <Image
                src={desktopUrl}
                alt="Kyanja Junior School"
                fill
                priority
                className="object-contain object-center"
                sizes="60vw"
              />
            </div>
          ) : (
            <div className="absolute inset-0 z-10 bg-blue-800/50 border-l-2 border-dashed border-blue-600 flex items-center justify-center">
              <p className="text-blue-400 text-sm text-center px-4">
                Upload a desktop hero image
                <br />
                via the admin Media Library
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

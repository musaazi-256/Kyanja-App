import Image from "next/image";
import Link from "next/link";

interface Props {
  desktopUrl?: string;
  mobileUrl?: string;
}

export default function HeroSection({ desktopUrl, mobileUrl }: Props) {
  return (
    <section className="relative bg-white py-10 md:py-14 overflow-hidden">

      {/* Mobile-only hero image (shown above the card when uploaded) */}
      {mobileUrl && (
        <div className="relative w-full h-56 overflow-hidden lg:hidden mb-4">
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

        {/* Right Column */}
        <div className="w-full lg:w-1/2 relative">

          {/* Decorative blobs */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-[#fbbf24] rounded-full mix-blend-multiply opacity-80 translate-x-12 -translate-y-12 z-0" />
          <div className="absolute bottom-4 left-4 w-12 h-12 bg-blue-400 rounded-full z-0 -translate-x-8 translate-y-8" />
          <div className="absolute top-1/2 left-0 w-4 h-4 bg-purple-400 rounded-full z-0 -translate-x-6" />
          <div className="absolute bottom-0 right-10 w-6 h-6 bg-green-500 rounded-full z-0 translate-y-10" />

          {desktopUrl ? (
            /* Uploaded desktop image */
            <div className="relative w-full aspect-4/3 overflow-hidden rounded-3xl shadow-lg z-10">
              <Image
                src={desktopUrl}
                alt="Kyanja Junior School"
                fill
                priority
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          ) : (
            /* Default 2×2 image grid */
            <div className="grid grid-cols-2 gap-4 md:gap-6 relative z-10 w-full max-w-[500px] mx-auto lg:ml-auto lg:mr-0">

              {/* Top Left: Circle */}
              <div className="relative aspect-square overflow-hidden rounded-full shadow-lg bg-gray-100">
                <Image
                  src="https://i.ibb.co/Qf4g4Lq/image-5.png"
                  alt="Student 1"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Top Right: Rounded square, offset down */}
              <div className="relative aspect-square overflow-hidden rounded-[2.5rem] shadow-lg translate-y-6 bg-gray-100">
                <Image
                  src="https://i.ibb.co/9tVz6S9/image-6.png"
                  alt="Student 2"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Bottom Left: Rounded square, offset up */}
              <div className="relative aspect-square overflow-hidden rounded-[2.5rem] shadow-lg -translate-y-4 bg-gray-100">
                <Image
                  src="https://i.ibb.co/w4S41Xv/image-7.png"
                  alt="Student 3"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Bottom Right: Arch shape */}
              <div className="relative aspect-square overflow-hidden rounded-t-full rounded-b-[2rem] shadow-lg bg-gray-100">
                <Image
                  src="https://i.ibb.co/Z8gSg2L/image-8.png"
                  alt="Student 4"
                  fill
                  className="object-cover"
                />
              </div>

            </div>
          )}
        </div>
      </div>
    </section>
  );
}

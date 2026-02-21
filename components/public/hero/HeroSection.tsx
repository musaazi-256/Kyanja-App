import Image from 'next/image';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative bg-white py-16 md:py-24 overflow-hidden">

      {/* Container */}
      <div className="container mx-auto px-4 md:px-8 flex flex-col lg:flex-row items-center justify-between">

        {/* Left Column Content */}
        <div className="w-full lg:w-1/2 z-10 mb-16 lg:mb-0 pr-0 lg:pr-10">

          <p className="text-gray-400 text-xs md:text-sm font-semibold tracking-widest uppercase mb-4">
            100% Satisfaction Guarantee
          </p>

          <h1 className="text-5xl md:text-6xl lg:text-[4.5rem] font-light text-gray-900 mb-6 leading-[1.1]">
            Unlock <span className="font-bold">Your</span><br />
            Child&apos;s <span className="font-medium">Potential</span>
          </h1>

          <p className="text-gray-500 text-lg mb-10 max-w-md">
            We believe every child has unique talents and abilities waiting to be discovered.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-6">
            <Link
              href="/admission"
              className="bg-[#fbbf24] hover:bg-yellow-500 text-black font-semibold py-3.5 px-8 rounded-full transition-transform hover:scale-105 shadow-sm"
            >
              Join For Free
            </Link>

            <Link
              href="/about"
              className="flex items-center gap-3 text-black font-bold text-sm tracking-wide hover:opacity-80 transition-opacity group"
            >
              <span className="flex items-center justify-center w-10 h-10 bg-[#0052FF] group-hover:bg-blue-700 transition-colors rounded-full text-white shadow-md">
                {/* Play Icon */}
                <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4.5 3.5l12 6.5-12 6.5v-13z" />
                </svg>
              </span>
              <span className="underline decoration-2 underline-offset-4 decoration-gray-300">
                SEE HOW IT WORKS
              </span>
            </Link>
          </div>
        </div>

        {/* Right Column - The 2x2 Image Grid */}
        <div className="w-full lg:w-1/2 relative">

          {/* Background Decorative Shapes */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-[#fbbf24] rounded-full mix-blend-multiply opacity-80 translate-x-12 -translate-y-12 z-0"></div>
          <div className="absolute bottom-4 left-4 w-12 h-12 bg-blue-400 rounded-full z-0 -translate-x-8 translate-y-8"></div>
          <div className="absolute top-1/2 left-0 w-4 h-4 bg-purple-400 rounded-full z-0 -translate-x-6"></div>
          <div className="absolute bottom-0 right-10 w-6 h-6 bg-green-500 rounded-full z-0 translate-y-10"></div>

          {/* The Grid */}
          <div className="grid grid-cols-2 gap-4 md:gap-6 relative z-10 w-full max-w-[500px] mx-auto lg:ml-auto lg:mr-0">

            {/* Top Left: Perfect Circle */}
            <div className="relative aspect-square overflow-hidden rounded-full shadow-lg bg-gray-100">
              <Image
                src="https://i.ibb.co/Qf4g4Lq/image-5.png"
                alt="Student 1"
                fill
                className="object-cover"
              />
            </div>

            {/* Top Right: Rounded Square */}
            <div className="relative aspect-square overflow-hidden rounded-[2.5rem] shadow-lg translate-y-6 bg-gray-100">
              <Image
                src="https://i.ibb.co/9tVz6S9/image-6.png"
                alt="Student 2"
                fill
                className="object-cover"
              />
            </div>

            {/* Bottom Left: Rounded Square */}
            <div className="relative aspect-square overflow-hidden rounded-[2.5rem] shadow-lg -translate-y-4 bg-gray-100">
              <Image
                src="https://i.ibb.co/w4S41Xv/image-7.png"
                alt="Student 3"
                fill
                className="object-cover"
              />
            </div>

            {/* Bottom Right: Arch Shape */}
            <div className="relative aspect-square overflow-hidden rounded-t-full rounded-b-[2rem] shadow-lg bg-gray-100">
              <Image
                src="https://i.ibb.co/Z8gSg2L/image-8.png"
                alt="Student 4"
                fill
                className="object-cover"
              />
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

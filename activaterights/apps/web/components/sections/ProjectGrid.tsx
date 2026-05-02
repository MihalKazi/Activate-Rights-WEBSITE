import Image from "next/image";

export function Hero() {
  const lines = new Array(5).fill("internet demands freedom");

  return (
    <section className="hero-section relative flex min-h-[calc(100vh-64px)] flex-col overflow-hidden pt-8 md:pt-[34px]">
      {/* Globe background image */}
      <div className="hero-circle pointer-events-none absolute left-6 top-24 h-[340px] w-[340px] overflow-hidden rounded-full md:left-14 md:top-36 md:h-[470px] md:w-[470px]">
        <Image
          src="/images/hero-earth.png"
          alt=""
          fill
          priority
          className="object-cover opacity-[0.46] mix-blend-screen"
          sizes="(max-width: 768px) 340px, 470px"
        />
      </div>

      {/* Headline text */}
      <div className="hero-content relative z-10 px-6 pb-10 text-center md:px-8 md:pb-12">
        <div className="hero-lines home-headline-font space-y-0 text-[clamp(52px,7vw,94px)] lowercase leading-[0.92] text-white">
          {lines.map((line, index) => (
            <h1 key={`${line}-${index}`} className="whitespace-nowrap">
              {line}
            </h1>
          ))}
        </div>
      </div>

      {/* Stripes — flex-1 makes this grow to fill all remaining vertical space */}
      <div className="hero-stripes relative z-10 mx-6 mb-6 flex flex-1 flex-col gap-[5px] md:mx-8 md:mb-8">
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            className="w-full flex-1 bg-[#0a7058]/52"
          />
        ))}
      </div>
    </section>
  );
}
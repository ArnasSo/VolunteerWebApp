export default function Section({ title, children }) {
  return (
    <section className="mb-10 mt-10 min-w-0">
      {/* Section heading */}
      <h2 className="mb-2 text-xl font-semibold text-[#204F3D]">
        {title}
      </h2>

      {/* Horizontal scrolling cards */}
      <div className="-mx-5 min-w-0 overflow-x-auto overscroll-x-contain snap-x snap-mandatory scroll-pl-5 lg:mx-0 lg:overflow-visible lg:snap-none">
        <div className="flex w-max gap-4 pr-5 pb-2 lg:grid lg:w-full lg:grid-cols-3 lg:gap-6 lg:pr-0">

          {/* Left spacing on mobile only */}
          <div className="w-5 shrink-0 lg:hidden" aria-hidden="true" />

          {children}

        </div>
      </div>
    </section>
  );
}

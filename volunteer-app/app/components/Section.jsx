export default function Section({ title, children }) {
  return (
    <section className="mb-10 mt-10">
      {/* Section heading */}
      <h2 className="mb-5 text-xl font-semibold text-[#204F3D]">
        {title}
      </h2>

      {/* Horizontal scrolling cards */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {children}
      </div>
    </section>
  );
}

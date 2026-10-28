
export default function ArticleCard({ image, author, title, tags }) {
  return (
    <article

    className="flex w-full max-w-[345px] min-h-[231px] shrink-0 flex-col items-start justify-between rounded-[20px] bg-cover bg-center p-6 text-white"
      style={{
        backgroundImage: `
          linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(102,102,102,0) 100%),
          linear-gradient(0deg, rgba(0,0,0,0.3), rgba(0,0,0,0.3)),
          url('${image}')
        `,
      }}
    >
      {/* Author */}
      <p className="text-sm">by {author}</p>

      {/* Article information */}
      <div className="w-full">
        <h2 className="mb-3 text-xl font-bold leading-tight">
          {title}
        </h2>

        <div className="flex items-center justify-between gap-2">
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[#1F4D37] bg-white px-3 py-1 text-sm text-[#1F4D37]"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Arrow */}
          <span className="text-3xl">›</span>
        </div>
      </div>
    </article>
  );
}

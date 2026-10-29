import { Link } from "react-router";
import { supabase } from "../lib/supabase";

// Get the selected article from Supabase
export async function clientLoader({ params }) {
  const { data: article, error } = await supabase
    .from("articles")
    .select("*")
    .eq("id", params.articlesId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return { article };
}

export default function ArticleDetails({ loaderData }) {
  const { article } = loaderData;

  // Format published date
  const publishedDate = article.published_at
    ? new Date(article.published_at).toLocaleDateString("de-DE")
    : "";

  // Format reading time
  const readingTime = article.reading_time
    ? isNaN(article.reading_time)
      ? article.reading_time
      : `${article.reading_time} minutes read`
    : "";

  return (
    <main className="min-h-screen bg-white px-6 pt-8 pb-32 md:pt-12 md:pb-20">
      <article className="mx-auto w-full max-w-[800px]">
        {/* Article Title */}
        <h1 className="font-kbh text-[24px] font-bold leading-tight text-[#15181E] md:text-[40px]">
          {article.title}
        </h1>

        {/* Tags */}
        <div className="mt-4 flex flex-wrap gap-2">
          {(article.tags || []).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-[#2E6B4E] px-3 py-1 text-[12px] text-[#1F4D37]"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Author, Reading time and Date */}
        <div className="mt-5 flex items-start justify-between gap-4 text-[12px]">
          <p className="font-medium text-[#15181E]">{article.author}</p>

          <div className="text-right text-[#6A6C70]">
            <p>{readingTime}</p>
            <p className="mt-1">{publishedDate}</p>
          </div>
        </div>

        {/* Article Image */}
        {article.image_url && (
          <img
            src={article.image_url}
            alt={article.title}
            className="mt-5 aspect-[3/2] w-full rounded-[20px] object-cover md:aspect-[16/9]"
          />
        )}

        {/* Article Summary */}
        {article.summary && (
          <p className="mt-14 text-[14px] font-semibold leading-relaxed text-[#404247] md:mt-16 md:text-[16px]">
            {article.summary}
          </p>
        )}

        {/* Article Content */}
        <div className="mt-8 whitespace-pre-line text-[14px] leading-relaxed text-[#404247] md:text-[16px]">
          {article.content}
        </div>

        {/* Read More Articles CTA */}
        <div className="mt-16 flex justify-center">
          <Link
            to="/"
            className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-[#F26B4D] px-8 text-[14px] font-semibold text-white transition-colors hover:bg-[#D65A3F]"
          >
            Read more articles
          </Link>
        </div>
      </article>
    </main>
  );
}

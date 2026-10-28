import ArticleCard from "../components/ArticleCard";
import { supabase } from "../lib/supabase";

export function meta() {
  return [
    { title: "Volunteer Hub" },
    { name: "description", content: "Find local volunteering opportunities" },
  ];
}

export async function clientLoader() {
  const { data: articles, error } = await supabase
    .from("articles")
    .select("*")
    .order("published_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return { articles: articles || [] };
}

export default function Home({ loaderData }) {
  const { articles } = loaderData;
  return (
    <div className="px-6">
      {/* temporary heading until we build the home page from figma */}
      <div className="flex gap-4 items-center justify-center">
        <img
          src="/volunteer-hub-logo.svg"
          alt="volunteer hub log"
          className="mb-6 max-w-24 max-h-24"
        />
        <h1 className="font-kbh mb-6 text-center text-2xl font-[600] text-[#173F30]">
          Volunteer Hub
        </h1>
      </div>
      <div className="flex flex-col items-start gap-9">
        {articles.map((article) => (
          <ArticleCard
            key={article.id}
            image={article.image_url}
            author={article.author}
            title={article.title}
            tags={article.tags || []}
          />
        ))}
      </div>
    </div>
  );
}

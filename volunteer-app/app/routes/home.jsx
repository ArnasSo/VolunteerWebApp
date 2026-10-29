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

      {/* Hero Section */}
      <section
        className="flex w-full min-h-[355px] flex-col items-center justify-center gap-3 bg-cover bg-center px-6 lg:min-h-[519px]"
        style={{
          backgroundImage: `
      linear-gradient(0deg, rgba(0,0,0,0.4), rgba(0,0,0,0.4)),
      url("/images/hero.png")
    `,
        }}
      >
        {/* Hero Title */}
        <h1 className="font-kbh w-full max-w-[345px] text-center text-[32px] font-bold leading-tight text-[#DDEBDE] lg:max-w-[1000px] lg:text-[64px]">
          Find your way to make a difference
        </h1>

        {/* Hero Description */}
        <p className="w-full max-w-[300px] text-center font-[Inter] text-[14px] font-normal text-white lg:max-w-[568px] lg:text-[24px] lg:font-medium">
          Discover volunteering opportunities that fit your interests, schedule,
          and location.
        </p>
      </section>

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

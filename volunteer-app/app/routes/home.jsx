import ArticleCard from "../components/ArticleCard";
import { supabase } from "../lib/supabase";
import { Link } from "react-router";

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
    <div className="w-full bg-[#F3F8F3] pt-5 pb-24 md:pb-0">
      {/* temporary heading until we build the home page from figma */}
      <div className="flex items-center justify-center gap-4 px-6 md:hidden">
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
        className="flex w-full min-h-[355px] flex-col items-center justify-center gap-3 bg-cover bg-center px-6 lg:min-h-[519px] lg:bg-[center_35%]"
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

      {/* Statistics & CTA Section */}
      <section className="flex w-full flex-col items-center bg-[#F3F8F3] px-6 py-10">
        {/* Statistics */}
        <div className="inline-flex items-center gap-9">
          {["Opportunities", "Organizations", "Communities"].map((label) => (
            <div key={label} className="flex flex-col items-center">
              <div className="flex items-center gap-[3px] py-2">
                <span className="font-[Inter] text-[26px] font-semibold text-[#21272A]">
                  00+
                </span>
              </div>
              <p className="font-[Inter] text-[10px] font-normal text-[#21272A]">
                {label}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <Link
          to="/explore"
          className="mt-7 inline-flex h-[55px] w-full max-w-[340px] items-center justify-center rounded-full px-9 font-[Inter] text-[20px] font-semibold text-white"
          style={{
            background: "linear-gradient(91deg, #F26B4D 3.03%, #D65A3F 97.95%)",
          }}
        >
          <span style={{ WebkitTextStroke: "0.2px rgba(0,0,0,0.3)" }}>
            Start Exploring
          </span>
        </Link>

        {/* Description */}
        <p className="mt-4 w-[223px] max-w-full text-center font-[Inter] text-[10px] font-normal text-[#6A6C70]">
          We can help you find the perfect volunteer opportunities that match
          your interests and lifestyle.
        </p>
      </section>

      {/* Volunteer Guides & Tips */}
      <section className="mx-auto w-full max-w-[1232px] px-6 py-10 lg:pb-24">
        {/* Section Title */}
        <h2 className="font-kbh mb-6 text-[24px] font-bold text-[#1F4D37] lg:text-[36px]">
          Volunteer Guides & Tips
        </h2>
        <div className="flex flex-col items-start gap-9 lg:grid lg:grid-cols-3 lg:gap-6 md:items-center lg:items-stretch">
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
      </section>
    </div>
  );
}

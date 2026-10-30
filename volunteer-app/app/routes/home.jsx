import ArticleCard from "../components/ArticleCard";
import Statistic from "../components/Statistic";
import { useEffect } from "react";
import { useLocation } from "react-router";
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
  const location = useLocation();

  useEffect(() => {
    if (location.hash === "#articles") {
      const frame = requestAnimationFrame(() => {
        document.getElementById("articles")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });

      return () => cancelAnimationFrame(frame);
    }
  }, [location.hash, location.key]);
  return (
    <div className="w-full bg-[#F3F8F3]">
      <div
        className="flex items-center justify-center gap-6
       pt-6 px-6 md:hidden"
      >
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
      <section className="flex w-full flex-col items-center bg-[#F3F8F3] lg:gap-3 px-6 pt-12 pb-2 lg:py-14 lg:pb-6">
        {/* Statistics */}
        <div className="inline-flex items-center gap-9 lg:gap-16">
          <Statistic value="300+" label="Opportunities" />
          <Statistic value="90+" label="Organizations" />
          <Statistic value="60+" label="Communities" />
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
        <p className="mt-4 w-[223px] max-w-full text-center font-[Inter] text-[12px] md:text-[14px] font-normal text-[#6A6C70] lg:mt-4 lg:w-[420px] lg:text-[12px]">
          We can help you find the perfect volunteer opportunities that match
          your interests and lifestyle.
        </p>
      </section>

      {/* Volunteer Guides & Tips */}
      <section
        id="articles"
        className="mx-auto w-full max-w-[1232px] px-6 py-10 lg:pb-24"
      >
        {/* Section Title */}
        <h2 className="font-kbh mb-6 text-[24px] font-bold text-[#1F4D37] lg:text-[36px]">
          Volunteer Guides & Tips
        </h2>
        <div className="flex flex-col items-start gap-9 lg:grid lg:grid-cols-3 lg:gap-6 md:items-center lg:items-stretch">
          {articles.map((article) => (
            <Link
              key={article.id}
              to={`/articles/${article.id}`}
              className="block w-full max-w-[345px] lg:max-w-none"
            >
              <ArticleCard
                image={article.image_url}
                author={article.author}
                title={article.title}
                tags={article.tags || []}
              />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

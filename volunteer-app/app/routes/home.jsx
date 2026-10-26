
import { useLoaderData } from "react-router";
import { supabase } from "../lib/supabase";

export function meta() {
  return [
    { title: "Volunteer App" },
    { name: "description", content: "Find local volunteering opportunities" },
  ];
}

export async function clientLoader() {
  const { data, error } = await supabase
    .from("opportunities")
    .select("*");

  if (error) {
    throw new Error(error.message);
  }

  return { opportunities: data ?? [] };
}

export default function Home() {
  const { opportunities } = useLoaderData();

  return (
    <main>
      <h1>Volunteering Opportunities</h1>

      {opportunities.map((opportunity) => (
        <p key={opportunity.id}>{opportunity.title}</p>
      ))}
    </main>
  );
}

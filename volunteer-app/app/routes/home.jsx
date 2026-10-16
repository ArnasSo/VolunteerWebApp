import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export function meta() {
  return [
    { title: "Volunteer App" },
    { name: "description", content: "Find local volunteering opportunities" },
  ];
}

export default function Home() {
  const [opportunities, setOpportunities] = useState([]);
  
  useEffect(() => {
    async function fetchOpportunities() {
      const { data, error } = await supabase
        .from("opportunities")
        .select("*");

      if (error) {
        console.error("Supabase error:", error);
      } else {
        setOpportunities(data);
      }
    }

    fetchOpportunities();
  }, []);

  return (
  <main>
    <h1>Volunteering Opportunities</h1>

    {opportunities.map((opportunity) => (
      <p key={opportunity.id}>{opportunity.title}</p>
    ))}
  </main>
);
}
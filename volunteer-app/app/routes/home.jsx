import { Welcome } from "../welcome/welcome";
import { useEffect } from "react";
import { supabase } from "../lib/supabase";

export function meta() {
  return [
    { title: "Volunteer App" },
    { name: "description", content: "Find local volunteering opportunities" },
  ];
}

export default function Home() {
  useEffect(() => {
    async function fetchOpportunities() {
      const { data, error } = await supabase
        .from("opportunities")
        .select("*");

      if (error) {
        console.error("Supabase error:", error);
      } else {
        console.log("Opportunities:", data);
      }
    }

    fetchOpportunities();
  }, []);

  return <Welcome />;
}
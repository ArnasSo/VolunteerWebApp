import { Link, useSearchParams } from "react-router";
import { supabase } from "../lib/supabase";
import OpportunityCard from "../components/OpportunityCard";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";

// meta sets the browser tab title and description
export function meta() {
  return [
    { title: "Search Results | Volunteer Hub" },
    { name: "description", content: "Find volunteering opportunities" },
  ];
}

// clientLoader fetches opportunities from supabase
export async function clientLoader({ request }) {
  // read the url and its search parameters
  const url = new URL(request.url);

  // get the selected location from the url
  const location = url.searchParams.get("location");

  // get the selected interests and turn them into an array
  // filter(Boolean) removes empty values
  const interests = (url.searchParams.get("interests") || "")
    .split(",")
    .filter(Boolean);

  // get the information needed to display opportunity cards
  // we also fetch related information from other tables
  let query = supabase.from("opportunities").select(`
    id,
    title,
    image_url,
    commitment_type,
    duration,
    locations!inner(name),
    organizations(name),
    opportunity_interests(
      interests(name)
    )
  `);

  // only require matching interests when the user selected some
  if (interests.length > 0) {
    query = supabase.from("opportunities").select(`
      id,
      title,
      image_url,
      commitment_type,
      duration,
      locations!inner(name),
      organizations(name),
      opportunity_interests!inner(
        interests!inner(name)
      )
    `);
  }

  // filter by location only when a location was selected
  if (location) {
    query = query.eq("locations.name", location);
  }

  // filter by interests only when at least one was selected
  if (interests.length > 0) {
    // in means the interest can match any of the selected names
    query = query.in("opportunity_interests.interests.name", interests);
  }

  // run the query and wait for supabase
  const { data, error } = await query;

  // show a database error if something went wrong
  if (error) {
    throw new Error(error.message);
  }

  // get the currently logged-in volunteer
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // store the ids of saved opportunities
  let savedIds = [];

  // only fetch bookmarks when someone is logged in
  if (user) {
    const { data: saved, error: savedError } = await supabase
      .from("saved_opportunities")
      .select("opportunity_id")
      .eq("profile_id", user.id);

    if (savedError) {
      throw new Error(savedError.message);
    }

    // turn saved records into an array of opportunity ids
    savedIds = (saved || []).map((item) => item.opportunity_id);
  }

  // return both opportunities and saved ids
  return { opportunities: data || [], savedIds };
}

// loaderData contains the opportunities returned by clientLoader
export default function ExploreResults({ loaderData }) {
  // store the opportunities in a variable for easier reading
  const { opportunities, savedIds } = loaderData;

  // store the selected commitment filter
  const [selectedType, setSelectedType] = useState(null);

  // filter opportunities by the selected commitment type
  const filteredOpportunities = selectedType
    ? opportunities.filter(
        (opportunity) =>
          opportunity.commitment_type?.toLowerCase() ===
          selectedType.toLowerCase(),
      )
    : opportunities;

  // useSearchParams allows us to read information from the url
  // for example: /explore/results?location=Aarhus
  const [searchParams] = useSearchParams();

  // get the location from the url
  // if no location was selected, display "All locations"
  const location = searchParams.get("location") || "All locations";

  // get the interests from the url
  // split(",") turns the text into an array of individual interests
  // ?. prevents an error if there are no interests in the url
  // if nothing was selected, use an empty array
  const interests = searchParams.get("interests")?.split(",") || [];

  return (
    <div className="min-h-dvh bg-[#f4f9f5] px-4 pt-6 pb-24">
      <div className="mx-auto max-w-4xl">
        {/* search opportunities */}
        {/* selected search filters */}
        <Link
          to="/explore"
          className="mb-6 flex items-center gap-4 rounded-xl border-2 border-[#F5BE45] bg-white px-4 py-4"
        >
          <ChevronLeft size={24} className="shrink-0 text-gray-900" />

          <span className="truncate text-sm text-gray-700">{location}</span>

          <span className="min-w-0 flex-1 truncate text-sm text-gray-700">
            {interests.length > 0 ? interests.join(", ") : "All interests"}
          </span>
        </Link>
        {/* commitment type filters */}
        <div className="mb-6 flex justify-center gap-3">
          {["Flexible", "Short", "Regular"].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() =>
                setSelectedType(selectedType === type ? null : type)
              }
              className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                selectedType === type
                  ? "bg-[#204F3D] text-white"
                  : "bg-[#DDEBE1] text-[#204F3D]"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
        {/* show the selected interests if the user chose any */}
        {interests.length > 0 && (
          <div className="mt-3">
            <p className="font-medium">Selected interests:</p>

            {/* map creates one tag for each selected interest */}
            <div className="mt-2 flex flex-wrap gap-2">
              {interests.map((interest) => (
                <span
                  key={interest}
                  className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-800"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* show how many opportunities matched the search */}
        {/* opportunities.length counts the results returned by supabase */}
        {/* we use "in" instead of "nearby" because we filter by location name */}
        <p className="mt-4 text-center text-md text-gray-800 font-medium">
          <span className="font-bold">{filteredOpportunities.length} </span>
          {filteredOpportunities.length === 1
            ? "opportunity"
            : "opportunities"}{" "}
          {location === "All locations" ? "found" : `nearby ${location}`}
        </p>

        {/* display the opportunities received from supabase */}
        <div className="mt-6 space-y-8">
          {/* create one reusable card for each opportunity */}
          {filteredOpportunities.map((opportunity) => (
            <OpportunityCard
              key={opportunity.id}
              opportunity={opportunity}
              isSaved={savedIds.includes(opportunity.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

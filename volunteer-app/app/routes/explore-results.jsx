import { useSearchParams } from "react-router";
import { supabase } from "../lib/supabase";

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

  // get opportunities and their connected location and interests
  let query = supabase.from("opportunities").select(`
      id,
      title,
      locations!inner(name),
      opportunity_interests!inner(
        interests!inner(name)
      )
    `);

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

  // return the matching opportunities to the page
  return data || [];
}

// loaderData contains the opportunities returned by clientLoader
export default function ExploreResults({ loaderData }) {
  // store the opportunities in a variable for easier reading
  const opportunities = loaderData;

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
    <div className="mx-auto max-w-4xl p-4">
      {/* page heading */}
      <h1 className="text-2xl font-bold">Search Results</h1>

      {/* show the location selected on the explore page */}
      <p className="mt-2 text-gray-600">Location: {location}</p>

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

      {/* show a message if there are no opportunities */}
      {opportunities.length === 0 && (
        <p className="mt-6 text-gray-600">No opportunities found.</p>
      )}

      {/* display the opportunities received from supabase */}
      <div className="mt-6 space-y-3">
        {/* map creates one card for each opportunity */}
        {opportunities.map((opportunity) => (
          <div
            // key helps React identify each opportunity
            key={opportunity.id}
            className="rounded-lg border border-gray-200 p-4"
          >
            {/* display the title stored in our database */}
            <h2 className="font-semibold">{opportunity.title}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}

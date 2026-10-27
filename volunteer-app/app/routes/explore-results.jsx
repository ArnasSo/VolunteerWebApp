import { useSearchParams } from "react-router";

// meta sets the browser tab title and description
export function meta() {
  return [
    { title: "Search Results | Volunteer Hub" },
    { name: "description", content: "Find volunteering opportunities" },
  ];
}

export default function ExploreResults() {
  // useSearchParams allows us to read information from the url
  // for example: /explore/results?location=Aarhus
  const [searchParams] = useSearchParams();

  // get the location from the url
  // if no location was selected, use "All locations" instead
  const location = searchParams.get("location") || "All locations";

  return (
    <div className="mx-auto max-w-4xl p-4">
      {/* page heading */}
      <h1 className="text-2xl font-bold">Search Results</h1>

      {/* show the location selected on the explore page */}
      <p className="mt-2 text-gray-600">Location: {location}</p>

      {/* opportunity cards will be added here later */}
      <p className="mt-6">Volunteering opportunities will appear here.</p>
    </div>
  );
}

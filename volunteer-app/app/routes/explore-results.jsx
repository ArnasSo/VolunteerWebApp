export function meta() {
  return [
    { title: "Search Results | Volunteer Hub" },
    { name: "description", content: "Find volunteering opportunities" },
  ];
}

export default function ExploreResults() {
  return (
    <div className="p-4">
      {/* temporary content for the search results page */}
      <h1 className="text-2xl font-bold">Search Results</h1>

      <p className="mt-2 text-gray-600">
        Volunteering opportunities will appear here.
      </p>
    </div>
  );
}

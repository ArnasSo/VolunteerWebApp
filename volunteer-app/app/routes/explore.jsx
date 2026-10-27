export function meta() {
  return [
    { title: "Explore | Volunteer Hub" },
    {
      name: "description",
      content: "Explore local volunteering opportunities",
    },
  ];
}

export default function Explore() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Explore Opportunities</h1>
      <p className="mt-2 text-gray-600">
        Find volunteering opportunities that match your interests.
      </p>
    </div>
  );
}

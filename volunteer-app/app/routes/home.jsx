export function meta() {
  return [
    { title: "Volunteer Hub" },
    { name: "description", content: "Find local volunteering opportunities" },
  ];
}

export default function Home() {
  return (
    <div className="p-4">
      {/* temporary heading until we build the home page from figma */}
      <h1 className="text-2xl font-bold">Volunteer Hub</h1>
    </div>
  );
}

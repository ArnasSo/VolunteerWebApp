import { Link } from "react-router";

// opportunity is a prop containing the data for one opportunity
// the parent page passes this information to our component
export default function OpportunityCard({ opportunity }) {
  return (
    // link makes the entire card clickable
    // the id tells react router which opportunity details page to open
    <Link
      to={`/opportunities/${opportunity.id}`}
      className="block overflow-hidden rounded-lg border border-gray-200 bg-white"
    >
      {/* only display an image if the opportunity has one */}
      {opportunity.image_url && (
        <img
          // src is the image url stored in supabase
          src={opportunity.image_url}
          // alt describes the image for accessibility
          alt={opportunity.title}
          // w-full fills the card width
          // h-48 sets the image height
          // object-cover crops the image without stretching it
          className="h-48 w-full object-cover"
        />
      )}

      {/* container for the card's text content */}
      <div className="p-4">
        {/* organization name from the organizations table */}
        {/* ?. prevents an error if the organization is missing */}
        <p className="text-sm text-gray-500">
          {opportunity.organizations?.name}
        </p>

        {/* opportunity title */}
        <h2 className="mt-1 text-lg font-semibold">{opportunity.title}</h2>

        {/* location name from the locations table */}
        <p className="mt-2 text-sm text-gray-600">
          Location: {opportunity.locations?.name}
        </p>

        {/* commitment type from the opportunities table */}
        <p className="mt-1 text-sm text-gray-600">
          Commitment: {opportunity.commitment_type}
        </p>
      </div>
    </Link>
  );
}

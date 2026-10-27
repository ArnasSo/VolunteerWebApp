import { Link } from "react-router";
// icons used to show commitment, duration, and location
import { CalendarDays, Clock3, MapPin } from "lucide-react";

// opportunity is the data passed from our results page
export default function OpportunityCard({ opportunity }) {
  return (
    // link makes the entire card clickable
    <Link
      to={`/opportunities/${opportunity.id}`}
      className="block overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm"
    >
      {/* opportunity image */}
      {opportunity.image_url && (
        <img
          // src is the image url stored in supabase
          src={opportunity.image_url}
          // alt describes the image for accessibility
          alt={opportunity.title}
          // aspect-video gives the image a consistent shape
          // object-cover crops the image without stretching it
          className="aspect-video w-full object-cover"
        />
      )}

      {/* card content */}
      <div className="p-5">
        {/* opportunity title */}
        <h2 className="text-2xl font-bold leading-tight text-gray-900">
          {opportunity.title}
        </h2>

        {/* organization name */}
        <p className="mt-3 text-lg text-gray-600">
          {opportunity.organizations?.name}
        </p>

        {/* interest tags */}
        <div className="mt-4 flex flex-wrap gap-2">
          {opportunity.opportunity_interests?.map((item) => (
            <span
              key={item.interests.name}
              className="rounded-full border border-green-700 px-3 py-1 text-sm text-gray-700"
            >
              {item.interests.name}
            </span>
          ))}
        </div>

        {/* opportunity details */}
        <div className="mt-4 space-y-2 text-gray-800">
          {/* commitment type */}
          <div className="flex items-center gap-3">
            {/* size controls the icon dimensions */}
            {/* aria-hidden hides decorative icons from screen readers */}
            <CalendarDays size={20} aria-hidden="true" />
            <span>{opportunity.commitment_type}</span>
          </div>

          {/* duration */}
          <div className="flex items-center gap-3">
            <Clock3 size={20} aria-hidden="true" />
            <span>{opportunity.duration}</span>
          </div>

          {/* location */}
          <div className="flex items-center gap-3">
            <MapPin size={20} aria-hidden="true" />
            <span>{opportunity.locations?.name}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

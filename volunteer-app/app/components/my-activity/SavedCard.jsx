import { Link } from "react-router";
import { Bookmark } from "lucide-react";

export default function SavedCard({ savedOpportunity }) {
  // get the opportunity information from supabase
  const opportunity = savedOpportunity.opportunities;

  // don't display a card if the opportunity is missing
  if (!opportunity) return null;

  return (
    <Link
      to={`/opportunities/${opportunity.id}`}
      className="flex items-center gap-3 rounded-xl bg-white p-3 transition-colors hover:bg-gray-50"
    >
      {/* opportunity image */}
      {opportunity.image_url && (
        <img
          src={opportunity.image_url}
          alt=""
          className="h-24 w-24 shrink-0 rounded-lg object-cover"
        />
      )}

      {/* opportunity information */}
      <div className="min-w-0 flex-1">
        <h2 className="text-sm font-semibold text-gray-900">
          {opportunity.title}
        </h2>

        <p className="mt-1 text-xs text-gray-600">
          {opportunity.organizations?.name}
        </p>
      </div>

      {/* saved indicator */}
      <Bookmark
        size={20}
        fill="currentColor"
        className="shrink-0 text-[#204F3D]"
        aria-label="Saved opportunity"
      />
    </Link>
  );
}

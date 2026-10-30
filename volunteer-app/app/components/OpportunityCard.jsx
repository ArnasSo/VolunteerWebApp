import { Link } from "react-router";
// icons used to show commitment, duration, and location
import { CalendarDays, Clock3, MapPin, Bookmark } from "lucide-react";
import { useState } from "react";
import { useNavigate, useRevalidator } from "react-router";
import { supabase } from "../lib/supabase";

// opportunity is the data passed from our results page
export default function OpportunityCard({ opportunity, isSaved }) {
  // refresh saved status after updating a bookmark
  const revalidator = useRevalidator();
  const navigate = useNavigate();

  // prevent repeated clicks and display errors
  const [savingBookmark, setSavingBookmark] = useState(false);
  const [bookmarkError, setBookmarkError] = useState("");

  // save or remove the opportunity
  async function handleBookmark() {
    if (savingBookmark) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    // guests must log in before saving
    if (!user) {
      navigate("/login");
      return;
    }

    setSavingBookmark(true);
    setBookmarkError("");

    let error;

    if (isSaved) {
      // remove an existing bookmark
      ({ error } = await supabase
        .from("saved_opportunities")
        .delete()
        .eq("profile_id", user.id)
        .eq("opportunity_id", opportunity.id));
    } else {
      // save this opportunity
      ({ error } = await supabase.from("saved_opportunities").insert({
        profile_id: user.id,
        opportunity_id: opportunity.id,
      }));
    }

    if (error) {
      setBookmarkError(error.message);
    } else {
      // reload the saved ids from supabase
      revalidator.revalidate();
    }

    setSavingBookmark(false);
  }
  return (
    // relative lets us position the bookmark over the card image
    <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
      {/* link opens the opportunity details */}
      <Link to={`/opportunities/${opportunity.id}`} className="block">
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
        <div className="p-4">
          {/* opportunity title */}
          <h2 className="text-xl font-bold leading-tight text-gray-900">
            {opportunity.title}
          </h2>

          {/* organization name */}
          <p className="mt-2 text-sm text-gray-600">
            {opportunity.organizations?.name}
          </p>

          {/* interest tags */}
          <div className="mt-3 flex flex-wrap gap-2">
            {opportunity.opportunity_interests?.map((item) => (
              <span
                key={item.interests.name}
                className="rounded-full border border-[#1f4d37]/50 px-3 py-1 text-sm text-gray-700"
              >
                {item.interests.name}
              </span>
            ))}
          </div>

          {/* opportunity details */}
          <div className="mt-3 text-sm space-y-2 text-[#15181e]">
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
      {/* bookmark button positioned over the image */}
      <button
        type="button"
        onClick={handleBookmark}
        disabled={savingBookmark}
        aria-label={isSaved ? "Remove saved opportunity" : "Save opportunity"}
        aria-pressed={isSaved}
        className="absolute right-4 top-4 flex h-11 w-11
      items-center justify-center rounded-full 
      bg-[#DDEBE1] text-[#204F3D] shadow-sm disabled:opacity-50"
      >
        <Bookmark
          size={22}
          fill={isSaved ? "currentColor" : "none"}
          aria-hidden="true"
        />
      </button>

      {/* show bookmark errors */}
      {bookmarkError && (
        <p role="alert" className="px-5 pb-3 text-sm text-red-600">
          {bookmarkError}
        </p>
      )}
    </div>
  );
}

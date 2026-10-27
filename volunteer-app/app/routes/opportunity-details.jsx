import { Link } from "react-router";
import { ArrowLeft, CalendarDays, Clock3, MapPin } from "lucide-react";
import { supabase } from "../lib/supabase";

// meta sets the browser tab title
export function meta() {
  return [{ title: "Opportunity Details | Volunteer Hub" }];
}

// clientLoader fetches the opportunity that the user clicked
export async function clientLoader({ params }) {
  // params contains values from the url
  // opportunityId comes from our route: opportunities/:opportunityId
  const opportunityId = params.opportunityId;

  // fetch the selected opportunity and its related information
  const { data, error } = await supabase
    .from("opportunities")
    .select(
      `
        *,
        organizations(
          name,
          contact_name,
          contact_role,
          contact_email,
          contact_phone,
          contact_avatar_url
        ),
        locations(name),
        opportunity_interests(
          interests(name)
        )
      `,
    )
    // find the opportunity with the matching id
    .eq("id", opportunityId)

    // we expect one opportunity, not an array
    .single();

  // show an error if supabase cannot fetch the opportunity
  if (error) {
    throw new Error(error.message);
  }

  // return the opportunity to our page
  return data;
}

// loaderData contains the opportunity returned by clientLoader
export default function OpportunityDetails({ loaderData }) {
  // store the opportunity in a variable for easier reading
  const opportunity = loaderData;

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="mx-auto max-w-4xl px-6 py-6">
        {/* back link takes the user to explore results */}
        <Link
          to="/explore/results"
          className="mb-6 inline-flex items-center gap-2 text-green-800"
        >
          <ArrowLeft size={20} aria-hidden="true" />
          Back to results
        </Link>

        {/* opportunity title */}
        <h1 className="text-2xl font-bold leading-tight">
          {opportunity.title}
        </h1>

        {/* organization name below the title */}
        <p className="mt-2 text-gray-600">{opportunity.organizations?.name}</p>

        {/* opportunity image */}
        {/* only display it if the database contains an image url */}
        {opportunity.image_url && (
          <img
            src={opportunity.image_url}
            alt={opportunity.title}
            className="mt-6 aspect-video w-full object-cover"
          />
        )}

        {/* interest tags */}
        <div className="mt-6 flex flex-wrap gap-2">
          {/* map creates one tag for each connected interest */}
          {opportunity.opportunity_interests?.map((item) => (
            <span
              key={item.interests.name}
              className="rounded-full border border-green-700 px-3 py-1 text-sm text-gray-700"
            >
              {item.interests.name}
            </span>
          ))}
        </div>

        {/* quick information about the opportunity */}
        <div className="mt-4 space-y-2">
          {/* commitment type */}
          <div className="flex items-center gap-3">
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

        {/* opportunity description */}
        <section className="mt-8">
          {/* use the organization name as the heading, like in figma */}
          <h2 className="text-xl font-semibold">
            {opportunity.organizations?.name}
          </h2>

          {/* whitespace-pre-line keeps line breaks from database text */}
          <p className="mt-2 whitespace-pre-line">{opportunity.description}</p>
        </section>

        {/* volunteer responsibilities */}
        <section className="mt-6">
          <h2 className="text-xl font-semibold">What You'll Do</h2>

          <p className="mt-2 whitespace-pre-line">{opportunity.what_you_do}</p>
        </section>

        {/* impact section */}
        <section className="mt-6">
          <h2 className="text-xl font-semibold">What Impact You'll Make</h2>

          <p className="mt-2 whitespace-pre-line">{opportunity.impact}</p>
        </section>

        {/* application information */}
        <section className="mt-6">
          <h2 className="text-xl font-semibold">How to Apply</h2>

          <p className="mt-2 whitespace-pre-line">{opportunity.how_to_apply}</p>
        </section>

        {/* primary action button */}
        {/* the application functionality will be added later */}
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            className="w-full max-w-xs rounded-full bg-orange-600 px-6 py-4 text-lg font-semibold text-white"
          >
            Join as a volunteer
          </button>
        </div>

        {/* contact person section */}
        <section className="mt-8">
          <h2 className="mb-3 font-semibold text-green-900">Contact person</h2>

          {/* contact information comes from the organizations table */}
          <div className="flex items-center gap-4 rounded-3xl border border-green-100 bg-green-50 p-4">
            {/* only display an avatar if one is available */}
            {opportunity.organizations?.contact_avatar_url && (
              <img
                src={opportunity.organizations.contact_avatar_url}
                alt={opportunity.organizations.contact_name}
                className="h-16 w-16 shrink-0 rounded-full object-cover"
              />
            )}

            {/* contact name, role, phone number, and email */}
            <div className="space-y-1 text-sm">
              <p className="font-medium">
                {opportunity.organizations?.contact_name}
              </p>

              <p>{opportunity.organizations?.contact_role}</p>

              {/* only show the phone number if one exists */}
              {opportunity.organizations?.contact_phone && (
                <p>{opportunity.organizations.contact_phone}</p>
              )}

              <p>{opportunity.organizations?.contact_email}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

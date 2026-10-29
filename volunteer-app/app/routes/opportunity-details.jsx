import { useState } from "react";
import { Link, useNavigate, useRevalidator } from "react-router";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  MapPin,
  X,
  Check,
  Bookmark,
} from "lucide-react";
import { supabase } from "../lib/supabase";

// meta sets the browser tab title
export function meta() {
  return [{ title: "Opportunity Details | Volunteer Hub" }];
}

// clientLoader fetches the opportunity and the logged-in volunteer's profile
export async function clientLoader({ params }) {
  // get the opportunity id from the url
  const opportunityId = params.opportunityId;

  // fetch the selected opportunity and its related information
  const { data: opportunity, error: opportunityError } = await supabase
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
    .eq("id", opportunityId)
    .single();

  // stop if the opportunity could not be loaded
  if (opportunityError) {
    throw new Error(opportunityError.message);
  }

  // get the authenticated user, if there is one
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // guests can still view opportunity details
  // so we start with no profile
  let profile = null;

  // only fetch a profile if someone is logged in
  if (user) {
    const { data, error } = await supabase
      .from("profiles")
      .select("first_name, last_name, email, phone, avatar_url")
      .eq("id", user.id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    profile = data;
  }

  // check whether this volunteer has saved the opportunity
  let isSaved = false;

  if (user) {
    const { data: savedOpportunity, error: savedError } = await supabase
      .from("saved_opportunities")
      .select("opportunity_id")
      .eq("profile_id", user.id)
      .eq("opportunity_id", opportunityId)
      .maybeSingle();

    if (savedError) {
      throw new Error(savedError.message);
    }

    isSaved = Boolean(savedOpportunity);
  }

  // return the opportunity, profile, and bookmark status
  return { opportunity, profile, isSaved };
}

// loaderData contains the opportunity returned by clientLoader

export default function OpportunityDetails({ loaderData }) {
  // get the opportunity and profile from clientLoader
  const { opportunity, profile, isSaved } = loaderData;

  // refresh the loader after saving or removing a bookmark
  const revalidator = useRevalidator();

  // track bookmark updates and errors
  const [savingBookmark, setSavingBookmark] = useState(false);
  const [bookmarkError, setBookmarkError] = useState("");

  // save or remove this opportunity from the volunteer's saved list
  async function handleBookmark() {
    if (savingBookmark) return;

    // guests need to log in before saving opportunities
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      navigate("/login");
      return;
    }

    setSavingBookmark(true);
    setBookmarkError("");

    let error;

    if (isSaved) {
      // remove the existing bookmark
      ({ error } = await supabase
        .from("saved_opportunities")
        .delete()
        .eq("profile_id", user.id)
        .eq("opportunity_id", opportunity.id));
    } else {
      // save the opportunity for this volunteer
      ({ error } = await supabase.from("saved_opportunities").insert({
        profile_id: user.id,
        opportunity_id: opportunity.id,
      }));
    }

    if (error) {
      setBookmarkError(error.message);
    } else {
      // reload the saved status from supabase
      revalidator.revalidate();
    }

    setSavingBookmark(false);
  }

  // control whether the application overlay is visible
  const [showApplication, setShowApplication] = useState(false);

  // track whether an application is being submitted
  const [submitting, setSubmitting] = useState(false);

  // store an error message if submission fails
  const [applicationError, setApplicationError] = useState("");

  // remember whether the application was submitted successfully
  const [applicationSent, setApplicationSent] = useState(false);

  // store the optional message written by the volunteer
  const [message, setMessage] = useState(
    `Hi ${opportunity.organizations?.contact_name?.split(" ")[0] || "there"},\nI am interested in volunteering!`,
  );

  // navigate to Login if a guest tries to apply
  const navigate = useNavigate();

  // handle clicking the Join as a volunteer button
  function handleJoin() {
    // guests must log in before applying
    if (!profile) {
      navigate("/login");
      return;
    }

    // logged-in volunteers can open the application overlay
    setShowApplication(true);
  }

  // save the volunteer's application in supabase
  async function handleSendApplication() {
    // prevent repeated clicks while submitting
    if (submitting) return;

    // clear any previous error
    setApplicationError("");
    setSubmitting(true);

    // get the authenticated user from supabase
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    // stop if the user is no longer logged in
    if (authError || !user) {
      setSubmitting(false);
      navigate("/login");
      return;
    }

    // create a new application linked to this user and opportunity

    // create the application and return its generated id
    const { data: application, error } = await supabase
      .from("applications")
      .insert({
        profile_id: user.id,
        opportunity_id: opportunity.id,
        status: "Pending",
      })
      .select("id")
      .single();

    // if the application was saved and the volunteer wrote a message
    if (!error && application && message.trim()) {
      // save the message and connect it to the new application
      const { error: messageError } = await supabase.from("messages").insert({
        application_id: application.id,
        content: message.trim(),
      });

      // show an error if the message could not be saved
      if (messageError) {
        setApplicationError(
          "Your application was submitted, but the message could not be saved: " +
            messageError.message,
        );
        setSubmitting(false);
        return;
      }
    }

    // stop showing the loading state
    setSubmitting(false);

    // handle errors from supabase
    if (error) {
      // postgres error 23505 means a unique constraint was violated
      // our database prevents applying twice to the same opportunity
      if (error.code === "23505") {
        setApplicationError("You have already applied for this opportunity.");
      } else {
        setApplicationError(error.message);
      }

      return;
    }

    // remember that the application was successfully created
    setApplicationSent(true);

    // close the application overlay
    setShowApplication(false);
  }

  // combine first and last name for the application preview
  const fullName = profile
    ? `${profile.first_name || ""} ${profile.last_name || ""}`.trim()
    : "";

  // create initials for the volunteer's avatar
  const initials = profile
    ? `${profile.first_name?.[0] || ""}${profile.last_name?.[0] || ""}`.toUpperCase()
    : "";

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="mx-auto max-w-4xl px-6 py-6">
        {/* navigation and bookmark actions */}
        <div className="mb-6 flex items-center justify-between">
          {/* return to explore results */}
          <Link
            to="/explore/results"
            aria-label="Back to results"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-[#DDEBE1] text-[#204F3D]"
          >
            <ArrowLeft size={22} aria-hidden="true" />
          </Link>
          <button
            type="button"
            onClick={handleBookmark}
            disabled={savingBookmark}
            aria-label={
              isSaved ? "Remove saved opportunity" : "Save opportunity"
            }
            aria-pressed={isSaved}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-[#DDEBE1] text-[#204F3D] disabled:opacity-50"
          >
            <Bookmark
              size={22}
              fill={isSaved ? "currentColor" : "none"}
              aria-hidden="true"
            />
          </button>
        </div>

        {bookmarkError && (
          <p role="alert" className="mb-4 text-sm text-red-600">
            {bookmarkError}
          </p>
        )}

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

        {/* Opportunity Description */}
        <section className="mt-8">
          <h2 className="font-sans text-[20px] font-medium text-[#21272A]">
            Dansk Hund Kærlighed
          </h2>

          <div className="mt-3 space-y-3 font-sans text-[14px] font-normal leading-normal text-[#21272A]">
            <p>
              We help elderly dog owners and people with limited mobility make
              sure their furry friends get the walks they need.
            </p>
            <p>
              We connect volunteers with dog owners in their local area who need
              a little extra help. You can be matched with someone nearby or
              check our weekly list of dogs looking for a walking buddy.
            </p>
          </div>
        </section>

        {/* Volunteer Responsibilities */}
        <section className="mt-8">
          <h2 className="font-sans text-[20px] font-medium text-[#21272A]">
            What You'll Do
          </h2>

          <div className="mt-3 space-y-2 font-sans text-[14px] font-normal leading-normal text-[#21272A]">
            <p>Take dogs for walks in your local neighbourhood.</p>
            <p>Choose walking opportunities that fit your schedule.</p>
            <p>Spend around 40 minutes per walk.</p>
            <p>Help elderly dog owners care for their beloved pets.</p>
            <p>
              No professional experience is needed, but you should feel
              comfortable around dogs and enjoy spending time outdoors!
            </p>
          </div>
        </section>

        {/* Impact Section */}
        <section className="mt-8">
          <h2 className="font-sans text-[20px] font-medium text-[#21272A]">
            What Impact You'll Make
          </h2>

          <div className="mt-3 space-y-3 font-sans text-[14px] font-normal leading-normal text-[#21272A]">
            <p>
              Your help means more than just a walk. For many older dog owners,
              their pets are an important source of companionship, but taking
              them out regularly can become challenging.
            </p>
            <p>
              By volunteering, you'll help dogs stay healthy and active while
              giving their owners peace of mind. Even 40 minutes of your time
              can help older people maintain their independence and continue
              enjoying life with their beloved companions.
            </p>
          </div>
        </section>

        {/* Application Information */}
        <section className="mt-8">
          <h2 className="font-sans text-[20px] font-medium text-[#21272A]">
            How to Apply
          </h2>

          <div className="mt-3 space-y-3 font-sans text-[14px] font-normal leading-normal text-[#21272A]">
            <p>Interested in becoming a dog-walking volunteer?</p>
            <p>
              Send a short message to Benjamin Jakobsen, our volunteer
              coordinator, through Volunteer Hub.
            </p>
            <p>
              Benjamin will get back to you soon to discuss available
              opportunities and help you get started!
            </p>
          </div>
        </section>

        {/* primary action button */}
        {/* opens the application overlay for logged-in volunteers */}
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={handleJoin}
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

      {/* application overlay is only visible when the volunteer clicks Join */}
      {showApplication && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-5 py-6">
          {/* application panel */}
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="application-heading"
            className="relative max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-3xl bg-[#F4F9F5] px-7 py-8 shadow-xl"
          >
            {/* close button */}
            <button
              type="button"
              onClick={() => setShowApplication(false)}
              aria-label="Close application"
              className="absolute right-4 top-4 rounded-full bg-gray-900 p-1 text-white"
            >
              <X size={18} aria-hidden="true" />
            </button>

            {/* volunteer avatar */}
            <div className="flex flex-col items-center">
              {/* use the profile image if available */}
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={fullName}
                  className="h-20 w-20 rounded-full object-cover"
                />
              ) : (
                /* otherwise show initials */
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#2C7052] text-2xl font-semibold text-white">
                  {initials}
                </div>
              )}

              {/* volunteer name */}
              <h2 id="application-heading" className="mt-3 text-xl font-bold">
                {fullName}
              </h2>
            </div>

            {/* basic information */}
            <section className="mt-6">
              <h3 className="mb-2 font-semibold text-[#204F3D]">
                Basic Information
              </h3>

              <div className="space-y-2 rounded-2xl bg-white p-4">
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{profile?.email}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Phone number</p>
                  <p className="font-medium">{profile?.phone || "Not added"}</p>
                </div>
              </div>
            </section>

            {/* schedule and opportunity location */}
            <section className="mt-5">
              <h3 className="mb-2 font-semibold text-[#204F3D]">
                Schedule & Location
              </h3>

              <div className="space-y-3 rounded-2xl bg-white p-4">
                {/* schedule will be agreed with the organization */}
                <div className="flex items-center gap-3">
                  <CalendarDays size={18} aria-hidden="true" />
                  <span>To be agreed</span>
                </div>

                <div className="flex items-center gap-3">
                  <Clock3 size={18} aria-hidden="true" />
                  <span>To be agreed</span>
                </div>

                {/* use the actual location from the opportunity */}
                <div className="flex items-center gap-3">
                  <MapPin size={18} aria-hidden="true" />
                  <span>{opportunity.locations?.name}</span>
                </div>
              </div>
            </section>

            {/* optional message */}
            <section className="mt-5">
              <label
                htmlFor="application-message"
                className="mb-2 block font-semibold text-[#204F3D]"
              >
                Short Message to{" "}
                {opportunity.organizations?.contact_name?.split(" ")[0] ||
                  "the organizer"}
              </label>

              {/* textarea lets the volunteer write a message */}
              <textarea
                id="application-message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                maxLength={200}
                rows={4}
                className="w-full resize-none rounded-2xl border-0 bg-white p-4 outline-none focus:ring-2 focus:ring-green-700"
              />

              {/* show the maximum message length */}
              <p className="mt-1 text-right text-xs italic text-gray-500">
                {message.length}/200 characters
              </p>
            </section>

            {/* show an error if the application could not be submitted */}
            {applicationError && (
              <p role="alert" className="mt-3 text-sm text-red-600">
                {applicationError}
              </p>
            )}

            {/* submit the application to supabase */}
            <button
              type="button"
              onClick={handleSendApplication}
              disabled={submitting}
              className="mt-5 w-full rounded-full bg-gradient-to-r from-[#FF7056] to-[#DF5940] px-6 py-4 text-lg font-semibold text-white disabled:opacity-50"
            >
              {submitting ? "Sending..." : "Send Application"}
            </button>
          </section>
        </div>
      )}

      {/* success popup appears after the application is submitted */}
      {applicationSent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-5 py-6">
          {/* success panel */}
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="success-heading"
            className="w-full max-w-sm rounded-3xl bg-[#F4F9F5] px-7 py-10 text-center shadow-xl"
          >
            {/* green confirmation icon */}
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#2C7052] text-white">
              <Check size={44} strokeWidth={3} aria-hidden="true" />
            </div>

            {/* success heading */}
            <h2
              id="success-heading"
              className="mt-6 text-3xl font-bold text-[#204F3D]"
            >
              Done!
            </h2>

            {/* confirmation message */}
            <p className="mt-4 text-base leading-relaxed text-gray-700">
              Application sent. You can view your application and follow up
              anytime in My Activity.
            </p>

            {/* success actions */}
            <div className="mt-8 flex flex-col gap-3">
              {/* close the popup and stay on the opportunity page */}
              <button
                type="button"
                onClick={() => setApplicationSent(false)}
                className="w-full rounded-full border-2 border-[#2C7052] bg-transparent px-6 py-3 font-semibold text-[#204F3D]"
              >
                Close
              </button>

              {/* navigate to the volunteer's activity page */}
              <button
                type="button"
                onClick={() => navigate("/my-activity")}
                className="w-full rounded-full bg-gradient-to-r from-[#FF7056] to-[#DF5940] px-6 py-3 font-semibold text-white"
              >
                View My Activity
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

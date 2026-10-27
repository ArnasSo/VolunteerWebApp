import { useState } from "react";
import { redirect, useNavigate } from "react-router";
import { ArrowLeft, Settings, Pencil } from "lucide-react";
import { supabase } from "../lib/supabase";

// set the browser tab title
export function meta() {
  return [{ title: "Profile | Volunteer Hub" }];
}

// clientLoader fetches the logged-in volunteer's profile
// react router runs this before displaying the page
export async function clientLoader() {
  // get the currently authenticated user from supabase
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  // if there is no logged-in user, send them to Login
  if (authError || !user) {
    throw redirect("/login");
  }

  // fetch the profile that belongs to this user
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    // only fetch the profile matching the authenticated user's id
    .eq("id", user.id)
    // we expect one profile, not an array
    .single();

  // show an error if supabase cannot fetch the profile
  if (error) {
    throw new Error(error.message);
  }

  // return the profile to our page component
  return data;
}

export default function Profile({ loaderData }) {
  // loaderData contains the profile returned by clientLoader
  const profile = loaderData;

  // control whether the settings menu is visible
  const [showSettings, setShowSettings] = useState(false);

  // useNavigate lets us move between pages
  const navigate = useNavigate();

  // log out the currently authenticated volunteer
  async function handleLogout() {
    // signOut removes the current supabase session
    const { error } = await supabase.auth.signOut();

    // show an error if logout fails
    if (error) {
      console.error("Could not log out:", error.message);
      return;
    }

    // send the user to Home after logout
    navigate("/", { replace: true });
  }

  // combine the first and last name into a full name
  const fullName =
    `${profile.first_name || ""} ${profile.last_name || ""}`.trim();

  // get the first letter of each name for the profile avatar
  const initials =
    `${profile.first_name?.[0] || ""}${profile.last_name?.[0] || ""}`.toUpperCase();

  // get the year the profile was created
  const memberSince = profile.created_at
    ? new Date(profile.created_at).getFullYear()
    : "Unknown";

  return (
    <div className="min-h-screen bg-[#F4F9F5] pb-8 text-gray-900">
      {/* profile header */}
      <header className="flex items-center justify-between border-b border-gray-200 px-4 py-4">
        {/* back button */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="rounded-full bg-green-100 p-3 text-green-800"
        >
          <ArrowLeft size={20} aria-hidden="true" />
        </button>

        <h1 className="text-xl font-semibold">Profile</h1>

        {/* settings button opens and closes the settings menu */}
        <button
          type="button"
          onClick={() => setShowSettings(!showSettings)}
          aria-label="Settings"
          aria-expanded={showSettings}
          className="rounded-full bg-green-100 p-3 text-green-800"
        >
          <Settings size={20} aria-hidden="true" />
        </button>
      </header>

      {/* show the settings menu only when the icon is clicked */}
      {showSettings && (
        <div className="mx-6 mt-3 rounded-xl bg-white p-4 shadow-sm">
          {/* logout button */}
          <button
            type="button"
            onClick={handleLogout}
            className="w-full text-left font-medium text-red-600"
          >
            Log out
          </button>
        </div>
      )}

      <main className="mx-auto max-w-2xl px-6">
        {/* volunteer's avatar and name */}
        <section className="mt-7 flex flex-col items-center">
          {/* show an image if the volunteer has uploaded an avatar */}
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={fullName}
              className="h-28 w-28 rounded-full object-cover"
            />
          ) : (
            /* otherwise display initials inside a green circle */
            <div className="flex h-28 w-28 items-center justify-center rounded-full bg-[#2C7052] text-4xl font-semibold text-white">
              {initials}
            </div>
          )}

          <h2 className="mt-3 text-xl font-bold">{fullName}</h2>

          <p className="mt-1 text-gray-500">Member since {memberSince}</p>
        </section>

        {/* about me section */}
        <section className="mt-6">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="font-semibold text-[#204F3D]">About Me</h2>

            {/* placeholder icon for future editing */}
            <Pencil size={17} className="text-green-800" aria-hidden="true" />
          </div>

          <div className="min-h-20 rounded-2xl bg-white p-4">
            <p className={profile.about_me ? "" : "text-gray-500"}>
              {profile.about_me ||
                "Tell organizations a little bit about yourself."}
            </p>
          </div>
        </section>

        {/* basic information section */}
        <section className="mt-6">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="font-semibold text-[#204F3D]">Basic Information</h2>

            {/* placeholder icon for future editing */}
            <Pencil size={17} className="text-green-800" aria-hidden="true" />
          </div>

          <div className="space-y-3 rounded-2xl bg-white p-4">
            {/* email from the profiles table */}
            <div>
              <p className="text-gray-500">Email</p>
              <p className="font-medium">{profile.email}</p>
            </div>

            {/* phone number, if available */}
            <div>
              <p className="text-gray-500">Phone number</p>
              <p className="font-medium">{profile.phone || "Not added"}</p>
            </div>

            {/* location editing can be added later */}
            <div>
              <p className="text-gray-500">Address</p>
              <p className="font-medium text-green-800">+Add Location</p>
            </div>

            {/* language from the profiles table */}
            <div>
              <p className="text-gray-500">Language</p>
              <p className="font-medium text-green-800">
                {profile.language || "+Add Language"}
              </p>
            </div>
          </div>
        </section>

        {/* interests section - teammates can add functionality later */}
        <section className="mt-6">
          <h2 className="mb-2 font-semibold text-[#204F3D]">My Interests</h2>

          <div className="rounded-2xl bg-white p-4">
            <p className="font-medium">No interests added yet</p>

            <p className="mt-2 text-sm text-gray-600">
              Add your interests to discover volunteering opportunities that
              match you.
            </p>

            {/* visual placeholder for future interest editing */}
            <span className="mt-4 inline-block rounded-full border border-green-800 px-4 py-2 text-sm text-green-800">
              +Add Interests
            </span>
          </div>
        </section>
      </main>
    </div>
  );
}

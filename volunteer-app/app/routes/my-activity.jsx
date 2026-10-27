import { useState } from "react";
import { redirect } from "react-router";
import ActivityTabs from "../components/my-activity/ActivityTabs";
import ApplicationCard from "../components/my-activity/ApplicationCard";
import { supabase } from "../lib/supabase";

// clientLoader fetches applications belonging to the logged-in volunteer
export async function clientLoader() {
  // check which volunteer is logged in
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  // guests must log in to see their activity
  if (authError || !user) {
    throw redirect("/login");
  }

  // fetch applications and their related opportunity information
  const { data, error } = await supabase
    .from("applications")
    .select(`
      id,
      status,
      created_at,
      opportunities(
        id,
        title,
        image_url,
        organizations(name)
      )
    `)
    .eq("profile_id", user.id)
    .order("created_at", { ascending: false });

  // show an error if the database request fails
  if (error) {
    throw new Error(error.message);
  }

  // return the applications to our page
  return data || [];
}

export default function MyActivity({ loaderData }) {
  // applications returned by clientLoader
  const applications = loaderData;

  // remember which tab the volunteer selected
  const [activeTab, setActiveTab] = useState("Applied");

  return (
    <div className="min-h-screen bg-[#F4F9F5] px-6 py-10 text-gray-900">
      <div className="mx-auto max-w-3xl">

        {/* page heading */}
        <h1 className="mb-6 text-2xl font-bold">
          My Activity
        </h1>

        {/* reusable navigation tabs */}
        <ActivityTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* display the volunteer's submitted applications */}
        {activeTab === "Applied" && (
          <div className="mt-6 space-y-3">
            {applications.length > 0 ? (
              applications.map((application) => (
                <ApplicationCard
                  key={application.id}
                  application={application}
                />
              ))
            ) : (
              <p className="text-center text-gray-600">
                You haven't applied for any opportunities yet.
              </p>
            )}
          </div>
        )}

        {/* temporary placeholders for the remaining tabs */}
        {activeTab !== "Applied" && (
          <p className="mt-6 text-gray-600">
            {activeTab} content will appear here.
          </p>
        )}

      </div>
    </div>
  );
}

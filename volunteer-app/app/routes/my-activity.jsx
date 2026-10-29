import { useState } from "react";
import { redirect, useRevalidator } from "react-router";
import ActivityTabs from "../components/my-activity/ActivityTabs";
import ApplicationCard from "../components/my-activity/ApplicationCard";
import InboxCard from "../components/my-activity/InboxCard";
import ConversationView from "../components/my-activity/ConversationView";
import SavedCard from "../components/my-activity/SavedCard";
import DoneCard from "../components/my-activity/DoneCard";
import EmptyState from "../components/EmptyState";
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

  // fetch applications, opportunity details, and their messages
  const { data, error } = await supabase
    .from("applications")
    .select(
      `
      id,
      status,
      created_at,
      opportunities(
        id,
        title,
        image_url,
        organizations(
          name,
          contact_name,
          contact_avatar_url
        )
      ),
      messages(
        id,
        content,
        created_at
      )
    `,
    )

    .eq("profile_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  // fetch opportunities saved by the logged-in volunteer
  const { data: saved, error: savedError } = await supabase
    .from("saved_opportunities")
    .select(
      `
    opportunity_id,
    opportunities(
      id,
      title,
      image_url,
      organizations(name)
    )
  `,
    )
    .eq("profile_id", user.id)
    .order("created_at", { ascending: false });

  if (savedError) {
    throw new Error(savedError.message);
  }

  // return both applications and saved opportunities
  return {
    applications: data || [],
    saved: saved || [],
  };
}
// dummy completed activities for the done tab
const completedActivities = [
  {
    id: 1,
    title: "Make newcomers feel at home through conversation",
    organization: "Røde Kors",
    image: "/images/done2.png",
  },
  {
    id: 2,
    title: "Help care for cats while their owners recover",
    organization: "Kattens Værn",
    image: "/images/done1.png",
  },
];

export default function MyActivity({ loaderData }) {
  // get applications and saved opportunities from clientLoader
  const { applications, saved } = loaderData;

  // turn applications with messages into inbox conversations
  const conversations = applications
    .filter((application) => application.messages?.length > 0)
    .map((application) => {
      // find the most recent message for this application
      const latestMessage = [...application.messages].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at),
      )[0];

      // get the organization's contact information
      const organization = application.opportunities?.organizations;

      return {
        id: application.id,
        contactName: organization?.contact_name || "Organizer",
        organizationName: organization?.name || "Organization",
        avatarUrl: organization?.contact_avatar_url,
        lastMessage: latestMessage.content,

        // messages are displayed in chronological order
        messages: [...application.messages].sort(
          (a, b) => new Date(a.created_at) - new Date(b.created_at),
        ),
      };
    });

  // remember which tab the volunteer selected
  const [activeTab, setActiveTab] = useState("Applied");
  // remember which conversation the volunteer opened
  const [selectedConversation, setSelectedConversation] = useState(null);

  // refresh clientLoader data after sending a message
  const revalidator = useRevalidator();

  return (
    <div className="min-h-screen bg-[#F4F9F5] px-6 py-10 text-gray-900">
      <div className="mx-auto max-w-3xl">
        {/* page heading */}
        <h1 className="mb-6 text-2xl font-bold">My Activity</h1>

        {/* reusable navigation tabs */}
        <ActivityTabs activeTab={activeTab} onTabChange={setActiveTab} />

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
              <EmptyState
                icon="/tabler_clipboard-list.svg"
                title="No applications yet"
                description="When you apply for a volunteering opportunity, you can track your application status here."
              />
            )}
          </div>
        )}

        {/* inbox displays either the conversation list or an opened conversation */}
        {activeTab === "Inbox" && (
          <div className="mt-6">
            {selectedConversation ? (
              <ConversationView
                conversation={
                  conversations.find(
                    (conversation) =>
                      conversation.id === selectedConversation.id,
                  ) || selectedConversation
                }
                onBack={() => setSelectedConversation(null)}
                onMessageSent={() => revalidator.revalidate()}
              />
            ) : (
              <div className="space-y-3">
                {conversations.length > 0 ? (
                  conversations.map((conversation) => (
                    <InboxCard
                      key={conversation.id}
                      conversation={conversation}
                      onClick={() => setSelectedConversation(conversation)}
                    />
                  ))
                ) : (
                  <EmptyState
                    icon="/tabler_message-circle.svg"
                    title="No conversations yet"
                    description="Your conversations with volunteer coordinators will appear here."
                  />
                )}
              </div>
            )}
          </div>
        )}

        {/* display opportunities saved by the volunteer */}
        {activeTab === "Saved" && (
          <div className="mt-6 space-y-3">
            {saved.length > 0 ? (
              saved.map((savedOpportunity) => (
                <SavedCard
                  key={savedOpportunity.opportunity_id}
                  savedOpportunity={savedOpportunity}
                />
              ))
            ) : (
              <EmptyState
                icon="/tabler_bookmark.svg"
                x
                title="No saved opportunities yet"
                description="Save volunteering opportunities you're interested in and find them here later.

"
              />
            )}
          </div>
        )}

        {/* display completed volunteering activities using dummy data */}
        {activeTab === "Done" && (
          <div className="mt-6">
            {/* Completed Activities */}
            <h2 className="mb-3 text-[18px] font-semibold text-[#1F4D37]">
              Activities you've done
            </h2>
            <div className="flex flex-col gap-3">
              {completedActivities.map((activity) => (
                <DoneCard key={activity.id} activity={activity} />
              ))}
            </div>
            {/* Volunteering Overview */}
            <h2 className="mt-9 mb-3 text-[18px] font-semibold text-[#1F4D37]">
              Volunteering Overview
            </h2>

            <div className="flex flex-col items-center gap-3 rounded-[18px] bg-white px-5 py-5 text-center">
              <p className="text-[14px] text-[#404247]">
                Hours spent volunteering this month
              </p>

              <p className="text-[18px] font-semibold text-[#15181E]">12 h</p>

              <p className="text-[12px] text-[#6A6C70] underline">
                View full overview
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

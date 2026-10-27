import { useState } from "react";
import { redirect, useRevalidator } from "react-router";
import ActivityTabs from "../components/my-activity/ActivityTabs";
import ApplicationCard from "../components/my-activity/ApplicationCard";
import InboxCard from "../components/my-activity/InboxCard";
import ConversationView from "../components/my-activity/ConversationView";
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
    .select(`
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


  // turn applications with messages into inbox conversations
  const conversations = applications
    .filter((application) => application.messages?.length > 0)
    .map((application) => {
      // find the most recent message for this application
      const latestMessage = [...application.messages].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
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
          (a, b) => new Date(a.created_at) - new Date(b.created_at)
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

        {/* inbox displays either the conversation list or an opened conversation */}
        {activeTab === "Inbox" && (
          <div className="mt-6">
            {selectedConversation ? (
              <ConversationView
                conversation={
                  conversations.find(
                    (conversation) => conversation.id === selectedConversation.id
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
                  <p className="text-center text-gray-600">
                    You don't have any conversations yet.
                  </p>
                )}
              </div>
            )}
          </div>
        )}


        {/* placeholders for tabs we haven't built yet */}
        {(activeTab === "Saved" || activeTab === "Done") && (
          <p className="mt-6 text-gray-600">
            {activeTab} content will appear here.
          </p>
        )}


      </div>
    </div>
  );
}

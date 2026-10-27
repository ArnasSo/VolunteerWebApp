
import { useState } from "react";
import { ArrowLeft, Send } from "lucide-react";
import { supabase } from "../../lib/supabase";

export default function ConversationView({
    conversation,
    onBack,
    onMessageSent,
}) {
    // get the information about this conversation
    const { contactName, organizationName, messages } = conversation;
    // store the message the volunteer is currently writing
    const [newMessage, setNewMessage] = useState("");


    // track whether a message is being sent
    const [sending, setSending] = useState(false);

    // show an error if sending fails
    const [sendError, setSendError] = useState("");

    // save a follow-up message in supabase
    async function handleSendMessage() {
        // don't send empty messages or duplicate clicks
        if (!newMessage.trim() || sending) return;

        setSending(true);
        setSendError("");

        // save the message under the selected application
        const { error } = await supabase.from("messages").insert({
            application_id: conversation.id,
            content: newMessage.trim(),
        });

        setSending(false);

        // show an error if supabase rejects the message
        if (error) {
            setSendError(error.message);
            return;
        }

        // clear the input after successful submission
        setNewMessage("");

        // tell the parent page to refresh the conversation
        onMessageSent();
    }


    return (
        <section className="rounded-2xl bg-white p-5">
            {/* return to the inbox list */}
            <button
                type="button"
                onClick={onBack}
                className="mb-6 flex items-center gap-2 text-[#204F3D]"
            >
                <ArrowLeft size={20} aria-hidden="true" />
                Back to Inbox
            </button>

            {/* conversation heading */}
            <div className="border-b border-gray-200 pb-4">
                <h2 className="text-xl font-semibold text-[#204F3D]">
                    {contactName}
                </h2>

                <p className="text-sm text-gray-600">
                    {organizationName}
                </p>
            </div>

            {/* display messages in chronological order */}
            <div className="mt-6 space-y-3">
                {messages.length > 0 ? (
                    messages.map((message) => (
                        <div
                            key={message.id}
                            className="ml-auto max-w-[85%] rounded-2xl bg-[#DDEBE1] p-4 text-sm"
                        >
                            <p className="whitespace-pre-line">{message.content}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-sm text-gray-500">
                        No messages yet.
                    </p>
                )}
            </div>

            {/* message input at the bottom of the conversation */}
            <div className="mt-6 flex items-end gap-3 border-t border-gray-200 pt-4">

                {/* text field for writing a follow-up message */}
                <textarea
                    value={newMessage}
                    onChange={(event) => setNewMessage(event.target.value)}
                    placeholder="Write a message..."
                    aria-label="Write a message"
                    rows={2}
                    className="min-h-12 flex-1 resize-none rounded-2xl bg-[#F4F9F5] p-3 text-sm outline-none focus:ring-2 focus:ring-green-700"
                />

                <button
                    type="button"
                    onClick={handleSendMessage}
                    disabled={sending || !newMessage.trim()}
                    aria-label="Send message"
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#2C7052] text-white disabled:opacity-50"
                >
                    <Send size={20} aria-hidden="true" />
                </button>
            </div>


            {/* show an error if the message could not be sent */}
            {sendError && (
                <p role="alert" className="mt-2 text-sm text-red-600">
                    {sendError}
                </p>
            )}


        </section>
    );
}

export default function InboxCard({ conversation, onClick }) {
    // get the information needed for the inbox card
    const { contactName, organizationName, avatarUrl, lastMessage } =
        conversation;

    // create initials if the contact person has no avatar
    const initials = contactName
        .split(" ")
        .map((name) => name[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    return (
        <button
            type="button"
            onClick={onClick}
            className="flex w-full items-center gap-4 rounded-xl bg-white p-4 text-left transition-colors hover:bg-gray-50"
        >
            {/* contact person's avatar or initials */}
            {avatarUrl ? (
                <img
                    src={avatarUrl}
                    alt=""
                    className="h-14 w-14 shrink-0 rounded-full object-cover"
                />
            ) : (
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#DDEBE1] font-semibold text-[#204F3D]">
                    {initials}
                </div>
            )}

            {/* conversation information */}
            <div className="min-w-0 flex-1">
                <h2 className="font-semibold text-[#204F3D]">
                    {contactName}
                </h2>

                <p className="text-sm text-gray-600">
                    {organizationName}
                </p>

                {/* show only one line of the latest message */}
                <p className="mt-1 truncate text-sm text-gray-500">
                    {lastMessage}
                </p>
            </div>
        </button>
    );
}

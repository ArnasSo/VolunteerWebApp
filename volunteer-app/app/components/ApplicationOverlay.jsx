import { X, CalendarDays, Clock3, MapPin } from "lucide-react";

export default function ApplicationOverlay({
  profile,
  opportunity,
  fullName,
  initials,
  message,
  setMessage,
  applicationError,
  submitting,
  onClose,
  onSubmit,
}) {
  return (
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
          onClick={onClose}
          aria-label="Close application"
          className="absolute right-4 top-4 rounded-full bg-gray-900 p-1 text-white"
        >
          <X size={18} aria-hidden="true" />
        </button>

        {/* volunteer avatar and name */}
        <div className="flex flex-col items-center">
          {profile?.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={fullName}
              className="h-20 w-20 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#2C7052] text-2xl font-semibold text-white">
              {initials}
            </div>
          )}

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

        {/* schedule and location */}
        <section className="mt-5">
          <h3 className="mb-2 font-semibold text-[#204F3D]">
            Schedule & Location
          </h3>

          <div className="space-y-3 rounded-2xl bg-white p-4">
            <div className="flex items-center gap-3">
              <CalendarDays size={18} aria-hidden="true" />
              <span>To be agreed</span>
            </div>

            <div className="flex items-center gap-3">
              <Clock3 size={18} aria-hidden="true" />
              <span>To be agreed</span>
            </div>

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

          <textarea
            id="application-message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            maxLength={200}
            rows={4}
            className="w-full resize-none rounded-2xl border-0 bg-white p-4 outline-none focus:ring-2 focus:ring-green-700"
          />

          <p className="mt-1 text-right text-xs italic text-gray-500">
            {message.length}/200 characters
          </p>
        </section>

        {/* show submission errors */}
        {applicationError && (
          <p role="alert" className="mt-3 text-sm text-red-600">
            {applicationError}
          </p>
        )}

        {/* submit application */}
        <button
          type="button"
          onClick={onSubmit}
          disabled={submitting}
          className="mt-5 w-full rounded-full bg-gradient-to-r from-[#FF7056] to-[#DF5940] px-6 py-4 text-lg font-semibold text-white disabled:opacity-50"
        >
          {submitting ? "Sending..." : "Send Application"}
        </button>
      </section>
    </div>
  );
}

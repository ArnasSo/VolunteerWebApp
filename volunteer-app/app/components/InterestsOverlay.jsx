import { X } from "lucide-react";

export default function InterestsOverlay({
  interests,
  availableInterests,
  handleInterestChange,
  onClose,
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-end">
      {/* close overlay when clicking outside */}
      <button
        type="button"
        aria-label="Close interests"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />

      {/* interests overlay */}
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="interests-heading"
        className="relative z-10 flex max-h-[90dvh] w-full flex-col rounded-t-[32px] bg-[#F4F9F5] px-6 pb-8 pt-4 shadow-xl"
      >
        {/* small handle at the top */}
        <div className="mx-auto mb-8 h-1.5 w-20 rounded-full bg-[#2C7052]" />

        {/* heading and close button */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 id="interests-heading" className="text-2xl font-bold">
              Select your interests
            </h2>

            <p className="mt-1 text-gray-500">
              Choose the activities that interest you.
            </p>
          </div>

          <button
            type="button"
            aria-label="Close interests"
            onClick={onClose}
            className="rounded-full p-2 text-green-800"
          >
            <X size={22} aria-hidden="true" />
          </button>
        </div>

        {/* list of interests */}
        <div className="mt-7 flex-1 overflow-y-auto pb-4">
          <div className="flex flex-wrap gap-3">
            {availableInterests.map((interest) => {
              // check if the interest is selected
              const selected = interests.includes(interest.name);

              return (
                <button
                  key={interest.name}
                  type="button"
                  onClick={() => handleInterestChange(interest.name)}
                  aria-pressed={selected}
                  className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                    selected
                      ? "border-[#2C7052] bg-[#2C7052] text-white"
                      : "border-green-200 bg-white text-gray-900"
                  }`}
                >
                  <span aria-hidden="true">{interest.icon}</span>{" "}
                  {interest.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* save selected interests and close overlay */}
        <button
          type="button"
          onClick={onClose}
          className="mt-4 w-full shrink-0 rounded-full bg-[#2C7052] px-6 py-4 font-semibold text-white"
        >
          Apply interests
          {interests.length > 0 && ` (${interests.length})`}
        </button>
      </section>
    </div>
  );
}

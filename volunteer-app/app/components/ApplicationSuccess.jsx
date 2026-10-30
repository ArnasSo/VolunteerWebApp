import { Check } from "lucide-react";

export default function ApplicationSuccess({ onClose, onViewActivity }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-5 py-6">
      {/* success popup */}
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

        {/* success message */}
        <h2
          id="success-heading"
          className="mt-6 text-3xl font-bold text-[#204F3D]"
        >
          Done!
        </h2>

        <p className="mt-4 text-base leading-relaxed text-gray-700">
          Application sent. You can view your application and follow up anytime
          in My Activity.
        </p>

        {/* close popup or view activity */}
        <div className="mt-8 flex flex-col gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-full border-2 border-[#2C7052] bg-transparent px-6 py-3 font-semibold text-[#204F3D]"
          >
            Close
          </button>

          <button
            type="button"
            onClick={onViewActivity}
            className="w-full rounded-full bg-gradient-to-r from-[#FF7056] to-[#DF5940] px-6 py-3 font-semibold text-white"
          >
            View My Activity
          </button>
        </div>
      </section>
    </div>
  );
}

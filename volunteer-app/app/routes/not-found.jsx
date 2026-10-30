import { useNavigate } from "react-router";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-dvh w-full items-center justify-center bg-[#D4D5D6] px-6">
      <div className="flex w-full max-w-[320px] flex-col items-center gap-5 text-center">
        {/* 404 Icon and Number */}
        <div className="flex flex-col items-center gap-1">
          <img src="/tabler_zoom-cancel.svg" alt="" className="h-12 w-12" />

          <h1 className="font-sans text-[40px] font-semibold text-[#1F4D37]">
            404
          </h1>
        </div>

        {/* Error Message */}
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-[20px] font-semibold text-[#15181E]">
            Page not found
          </h2>

          <p className="text-[14px] text-[#6A6C70]">
            Oops! This page isn't available yet.
          </p>
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mt-3 h-11 w-[200px] rounded-full bg-[#1F4D37] text-[16px] font-medium text-white"
        >
          Back
        </button>
      </div>
    </div>
  );
}

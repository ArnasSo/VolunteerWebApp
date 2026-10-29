export default function EmptyState({ icon, title, description }) {
  return (
    <div className="mt-16 flex w-full flex-col items-center text-center">
      {/* Empty State Icon */}
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#DDEBDE]">
        <img src={icon} alt="" className="h-10 w-10" />
      </div>

      {/* Empty State Title */}
      <h2 className="mt-6 text-[16px] font-medium text-[#15181E]">{title}</h2>

      {/* Empty State Description */}
      <p className="mt-5 max-w-[300px] text-[14px] font-normal text-[#6A6C70]">
        {description}
      </p>
    </div>
  );
}

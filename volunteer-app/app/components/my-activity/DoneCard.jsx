// display one completed volunteering activity
export default function DoneCard({ activity }) {
  return (
    <div className="flex w-full items-center gap-3 rounded-xl bg-[#D4D5D6] p-2.5">
      {/* Activity Image */}
      <img
        src={activity.image}
        alt={activity.title}
        className="h-[92px] w-[92px] shrink-0 rounded-lg object-cover"
      />

      {/* Activity Information */}
      <div className="flex flex-col gap-2">
        <h2 className="text-[14px] font-medium leading-snug text-[#15181E] md:text-[18px]">
          {activity.title}
        </h2>

        <p className="text-[12px] text-[#404247] md:text-[14px]">
          {activity.organization}
        </p>
      </div>
    </div>
  );
}

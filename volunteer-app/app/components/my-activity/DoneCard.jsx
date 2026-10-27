
import { CalendarDays, Clock3, CheckCircle2 } from "lucide-react";

// display one completed volunteering activity
export default function DoneCard({ activity }) {
  return (
    <div className="rounded-xl bg-white p-4">
      {/* completed activity title and status */}
      <div className="flex items-start justify-between gap-3">
        <h2 className="font-semibold text-gray-900">
          {activity.title}
        </h2>

        <CheckCircle2
          size={22}
          className="shrink-0 text-[#204F3D]"
          aria-label="Completed"
        />
      </div>

      {/* organization name */}
      <p className="mt-1 text-sm text-gray-600">
        {activity.organization}
      </p>

      {/* completion date */}
      <div className="mt-4 flex items-center gap-2 text-sm text-gray-700">
        <CalendarDays size={18} aria-hidden="true" />
        <span>{activity.completedDate}</span>
      </div>

      {/* volunteering hours */}
      <div className="mt-2 flex items-center gap-2 text-sm text-gray-700">
        <Clock3 size={18} aria-hidden="true" />
        <span>{activity.hours} volunteer hours</span>
      </div>
    </div>
  );
}

import { CircleCheck, CircleX, Clock3 } from "lucide-react";
import { Link } from "react-router";

export default function ApplicationCard({ application }) {
    // get the opportunity connected to this application
    const opportunity = application.opportunities;

    // choose the correct icon and color for each application status
    const statusStyles = {
        Approved: {
            color: "text-green-800",
            Icon: CircleCheck,
        },
        Pending: {
            color: "text-amber-600",
            Icon: Clock3,
        },
        Cancelled: {
            color: "text-red-600",
            Icon: CircleX,
        },
    };

    // use Pending as a fallback if the status is unknown
    const status = statusStyles[application.status] || statusStyles.Pending;
    const StatusIcon = status.Icon;

    return (
        <Link
            to={`/opportunities/${opportunity.id}`}
            className="flex gap-3 rounded-xl bg-white p-2 transition-colors hover:bg-gray-50"
        >
            {/* opportunity image */}
            {opportunity?.image_url && (
                <img
                    src={opportunity.image_url}
                    alt=""
                    className="h-24 w-24 shrink-0 rounded-lg object-cover"
                />
            )}

            {/* opportunity details */}
            <div className="flex min-w-0 flex-1 flex-col justify-center gap-1">
                <h2 className="text-sm font-medium leading-snug">
                    {opportunity?.title}
                </h2>

                {/* organization name */}
                <p className="text-xs text-gray-600">
                    {opportunity?.organizations?.name}
                </p>

                {/* application status */}
                <div className={`flex items-center gap-1 text-xs ${status.color}`}>
                    <StatusIcon size={14} aria-hidden="true" />
                    <span>{application.status}</span>
                </div>
            </div>
        </Link>
    );
}

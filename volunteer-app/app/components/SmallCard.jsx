import { Link } from 'react-router';
import { MapPin } from "lucide-react";

export default function SmallCard({
    id,
    title,
    image,
    location,
}) {
    return (
        <div className="relative w-full overflow-hidden rounded-[28px] bg-white shadow-sm">

            {/* link to opportunity details */}
            <Link
                to={`/opportunities/${id}`}
                className="block"
            >
                {/* opportunity image */}
                <img
                    src={image}
                    alt={title}
                    className="aspect-[1.5/1] w-full object-cover"
                />

                {/* Card content */}
                <div className="p-5">

                    {/* Opportunity title */}
                    <h3 className="text-xl font-bold leading-tight text-[#15181e]">
                        {title}
                    </h3>

                    {/* Opportunity location */}
                    <div className="mt-4 flex items-center gap-3 text-[#15181e]">
                        <MapPin
                            size={22}
                            className="shrink-0"
                            aria-hidden="true"
                        />
                        <span className="text-base">
                            {location}
                        </span>
                    </div>
                </div>
            </Link>
        </div>
    );
}
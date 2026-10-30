import { MapPin } from "lucide-react";

export default function SmallCard({
    title,
    image,
    location,
}) {
    return (
        <div className="relative w-full overflow-hidden rounded-[28px] bg-white shadow-sm">

            <div
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
                    <h3 className="text-lg font-bold leading-tight text-[#15181e]">
                        {title}
                    </h3>

                    {/* Opportunity location */}
                    <div className="mt-3 flex items-center gap-3 text-[#15181e]">
                        <MapPin
                            size={17}
                            className="shrink-0"
                            aria-hidden="true"
                        />
                        <span className="text-base text-sm">
                            {location}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
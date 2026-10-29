export default function ExploreCard({
    title,
    category,
    image,
}) {
    return (
        <div
            className="group relative block h-[185px] w-full overflow-hidden rounded-[12px]"
        >
            {/* Background image */}
            <img
                src={image}
                alt={title}
                className="h-full w-full object-cover"
            />

            {/* Dark gradient for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />

            {/* Card content */}
            <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-5 pb-2 text-white">
                {/* Title */}
                <h3 className="text-md font-bold leading-tight text-white break-words [-webkit-text-stroke:0.2px_black]">
                    {title}
                </h3>

                {/* Category */}
                <p className="text-right text-base font-normal text-xs text-white [-webkit-text-stroke:0.1px_black]">
                    {category}
                </p>
            </div>
        </div>
    );
}
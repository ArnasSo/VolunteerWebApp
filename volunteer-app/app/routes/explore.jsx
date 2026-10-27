import { useState } from "react";
import { useNavigate } from "react-router";
import {
MapPin,
Filter,
ChevronDown,
X,
} from "lucide-react";

// meta sets the browser tab title and page description
export function meta() {
return [
{ title: "Explore | Volunteer Hub" },
{
name: "description",
content: "Explore local volunteering opportunities",
},
];
}

// temporary interests from our figma design
// later, these can be fetched from the supabase interests table
const availableInterests = [
{ name: "Community Dinner", icon: ":stew:" },
{ name: "Coffee & Bar", icon: ":coffee:" },
{ name: "Veganism", icon: ":seedling:" },
{ name: "Festivals & Events", icon: ":circus_tent:" },
{ name: "Animal Welfare", icon: ":dog:" },
{ name: "Mentoring", icon: ":female-teacher:" },
{ name: "Clean-up Walks", icon: ":broom:" },
{ name: "Sustainability", icon: ":recycle:" },
{ name: "Social Causes", icon: ":revolving_hearts:" },
{ name: "Community & Care", icon: ":busts_in_silhouette:" },
{ name: "Socializing", icon: ":tada:" },
{ name: "Food Rescue", icon: ":hamburger:" },
{ name: "Photography & Media", icon: ":camera:" },
{ name: "Sports", icon: ":soccer:" },
{ name: "LGBTQ+ Community", icon: ":rainbow:" },
{ name: "DIY & Repair", icon: ":wrench:" },
];

export default function Explore() {
// store the location selected by the volunteer
const [location, setLocation] = useState("");

// store all selected interests in an array
const [interests, setInterests] = useState([]);

// control whether the interests overlay is visible
const [showInterests, setShowInterests] = useState(false);

// useNavigate allows us to move to the results page
const navigate = useNavigate();

// add or remove an interest when the user clicks its pill
function handleInterestChange(interest) {
// if already selected, remove it from the array
if (interests.includes(interest)) {
setInterests(
interests.filter((item) => item !== interest)
);
} else {
// otherwise, add it to the array
setInterests([...interests, interest]);
}
}

// search for opportunities using the selected filters
function handleSearch() {
// URLSearchParams creates query parameters for the results page
const params = new URLSearchParams();

// add location only if one has been selected
if (location) {
  params.set("location", location);
}

// add selected interests as a comma-separated list
if (interests.length > 0) {
  params.set("interests", interests.join(","));
}

// navigate to our existing results page
navigate(`/explore/results?${params.toString()}`);

}

return (
<div className="min-h-screen bg-[#F4F9F5] px-5 py-8 text-gray-900">

  {/* center the search content and limit its desktop width */}
  <div className="mx-auto max-w-xl">

    {/* volunteer hub heading */}
    <h1 className="mb-10 text-center text-3xl font-bold text-[#173F30]">
      Volunteer Hub
    </h1>

    {/* search filter container */}
    <div className="overflow-hidden rounded-2xl border-[4px] border-[#F8C84B] bg-white">

      {/* location dropdown */}
      <div className="flex items-center gap-4 border-b border-green-100 px-5 py-5">

        {/* location icon */}
        <MapPin
          size={26}
          className="shrink-0 text-[#2C7052]"
          aria-hidden="true"
        />

        {/* dropdown label for screen readers */}
        <label htmlFor="location" className="sr-only">
          Choose location
        </label>

        <select
          id="location"
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          className="min-w-0 flex-1 bg-transparent text-lg outline-none"
        >
          <option value="">All locations</option>

          {/* temporary options until we connect locations from supabase */}
          <option value="Aarhus">Aarhus</option>
          <option value="Aalborg">Aalborg</option>
          <option value="Copenhagen">Copenhagen</option>
        </select>
      </div>

      {/* button opens the interests overlay */}
      <button
        type="button"
        onClick={() => setShowInterests(true)}
        className="flex w-full items-center gap-4 px-5 py-5 text-left"
      >
        <Filter
          size={26}
          className="shrink-0 text-[#2C7052]"
          aria-hidden="true"
        />

        {/* display selected interests or placeholder text */}
        <span className="min-w-0 flex-1 truncate text-lg">
          {interests.length > 0
            ? interests.join(", ")
            : "Select your interests"}
        </span>

        <ChevronDown
          size={20}
          className="shrink-0 text-[#2C7052]"
          aria-hidden="true"
        />
      </button>

      {/* search button keeps our existing search functionality */}
      <button
        type="button"
        onClick={handleSearch}
        className="w-full bg-gradient-to-r from-[#FF7056] to-[#DF5940] px-6 py-5 text-xl font-semibold text-white"
      >
        Search
      </button>
    </div>
  </div>

  {/* interests overlay appears only when opened */}
  {showInterests && (
    <div className="fixed inset-0 z-[100] flex items-end">

      {/* dark background behind the overlay */}
      {/* clicking outside the panel closes it */}
      <button
        type="button"
        aria-label="Close interests"
        onClick={() => setShowInterests(false)}
        className="absolute inset-0 bg-black/40"
      />

      {/* bottom sheet containing the interests */}
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="interests-heading"
        className="relative z-10 flex max-h-[90dvh] w-full flex-col rounded-t-[32px] bg-[#F4F9F5] px-6 pb-8 pt-4 shadow-xl"
      >

        {/* small handle at the top, matching figma */}
        <div className="mx-auto mb-8 h-1.5 w-20 rounded-full bg-[#2C7052]" />

        {/* heading and close button */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2
              id="interests-heading"
              className="text-2xl font-bold"
            >
              Select your interests
            </h2>

            <p className="mt-1 text-gray-500">
              Choose the activities that interest you.
            </p>
          </div>

          <button
            type="button"
            aria-label="Close interests"
            onClick={() => setShowInterests(false)}
            className="rounded-full p-2 text-green-800"
          >
            <X size={22} aria-hidden="true" />
          </button>
        </div>

        {/* scrollable list of interests */}
        <div className="mt-7 flex-1 overflow-y-auto pb-4">

          {/* flex-wrap allows pills to move onto new rows */}
          <div className="flex flex-wrap gap-3">

            {/* create a selectable pill for every interest */}
            {availableInterests.map((interest) => {
              // check whether this interest is currently selected
              const selected = interests.includes(interest.name);

              return (
                <button
                  key={interest.name}
                  type="button"

                  // clicking a pill selects or deselects it
                  onClick={() =>
                    handleInterestChange(interest.name)
                  }

                  // tell screen readers whether this is selected
                  aria-pressed={selected}

                  // selected interests use a green background
                  className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                    selected
                      ? "border-[#2C7052] bg-[#2C7052] text-white"
                      : "border-green-200 bg-white text-gray-900"
                  }`}
                >
                  <span aria-hidden="true">
                    {interest.icon}
                  </span>{" "}
                  {interest.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* button saves the current selection and closes the overlay */}
        <button
          type="button"
          onClick={() => setShowInterests(false)}
          className="mt-4 w-full shrink-0 rounded-full bg-[#2C7052] px-6 py-4 font-semibold text-white"
        >
          Apply interests
          {interests.length > 0 && ` (${interests.length})`}
        </button>
      </section>
    </div>
  )}
</div>

);
}
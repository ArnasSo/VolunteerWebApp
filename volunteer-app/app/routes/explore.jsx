import { useState } from "react";
import { useNavigate } from "react-router";
import { MapPin, Filter, ChevronDown } from "lucide-react";
import Section from "../components/Section";
import ExploreCard from "../components/ExploreCard";
import SmallCard from "../components/SmallCard";
import InterestsOverlay from "../components/InterestsOverlay";

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
  { name: "Community Dinner", icon: "🍲" },
  { name: "Coffee & Bar", icon: "☕" },
  { name: "Veganism", icon: "🌱" },
  { name: "Festivals & Events", icon: "🎪" },
  { name: "Animal Welfare", icon: "🐶" },
  { name: "Mentoring", icon: "👩‍🏫" },
  { name: "Clean-up Walks", icon: "🧹" },
  { name: "Sustainability", icon: "♻️" },
  { name: "Social Causes", icon: "💞" },
  { name: "Community & Care", icon: "👥" },
  { name: "Socializing", icon: "🎉" },
  { name: "Food Rescue", icon: "🍔" },
  { name: "Photography & Media", icon: "📷" },
  { name: "Sports", icon: "⚽" },
  { name: "LGBTQ+ Community", icon: "🌈" },
  { name: "DIY & Repair", icon: "🔧" },
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
      setInterests(interests.filter((item) => item !== interest));
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
    <div className="min-h-screen overflow-x-clip bg-[#F4F9F5] px-5 py-8 text-gray-900">
      {/* center the search content and limit its desktop width */}
      <div className="mx-auto max-w-xl">
        {/* volunteer hub heading */}
        <div className="flex gap-4 items-center justify-center">
          <img
            src="/volunteer-hub-logo.svg"
            alt="volunteer hub log"
            className="mb-6 max-w-24 max-h-24"
          />
          <h1 className="font-kbh mb-6 text-center text-2xl font-[600] text-[#173F30]">
            Volunteer Hub
          </h1>
        </div>
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
        {/* Section with ExploreCards */}
        <Section title="Find something you love doing">
          <div className=" w-[230px] shrink-0 snap-start">
            <ExploreCard
              title="Meet new people while doing good"
              category="Social Causes"
              image="/images/opportunity-newcomers-conversation.jpg"
            />
          </div>

          <div className="w-[230px] shrink-0 snap-start">
            <ExploreCard
              title="Good food tastes better together"
              category="Community Dinner"
              image="/images/opportunity-community-dinner.jpg"
            />
          </div>
        </Section>

        {/* Section with SmallCards */}
        <Section title="Weekend Activities">
          <div className="w-[250px] shrink-0 snap-start">
            <SmallCard
              title="Join our clean-up walk at Brabrand lake!"
              image="/images/opportunity-brabrandlake-cleanup.jpg"
              location="Brabrand, Aarhus"
            />
          </div>

          <div className="w-[250px] shrink-0 snap-start">
            <SmallCard
              title="Weekend yoga volunteers wanted!"
              image="/images/opportunity-fun-movement.jpg"
              location="Nørrebro, Copenhagen"
            />
          </div>
        </Section>
      </div>
      {/* show interests overlay when opened */}
      {showInterests && (
        <InterestsOverlay
          interests={interests}
          availableInterests={availableInterests}
          handleInterestChange={handleInterestChange}
          onClose={() => setShowInterests(false)}
        />
      )}
    </div>
  );
}

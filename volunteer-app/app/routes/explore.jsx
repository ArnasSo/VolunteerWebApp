import { useState } from "react";
import { useNavigate } from "react-router";

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

export default function Explore() {
  // useState remembers the location selected by the user
  // location stores the current value
  // setLocation is used to update that value
  // the empty string means no location is selected yet
  const [location, setLocation] = useState("");

  // useNavigate allows us to send the user to another page
  const navigate = useNavigate();

  // this function runs when the search button is clicked
  function handleSearch() {
    // URLSearchParams helps us add information to the url
    // for example: ?location=Aarhus
    const params = new URLSearchParams();

    // only add the location if the user has selected one
    if (location) {
      params.set("location", location);
    }

    // navigate to the results page with the selected location
    // toString converts the search parameters into url text
    navigate(`/explore/results?${params.toString()}`);
  }

  return (
    // mx-auto centers the content, max-w-4xl limits its width
    // p-4 adds padding around the page
    <div className="mx-auto max-w-4xl p-4">
      {/* page heading */}
      <h1 className="text-2xl font-bold">
        Find Your Next Volunteering Opportunity
      </h1>

      {/* short description below the heading */}
      <p className="mt-2 text-gray-600">
        Discover opportunities that match your interests and availability.
      </p>

      {/* container for the location search */}
      <div className="mt-8 rounded-lg border border-gray-200 p-4">
        {/* label describes what the dropdown is used for */}
        {/* htmlFor connects the label to the element with id="location" */}
        {/* clicking the label will focus the dropdown */}
        <label htmlFor="location" className="block font-medium">
          Where would you like to volunteer?
        </label>

        {/* select creates a dropdown menu */}
        {/* id connects this dropdown to the label above */}
        {/* value tells React which option is currently selected */}
        {/* onChange runs whenever the user selects another option */}
        {/* event.target.value gives us the value of the selected option */}
        <select
          id="location"
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          className="mt-2 w-full rounded-lg border border-gray-300 p-3"
        >
          {/* each option is one choice inside the dropdown */}
          {/* value is the actual information stored when selected */}
          {/* the text between the tags is what the user sees */}

          {/* an empty value means we are not filtering by location */}
          <option value="">All locations</option>

          {/* these are temporary locations until we connect Supabase */}
          <option value="Aarhus">Aarhus</option>
          <option value="Aalborg">Aalborg</option>
          <option value="Copenhagen">Copenhagen</option>
        </select>

        {/* button starts the search when clicked */}
        {/* type="button" means it won't submit a form automatically */}
        {/* onClick tells React which function to run */}
        <button
          type="button"
          onClick={handleSearch}
          className="mt-4 w-full rounded-lg bg-green-700 p-3 font-semibold text-white"
        >
          Search Opportunities
        </button>
      </div>
    </div>
  );
}

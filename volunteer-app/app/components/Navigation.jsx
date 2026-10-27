import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import { supabase } from "../lib/supabase";

export default function Navigation() {
  // store whether the volunteer is logged in
  // null means we haven't checked the login status yet
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  // useEffect runs when the navigation component first loads
  useEffect(() => {
    // check whether a user is already logged in
    async function checkSession() {
      const { data } = await supabase.auth.getSession();

      // !! converts the session into true or false
      // true = logged in, false = guest
      setIsLoggedIn(!!data.session);
    }

    checkSession();

    // listen for changes such as login or logout
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      // update the navigation whenever authentication changes
      setIsLoggedIn(!!session);
    });

    // remove the listener when the component is no longer used
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // navigation links available to guests
  const guestLinks = [
    { label: "Home", path: "/" },
    { label: "Explore", path: "/explore" },
    { label: "Login", path: "/login" },
  ];

  // navigation links available to logged-in volunteers
  const userLinks = [
    { label: "Home", path: "/" },
    { label: "Explore", path: "/explore" },
    { label: "My Activity", path: "/my-activity" },
    { label: "Profile", path: "/profile" },
  ];

  // choose the correct links based on login status
  const links = isLoggedIn ? userLinks : guestLinks;

  return (
    // bottom navigation on mobile, top navigation on desktop
    <nav
      aria-label="Main navigation"
      className="fixed bottom-0 left-0 z-50 flex w-full justify-around border-t border-gray-200 bg-white p-4 md:static md:border-t-0 md:border-b"
    >
      {/* wait until the login status is known before showing links */}
      {isLoggedIn !== null &&
        links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            end
            // highlight the page we're currently viewing
            className={({ isActive }) =>
              isActive ? "font-semibold text-green-700" : "text-gray-500"
            }
          >
            {link.label}
          </NavLink>
        ))}
    </nav>
  );
}

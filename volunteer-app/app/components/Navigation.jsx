import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import { supabase } from "../lib/supabase";

// navigation links available to guests
const guestLinks = [
  {
    label: "Home",
    path: "/",
    icon: "/images/tabler_home.svg",
  },
  {
    label: "Opportunity",
    mobileLabel: "Opportunity",
    path: "/explore",
    icon: "/images/tabler_search.svg",
  },
  {
    label: "Log in",
    mobileLabel: "Log in",
    path: "/login",
    icon: "/images/tabler_user.svg",
  },
];

// navigation links available to logged-in volunteers
const userLinks = [
  {
    label: "Home",
    path: "/",
    icon: "/images/tabler_home.svg",
  },
  {
    label: "Opportunity",
    mobileLabel: "Opportunity",
    path: "/explore",
    icon: "/images/tabler_search.svg",
  },
  {
    label: "My Activity",
    mobileLabel: "My activity",
    path: "/my-activity",
    icon: "/images/tabler_heart-handshake.svg",
  },
  {
    label: "Profile",
    path: "/profile",
    icon: "/images/tabler_user.svg",
  },
];

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

  // choose the correct links based on login status
  const links = isLoggedIn ? userLinks : guestLinks;

  return (
    // bottom navigation on mobile, top navigation on desktop
    <nav
      aria-label="Main navigation"
      className={`fixed bottom-0 left-0 z-50 flex h-[84px] w-full border-t-[1.5px] border-[#DDEBDE] bg-[#F3F8F3] px-2
  ${
    isLoggedIn
      ? "items-center justify-center pb-[19.5px]"
      : "items-start justify-between px-6"
  }
  md:static md:h-auto md:items-center md:justify-end md:gap-8 md:border-t-0 md:border-b md:px-8 md:py-3`}
    >
      {/* Logo and name - desktop only */}
      <NavLink to="/" className="hidden items-center gap-2 md:mr-auto md:flex">
        <img
          src="/volunteer-hub-logo.svg"
          alt="Volunteer Hub logo"
          className="h-6 w-auto"
        />
        <h1 className="font-kbh text-lg font-semibold text-[#173F30]">
          Volunteer Hub
        </h1>
      </NavLink>
      {/* wait until the login status is known before showing links */}

      {isLoggedIn !== null &&
        links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            end
            className={({ isActive }) => `
  flex flex-col items-center gap-1 whitespace-nowrap
  text-center font-[Inter] text-xs font-normal
  md:font-kbh md:text-sm

  ${isLoggedIn ? "flex-1" : "pt-3 md:pt-0"}

  ${isActive ? "font-semibold text-[#F26B4D]" : "text-[#2E6B4E]"}

  md:flex-none md:flex-row md:pt-0

  ${
    link.label === "Log in"
      ? "md:pt-2 md:rounded-xl md:justify-center md:border md:border-[#DDEBDE] md:bg-white md:px-3 md:py-2 md:font-semibold md:text-[#1F4D37]"
      : !isActive
        ? "md:text-[#6A6C70]"
        : ""
  }
`}
          >
            {/* Mobile icon */}
            <span
              className="h-8 w-8 shrink-0 bg-current md:hidden"
              style={{
                WebkitMask: `url("${link.icon}") center / contain no-repeat`,
                mask: `url("${link.icon}") center / contain no-repeat`,
              }}
            />

            {/* Mobile text */}
            <span className="md:hidden">{link.mobileLabel || link.label}</span>

            {/* Desktop text */}
            <span className="hidden md:inline">{link.label}</span>
          </NavLink>
        ))}
    </nav>
  );
}

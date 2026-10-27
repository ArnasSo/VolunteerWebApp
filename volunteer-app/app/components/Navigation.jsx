import { NavLink } from "react-router";

export default function Navigation() {
  // our main pages and the routes they lead to
  const links = [
    { label: "Home", path: "/" },
    { label: "Explore", path: "/activities" },
    { label: "My Activity", path: "/my-activities" },
    { label: "Profile", path: "/profile" },
  ];

  return (
    // bottom navigation on mobile, top navigation on desktop
    <nav className="fixed bottom-0 left-0 z-50 flex w-full justify-around border-t border-gray-200 bg-white p-4 md:static md:border-t-0 md:border-b">
      {/* Create one navigation link for each page */}
      {links.map((link) => (
        <NavLink
          key={link.path}
          to={link.path}
          end
          // bighlight the page we are currently viewing
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

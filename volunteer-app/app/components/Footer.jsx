import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router";

const footerGroups = [
  {
    title: "Articles",
    links: [{ label: "Archive", to: "/#articles" }],
  },
  {
    title: "Partnership",
    links: [
      { label: "Organizations", to: "/404" },
      { label: "Join us", to: "/404" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "FAQ's", to: "/404" },
      { label: "Contact", to: "/404" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms of Service", to: "/404" },
      { label: "Privacy Policy", to: "/404" },
      { label: "Community Guidelines", to: "/404" },
    ],
  },
];

export default function Footer() {
  const footerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();

  // Reveal footer when it enters the viewport
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <footer ref={footerRef} className="hidden bg-[#2E6B4E] text-white md:block">
      <div
        className={`relative mx-auto flex w-full max-w-[1440px]
          flex-col gap-10 px-8 pb-10 pt-10
          transition-all duration-700 ease-out
          motion-reduce:transition-none
          xl:min-h-[325px] xl:flex-row xl:justify-between
          xl:gap-0 xl:px-10 xl:pb-0
          ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
          }`}
      >
        {/* Logo */}
        <NavLink
          to="/"
          onClick={() => {
            if (location.pathname === "/") {
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }
          }}
          className="flex shrink-0 items-center gap-3 self-start"
        >
          <img
            src="/images/white-logo.svg"
            alt=""
            className="h-[50px] w-[50px]"
          />
          <span className="font-kbh text-[36px] font-semibold leading-normal text-[#F3F8F3]">
            Volunteer Hub
          </span>
        </NavLink>

        {/* Footer navigation */}
        <nav
          aria-label="Footer navigation"
          className="grid grid-cols-4 items-start gap-2 xl:mt-[70px]"
        >
          {footerGroups.map((group) => (
            <div key={group.title} className="flex flex-col">
              <h2 className="font-[Inter] text-[20px] font-semibold leading-normal text-white">
                {group.title}
              </h2>

              <div className="mt-2 flex flex-col gap-1">
                {group.links.map((link) =>
                  link.to ? (
                    <NavLink
                      key={link.label}
                      to={link.to}
                      className="whitespace-nowrap font-[Inter] text-[16px] font-medium leading-normal text-white transition-all duration-200 hover:-translate-y-0.5 hover:underline hover:underline-offset-4"
                    >
                      {link.label}
                    </NavLink>
                  ) : (
                    <span
                      key={link.label}
                      className="whitespace-nowrap font-[Inter] text-[16px] font-medium leading-normal text-white"
                    >
                      {link.label}
                    </span>
                  ),
                )}
              </div>
            </div>
          ))}
        </nav>

        {/* Copyright */}
        <p
          className="mt-2 text-center font-[Inter] text-[16px] font-medium leading-normal text-[#DDEBDE]
          xl:absolute xl:bottom-[36px] xl:left-1/2 xl:mt-0 xl:-translate-x-1/2"
        >
          Copyright © Volunteer Hub
        </p>
      </div>
    </footer>
  );
}

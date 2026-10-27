
export default function ActivityTabs({ activeTab, onTabChange }) {
  // these are the four tabs from our figma design
  const tabs = ["Applied", "Inbox", "Saved", "Done"];

  return (
    <nav
      aria-label="My Activity sections"
      className="flex items-center justify-between gap-2"
    >
      {/* create a button for each tab */}
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onTabChange(tab)}
          className={`rounded-full px-3 py-3 text-sm font-medium transition-colors sm:px-5 sm:text-base ${
            activeTab === tab
              ? "bg-[#DDEBE1] text-[#204F3D]"
              : "text-[#204F3D]"
          }`}
        >
          {tab}
        </button>
      ))}
    </nav>
  );
}

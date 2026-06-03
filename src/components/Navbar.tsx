import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Home", icon: "🏠" },
  { to: "/today", label: "Today", icon: "✏️" },
  { to: "/upcoming", label: "Upcoming", icon: "📝" },
  { to: "/completed", label: "Done", icon: "🍎" },
  { to: "/calendar", label: "Calendar", icon: "📅" },
  { to: "/timetable", label: "Timetabel", icon: "🕐" },
  { to: "/habit", label: "Habit", icon: "🎯" },
  { to: "/community", label: "Community", icon: "💬" },
];

export function Navbar() {
  return (
    <nav className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-primary/10">
      <div className="max-w-2xl mx-auto px-2 flex overflow-x-auto flex-nowrap">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/"}
            className={({ isActive }) =>
              `flex-shrink-0 min-w-[3rem] flex flex-col items-center gap-0.5 py-2 px-1 text-[9px] font-medium transition-colors ${
                isActive
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-500 hover:text-primary/70"
              }`
            }
          >
            <span className="text-base">{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

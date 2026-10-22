import { List, Plus } from "lucide-react";
import { NavLink } from "react-router";
const navItems = [
  {
    label: "All Smoothies",
    path: "/",
    icon: List,
    end: true,
  },
  {
    label: "Add New",
    path: "/create",
    icon: Plus,
  },
];

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <NavLink to="/" className="text-xl font-bold text-green-700">
          Smoothies
        </NavLink>

        <div className="flex items-center gap-2">
          {navItems.map(({ label, path, icon: Icon, end }) => (
            <NavLink
              key={path}
              to={path}
              end={end}
              className={({ isActive }) =>
                `inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-green-100 text-green-800"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  );
}

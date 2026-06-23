"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  collapsed?: boolean;
  setCollapsed?: (v: boolean) => void;
  mobile?: boolean;
  closeMobile?: () => void;
};

export default function Sidebar({
  collapsed = true,
  setCollapsed,
  mobile = false,
  closeMobile,
}: Props) {
  const pathname = usePathname();

  const menu = [
    { label: "Dashboard", href: "/admin" },
    { label: "Guesthouses", href: "/admin/guesthouses" },
    { label: "Rooms", href: "/admin/rooms" },
    { label: "Bookings", href: "/admin/bookings" },
    { label: "Users", href: "/admin/users" },
    { label: "Settings", href: "/admin/settings" },
  ];

  return (
    <aside
      className={`
        ${collapsed ? "w-20" : "w-64"}
        h-screen
        bg-gray-900
        text-gray-100
        flex flex-col
        justify-between
        transition-all duration-300
      `}
    >
      {/* Top */}
      <div>
        <div className="p-4 border-b border-blue-800 flex items-center justify-between">
          {!collapsed && (
            <div>
              <h2 className="font-bold">Admin Panel</h2>
              <p className="text-xs text-gray-400">
                Guesthouse Manager
              </p>
            </div>
          )}

          {!mobile && setCollapsed && (
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="text-gray-400 text-sm"
            >
              {collapsed ? "»" : "«"}
            </button>
          )}
        </div>

        <nav className="p-3 space-y-1 text-sm">
          {menu.map((item) => {
            const active =
              pathname === item.href ||
              pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMobile}
                className={`
                  block px-3 py-2 rounded-lg transition
                  ${
                    active
                      ? "bg-gray-800 text-white"
                      : "text-gray-400 hover:bg-gray-800 hover:text-white"
                  }
                `}
              >
                {collapsed ? item.label.charAt(0) : item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom */}
      <div className="p-3 border-t border-gray-800">
        <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-gray-800 transition">
          {collapsed ? "⎋" : "Logout"}
        </button>
      </div>
    </aside>
  );
}
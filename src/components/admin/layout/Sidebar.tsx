"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarCheck,
  Wallet,
  FileBarChart,
  Boxes,
  Users,
  Building2,
  History,
} from "lucide-react";

const menuItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/booking", label: "Booking", icon: CalendarCheck },
  { href: "/admin/pembayaran", label: "Pembayaran", icon: Wallet },
  { href: "/admin/laporan", label: "Laporan", icon: FileBarChart },
  { href: "/admin/manage/inventory", label: "Inventaris", icon: Boxes },
  { href: "/admin/manage/users", label: "Pengguna", icon: Users },
  { href: "/admin/activity-logs", label: "Activity Log", icon: History },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 flex-col justify-between bg-forest text-sand md:flex">
      <div>
        <div className="flex items-center gap-3 border-b border-white/10 px-6 py-5">
          <div className="rounded-xl bg-terracotta p-2 text-white">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-base font-bold leading-tight text-white">
              Darunnajah
            </h1>
            <p className="text-xs text-sand/70">Admin Panel</p>
          </div>
        </div>

        <nav className="space-y-1 p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-terracotta text-white"
                    : "text-sand/80 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
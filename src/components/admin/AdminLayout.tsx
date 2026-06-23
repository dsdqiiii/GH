"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-white text-black">
      {/* Desktop Sidebar */}
      <div className="hidden sm:block bg-blue-600">
        <Sidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />
      </div>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full">
            <Sidebar
              collapsed={false}
              mobile
              closeMobile={() => setMobileOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="h-14 bg-white border-b flex items-center justify-between px-4">
          <button
            className="md:hidden text-gray-700"
            onClick={() => setMobileOpen(true)}
          >
            ☰
          </button>

          <h1 className="text-sm font-semibold text-gray-700">
            Admin Dashboard
          </h1>
        </div>

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
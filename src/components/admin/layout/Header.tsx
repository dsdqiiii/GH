import { LogOut } from "lucide-react";
import { logoutAction } from "@/actions/admin/auth";

export function Header() {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-sand bg-surface px-6">
      <div className="text-sm font-medium text-ink">
        Penginapan Darunnajah
      </div>

      <form action={logoutAction}>
        <button
          type="submit"
          className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-taupe transition-colors hover:bg-cream hover:text-terracotta"
        >
          <LogOut className="h-4 w-4" />
          <span>Keluar</span>
        </button>
      </form>
    </header>
  );
}
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createSupabaseServer } from "@/lib/supabase/server";
import { Sidebar } from "@/components/admin/layout/Sidebar";
import { Header } from "@/components/admin/layout/Header";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServer();

  // 1. Cek Autentikasi User
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/admin");
  }

  // 2. Ambil role_id dari tabel profiles
  const { data: profile } = await supabase
    .from("profiles")
    .select("role_id")
    .eq("id", user.id)
    .single();

  const roleId = profile?.role_id ?? 2; // Default ke Role 2 jika profil belum ada

  // 3. Ambil URL pathname saat ini dari Request Headers Next.js
  const headerList = await headers();
  const currentPath = headerList.get("x-pathname") || "";

  // 4. Proteksi Rute: Jika Role 2 mencoba mengakses /admin/manage/users
  if (roleId === 2 && currentPath.startsWith("/admin/manage/users")) {
    redirect("/admin/dashboard");
  }

  return (
    <div className="flex h-screen bg-cream text-ink">
      {/* Pass roleId ke Sidebar untuk filter menu */}
      <Sidebar roleId={roleId} />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
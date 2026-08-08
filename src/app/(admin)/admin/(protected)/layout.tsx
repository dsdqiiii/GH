import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";
import { Sidebar } from "@/components/admin/layout/Sidebar";
import { Header } from "@/components/admin/layout/Header";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServer();

  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/admin");
  }

  return (
    <div className="flex h-screen bg-cream text-ink">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
import { redirect } from "next/navigation";
import { ShieldCheck, Users } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/core/card";
import { InviteAdminCard } from "@/components/admin/auth/InviteAdminCard";
import { UserTableTabs } from "@/components/admin/auth/UserTableTabs";
import { getUsers } from "@/services/admin/users";
import { createSupabaseServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function ManageUsersPage() {
  const supabase = await createSupabaseServer();

  // 1. Cek User Authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin");
  }

  // 2. Cek Role User dari Tabel Profiles
  const { data: profile } = await supabase
    .from("profiles")
    .select("role_id")
    .eq("id", user.id)
    .single();

  // 3. Proteksi Halaman: Jika role_id !== 1, tendang langsung ke Dashboard
  if (profile?.role_id !== 1) {
    redirect("/admin/dashboard");
  }

  // 4. Fetch Data Users (Hanya dieksekusi jika role_id === 1)
  const { data: users, error } = await getUsers();

  if (error || !users) {
    return (
      <div className="p-6 text-sm text-red-500">
        Gagal memuat data pengguna: {error ?? "Terjadi kesalahan"}
      </div>
    );
  }

  const totalAdmin = users.filter((u) => u.role === "admin").length;
  const totalCustomer = users.filter((u) => u.role === "customer").length;

  return (
    <div className="space-y-6 p-6">
      {/* Header Halaman */}
      <div>
        <h1 className="text-xl font-semibold text-neutral-900">
          Manajemen Pengguna
        </h1>
        <p className="text-sm text-neutral-500">
          Kelola hak akses admin dan lihat daftar pengguna terdaftar.
        </p>
      </div>

      {/* Form Invite & Ringkasan Stats */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <InviteAdminCard />
        </div>

        <Card variant="flat" className="flex flex-col justify-between bg-white">
          <CardHeader>
            <CardTitle className="text-sm text-neutral-500">
              Total Pengguna
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <span className="flex items-center gap-2 text-sm font-medium">
                <ShieldCheck className="h-4 w-4 text-forest" /> Admin
              </span>
              <span className="font-semibold text-neutral-900">{totalAdmin}</span>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="flex items-center gap-2 text-sm font-medium">
                <Users className="h-4 w-4 text-neutral-500" /> Customer
              </span>
              <span className="font-semibold text-neutral-900">{totalCustomer}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabel Pengguna Berdasarkan Tab */}
      <UserTableTabs users={users} />
    </div>
  );
}
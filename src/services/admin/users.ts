import { supabaseAdmin } from "@/lib/supabase/admin";

export interface UserListItem {
  id: string;
  name: string;
  email: string;
  role: "admin" | "customer";
  roleName: string; // Add field roleName
  status: "active" | "invited" | "inactive";
  createdAt: string;
}

export type GetUsersResult =
  | { data: UserListItem[]; error: null }
  | { data: null; error: string };

/**
 * Mengambil daftar pengguna terdaftar beserta role dan statusnya.
 */
export async function getUsers(): Promise<GetUsersResult> {
  const supabase = supabaseAdmin;

  // 1. Ambil seluruh user dari Auth Supabase (termasuk email & status konfirmasi email)
  const {
    data: { users: authUsers },
    error: authError,
  } = await supabase.auth.admin.listUsers();

  if (authError) {
    return { data: null, error: `Gagal mengambil auth users: ${authError.message}` };
  }

  // Map auth users berdasarkan ID agar lookup O(1)
  const authUserMap = new Map(authUsers.map((u) => [u.id, u]));

  // 2. Query profiles join ke roles
  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select(`
      id,
      username,
      is_active,
      suspended_at,
      created_at,
      roles (
        name
      )
    `)
    .order("created_at", { ascending: false });

  if (profilesError) {
    return { data: null, error: `Gagal mengambil profiles: ${profilesError.message}` };
  }

  // 3. Gabungkan data Auth + Profiles
  const formattedUsers: UserListItem[] = (profiles || []).map((profile) => {
    const authUser = authUserMap.get(profile.id);
    const rawRoleName = (profile.roles as unknown as { name: string })?.name;
    const isSystemAdmin = rawRoleName === "administrator" || rawRoleName === "staff";

    // Penentuan Status:
    // - inactive: jika di-suspend atau is_active === false
    // - invited: jika user diundang tapi belum mengonfirmasi email (email_confirmed_at null)
    // - active: user aktif terverifikasi
    let status: UserListItem["status"] = "active";

    if (profile.suspended_at || !profile.is_active) {
      status = "inactive";
    } else if (authUser && !authUser.email_confirmed_at && authUser.invited_at) {
      status = "invited";
    }

    return {
      id: profile.id,
      name: profile.username || "Tanpa Nama",
      email: authUser?.email || "-",
      role: isSystemAdmin ? "admin" : "customer",
      roleName: rawRoleName || "-", // Kembalikan nama role asli dari database
      status,
      createdAt: new Date(profile.created_at).toISOString().split("T")[0],
    };
  });

  console.log("Formatted Users:", formattedUsers);

  return { data: formattedUsers, error: null };
}
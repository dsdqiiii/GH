import { supabaseAdmin } from "@/lib/supabase/admin";

export interface InviteUserServiceInput {
  email: string;
}

/**
 * Service murni untuk mengundang user via Supabase Auth Admin.
 * Trigger DB 'on_auth_user_created' akan otomatis membuat record di tabel 'profiles'.
 */
export async function inviteUserService({ email }: InviteUserServiceInput) {
  const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email);

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
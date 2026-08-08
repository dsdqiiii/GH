"use server";

import { revalidatePath } from "next/cache";
import { inviteUserService } from "@/services/admin/invite-user";

export interface InviteActionState {
  success?: boolean;
  message?: string;
  error?: string;
}

/**
 * Action yang dipanggil dari Form UI.
 */
export async function inviteUserAction(
  prevState: InviteActionState,
  formData: FormData
): Promise<InviteActionState> {
  // 1. Sanitasi & Ambil Input
  const rawEmail = formData.get("email");
  const email = typeof rawEmail === "string" ? rawEmail.trim().toLowerCase() : "";

  // 2. Validasi Input
  if (!email) {
    return { success: false, error: "Email wajib diisi." };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { success: false, error: "Format email tidak valid." };
  }

  // 3. Tembak ke Layer Service
  try {
    await inviteUserService({ email });

    // 4. Revalidate cache halaman manajemen pengguna
    revalidatePath("/admin/manage/users");

    return {
      success: true,
      message: `Undangan berhasil dikirim ke ${email}.`,
    };
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Terjadi kesalahan tidak terduga.";

    return {
      success: false,
      error: `Gagal mengundang user: ${errorMessage}`,
    };
  }
}
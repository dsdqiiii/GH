"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createSupabaseServer } from "@/lib/supabase/server";
import { loginSchema, type LoginFormState } from "@/lib/validators/auth";
import { logActivity } from "@/helpers/log-activity";

export async function loginAction(
  _prevState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  const rawData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = loginSchema.safeParse(rawData);

  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createSupabaseServer();
  const headerList = await headers();
  const userAgent = headerList.get("user-agent") || "unknown";

  const { data, error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  // 1. Penanganan Login GAGAL (auth.login_failed)
  if (error || !data.user) {
    await logActivity({
      actorType: "anonymous",
      actorId: null,
      event: "auth.login_failed",
      entityType: "auth",
      entityId: null,
      metadata: {
        email: parsed.data.email,
        reason: error?.message ?? "User tidak ditemukan",
        user_agent: userAgent,
      },
    });

    return {
      success: false,
      message:
        error?.code === "invalid_credentials"
          ? "Email atau password salah"
          : "Gagal masuk, silakan coba lagi",
    };
  }

  // 2. Penanganan Login BERHASIL (auth.login)
  const { data: profile } = await supabase
    .from("profiles")
    .select("role_id")
    .eq("id", data.user.id)
    .single();

  await logActivity({
    actorType: "admin",
    actorId: data.user.id,
    event: "auth.login",
    entityType: "auth",
    entityId: data.user.id,
    metadata: {
      email: data.user.email,
      role_id: profile?.role_id ?? null,
      user_agent: userAgent,
    },
  });

  redirect("/admin/dashboard");
}

export async function logoutAction() {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role_id")
      .eq("id", user.id)
      .single();

    const headerList = await headers();
    const userAgent = headerList.get("user-agent") || "unknown";

    // 3. Penanganan LOGOUT (auth.logout)
    await logActivity({
      actorType: "admin",
      actorId: user.id,
      event: "auth.logout",
      entityType: "auth",
      entityId: user.id,
      metadata: {
        email: user.email,
        role_id: profile?.role_id ?? null,
        user_agent: userAgent,
      },
    });
  }

  await supabase.auth.signOut();
  redirect("/admin");
}
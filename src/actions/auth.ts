"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createSupabaseServer } from "@/lib/supabase/server";
import { loginSchema, type LoginFormState } from "@/lib/validators/auth";

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

  const { data, error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return {
      success: false,
      message:
        error.code === "invalid_credentials"
          ? "Email atau password salah"
          : "Gagal masuk, silakan coba lagi",
    };
  }

  // Catat log login via RPC
  if (data.user) {
    const headerList = await headers();
    const userAgent = headerList.get("user-agent") || "unknown";

    await supabase.rpc("log_activity", {
      p_actor_type: "user",
      p_actor_id: data.user.id,
      p_event: "LOGIN",
      p_entity_type: "auth",
      p_entity_id: data.user.id,
      p_metadata: {
        email: data.user.email,
        user_agent: userAgent,
      },
    });
  }

  redirect("/admin/dashboard");
}

export async function logoutAction() {
  const supabase = await createSupabaseServer();

  // Ambil user sebelum signout untuk pencatatan log
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const headerList = await headers();
    const userAgent = headerList.get("user-agent") || "unknown";

    await supabase.rpc("log_activity", {
      p_actor_type: "user",
      p_actor_id: user.id,
      p_event: "LOGOUT",
      p_entity_type: "auth",
      p_entity_id: user.id,
      p_metadata: {
        email: user.email,
        user_agent: userAgent,
      },
    });
  }

  await supabase.auth.signOut();
  redirect("/admin");
}
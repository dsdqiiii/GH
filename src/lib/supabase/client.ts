// packages/supabase/src/client.ts

import { createBrowserClient } from "@supabase/ssr";
<<<<<<< HEAD
import type { Database } from "./supabase";
=======
import type { Database } from "../types/supabase";
>>>>>>> upstream/main

let client: ReturnType<typeof createBrowserClient<Database>> | null = null;

export function createSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    throw new Error("Missing Supabase environment variables (client)");
  }

  if (!client) {
    client = createBrowserClient<Database>(url, key);
  }

  return client;
}
// packages/supabase/src/browser.ts

import { createClient } from "@supabase/supabase-js";
<<<<<<< HEAD
import type { Database } from "./supabase";
=======
import type { Database } from "../types/supabase";
>>>>>>> upstream/main

export function createSupabaseBrowser() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    throw new Error("Missing Supabase environment variables (browser)");
  }

  return createClient<Database>(url, key, {
    auth: {
      detectSessionInUrl: true,
      flowType: "implicit",
    },
  });
}
// packages/supabase/src/browser.ts

import { createClient } from "@supabase/supabase-js";
import type { Database } from "../types/supabase";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

if (!url || !key) {
  throw new Error("Missing Supabase environment variables (browser)");
}

export const supabaseBrowser = createClient<Database>(url, key, {
  auth: {
    detectSessionInUrl: true,
    flowType: "implicit",
  },
});
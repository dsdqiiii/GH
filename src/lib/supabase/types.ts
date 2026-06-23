// packages/supabase/src/types.ts

import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@bn/types";

export type AppSupabaseClient =
  SupabaseClient<Database>;

import { Database } from "./supabase";

export type AvailableUnit =
  Database["public"]["Functions"]["get_available_units"]["Returns"][number];

export type AvailableUnits =
  Database["public"]["Functions"]["get_available_units"]["Returns"];
import { Tables, TablesInsert, TablesUpdate } from "../supabase/supabase";

export type MasterProperties = Tables<'master_properties'>;
export type MasterPropertiesInsert = TablesInsert<'master_properties'>;
export type MasterPropertiesUpdate = TablesUpdate<'master_properties'>;

export type Units = Tables<'units'>;
export type UnitsInsert = TablesInsert<'units'>;
export type UnitsUpdate = TablesUpdate<'units'>;

export type MasterFacility = Tables<'master_facilities'>;
export type MasterFacilityInsert = TablesInsert<'master_facilities'>;
export type MasterFacilityUpdate = TablesUpdate<'master_facilities'>;

export type PropertyAddons = Tables<'property_addons'>;
export type MasterAddons = Tables<'master_addons'>;

export type PropertyMasterAddons = Pick<
  PropertyAddons,
  "id" | "price"
> & {
  addon_id: MasterAddons["id"];
  code: MasterAddons["code"];
  name: MasterAddons["name"];
  description: MasterAddons["description"];
  pricing_unit: MasterAddons["pricing_unit"];
};

export type FacilityAssignments = Tables<'facility_assignments'>;

export type UnitFacilities = Pick<MasterFacility, 'name'> & Pick<FacilityAssignments, 'reference_id'>;
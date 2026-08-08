import { Tables, TablesInsert, TablesUpdate } from "./supabase";

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

export type PropertyAssignments = Tables<'property_assignments'>;
export type PropertyAssignmentsInsert = TablesInsert<'property_assignments'>;

// Property yang di-assign ke user tertentu (join property_assignments -> master_properties)
export type AssignedProperty = MasterProperties & {
  assignment_id: PropertyAssignments['id'];
  mapped_at: PropertyAssignments['mapped_at'];
};

export type MasterOrganizations = Tables<'master_organizations'>;

export type MasterBankAccounts = Tables<'master_bank_accounts'>;
export type MasterBankAccountsInsert = TablesInsert<'master_bank_accounts'>;

export type Galleries = Tables<'galleries'>;
export type GalleriesInsert = TablesInsert<'galleries'>;

// Facility yang sudah ter-assign ke sebuah property/unit, digabung dengan detail master_facilities
export type PropertyFacility = Pick<FacilityAssignments, 'id' | 'reference_type' | 'reference_id' | 'mapped_at'> & {
  facility_id: MasterFacility['id'];
  facility_name: MasterFacility['name'];
  facility_code: MasterFacility['code'];
  icon_url: MasterFacility['icon_url'];
};

// Bundle data lengkap untuk halaman detail 1 property (manage/[properti])
export type PropertyDetail = {
  property: MasterProperties;
  organization: MasterOrganizations | null;
  bankAccounts: MasterBankAccounts[];
  facilities: PropertyFacility[];
  galleries: Galleries[];
};

// Bundle data lengkap untuk halaman detail 1 unit (manage/[properti]/units/[unit])
export type UnitDetail = {
  unit: Units;
  property: MasterProperties;
  facilities: PropertyFacility[];
  galleries: Galleries[];
};
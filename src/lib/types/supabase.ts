export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          actor_id: string | null
          actor_type: string
          created_at: string
          entity_id: string | null
          entity_type: string
          event: string
          id: string
          metadata: Json
        }
        Insert: {
          actor_id?: string | null
          actor_type: string
          created_at?: string
          entity_id?: string | null
          entity_type: string
          event: string
          id?: string
          metadata?: Json
        }
        Update: {
          actor_id?: string | null
          actor_type?: string
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          event?: string
          id?: string
          metadata?: Json
        }
        Relationships: []
      }
      extended_permissions: {
        Row: {
          granted_at: string
          granted_by: string | null
          notes: string | null
          permission_id: number
          user_id: string
        }
        Insert: {
          granted_at?: string
          granted_by?: string | null
          notes?: string | null
          permission_id: number
          user_id: string
        }
        Update: {
          granted_at?: string
          granted_by?: string | null
          notes?: string | null
          permission_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "extended_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
        ]
      }
      facility_assignments: {
        Row: {
          facility_id: number
          id: string
          mapped_at: string
          mapped_by: string | null
          reference_id: string
          reference_type: string
        }
        Insert: {
          facility_id: number
          id?: string
          mapped_at?: string
          mapped_by?: string | null
          reference_id: string
          reference_type: string
        }
        Update: {
          facility_id?: number
          id?: string
          mapped_at?: string
          mapped_by?: string | null
          reference_id?: string
          reference_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "facility_assignments_facility_id_fkey"
            columns: ["facility_id"]
            isOneToOne: false
            referencedRelation: "master_facilities"
            referencedColumns: ["id"]
          },
        ]
      }
      galleries: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          is_main: boolean
          reference_id: string
          reference_type: string
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          is_main?: boolean
          reference_id: string
          reference_type: string
          updated_at?: string
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          is_main?: boolean
          reference_id?: string
          reference_type?: string
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      master_addons: {
        Row: {
          code: string
          created_at: string
          description: string | null
          id: number
          is_active: boolean
          name: string
          pricing_unit: string
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          id?: never
          is_active?: boolean
          name: string
          pricing_unit: string
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          id?: never
          is_active?: boolean
          name?: string
          pricing_unit?: string
          updated_at?: string
        }
        Relationships: []
      }
      master_bank_accounts: {
        Row: {
          account_holder: string
          account_number: string
          bank_name: string
          created_at: string
          id: string
          is_active: boolean
          master_organizations_id: string
          updated_at: string
        }
        Insert: {
          account_holder: string
          account_number: string
          bank_name: string
          created_at?: string
          id?: string
          is_active?: boolean
          master_organizations_id: string
          updated_at?: string
        }
        Update: {
          account_holder?: string
          account_number?: string
          bank_name?: string
          created_at?: string
          id?: string
          is_active?: boolean
          master_organizations_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "master_bank_accounts_master_organizations_id_fkey"
            columns: ["master_organizations_id"]
            isOneToOne: false
            referencedRelation: "master_organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      master_charges: {
        Row: {
          created_at: string
          id: number
          is_active: boolean
          name: string
          type: string
          updated_at: string
          value: number
        }
        Insert: {
          created_at?: string
          id?: never
          is_active?: boolean
          name: string
          type: string
          updated_at?: string
          value: number
        }
        Update: {
          created_at?: string
          id?: never
          is_active?: boolean
          name?: string
          type?: string
          updated_at?: string
          value?: number
        }
        Relationships: []
      }
      master_facilities: {
        Row: {
          code: string
          created_at: string
          description: string | null
          icon_url: string | null
          id: number
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          icon_url?: string | null
          id?: never
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          icon_url?: string | null
          id?: never
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      master_organizations: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      master_properties: {
        Row: {
          address: string | null
          contact_wa: string | null
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          master_organizations_id: string
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          contact_wa?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          master_organizations_id: string
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          contact_wa?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          master_organizations_id?: string
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "master_properties_master_organizations_id_fkey"
            columns: ["master_organizations_id"]
            isOneToOne: false
            referencedRelation: "master_organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      order_charges: {
        Row: {
          calculated_amount: number
          charge_id: number | null
          charge_name: string
          charge_type: string
          charge_value: number
          created_at: string
          id: string
          order_id: string
        }
        Insert: {
          calculated_amount: number
          charge_id?: number | null
          charge_name: string
          charge_type: string
          charge_value: number
          created_at?: string
          id?: string
          order_id: string
        }
        Update: {
          calculated_amount?: number
          charge_id?: number | null
          charge_name?: string
          charge_type?: string
          charge_value?: number
          created_at?: string
          id?: string
          order_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_charges_charge_id_fkey"
            columns: ["charge_id"]
            isOneToOne: false
            referencedRelation: "master_charges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_charges_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_item_addons: {
        Row: {
          addon_id: number | null
          id: string
          order_item_id: string
          price_at_booking: number
          quantity: number
          subtotal: number | null
        }
        Insert: {
          addon_id?: number | null
          id?: string
          order_item_id: string
          price_at_booking: number
          quantity: number
          subtotal?: number | null
        }
        Update: {
          addon_id?: number | null
          id?: string
          order_item_id?: string
          price_at_booking?: number
          quantity?: number
          subtotal?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "order_item_addons_addon_id_fkey"
            columns: ["addon_id"]
            isOneToOne: false
            referencedRelation: "master_addons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_item_addons_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_items"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          cancel_reason: string | null
          cancelled_at: string | null
          cancelled_by: string | null
          check_in: string
          check_out: string
          checked_in_at: string | null
          checked_in_by: string | null
          checked_out_at: string | null
          checked_out_by: string | null
          guest_amount: number
          id: string
          order_id: string
          price_at_booking: number
          quantity: number
          status_item: string
          subtotal: number
          type_booking: string
          unit_id: string
        }
        Insert: {
          cancel_reason?: string | null
          cancelled_at?: string | null
          cancelled_by?: string | null
          check_in: string
          check_out: string
          checked_in_at?: string | null
          checked_in_by?: string | null
          checked_out_at?: string | null
          checked_out_by?: string | null
          guest_amount: number
          id?: string
          order_id: string
          price_at_booking: number
          quantity: number
          status_item?: string
          subtotal: number
          type_booking: string
          unit_id: string
        }
        Update: {
          cancel_reason?: string | null
          cancelled_at?: string | null
          cancelled_by?: string | null
          check_in?: string
          check_out?: string
          checked_in_at?: string | null
          checked_in_by?: string | null
          checked_out_at?: string | null
          checked_out_by?: string | null
          guest_amount?: number
          id?: string
          order_id?: string
          price_at_booking?: number
          quantity?: number
          status_item?: string
          subtotal?: number
          type_booking?: string
          unit_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          booking_code: string
          cancel_reason: string | null
          created_at: string
          expires_at: string
          guest_email: string | null
          guest_name: string | null
          guest_phone: string | null
          id: string
          status: string
          total_amount: number
          total_guest: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          booking_code: string
          cancel_reason?: string | null
          created_at?: string
          expires_at: string
          guest_email?: string | null
          guest_name?: string | null
          guest_phone?: string | null
          id?: string
          status?: string
          total_amount: number
          total_guest: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          booking_code?: string
          cancel_reason?: string | null
          created_at?: string
          expires_at?: string
          guest_email?: string | null
          guest_name?: string | null
          guest_phone?: string | null
          id?: string
          status?: string
          total_amount?: number
          total_guest?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          destination_account_holder: string
          destination_account_number: string
          destination_bank_name: string
          id: string
          notes: string | null
          order_id: string
          proof_url: string | null
          status: string
          updated_at: string
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          destination_account_holder: string
          destination_account_number: string
          destination_bank_name: string
          id?: string
          notes?: string | null
          order_id: string
          proof_url?: string | null
          status?: string
          updated_at?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          destination_account_holder?: string
          destination_account_number?: string
          destination_bank_name?: string
          id?: string
          notes?: string | null
          order_id?: string
          proof_url?: string | null
          status?: string
          updated_at?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: true
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      permissions: {
        Row: {
          category: string | null
          description: string | null
          id: number
          name: string
        }
        Insert: {
          category?: string | null
          description?: string | null
          id: number
          name: string
        }
        Update: {
          category?: string | null
          description?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          is_active: boolean
          is_verified: boolean
          role_id: number
          suspended_at: string | null
          suspended_by: string | null
          suspended_reason: string | null
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id: string
          is_active?: boolean
          is_verified?: boolean
          role_id?: number
          suspended_at?: string | null
          suspended_by?: string | null
          suspended_reason?: string | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          is_verified?: boolean
          role_id?: number
          suspended_at?: string | null
          suspended_by?: string | null
          suspended_reason?: string | null
          updated_at?: string
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      property_addons: {
        Row: {
          addon_id: number
          created_at: string
          id: string
          is_active: boolean
          master_properties_id: string
          price: number
          updated_at: string
        }
        Insert: {
          addon_id: number
          created_at?: string
          id?: string
          is_active?: boolean
          master_properties_id: string
          price: number
          updated_at?: string
        }
        Update: {
          addon_id?: number
          created_at?: string
          id?: string
          is_active?: boolean
          master_properties_id?: string
          price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_addons_addon_id_fkey"
            columns: ["addon_id"]
            isOneToOne: false
            referencedRelation: "master_addons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_addons_master_properties_id_fkey"
            columns: ["master_properties_id"]
            isOneToOne: false
            referencedRelation: "master_properties"
            referencedColumns: ["id"]
          },
        ]
      }
      property_assignments: {
        Row: {
          id: string
          mapped_at: string
          mapped_by: string | null
          master_properties_id: string
          user_id: string
        }
        Insert: {
          id?: string
          mapped_at?: string
          mapped_by?: string | null
          master_properties_id: string
          user_id: string
        }
        Update: {
          id?: string
          mapped_at?: string
          mapped_by?: string | null
          master_properties_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_assignments_master_properties_id_fkey"
            columns: ["master_properties_id"]
            isOneToOne: false
            referencedRelation: "master_properties"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          description: string | null
          id: number
          name: string
        }
        Insert: {
          description?: string | null
          id: number
          name: string
        }
        Update: {
          description?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      units: {
        Row: {
          base_price_per_night: number
          capacity: number
          created_at: string
          deleted_at: string | null
          descriptions: string | null
          details: string | null
          floor: string | null
          id: string
          is_active: boolean
          is_transit_enabled: boolean
          master_properties_id: string
          name: string
          price_per_hour: number | null
          slug: string
          unit_type: string
          updated_at: string
        }
        Insert: {
          base_price_per_night: number
          capacity?: number
          created_at?: string
          deleted_at?: string | null
          descriptions?: string | null
          details?: string | null
          floor?: string | null
          id?: string
          is_active?: boolean
          is_transit_enabled?: boolean
          master_properties_id: string
          name: string
          price_per_hour?: number | null
          slug: string
          unit_type?: string
          updated_at?: string
        }
        Update: {
          base_price_per_night?: number
          capacity?: number
          created_at?: string
          deleted_at?: string | null
          descriptions?: string | null
          details?: string | null
          floor?: string | null
          id?: string
          is_active?: boolean
          is_transit_enabled?: boolean
          master_properties_id?: string
          name?: string
          price_per_hour?: number | null
          slug?: string
          unit_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "units_master_properties_id_fkey"
            columns: ["master_properties_id"]
            isOneToOne: false
            referencedRelation: "master_properties"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cancel_order: {
        Args: { p_notes?: string; p_order_id: string }
        Returns: {
          booking_code: string
          cancel_reason: string | null
          created_at: string
          expires_at: string
          guest_email: string | null
          guest_name: string | null
          guest_phone: string | null
          id: string
          status: string
          total_amount: number
          total_guest: number
          updated_at: string
          user_id: string | null
        }
        SetofOptions: {
          from: "*"
          to: "orders"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      check_in_order_item: {
        Args: { p_order_item_id: string }
        Returns: {
          cancel_reason: string | null
          cancelled_at: string | null
          cancelled_by: string | null
          check_in: string
          check_out: string
          checked_in_at: string | null
          checked_in_by: string | null
          checked_out_at: string | null
          checked_out_by: string | null
          guest_amount: number
          id: string
          order_id: string
          price_at_booking: number
          quantity: number
          status_item: string
          subtotal: number
          type_booking: string
          unit_id: string
        }
        SetofOptions: {
          from: "*"
          to: "order_items"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      check_out_order_item: {
        Args: { p_order_item_id: string }
        Returns: {
          cancel_reason: string | null
          cancelled_at: string | null
          cancelled_by: string | null
          check_in: string
          check_out: string
          checked_in_at: string | null
          checked_in_by: string | null
          checked_out_at: string | null
          checked_out_by: string | null
          guest_amount: number
          id: string
          order_id: string
          price_at_booking: number
          quantity: number
          status_item: string
          subtotal: number
          type_booking: string
          unit_id: string
        }
        SetofOptions: {
          from: "*"
          to: "order_items"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      complete_order: {
        Args: { p_notes?: string; p_order_id: string }
        Returns: {
          booking_code: string
          cancel_reason: string | null
          created_at: string
          expires_at: string
          guest_email: string | null
          guest_name: string | null
          guest_phone: string | null
          id: string
          status: string
          total_amount: number
          total_guest: number
          updated_at: string
          user_id: string | null
        }
        SetofOptions: {
          from: "*"
          to: "orders"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      create_booking: {
        Args: {
          p_addons?: Json
          p_booking_type: string
          p_check_in: string
          p_duration: number
          p_guest_email?: string
          p_guest_name?: string
          p_guest_phone?: string
          p_proof_url: string
          p_total_guest: number
          p_unit_id: string
          p_user_id?: string
        }
        Returns: {
          booking_code: string
          order_id: string
          total_amount: number
        }[]
      }
      current_role_id: { Args: never; Returns: number }
      generate_booking_code: { Args: never; Returns: string }
      get_available_units: {
        Args: {
          p_adult?: number
          p_check_in: string
          p_duration?: number
          p_property_id: string
          p_type_booking?: string
        }
        Returns: {
          base_price_per_night: number
          capacity: number
          descriptions: string
          floor: string
          id: string
          is_active: boolean
          is_transit_enabled: boolean
          master_properties_id: string
          name: string
          price_per_hour: number
          slug: string
        }[]
      }
      get_unit_property_id: { Args: { p_unit_id: string }; Returns: string }
      has_extended_permission: {
        Args: { p_permission_name: string }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
      is_assigned_to_property: {
        Args: { p_property_id: string }
        Returns: boolean
      }
      log_activity: {
        Args: {
          p_actor_id?: string
          p_actor_type: string
          p_entity_id?: string
          p_entity_type?: string
          p_event?: string
          p_metadata?: Json
        }
        Returns: undefined
      }
      reject_payment: {
        Args: { p_notes?: string; p_payment_id: string }
        Returns: {
          amount: number
          created_at: string
          destination_account_holder: string
          destination_account_number: string
          destination_bank_name: string
          id: string
          notes: string | null
          order_id: string
          proof_url: string | null
          status: string
          updated_at: string
          verified_at: string | null
          verified_by: string | null
        }
        SetofOptions: {
          from: "*"
          to: "payments"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      verify_payment: {
        Args: { p_notes?: string; p_payment_id: string }
        Returns: {
          amount: number
          created_at: string
          destination_account_holder: string
          destination_account_number: string
          destination_bank_name: string
          id: string
          notes: string | null
          order_id: string
          proof_url: string | null
          status: string
          updated_at: string
          verified_at: string | null
          verified_by: string | null
        }
        SetofOptions: {
          from: "*"
          to: "payments"
          isOneToOne: true
          isSetofReturn: false
        }
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const

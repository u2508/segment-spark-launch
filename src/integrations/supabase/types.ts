export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      audience: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          name: string | null
          tag: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string | null
          tag?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string | null
          tag?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      campaign_reports: {
        Row: {
          campaign_name: string | null
          created_at: string | null
          failed_count: number | null
          id: string
          sent_count: number | null
          user_id: string | null
        }
        Insert: {
          campaign_name?: string | null
          created_at?: string | null
          failed_count?: number | null
          id?: string
          sent_count?: number | null
          user_id?: string | null
        }
        Update: {
          campaign_name?: string | null
          created_at?: string | null
          failed_count?: number | null
          id?: string
          sent_count?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      campaigns: {
        Row: {
          audience: number
          createdat: string
          delivered: number
          description: string | null
          id: string
          name: string
          opened: number
          rules: Json | null
          status: string
        }
        Insert: {
          audience: number
          createdat?: string
          delivered?: number
          description?: string | null
          id?: string
          name: string
          opened?: number
          rules?: Json | null
          status: string
        }
        Update: {
          audience?: number
          createdat?: string
          delivered?: number
          description?: string | null
          id?: string
          name?: string
          opened?: number
          rules?: Json | null
          status?: string
        }
        Relationships: []
      }
      customers: {
        Row: {
          created_at: string
          email: string
          firstname: string
          id: string
          lastname: string | null
          lastpurchasedate: string | null
          location: string | null
          phone: string | null
          tags: string[] | null
          totalspent: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          firstname: string
          id?: string
          lastname?: string | null
          lastpurchasedate?: string | null
          location?: string | null
          phone?: string | null
          tags?: string[] | null
          totalspent?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          firstname?: string
          id?: string
          lastname?: string | null
          lastpurchasedate?: string | null
          location?: string | null
          phone?: string | null
          tags?: string[] | null
          totalspent?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          created_at: string
          customeremail: string
          id: string
          orderdate: string
          products: Json
          status: string
          totalamount: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          customeremail: string
          id?: string
          orderdate?: string
          products: Json
          status: string
          totalamount: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          customeremail?: string
          id?: string
          orderdate?: string
          products?: Json
          status?: string
          totalamount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_customeremail_fkey"
            columns: ["customeremail"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["email"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_total_spent: {
        Args: { p_email: string; p_amount: number }
        Returns: number
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

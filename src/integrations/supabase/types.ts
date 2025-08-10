export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      admin_logs: {
        Row: {
          action: string
          admin_id: string | null
          id: string
          table_name: string
          target_id: string
          timestamp: string | null
        }
        Insert: {
          action: string
          admin_id?: string | null
          id?: string
          table_name: string
          target_id: string
          timestamp?: string | null
        }
        Update: {
          action?: string
          admin_id?: string | null
          id?: string
          table_name?: string
          target_id?: string
          timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_logs_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_history: {
        Row: {
          cafe_id: string
          cafe_name: string
          check_in_time: string
          check_out_time: string | null
          created_at: string | null
          id: string
          status: string
          total_cost: number | null
          user_id: string
        }
        Insert: {
          cafe_id: string
          cafe_name: string
          check_in_time: string
          check_out_time?: string | null
          created_at?: string | null
          id?: string
          status: string
          total_cost?: number | null
          user_id: string
        }
        Update: {
          cafe_id?: string
          cafe_name?: string
          check_in_time?: string
          check_out_time?: string | null
          created_at?: string | null
          id?: string
          status?: string
          total_cost?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "booking_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      cafes: {
        Row: {
          address: string
          amenities: string[]
          created_at: string
          description: string
          id: string
          image_url: string
          lat: number
          lng: number
          occupancy: string
          price: string
          price_range: string
          rating: number
          tags: string[]
          title: string
        }
        Insert: {
          address: string
          amenities?: string[]
          created_at?: string
          description: string
          id: string
          image_url: string
          lat: number
          lng: number
          occupancy: string
          price?: string
          price_range: string
          rating: number
          tags: string[]
          title: string
        }
        Update: {
          address?: string
          amenities?: string[]
          created_at?: string
          description?: string
          id?: string
          image_url?: string
          lat?: number
          lng?: number
          occupancy?: string
          price?: string
          price_range?: string
          rating?: number
          tags?: string[]
          title?: string
        }
        Relationships: []
      }
      merchant_profiles: {
        Row: {
          business_description: string | null
          business_name: string
          contact_email: string
          contact_phone: string | null
          created_at: string | null
          id: string
          updated_at: string | null
          website: string | null
        }
        Insert: {
          business_description?: string | null
          business_name: string
          contact_email: string
          contact_phone?: string | null
          created_at?: string | null
          id: string
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          business_description?: string | null
          business_name?: string
          contact_email?: string
          contact_phone?: string | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "merchant_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          cafe_id: string | null
          content: string
          created_at: string | null
          id: string
          receiver_id: string
          sender_id: string
        }
        Insert: {
          cafe_id?: string | null
          content: string
          created_at?: string | null
          id?: string
          receiver_id: string
          sender_id: string
        }
        Update: {
          cafe_id?: string | null
          content?: string
          created_at?: string | null
          id?: string
          receiver_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      page_views: {
        Row: {
          id: string
          page_name: string
          referrer: string | null
          session_id: string | null
          timestamp: string | null
          visitor_id: string | null
        }
        Insert: {
          id?: string
          page_name: string
          referrer?: string | null
          session_id?: string | null
          timestamp?: string | null
          visitor_id?: string | null
        }
        Update: {
          id?: string
          page_name?: string
          referrer?: string | null
          session_id?: string | null
          timestamp?: string | null
          visitor_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          account_type: Database["public"]["Enums"]["account_type"] | null
          avatar_url: string | null
          email: string | null
          full_name: string | null
          id: string
          payment_method: string | null
          updated_at: string | null
          verification_status:
            | Database["public"]["Enums"]["verification_status"]
            | null
        }
        Insert: {
          account_type?: Database["public"]["Enums"]["account_type"] | null
          avatar_url?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          payment_method?: string | null
          updated_at?: string | null
          verification_status?:
            | Database["public"]["Enums"]["verification_status"]
            | null
        }
        Update: {
          account_type?: Database["public"]["Enums"]["account_type"] | null
          avatar_url?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          payment_method?: string | null
          updated_at?: string | null
          verification_status?:
            | Database["public"]["Enums"]["verification_status"]
            | null
        }
        Relationships: []
      }
      promotions: {
        Row: {
          active: boolean | null
          cafe_id: string | null
          created_at: string | null
          description: string | null
          discount_percentage: number | null
          end_time: string
          id: string
          merchant_id: string | null
          start_time: string
          title: string
        }
        Insert: {
          active?: boolean | null
          cafe_id?: string | null
          created_at?: string | null
          description?: string | null
          discount_percentage?: number | null
          end_time: string
          id?: string
          merchant_id?: string | null
          start_time: string
          title: string
        }
        Update: {
          active?: boolean | null
          cafe_id?: string | null
          created_at?: string | null
          description?: string | null
          discount_percentage?: number | null
          end_time?: string
          id?: string
          merchant_id?: string | null
          start_time?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "promotions_cafe_id_fkey"
            columns: ["cafe_id"]
            isOneToOne: false
            referencedRelation: "cafes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promotions_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchant_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      review_responses: {
        Row: {
          created_at: string | null
          id: string
          merchant_id: string | null
          response: string
          review_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          merchant_id?: string | null
          response: string
          review_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          merchant_id?: string | null
          response?: string
          review_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "review_responses_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchant_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_responses_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          cafe_id: string
          comment: string | null
          created_at: string | null
          id: string
          rating: number
          user_id: string
        }
        Insert: {
          cafe_id: string
          comment?: string | null
          created_at?: string | null
          id?: string
          rating: number
          user_id: string
        }
        Update: {
          cafe_id?: string
          comment?: string | null
          created_at?: string | null
          id?: string
          rating?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_cafes: {
        Row: {
          cafe_id: string
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          cafe_id: string
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          cafe_id?: string
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_cafes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_demo_accounts: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      deactivate_expired_promotions: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_secret: {
        Args: { secret_name: string }
        Returns: Json
      }
    }
    Enums: {
      account_type: "user" | "merchant" | "admin"
      verification_status: "pending" | "approved" | "rejected"
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
  public: {
    Enums: {
      account_type: ["user", "merchant", "admin"],
      verification_status: ["pending", "approved", "rejected"],
    },
  },
} as const

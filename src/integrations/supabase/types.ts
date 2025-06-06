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
      tts_api_configs: {
        Row: {
          api_key_name: string
          created_at: string
          id: string
          is_active: boolean
          monthly_quota: number
          priority: number
          provider: Database["public"]["Enums"]["tts_provider"]
          updated_at: string
        }
        Insert: {
          api_key_name: string
          created_at?: string
          id?: string
          is_active?: boolean
          monthly_quota?: number
          priority?: number
          provider: Database["public"]["Enums"]["tts_provider"]
          updated_at?: string
        }
        Update: {
          api_key_name?: string
          created_at?: string
          id?: string
          is_active?: boolean
          monthly_quota?: number
          priority?: number
          provider?: Database["public"]["Enums"]["tts_provider"]
          updated_at?: string
        }
        Relationships: []
      }
      tts_cache: {
        Row: {
          audio_url: string
          created_at: string
          expires_at: string
          id: string
          provider: Database["public"]["Enums"]["tts_provider"]
          text_hash: string
          text_input: string
          voice_id: string | null
        }
        Insert: {
          audio_url: string
          created_at?: string
          expires_at?: string
          id?: string
          provider: Database["public"]["Enums"]["tts_provider"]
          text_hash: string
          text_input: string
          voice_id?: string | null
        }
        Update: {
          audio_url?: string
          created_at?: string
          expires_at?: string
          id?: string
          provider?: Database["public"]["Enums"]["tts_provider"]
          text_hash?: string
          text_input?: string
          voice_id?: string | null
        }
        Relationships: []
      }
      tts_history: {
        Row: {
          audio_url: string | null
          created_at: string
          id: string
          provider: string
          text_input: string
          user_id: string | null
          voice: string
        }
        Insert: {
          audio_url?: string | null
          created_at?: string
          id?: string
          provider: string
          text_input: string
          user_id?: string | null
          voice: string
        }
        Update: {
          audio_url?: string | null
          created_at?: string
          id?: string
          provider?: string
          text_input?: string
          user_id?: string | null
          voice?: string
        }
        Relationships: [
          {
            foreignKeyName: "tts_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tts_usage_tracking: {
        Row: {
          characters_used: number
          created_at: string
          id: string
          month_year: string
          provider: Database["public"]["Enums"]["tts_provider"]
          requests_count: number
          updated_at: string
        }
        Insert: {
          characters_used?: number
          created_at?: string
          id?: string
          month_year: string
          provider: Database["public"]["Enums"]["tts_provider"]
          requests_count?: number
          updated_at?: string
        }
        Update: {
          characters_used?: number
          created_at?: string
          id?: string
          month_year?: string
          provider?: Database["public"]["Enums"]["tts_provider"]
          requests_count?: number
          updated_at?: string
        }
        Relationships: []
      }
      user_api_keys: {
        Row: {
          api_key: string
          created_at: string
          id: string
          is_active: boolean
          is_valid: boolean
          provider: string
          quota_limit: number | null
          quota_used: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          api_key: string
          created_at?: string
          id?: string
          is_active?: boolean
          is_valid?: boolean
          provider: string
          quota_limit?: number | null
          quota_used?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          api_key?: string
          created_at?: string
          id?: string
          is_active?: boolean
          is_valid?: boolean
          provider?: string
          quota_limit?: number | null
          quota_used?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          created_at: string
          credits: number
          email: string
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          credits?: number
          email: string
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          credits?: number
          email?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_tts_history: {
        Row: {
          audio_url: string | null
          characters_count: number
          created_at: string
          id: string
          provider_used: Database["public"]["Enums"]["tts_provider"]
          text_input: string
          user_id: string | null
          voice_id: string | null
          voice_type: Database["public"]["Enums"]["voice_type"] | null
        }
        Insert: {
          audio_url?: string | null
          characters_count: number
          created_at?: string
          id?: string
          provider_used: Database["public"]["Enums"]["tts_provider"]
          text_input: string
          user_id?: string | null
          voice_id?: string | null
          voice_type?: Database["public"]["Enums"]["voice_type"] | null
        }
        Update: {
          audio_url?: string | null
          characters_count?: number
          created_at?: string
          id?: string
          provider_used?: Database["public"]["Enums"]["tts_provider"]
          text_input?: string
          user_id?: string | null
          voice_id?: string | null
          voice_type?: Database["public"]["Enums"]["voice_type"] | null
        }
        Relationships: []
      }
      user_voices: {
        Row: {
          clone_audio_url: string | null
          created_at: string
          gender: string | null
          id: string
          is_cloned: boolean
          language: string | null
          provider: string
          user_id: string
          voice_id: string
          voice_name: string
        }
        Insert: {
          clone_audio_url?: string | null
          created_at?: string
          gender?: string | null
          id?: string
          is_cloned?: boolean
          language?: string | null
          provider: string
          user_id: string
          voice_id: string
          voice_name: string
        }
        Update: {
          clone_audio_url?: string | null
          created_at?: string
          gender?: string | null
          id?: string
          is_cloned?: boolean
          language?: string | null
          provider?: string
          user_id?: string
          voice_id?: string
          voice_name?: string
        }
        Relationships: []
      }
      voice_clones: {
        Row: {
          audio_file_url: string
          created_at: string
          description: string | null
          id: string
          name: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          audio_file_url: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          audio_file_url?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      tts_provider:
        | "elevenlabs"
        | "openai"
        | "azure"
        | "google"
        | "amazon_polly"
        | "coqui"
      voice_type: "male" | "female" | "neutral" | "robotic" | "emotional"
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
    Enums: {
      tts_provider: [
        "elevenlabs",
        "openai",
        "azure",
        "google",
        "amazon_polly",
        "coqui",
      ],
      voice_type: ["male", "female", "neutral", "robotic", "emotional"],
    },
  },
} as const

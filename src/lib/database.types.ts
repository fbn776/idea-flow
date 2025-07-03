export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      ideas: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string
          category: string
          priority: string
          status: string
          tags: string[]
          reminder_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string
          category?: string
          priority?: string
          status?: string
          tags?: string[]
          reminder_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string
          category?: string
          priority?: string
          status?: string
          tags?: string[]
          reminder_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      idea_resources: {
        Row: {
          id: string
          idea_id: string
          type: string
          title: string
          url: string | null
          content: string | null
          created_at: string
        }
        Insert: {
          id?: string
          idea_id: string
          type?: string
          title: string
          url?: string | null
          content?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          idea_id?: string
          type?: string
          title?: string
          url?: string | null
          content?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
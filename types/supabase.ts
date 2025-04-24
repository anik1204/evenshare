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
      profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      groups: {
        Row: {
          id: string
          name: string
          description: string | null
          image_url: string | null
          currency: string
          created_at: string
          created_by: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          image_url?: string | null
          currency?: string
          created_at?: string
          created_by: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          image_url?: string | null
          currency?: string
          created_at?: string
          created_by?: string
          updated_at?: string
        }
      }
      group_members: {
        Row: {
          group_id: string
          user_id: string
          role: string
          joined_at: string
        }
        Insert: {
          group_id: string
          user_id: string
          role?: string
          joined_at?: string
        }
        Update: {
          group_id?: string
          user_id?: string
          role?: string
          joined_at?: string
        }
      }
      expenses: {
        Row: {
          id: string
          description: string
          amount: number
          category: string | null
          date: string
          group_id: string
          paid_by: string
          split_method: string
          receipt_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          description: string
          amount: number
          category?: string | null
          date?: string
          group_id: string
          paid_by: string
          split_method?: string
          receipt_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          description?: string
          amount?: number
          category?: string | null
          date?: string
          group_id?: string
          paid_by?: string
          split_method?: string
          receipt_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      expense_shares: {
        Row: {
          expense_id: string
          user_id: string
          amount: number
          paid: boolean
          paid_at: string | null
          reminder_sent: string | null
        }
        Insert: {
          expense_id: string
          user_id: string
          amount: number
          paid?: boolean
          paid_at?: string | null
          reminder_sent?: string | null
        }
        Update: {
          expense_id?: string
          user_id?: string
          amount?: number
          paid?: boolean
          paid_at?: string | null
          reminder_sent?: string | null
        }
      }
      expense_reactions: {
        Row: {
          id: string
          expense_id: string
          user_id: string
          emoji: string
          created_at: string
        }
        Insert: {
          id?: string
          expense_id: string
          user_id: string
          emoji: string
          created_at?: string
        }
        Update: {
          id?: string
          expense_id?: string
          user_id?: string
          emoji?: string
          created_at?: string
        }
      }
      settlements: {
        Row: {
          id: string
          from_user_id: string
          to_user_id: string
          group_id: string
          amount: number
          status: string
          payment_method: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          from_user_id: string
          to_user_id: string
          group_id: string
          amount: number
          status?: string
          payment_method?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          from_user_id?: string
          to_user_id?: string
          group_id?: string
          amount?: number
          status?: string
          payment_method?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
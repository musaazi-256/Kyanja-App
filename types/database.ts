// Auto-generated types from Supabase schema.
// Regenerate with: npx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/database.ts

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
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: Database['public']['Enums']['user_role']
          avatar_url: string | null
          is_active: boolean
          last_login_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          role?: Database['public']['Enums']['user_role']
          avatar_url?: string | null
          is_active?: boolean
          last_login_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: Database['public']['Enums']['user_role']
          avatar_url?: string | null
          is_active?: boolean
          last_login_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          key:        string
          value:      string
          updated_at: string
        }
        Insert: {
          key:         string
          value?:      string
          updated_at?: string
        }
        Update: {
          key?:        string
          value?:      string
          updated_at?: string
        }
        Relationships: []
      }
      applications: {
        Row: {
          id: string
          student_first_name: string
          student_last_name: string
          date_of_birth: string
          gender: string | null
          nationality: string | null
          applying_for_class: string
          academic_year: string
          parent_name: string
          parent_email: string
          parent_phone: string
          parent_relationship: string
          address: string | null
          previous_school: string | null
          special_needs: string | null
          notes: string | null
          status: Database['public']['Enums']['application_status']
          source: string
          import_batch_id: string | null
          processed_by: string | null
          processed_at: string | null
          created_by: string | null
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          student_first_name: string
          student_last_name: string
          date_of_birth: string
          gender?: string | null
          nationality?: string | null
          applying_for_class: string
          academic_year: string
          parent_name: string
          parent_email: string
          parent_phone: string
          parent_relationship: string
          address?: string | null
          previous_school?: string | null
          special_needs?: string | null
          notes?: string | null
          status?: Database['public']['Enums']['application_status']
          source?: string
          import_batch_id?: string | null
          processed_by?: string | null
          processed_at?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          student_first_name?: string
          student_last_name?: string
          date_of_birth?: string
          gender?: string | null
          nationality?: string | null
          applying_for_class?: string
          academic_year?: string
          parent_name?: string
          parent_email?: string
          parent_phone?: string
          parent_relationship?: string
          address?: string | null
          previous_school?: string | null
          special_needs?: string | null
          notes?: string | null
          status?: Database['public']['Enums']['application_status']
          source?: string
          import_batch_id?: string | null
          processed_by?: string | null
          processed_at?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Relationships: [
          { foreignKeyName: 'applications_processed_by_fkey'; columns: ['processed_by']; referencedRelation: 'profiles'; referencedColumns: ['id'] },
          { foreignKeyName: 'applications_created_by_fkey'; columns: ['created_by']; referencedRelation: 'profiles'; referencedColumns: ['id'] },
        ]
      }
      application_status_history: {
        Row: {
          id: string
          application_id: string
          from_status: Database['public']['Enums']['application_status'] | null
          to_status: Database['public']['Enums']['application_status']
          changed_by: string | null
          note: string | null
          email_sent: boolean
          email_sent_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          application_id: string
          from_status?: Database['public']['Enums']['application_status'] | null
          to_status: Database['public']['Enums']['application_status']
          changed_by?: string | null
          note?: string | null
          email_sent?: boolean
          email_sent_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          application_id?: string
          from_status?: Database['public']['Enums']['application_status'] | null
          to_status?: Database['public']['Enums']['application_status']
          changed_by?: string | null
          note?: string | null
          email_sent?: boolean
          email_sent_at?: string | null
          created_at?: string
        }
        Relationships: [
          { foreignKeyName: 'application_status_history_application_id_fkey'; columns: ['application_id']; referencedRelation: 'applications'; referencedColumns: ['id'] },
        ]
      }
      csv_import_batches: {
        Row: {
          id: string
          file_name: string
          total_rows: number
          success_count: number
          error_count: number
          status: string
          errors: Json | null
          uploaded_by: string
          created_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          file_name: string
          total_rows?: number
          success_count?: number
          error_count?: number
          status?: string
          errors?: Json | null
          uploaded_by: string
          created_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          file_name?: string
          total_rows?: number
          success_count?: number
          error_count?: number
          status?: string
          errors?: Json | null
          uploaded_by?: string
          created_at?: string
          completed_at?: string | null
        }
        Relationships: [
          { foreignKeyName: 'csv_import_batches_uploaded_by_fkey'; columns: ['uploaded_by']; referencedRelation: 'profiles'; referencedColumns: ['id'] },
        ]
      }
      newsletter_subscribers: {
        Row: {
          id: string
          email: string
          full_name: string | null
          unsubscribe_token: string
          is_active: boolean
          subscribed_at: string
          unsubscribed_at: string | null
          source: string | null
        }
        Insert: {
          id?: string
          email: string
          full_name?: string | null
          unsubscribe_token?: string
          is_active?: boolean
          subscribed_at?: string
          unsubscribed_at?: string | null
          source?: string | null
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          unsubscribe_token?: string
          is_active?: boolean
          subscribed_at?: string
          unsubscribed_at?: string | null
          source?: string | null
        }
        Relationships: []
      }
      newsletters: {
        Row: {
          id: string
          subject: string
          body_html: string
          body_text: string | null
          status: Database['public']['Enums']['send_status']
          recipient_count: number
          sent_count: number
          failed_count: number
          scheduled_for: string | null
          sent_at: string | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          subject: string
          body_html: string
          body_text?: string | null
          status?: Database['public']['Enums']['send_status']
          recipient_count?: number
          sent_count?: number
          failed_count?: number
          scheduled_for?: string | null
          sent_at?: string | null
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          subject?: string
          body_html?: string
          body_text?: string | null
          status?: Database['public']['Enums']['send_status']
          recipient_count?: number
          sent_count?: number
          failed_count?: number
          scheduled_for?: string | null
          sent_at?: string | null
          created_by?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          { foreignKeyName: 'newsletters_created_by_fkey'; columns: ['created_by']; referencedRelation: 'profiles'; referencedColumns: ['id'] },
        ]
      }
      newsletter_sends: {
        Row: {
          id: string
          newsletter_id: string
          subscriber_id: string
          status: string
          sent_at: string | null
          failed_at: string | null
          error_message: string | null
          retry_count: number
          provider_msg_id: string | null
        }
        Insert: {
          id?: string
          newsletter_id: string
          subscriber_id: string
          status?: string
          sent_at?: string | null
          failed_at?: string | null
          error_message?: string | null
          retry_count?: number
          provider_msg_id?: string | null
        }
        Update: {
          id?: string
          newsletter_id?: string
          subscriber_id?: string
          status?: string
          sent_at?: string | null
          failed_at?: string | null
          error_message?: string | null
          retry_count?: number
          provider_msg_id?: string | null
        }
        Relationships: [
          { foreignKeyName: 'newsletter_sends_newsletter_id_fkey'; columns: ['newsletter_id']; referencedRelation: 'newsletters'; referencedColumns: ['id'] },
          { foreignKeyName: 'newsletter_sends_subscriber_id_fkey'; columns: ['subscriber_id']; referencedRelation: 'newsletter_subscribers'; referencedColumns: ['id'] },
        ]
      }
      media_files: {
        Row: {
          id: string
          bucket: string
          storage_path: string
          public_url: string | null
          file_name: string
          file_size: number | null
          mime_type: string | null
          width: number | null
          height: number | null
          context: Database['public']['Enums']['media_context'] | null
          alt_text: string | null
          caption: string | null
          tags: string[]
          sort_order: number
          uploaded_by: string
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          bucket: string
          storage_path: string
          public_url?: string | null
          file_name: string
          file_size?: number | null
          mime_type?: string | null
          width?: number | null
          height?: number | null
          context?: Database['public']['Enums']['media_context'] | null
          alt_text?: string | null
          caption?: string | null
          tags?: string[]
          sort_order?: number
          uploaded_by: string
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          bucket?: string
          storage_path?: string
          public_url?: string | null
          file_name?: string
          file_size?: number | null
          mime_type?: string | null
          width?: number | null
          height?: number | null
          context?: Database['public']['Enums']['media_context'] | null
          alt_text?: string | null
          caption?: string | null
          tags?: string[]
          sort_order?: number
          uploaded_by?: string
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Relationships: [
          { foreignKeyName: 'media_files_uploaded_by_fkey'; columns: ['uploaded_by']; referencedRelation: 'profiles'; referencedColumns: ['id'] },
        ]
      }
      permissions: {
        Row: { id: string; key: string; description: string | null; created_at: string }
        Insert: { id?: string; key: string; description?: string | null; created_at?: string }
        Update: { id?: string; key?: string; description?: string | null; created_at?: string }
        Relationships: []
      }
      role_permissions: {
        Row: { role: Database['public']['Enums']['user_role']; permission: string }
        Insert: { role: Database['public']['Enums']['user_role']; permission: string }
        Update: { role?: Database['public']['Enums']['user_role']; permission?: string }
        Relationships: []
      }
      students: {
        Row: {
          id: string; application_id: string | null; profile_id: string | null
          student_number: string | null; class_id: string | null; enrollment_date: string | null
          is_active: boolean; created_at: string; updated_at: string
        }
        Insert: {
          id?: string; application_id?: string | null; profile_id?: string | null
          student_number?: string | null; class_id?: string | null; enrollment_date?: string | null
          is_active?: boolean; created_at?: string; updated_at?: string
        }
        Update: {
          id?: string; application_id?: string | null; profile_id?: string | null
          student_number?: string | null; class_id?: string | null; enrollment_date?: string | null
          is_active?: boolean; created_at?: string; updated_at?: string
        }
        Relationships: []
      }
      staff_members: {
        Row: { id: string; profile_id: string; employee_number: string | null; department: string | null; position: string | null; hire_date: string | null; created_at: string }
        Insert: { id?: string; profile_id: string; employee_number?: string | null; department?: string | null; position?: string | null; hire_date?: string | null; created_at?: string }
        Update: { id?: string; profile_id?: string; employee_number?: string | null; department?: string | null; position?: string | null; hire_date?: string | null; created_at?: string }
        Relationships: []
      }
      classes: {
        Row: { id: string; name: string; level: string; academic_year: string; teacher_id: string | null; capacity: number | null; created_at: string }
        Insert: { id?: string; name: string; level: string; academic_year: string; teacher_id?: string | null; capacity?: number | null; created_at?: string }
        Update: { id?: string; name?: string; level?: string; academic_year?: string; teacher_id?: string | null; capacity?: number | null; created_at?: string }
        Relationships: []
      }
      payments: {
        Row: { id: string; student_id: string; amount: number; currency: string; purpose: string | null; term: string | null; status: string; paid_at: string | null; created_at: string }
        Insert: { id?: string; student_id: string; amount: number; currency?: string; purpose?: string | null; term?: string | null; status?: string; paid_at?: string | null; created_at?: string }
        Update: { id?: string; student_id?: string; amount?: number; currency?: string; purpose?: string | null; term?: string | null; status?: string; paid_at?: string | null; created_at?: string }
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
      application_status:
        | 'draft'
        | 'submitted'
        | 'under_review'
        | 'accepted'
        | 'declined'
        | 'waitlisted'
        | 'withdrawn'
      user_role: 'admin' | 'staff' | 'teacher' | 'parent' | 'student'
      send_status: 'draft' | 'queued' | 'sending' | 'sent' | 'failed'
      media_context: 'gallery' | 'admissions' | 'news' | 'page_content' | 'profile'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']

export type TablesInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert']

export type TablesUpdate<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update']

export type Enums<T extends keyof Database['public']['Enums']> =
  Database['public']['Enums'][T]

// TODO: Generate ulang file ini dengan Supabase CLI setelah membuat skema database
// Jalankan: supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.ts

export interface Database {
  public: {
    Tables: {
      applications: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          full_name: string;
          email: string;
          phone: string;
          birth_date: string;
          motivation: string;
          previous_volunteer_experience: string;
          primary_competency: string;
          secondary_competency: string | null;
          leadership_style: number;
          collaboration_preference: number;
          problem_solving_approach: number;
          communication_style: number;
          learning_orientation: number;
          stress_management: number;
          innovation_mindset: number;
          empathy_level: number;
          case_study_responses: any;
          portfolio_path: string | null;
          cv_path: string | null;
          status: 'new' | 'reviewed' | 'interview' | 'accepted' | 'rejected';
          stage: 1 | 2;
          flagged: boolean;
          admin_notes: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          full_name: string;
          email: string;
          phone: string;
          birth_date: string;
          motivation: string;
          previous_volunteer_experience?: string;
          primary_competency: string;
          secondary_competency?: string | null;
          leadership_style?: number;
          collaboration_preference?: number;
          problem_solving_approach?: number;
          communication_style?: number;
          learning_orientation?: number;
          stress_management?: number;
          innovation_mindset?: number;
          empathy_level?: number;
          case_study_responses?: any;
          portfolio_path?: string | null;
          cv_path?: string | null;
          status?: 'new' | 'reviewed' | 'interview' | 'accepted' | 'rejected';
          stage?: 1 | 2;
          flagged?: boolean;
          admin_notes?: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          full_name?: string;
          email?: string;
          phone?: string;
          birth_date?: string;
          motivation?: string;
          previous_volunteer_experience?: string;
          primary_competency?: string;
          secondary_competency?: string | null;
          leadership_style?: number;
          collaboration_preference?: number;
          problem_solving_approach?: number;
          communication_style?: number;
          learning_orientation?: number;
          stress_management?: number;
          innovation_mindset?: number;
          empathy_level?: number;
          case_study_responses?: any;
          portfolio_path?: string | null;
          cv_path?: string | null;
          status?: 'new' | 'reviewed' | 'interview' | 'accepted' | 'rejected';
          stage?: 1 | 2;
          flagged?: boolean;
          admin_notes?: string;
        };
      };
      case_studies: {
        Row: {
          id: string;
          created_at: string;
          title: string;
          description: string;
          competency: string;
          scenario: string;
          questions: any;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          created_at?: string;
          title: string;
          description: string;
          competency: string;
          scenario: string;
          questions?: any;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          created_at?: string;
          title?: string;
          description?: string;
          competency?: string;
          scenario?: string;
          questions?: any;
          is_active?: boolean;
        };
      };
    };
  };
}
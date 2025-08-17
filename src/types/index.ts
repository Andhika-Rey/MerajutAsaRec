export interface Application {
  id?: string;
  created_at?: string;
  updated_at?: string;
  
  // Data Pribadi
  full_name: string;
  email: string;
  phone: string;
  birth_date: string;
  
  // Motivasi dan Komitmen
  motivation: string;
  previous_volunteer_experience: string;
  
  // Pilihan Kompetensi
  primary_competency: string;
  secondary_competency?: string;
  
  // Assessment Responses
  leadership_style: number;
  collaboration_preference: number;
  problem_solving_approach: number;
  communication_style: number;
  learning_orientation: number;
  stress_management: number;
  innovation_mindset: number;
  empathy_level: number;
  
  // Tahap 2 - Studi Kasus
  case_study_responses?: {
    case_id: string;
    response: string;
  }[];
  
  // Portfolio
  portfolio_path?: string;
  cv_path?: string;
  
  // Status
  status: 'new' | 'reviewed' | 'interview' | 'accepted' | 'rejected';
  stage: 1 | 2; // Tahap proses
  flagged?: boolean;
  admin_notes?: string;
}

export interface CaseStudy {
  id: string;
  created_at?: string;
  title: string;
  description: string;
  competency: string;
  scenario: string;
  questions: string[];
  is_active?: boolean;
}

export const COMPETENCIES = [
  'Digital Transformation Area',
  'Human Development Area',
  'Process & Optimization Area',
  'Brand & Communication Area',
  'Insight & Impact Area',
  'Compliance & Governance Area'
] as const;

export type Competency = typeof COMPETENCIES[number];
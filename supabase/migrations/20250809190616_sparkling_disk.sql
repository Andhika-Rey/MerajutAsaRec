/*
  # Skema Database Awal untuk Merajut Asa

  1. Tabel Baru
    - `applications`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - Data pribadi: `full_name`, `email`, `phone`, `birth_date`
      - Motivasi: `motivation`, `previous_volunteer_experience`
      - Kompetensi: `primary_competency`, `secondary_competency`
      - Assessment: berbagai field untuk penilaian
      - File: `portfolio_path`, `cv_path`
      - Status: `status`, `stage`, `flagged`, `admin_notes`
    
    - `case_studies`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `title`, `description`, `competency`, `scenario`
      - `questions` (jsonb)
      - `is_active` (boolean)

  2. Storage Buckets
    - `portfolios` - untuk file portfolio
    - `cvs` - untuk file CV

  3. Security
    - Enable RLS pada semua tabel
    - Policy untuk anonymous insert pada applications
    - Policy untuk admin access
    - Policy untuk file upload
*/

-- Buat tabel applications
CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Data Pribadi
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  birth_date date NOT NULL,
  
  -- Motivasi dan Komitmen
  motivation text NOT NULL,
  previous_volunteer_experience text DEFAULT '',
  
  -- Pilihan Kompetensi
  primary_competency text NOT NULL,
  secondary_competency text,
  
  -- Assessment Responses
  leadership_style integer DEFAULT 0,
  collaboration_preference integer DEFAULT 0,
  problem_solving_approach integer DEFAULT 0,
  communication_style integer DEFAULT 0,
  learning_orientation integer DEFAULT 0,
  stress_management integer DEFAULT 0,
  innovation_mindset integer DEFAULT 0,
  empathy_level integer DEFAULT 0,
  
  -- Tahap 2 - Studi Kasus
  case_study_responses jsonb,
  
  -- Portfolio
  portfolio_path text,
  cv_path text,
  
  -- Status
  status text DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'interview', 'accepted', 'rejected')),
  stage integer DEFAULT 1 CHECK (stage IN (1, 2)),
  flagged boolean DEFAULT false,
  admin_notes text DEFAULT ''
);

-- Buat tabel case_studies
CREATE TABLE IF NOT EXISTS case_studies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  title text NOT NULL,
  description text NOT NULL,
  competency text NOT NULL,
  scenario text NOT NULL,
  questions jsonb DEFAULT '[]'::jsonb,
  is_active boolean DEFAULT true
);

-- Buat trigger untuk updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_applications_updated_at 
    BEFORE UPDATE ON applications 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_studies ENABLE ROW LEVEL SECURITY;

-- Policies untuk applications
CREATE POLICY "Allow anonymous insert applications"
ON applications FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to read own applications"
ON applications FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow service role full access to applications"
ON applications FOR ALL
TO service_role
WITH CHECK (true);

-- Policies untuk case_studies
CREATE POLICY "Allow anonymous read active case studies"
ON case_studies FOR SELECT
TO anon
USING (is_active = true);

CREATE POLICY "Allow service role full access to case_studies"
ON case_studies FOR ALL
TO service_role
WITH CHECK (true);

-- Buat storage buckets
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('portfolios', 'portfolios', false),
  ('cvs', 'cvs', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Allow anonymous upload to portfolios"
ON storage.objects FOR INSERT
TO anon
WITH CHECK (bucket_id = 'portfolios');

CREATE POLICY "Allow anonymous upload to cvs"
ON storage.objects FOR INSERT
TO anon
WITH CHECK (bucket_id = 'cvs');

CREATE POLICY "Allow service role full access to storage"
ON storage.objects FOR ALL
TO service_role
WITH CHECK (true);

-- Insert sample case studies
INSERT INTO case_studies (title, description, competency, scenario, questions) VALUES
(
  'Transformasi Digital Panti Asuhan',
  'Studi kasus tentang implementasi sistem digital di panti asuhan',
  'Digital Transformation Area',
  'Sebuah panti asuhan dengan 50 anak memiliki sistem administrasi manual yang tidak efisien. Mereka kesulitan melacak data anak, donasi, dan kegiatan harian.',
  '["Bagaimana Anda akan merancang roadmap transformasi digital untuk panti asuhan ini?", "Teknologi apa yang akan Anda prioritaskan dan mengapa?", "Bagaimana Anda memastikan adopsi teknologi oleh pengurus panti?"]'::jsonb
),
(
  'Program Pengembangan Soft Skills',
  'Merancang program pengembangan kemampuan interpersonal untuk anak panti',
  'Human Development Area',
  'Anak-anak di panti asuhan usia 15-18 tahun akan segera mandiri, namun mereka kurang percaya diri dan kemampuan komunikasi yang terbatas.',
  '["Bagaimana Anda merancang program pengembangan soft skills yang efektif?", "Metode apa yang akan Anda gunakan untuk mengukur progress mereka?", "Bagaimana Anda mengatasi resistensi atau ketidakpercayaan diri anak-anak?"]'::jsonb
);
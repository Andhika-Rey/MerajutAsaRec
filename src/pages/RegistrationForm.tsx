import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, User, Heart, Clock, Users, Upload, FileText, AlertCircle, BookOpen } from 'lucide-react';
import Layout from '../components/Layout';
import ProgressBar from '../components/ProgressBar';
import CompetencyCard, { getCompetencyIcon } from '../components/CompetencyCard';
import { COMPETENCIES, type Application, type CaseStudy } from '../types';
import { supabase } from '../lib/supabase';
import { createApplication, uploadFile, getActiveCaseStudies } from '../utils/supabaseHelpers';

const competencyDescriptions = {
  'Digital Transformation Area': 'Memimpin transformasi digital organisasi dengan teknologi terdepan untuk meningkatkan efisiensi dan jangkauan program.',
  'Human Development Area': 'Mengembangkan kapasitas SDM dan membangun budaya organisasi yang kuat untuk pertumbuhan berkelanjutan.',
  'Process & Optimization Area': 'Merancang dan mengoptimalkan proses operasional untuk memaksimalkan dampak setiap program yang dijalankan.',
  'Brand & Communication Area': 'Membangun brand awareness dan strategi komunikasi yang efektif untuk memperluas jangkauan misi organisasi.',
  'Insight & Impact Area': 'Menganalisis data dan mengukur dampak program untuk pengambilan keputusan yang berbasis bukti.',
  'Compliance & Governance Area': 'Memastikan tata kelola yang baik dan kepatuhan terhadap regulasi untuk keberlanjutan organisasi.'
};

export default function RegistrationForm() {
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [portfolioFile, setPortfolioFile] = useState<File | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [caseStudyResponses, setCaseStudyResponses] = useState<{[key: string]: string}>({});
  const [formData, setFormData] = useState<Partial<Application>>({
    status: 'new',
    stage: 2,
    previous_volunteer_experience: '',
    leadership_style: 0,
    collaboration_preference: 0,
    problem_solving_approach: 0,
    communication_style: 0,
    learning_orientation: 0,
    stress_management: 0,
    innovation_mindset: 0,
    empathy_level: 0
  });

  const totalSections = 6;

  React.useEffect(() => {
    fetchCaseStudies();
  }, []);

  const fetchCaseStudies = async () => {
    try {
      const studies = await getActiveCaseStudies();
      setCaseStudies(studies);
    } catch (error) {
      console.error('Error fetching case studies:', error);
    }
  };

  const getFileRequirements = (competency: string) => {
    const requirements = {
      portfolioRequired: competency === 'Brand & Communication Area',
      cvRequired: ['Human Development Area', 'Digital Transformation Area'].includes(competency),
      portfolioOptional: !['Brand & Communication Area', 'Human Development Area', 'Digital Transformation Area'].includes(competency)
    };
    return requirements;
  };

  const handleInputChange = (field: keyof Application, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, type: 'portfolio' | 'cv') => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (file.type !== 'application/pdf') {
      alert('Hanya file PDF yang diperbolehkan');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file maksimal 5MB');
      return;
    }

    if (type === 'portfolio') {
      setPortfolioFile(file);
    } else {
      setCvFile(file);
    }
  };

  const uploadFile = async (file: File, bucket: string, applicationId: string, type: string): Promise<string | null> => {
    try {
      const fileExt = 'pdf';
      const fileName = `${applicationId}-${type}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          onUploadProgress: (progress) => {
            setUploadProgress((progress.loaded / progress.total) * 100);
          }
        });

      if (uploadError) throw uploadError;
      return filePath;
    } catch (error) {
      console.error(`Error uploading ${type}:`, error);
      return null;
    }
  };

  const validateCurrentSection = () => {
    switch (currentSection) {
      case 1: // Personal Data
        return !!(formData.full_name && formData.email && formData.phone && formData.birth_date);
      case 2: // Motivation
        return !!(formData.motivation && formData.motivation.trim().length >= 50);
      case 3: // Competency
        return !!formData.primary_competency;
      case 4: // Assessment
        return !!(formData.leadership_style && formData.problem_solving_approach && formData.communication_style);
      case 5: // File Upload
        const requirements = getFileRequirements(formData.primary_competency || '');
        if (requirements.portfolioRequired && !portfolioFile) return false;
        if (requirements.cvRequired && !cvFile) return false;
        return true;
      case 6: // Case Study
        const relevantCaseStudies = caseStudies.filter(cs => 
          cs.competency === formData.primary_competency || cs.competency === 'General'
        );
        return relevantCaseStudies.every(cs => 
          caseStudyResponses[cs.id] && caseStudyResponses[cs.id].trim().length >= 100
        );
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    if (!validateCurrentSection()) {
      alert('Mohon lengkapi semua field yang diperlukan');
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('Memulai proses pengiriman...');

      // Kita tidak insert data dulu. Kita siapkan variabel untuk path file.
      let portfolioPath: string | null = null;
      let cvPath: string | null = null;
      
      // TEMPORARY ID untuk penamaan file. Kita pakai timestamp sederhana.
      const tempId = Date.now();

      // Langkah 1: Unggah file terlebih dahulu jika ada
      if (portfolioFile) {
        console.log('Mengunggah portfolio...');
        // Kita panggil fungsi uploadFile yang sudah Anda buat.
        // Kita modifikasi sedikit penamaannya agar unik.
        const filePath = `public/${tempId}-${portfolioFile.name}`;
        const { error: uploadError } = await supabase.storage.from('portfolios').upload(filePath, portfolioFile);

        if (uploadError) throw new Error(`Gagal mengunggah portfolio: ${uploadError.message}`);
        portfolioPath = filePath;
        console.log('Portfolio berhasil diunggah:', portfolioPath);
      }

      if (cvFile) {
        console.log('Mengunggah CV...');
        const filePath = `public/${tempId}-${cvFile.name}`;
        const { error: uploadError } = await supabase.storage.from('cvs').upload(filePath, cvFile);
        
        if (uploadError) throw new Error(`Gagal mengunggah CV: ${uploadError.message}`);
        cvPath = filePath;
        console.log('CV berhasil diunggah:', cvPath);
      }

      // Langkah 2: Siapkan semua data dalam satu paket (payload)
      const applicationPayload = {
        ...formData, // Semua data dari form
        portfolio_path: portfolioPath, // Path portfolio jika ada
        cv_path: cvPath,               // Path CV jika ada
      };

      console.log('Payload aplikasi yang akan dikirim:', applicationPayload);

      // Langkah 3: Lakukan satu kali INSERT dengan semua data
      // Perhatikan: Tidak ada .select() di sini!
      const { error: insertError } = await supabase
        .from('applications')
        .insert(applicationPayload);

      if (insertError) {
        // Jika ada error saat insert, lempar error agar ditangkap oleh block catch
        throw insertError;
      }

      // Jika berhasil, navigasi ke halaman terima kasih
      console.log('Aplikasi berhasil dikirim ke database!');
      navigate('/thank-you-final', { 
        state: { 
          name: formData.full_name 
        } 
      });

    } catch (error) {
      console.error('Terjadi kesalahan pada proses submit:', error);
      alert(`Terjadi kesalahan saat mengirim aplikasi: ${error.message || 'Silakan coba lagi.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderPersonalDataSection = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <User className="w-12 h-12 text-[#284B46] mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-[#284B46] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
          Ceritakan Tentang Dirimu
        </h2>
        <p className="text-gray-600" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          Mari berkenalan lebih dekat. Informasi ini akan membantu kami memahami latar belakangmu.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Nama Lengkap *
          </label>
          <input
            type="text"
            value={formData.full_name || ''}
            onChange={(e) => handleInputChange('full_name', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#284B46] focus:border-transparent transition-all"
            placeholder="Masukkan nama lengkapmu"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Email *
          </label>
          <input
            type="email"
            value={formData.email || ''}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#284B46] focus:border-transparent transition-all"
            placeholder="nama@email.com"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Nomor Telepon *
          </label>
          <input
            type="tel"
            value={formData.phone || ''}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#284B46] focus:border-transparent transition-all"
            placeholder="08xxxxxxxxxx"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Tanggal Lahir *
          </label>
          <input
            type="date"
            value={formData.birth_date || ''}
            onChange={(e) => handleInputChange('birth_date', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#284B46] focus:border-transparent transition-all"
            required
          />
        </div>
      </div>
    </div>
  );

  const renderMotivationSection = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Heart className="w-12 h-12 text-[#284B46] mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-[#284B46] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
          Apa yang Menggerakkan Hatimu?
        </h2>
        <p className="text-gray-600" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          Ceritakan motivasi dan komitmenmu untuk bergabung dengan Merajut Asa.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          Apa yang memotivasimu untuk bergabung dengan Merajut Asa? *
        </label>
        <textarea
          value={formData.motivation || ''}
          onChange={(e) => handleInputChange('motivation', e.target.value)}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#284B46] focus:border-transparent transition-all"
          placeholder="Ceritakan alasan dan motivasimu..."
          required
        />
        <div className="text-right text-xs text-gray-500 mt-1">
          {formData.motivation?.length || 0} karakter (minimal 50)
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          Apakah kamu pernah terlibat dalam kegiatan volunteer sebelumnya?
        </label>
        <textarea
          value={formData.previous_volunteer_experience || ''}
          onChange={(e) => handleInputChange('previous_volunteer_experience', e.target.value)}
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#284B46] focus:border-transparent transition-all"
          placeholder="Ceritakan pengalaman volunteer-mu (jika ada)..."
        />
      </div>
    </div>
  );

  const renderCompetencySection = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Users className="w-12 h-12 text-[#284B46] mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-[#284B46] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
          Pilih Area Posisimu
        </h2>
        <p className="text-gray-600" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          Pilih area yang paling sesuai dengan keahlian dan minatmu.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          Area Posisi Utama *
        </label>
        <div className="grid md:grid-cols-2 gap-4">
          {COMPETENCIES.map((competency) => (
            <CompetencyCard
              key={competency}
              title={competency}
              description={competencyDescriptions[competency]}
              icon={getCompetencyIcon(competency)}
              isSelected={formData.primary_competency === competency}
              onClick={() => handleInputChange('primary_competency', competency)}
            />
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          Area Posisi Sekunder (Opsional)
        </label>
        <div className="grid md:grid-cols-2 gap-4">
          {COMPETENCIES.filter(c => c !== formData.primary_competency).map((competency) => (
            <CompetencyCard
              key={competency}
              title={competency}
              description={competencyDescriptions[competency]}
              icon={getCompetencyIcon(competency)}
              isSelected={formData.secondary_competency === competency}
              onClick={() => handleInputChange('secondary_competency', 
                formData.secondary_competency === competency ? undefined : competency
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );

  const renderAssessmentSection = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <Clock className="w-12 h-12 text-[#284B46] mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-[#284B46] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
          Kenali Gaya Kerjamu
        </h2>
        <p className="text-gray-600" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          Jawab beberapa pertanyaan singkat untuk membantu kami memahami gaya kerja dan preferensimu.
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-gray-800 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Dalam tim, saya lebih suka...
          </h3>
          <div className="space-y-2">
            {[
              { value: 1, label: 'Memimpin dan mengarahkan tim' },
              { value: 2, label: 'Berkolaborasi setara dengan semua anggota' },
              { value: 3, label: 'Mendukung dan mengikuti arahan yang jelas' },
              { value: 4, label: 'Bekerja mandiri dengan koordinasi minimal' }
            ].map((option) => (
              <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="leadership_style"
                  value={option.value}
                  checked={formData.leadership_style === option.value}
                  onChange={(e) => handleInputChange('leadership_style', parseInt(e.target.value))}
                  className="text-[#284B46] focus:ring-[#284B46]"
                />
                <span className="text-gray-700" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-gray-800 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Ketika menghadapi masalah, saya cenderung...
          </h3>
          <div className="space-y-2">
            {[
              { value: 1, label: 'Menganalisis data dan fakta secara mendalam' },
              { value: 2, label: 'Berdiskusi dengan tim untuk mencari solusi bersama' },
              { value: 3, label: 'Mencari solusi kreatif dan inovatif' },
              { value: 4, label: 'Menggunakan pengalaman dan intuisi' }
            ].map((option) => (
              <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="problem_solving_approach"
                  value={option.value}
                  checked={formData.problem_solving_approach === option.value}
                  onChange={(e) => handleInputChange('problem_solving_approach', parseInt(e.target.value))}
                  className="text-[#284B46] focus:ring-[#284B46]"
                />
                <span className="text-gray-700" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-gray-800 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Dalam berkomunikasi, saya lebih suka...
          </h3>
          <div className="space-y-2">
            {[
              { value: 1, label: 'Komunikasi langsung dan to-the-point' },
              { value: 2, label: 'Diskusi mendalam dengan banyak detail' },
              { value: 3, label: 'Komunikasi yang hangat dan personal' },
              { value: 4, label: 'Presentasi visual dan storytelling' }
            ].map((option) => (
              <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="communication_style"
                  value={option.value}
                  checked={formData.communication_style === option.value}
                  onChange={(e) => handleInputChange('communication_style', parseInt(e.target.value))}
                  className="text-[#284B46] focus:ring-[#284B46]"
                />
                <span className="text-gray-700" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderFileUploadSection = () => {
    const requirements = getFileRequirements(formData.primary_competency || '');
    
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <Upload className="w-12 h-12 text-[#284B46] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#284B46] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            Upload Dokumen
          </h2>
          <p className="text-gray-600" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Upload dokumen yang diperlukan sesuai dengan area posisi yang dipilih.
          </p>
        </div>

        {/* File Requirements Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-800 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Persyaratan untuk {formData.primary_competency}:
              </h4>
              <ul className="text-sm text-blue-700 space-y-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {requirements.portfolioRequired && (
                  <li>• Portfolio (PDF) - <strong>WAJIB</strong></li>
                )}
                {requirements.cvRequired && (
                  <li>• CV (PDF) - <strong>WAJIB</strong></li>
                )}
                {requirements.portfolioOptional && (
                  <li>• Portfolio/CV (PDF) - Opsional</li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Portfolio Upload */}
        {(requirements.portfolioRequired || requirements.portfolioOptional) && (
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Portfolio {requirements.portfolioRequired ? '*' : '(Opsional)'}
            </h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileChange(e, 'portfolio')}
                className="hidden"
                id="portfolio-upload"
              />
              
              {!portfolioFile ? (
                <label htmlFor="portfolio-upload" className="cursor-pointer">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-700 mb-2">
                    Klik untuk memilih portfolio
                  </p>
                  <p className="text-sm text-gray-500">
                    Format: PDF, Maksimal: 5MB
                  </p>
                </label>
              ) : (
                <div className="space-y-4">
                  <FileText className="w-12 h-12 text-green-500 mx-auto" />
                  <div>
                    <p className="text-lg font-medium text-gray-700">
                      {portfolioFile.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {(portfolioFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    onClick={() => setPortfolioFile(null)}
                    className="text-sm text-[#4A6965] hover:text-[#284B46] underline"
                  >
                    Ganti file
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* CV Upload */}
        {requirements.cvRequired && (
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              CV *
            </h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileChange(e, 'cv')}
                className="hidden"
                id="cv-upload"
              />
              
              {!cvFile ? (
                <label htmlFor="cv-upload" className="cursor-pointer">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-700 mb-2">
                    Klik untuk memilih CV
                  </p>
                  <p className="text-sm text-gray-500">
                    Format: PDF, Maksimal: 5MB
                  </p>
                </label>
              ) : (
                <div className="space-y-4">
                  <FileText className="w-12 h-12 text-green-500 mx-auto" />
                  <div>
                    <p className="text-lg font-medium text-gray-700">
                      {cvFile.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {(cvFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    onClick={() => setCvFile(null)}
                    className="text-sm text-[#4A6965] hover:text-[#284B46] underline"
                  >
                    Ganti file
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-3 mb-2">
              <Upload className="w-5 h-5 text-[#284B46]" />
              <span className="text-sm font-medium text-gray-700">Mengunggah file...</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-[#284B46] h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">{Math.round(uploadProgress)}%</p>
          </div>
        )}
      </div>
    );
  };

  const renderCaseStudySection = () => {
    const relevantCaseStudies = caseStudies.filter(cs => 
      cs.competency === formData.primary_competency || cs.competency === 'General'
    );

    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <BookOpen className="w-12 h-12 text-[#284B46] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#284B46] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            Studi Kasus
          </h2>
          <p className="text-gray-600" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Jawab studi kasus berikut untuk menunjukkan kemampuan analisis dan problem-solving Anda.
          </p>
        </div>

        {relevantCaseStudies.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Memuat studi kasus...
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {relevantCaseStudies.map((caseStudy, index) => (
              <div key={caseStudy.id} className="bg-white p-6 rounded-xl border border-gray-200">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-[#284B46] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                    Studi Kasus {index + 1}: {caseStudy.title}
                  </h3>
                  <div className="inline-block px-3 py-1 bg-green-100 text-[#284B46] rounded-full text-sm font-medium mb-4">
                    {caseStudy.competency}
                  </div>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Deskripsi:
                  </h4>
                  <p className="text-gray-700 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    {caseStudy.description}
                  </p>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Skenario:
                  </h4>
                  <div className="bg-blue-50 p-4 rounded-lg mb-4">
                    <p className="text-gray-700" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      {caseStudy.scenario}
                    </p>
                  </div>
                </div>

                {caseStudy.questions && caseStudy.questions.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-800 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      Pertanyaan:
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      {caseStudy.questions.map((question: string, qIndex: number) => (
                        <li key={qIndex}>{question}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Jawaban Anda *
                  </label>
                  <textarea
                    value={caseStudyResponses[caseStudy.id] || ''}
                    onChange={(e) => setCaseStudyResponses(prev => ({
                      ...prev,
                      [caseStudy.id]: e.target.value
                    }))}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#284B46] focus:border-transparent transition-all"
                    placeholder="Berikan analisis dan solusi Anda untuk kasus ini..."
                    required
                  />
                  <div className="text-right text-xs text-gray-500 mt-1">
                    {(caseStudyResponses[caseStudy.id] || '').length} karakter (minimal 100)
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 1: return renderPersonalDataSection();
      case 2: return renderMotivationSection();
      case 3: return renderCompetencySection();
      case 4: return renderAssessmentSection();
      case 5: return renderFileUploadSection();
      case 6: return renderCaseStudySection();
      default: return null;
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <ProgressBar currentStep={currentSection} totalSteps={totalSections} className="mb-8" />
        
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {renderCurrentSection()}
          
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={() => currentSection > 1 ? setCurrentSection(currentSection - 1) : navigate('/')}
              className="flex items-center space-x-2 px-6 py-3 text-[#4A6965] border border-[#4A6965] rounded-lg hover:bg-green-50 transition-all"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{currentSection > 1 ? 'Sebelumnya' : 'Kembali'}</span>
            </button>
            
            {currentSection < totalSections ? (
              <button
                onClick={() => {
                  if (validateCurrentSection()) {
                    setCurrentSection(currentSection + 1);
                  } else {
                    alert('Mohon lengkapi semua field yang diperlukan sebelum melanjutkan');
                  }
                }}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#284B46] to-[#4A6965] text-white rounded-lg hover:shadow-lg transition-all"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                <span>Selanjutnya</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#284B46] to-[#4A6965] text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                <span>{isSubmitting ? 'Mengirim...' : 'Kirim Aplikasi'}</span>
                {!isSubmitting && <ArrowRight className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
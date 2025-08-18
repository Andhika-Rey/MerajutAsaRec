import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Target, Users, Sparkles } from 'lucide-react';
import Layout from '../components/Layout';
import CompetencyCard, { getCompetencyIcon } from '../components/CompetencyCard';
import { COMPETENCIES } from '../types';

const competencyDescriptions = {
  'Digital Transformation Area': 'Memimpin transformasi digital organisasi dengan teknologi terdepan untuk meningkatkan efisiensi dan jangkauan program.',
  'Human Development Area': 'Mengembangkan kapasitas SDM dan membangun budaya organisasi yang kuat untuk pertumbuhan berkelanjutan.',
  'Process & Optimization Area': 'Merancang dan mengoptimalkan proses operasional untuk memaksimalkan dampak setiap program yang dijalankan.',
  'Brand & Communication Area': 'Membangun brand awareness dan strategi komunikasi yang efektif untuk memperluas jangkauan misi organisasi.',
  'Insight & Impact Area': 'Menganalisis data dan mengukur dampak program untuk pengambilan keputusan yang berbasis bukti.',
  'Compliance & Governance Area': 'Memastikan tata kelola yang baik dan kepatuhan terhadap regulasi untuk keberlanjutan organisasi.'
};

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#284B46]/5 to-[#4A6965]/10" />
        <div className="relative max-w-6xl mx-auto px-4 py-16 lg:py-24">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <img 
                src="src/assets/Green and White Bold Brand Guidelines Presentation (3).svg" 
                alt="Merajut Asa Logo" 
                className="w-16 h-16"
              />
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold text-[#284B46] mb-6 leading-tight" 
                style={{ fontFamily: 'Playfair Display, serif' }}>
              Merajut asa,<br/>
              <span className="text-[#4A6965]">Membangun Masa Depan Anak Bangsa.</span>
            </h1>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <button
                onClick={() => navigate('/register')}
                className="group bg-gradient-to-r from-[#284B46] to-[#4A6965] text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center space-x-2"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                <span>Mulai Perjalananmu</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <div className="flex items-center space-x-2 text-[#4A6965]">
                <Sparkles className="w-5 h-5" />
                <span className="text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Proses pendaftaran hanya 10 menit
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Competencies Section */}
      <section className="py-16 bg-gradient-to-br from-green-50 to-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#284B46] mb-4" 
                style={{ fontFamily: 'Playfair Display, serif' }}>
              Temukan Area Posisimu
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto" 
               style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Pilih area posisi yang sesuai dengan passion dan keahlianmu. 
              Setiap peran memiliki dampak yang sama pentingnya dalam misi kita.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {COMPETENCIES.map((competency) => (
              <CompetencyCard
                key={competency}
                title={competency}
                description={competencyDescriptions[competency]}
                icon={getCompetencyIcon(competency)}
                className="hover:shadow-xl"
              />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <button
              onClick={() => navigate('/register')}
              className="group bg-gradient-to-r from-[#284B46] to-[#4A6965] text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center space-x-2 mx-auto"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              <span>Bergabung Bersama Kami</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>
    </Layout>
  );
}

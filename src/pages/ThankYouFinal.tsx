import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Mail, Calendar, ArrowRight } from 'lucide-react';
import Layout from '../components/Layout';

export default function ThankYouFinal() {
  const location = useLocation();
  const navigate = useNavigate();
  const { name } = location.state || { name: 'Calon Volunteer' };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <img 
              src="/Green and White Bold Brand Guidelines Presentation (4).svg" 
              alt="Merajut Asa Logo" 
              className="w-16 h-16"
            />
          </div>
          
          <h1 className="text-3xl lg:text-4xl font-bold text-[#284B46] mb-4" 
              style={{ fontFamily: 'Playfair Display, serif' }}>
            Luar Biasa, {name}!
          </h1>
          
          <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed" 
             style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Anda telah menyelesaikan seluruh proses aplikasi dengan sangat baik. 
            Kami sangat menghargai waktu, pemikiran, dan dedikasi yang Anda curahkan 
            untuk bergabung dengan keluarga besar Merajut Asa.
          </p>

          <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl shadow-lg max-w-3xl mx-auto mb-8">
            <h2 className="text-2xl font-semibold text-[#284B46] mb-6" 
                style={{ fontFamily: 'Playfair Display, serif' }}>
              Apa yang Terjadi Selanjutnya?
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-[#284B46] rounded-lg flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-800 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Evaluasi Komprehensif
                  </h3>
                  <p className="text-gray-600 text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Tim People kami akan mengevaluasi seluruh aplikasi Anda, termasuk
                    data pribadi, motivasi, jawaban studi kasus, dan dokumen yang telah Anda kirimkan.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-[#284B46] rounded-lg flex-shrink-0">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-800 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Proses Seleksi
                  </h3>
                  <p className="text-gray-600 text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Proses evaluasi memakan waktu 7-10 hari kerja. Kami akan menghubungi 
                    Anda via email untuk memberikan update terkini.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-[#284B46] rounded-lg flex-shrink-0">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-800 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Komunikasi Lanjutan
                  </h3>
                  <p className="text-gray-600 text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Kandidat terpilih akan diundang untuk sesi wawancara virtual 
                    bersama tim leadership Merajut Asa.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-6 max-w-3xl mx-auto mb-8">
            <h3 className="font-semibold text-yellow-800 mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              💡 Sementara Menunggu Hasil
            </h3>
            <div className="text-left text-yellow-700 space-y-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              <p className="text-sm">
                • <strong>Follow media sosial kami</strong> untuk update terbaru tentang program dan kegiatan Merajut Asa
              </p>
              <p className="text-sm">
                • <strong>Bagikan misi kami</strong> kepada teman dan keluarga yang mungkin tertarik bergabung
              </p>
              <p className="text-sm">
                • <strong>Tetap terhubung</strong> dengan komunitas volunteer Indonesia di sekitar Anda
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-[#284B46] to-[#4A6965] text-white rounded-lg hover:shadow-lg transition-all"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              <span>Kembali ke Beranda</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-500" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Ada pertanyaan atau butuh bantuan?
              </p>
              <div className="space-x-4">
                <a href="mailto:people@merajutasa.org" className="text-[#284B46] hover:underline text-sm">
                  people@merajutasa.org
                </a>
                <span className="text-gray-300">|</span>
                <a href="https://wa.me/6281234567890" className="text-[#284B46] hover:underline text-sm">
                  WhatsApp Support
                </a>
              </div>
            </div>
          </div>

          <div className="mt-12 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl">
            <p className="text-[#284B46] font-medium italic" style={{ fontFamily: 'Playfair Display, serif' }}>
              "Setiap benang yang kita rajut bersama akan menjadi jaring pengaman 
              untuk masa depan anak-anak Indonesia yang lebih cerah."
            </p>
            <p className="text-sm text-gray-600 mt-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              — Tim Merajut Asa
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
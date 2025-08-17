import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
}

export default function Layout({ children, showHeader = true, showFooter = true }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-green-50">
      {showHeader && (
        <header className="bg-white shadow-sm border-b border-green-100">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center space-x-3">
              <img 
                src="Green and White Bold Brand Guidelines Presentation (3).svg" 
                alt="Merajut Asa Logo" 
                className="w-10 h-10"
              />
              <div>
                <h1 className="text-xl font-bold text-[#284B46]" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Merajut Asa
                </h1>
                <p className="text-sm text-[#4A6965]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Bersama Membangun Masa Depan
                </p>
              </div>
            </div>
          </div>
        </header>
      )}
      <main className="flex-1">
        {children}
      </main>
      {showFooter && (
        <footer className="bg-[#284B46] text-white py-12">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <img 
                    src="/Green and White Bold Brand Guidelines Presentation (4).svg" 
                    alt="Merajut Asa Logo" 
                    className="w-8 h-8"
                  />
                  <Link 
                    to="/admin-login"
                    className="text-xl font-bold hover:text-green-200 transition-colors cursor-pointer"
                    style={{ fontFamily: 'Playfair Display, serif' }}
                  >
                    Merajut Asa
                  </Link>
                </div>
                <p className="text-green-100 text-sm leading-relaxed" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Bersama membangun masa depan anak-anak Indonesia melalui program pemberdayaan dan pendampingan berkelanjutan.
                </p>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Hubungi Tim Kami
                </h4>
                <div className="space-y-3">
                  <div>
                    <p className="font-medium text-green-100" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      Wahyu Daffa (Human Development Lead)
                    </p>
                    <a 
                      href="https://wa.me/6281221024959" 
                      className="flex items-center space-x-2 text-sm text-green-200 hover:text-white transition-colors"
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>+62 812-2102-4959</span>
                    </a>
                  </div>
                  
                  <div>
                    <p className="font-medium text-green-100" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      Muhamad Andhika (Technical Lead)
                    </p>
                    <a 
                      href="https://wa.me/6289513475186" 
                      className="flex items-center space-x-2 text-sm text-green-200 hover:text-white transition-colors"
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>+62 895-1347-5186</span>
                    </a>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Informasi
                </h4>
                <div className="space-y-2 text-sm text-green-100" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  <p>Email: people@merajutasa.org</p>
                  <p>Proses seleksi: 7-10 hari kerja</p>
                  <p>© 2025 Merajut Asa. All rights reserved.</p>
                </div>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
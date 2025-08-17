import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, Flag, Eye, BarChart3, Users, FileText, Clock, X, CheckCircle, AlertCircle, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import { supabase } from '../lib/supabase';
import type { Application, CaseStudy } from '../types';

interface DashboardStats {
  total: number;
  byStatus: Record<string, number>;
  byCompetency: Record<string, number>;
}

interface ApplicationDetailModalProps {
  application: Application | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (id: string, status: string) => void;
  onUpdateNotes: (id: string, notes: string) => void;
}

function ApplicationDetailModal({ application, isOpen, onClose, onUpdateStatus, onUpdateNotes }: ApplicationDetailModalProps) {
  const [notes, setNotes] = useState('');
  const [isUpdatingNotes, setIsUpdatingNotes] = useState(false);

  useEffect(() => {
    if (application) {
      setNotes(application.admin_notes || '');
    }
  }, [application]);

  if (!isOpen || !application) return null;

  const handleUpdateNotes = async () => {
    setIsUpdatingNotes(true);
    try {
      await onUpdateNotes(application.id!, notes);
    } finally {
      setIsUpdatingNotes(false);
    }
  };

  const getScoreLabel = (score: number) => {
    const labels = ['Tidak Dipilih', 'Rendah', 'Sedang', 'Tinggi', 'Sangat Tinggi'];
    return labels[score] || 'Tidak Diketahui';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-[#284B46]" style={{ fontFamily: 'Playfair Display, serif' }}>
            Detail Aplikasi
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Personal Information */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-[#284B46] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Informasi Pribadi
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                <p className="text-gray-900">{application.full_name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <p className="text-gray-900">{application.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telepon</label>
                <p className="text-gray-900">{application.phone}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Lahir</label>
                <p className="text-gray-900">{new Date(application.birth_date).toLocaleDateString('id-ID')}</p>
              </div>
            </div>
          </div>

          {/* Motivation */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-[#284B46] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Motivasi & Pengalaman
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Motivasi</label>
                <p className="text-gray-900 bg-white p-3 rounded border">{application.motivation}</p>
              </div>
              {application.previous_volunteer_experience && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pengalaman Volunteer</label>
                  <p className="text-gray-900 bg-white p-3 rounded border">{application.previous_volunteer_experience}</p>
                </div>
              )}
            </div>
          </div>

          {/* Competency */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-[#284B46] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Area Kompetensi
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kompetensi Utama</label>
                <p className="text-gray-900 font-medium">{application.primary_competency}</p>
              </div>
              {application.secondary_competency && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kompetensi Sekunder</label>
                  <p className="text-gray-900">{application.secondary_competency}</p>
                </div>
              )}
            </div>
          </div>

          {/* Assessment Results */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-[#284B46] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Hasil Assessment
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gaya Kepemimpinan</label>
                <p className="text-gray-900">{getScoreLabel(application.leadership_style)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pendekatan Problem Solving</label>
                <p className="text-gray-900">{getScoreLabel(application.problem_solving_approach)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gaya Komunikasi</label>
                <p className="text-gray-900">{getScoreLabel(application.communication_style)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Orientasi Pembelajaran</label>
                <p className="text-gray-900">{getScoreLabel(application.learning_orientation)}</p>
              </div>
            </div>
          </div>

          {/* Case Study Responses */}
          {application.case_study_responses && Array.isArray(application.case_study_responses) && application.case_study_responses.length > 0 && (
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-[#284B46] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                Jawaban Studi Kasus
              </h3>
              <div className="space-y-4">
                {application.case_study_responses.map((response: any, index: number) => (
                  <div key={index} className="bg-white p-4 rounded border">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Studi Kasus {index + 1}
                    </label>
                    <p className="text-gray-900 whitespace-pre-wrap">{response.response}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Files */}
          {(application.portfolio_path || application.cv_path) && (
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-[#284B46] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                File yang Diunggah
              </h3>
              <div className="flex space-x-4">
                {application.portfolio_path && (
                  <button
                    onClick={() => downloadFile('portfolios', application.portfolio_path!, `Portfolio_${application.full_name}`)}
                    className="flex items-center space-x-2 px-4 py-2 bg-[#284B46] text-white rounded-lg hover:bg-[#4A6965] transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Portfolio</span>
                  </button>
                )}
                {application.cv_path && (
                  <button
                    onClick={() => downloadFile('cvs', application.cv_path!, `CV_${application.full_name}`)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download CV</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Status & Admin Notes */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-[#284B46] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Status & Catatan Admin
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status Aplikasi</label>
                <select
                  value={application.status}
                  onChange={(e) => onUpdateStatus(application.id!, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#284B46] focus:border-transparent"
                >
                  <option value="new">Baru</option>
                  <option value="reviewed">Direview</option>
                  <option value="interview">Wawancara</option>
                  <option value="accepted">Diterima</option>
                  <option value="rejected">Ditolak</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Catatan Admin</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#284B46] focus:border-transparent"
                  placeholder="Tambahkan catatan untuk aplikasi ini..."
                />
                <button
                  onClick={handleUpdateNotes}
                  disabled={isUpdatingNotes}
                  className="mt-2 px-4 py-2 bg-[#284B46] text-white rounded-lg hover:bg-[#4A6965] transition-colors disabled:opacity-50"
                >
                  {isUpdatingNotes ? 'Menyimpan...' : 'Simpan Catatan'}
                </button>
              </div>
            </div>
          </div>

          {/* Application Info */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-[#284B46] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Informasi Aplikasi
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Dibuat</label>
                <p className="text-gray-900">{new Date(application.created_at!).toLocaleString('id-ID')}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Terakhir Diupdate</label>
                <p className="text-gray-900">{new Date(application.updated_at!).toLocaleString('id-ID')}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ID Aplikasi</label>
                <p className="text-gray-900 font-mono text-xs">{application.id}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status Flag</label>
                <p className="text-gray-900">{application.flagged ? 'Diflag' : 'Normal'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { signOut, user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    total: 0,
    byStatus: {},
    byCompetency: {}
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [competencyFilter, setCompetencyFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [applications, searchTerm, statusFilter, competencyFilter]);

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setApplications(data || []);
      calculateStats(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      alert('Gagal memuat data aplikasi. Pastikan Anda memiliki akses admin.');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data: Application[]) => {
    const stats: DashboardStats = {
      total: data.length,
      byStatus: {},
      byCompetency: {}
    };

    data.forEach(app => {
      // Status stats
      stats.byStatus[app.status] = (stats.byStatus[app.status] || 0) + 1;
      
      // Competency stats
      stats.byCompetency[app.primary_competency] = (stats.byCompetency[app.primary_competency] || 0) + 1;
    });

    setStats(stats);
  };

  const filterApplications = () => {
    let filtered = applications;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(app => 
        app.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    // Competency filter
    if (competencyFilter !== 'all') {
      filtered = filtered.filter(app => app.primary_competency === competencyFilter);
    }

    setFilteredApplications(filtered);
  };

  const updateApplicationStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      setApplications(prev => 
        prev.map(app => app.id === id ? { ...app, status } : app)
      );

      // Update selected application if it's the one being updated
      if (selectedApplication?.id === id) {
        setSelectedApplication(prev => prev ? { ...prev, status } : null);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Gagal mengupdate status aplikasi');
    }
  };

  const updateApplicationNotes = async (id: string, notes: string) => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ admin_notes: notes, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      setApplications(prev => 
        prev.map(app => app.id === id ? { ...app, admin_notes: notes } : app)
      );

      // Update selected application if it's the one being updated
      if (selectedApplication?.id === id) {
        setSelectedApplication(prev => prev ? { ...prev, admin_notes: notes } : null);
      }

      alert('Catatan berhasil disimpan');
    } catch (error) {
      console.error('Error updating notes:', error);
      alert('Gagal menyimpan catatan');
    }
  };

  const toggleFlag = async (id: string, currentFlag: boolean) => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ flagged: !currentFlag, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      setApplications(prev => 
        prev.map(app => app.id === id ? { ...app, flagged: !currentFlag } : app)
      );
    } catch (error) {
      console.error('Error toggling flag:', error);
      alert('Gagal mengubah status flag');
    }
  };

  const downloadFile = async (bucket: string, filePath: string, fileName: string) => {
    try {
      // Get public URL for the file
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      if (!urlData?.publicUrl) {
        throw new Error('Tidak dapat mengakses file');
      }

      // Fetch the file using the public URL
      const response = await fetch(urlData.publicUrl);
      
      if (!response.ok) {
        throw new Error('File tidak ditemukan atau tidak dapat diakses');
      }

      const blob = await response.blob();
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${fileName.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
      
      // Fallback: try direct download method
      try {
        const { data, error: downloadError } = await supabase.storage
          .from(bucket)
          .download(filePath);

        if (downloadError) throw downloadError;

        const url = URL.createObjectURL(data);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileName.replace(/\s+/g, '_')}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (fallbackError) {
        console.error('Fallback download also failed:', fallbackError);
        alert(`Gagal mengunduh file: ${error.message || 'File mungkin tidak tersedia'}`);
      }
    }
  };

  const openDetailModal = (application: Application) => {
    setSelectedApplication(application);
    setIsDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedApplication(null);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'new': 'bg-blue-100 text-blue-800',
      'reviewed': 'bg-yellow-100 text-yellow-800',
      'interview': 'bg-purple-100 text-purple-800',
      'accepted': 'bg-green-100 text-green-800',
      'rejected': 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      'new': 'Baru',
      'reviewed': 'Direview',
      'interview': 'Wawancara',
      'accepted': 'Diterima',
      'rejected': 'Ditolak'
    };
    return labels[status as keyof typeof labels] || status;
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#284B46] mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat data...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-[#284B46] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                Dashboard Admin
              </h1>
              <p className="text-gray-600" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Kelola aplikasi volunteer Merajut Asa
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Selamat datang,
                </p>
                <p className="font-semibold text-[#284B46]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  {user?.email}
                </p>
              </div>
              <button
                onClick={signOut}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Total Aplikasi
                </p>
                <p className="text-2xl font-bold text-[#284B46]" style={{ fontFamily: 'Playfair Display, serif' }}>
                  {stats.total}
                </p>
              </div>
              <Users className="w-8 h-8 text-[#4A6965]" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Baru
                </p>
                <p className="text-2xl font-bold text-blue-600" style={{ fontFamily: 'Playfair Display, serif' }}>
                  {stats.byStatus['new'] || 0}
                </p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Diterima
                </p>
                <p className="text-2xl font-bold text-green-600" style={{ fontFamily: 'Playfair Display, serif' }}>
                  {stats.byStatus['accepted'] || 0}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Menunggu Review
                </p>
                <p className="text-2xl font-bold text-yellow-600" style={{ fontFamily: 'Playfair Display, serif' }}>
                  {(stats.byStatus['new'] || 0) + (stats.byStatus['reviewed'] || 0)}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cari Aplikasi
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Nama atau email..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#284B46] focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#284B46] focus:border-transparent"
              >
                <option value="all">Semua Status</option>
                <option value="new">Baru</option>
                <option value="reviewed">Direview</option>
                <option value="interview">Wawancara</option>
                <option value="accepted">Diterima</option>
                <option value="rejected">Ditolak</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Area Posisi
              </label>
              <select
                value={competencyFilter}
                onChange={(e) => setCompetencyFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#284B46] focus:border-transparent"
              >
                <option value="all">Semua Area</option>
                {Object.keys(stats.byCompetency).map(competency => (
                  <option key={competency} value={competency}>{competency}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Applications Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kandidat
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Area Posisi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tanggal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredApplications.map((app) => (
                  <tr key={app.id} className={app.flagged ? 'bg-yellow-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {app.flagged && (
                          <Flag className="w-4 h-4 text-yellow-500 mr-2" />
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {app.full_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {app.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {app.primary_competency}
                      </div>
                      {app.secondary_competency && (
                        <div className="text-xs text-gray-500">
                          + {app.secondary_competency}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={app.status}
                        onChange={(e) => updateApplicationStatus(app.id!, e.target.value)}
                        className={`text-xs font-semibold px-2 py-1 rounded-full border-0 ${getStatusColor(app.status)}`}
                      >
                        <option value="new">Baru</option>
                        <option value="reviewed">Direview</option>
                        <option value="interview">Wawancara</option>
                        <option value="accepted">Diterima</option>
                        <option value="rejected">Ditolak</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(app.created_at!).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => toggleFlag(app.id!, app.flagged || false)}
                          className={`p-1 rounded ${
                            app.flagged 
                              ? 'text-yellow-600 hover:text-yellow-800' 
                              : 'text-gray-400 hover:text-yellow-600'
                          }`}
                          title={app.flagged ? 'Hapus flag' : 'Beri flag'}
                        >
                          <Flag className="w-4 h-4" />
                        </button>
                        
                        {app.portfolio_path && (
                          <button
                            onClick={() => downloadFile('portfolios', app.portfolio_path!, `Portfolio_${app.full_name}`)}
                            className="p-1 text-[#284B46] hover:text-[#4A6965] rounded"
                            title="Download portofolio"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        )}
                        
                        {app.cv_path && (
                          <button
                            onClick={() => downloadFile('cvs', app.cv_path!, `CV_${app.full_name}`)}
                            className="p-1 text-blue-600 hover:text-blue-800 rounded"
                            title="Download CV"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        )}
                        
                        <button
                          onClick={() => openDetailModal(app)}
                          className="p-1 text-gray-400 hover:text-gray-600 rounded"
                          title="Lihat detail"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredApplications.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Tidak ada aplikasi yang ditemukan</p>
            </div>
          )}
        </div>
      </div>

      {/* Application Detail Modal */}
      <ApplicationDetailModal
        application={selectedApplication}
        isOpen={isDetailModalOpen}
        onClose={closeDetailModal}
        onUpdateStatus={updateApplicationStatus}
        onUpdateNotes={updateApplicationNotes}
      />
    </Layout>
  );
}
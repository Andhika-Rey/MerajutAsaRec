import { supabase } from '../lib/supabase';
import type { Application, CaseStudy } from '../types';

// Application helpers
export const createApplication = async (applicationData: Partial<Application>) => {
  // Fungsi ini langsung menggunakan client supabase publik yang aman
  const { data, error } = await supabase
    .from('applications')
    .insert([applicationData])
    .select()
    .single(); // .single() untuk mendapatkan satu objek, bukan array

  if (error) {
    console.error("Error creating application:", error);
  }

  return { data, error };
};

export const getAllApplications = async () => {
  try {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching applications:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error in getAllApplications:', error);
    throw error;
  }
};

export const updateApplicationStatus = async (id: string, status: string) => {
  try {
    const { data, error } = await supabase
      .from('applications')
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating application status:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in updateApplicationStatus:', error);
    throw error;
  }
};

// Case study helpers
export const getActiveCaseStudies = async () => {
  try {
    const { data, error } = await supabase
      .from('case_studies')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching case studies:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error in getActiveCaseStudies:', error);
    throw error;
  }
};

// File upload helpers
export const uploadFile = async (file: File, bucket: string, path: string) => {
  const { data, error } = await supabase
    .storage
    .from(bucket)
    .upload(path, file);

  if (error) {
    console.error("Error uploading file:", error);
  }
  
  return { data, error };
};

export const downloadFile = async (bucket: string, filePath: string) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .download(filePath);

    if (error) {
      console.error('Error downloading file:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in downloadFile:', error);
    throw error;
  }
};

// Database connection test
export const testDatabaseConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('applications')
      .select('count(*)')
      .limit(1);

    if (error) {
      console.error('Database connection test failed:', error);
      return false;
    }

    console.log('Database connection successful');
    return true;
  } catch (error) {
    console.error('Database connection test error:', error);
    return false;
  }
};
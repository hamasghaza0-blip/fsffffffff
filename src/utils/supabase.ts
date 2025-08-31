import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create Supabase client with proper CORS handling
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false
      },
      global: {
        headers: {
          'apikey': supabaseAnonKey
        },
        fetch: (url, options = {}) => {
          return fetch(url, {
            ...options,
            mode: 'cors',
            credentials: 'omit',
            headers: {
              ...options.headers,
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'apikey': supabaseAnonKey
            }
          });
        }
      },
      db: {
        schema: 'public'
      },
      realtime: {
        params: {
          eventsPerSecond: 10
        }
      }
    })
  : null;

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = (): boolean => {
  return !!(supabaseUrl && supabaseAnonKey && supabase);
};

// Helper function to handle Supabase errors with better network error detection
export const handleSupabaseError = (error: any): string => {
  console.error('Supabase error details:', error);
  
  // Handle network errors
  if (error?.message?.includes('Failed to fetch') || 
      error?.message?.includes('NetworkError') ||
      error?.message?.includes('fetch')) {
    return 'مشكلة في الاتصال بالخادم. تحقق من اتصال الإنترنت أو حاول مرة أخرى.';
  }
  
  // Handle CORS errors
  if (error?.message?.includes('CORS') || 
      error?.message?.includes('Access-Control-Allow-Origin')) {
    return 'مشكلة في إعدادات الخادم. يرجى التواصل مع الإدارة.';
  }
  
  // Handle authentication errors
  if (error?.message?.includes('JWT') || 
      error?.message?.includes('Invalid API key')) {
    return 'مشكلة في المصادقة. يرجى التواصل مع الإدارة.';
  }
  
  // Handle timeout errors
  if (error?.message?.includes('timeout') || 
      error?.message?.includes('Request timeout')) {
    return 'انتهت مهلة الاتصال. حاول مرة أخرى.';
  }
  
  // Generic error
  return error?.message || 'حدث خطأ غير متوقع. حاول مرة أخرى.';
};

// Test connection function
export const testSupabaseConnection = async (): Promise<boolean> => {
  try {
    if (!isSupabaseConfigured()) {
      console.error('Supabase not configured');
      return false;
    }
    
    // Simple test query
    const { error } = await supabase!
      .from('results')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('Connection test failed:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Connection test error:', error);
    return false;
  }
};
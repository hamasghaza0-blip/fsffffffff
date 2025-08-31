import { supabase } from './supabase';
import { Reciter, Result } from '../types';

// API للبحث عن القراء
export const searchReciters = async (searchTerm: string): Promise<Reciter[]> => {
  try {
    const { data, error } = await supabase
      .from('reciters')
      .select('*')
      .ilike('name', `%${searchTerm}%`)
      .order('name');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error searching reciters:', error);
    return [];
  }
};

// API لجلب جميع القراء مع التصفح
export const getReciters = async (page: number = 1, limit: number = 50): Promise<{
  data: Reciter[];
  count: number;
  hasMore: boolean;
}> => {
  try {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from('reciters')
      .select('*', { count: 'exact' })
      .range(from, to)
      .order('name');

    if (error) throw error;

    return {
      data: data || [],
      count: count || 0,
      hasMore: (count || 0) > page * limit
    };
  } catch (error) {
    console.error('Error fetching reciters:', error);
    return { data: [], count: 0, hasMore: false };
  }
};

// API لجلب القراء حسب الفئة
export const getRecitersByCategory = async (category: string): Promise<Reciter[]> => {
  try {
    const { data, error } = await supabase
      .from('reciters')
      .select('*')
      .eq('category', category)
      .order('name');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching reciters by category:', error);
    return [];
  }
};

// API لجلب إحصائيات التسجيل
export const getRegistrationStats = async (): Promise<{
  totalReciters: number;
  categoriesCount: { [key: string]: number };
  recentRegistrations: number;
}> => {
  try {
    // إجمالي القراء
    const { count: totalReciters } = await supabase
      .from('reciters')
      .select('*', { count: 'exact', head: true });

    // عدد القراء لكل فئة
    const { data: categoryData } = await supabase
      .from('reciters')
      .select('category')
      .not('category', 'is', null);

    const categoriesCount: { [key: string]: number } = {};
    categoryData?.forEach(item => {
      if (item.category) {
        categoriesCount[item.category] = (categoriesCount[item.category] || 0) + 1;
      }
    });

    // التسجيلات الحديثة (آخر 7 أيام)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const { count: recentRegistrations } = await supabase
      .from('reciters')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', weekAgo.toISOString());

    return {
      totalReciters: totalReciters || 0,
      categoriesCount,
      recentRegistrations: recentRegistrations || 0
    };
  } catch (error) {
    console.error('Error fetching registration stats:', error);
    return {
      totalReciters: 0,
      categoriesCount: {},
      recentRegistrations: 0
    };
  }
};

// API لإضافة قارئ جديد (للاستخدام المستقبلي)
export const addReciter = async (reciter: Omit<Reciter, 'id' | 'created_at'>): Promise<Reciter | null> => {
  try {
    const { data, error } = await supabase
      .from('reciters')
      .insert([reciter])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error adding reciter:', error);
    return null;
  }
};

// API للتحقق من وجود قارئ
export const checkReciterExists = async (name: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('reciters')
      .select('id')
      .ilike('name', name)
      .limit(1);

    if (error) throw error;
    return (data?.length || 0) > 0;
  } catch (error) {
    console.error('Error checking reciter existence:', error);
    return false;
  }
};

// Cache للبيانات المتكررة
class APICache {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 دقائق

  set(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  get(key: string): any | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const isExpired = Date.now() - cached.timestamp > this.CACHE_DURATION;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  clear(): void {
    this.cache.clear();
  }
}

export const apiCache = new APICache();

// API محسنة للبحث مع Cache
export const searchRecitersWithCache = async (searchTerm: string): Promise<Reciter[]> => {
  const cacheKey = `search_${searchTerm.toLowerCase()}`;
  const cached = apiCache.get(cacheKey);
  
  if (cached) {
    return cached;
  }

  const results = await searchReciters(searchTerm);
  apiCache.set(cacheKey, results);
  
  return results;
};

// API محسنة للإحصائيات مع Cache
export const getRegistrationStatsWithCache = async () => {
  const cacheKey = 'registration_stats';
  const cached = apiCache.get(cacheKey);
  
  if (cached) {
    return cached;
  }

  const stats = await getRegistrationStats();
  apiCache.set(cacheKey, stats);
  
  return stats;
};
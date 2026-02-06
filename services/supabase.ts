
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SiteContent, InvestorLead } from '../types';
import { DEFAULT_CONTENT } from '../constants';

/**
 * Robustly retrieves configuration. 
 * Prioritizes process.env for Vercel/CI and falls back to window.localStorage for runtime admin overrides.
 */
const getActiveConfig = () => {
  // Check environment variables first (most stable for Vercel)
  let url = '';
  let key = '';

  try {
    // Attempt to get from process.env if available
    url = (typeof process !== 'undefined' ? process.env.SUPABASE_URL : '') || '';
    key = (typeof process !== 'undefined' ? process.env.SUPABASE_ANON_KEY : '') || '';
  } catch (e) {
    // Silently continue
  }

  // Fallback to localStorage if we are in the browser
  if (typeof window !== 'undefined') {
    url = url || localStorage.getItem('ggbs_supabase_url') || '';
    key = key || localStorage.getItem('ggbs_supabase_key') || '';
  }

  return { url: url.trim(), key: key.trim() };
};

/**
 * Dynamically creates a Supabase Client.
 */
export const getSupabaseClient = (): SupabaseClient | null => {
  const { url, key } = getActiveConfig();
  if (!url || !key) return null;
  try {
    return createClient(url, key);
  } catch (e) {
    console.error("Supabase Init Error:", e);
    return null;
  }
};

/**
 * Primary export for the client instance.
 */
export const supabase = getSupabaseClient();

/**
 * Uploads media to Supabase storage.
 * If DB is missing, returns a local preview URL instead of crashing.
 */
export const uploadFile = async (file: File): Promise<string> => {
  const client = getSupabaseClient();
  
  if (!client) {
    console.warn("DB not initialized. Falling back to local preview.");
    return URL.createObjectURL(file);
  }
  
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
  const filePath = `${fileName}`;

  try {
    const { error: uploadError } = await client.storage
      .from('media')
      .upload(filePath, file, { upsert: true });

    if (uploadError) throw uploadError;

    const { data } = client.storage
      .from('media')
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (err) {
    console.error("Upload failed:", err);
    return URL.createObjectURL(file);
  }
};

/**
 * Fetches site settings from the database.
 */
export const fetchSiteContent = async (): Promise<SiteContent> => {
  const localCache = typeof window !== 'undefined' ? localStorage.getItem('ggbs_local_content') : null;
  const fallback = localCache ? JSON.parse(localCache) : DEFAULT_CONTENT;

  const client = getSupabaseClient();
  if (!client) return fallback;
  
  try {
    const { data, error } = await client
      .from('site_settings')
      .select('*')
      .eq('id', 1)
      .single();

    if (error || !data) return fallback;

    return {
      logoUrl: data.logo_url || fallback.logoUrl,
      heroVideoUrl: data.hero_video_url || fallback.heroVideoUrl,
      fightVideoUrl: data.fight_video_url || fallback.fightVideoUrl,
      glovesImageUrl: data.gloves_image_url || fallback.glovesImageUrl,
      evolutionImageUrl: data.evolution_image_url || fallback.evolutionImageUrl,
      revenueImageUrl: data.revenue_image_url || fallback.revenueImageUrl,
    };
  } catch {
    return fallback;
  }
};

/**
 * Persists changes to the SQL database.
 */
export const updateSiteContent = async (content: SiteContent) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('ggbs_local_content', JSON.stringify(content));
  }

  const client = getSupabaseClient();
  if (!client) {
    throw new Error("Supabase is not configured. Go to 'Connection' tab in Admin.");
  }

  const payload = {
    id: 1,
    logo_url: content.logoUrl,
    hero_video_url: content.heroVideoUrl,
    fight_video_url: content.fightVideoUrl,
    gloves_image_url: content.glovesImageUrl,
    evolution_image_url: content.evolutionImageUrl,
    revenue_image_url: content.revenueImageUrl,
  };
  
  const { error } = await client.from('site_settings').upsert([payload]);
  if (error) throw error;
};

export const submitInvestorLead = async (lead: InvestorLead) => {
  const client = getSupabaseClient();
  if (!client) return;
  await client.from('investors').insert([lead]);
};

export const fetchInvestorLeads = async (): Promise<InvestorLead[]> => {
  const client = getSupabaseClient();
  if (!client) return [];
  const { data, error } = await client
    .from('investors')
    .select('*')
    .order('created_at', { ascending: false });
  return error ? [] : data || [];
};

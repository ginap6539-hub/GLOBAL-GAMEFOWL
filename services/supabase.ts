
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SiteContent, InvestorLead } from '../types';
import { DEFAULT_CONTENT } from '../constants';

/**
 * Robustly retrieves configuration from environment or localStorage.
 */
const getActiveConfig = () => {
  let url = '';
  let key = '';

  // 1. Try environment variables
  try {
    // @ts-ignore
    url = (import.meta.env?.VITE_SUPABASE_URL) || '';
    // @ts-ignore
    key = (import.meta.env?.VITE_SUPABASE_ANON_KEY) || '';
  } catch (e) {}

  // 2. Fallback to localStorage (where Admin saves keys)
  if (typeof window !== 'undefined') {
    url = url || localStorage.getItem('ggbs_supabase_url') || '';
    key = key || localStorage.getItem('ggbs_supabase_key') || '';
  }

  return { url: url.trim(), key: key.trim() };
};

/**
 * Returns a live Supabase Client.
 */
export const getSupabaseClient = (): SupabaseClient | null => {
  const { url, key } = getActiveConfig();
  if (!url || !key) return null;
  try {
    return createClient(url, key);
  } catch (e) {
    return null;
  }
};

/**
 * Uploads a file to the 'media' bucket.
 */
export const uploadFile = async (file: File): Promise<string> => {
  const client = getSupabaseClient();
  
  if (!client) {
    // In local mode, we just return a temporary URL
    return URL.createObjectURL(file);
  }
  
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

  try {
    const { error: uploadError } = await client.storage
      .from('media')
      .upload(fileName, file, { upsert: true });

    if (uploadError) throw uploadError;

    const { data } = client.storage.from('media').getPublicUrl(fileName);
    return data.publicUrl;
  } catch (err: any) {
    throw new Error(err.message || "Failed to upload. Ensure 'media' bucket exists in Supabase Storage.");
  }
};

/**
 * Loads site content.
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
 * Saves current content to DB.
 */
export const updateSiteContent = async (content: SiteContent) => {
  // Always save locally first
  if (typeof window !== 'undefined') {
    localStorage.setItem('ggbs_local_content', JSON.stringify(content));
  }

  const client = getSupabaseClient();
  if (!client) {
    throw new Error("Supabase is not configured. Please go to the 'Engine Config' tab to enter your keys.");
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

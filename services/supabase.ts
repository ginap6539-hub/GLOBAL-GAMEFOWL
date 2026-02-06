
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SiteContent, InvestorLead } from '../types';
import { DEFAULT_CONTENT } from '../constants';

/**
 * Fetches the latest Supabase credentials from LocalStorage or Environment.
 * This ensures the admin can update keys in real-time without code changes.
 */
const getActiveConfig = () => {
  const url = (localStorage.getItem('ggbs_supabase_url') || '').trim();
  const key = (localStorage.getItem('ggbs_supabase_key') || '').trim();
  return { url, key };
};

/**
 * Returns a live instance of the Supabase Client.
 * If credentials are missing, it returns null instead of throwing an error.
 */
export const getSupabaseClient = (): SupabaseClient | null => {
  const { url, key } = getActiveConfig();
  if (!url || !key) return null;
  try {
    return createClient(url, key);
  } catch (e) {
    console.error("Supabase Connection Failed:", e);
    return null;
  }
};

/**
 * Uploads a file to the Supabase 'media' bucket and returns the Public URL.
 * Falls back to local preview URL if database is not connected.
 */
export const uploadFile = async (file: File): Promise<string> => {
  const client = getSupabaseClient();
  
  if (!client) {
    console.warn("Local Mode: DB not linked. Creating preview URL.");
    return URL.createObjectURL(file);
  }
  
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
  const filePath = `${fileName}`;

  try {
    // Attempt upload to the 'media' bucket
    const { error: uploadError } = await client.storage
      .from('media')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      if (uploadError.message.includes("not found")) {
        throw new Error("Bucket 'media' not found. Please create a public bucket named 'media' in Supabase Storage.");
      }
      throw uploadError;
    }

    const { data } = client.storage
      .from('media')
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (err) {
    console.error("Upload process failed:", err);
    // Fallback to local URL so user doesn't lose progress
    return URL.createObjectURL(file);
  }
};

/**
 * Fetches all site content (logos, videos, images) from the SQL database.
 */
export const fetchSiteContent = async (): Promise<SiteContent> => {
  const localCache = localStorage.getItem('ggbs_local_content');
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
 * Saves the current configuration to the SQL database.
 */
export const updateSiteContent = async (content: SiteContent) => {
  // 1. Immediate local save for UI feedback
  localStorage.setItem('ggbs_local_content', JSON.stringify(content));

  const client = getSupabaseClient();
  if (!client) {
    throw new Error("Admin: You are currently in LOCAL MODE. Please go to the 'Connection' tab and enter your Supabase credentials to save globally.");
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
  
  if (error) {
    console.error("Database Sync Error:", error);
    throw new Error(`Database Error: ${error.message}. Ensure the 'site_settings' table exists in your SQL editor.`);
  }
};

/**
 * Submits an investor lead to the 'investors' table.
 */
export const submitInvestorLead = async (lead: InvestorLead) => {
  const client = getSupabaseClient();
  if (!client) return;
  await client.from('investors').insert([lead]);
};

/**
 * Retrieves all captured leads from the database.
 */
export const fetchInvestorLeads = async (): Promise<InvestorLead[]> => {
  const client = getSupabaseClient();
  if (!client) return [];
  const { data, error } = await client
    .from('investors')
    .select('*')
    .order('created_at', { ascending: false });
  return error ? [] : data || [];
};

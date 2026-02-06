
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SiteContent, InvestorLead } from '../types';
import { DEFAULT_CONTENT } from '../constants';

// Function to get the latest credentials from storage or env
const getCreds = () => {
  const url = (localStorage.getItem('ggbs_supabase_url') || process.env.SUPABASE_URL || '').trim();
  const key = (localStorage.getItem('ggbs_supabase_key') || process.env.SUPABASE_ANON_KEY || '').trim();
  return { url, key };
};

// Function to get a fresh Supabase client instance
export const getSupabaseClient = (): SupabaseClient | null => {
  const { url, key } = getCreds();
  if (!url || !key) return null;
  try {
    return createClient(url, key);
  } catch (e) {
    console.error("Failed to initialize Supabase client", e);
    return null;
  }
};

// Legacy export for compatibility, though getSupabaseClient() is preferred
export const supabase = getSupabaseClient();

export const uploadFile = async (file: File): Promise<string> => {
  const client = getSupabaseClient();
  
  if (!client) {
    console.warn("Database not connected. Creating local preview URL.");
    // Return a local blob URL so the admin can at least see the preview
    return URL.createObjectURL(file);
  }
  
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `${fileName}`;

  try {
    const { error: uploadError } = await client.storage
      .from('media')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = client.storage
      .from('media')
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (err) {
    console.error("Storage upload failed, falling back to local preview:", err);
    return URL.createObjectURL(file);
  }
};

export const fetchSiteContent = async (): Promise<SiteContent> => {
  const localSaved = localStorage.getItem('ggbs_local_content');
  const localContent = localSaved ? JSON.parse(localSaved) : DEFAULT_CONTENT;

  const client = getSupabaseClient();
  if (!client) return localContent;
  
  try {
    const { data, error } = await client.from('site_settings').select('*').eq('id', 1).single();
    if (error || !data) return localContent;
    return {
      logoUrl: data.logo_url || localContent.logoUrl,
      heroVideoUrl: data.hero_video_url || localContent.heroVideoUrl,
      fightVideoUrl: data.fight_video_url || localContent.fightVideoUrl,
      glovesImageUrl: data.gloves_image_url || localContent.glovesImageUrl,
      evolutionImageUrl: data.evolution_image_url || localContent.evolutionImageUrl,
      revenueImageUrl: data.revenue_image_url || localContent.revenueImageUrl,
    };
  } catch {
    return localContent;
  }
};

export const updateSiteContent = async (content: SiteContent) => {
  // Always keep a local copy for instant UI updates
  localStorage.setItem('ggbs_local_content', JSON.stringify(content));

  const client = getSupabaseClient();
  if (!client) {
    throw new Error("Local preview saved. To sync GLOBALLY, please enter your Supabase credentials in the 'DB Settings' tab.");
  }

  const payload = {
    logo_url: content.logoUrl,
    hero_video_url: content.heroVideoUrl,
    fight_video_url: content.fightVideoUrl,
    gloves_image_url: content.glovesImageUrl,
    evolution_image_url: content.evolutionImageUrl,
    revenue_image_url: content.revenueImageUrl,
  };
  
  const { error } = await client.from('site_settings').upsert([{ id: 1, ...payload }]);
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
  const { data, error } = await client.from('investors').select('*').order('created_at', { ascending: false });
  return error ? [] : data || [];
};

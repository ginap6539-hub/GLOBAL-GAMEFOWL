
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SiteContent, InvestorLead } from '../types';
import { DEFAULT_CONTENT } from '../constants';

const getCredentials = () => {
  const storedUrl = localStorage.getItem('ggbs_supabase_url');
  const storedKey = localStorage.getItem('ggbs_supabase_key');
  
  const url = (process.env.SUPABASE_URL || (window as any)._env_?.SUPABASE_URL || storedUrl || '').trim();
  const key = (process.env.SUPABASE_ANON_KEY || (window as any)._env_?.SUPABASE_ANON_KEY || storedKey || '').trim();

  return { url, key };
};

const creds = getCredentials();

export const supabase: SupabaseClient | null = (creds.url && creds.key) 
  ? createClient(creds.url, creds.key) 
  : null;

export const uploadFile = async (file: File): Promise<string> => {
  if (!supabase) {
    // Fallback: If no Supabase, return a local Object URL for preview purposes
    // This prevents the "Not Initialized" error from breaking the Admin experience
    console.warn("Supabase not initialized. File will only be visible locally until DB is connected.");
    return URL.createObjectURL(file);
  }
  
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `${fileName}`;

  try {
    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('media')
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (err) {
    console.error("Storage error:", err);
    // Even if storage fails, we return a local URL so the admin can at least preview the change
    return URL.createObjectURL(file);
  }
};

export const fetchSiteContent = async (): Promise<SiteContent> => {
  const localSaved = localStorage.getItem('ggbs_local_content');
  const localContent = localSaved ? JSON.parse(localSaved) : DEFAULT_CONTENT;

  if (!supabase) return localContent;
  
  try {
    const { data, error } = await supabase.from('site_settings').select('*').eq('id', 1).single();
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
  // Always save locally first so the admin sees the change immediately
  localStorage.setItem('ggbs_local_content', JSON.stringify(content));

  if (!supabase) {
    throw new Error("Local changes saved. To make these changes visible to ALL viewers, please connect your Supabase DB in the 'DB Settings' tab.");
  }

  const payload = {
    logo_url: content.logoUrl,
    hero_video_url: content.heroVideoUrl,
    fight_video_url: content.fightVideoUrl,
    gloves_image_url: content.glovesImageUrl,
    evolution_image_url: content.evolutionImageUrl,
    revenue_image_url: content.revenueImageUrl,
  };
  
  const { error } = await supabase.from('site_settings').upsert([{ id: 1, ...payload }]);
  if (error) throw error;
};

export const submitInvestorLead = async (lead: InvestorLead) => {
  if (!supabase) return;
  const { error } = await supabase.from('investors').insert([lead]);
  if (error) throw error;
};

export const fetchInvestorLeads = async (): Promise<InvestorLead[]> => {
  if (!supabase) return [];
  const { data, error } = await supabase.from('investors').select('*').order('created_at', { ascending: false });
  return error ? [] : data || [];
};

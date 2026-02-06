
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SiteContent, InvestorLead } from '../types';
import { DEFAULT_CONTENT } from '../constants';

const supabaseUrl = process.env.SUPABASE_URL || (window as any)._env_?.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || (window as any)._env_?.SUPABASE_ANON_KEY || '';

export const supabase: SupabaseClient | null = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;

export const uploadFile = async (file: File): Promise<string> => {
  if (!supabase) throw new Error("Supabase not initialized");
  
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('media')
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from('media')
    .getPublicUrl(filePath);

  return data.publicUrl;
};

export const fetchSiteContent = async (): Promise<SiteContent> => {
  if (!supabase) return DEFAULT_CONTENT;
  try {
    const { data, error } = await supabase.from('site_settings').select('*').eq('id', 1).single();
    if (error || !data) return DEFAULT_CONTENT;
    return {
      logoUrl: data.logo_url || DEFAULT_CONTENT.logoUrl,
      heroVideoUrl: data.hero_video_url || DEFAULT_CONTENT.heroVideoUrl,
      fightVideoUrl: data.fight_video_url || DEFAULT_CONTENT.fightVideoUrl,
      glovesImageUrl: data.gloves_image_url || DEFAULT_CONTENT.glovesImageUrl,
      evolutionImageUrl: data.evolution_image_url || DEFAULT_CONTENT.evolutionImageUrl,
      revenueImageUrl: data.revenue_image_url || DEFAULT_CONTENT.revenueImageUrl,
    };
  } catch {
    return DEFAULT_CONTENT;
  }
};

export const updateSiteContent = async (content: SiteContent) => {
  if (!supabase) return;
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

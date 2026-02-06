
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SiteContent, InvestorLead } from '../types';
import { DEFAULT_CONTENT } from '../constants';

// Try standard, Vite, and Next.js environment variable prefixes for maximum compatibility on Vercel
const supabaseUrl = 
  process.env.SUPABASE_URL || 
  (window as any)._env_?.SUPABASE_URL || 
  '';

const supabaseKey = 
  process.env.SUPABASE_ANON_KEY || 
  (window as any)._env_?.SUPABASE_ANON_KEY || 
  '';

// Initialize client only if credentials are provided
export const supabase: SupabaseClient | null = (supabaseUrl && supabaseUrl.trim() !== '' && supabaseKey && supabaseKey.trim() !== '') 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;

export const fetchSiteContent = async (): Promise<SiteContent> => {
  if (!supabase) {
    console.warn('Supabase credentials missing. Check Vercel Environment Variables: SUPABASE_URL and SUPABASE_ANON_KEY');
    const local = localStorage.getItem('ggbs_site_content');
    return local ? JSON.parse(local) : DEFAULT_CONTENT;
  }

  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('id', 1)
      .single();

    if (error || !data) {
      console.warn('Supabase fetch failed or table empty, using local fallback:', error);
      const local = localStorage.getItem('ggbs_site_content');
      return local ? JSON.parse(local) : DEFAULT_CONTENT;
    }

    return {
      logoUrl: data.logo_url || DEFAULT_CONTENT.logoUrl,
      heroVideoUrl: data.hero_video_url || DEFAULT_CONTENT.heroVideoUrl,
      fightVideoUrl: data.fight_video_url || DEFAULT_CONTENT.fightVideoUrl,
      glovesImageUrl: data.gloves_image_url || DEFAULT_CONTENT.glovesImageUrl,
      evolutionImageUrl: data.evolution_image_url || DEFAULT_CONTENT.evolutionImageUrl,
      revenueImageUrl: data.revenue_image_url || DEFAULT_CONTENT.revenueImageUrl,
    };
  } catch (err) {
    console.error('Unexpected error in fetchSiteContent:', err);
    const local = localStorage.getItem('ggbs_site_content');
    return local ? JSON.parse(local) : DEFAULT_CONTENT;
  }
};

export const updateSiteContent = async (content: SiteContent) => {
  // Update local storage first for instant feedback
  localStorage.setItem('ggbs_site_content', JSON.stringify(content));

  if (!supabase) {
    console.error('Cannot save to Supabase: Client not initialized. Check Vercel Settings.');
    return;
  }

  const payload = {
    logo_url: content.logoUrl,
    hero_video_url: content.heroVideoUrl,
    fight_video_url: content.fightVideoUrl,
    gloves_image_url: content.glovesImageUrl,
    evolution_image_url: content.evolutionImageUrl,
    revenue_image_url: content.revenueImageUrl,
  };

  const { error } = await supabase
    .from('site_settings')
    .upsert([{ id: 1, ...payload }]);

  if (error) throw error;
};

export const submitInvestorLead = async (lead: InvestorLead) => {
  if (!supabase) {
    const existing = JSON.parse(localStorage.getItem('ggbs_investor_leads') || '[]');
    const newLead = { ...lead, created_at: new Date().toISOString(), id: `local-${Date.now()}` };
    existing.push(newLead);
    localStorage.setItem('ggbs_investor_leads', JSON.stringify(existing));
    return;
  }

  const { error } = await supabase
    .from('investors')
    .insert([lead]);
  
  if (error) throw error;
};

export const fetchInvestorLeads = async (): Promise<InvestorLead[]> => {
  if (!supabase) {
    return JSON.parse(localStorage.getItem('ggbs_investor_leads') || '[]');
  }

  try {
    const { data, error } = await supabase
      .from('investors')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Error fetching investor leads:', err);
    return JSON.parse(localStorage.getItem('ggbs_investor_leads') || '[]');
  }
};

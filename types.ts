
export interface SiteContent {
  logoUrl: string;
  heroVideoUrl: string;
  fightVideoUrl: string;
  glovesImageUrl: string;
  evolutionImageUrl: string;
  revenueImageUrl: string;
}

export interface InvestorLead {
  id?: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  created_at?: string;
}

export interface RevenueData {
  label: string;
  value: number;
}


import { SiteContent } from '../types';
import { DEFAULT_CONTENT } from '../constants';

const STORAGE_KEY = 'ggbs_site_content';

export const getContent = (): SiteContent => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return DEFAULT_CONTENT;
  try {
    return { ...DEFAULT_CONTENT, ...JSON.parse(stored) };
  } catch {
    return DEFAULT_CONTENT;
  }
};

export const saveContent = (content: SiteContent): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
};

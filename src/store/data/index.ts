import { AppState } from '../../types';
import { content } from './content';
import { services } from './services';
import { prices } from './prices';
import { blogPosts } from './blogPosts';
import { cases } from './cases';
import { faqItems } from './faqItems';
import { reviews } from './reviews';
import { leadMagnets } from './leadMagnets';

export const initialData: AppState = {
  content,
  services,
  prices,
  blogPosts,
  cases,
  faqItems,
  leads: [],
  reviews,
  customBlocks: [],
  leadMagnets,
};

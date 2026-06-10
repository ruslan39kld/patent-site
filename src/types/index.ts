export interface Service {
  id: string;
  slug: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  situations: string[];
  includes: string[];
  price: any;
  duration?: string;
  duty?: string;
  forWhom?: string;
  whenToApply?: string;
  faq?: { q: string; a: string }[];
  icon?: string;
}

export interface PriceItem {
  id?: string;
  service?: string;
  serviceId?: string;
  title?: string;
  fee?: string;
  feesTax?: string;
  duty?: string;
  time?: string;
  term?: string;
}

export interface CaseItem {
  id: string;
  category: string;
  serviceId?: string;
  serviceType?: string;
  title: string;
  clientSituation?: string;
  situation?: string;
  task: string;
  solution: string;
  result: string;
  anonymous?: boolean;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  date: string;
  metaTitle: string;
  metaDesc: string;
}

export interface FaqItem {
  id: string;
  category: string;
  q: string;
  a: string;
  order: number;
}

export interface Lead {
  id: string;
  date: string;
  name: string;
  contact: string;
  task: string;
  source: string;
  status: 'new' | 'in_progress' | 'processed' | 'closed';
  comment: string;
}

export interface ReviewItem {
  id: string;
  name: string;
  company: string;
  text: string;
  service: string;
  date: string;
  published: boolean;
  onHome: boolean;
}

export interface CustomBlock {
  id: string;
  type: string;
  title: string;
  subtitle?: string;
  text?: string;
  buttonText?: string;
  buttonLink?: string;
  active: boolean;
}

export interface LeadMagnet {
  id: string;
  title: string;
  description: string;
  type: string;
  items?: string[];
}

export interface AdminContent {
  phone: string;
  email: string;
  telegram: string;
  whatsapp: string;
  heroTitle: string;
  heroSubtitle: string;
  heroStatus: string;
  aboutText: string;
  heroActive?: boolean;
  ctaActive?: boolean;
  ctaTitle?: string;
  ctaButton?: string;
  badges?: { title: string; desc: string; active?: boolean }[];
  cards?: { title: string; desc: string; linkTitle: string; linkHref: string; active?: boolean }[];
  risks?: { title: string; active?: boolean }[];
  process?: { title: string; active?: boolean }[];
}

export interface AppState {
  services: Service[];
  prices: PriceItem[];
  cases: CaseItem[];
  blogPosts: BlogPost[];
  faqItems: FaqItem[];
  leads: Lead[];
  reviews: ReviewItem[];
  customBlocks: CustomBlock[];
  content: AdminContent;
  leadMagnets: LeadMagnet[];
}

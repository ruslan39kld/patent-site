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
  image?: string;
}

export interface PriceItem {
  id: string;
  categoryId: string;
  name: string;
  price: string;
  tax: string;
}

export interface CaseItem {
  id: string;
  category: string;
  categoryLabel?: string;
  categoryColor?: string;
  serviceId?: string;
  serviceType?: string;
  title: string;
  clientSituation?: string;
  situation?: string;
  task: string;
  solution: string;
  result: string;
  anonymous?: boolean;
  image?: string;
  date?: string;
  shortDesc?: string;
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
  type?: string;
  source: string;
  status: 'new' | 'in_progress' | 'processed' | 'closed';
  comment: string;
  files?: { name: string; url: string; size?: number; type?: string }[];
}

export interface ReviewItem {
  id: string;
  name: string;
  company?: string;
  initials?: string;
  rating?: number;
  text: string;
  service: string;
  tag?: string;
  date?: string;
  published?: boolean;
  onHome?: boolean;
  image?: string;
  reviewType?: 'text' | 'image';
  reviewImage?: string;
  media?: {
    type: 'image' | 'pdf';
    url: string;
    name: string;
  }[];
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
  bgColor?: string;
  animation?: string;
  image?: string;
  imagePosition?: 'left' | 'right' | 'center' | 'top' | 'bottom';
  insertAfter?: string;
}

export interface LeadMagnet {
  id: string;
  title: string;
  description: string;
  type: string;
  items?: string[];
}

export interface AdminContent {
  headerLogoText?: string;
  headerLogoSubtitle?: string;
  headerLogoImage?: string;
  phone: string;
  email: string;
  emailForeign?: string;
  emailRF?: string;
  telegram: string;
  whatsapp: string;
  vk?: string;
  max?: string;
  stimit?: string;
  heroImage?: string;
  risksImage?: string;
  aboutImage?: string;
  quizTag?: string;
  quizTitle?: string;
  quizSubtitle?: string;
  ctaLink?: string;
  ctaDesc?: string;
  aboutTitle?: string;
  aboutCards?: { title: string; desc: string; active?: boolean }[];
  heroTitle: string;
  heroSubtitle: string;
  heroStatus: string;
  aboutText: string;
  heroActive?: boolean;
  ctaActive?: boolean;
  ctaTitle?: string;
  ctaButton?: string;
  badges?: { title: string; desc: string; active?: boolean }[];
  contactItems?: { id: string; type: 'phone' | 'email' | 'social'; label: string; shortLabel?: string; value: string; isActive?: boolean }[];
  cards?: { title: string; desc: string; linkTitle: string; linkHref: string; active?: boolean }[];
  risks?: { title: string; active?: boolean }[];
  process?: { title: string; desc?: string; image?: string; active?: boolean }[];
  certificates?: { name: string; type: string; image?: string; active?: boolean }[];
  patents?: { name: string; type: string; image?: string; active?: boolean }[];
  pricingBlock?: {
    subtitle: string;
    title: string;
    text: string;
    badges: string[];
    buttonText: string;
    image?: string;
  };
  adminLogin?: string;
  adminPassword?: string;
  [key: string]: any;
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
  stats?: {
    totalVisits: number;
    todayVisits: number;
    lastVisitDate: string;
    viewsHistory: { date: string; visits: number }[];
  };
  botConfig?: {
    systemPrompt: string;
    greeting: string;
    knowledgeBase: string;
    useGigaChat: boolean;
    documents?: {
      id: string;
      name: string;
      size: number;
      type: string;
      uploadDate: string;
      extractedText: string;
    }[];
  };
}

export interface Tool {
  id: string;
  name: string;
  image: string;
  stock: number;
  priceBuy?: number;
  priceRent: number;
  categories: string[];
  descriptionShort?: string;
  descriptionFull?: string;
  rating?: number;
  sku?: string;
  weight?: string;
  packagingDimensions?: string;
  brand?: string;
  maxDrillBitSize?: string;
  power?: string;
  cordLength?: string;
  warranty?: string;
  rotationSpeed?: string;
  features?: string[];
  specs?: { [key: string]: string };
  howToUseSteps?: HowToUseStep[];
  lowStockThreshold?: number;
}

export interface HowToUseStep {
  id: string;
  title: string;
  mediaUrl: string;
  description: string;
}

export interface BlogArticle {
  slug: string;
  title: string;
  subtitle?: string;
  excerpt: string;
  thumbnail: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  duration: string;
  cost: string;
  content?: string; // Full markdown/HTML content for the blog page
  relatedProducts?: Tool[];
  toc?: { id: string; title: string; level: number }[];
  date?: string; // Optional publish date
}

export interface CategoryInfo {
  id: string;
  name: string;
  image: string;
  aiHint?: string;
}

export interface QuickTopic {
  id: string;
  text: string;
  link: string; // Could be a filtered product list or blog list
}

export interface CartItem extends Tool {
  rentalDuration: string; // e.g., "1 day", "3 days", "1 week"
  quantity: number; // Usually 1 for rentals, but good to have
}

export interface AddonService {
  id: string;
  name: string;
  price: number;
  selected: boolean;
}


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
  aiHint?: string;
}

export interface HowToUseStep {
  id: string;
  title: string;
  mediaUrl: string;
  description: string;
  aiHint?: string;
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
  aiHint?: string;
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
  rentalDuration: string; // e.g., "1day", "3days", "1week". For 'buy', could be 'N/A' or a default.
  quantity: number;
  purchaseType: 'rent' | 'buy'; // To distinguish between renting and buying
}

export interface AddonService {
  id: string;
  name: string;
  price: number;
  selected: boolean;
}

export interface RentalEntryItem extends Omit<Tool, 'stock' | 'categories' | 'descriptionFull' | 'rating' | 'specs' | 'howToUseSteps' | 'lowStockThreshold'> {
  quantity: number;
  purchaseType: 'rent' | 'buy';
  rentalDuration?: string; // Only relevant if purchaseType is 'rent'
  priceAtRental: number; // Price per item (either buy price or calculated rent price for duration)
}

export interface RentalEntry {
  id: string; // e.g., timestamp or unique order ID
  items: RentalEntryItem[];
  totalAmount: number;
  rentalDate: string; // Date of order/payment
  status: 'Confirmed' | 'Processing' | 'Active' | 'Awaiting Return' | 'Returned' | 'Payment Failed'; // Simplified status
  // Potentially add user ID, delivery details, etc. in a real app
  // For rental items, also store the specific rental period (start/end dates)
  rentalStartDate?: string;
  rentalDueDate?: string;
}

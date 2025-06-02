
import type { Tool, CategoryInfo, BlogArticle, QuickTopic, HowToUseStep } from '@/types';

export const mockCategories: CategoryInfo[] = [
  { id: 'basic', name: 'Basic Tools', image: 'https://placehold.co/300x200.png', aiHint: 'tools hammer' },
  { id: 'construction', name: 'Construction / Concrete Tools', image: 'https://placehold.co/300x200.png', aiHint: 'concrete mixer' },
  { id: 'measuring', name: 'Measuring and Testing Tools', image: 'https://placehold.co/300x200.png', aiHint: 'tape measure' },
  { id: 'home-repair', name: 'Home Repair Tools', image: 'https://placehold.co/300x200.png', aiHint: 'toolbox wrench' },
  { id: 'electrical-general', name: 'Electrical Tools', image: 'https://placehold.co/300x200.png', aiHint: 'multimeter pliers' },
  { id: 'electrical-system', name: 'Electrical System Tools', image: 'https://placehold.co/300x200.png', aiHint: 'circuit breaker' },
  { id: 'accessories', name: 'Accessories / Safety Equipment', image: 'https://placehold.co/300x200.png', aiHint: 'safety goggles' },
  { id: 'gardening', name: 'Gardening Tools', image: 'https://placehold.co/300x200.png', aiHint: 'shovel rake' },
];

export const mockTools: Tool[] = [
  {
    id: '1',
    name: 'Heavy Duty Electric Drill XR-5000',
    image: 'https://placehold.co/400x400.png',
    aiHint: 'electric drill',
    stock: 3,
    lowStockThreshold: 5,
    priceBuy: 3500,
    priceRent: 500,
    categories: ['basic', 'electrical-general'],
    descriptionShort: 'A powerful drill for all your home and professional needs. Comes with multiple attachments.',
    descriptionFull: 'The XR-5000 is a versatile and robust electric drill designed for a wide range of applications. Whether you are a DIY enthusiast or a professional contractor, this drill offers the power and precision you need. Features variable speed control, a comfortable grip, and a durable chuck.',
    rating: 4.5,
    sku: 'HD-ED-XR5000',
    weight: '2.5 kg',
    packagingDimensions: '30cm x 20cm x 10cm',
    brand: 'PowerTool Pro',
    power: '750W',
    cordLength: '3m',
    warranty: '2 years',
    rotationSpeed: '0-3000 RPM',
    features: ['Variable speed control', 'Keyless chuck', 'Ergonomic handle', 'LED work light'],
    specs: {
      Voltage: '220-240V',
      Frequency: '50Hz',
      'Chuck Capacity': '1.5-13mm',
      'Max Drilling (Wood)': '30mm',
      'Max Drilling (Steel)': '13mm',
      'Max Drilling (Masonry)': '16mm',
    },
    howToUseSteps: [
      { id: 'step1', title: 'Safety First', mediaUrl: 'https://placehold.co/600x400.png', description: 'Always wear safety goggles and gloves before operating the drill.', aiHint: 'safety equipment' },
      { id: 'step2', title: 'Insert Bit', mediaUrl: 'https://placehold.co/600x400.png', description: 'Ensure the drill is unplugged. Open the chuck, insert the desired drill bit, and tighten the chuck firmly.', aiHint: 'drill bit' },
      { id: 'step3', title: 'Set Speed', mediaUrl: 'https://placehold.co/600x400.png', description: 'Select the appropriate speed setting for your material. Lower speeds for metal, higher for wood.', aiHint: 'speed control' },
      { id: 'step4', title: 'Drilling', mediaUrl: 'https://placehold.co/600x400.png', description: 'Hold the drill firmly with both hands. Apply steady pressure and begin drilling.', aiHint: 'drilling wood' },
    ]
  },
  {
    id: '2',
    name: 'Professional Laser Level Kit',
    image: 'https://placehold.co/400x400.png',
    aiHint: 'laser level',
    stock: 8,
    lowStockThreshold: 3,
    priceBuy: 2200,
    priceRent: 300,
    categories: ['measuring'],
    descriptionShort: 'Achieve perfect alignment with this professional-grade laser level. Ideal for hanging pictures, installing shelves, and more.',
    rating: 4.8,
  },
  {
    id: '3',
    name: 'Compact Circular Saw CS-150',
    image: 'https://placehold.co/400x400.png',
    aiHint: 'circular saw',
    stock: 5,
    priceRent: 600,
    categories: ['construction', 'electrical-general'],
    descriptionShort: 'Lightweight yet powerful circular saw for precise cuts in wood and plastic.',
    rating: 4.2,
  },
  {
    id: '4',
    name: 'Industrial Wet/Dry Vacuum Cleaner',
    image: 'https://placehold.co/400x400.png',
    aiHint: 'vacuum cleaner',
    stock: 2,
    lowStockThreshold: 2,
    priceBuy: 4800,
    priceRent: 750,
    categories: ['home-repair', 'accessories'],
    descriptionShort: 'High-capacity vacuum for cleaning up workshops, garages, and renovation sites.',
    rating: 4.6,
  },
  {
    id: '5',
    name: 'Basic Hand Tool Set (25 Pieces)',
    image: 'https://placehold.co/400x400.png',
    aiHint: 'tool set',
    stock: 15,
    priceBuy: 1200,
    priceRent: 150,
    categories: ['basic', 'home-repair'],
    descriptionShort: 'Essential hand tools for everyday repairs and DIY projects. Includes hammer, screwdrivers, pliers, and more.',
    rating: 4.0,
  },
  {
    id: '6',
    name: 'Concrete Mixer CM-50L',
    image: 'https://placehold.co/400x400.png',
    aiHint: 'concrete mixer',
    stock: 4,
    priceRent: 1200,
    categories: ['construction'],
    descriptionShort: '50-liter capacity concrete mixer for small to medium-sized projects.',
    rating: 4.3,
  },
];

export const mockQuickTopics: QuickTopic[] = [
  { id: '1', text: 'Planning to renovate? These tools might suit you.', link: '/equipment?category=home-repair' },
  { id: '2', text: 'What tools do I need for concrete work?', link: '/blog/guide-concrete-tools' },
  { id: '3', text: 'Deck building essentials', link: '/blog/deck-building-guide' },
  { id: '4', text: 'Basic tools for beginners', link: '/equipment?category=basic' },
];

export const mockBlogArticles: BlogArticle[] = [
  {
    slug: 'guide-concrete-tools',
    title: 'The Ultimate Guide to Concrete Work Tools',
    subtitle: 'Everything you need to know for your next concrete project.',
    excerpt: 'Working with concrete requires specific tools for mixing, pouring, and finishing. This guide covers the essentials...',
    thumbnail: 'https://placehold.co/400x250.png',
    aiHint: 'concrete tools',
    difficulty: 'Medium',
    duration: '2-3 hours read/prep',
    cost: 'Varies',
    content: `
      <h2>Introduction to Concrete Work</h2>
      <p>Concrete work can be challenging but rewarding. Having the right tools is crucial for success.</p>
      <img src="https://placehold.co/600x300.png" alt="Concrete work in progress" data-ai-hint="concrete pouring"/>
      <h3>1. Mixing Tools</h3>
      <p>A good quality concrete mixer can save you a lot of time and effort. For smaller jobs, a wheelbarrow and shovel might suffice.</p>
      <h3>2. Pouring and Spreading Tools</h3>
      <p>Use shovels, rakes, and concrete spreaders to distribute the concrete evenly.</p>
      <h3>3. Finishing Tools</h3>
      <p>Trowels, floats, and edgers are essential for a smooth and professional finish.</p>
      <p>Remember to always prioritize safety by wearing appropriate gear like gloves, boots, and eye protection.</p>
    `,
    relatedProducts: mockTools.filter(tool => tool.categories.includes('construction')).slice(0, 3),
    toc: [
      { id: 'intro', title: 'Introduction', level: 2 },
      { id: 'mixing', title: 'Mixing Tools', level: 3 },
      { id: 'pouring', title: 'Pouring and Spreading', level: 3 },
      { id: 'finishing', title: 'Finishing Tools', level: 3 },
      { id: 'safety', title: 'Safety Gear', level: 3 },
    ],
    date: '2023-10-26',
  },
  {
    slug: 'deck-building-guide',
    title: 'How to Build a Deck: A Beginner\'s Guide',
    excerpt: 'Learn the basics of deck construction, from planning to finishing touches. We list the tools you\'ll need.',
    thumbnail: 'https://placehold.co/400x250.png',
    aiHint: 'wood deck',
    difficulty: 'Hard',
    duration: 'Weekend project',
    cost: '฿10,000 - ฿50,000',
    date: '2023-11-05',
  },
  {
    slug: 'basic-home-repairs',
    title: 'Top 5 Basic Home Repairs You Can Do Yourself',
    excerpt: 'Save money and gain satisfaction by tackling these simple home repairs with basic tools.',
    thumbnail: 'https://placehold.co/400x250.png',
    aiHint: 'home repair',
    difficulty: 'Easy',
    duration: '1-2 hours per repair',
    cost: 'Low',
    date: '2023-09-15',
  },
  {
    slug: 'painting-like-a-pro',
    title: 'Painting Techniques for a Professional Finish',
    excerpt: 'Learn simple techniques to make your next painting project look like it was done by a professional.',
    thumbnail: 'https://placehold.co/400x250.png',
    aiHint: 'painting wall',
    difficulty: 'Easy',
    duration: '3-4 hours',
    cost: 'Low',
    date: '2023-11-10',
  },
  {
    slug: 'choosing-right-ladder',
    title: 'Choosing the Right Ladder for the Job',
    excerpt: 'Safety first! This guide helps you select the appropriate ladder for different tasks around the house.',
    thumbnail: 'https://placehold.co/400x250.png',
    aiHint: 'ladder safety',
    difficulty: 'Easy',
    duration: '30 min read',
    cost: 'Varies',
    date: '2023-10-01',
  },
  {
    slug: 'garden-tool-maintenance',
    title: 'Essential Maintenance for Your Gardening Tools',
    excerpt: 'Keep your gardening tools in top shape with these simple maintenance tips for longevity and performance.',
    thumbnail: 'https://placehold.co/400x250.png',
    aiHint: 'gardening tools',
    difficulty: 'Easy',
    duration: '1 hour',
    cost: 'Very Low',
    date: '2023-09-20',
  }
];

export const beginnerAdviceArticles: BlogArticle[] = mockBlogArticles.filter(article => article.difficulty === 'Easy');

export const getToolById = (id: string): Tool | undefined => mockTools.find(tool => tool.id === id);
export const getBlogArticleBySlug = (slug: string): BlogArticle | undefined => mockBlogArticles.find(article => article.slug === slug);

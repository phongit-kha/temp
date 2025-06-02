'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import ProductCard from '@/components/shared/ProductCard';
import { mockCategories, mockTools, mockQuickTopics, beginnerAdviceArticles, mockBlogArticles } from '@/lib/mockData';
import { ArrowRight, Search as SearchIcon, Package, BookOpen } from 'lucide-react';
import BlogCard from '@/components/shared/BlogCard';
import type { Tool as ToolType, BlogArticle as BlogArticleType, QuickTopic as QuickTopicType } from '@/types';

interface Suggestion {
  id: string;
  label: string;
  type: 'product' | 'blog' | 'topic';
  href: string;
  icon: React.ElementType;
}

export default function HomePage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [suggestionsVisible, setSuggestionsVisible] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchTerm.length > 1) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      
      const productSuggestions: Suggestion[] = mockTools
        .filter(tool => tool.name.toLowerCase().includes(lowerSearchTerm))
        .slice(0, 3)
        .map(tool => ({
          id: `product-${tool.id}`,
          label: tool.name,
          type: 'product',
          href: `/equipment/${tool.id}`,
          icon: Package,
        }));

      const blogSuggestions: Suggestion[] = mockBlogArticles
        .filter(article => 
          article.title.toLowerCase().includes(lowerSearchTerm) ||
          article.excerpt.toLowerCase().includes(lowerSearchTerm)
        )
        .slice(0, 2)
        .map(article => ({
          id: `blog-${article.slug}`,
          label: article.title,
          type: 'blog',
          href: `/blog/${article.slug}`,
          icon: BookOpen,
        }));
      
      const topicSuggestions: Suggestion[] = mockQuickTopics
        .filter(topic => topic.text.toLowerCase().includes(lowerSearchTerm))
        .slice(0, 2)
        .map(topic => ({
          id: `topic-${topic.id}`,
          label: topic.text,
          type: 'topic',
          href: topic.link,
          icon: BookOpen,
        }));
      
      const combinedSuggestions = [...productSuggestions, ...blogSuggestions, ...topicSuggestions];
      // Basic duplicate removal by href, preferring products, then blogs, then topics
      const uniqueSuggestions = Array.from(new Map(combinedSuggestions.map(s => [s.href, s])).values());
      
      setSuggestions(uniqueSuggestions.slice(0, 7));
      if (uniqueSuggestions.length > 0) {
        setSuggestionsVisible(true);
      } else {
        setSuggestionsVisible(false);
      }
    } else {
      setSuggestions([]);
      setSuggestionsVisible(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setSuggestionsVisible(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/equipment?search=${encodeURIComponent(searchTerm.trim())}`);
      setSuggestionsVisible(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center bg-secondary text-secondary-foreground">
        <Image
          src="https://placehold.co/1920x1080.png"
          alt="Workshop background"
          layout="fill"
          objectFit="cover"
          className="opacity-30"
          data-ai-hint="tools workshop"
        />
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
            Rent The Tools You Need, <br className="hidden sm:inline" />
            When You Need Them.
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            ช่างเช่า - Your trusted partner for professional tool rentals.
          </p>
          <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto">
            <div ref={searchContainerRef} className="flex relative">
              <div className="relative flex-grow">
                <Input
                  type="search"
                  placeholder="Search tools or topics (e.g., 'drill', 'deck building')"
                  className="text-base md:text-lg h-14 rounded-r-none focus:ring-0 focus:border-primary border-primary"
                  value={searchTerm}
                  onChange={handleInputChange}
                  onFocus={() => searchTerm && suggestions.length > 0 && setSuggestionsVisible(true)}
                  aria-autocomplete="list"
                  aria-expanded={suggestionsVisible && suggestions.length > 0}
                />
                {suggestionsVisible && suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 z-20 bg-card text-card-foreground border border-border rounded-md shadow-lg p-2 space-y-1">
                    {suggestions.map((suggestion) => (
                      <Link
                        key={suggestion.id}
                        href={suggestion.href}
                        className="block hover:bg-accent rounded-md"
                        onClick={() => {
                          setSearchTerm(''); // Clear search term after selection
                          setSuggestionsVisible(false);
                        }}
                      >
                        <div className="flex items-center p-2">
                          <suggestion.icon className="mr-3 h-5 w-5 text-muted-foreground flex-shrink-0" />
                          <span className="flex-grow text-sm truncate" title={suggestion.label}>{suggestion.label}</span>
                          <span className="text-xs text-muted-foreground ml-2 capitalize">
                            ({suggestion.type === 'product' ? 'Tool' : 'Guide'})
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              <Button type="submit" size="lg" className="h-14 rounded-l-none px-8">
                <SearchIcon className="h-5 w-5 mr-2" />
                Search Now
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* Quick Topic Buttons */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {mockQuickTopics.map((topic) => (
              <Button
                key={topic.id}
                variant="outline"
                className="h-auto py-6 text-base text-left justify-start items-start flex-col hover:bg-accent hover:text-accent-foreground transition-all duration-300 group"
                asChild
              >
                <Link href={topic.link}>
                  <span className="font-medium block mb-2 group-hover:underline">{topic.text}</span>
                  <ArrowRight className="h-5 w-5 mt-auto self-end opacity-70 group-hover:opacity-100 transition-opacity" />
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Category Section */}
      <section className="py-12 md:py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="font-headline text-3xl font-bold text-center mb-10">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {mockCategories.map((category) => (
              <Link key={category.id} href={`/equipment?category=${category.id}`} className="block group">
                <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <CardHeader className="p-0">
                    <Image
                      src={category.image}
                      alt={category.name}
                      width={300}
                      height={200}
                      className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                      data-ai-hint={category.aiHint}
                    />
                  </CardHeader>
                  <CardContent className="p-4">
                    <h3 className="font-headline text-lg font-semibold text-center group-hover:text-accent transition-colors">{category.name}</h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Tools Section */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="font-headline text-3xl font-bold mb-8">Popular Tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockTools.slice(0, 4).map((tool) => (
              <ProductCard key={tool.id} tool={tool} />
            ))}
          </div>
        </div>
      </section>

      {/* All Products Section */}
      <section className="py-12 md:py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-headline text-3xl font-bold">All Products</h2>
            <Button variant="outline" asChild>
              <Link href="/equipment">View All Products <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {mockTools.slice(0, 8).map((tool) => ( 
              <ProductCard key={tool.id} tool={tool} />
            ))}
          </div>
        </div>
      </section>

      {/* Beginner Tools/Advice Section */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-headline text-3xl font-bold">Beginner Friendly</h2>
            <Button variant="outline" asChild>
              <Link href="/blog?category=beginner">View All Blogs <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(beginnerAdviceArticles.length > 0 ? beginnerAdviceArticles : mockBlogArticles).slice(0, 3).map((article) => (
              <BlogCard key={article.slug} article={article} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

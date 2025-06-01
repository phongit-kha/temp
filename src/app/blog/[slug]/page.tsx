'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { getBlogArticleBySlug, mockTools } from '@/lib/mockData';
import type { BlogArticle, Tool } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ProductCard from '@/components/shared/ProductCard';
import { CalendarDays, Clock, DollarSign, Zap, ListChecks, ShoppingCart, ExternalLink } from 'lucide-react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

const BlogPage = () => {
  const params = useParams();
  const slug = params.slug as string;
  const [article, setArticle] = useState<BlogArticle | null>(null);
  const [activeTocId, setActiveTocId] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (slug) {
      const fetchedArticle = getBlogArticleBySlug(slug);
      setArticle(fetchedArticle);
      if (fetchedArticle?.toc && fetchedArticle.toc.length > 0) {
        setActiveTocId(fetchedArticle.toc[0].id);
      }
    }
  }, [slug]);

  // TOC scrollspy effect
  useEffect(() => {
    const observerOptions = {
      rootMargin: '-20% 0px -60% 0px', // Adjust to highlight when section is in middle of viewport
      threshold: 0, // Trigger as soon as any part is visible within rootMargin
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveTocId(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const headings = contentRef.current?.querySelectorAll('h2[id], h3[id], h4[id]');
    
    headings?.forEach(heading => observer.observe(heading));

    return () => observer.disconnect();
  }, [article]);


  if (!article) {
    return <div className="container mx-auto px-4 py-8 text-center">Loading article...</div>;
  }

  const handleTocClick = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    setActiveTocId(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <article className="max-w-5xl mx-auto">
        {/* Article Header */}
        <header className="mb-8">
          <h1 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 leading-tight">{article.title}</h1>
          {article.subtitle && <p className="text-lg lg:text-xl text-muted-foreground mb-4">{article.subtitle}</p>}
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground mb-4">
            {article.date && <span className="flex items-center"><CalendarDays className="h-4 w-4 mr-1.5 text-primary" /> Published: {new Date(article.date).toLocaleDateString()}</span>}
            <span className="flex items-center"><Clock className="h-4 w-4 mr-1.5 text-primary" /> Duration: {article.duration}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="text-xs"><Zap className="h-3 w-3 mr-1" /> {article.difficulty}</Badge>
            <Badge variant="secondary" className="text-xs"><DollarSign className="h-3 w-3 mr-1" /> Cost: {article.cost}</Badge>
          </div>
        </header>
        
        {article.relatedProducts && article.relatedProducts.length > 0 && (
          <div className="my-6 text-right">
             <Button asChild>
              <Link href={`/equipment?filter_preset=${article.slug}`}> {/* Example filter preset */}
                <ListChecks className="mr-2 h-4 w-4" /> View Related Product List
              </Link>
            </Button>
          </div>
        )}


        <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-12">
          {/* Table of Contents (Desktop) */}
          {article.toc && article.toc.length > 0 && (
            <aside className="hidden lg:block sticky top-24 self-start border rounded-lg p-4 max-h-[calc(100vh-10rem)] overflow-y-auto">
              <h2 className="text-lg font-semibold mb-3 font-headline">Table of Contents</h2>
              <nav>
                <ul className="space-y-1.5">
                  {article.toc.map(item => (
                    <li key={item.id} style={{ paddingLeft: `${(item.level - 2) * 1}rem` }}> {/* Assuming h2 is level 2 */}
                      <a
                        href={`#${item.id}`}
                        onClick={(e) => handleTocClick(item.id, e)}
                        className={`block text-sm rounded-md px-2 py-1.5 transition-colors ${
                          activeTocId === item.id
                            ? 'bg-accent text-accent-foreground font-medium'
                            : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                        }`}
                      >
                        {item.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>
          )}

          {/* Article Content */}
          <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-headline prose-a:text-primary hover:prose-a:underline prose-img:rounded-md prose-img:shadow-md" ref={contentRef}>
            {/* Main Image - can be part of markdown or explicitly placed */}
            <div className="relative aspect-video rounded-lg overflow-hidden mb-8 shadow-xl">
                <Image src={article.thumbnail} alt={article.title} layout="fill" objectFit="cover" priority data-ai-hint={article.aiHint || "blog header"} />
            </div>
            
            {/* Render HTML content from mock data - Sanitize in real app! */}
            <div dangerouslySetInnerHTML={{ __html: article.content || '<p>Content not available.</p>' }} />
          </div>
        </div>

        {/* Required Tools / Materials Section */}
        {article.relatedProducts && article.relatedProducts.length > 0 && (
          <section className="mt-12 pt-8 border-t">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-headline text-2xl font-bold">Required Tools & Materials</h2>
              <Button variant="default">
                <ShoppingCart className="mr-2 h-4 w-4" /> Add All to Cart
              </Button>
            </div>
            <ScrollArea className="w-full pb-4">
              <div className="flex space-x-6">
                {article.relatedProducts.map(tool => (
                  <div key={tool.id} className="w-64 shrink-0">
                    <ProductCard tool={tool} />
                  </div>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </section>
        )}
      </article>
    </div>
  );
};

export default BlogPage;

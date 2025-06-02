
'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getBlogArticleBySlug } from '@/lib/mockData'; // Removed mockTools as it's not used here
import type { BlogArticle } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ProductCard from '@/components/shared/ProductCard';
import { CalendarDays, Clock, DollarSign, Zap, ListChecks, ShoppingCart } from 'lucide-react'; // Removed ExternalLink
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

const BlogPage = () => {
  const params = useParams();
  const slug = params.slug as string;
  const [article, setArticle] = useState<BlogArticle | null>(null);
  const [activeTocId, setActiveTocId] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const tocStartIndex = 1; // For numbering TOC items

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
      rootMargin: '-20% 0px -60% 0px', 
      threshold: 0, 
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
      // Adjusted scroll position to account for sticky header or other offsets
      const yOffset = -80; // Adjust this value as needed
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <article className="max-w-5xl mx-auto">
        {/* Article Header */}
        <header className="mb-8">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-3">
            <h1 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight flex-1">
              {article.title}
            </h1>
            {article.relatedProducts && article.relatedProducts.length > 0 && (
              <Button asChild variant="default" size="sm" className="shrink-0">
                <Link href={`/equipment?filter_preset=${article.slug}`}>
                  <ListChecks className="mr-2 h-4 w-4" /> ดูรายการสินค้า
                </Link>
              </Button>
            )}
          </div>
          
          {article.subtitle && <p className="text-lg lg:text-xl text-muted-foreground mb-4">{article.subtitle}</p>}
          
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground mb-2">
            {article.date && <span className="flex items-center"><CalendarDays className="h-4 w-4 mr-1.5 text-primary" /> Published: {new Date(article.date).toLocaleDateString()}</span>}
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="text-xs"><Zap className="h-3 w-3 mr-1" /> {article.difficulty}</Badge>
            <Badge variant="secondary" className="text-xs"><Clock className="h-3 w-3 mr-1" /> {article.duration}</Badge>
            <Badge variant="secondary" className="text-xs"><DollarSign className="h-3 w-3 mr-1" /> Cost: {article.cost}</Badge>
          </div>
        </header>
        
        <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-12">
          {/* Table of Contents (Desktop) - Roadmap Style */}
          {article.toc && article.toc.length > 0 && (
            <aside className="hidden lg:block sticky top-24 self-start border rounded-lg p-4 max-h-[calc(100vh-10rem)] overflow-y-auto">
              <h2 className="text-lg font-semibold mb-4 font-headline">Table of Contents</h2>
              <div className="relative"> {/* Wrapper for the line and list */}
                {/* Main vertical line: 8px from the left of this div */}
                <div 
                  className="absolute left-2 top-0 bottom-0 w-0.5 bg-border z-0"
                  aria-hidden="true"
                ></div>
                <ul className="relative z-10">
                  {article.toc.map(item => (
                    <li 
                      key={item.id} 
                      className="relative"
                      // Hierarchical indentation: each level adds 1rem.
                      style={{ paddingLeft: `${(item.level - 2) * 1}rem` }} 
                    >
                      <a
                        href={`#${item.id}`}
                        onClick={(e) => handleTocClick(item.id, e)}
                        className={cn(
                          "relative flex items-center py-1.5 text-sm transition-colors group",
                          "pl-5", // Consistent padding to align text right of the dot
                          activeTocId === item.id
                            ? 'text-primary font-semibold'
                            : 'text-muted-foreground hover:text-primary'
                        )}
                      >
                        {/* Dot: positioned to sit on the main vertical line */}
                        <span
                          className={cn(
                            "absolute top-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full border",
                            "left-[3px]", // Dot's left edge is 3px from li's content box start, centering 10px dot on 8px line
                            activeTocId === item.id 
                              ? "bg-primary border-primary ring-1 ring-primary/40 ring-offset-1 ring-offset-background" 
                              : "bg-card border-muted group-hover:border-primary"
                          )}
                          aria-hidden="true"
                        >
                        </span>
                        <span className="leading-tight">{item.title}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          )}

          {/* Article Content */}
          <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-headline prose-a:text-primary hover:prose-a:underline prose-img:rounded-md prose-img:shadow-md" ref={contentRef}>
            <div className="relative aspect-video rounded-lg overflow-hidden mb-8 shadow-xl">
                <Image src={article.thumbnail} alt={article.title} layout="fill" objectFit="cover" priority data-ai-hint={article.aiHint || "blog header"} />
            </div>
            
            <div dangerouslySetInnerHTML={{ __html: article.content || '<p>Content not available.</p>' }} />
          </div>
        </div>

        {/* Required Tools / Materials Section */}
        {article.relatedProducts && article.relatedProducts.length > 0 && (
          <section className="mt-12 pt-8 border-t">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-headline text-2xl font-bold">ของที่ต้องใช้</h2>
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


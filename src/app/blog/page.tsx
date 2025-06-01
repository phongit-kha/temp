'use client';

import { useState, useEffect } from 'react';
import BlogCard from '@/components/shared/BlogCard';
import { mockBlogArticles } from '@/lib/mockData';
import type { BlogArticle } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ListFilter, Search, BookOpenText } from 'lucide-react';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';

const ITEMS_PER_PAGE = 6;

const BlogListPage = () => {
  const [articles, setArticles] = useState<BlogArticle[]>(mockBlogArticles);
  const [filteredArticles, setFilteredArticles] = useState<BlogArticle[]>(mockBlogArticles);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all'); // Example, expand with more categories
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    let tempArticles = mockBlogArticles;

    if (searchTerm) {
      tempArticles = tempArticles.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    // Add category filter logic if categories are added to BlogArticle type
    if (difficultyFilter !== 'all') {
      tempArticles = tempArticles.filter(article => article.difficulty.toLowerCase() === difficultyFilter);
    }
    
    setFilteredArticles(tempArticles);
    setCurrentPage(1); // Reset to first page on filter change
  }, [searchTerm, categoryFilter, difficultyFilter]);

  const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);
  const paginatedArticles = filteredArticles.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const FilterControls = () => (
    <div className="space-y-4">
      <div>
        <label htmlFor="search-blog" className="block text-sm font-medium mb-1">Search Articles</label>
        <div className="relative">
          <Input
            id="search-blog"
            type="text"
            placeholder="Search by keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
      </div>
      <div>
        <label htmlFor="difficulty-filter" className="block text-sm font-medium mb-1">Difficulty</label>
        <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
          <SelectTrigger id="difficulty-filter">
            <SelectValue placeholder="Filter by difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Difficulties</SelectItem>
            <SelectItem value="easy">Easy</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="hard">Hard</SelectItem>
          </SelectContent>
        </Select>
      </div>
       {/* Placeholder for category filter */}
      <div>
        <label htmlFor="category-filter" className="block text-sm font-medium mb-1">Category</label>
        <Select value={categoryFilter} onValueChange={setCategoryFilter} disabled>
          <SelectTrigger id="category-filter">
            <SelectValue placeholder="Filter by category (soon)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {/* Populate with actual categories */}
          </SelectContent>
        </Select>
      </div>
    </div>
  );


  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-10 text-center">
        <BookOpenText className="h-16 w-16 mx-auto text-primary mb-4" />
        <h1 className="text-4xl font-bold font-headline mb-2">Blog Articles</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Find tips, guides, and inspiration for your next project. Learn how to use tools 효과적으로 and safely.
        </p>
      </header>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Desktop Filters */}
        <aside className="hidden md:block md:w-1/4 lg:w-1/5 sticky top-24 h-fit">
          <h2 className="text-xl font-semibold mb-4 font-headline">Filters</h2>
          <FilterControls />
        </aside>

        <main className="w-full md:w-3/4 lg:w-4/5">
          {/* Mobile Filter Trigger */}
          <div className="md:hidden mb-6">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full">
                  <ListFilter className="mr-2 h-4 w-4" /> Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] overflow-y-auto p-4">
                <h2 className="text-xl font-semibold mb-4 font-headline">Filters</h2>
                <FilterControls />
              </SheetContent>
            </Sheet>
          </div>
          
          {paginatedArticles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedArticles.map(article => (
                <BlogCard key={article.slug} article={article} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-muted-foreground">No articles found matching your criteria.</p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-12 flex justify-center items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default BlogListPage;

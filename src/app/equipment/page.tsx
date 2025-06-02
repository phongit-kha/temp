'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/shared/ProductCard';
import { mockTools, mockCategories } from '@/lib/mockData';
import type { Tool, CategoryInfo } from '@/types';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ListFilter, LayoutGrid, LayoutList } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const EquipmentListPage = () => {
  const searchParams = useSearchParams();
  const [filteredTools, setFilteredTools] = useState<Tool[]>(mockTools);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [rentalDuration, setRentalDuration] = useState<string>('any');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  
  useEffect(() => {
    const initialCategory = searchParams.get('category');
    if (initialCategory) {
      setSelectedCategories([initialCategory]);
    }
  }, [searchParams]);

  useEffect(() => {
    let tools = mockTools;

    if (searchTerm) {
      tools = tools.filter(tool => tool.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    if (selectedCategories.length > 0) {
      tools = tools.filter(tool => tool.categories.some(cat => selectedCategories.includes(cat)));
    }

    tools = tools.filter(tool => tool.priceRent >= priceRange[0] && tool.priceRent <= priceRange[1]);

    // Rental duration filtering logic would go here if we had specific durations per tool
    // For now, it's a placeholder

    setFilteredTools(tools);
  }, [selectedCategories, priceRange, rentalDuration, searchTerm]);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId) ? prev.filter(c => c !== categoryId) : [...prev, categoryId]
    );
  };

  const FilterPanelContent = () => (
    <div className="space-y-6 p-1">
      <Input 
        placeholder="Search by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full"
      />
      <Accordion type="multiple" defaultValue={['categories', 'price']} className="w-full">
        <AccordionItem value="categories">
          <AccordionTrigger className="text-base font-semibold">Categories</AccordionTrigger>
          <AccordionContent className="space-y-2 pt-2">
            {mockCategories.map((category: CategoryInfo) => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`cat-${category.id}`}
                  checked={selectedCategories.includes(category.id)}
                  onCheckedChange={() => handleCategoryChange(category.id)}
                />
                <Label htmlFor={`cat-${category.id}`} className="font-normal cursor-pointer">{category.name}</Label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="price">
          <AccordionTrigger className="text-base font-semibold">Price Range (Rent)</AccordionTrigger>
          <AccordionContent className="space-y-3 pt-3">
            <Slider
              min={0}
              max={5000}
              step={50}
              value={[priceRange[0], priceRange[1]]}
              onValueChange={(value) => setPriceRange([value[0], value[1]])}
              className="my-4"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>฿{priceRange[0]}</span>
              <span>฿{priceRange[1]}</span>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="duration">
          <AccordionTrigger className="text-base font-semibold">Rental Duration</AccordionTrigger>
          <AccordionContent className="space-y-2 pt-2">
            <Select value={rentalDuration} onValueChange={setRentalDuration}>
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="1day">1 Day</SelectItem>
                <SelectItem value="3days">3 Days</SelectItem>
                <SelectItem value="1week">1 Week</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Button onClick={() => {
        setSelectedCategories([]);
        setPriceRange([0, 5000]);
        setRentalDuration('any');
        setSearchTerm('');
      }} variant="outline" className="w-full">Clear Filters</Button>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Desktop Filter Panel */}
        <aside className="hidden md:block md:w-1/4 lg:w-1/5 sticky top-20 h-fit">
          <h2 className="text-xl font-bold mb-4 font-headline">Filters</h2>
          <FilterPanelContent />
        </aside>

        <main className="w-full md:w-3/4 lg:w-4/5">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold font-headline">Equipment List</h1>
            <div className="flex items-center gap-2">
              {/* Mobile Filter Trigger */}
              <Sheet>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="outline" size="icon">
                    <ListFilter className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[340px] p-4 overflow-y-auto">
                   <h2 className="text-xl font-bold mb-4 font-headline">Filters</h2>
                   <FilterPanelContent />
                </SheetContent>
              </Sheet>
              <Button variant={layout === 'grid' ? 'default' : 'outline'} size="icon" onClick={() => setLayout('grid')}>
                <LayoutGrid className="h-5 w-5" />
              </Button>
              <Button variant={layout === 'list' ? 'default' : 'outline'} size="icon" onClick={() => setLayout('list')}>
                <LayoutList className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {filteredTools.length > 0 ? (
            <div className={`grid gap-6 ${layout === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
              {filteredTools.map(tool => (
                <ProductCard key={tool.id} tool={tool} layout={layout === 'list' ? 'horizontal' : 'vertical'} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-muted-foreground">No tools found matching your criteria.</p>
            </div>
          )}
          {/* Pagination placeholder */}
          <div className="mt-12 flex justify-center">
            <Button variant="outline">Load More</Button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EquipmentListPage;

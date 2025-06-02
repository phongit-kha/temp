
'use client';

import { useState, useEffect, type ChangeEvent } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
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
import { Card, CardContent } from '@/components/ui/card';
import { ListFilter, LayoutGrid, LayoutList, GitCompareArrows } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { toast } from 'sonner'; // Changed import

const MAX_COMPARE_ITEMS = 4;

interface EquipmentFilterPanelProps {
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  selectedCategories: string[];
  onCategoryChange: (categoryId: string) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  rentalDuration: string;
  onRentalDurationChange: (duration: string) => void;
  onClearAllFilters: () => void;
}

const EquipmentFilterPanel: React.FC<EquipmentFilterPanelProps> = ({
  searchTerm,
  onSearchTermChange,
  selectedCategories,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  rentalDuration,
  onRentalDurationChange,
  onClearAllFilters,
}) => {
  return (
    <div className="space-y-6 p-1">
      <Input
        placeholder="Search by name..."
        value={searchTerm}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onSearchTermChange(e.target.value)}
        className="w-full"
      />
      <Accordion type="multiple" defaultValue={['categories', 'price']} className="w-full">
        <AccordionItem value="categories">
          <AccordionTrigger className="text-base font-semibold">Categories</AccordionTrigger>
          <AccordionContent className="space-y-2 pt-2">
            {mockCategories.map((category: CategoryInfo) => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox
                  id={\`cat-\${category.id}\`}
                  checked={selectedCategories.includes(category.id)}
                  onCheckedChange={() => onCategoryChange(category.id)}
                />
                <Label htmlFor={\`cat-\${category.id}\`} className="font-normal cursor-pointer">{category.name}</Label>
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
              value={priceRange}
              onValueChange={(value) => onPriceRangeChange(value as [number, number])}
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
            <Select value={rentalDuration} onValueChange={onRentalDurationChange}>
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
      <Button onClick={onClearAllFilters} variant="outline" className="w-full">Clear Filters</Button>
    </div>
  );
};

const EquipmentListPage = () => {
  const searchParams = useSearchParams();
  const [filteredTools, setFilteredTools] = useState<Tool[]>(mockTools);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [rentalDuration, setRentalDuration] = useState<string>('any');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const [selectedCompareIds, setSelectedCompareIds] = useState<string[]>([]);
  
  useEffect(() => {
    const initialCategory = searchParams.get('category');
    if (initialCategory) {
      setSelectedCategories([initialCategory]);
    }
    const initialSearchTerm = searchParams.get('search');
    if (initialSearchTerm) {
      setSearchTerm(initialSearchTerm);
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
    setFilteredTools(tools);
  }, [selectedCategories, priceRange, rentalDuration, searchTerm]);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId) ? prev.filter(c => c !== categoryId) : [...prev, categoryId]
    );
  };

  const handleToggleCompareItem = (toolId: string) => {
    setSelectedCompareIds(prevIds => {
      if (prevIds.includes(toolId)) {
        toast("Removed from Compare", { description: \`\${mockTools.find(t=>t.id === toolId)?.name} removed from comparison.\` }); // Changed toast
        return prevIds.filter(id => id !== toolId);
      } else {
        if (prevIds.length < MAX_COMPARE_ITEMS) {
          toast("Added to Compare", { description: \`\${mockTools.find(t=>t.id === toolId)?.name} added for comparison.\` }); // Changed toast
          return [...prevIds, toolId];
        } else {
          toast.error("Comparison Limit Reached", { // Changed toast
            description: \`You can only select up to \${MAX_COMPARE_ITEMS} tools for comparison.\`,
          });
          return prevIds;
        }
      }
    });
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 5000]);
    setRentalDuration('any');
    setSearchTerm('');
    setSelectedCompareIds([]);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="hidden md:block md:w-1/4 lg:w-1/5 sticky top-20 h-fit">
          <h2 className="text-xl font-bold mb-4 font-headline">Filters</h2>
          <EquipmentFilterPanel
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
            selectedCategories={selectedCategories}
            onCategoryChange={handleCategoryChange}
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
            rentalDuration={rentalDuration}
            onRentalDurationChange={setRentalDuration}
            onClearAllFilters={clearAllFilters}
          />
        </aside>

        <main className="w-full md:w-3/4 lg:w-4/5">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold font-headline">Equipment List</h1>
            <div className="flex items-center gap-2">
              <Sheet>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="outline" size="icon">
                    <ListFilter className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[340px] p-4 overflow-y-auto">
                   <h2 className="text-xl font-bold mb-4 font-headline">Filters</h2>
                   <EquipmentFilterPanel
                      searchTerm={searchTerm}
                      onSearchTermChange={setSearchTerm}
                      selectedCategories={selectedCategories}
                      onCategoryChange={handleCategoryChange}
                      priceRange={priceRange}
                      onPriceRangeChange={setPriceRange}
                      rentalDuration={rentalDuration}
                      onRentalDurationChange={setRentalDuration}
                      onClearAllFilters={clearAllFilters}
                    />
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

          {selectedCompareIds.length > 0 && (
            <Card className="mb-6 shadow-md">
              <CardContent className="p-4 flex flex-col sm:flex-row justify-between items-center gap-3">
                <p className="font-medium text-sm text-foreground">
                  {selectedCompareIds.length} / {MAX_COMPARE_ITEMS} tools selected for comparison.
                </p>
                <Button asChild>
                  <Link href={\`/compare?products=\${selectedCompareIds.join(',')}\`}>
                    <GitCompareArrows className="mr-2 h-4 w-4" /> Compare Selected
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {filteredTools.length > 0 ? (
            <div className={\`grid gap-6 \${layout === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}\`}>
              {filteredTools.map(tool => (
                <ProductCard 
                  key={tool.id} 
                  tool={tool} 
                  layout={layout === 'list' ? 'horizontal' : 'vertical'}
                  onToggleCompare={handleToggleCompareItem}
                  isSelectedForCompare={selectedCompareIds.includes(tool.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-muted-foreground">No tools found matching your criteria.</p>
            </div>
          )}
          <div className="mt-12 flex justify-center">
            <Button variant="outline">Load More</Button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EquipmentListPage;


'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams, useSearchParams } from 'next/navigation';
import { getToolById, mockTools } from '@/lib/mockData';
import type { Tool, HowToUseStep } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, ChevronLeft, ChevronRight, AlertTriangle, ShoppingCart, Tag, PlusCircle, Star, Minus, Plus } from 'lucide-react';
import { format } from "date-fns";
import ProductCard from '@/components/shared/ProductCard';
import { cn } from '@/lib/utils';
import { toast } from 'sonner'; // Changed import
import { useCart } from '@/contexts/CartContext';

const EquipmentDetailsPage = () => {
  const params = useParams();
  const searchParamsHook = useSearchParams();
  const id = params.id as string;
  const cart = useCart();
  
  const [tool, setTool] = useState<Tool | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [rentalStartDate, setRentalStartDate] = useState<Date | undefined>(new Date());
  const [rentalEndDate, setRentalEndDate] = useState<Date | undefined>(() => {
    const date = new Date();
    date.setDate(date.getDate() + 1); 
    return date;
  });
  const [activeHowToStep, setActiveHowToStep] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    if (id) {
      const fetchedTool = getToolById(id);
      if (fetchedTool) {
        setTool(fetchedTool);
        setSelectedImage(fetchedTool.image);
        if (fetchedTool.howToUseSteps && fetchedTool.howToUseSteps.length > 0) {
          setActiveHowToStep(fetchedTool.howToUseSteps[0].id);
        }
        setQuantity(1); 
      }
    }
    
    const urlAction = searchParamsHook.get('action');
  }, [id, searchParamsHook]);

  const handleQuantityChange = (newQuantity: number) => {
    if (!tool) return;
    const stock = tool.stock || 0;
    if (newQuantity >= 1 && newQuantity <= stock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = (action: 'rent' | 'buy') => {
    if (!tool) return;

    let rentalDurationString = 'N/A';
    let days = 0;
    if (action === 'rent') {
      if (rentalStartDate && rentalEndDate && rentalEndDate > rentalStartDate) {
        days = Math.ceil((rentalEndDate.getTime() - rentalStartDate.getTime()) / (1000 * 3600 * 24));
      } else {
        days = 1; 
      }
      if (days <= 0 && action === 'rent') days = 1;
      rentalDurationString = days === 1 ? '1day' : \`\${days}days\`; 
    }

    cart.addToCart(tool, action, quantity, rentalDurationString);
    
    toast.success("Added to Cart!", { // Changed toast
      description: \`\${tool.name} (x\${quantity}) has been added to your cart for \${action}\${action === 'rent' ? \` (\${days} day\${days !==1 ? 's':''})\` : ''}.\`,
    });
  };

  if (!tool) {
    return <div className="container mx-auto px-4 py-8 text-center">Loading tool details or tool not found...</div>;
  }

  const stockColor = tool.stock <= (tool.lowStockThreshold ?? 2) ? 'text-red-600' : 'text-green-600';
  const isLowStock = tool.stock <= (tool.lowStockThreshold ?? 2);
  const purchasePrice = tool.priceBuy;
  const rentPricePerDay = tool.priceRent;
  
  let rentalDays = 0;
  if (rentalStartDate && rentalEndDate && rentalEndDate > rentalStartDate) {
    rentalDays = Math.ceil((rentalEndDate.getTime() - rentalStartDate.getTime()) / (1000 * 3600 * 24));
  }
  const totalRentalPrice = rentalDays * rentPricePerDay * quantity;
  const totalPurchasePrice = purchasePrice ? purchasePrice * quantity : 0;
  const isPurchaseCheaper = purchasePrice && totalRentalPrice > 0 && rentalDays > 0 ? totalPurchasePrice < totalRentalPrice : false;

  const recommendedProducts = mockTools.filter(t => t.id !== tool.id && t.categories.some(cat => tool.categories.includes(cat))).slice(0, 4);

  const handleHowToStepClick = (stepId: string) => {
    setActiveHowToStep(stepId);
  };
  
  const currentStepIndex = tool.howToUseSteps?.findIndex(step => step.id === activeHowToStep) ?? -1;
  const currentStepData = tool.howToUseSteps && currentStepIndex !== -1 ? tool.howToUseSteps[currentStepIndex] : null;

  const navigateStep = (direction: 'prev' | 'next') => {
    if (!tool.howToUseSteps) return;
    let newIndex = currentStepIndex;
    if (direction === 'prev') {
      newIndex = Math.max(0, currentStepIndex - 1);
    } else {
      newIndex = Math.min(tool.howToUseSteps.length - 1, currentStepIndex + 1);
    }
    if (newIndex !== currentStepIndex && tool.howToUseSteps[newIndex]) {
      setActiveHowToStep(tool.howToUseSteps[newIndex].id);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 mb-12">
        <div>
          <div className="relative aspect-square rounded-lg overflow-hidden border mb-4 shadow-lg">
            <Image src={selectedImage} alt={tool.name} layout="fill" objectFit="contain" data-ai-hint={tool.aiHint || "tool detail"} />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[tool.image, ...(tool.specs?.additionalImages || [
              'https://placehold.co/100x100.png?text=Tool+View', 
              'https://placehold.co/100x100.png?text=Tool+Angle', 
              'https://placehold.co/100x100.png?text=Tool+Detail'
            ])].slice(0,4).map((imgUrl, idx) => (
              <button
                key={idx}
                className={`aspect-square rounded-md overflow-hidden border-2 transition-all \${selectedImage === imgUrl ? 'border-primary scale-105' : 'border-transparent hover:border-muted'}`}
                onClick={() => setSelectedImage(imgUrl)}
              >
                <Image src={imgUrl} alt={\`\${tool.name} thumbnail \${idx + 1}\`} width={100} height={100} className="object-cover w-full h-full" data-ai-hint="tool thumbnail" />
              </button>
            ))}
          </div>
        </div>

        <div className="py-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex gap-2">
              {tool.categories.map(cat => <Badge key={cat} variant="secondary">{cat.replace('-', ' ').toUpperCase()}</Badge>)}
            </div>
             {isLowStock && <Badge variant="destructive" className="flex items-center"><AlertTriangle className="h-4 w-4 mr-1" /> {tool.stock} items available</Badge>}
             {!isLowStock && <p className={\`text-sm font-semibold \${stockColor}\`}>{tool.stock} items available</p>}
          </div>
          
          <h1 className="text-3xl lg:text-4xl font-bold font-headline mb-1">{tool.name}</h1>
          <p className="text-sm text-muted-foreground mb-3">Product ID: {tool.sku || tool.id}</p>
          
          {tool.rating && (
            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={\`h-5 w-5 \${i < Math.round(tool.rating!) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}\`} />
              ))}
              <span className="ml-2 text-sm text-muted-foreground">({tool.rating} reviews)</span>
            </div>
          )}

          <p className="text-foreground/80 mb-6 leading-relaxed">{tool.descriptionShort}</p>

          <div className="bg-secondary p-4 rounded-lg mb-6">
            <h3 className="text-lg font-semibold mb-3 font-headline">Check Availability & Pricing</h3>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="rental-start-date" className="text-xs">Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !rentalStartDate && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {rentalStartDate ? format(rentalStartDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={rentalStartDate} onSelect={setRentalStartDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label htmlFor="rental-end-date" className="text-xs">End Date</Label>
                 <Popover>
                  <PopoverTrigger asChild>
                    <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !rentalEndDate && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {rentalEndDate ? format(rentalEndDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={rentalEndDate} onSelect={setRentalEndDate} initialFocus disabled={(date) => rentalStartDate && date < rentalStartDate} />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
             {rentalDays > 0 && (
              <p className="text-sm text-center text-muted-foreground mb-3">Selected rental period: {rentalDays} day{rentalDays > 1 ? 's' : ''}</p>
            )}
            
            <div className="mb-4">
              <Label htmlFor="quantity" className="text-xs">Quantity</Label>
              <div className="flex items-center space-x-2 mt-1">
                <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => handleQuantityChange(quantity - 1)} disabled={quantity <= 1}>
                  <Minus className="h-4 w-4" />
                </Button>
                <Input id="quantity" type="number" value={quantity} readOnly className="h-9 w-14 text-center px-1" />
                <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => handleQuantityChange(quantity + 1)} disabled={quantity >= tool.stock}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {purchasePrice && (
                <Button 
                  size="lg" 
                  variant={isPurchaseCheaper ? "default" : "outline"} 
                  className={\`flex-1 \${isPurchaseCheaper ? 'ring-2 ring-offset-2 ring-primary transform scale-105' : ''}\`}
                  onClick={() => handleAddToCart('buy')}
                  disabled={tool.stock === 0}
                >
                  <Tag className="mr-2 h-5 w-5" /> Buy: ฿{(totalPurchasePrice).toLocaleString()}
                </Button>
              )}
              <Button 
                size="lg" 
                variant={!purchasePrice || (!isPurchaseCheaper && rentalDays > 0) ? "default" : "outline"} 
                className={\`flex-1 \${!isPurchaseCheaper && purchasePrice && rentalDays > 0 ? 'ring-2 ring-offset-2 ring-primary transform scale-105' : ''}\`}
                onClick={() => handleAddToCart('rent')}
                disabled={tool.stock === 0 || rentalDays <= 0}
              >
                <ShoppingCart className="mr-2 h-5 w-5" /> 
                {rentalDays > 0 ? \`Rent (\฿\${totalRentalPrice.toLocaleString()})\` : \`Rent: \฿\${(rentPricePerDay * quantity).toLocaleString()}/day\`}
              </Button>
            </div>
            {tool.stock === 0 && <p className="text-xs text-center mt-2 text-destructive font-medium">Out of stock</p>}
            {isPurchaseCheaper && rentalDays > 0 && <p className="text-xs text-center mt-2 text-green-600 font-medium">Buying is cheaper for this rental period and quantity!</p>}
          </div>
          <Button variant="outline" className="w-full">
            <PlusCircle className="mr-2 h-5 w-5" /> Add to Compare
          </Button>
        </div>
      </div>

      {recommendedProducts.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 font-headline">Recommended Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {recommendedProducts.map(recTool => (
              <ProductCard key={recTool.id} tool={recTool} />
            ))}
          </div>
        </section>
      )}

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-1/2 lg:w-1/3 mb-6">
          <TabsTrigger value="details">Product Details</TabsTrigger>
          <TabsTrigger value="how-to-use" disabled={!tool.howToUseSteps || tool.howToUseSteps.length === 0}>How to Use</TabsTrigger>
        </TabsList>
        <TabsContent value="details">
          <Card>
            <CardContent className="p-6 grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-3 font-headline">Key Features</h3>
                <ul className="list-disc list-inside space-y-1 text-foreground/80">
                  {(tool.features || ['Feature 1', 'Feature 2', 'Feature 3', 'Longer feature description for testing purposes to see how it wraps and looks overall.']).map((feature, i) => <li key={i}>{feature}</li>)}
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3 font-headline">Specifications</h3>
                <div className="space-y-2">
                  {Object.entries(tool.specs || { Brand: tool.brand, Weight: tool.weight, Power: tool.power, Warranty: tool.warranty }).filter(([_, val]) => val).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-sm border-b pb-1">
                      <span className="font-medium text-foreground/70">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                      <span className="text-foreground/90">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="how-to-use">
          {tool.howToUseSteps && tool.howToUseSteps.length > 0 ? (
            <div className="space-y-6">
              <div className="flex items-center justify-center space-x-2 sm:space-x-4 overflow-x-auto pb-2">
                {tool.howToUseSteps.map((step, index) => (
                  <Button
                    key={step.id}
                    variant={activeHowToStep === step.id ? "default" : "outline"}
                    size="sm"
                    className={cn(
                      "rounded-full h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 p-0 text-base sm:text-lg",
                      activeHowToStep === step.id && "ring-2 ring-offset-2 ring-primary"
                    )}
                    onClick={() => handleHowToStepClick(step.id)}
                  >
                    {index + 1}
                  </Button>
                ))}
              </div>

              {currentStepData && (
                <Card className="overflow-hidden shadow-lg">
                   <CardHeader className="p-4 sm:p-6 text-center bg-secondary">
                    <CardTitle className="text-xl sm:text-2xl font-headline">{currentStepData.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 space-y-4">
                    <div className="relative aspect-video rounded-md overflow-hidden border">
                      <Image src={currentStepData.mediaUrl} alt={\`Step \${currentStepIndex + 1}: \${currentStepData.title}\`} layout="fill" objectFit="cover" data-ai-hint={currentStepData.aiHint || "tutorial image"} />
                    </div>
                    <p className="text-foreground/80 leading-relaxed text-sm sm:text-base">{currentStepData.description}</p>
                  </CardContent>
                </Card>
              )}
              
              <div className="flex justify-between mt-4">
                <Button onClick={() => navigateStep('prev')} disabled={currentStepIndex <= 0} variant="outline">
                  <ChevronLeft className="mr-2 h-4 w-4" /> Previous Step
                </Button>
                <Button onClick={() => navigateStep('next')} disabled={currentStepIndex >= (tool.howToUseSteps?.length ?? 0) -1} variant="outline">
                  Next Step <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">How-to-use guide is not available for this tool yet.</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EquipmentDetailsPage;

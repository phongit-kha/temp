import Image from 'next/image';
import Link from 'next/link';
import type { Tool } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, ShoppingCart, Tag, PlusCircle, CheckCircle } from 'lucide-react';

interface ProductCardProps {
  tool: Tool;
  layout?: 'vertical' | 'horizontal'; // For different listing styles
  onToggleCompare?: (toolId: string) => void;
  isSelectedForCompare?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ tool, layout = 'vertical', onToggleCompare, isSelectedForCompare }) => {
  const stockColor = tool.stock <= (tool.lowStockThreshold ?? 2) ? 'text-red-600' : 'text-green-600';
  const isLowStock = tool.stock <= (tool.lowStockThreshold ?? 2);

  return (
    <Card className="h-full flex flex-col overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 rounded-lg">
      <Link href={`/equipment/${tool.id}`} className="block group">
        <CardHeader className="p-0 relative">
          <Image
            src={tool.image}
            alt={tool.name}
            width={layout === 'horizontal' ? 150 : 400}
            height={layout === 'horizontal' ? 150 : 300}
            className="object-cover w-full aspect-video group-hover:scale-105 transition-transform duration-300"
            data-ai-hint={tool.aiHint}
          />
           {isLowStock && (
             <Badge variant="destructive" className="absolute top-2 right-2">Low Stock</Badge>
           )}
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <CardTitle className="text-lg font-headline mb-1 h-14 line-clamp-2 leading-tight group-hover:text-accent transition-colors">
            {tool.name}
          </CardTitle>
          <p className={`text-sm font-medium ${stockColor} mb-2`}>
            {tool.stock} available for rent
          </p>
          <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
            {tool.descriptionShort}
          </p>
        </CardContent>
      </Link>
      <CardFooter className="p-4 pt-2 flex flex-col gap-2">
        <div className="flex flex-col sm:flex-row gap-2">
          {tool.priceBuy && (
            <Button variant="outline" className="w-full sm:w-auto whitespace-normal" asChild>
              <Link href={`/equipment/${tool.id}?action=buy`}>
                <Tag className="mr-2 h-4 w-4" /> Buy: ฿{tool.priceBuy.toLocaleString()}
              </Link>
            </Button>
          )}
          <Button variant="default" className="w-full sm:w-auto whitespace-normal" asChild>
             <Link href={`/equipment/${tool.id}?action=rent`}>
              <ShoppingCart className="mr-2 h-4 w-4" /> Rent: ฿{tool.priceRent.toLocaleString()}
            </Link>
          </Button>
        </div>
        {/* The "Add to Compare" button was here and has been removed */}
      </CardFooter>
    </Card>
  );
};

export default ProductCard;

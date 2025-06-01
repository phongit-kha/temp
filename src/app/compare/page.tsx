'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { getToolById, mockTools } from '@/lib/mockData';
import type { Tool } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, XCircle, ShoppingCart, Tag } from 'lucide-react';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { ScrollArea } from '@/components/ui/scroll-area';

const MAX_COMPARE_ITEMS = 4;

const ComparePage = () => {
  const searchParams = useSearchParams();
  const [comparedItems, setComparedItems] = useState<(Tool | null)[]>(new Array(MAX_COMPARE_ITEMS).fill(null));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [slotToFill, setSlotToFill] = useState<number | null>(null);

  useEffect(() => {
    const productIdsParam = searchParams.get('products');
    if (productIdsParam) {
      const ids = productIdsParam.split(',').slice(0, MAX_COMPARE_ITEMS);
      const newItems = new Array(MAX_COMPARE_ITEMS).fill(null);
      ids.forEach((id, index) => {
        const tool = getToolById(id.trim());
        if (tool) newItems[index] = tool;
      });
      setComparedItems(newItems);
    } else {
      // Pre-fill first slot if no params
      const firstTool = mockTools[0];
      if(firstTool) {
         const initialItems = [...comparedItems];
         initialItems[0] = firstTool;
         setComparedItems(initialItems);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]); // Only run on initial load based on URL

  const updateUrlParams = (items: (Tool | null)[]) => {
    const productIds = items.filter(item => item !== null).map(item => item!.id).join(',');
    if (productIds) {
      window.history.pushState({}, '', `/compare?products=${productIds}`);
    } else {
      window.history.pushState({}, '', `/compare`);
    }
  };

  const handleAddItem = (tool: Tool, slotIndex: number) => {
    const newItems = [...comparedItems];
    newItems[slotIndex] = tool;
    setComparedItems(newItems);
    updateUrlParams(newItems);
    setIsModalOpen(false);
    setSlotToFill(null);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = [...comparedItems];
    newItems[index] = null;
    setComparedItems(newItems);
    updateUrlParams(newItems);
  };

  const openAddModal = (index: number) => {
    setSlotToFill(index);
    setIsModalOpen(true);
  };

  const comparisonFields: (keyof Tool | string)[] = [
    'Price (Rent)', 'Price (Buy)', 'Stock', 'Rating', 'Brand', 'Weight', 'Power', 'Warranty', 'SKU'
  ];

  const getFieldValue = (tool: Tool | null, field: keyof Tool | string): string | number | JSX.Element => {
    if (!tool) return '-';
    switch (field) {
      case 'Price (Rent)': return tool.priceRent ? `฿${tool.priceRent.toLocaleString()}` : '-';
      case 'Price (Buy)': return tool.priceBuy ? `฿${tool.priceBuy.toLocaleString()}` : '-';
      case 'Stock': return tool.stock;
      case 'Rating': return tool.rating ? `${tool.rating} / 5` : '-';
      default: return tool[field as keyof Tool] as string || '-';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 font-headline">Compare Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {comparedItems.map((item, index) => (
          <Card key={index} className="flex flex-col">
            <CardHeader className="relative">
              {item ? (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-7 w-7 z-10 bg-background/50 hover:bg-destructive hover:text-destructive-foreground rounded-full"
                    onClick={() => handleRemoveItem(index)}
                  >
                    <XCircle className="h-5 w-5" />
                  </Button>
                  <Link href={`/equipment/${item.id}`} className="block">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover rounded-t-lg mb-2"
                      data-ai-hint={item.aiHint}
                    />
                    <CardTitle className="text-lg font-semibold line-clamp-2 h-14">{item.name}</CardTitle>
                  </Link>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-muted-foreground rounded-lg p-4">
                  <Button variant="ghost" className="h-auto p-6 flex flex-col items-center" onClick={() => openAddModal(index)}>
                    <PlusCircle className="h-12 w-12 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">Add Product</span>
                  </Button>
                </div>
              )}
            </CardHeader>
            {item && (
              <CardContent className="flex-grow flex flex-col justify-between">
                <div> {/* Wrapper for table to push buttons to bottom */}
                  <Table className="mb-4">
                    <TableBody>
                      {comparisonFields.map(field => (
                        <TableRow key={String(field)} className={comparisonFields.indexOf(field) % 2 === 0 ? 'bg-muted/30' : ''}>
                          <TableHead className="font-medium text-xs p-2 w-1/3">{String(field)}</TableHead>
                          <TableCell className="text-xs p-2">{getFieldValue(item, field as keyof Tool)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="mt-auto pt-2 space-y-2">
                  {item.priceBuy && (
                    <Button variant="outline" className="w-full" asChild>
                      <Link href={`/equipment/${item.id}?action=buy`}><Tag className="mr-2 h-4 w-4" />Buy: ฿{item.priceBuy.toLocaleString()}</Link>
                    </Button>
                  )}
                  <Button variant="default" className="w-full" asChild>
                     <Link href={`/equipment/${item.id}?action=rent`}><ShoppingCart className="mr-2 h-4 w-4" />Rent: ฿{item.priceRent.toLocaleString()}</Link>
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Select a Product to Compare</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[60vh] pr-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
              {mockTools.map(tool => (
                <Card 
                  key={tool.id} 
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => slotToFill !== null && handleAddItem(tool, slotToFill)}
                >
                  <CardHeader className="p-2">
                    <Image src={tool.image} alt={tool.name} width={150} height={100} className="w-full h-24 object-cover rounded-md" data-ai-hint={tool.aiHint} />
                  </CardHeader>
                  <CardContent className="p-3">
                    <h4 className="text-sm font-semibold line-clamp-2 h-10">{tool.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1">Rent: ฿{tool.priceRent.toLocaleString()}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
          <DialogClose asChild>
            <Button variant="outline" className="mt-4">Cancel</Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ComparePage;

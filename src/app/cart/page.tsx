'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { mockTools } from '@/lib/mockData';
import type { CartItem, AddonService } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';

const initialCartItems: CartItem[] = mockTools.slice(0, 2).map(tool => ({
  ...tool,
  rentalDuration: '3days',
  quantity: 1,
}));

const availableAddons: AddonService[] = [
  { id: 'delivery', name: 'Home Delivery Service', price: 200, selected: false },
  { id: 'manuals', name: 'Access to Tool Manuals/Tutorial Videos', price: 50, selected: false },
  { id: 'insurance', name: 'Damage Insurance Coverage', price: 150, selected: false },
];

const CartPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);
  const [addons, setAddons] = useState<AddonService[]>(availableAddons);

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems(prevItems =>
      prevItems.map(item => (item.id === itemId ? { ...item, quantity: newQuantity } : item))
    );
  };

  const updateDuration = (itemId: string, newDuration: string) => {
    setCartItems(prevItems =>
      prevItems.map(item => (item.id === itemId ? { ...item, rentalDuration: newDuration } : item))
    );
  };

  const removeItem = (itemId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const toggleAddon = (addonId: string) => {
    setAddons(prevAddons =>
      prevAddons.map(addon => (addon.id === addonId ? { ...addon, selected: !addon.selected } : addon))
    );
  };

  const calculateRentalPrice = (item: CartItem): number => {
    let days = 1;
    if (item.rentalDuration === '3days') days = 3;
    if (item.rentalDuration === '1week') days = 7;
    // Add more duration logic if needed
    return item.priceRent * days * item.quantity;
  };

  const subtotal = cartItems.reduce((sum, item) => sum + calculateRentalPrice(item), 0);
  const addonsTotal = addons.reduce((sum, addon) => (addon.selected ? sum + addon.price : sum), 0);
  const total = subtotal + addonsTotal;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 font-headline flex items-center">
        <ShoppingBag className="mr-3 h-8 w-8" /> Your Rental Cart
      </h1>

      {cartItems.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <CardTitle className="text-2xl mb-2">Your cart is empty</CardTitle>
            <CardDescription className="mb-6">Looks like you haven't added any tools to your cart yet.</CardDescription>
            <Button asChild>
              <Link href="/equipment">Browse Tools</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map(item => (
              <Card key={item.id} className="flex flex-col sm:flex-row overflow-hidden">
                <div className="sm:w-1/3 md:w-1/4 relative">
                   <Image
                    src={item.image}
                    alt={item.name}
                    width={200}
                    height={200}
                    className="object-cover w-full h-48 sm:h-full"
                    data-ai-hint={item.aiHint}
                  />
                </div>
                <div className="flex-1 p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <Link href={`/equipment/${item.id}`} className="hover:underline">
                        <h3 className="text-lg font-semibold mb-1 line-clamp-1">{item.name}</h3>
                      </Link>
                      <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-destructive -mt-1 -mr-2">
                        <X className="h-5 w-5" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">Base Rent: ฿{item.priceRent.toLocaleString()}/day</p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-3">
                      <div className="flex items-center space-x-2">
                        <Label htmlFor={`quantity-${item.id}`} className="text-sm">Qty:</Label>
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus className="h-4 w-4" /></Button>
                        <Input id={`quantity-${item.id}`} type="number" value={item.quantity} readOnly className="h-8 w-12 text-center px-1" />
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus className="h-4 w-4" /></Button>
                      </div>
                       <div className="flex-1 min-w-[150px]">
                        <Select value={item.rentalDuration} onValueChange={(value) => updateDuration(item.id, value)}>
                          <SelectTrigger className="h-9">
                            <SelectValue placeholder="Duration" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1day">1 Day</SelectItem>
                            <SelectItem value="3days">3 Days</SelectItem>
                            <SelectItem value="1week">1 Week</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  <p className="text-right font-semibold text-lg">Item Total: ฿{calculateRentalPrice(item).toLocaleString()}</p>
                </div>
              </Card>
            ))}
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-xl font-headline">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Add-on Services</h4>
                  <div className="space-y-2">
                    {addons.map(addon => (
                      <div key={addon.id} className="flex items-center justify-between p-2 rounded-md border hover:bg-muted/50 transition-colors">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`addon-${addon.id}`}
                            checked={addon.selected}
                            onCheckedChange={() => toggleAddon(addon.id)}
                          />
                          <Label htmlFor={`addon-${addon.id}`} className="text-sm cursor-pointer">{addon.name}</Label>
                        </div>
                        <span className="text-sm font-medium">+ ฿{addon.price.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <hr />
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal (Tools):</span>
                    <span>฿{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Add-ons:</span>
                    <span>฿{addonsTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t mt-2">
                    <span>Total:</span>
                    <span>฿{total.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button size="lg" className="w-full" asChild disabled={cartItems.length === 0}>
                  <Link href="/confirmation-document">Proceed to Confirmation</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;

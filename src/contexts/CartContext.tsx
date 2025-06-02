
'use client';

import type React from 'react';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Tool, CartItem, RentalEntry, RentalEntryItem } from '@/types';
import { mockTools } from '@/lib/mockData'; // For finding tool details if only ID is passed

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (tool: Tool, purchaseType: 'rent' | 'buy', quantity: number, rentalDuration?: string) => void;
  removeFromCart: (itemId: string, purchaseType: 'rent' | 'buy', rentalDuration?: string) => void;
  updateItemQuantity: (itemId: string, purchaseType: 'rent' | 'buy', rentalDuration: string, newQuantity: number) => void;
  updateItemDuration: (itemId: string, newDuration: string) => void; // Assumes purchaseType is 'rent'
  clearCart: () => void;
  getCartTotal: () => number;
  rentalHistory: RentalEntry[];
  addRentalToHistory: (entry: Omit<RentalEntry, 'id' | 'rentalDate' | 'status'>) => string; // Returns new rental ID
  getRentalById: (rentalId: string) => RentalEntry | undefined;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'changChaoCart';
const RENTAL_HISTORY_STORAGE_KEY = 'changChaoRentalHistory';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [rentalHistory, setRentalHistory] = useState<RentalEntry[]>([]);

  useEffect(() => {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
    const storedRentalHistory = localStorage.getItem(RENTAL_HISTORY_STORAGE_KEY);
    if (storedRentalHistory) {
      setRentalHistory(JSON.parse(storedRentalHistory));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem(RENTAL_HISTORY_STORAGE_KEY, JSON.stringify(rentalHistory));
  }, [rentalHistory]);

  const addToCart = useCallback((tool: Tool, purchaseType: 'rent' | 'buy', quantity: number, rentalDuration: string = '1day') => {
    setCartItems(prevItems => {
      // Create a unique key for each cart item, especially if renting the same tool for different durations could be a feature
      // For now, a simple approach: if tool ID, type, and duration match, increment quantity.
      const itemKey = `${tool.id}-${purchaseType}-${purchaseType === 'rent' ? rentalDuration : 'N/A'}`;
      
      const existingItemIndex = prevItems.findIndex(item => 
        item.id === tool.id && 
        item.purchaseType === purchaseType &&
        (purchaseType === 'buy' || item.rentalDuration === rentalDuration)
      );

      if (existingItemIndex > -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        return updatedItems;
      } else {
        return [...prevItems, { ...tool, quantity, purchaseType, rentalDuration: purchaseType === 'rent' ? rentalDuration : 'N/A' }];
      }
    });
  }, []);

  const removeFromCart = useCallback((itemId: string, purchaseType: 'rent' | 'buy', rentalDuration?: string) => {
    setCartItems(prevItems => prevItems.filter(item => 
      !(item.id === itemId && 
        item.purchaseType === purchaseType &&
        (purchaseType === 'buy' || item.rentalDuration === rentalDuration))
    ));
  }, []);

  const updateItemQuantity = useCallback((itemId: string, purchaseType: 'rent' | 'buy', rentalDuration: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(itemId, purchaseType, rentalDuration);
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        (item.id === itemId && item.purchaseType === purchaseType && (purchaseType === 'buy' || item.rentalDuration === rentalDuration))
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  }, [removeFromCart]);

  const updateItemDuration = useCallback((itemId: string, newDuration: string) => {
    // This function implicitly assumes the item is for 'rent'.
    setCartItems(prevItems =>
      prevItems.map(item =>
        (item.id === itemId && item.purchaseType === 'rent')
          ? { ...item, rentalDuration: newDuration }
          : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);
  
  const calculateRentalPriceForItem = (item: CartItem): number => {
    if (item.purchaseType === 'buy') {
      return (item.priceBuy || 0) * item.quantity;
    }
    // Rental price calculation (simplified)
    let days = 1;
    if (item.rentalDuration === '3days') days = 3;
    else if (item.rentalDuration === '1week') days = 7;
    // Basic assumption: item.rentalDuration might be 'Xdays', parse X.
    // For simplicity, stick to predefined durations or enhance parsing.
    else if (item.rentalDuration.endsWith('day') || item.rentalDuration.endsWith('days')) {
        const numDays = parseInt(item.rentalDuration, 10);
        if (!isNaN(numDays)) days = numDays;
    }
    return item.priceRent * days * item.quantity;
  };

  const getCartTotal = useCallback(() => {
    return cartItems.reduce((total, item) => total + calculateRentalPriceForItem(item), 0);
  }, [cartItems]);


  const addRentalToHistory = useCallback((entryData: Omit<RentalEntry, 'id' | 'rentalDate' | 'status'>) => {
    const newEntry: RentalEntry = {
      ...entryData,
      id: `CCH-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      rentalDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD
      status: 'Confirmed', // Default status when added
    };
    setRentalHistory(prevHistory => [newEntry, ...prevHistory]);
    return newEntry.id;
  }, []);

  const getRentalById = useCallback((rentalId: string) => {
    return rentalHistory.find(entry => entry.id === rentalId);
  }, [rentalHistory]);


  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      updateItemQuantity, 
      updateItemDuration, 
      clearCart,
      getCartTotal,
      rentalHistory,
      addRentalToHistory,
      getRentalById,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

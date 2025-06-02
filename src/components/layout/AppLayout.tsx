
'use client';

import type React from 'react';
import { useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label'; // Added Label import

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      
      <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Chat with Support</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 items-center gap-2">
              <p className="text-sm text-muted-foreground p-4 bg-secondary rounded-md">
                Hi there! How can we help you today?
              </p>
              <Label htmlFor="chat-message" className="sr-only">
                Your message
              </Label>
              <Textarea id="chat-message" placeholder="Type your message here..." rows={4} />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Close</Button>
            </DialogClose>
            <Button type="submit" onClick={() => {
              // Mock send action
              setIsChatOpen(false); 
              // You could add a toast here to confirm message "sent"
            }}>Send Message</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* This button will now trigger the Dialog */}
      <Button
        variant="default"
        size="icon"
        className="fixed bottom-6 right-6 rounded-full h-14 w-14 shadow-lg"
        aria-label="Open chat support"
        onClick={() => setIsChatOpen(true)} // Open dialog on click
      >
        <MessageSquare className="h-7 w-7" />
      </Button>
    </div>
  );
};

export default AppLayout;

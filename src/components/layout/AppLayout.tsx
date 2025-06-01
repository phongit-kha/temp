import type React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';

const ChatSupportButton = () => (
  <Button
    variant="default"
    size="icon"
    className="fixed bottom-6 right-6 rounded-full h-14 w-14 shadow-lg"
    aria-label="Open chat support"
  >
    <MessageSquare className="h-7 w-7" />
  </Button>
);


const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <ChatSupportButton />
    </div>
  );
};

export default AppLayout;

'use client';

import { useParams, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { mockTools } from '@/lib/mockData';
import type { Tool } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Truck, MessageSquare, CalendarDays, AlertTriangle, FileUp, Hourglass } from 'lucide-react';
import Link from 'next/link';
import { Progress } from '@/components/ui/progress';
import { useEffect, useState } from 'react';

type RentalStatus = 'active' | 'awaiting_return' | 'returned' | 'processing_payment' | 'payment_failed' | 'confirmed';

interface MockRental {
  id: string;
  tool: Tool;
  status: RentalStatus;
  startDate: string;
  dueDate: string;
  returnDate?: string;
  deliveryInfo?: {
    serviceEnabled: boolean;
    trackingNumber?: string;
    courier?: string;
    status: 'preparing' | 'shipped' | 'out_for_delivery' | 'delivered';
  };
}

const mockRentalData: MockRental = {
  id: 'mock-rental-123',
  tool: mockTools[0], // Example tool
  status: 'active',
  startDate: new Date().toLocaleDateString(),
  dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString(),
  deliveryInfo: {
    serviceEnabled: true,
    trackingNumber: 'TRK123456789',
    courier: 'ChangChao Express',
    status: 'shipped',
  }
};

const RentDetailPage = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const rentalId = params.rentalId as string;
  const [rental, setRental] = useState<MockRental | null>(null);
  const [showPaymentSuccessMessage, setShowPaymentSuccessMessage] = useState(false);

  useEffect(() => {
    // Simulate fetching rental data
    // In a real app, fetch based on rentalId
    const fetchedRental = { ...mockRentalData, id: rentalId };
    
    const paymentStatus = searchParams.get('payment_status');
    if (paymentStatus === 'success') {
        // This means user just paid.
        fetchedRental.status = 'confirmed'; // Update status if coming from successful payment
        setShowPaymentSuccessMessage(true);
    } else if (paymentStatus === 'failed') {
        fetchedRental.status = 'payment_failed';
    }
    
    setRental(fetchedRental);
  }, [rentalId, searchParams]);


  if (!rental) {
    return <div className="container mx-auto px-4 py-8 text-center">Loading rental details...</div>;
  }

  const getStatusBadge = (status: RentalStatus)
  : { variant: "default" | "secondary" | "destructive" | "outline"; icon: JSX.Element; text: string } => {
    switch (status) {
      case 'active': return { variant: 'default', icon: <Clock className="h-4 w-4 mr-2" />, text: 'Active' };
      case 'awaiting_return': return { variant: 'outline', icon: <Hourglass className="h-4 w-4 mr-2" />, text: 'Awaiting Return' };
      case 'returned': return { variant: 'secondary', icon: <CheckCircle className="h-4 w-4 mr-2" />, text: 'Returned' };
      case 'confirmed': return { variant: 'default', icon: <CheckCircle className="h-4 w-4 mr-2" />, text: 'Confirmed & Processing' };
      case 'payment_failed': return { variant: 'destructive', icon: <AlertTriangle className="h-4 w-4 mr-2" />, text: 'Payment Failed' };
      default: return { variant: 'secondary', icon: <Clock className="h-4 w-4 mr-2" />, text: 'Status Unknown' };
    }
  };

  const statusInfo = getStatusBadge(rental.status);
  const deliveryProgress = rental.deliveryInfo?.serviceEnabled ? 
    (rental.deliveryInfo.status === 'preparing' ? 25 : 
     rental.deliveryInfo.status === 'shipped' ? 50 : 
     rental.deliveryInfo.status === 'out_for_delivery' ? 75 : 100) : 0;

  return (
    <div className="container mx-auto px-4 py-8">
       {showPaymentSuccessMessage && (
        <Card className="mb-6 bg-green-50 border-green-200">
          <CardContent className="p-4 flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-green-700">Payment Successful!</h3>
              <p className="text-sm text-green-600">Your rental is confirmed and being processed.</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="max-w-3xl mx-auto">
        <CardHeader className="flex flex-row justify-between items-start">
          <div>
            <CardTitle className="text-2xl font-bold font-headline">Rental Details: {rental.id}</CardTitle>
            <CardDescription>Status of your tool rental.</CardDescription>
          </div>
          <Badge variant={statusInfo.variant} className="text-sm px-3 py-1.5">
            {statusInfo.icon}
            {statusInfo.text}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-6 p-4 border rounded-lg bg-secondary/30">
            <Image src={rental.tool.image} alt={rental.tool.name} width={120} height={120} className="rounded-md object-cover" data-ai-hint={rental.tool.aiHint} />
            <div>
              <h3 className="text-xl font-semibold">{rental.tool.name}</h3>
              <p className="text-sm text-muted-foreground">{rental.tool.descriptionShort}</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-3 border rounded-md">
              <h4 className="text-xs text-muted-foreground font-medium mb-0.5">RENTAL PERIOD</h4>
              <p className="font-semibold flex items-center"><CalendarDays className="h-4 w-4 mr-2 text-primary" /> {rental.startDate} - {rental.dueDate}</p>
            </div>
            {new Date(rental.dueDate) < new Date() && rental.status !== 'returned' && (
              <div className="p-3 border rounded-md bg-yellow-50 border-yellow-300">
                 <h4 className="text-xs text-yellow-700 font-medium mb-0.5">ATTENTION</h4>
                <p className="font-semibold text-yellow-800 flex items-center"><AlertTriangle className="h-4 w-4 mr-2" /> Return is overdue!</p>
              </div>
            )}
          </div>

          {rental.deliveryInfo?.serviceEnabled && (
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center"><Truck className="h-5 w-5 mr-2 text-primary"/> Delivery Status</h3>
              <Progress value={deliveryProgress} className="w-full h-3 mb-1" />
              <p className="text-sm text-muted-foreground capitalize mb-1">Status: {rental.deliveryInfo.status.replace('_', ' ')}</p>
              {rental.deliveryInfo.trackingNumber && <p className="text-sm">Tracking: {rental.deliveryInfo.trackingNumber} ({rental.deliveryInfo.courier})</p>}
            </div>
          )}

          {rental.status === 'active' || rental.status === 'awaiting_return' && (
             <Button asChild className="w-full" variant="outline">
                <Link href={`/upload-evidence/${rental.id}`}><FileUp className="h-4 w-4 mr-2"/> Upload Return Evidence</Link>
             </Button>
          )}

          <div className="mt-6 pt-6 border-t">
            <h3 className="text-lg font-semibold mb-3">Need Help?</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" className="flex-1">
                <MessageSquare className="h-4 w-4 mr-2" /> Chat with Support
              </Button>
              <Button variant="outline" className="flex-1" asChild>
                <Link href="/help-center">Visit Help Center</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RentDetailPage;

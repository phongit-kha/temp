'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle, ShieldAlert, FileText } from 'lucide-react';

const ConfirmationDocumentPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isAccepted, setIsAccepted] = useState(false);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);

  // Mock data - in a real app, this would come from cart/user state
  const rentalDetails = {
    renterName: 'John Doe',
    toolList: ['Heavy Duty Electric Drill XR-5000 (x1)', 'Professional Laser Level Kit (x1)'],
    rentalDuration: '3 Days',
    rentalPrice: '฿800', // Example total for tools
    startDate: new Date().toLocaleDateString(),
    endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString(),
  };
  
  useEffect(() => {
    if (searchParams.get('payment_status') === 'success') {
      setShowPaymentSuccess(true);
      setIsAccepted(true); // Assume agreement was accepted if payment is successful
    }
  }, [searchParams]);


  const handleAccept = () => {
    setIsAccepted(true);
    // In a real app, might save acceptance state
    router.push('/payment');
  };

  const handleDecline = () => {
    // Handle decline, e.g., redirect to cart or show a message
    router.push('/cart');
  };
  
  if (showPaymentSuccess) {
    return (
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Card className="w-full max-w-lg text-center">
          <CardHeader>
            <CheckCircle className="h-16 w-16 mx-auto text-green-500 mb-4" />
            <CardTitle className="text-2xl font-headline">Payment Successful!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-2">Your rental agreement has been confirmed and payment processed.</p>
            <p className="text-sm">Renter: {rentalDetails.renterName}</p>
            <p className="text-sm">Tools: {rentalDetails.toolList.join(', ')}</p>
            <p className="text-sm">Duration: {rentalDetails.rentalDuration} ({rentalDetails.startDate} - {rentalDetails.endDate})</p>
            <p className="text-sm font-semibold">Total Paid: {rentalDetails.rentalPrice}</p> {/* This price should be from payment confirmation */}
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button className="w-full" asChild>
              <Link href="/rental-history">View Rental History</Link>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/">Back to Homepage</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }


  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader className="text-center">
          <FileText className="h-12 w-12 mx-auto text-primary mb-3" />
          <CardTitle className="text-2xl font-bold font-headline">Rental Tool Agreement</CardTitle>
          <CardDescription>Please review and accept the terms to proceed.</CardDescription>
        </CardHeader>
        <CardContent>
          {!isAccepted ? (
            <>
              <div className="mb-6 p-4 bg-secondary rounded-lg border">
                <h3 className="font-semibold mb-2">Rental Summary:</h3>
                <p><strong>Renter:</strong> {rentalDetails.renterName}</p>
                <p><strong>Tools:</strong> {rentalDetails.toolList.join(', ')}</p>
                <p><strong>Duration:</strong> {rentalDetails.rentalDuration} (From: {rentalDetails.startDate} To: {rentalDetails.endDate})</p>
                <p><strong>Estimated Price:</strong> {rentalDetails.rentalPrice}</p>
              </div>

              <h3 className="font-semibold mb-2">Terms and Conditions:</h3>
              <ScrollArea className="h-60 border rounded-md p-4 bg-background text-sm text-muted-foreground">
                <p className="mb-2">1. Renter agrees to return all tools by the specified end date in good working condition, normal wear and tear excepted.</p>
                <p className="mb-2">2. Renter is responsible for any damage or loss of tools during the rental period. Optional insurance may cover certain damages.</p>
                <p className="mb-2">3. Late returns will incur additional charges at the daily rental rate for each tool.</p>
                <p className="mb-2">4. All tools must be used in accordance with manufacturer guidelines and safety instructions provided.</p>
                <p className="mb-2">5. Chang Chao is not liable for any injury or damage resulting from improper use of rented tools.</p>
                <p className="mb-2">6. Cancellation policy: Cancellations made 24 hours prior to rental start date are fully refundable. No refunds for later cancellations.</p>
                <p>7. By clicking "Accept", you confirm that you have read, understood, and agree to these terms and conditions.</p>
              </ScrollArea>
              
              <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-700 flex items-start">
                <ShieldAlert className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-xs">Please read the terms carefully. This is a legally binding agreement. By accepting, you confirm you are authorized to enter this agreement.</p>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-3" />
              <h3 className="text-xl font-semibold">Agreement Accepted!</h3>
              <p className="text-muted-foreground mt-2">You will now be redirected to payment.</p>
            </div>
          )}
        </CardContent>
        {!isAccepted && (
          <CardFooter className="flex flex-col sm:flex-row justify-end gap-3">
            <Button variant="outline" onClick={handleDecline} className="w-full sm:w-auto">Decline</Button>
            <Button onClick={handleAccept} className="w-full sm:w-auto">Accept & Proceed to Payment</Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default ConfirmationDocumentPage;

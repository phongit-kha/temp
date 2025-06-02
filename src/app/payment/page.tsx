
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, Wallet, Truck, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner'; // Changed import

type PaymentStatus = 'idle' | 'processing' | 'success' | 'failure';

const PaymentPage = () => {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvc: '', name: '' });
  const [status, setStatus] = useState<PaymentStatus>('idle');

  const totalAmount = 850; 

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('processing');

    await new Promise(resolve => setTimeout(resolve, 2500));

    const isSuccess = Math.random() > 0.2; 

    if (isSuccess) {
      setStatus('success');
      toast.success("Payment Successful!", { // Changed toast
        description: "Your rental has been confirmed.",
      });
      router.push(`/confirmation-document?payment_status=success&rental_id=mock-rental-123`);
    } else {
      setStatus('failure');
      toast.error("Payment Failed", { // Changed toast
        description: "Please try again or use a different payment method.",
      });
    }
  };

  if (status === 'success') {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[calc(100vh-200px)]">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CheckCircle className="h-16 w-16 mx-auto text-green-500 mb-4" />
            <CardTitle className="text-2xl font-headline">Payment Successful!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Your payment of ฿{totalAmount.toLocaleString()} has been processed.</p>
            <p className="mt-2 text-sm">You are being redirected...</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (status === 'processing') {
     return (
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
        <p className="text-xl text-muted-foreground">Processing your payment...</p>
        <p className="text-sm text-muted-foreground">Please do not refresh or close this page.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold font-headline">Complete Your Payment</CardTitle>
          <CardDescription>Total amount to pay: <span className="font-semibold text-primary">฿{totalAmount.toLocaleString()}</span></CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmitPayment}>
            <div className="mb-6">
              <Label className="text-base font-semibold">Select Payment Method</Label>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { value: 'card', label: 'Credit/Debit Card', icon: <CreditCard className="h-5 w-5 mr-2" /> },
                  { value: 'ewallet', label: 'E-Wallet', icon: <Wallet className="h-5 w-5 mr-2" /> },
                  { value: 'cod', label: 'Cash on Delivery', icon: <Truck className="h-5 w-5 mr-2" /> },
                ].map(opt => (
                  <Label
                    key={opt.value}
                    htmlFor={`payment-${opt.value}`}
                    className={`flex items-center p-3 border rounded-md cursor-pointer transition-all ${paymentMethod === opt.value ? 'border-primary ring-2 ring-primary bg-primary/5' : 'hover:border-muted-foreground/70'}`}
                  >
                    <RadioGroupItem value={opt.value} id={`payment-${opt.value}`} className="mr-3" />
                    {opt.icon}
                    <span className="text-sm font-medium">{opt.label}</span>
                  </Label>
                ))}
              </RadioGroup>
            </div>

            {paymentMethod === 'card' && (
              <div className="space-y-4 p-4 border rounded-md bg-secondary/50">
                <h3 className="text-lg font-semibold">Enter Card Details</h3>
                <div>
                  <Label htmlFor="cardName">Name on Card</Label>
                  <Input id="cardName" name="name" value={cardDetails.name} onChange={handleInputChange} placeholder="John Doe" required />
                </div>
                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input id="cardNumber" name="number" value={cardDetails.number} onChange={handleInputChange} placeholder="•••• •••• •••• ••••" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cardExpiry">Expiry Date (MM/YY)</Label>
                    <Input id="cardExpiry" name="expiry" value={cardDetails.expiry} onChange={handleInputChange} placeholder="MM/YY" required />
                  </div>
                  <div>
                    <Label htmlFor="cardCvc">CVC</Label>
                    <Input id="cardCvc" name="cvc" value={cardDetails.cvc} onChange={handleInputChange} placeholder="•••" required />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'ewallet' && (
              <div className="p-4 border rounded-md bg-secondary/50 text-center">
                <p className="text-muted-foreground">You will be redirected to your E-Wallet provider to complete the payment.</p>
              </div>
            )}

            {paymentMethod === 'cod' && (
              <div className="p-4 border rounded-md bg-secondary/50 text-center">
                <p className="text-muted-foreground">Payment will be collected upon delivery of the tools.</p>
              </div>
            )}
            
            {status === 'failure' && (
              <div className="mt-4 p-3 bg-destructive/10 border border-destructive/30 rounded-md text-destructive flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                <p className="text-sm font-medium">Payment failed. Please check your details or try another method.</p>
              </div>
            )}

            <Button type="submit" size="lg" className="w-full mt-8" disabled={status === 'processing'}>
              {status === 'processing' ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <CreditCard className="mr-2 h-5 w-5" />
              )}
              Confirm Payment (฿{totalAmount.toLocaleString()})
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground text-center block">
          Your payment is securely processed.
        </CardFooter>
      </Card>
    </div>
  );
};

export default PaymentPage;

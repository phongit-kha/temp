
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { History, PackageSearch } from "lucide-react";

// Mock data for rental history items
const mockRentalHistory = [
  {
    id: "RENTAL001",
    toolName: "Heavy Duty Electric Drill XR-5000",
    rentalDate: "2023-10-15",
    returnDate: "2023-10-18",
    status: "Returned",
    totalPrice: "฿1500",
    toolImage: "https://placehold.co/100x100.png?text=Drill",
    aiHint: "electric drill"
  },
  {
    id: "RENTAL002",
    toolName: "Professional Laser Level Kit",
    rentalDate: "2023-11-01",
    returnDate: "2023-11-03",
    status: "Active",
    totalPrice: "฿600",
    toolImage: "https://placehold.co/100x100.png?text=Laser+Level",
    aiHint: "laser level"
  },
  {
    id: "RENTAL003",
    toolName: "Compact Circular Saw CS-150",
    rentalDate: "2023-11-20",
    returnDate: "2023-11-27",
    status: "Awaiting Return",
    totalPrice: "฿4200",
    toolImage: "https://placehold.co/100x100.png?text=Circular+Saw",
    aiHint: "circular saw"
  }
];


export default function RentalHistoryPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold font-headline flex items-center">
          <History className="mr-3 h-8 w-8" /> Rental History
        </h1>
        <p className="text-muted-foreground mt-1">View your past and current tool rentals.</p>
      </header>

      {mockRentalHistory.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <PackageSearch className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <CardTitle className="text-2xl mb-2">No Rental History Found</CardTitle>
            <CardDescription className="mb-6">You haven't rented any tools yet. Start exploring our catalog!</CardDescription>
            <Button asChild>
              <Link href="/equipment">Browse Tools</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {mockRentalHistory.map((rental) => (
            <Card key={rental.id} className="overflow-hidden">
              <div className="flex flex-col sm:flex-row">
                <div className="sm:w-1/4 md:w-1/5 bg-secondary flex items-center justify-center p-2">
                  <img 
                    src={rental.toolImage} 
                    alt={rental.toolName} 
                    className="w-24 h-24 sm:w-full sm:h-auto object-contain rounded-md"
                    data-ai-hint={rental.aiHint} 
                  />
                </div>
                <div className="flex-1">
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-2">
                        <div>
                            <CardTitle className="text-xl hover:underline">
                                <Link href={`/rent-detail/${rental.id}`}>{rental.toolName}</Link>
                            </CardTitle>
                            <CardDescription>Rental ID: {rental.id}</CardDescription>
                        </div>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            rental.status === 'Returned' ? 'bg-green-100 text-green-700' :
                            rental.status === 'Active' ? 'bg-blue-100 text-blue-700' :
                            'bg-yellow-100 text-yellow-700'
                        }`}>
                            {rental.status}
                        </span>
                    </div>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 text-sm">
                    <div>
                      <p className="text-muted-foreground text-xs">Rental Date</p>
                      <p className="font-medium">{rental.rentalDate}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Return Date</p>
                      <p className="font-medium">{rental.returnDate}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Total Price</p>
                      <p className="font-medium">{rental.totalPrice}</p>
                    </div>
                  </CardContent>
                   <CardFooter className="p-4 justify-end">
                     <Button variant="outline" size="sm" asChild>
                        <Link href={`/rent-detail/${rental.id}`}>View Details</Link>
                     </Button>
                   </CardFooter>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

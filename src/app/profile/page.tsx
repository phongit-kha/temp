
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { UserCircle, Edit3 } from "lucide-react";

export default function ProfilePage() {
  // Mock user data
  const user = {
    name: "Somsak Jaidee",
    email: "somsak.j@example.com",
    phone: "081-234-5678",
    address: "123 Sukhumvit Road, Bangkok 10110, Thailand",
    memberSince: "January 15, 2023",
    profilePictureUrl: "https://placehold.co/150x150.png?text=User+Photo"
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold font-headline flex items-center">
          <UserCircle className="mr-3 h-8 w-8" /> My Profile
        </h1>
        <p className="text-muted-foreground mt-1">View and manage your account details.</p>
      </header>

      <Card className="max-w-3xl mx-auto">
        <CardHeader className="flex flex-col sm:flex-row items-center gap-6 p-6">
          <Avatar className="h-24 w-24 border-2 border-primary">
            <AvatarImage src={user.profilePictureUrl} alt={user.name} data-ai-hint="person photo" />
            <AvatarFallback className="text-3xl">{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div className="text-center sm:text-left">
            <CardTitle className="text-2xl font-headline">{user.name}</CardTitle>
            <CardDescription>{user.email}</CardDescription>
            <p className="text-xs text-muted-foreground mt-1">Member since: {user.memberSince}</p>
          </div>
          <Button variant="outline" size="sm" className="sm:ml-auto mt-4 sm:mt-0">
            <Edit3 className="mr-2 h-4 w-4" /> Edit Profile
          </Button>
        </CardHeader>
        
        <Separator />

        <CardContent className="p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold font-headline">Personal Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="profileName">Full Name</Label>
                <Input id="profileName" defaultValue={user.name} readOnly />
              </div>
              <div>
                <Label htmlFor="profileEmail">Email Address</Label>
                <Input id="profileEmail" type="email" defaultValue={user.email} readOnly />
              </div>
              <div>
                <Label htmlFor="profilePhone">Phone Number</Label>
                <Input id="profilePhone" type="tel" defaultValue={user.phone} readOnly />
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold font-headline">Address Information</h3>
             <div>
                <Label htmlFor="profileAddress">Primary Address</Label>
                <Input id="profileAddress" defaultValue={user.address} readOnly />
              </div>
          </div>
          
          <Separator />

          <div className="space-y-4">
             <h3 className="text-lg font-semibold font-headline">Account Settings</h3>
             <Button variant="destructive" className="w-full sm:w-auto">Delete Account</Button>
             <p className="text-xs text-muted-foreground">Note: Deleting your account is permanent and cannot be undone.</p>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}

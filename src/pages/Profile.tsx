import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { CreditCard, Mail, User, Camera } from "lucide-react";
import { toast } from "sonner";

const Profile = () => {
  const [user, setUser] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    paymentMethod: "**** **** **** 4242"
  });

  const handleSave = () => {
    console.log("Saving user profile:", user);
    toast.success("Profile updated successfully!");
  };

  const handleImageUpload = () => {
    console.log("Uploading new profile picture");
    toast.success("Profile picture updated!");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Card className="p-6 space-y-8">
        <div className="flex items-center gap-6">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.avatar} />
              <AvatarFallback>{user.name[0]}</AvatarFallback>
            </Avatar>
            <Button
              size="icon"
              variant="secondary"
              className="absolute bottom-0 right-0"
              onClick={handleImageUpload}
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>
          <div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-gray-500">{user.email}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-500">
                <User className="h-4 w-4" />
              </span>
              <Input
                id="name"
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-500">
                <Mail className="h-4 w-4" />
              </span>
              <Input
                id="email"
                type="email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Payment Method</Label>
            <div className="flex items-center gap-2 p-3 border rounded-md">
              <CreditCard className="h-4 w-4" />
              <span>{user.paymentMethod}</span>
              <Button variant="outline" className="ml-auto">
                Update
              </Button>
            </div>
          </div>
        </div>

        <Button onClick={handleSave} className="w-full">
          Save Changes
        </Button>
      </Card>
    </div>
  );
};

export default Profile;
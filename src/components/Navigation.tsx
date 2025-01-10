import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { Coffee, Menu, LogIn, Search } from "lucide-react";
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useEffect, useState } from "react";
import { MerchantMenu } from "./navigation/MerchantMenu";
import { UserMenu } from "./navigation/UserMenu";

export const Navigation = () => {
  const navigate = useNavigate();
  const session = useSession();
  const supabase = useSupabaseClient();
  const [accountType, setAccountType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    console.log("Navigation: Initializing auth and profile check");
    
    const fetchAccountType = async () => {
      if (session?.user?.id) {
        console.log("Navigation: Fetching profile for user:", session.user.id);
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('account_type')
            .eq('id', session.user.id)
            .single();

          if (error) {
            console.error("Navigation: Profile fetch error:", error);
          } else if (data) {
            console.log("Navigation: Profile loaded, account type:", data.account_type);
            setAccountType(data.account_type);
          }
        } catch (error) {
          console.error("Navigation: Unexpected error:", error);
        }
      } else {
        setAccountType(null);
      }
      setLoading(false);
    };

    fetchAccountType();
  }, [session, supabase]);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md py-4 z-50">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate("/")}>
          <Coffee className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">AntiApp</span>
        </div>

        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            className="hidden md:flex items-center"
            onClick={() => navigate("/search")}
          >
            <Search className="h-4 w-4 mr-2" />
            Find Spaces
          </Button>

          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
          ) : session ? (
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                  <SheetDescription>
                    Navigate through AntiApp
                  </SheetDescription>
                </SheetHeader>
                {accountType === 'merchant' ? (
                  <MerchantMenu onClose={() => setIsOpen(false)} />
                ) : (
                  <UserMenu onClose={() => setIsOpen(false)} />
                )}
              </SheetContent>
            </Sheet>
          ) : (
            <Button
              className="flex items-center"
              onClick={() => navigate("/login")}
            >
              <LogIn className="h-4 w-4 mr-2" />
              Login
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};
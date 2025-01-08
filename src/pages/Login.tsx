import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuthContainer } from "@/components/auth/AuthContainer";
import { UserLoginTab } from "@/components/auth/UserLoginTab";
import { MerchantLoginTab } from "@/components/auth/MerchantLoginTab";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";

const Login = () => {
  const { authError, loading } = useAuthRedirect();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/5 to-primary/10 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <AuthContainer>
      <Tabs defaultValue="user" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="user">User Login</TabsTrigger>
          <TabsTrigger value="merchant">Merchant</TabsTrigger>
        </TabsList>

        <TabsContent value="user">
          <UserLoginTab authError={authError} />
        </TabsContent>

        <TabsContent value="merchant">
          <MerchantLoginTab authError={authError} />
        </TabsContent>
      </Tabs>
    </AuthContainer>
  );
};

export default Login;
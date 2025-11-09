import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Scale, User, Briefcase } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function RoleSelection() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const { toast } = useToast();

  const updateRoleMutation = useMutation({
    mutationFn: async (role: string) => {
      await apiRequest("POST", "/api/auth/user/role", { role });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      window.location.href = selectedRole === "lawyer" ? "/lawyer-onboarding" : "/dashboard";
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to set role. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleRoleSelection = (role: string) => {
    setSelectedRole(role);
    updateRoleMutation.mutate(role);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-chart-2/5 p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-6">
            <Scale className="h-9 w-9 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Welcome to LegalEase</h1>
          <p className="text-xl text-muted-foreground">
            How would you like to use our platform?
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card
            className={`hover-elevate transition-all duration-300 cursor-pointer ${
              selectedRole === "user" ? "border-primary border-2" : ""
            }`}
            onClick={() => handleRoleSelection("user")}
            data-testid="card-role-user"
          >
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 rounded-full bg-chart-2/10 flex items-center justify-center mx-auto mb-4">
                <User className="h-10 w-10 text-chart-2" />
              </div>
              <CardTitle className="text-2xl">I need legal help</CardTitle>
              <CardDescription className="text-base">
                Get AI-powered legal advice and connect with verified lawyers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-chart-2" />
                  <span>Chat with AI legal assistant</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-chart-2" />
                  <span>Browse and book lawyers</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-chart-2" />
                  <span>Secure document vault</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-chart-2" />
                  <span>Multi-language support</span>
                </li>
              </ul>
              <Button
                className="w-full"
                disabled={updateRoleMutation.isPending}
                onClick={() => handleRoleSelection("user")}
                data-testid="button-select-user"
              >
                Continue as User
              </Button>
            </CardContent>
          </Card>

          <Card
            className={`hover-elevate transition-all duration-300 cursor-pointer ${
              selectedRole === "lawyer" ? "border-primary border-2" : ""
            }`}
            onClick={() => handleRoleSelection("lawyer")}
            data-testid="card-role-lawyer"
          >
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Briefcase className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="text-2xl">I'm a lawyer</CardTitle>
              <CardDescription className="text-base">
                Join our marketplace and connect with clients globally
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span>Create professional profile</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span>Manage client bookings</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span>Build your reputation with ELO rating</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span>Earn from consultations</span>
                </li>
              </ul>
              <Button
                className="w-full"
                disabled={updateRoleMutation.isPending}
                onClick={() => handleRoleSelection("lawyer")}
                data-testid="button-select-lawyer"
              >
                Continue as Lawyer
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

import { useQuery } from "@tanstack/react-query";
import { User, LawyerProfile } from "@shared/schema";

export interface AuthUser extends User {
  lawyerProfile?: LawyerProfile;
}

export function useAuth() {
  const { data: user, isLoading } = useQuery<AuthUser>({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    isLawyer: user?.role === "lawyer",
    isUser: user?.role === "user",
  };
}

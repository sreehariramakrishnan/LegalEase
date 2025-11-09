import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { StatsCard } from "@/components/StatsCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Briefcase,
  Calendar,
  DollarSign,
  Star,
  CheckCircle,
  XCircle,
  Clock,
  MessageCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { Booking } from "@shared/schema";

interface BookingWithUser extends Booking {
  user: {
    firstName?: string | null;
    lastName?: string | null;
    profileImageUrl?: string | null;
  };
}

export default function LawyerDashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [user, authLoading, toast]);

  const { data: bookings = [], isLoading: bookingsLoading } = useQuery<BookingWithUser[]>({
    queryKey: ["/api/bookings/lawyer"],
    retry: false,
    enabled: !!user,
  });

  const acceptBookingMutation = useMutation({
    mutationFn: async (bookingId: string) => {
      await apiRequest(`/api/bookings/${bookingId}/status`, "PATCH", { status: "accepted" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookings/lawyer"] });
      toast({
        title: "Booking Accepted",
        description: "You can now chat with the client",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to accept booking",
        variant: "destructive",
      });
    },
  });

  const rejectBookingMutation = useMutation({
    mutationFn: async (bookingId: string) => {
      await apiRequest(`/api/bookings/${bookingId}/status`, "PATCH", { status: "rejected" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookings/lawyer"] });
      toast({
        title: "Booking Rejected",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to reject booking",
        variant: "destructive",
      });
    },
  });

  const pendingBookings = bookings.filter((b) => b.status === "pending");
  const acceptedBookings = bookings.filter((b) => b.status === "accepted");
  const completedBookings = bookings.filter((b) => b.status === "completed");

  const totalEarnings = completedBookings.reduce((sum, b) => {
    return sum + (b.budget ? parseFloat(b.budget.toString()) : 0);
  }, 0);

  if (authLoading || bookingsLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Lawyer Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.firstName || "Counselor"}!
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Pending Requests"
          value={pendingBookings.length}
          icon={Clock}
          description="Awaiting your response"
        />
        <StatsCard
          title="Active Cases"
          value={acceptedBookings.length}
          icon={Briefcase}
          description="Currently working on"
        />
        <StatsCard
          title="Completed"
          value={completedBookings.length}
          icon={CheckCircle}
          description="Total cases closed"
        />
        <StatsCard
          title="Earnings"
          value={`$${totalEarnings.toFixed(2)}`}
          icon={DollarSign}
          description="Total revenue"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Pending Consultation Requests</CardTitle>
            <CardDescription>
              Review and respond to client requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            {pendingBookings.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No pending requests</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingBookings.map((booking) => (
                  <Card key={booking.id} className="hover-elevate transition-all duration-300" data-testid={`card-pending-booking-${booking.id}`}>
                    <CardContent className="p-4">
                      <div className="flex gap-3 mb-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={booking.user.profileImageUrl || ""} />
                          <AvatarFallback>
                            {booking.user.firstName?.[0] || "U"}
                            {booking.user.lastName?.[0] || ""}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold" data-testid={`text-booking-title-${booking.id}`}>
                            {booking.caseTitle}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {booking.user.firstName} {booking.user.lastName}
                          </p>
                          {booking.budget && (
                            <p className="text-sm font-medium text-chart-2">
                              Budget: ${booking.budget}
                            </p>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {booking.caseDescription}
                      </p>
                      {booking.preferredDate && (
                        <p className="text-xs text-muted-foreground mb-3">
                          Preferred: {new Date(booking.preferredDate).toLocaleDateString()}
                          {booking.preferredTime && ` at ${booking.preferredTime}`}
                        </p>
                      )}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => acceptBookingMutation.mutate(booking.id)}
                          disabled={acceptBookingMutation.isPending}
                          data-testid={`button-accept-${booking.id}`}
                        >
                          <CheckCircle className="h-3.5 w-3.5 mr-1" />
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => rejectBookingMutation.mutate(booking.id)}
                          disabled={rejectBookingMutation.isPending}
                          data-testid={`button-reject-${booking.id}`}
                        >
                          <XCircle className="h-3.5 w-3.5 mr-1" />
                          Decline
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Consultations</CardTitle>
            <CardDescription>
              Ongoing cases requiring your attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            {acceptedBookings.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Briefcase className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No active cases</p>
              </div>
            ) : (
              <div className="space-y-4">
                {acceptedBookings.map((booking) => (
                  <Card key={booking.id} className="hover-elevate transition-all duration-300 cursor-pointer" data-testid={`card-active-booking-${booking.id}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold">{booking.caseTitle}</h4>
                          <p className="text-sm text-muted-foreground">
                            {booking.user.firstName} {booking.user.lastName}
                          </p>
                        </div>
                        <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-0">
                          Active
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {booking.caseDescription}
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full"
                        data-testid={`button-open-chat-${booking.id}`}
                      >
                        <MessageCircle className="h-3.5 w-3.5 mr-2" />
                        Open Chat
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile & Availability</CardTitle>
          <CardDescription>
            Manage your professional profile and status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user?.profileImageUrl || ""} />
                <AvatarFallback>
                  {user?.firstName?.[0] || "L"}
                  {user?.lastName?.[0] || ""}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-lg">
                  {user?.firstName} {user?.lastName}
                </h3>
                {user?.lawyerProfile && (
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary">{user.lawyerProfile.specialization}</Badge>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-3.5 w-3.5 fill-chart-2 text-chart-2" />
                      <span>{user.lawyerProfile.rating || "N/A"}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <Button variant="outline" data-testid="button-edit-profile">
              Edit Profile
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

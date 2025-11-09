import { StatsCard } from "@/components/StatsCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Calendar, FileText, Briefcase, Plus, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";

export default function Dashboard() {
  const [, setLocation] = useLocation();

  //todo: remove mock functionality
  const recentChats = [
    { id: "1", title: "Property dispute inquiry", date: "2 hours ago", unread: true },
    { id: "2", title: "Employment contract review", date: "Yesterday", unread: false },
    { id: "3", title: "Family law consultation", date: "3 days ago", unread: false },
  ];

  const upcomingAppointments = [
    {
      id: "1",
      lawyer: "Priya Sharma",
      type: "Video Consultation",
      date: "Today, 3:00 PM",
      specialization: "Corporate Law",
    },
    {
      id: "2",
      lawyer: "Robert Mitchell",
      type: "Chat Session",
      date: "Tomorrow, 10:00 AM",
      specialization: "Criminal Defense",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
        <p className="text-muted-foreground">
          Here's what's happening with your legal matters today.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Active Chats"
          value={12}
          icon={MessageSquare}
          description="3 pending responses"
        />
        <StatsCard
          title="Appointments"
          value={2}
          icon={Calendar}
          description="Next: Today 3:00 PM"
        />
        <StatsCard
          title="Documents"
          value={24}
          icon={FileText}
          description="All encrypted"
        />
        <StatsCard
          title="Saved Lawyers"
          value={5}
          icon={Briefcase}
          description="Ready to consult"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="hover-elevate transition-all duration-300 cursor-pointer" onClick={() => setLocation("/chat")} data-testid="card-quick-action-chat">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Start New Chat</h3>
                <p className="text-sm text-muted-foreground">Ask AI assistant</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-elevate transition-all duration-300 cursor-pointer" onClick={() => setLocation("/lawyers")} data-testid="card-quick-action-lawyer">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-chart-2/10 flex items-center justify-center">
                <Plus className="h-6 w-6 text-chart-2" />
              </div>
              <div>
                <h3 className="font-semibold">Find a Lawyer</h3>
                <p className="text-sm text-muted-foreground">Browse experts</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-elevate transition-all duration-300 cursor-pointer" onClick={() => setLocation("/vault")} data-testid="card-quick-action-upload">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold">Upload Document</h3>
                <p className="text-sm text-muted-foreground">Secure vault</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Chats</CardTitle>
            <CardDescription>Your latest AI conversations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentChats.map((chat) => (
                <div
                  key={chat.id}
                  className="flex items-center justify-between p-3 rounded-lg hover-elevate transition-all duration-300 cursor-pointer"
                  onClick={() => setLocation("/chat")}
                  data-testid={`item-recent-chat-${chat.id}`}
                >
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-sm">{chat.title}</p>
                      <p className="text-xs text-muted-foreground">{chat.date}</p>
                    </div>
                  </div>
                  {chat.unread && (
                    <div className="w-2 h-2 rounded-full bg-chart-2" />
                  )}
                </div>
              ))}
              <Button variant="ghost" className="w-full" onClick={() => setLocation("/chat")} data-testid="button-view-all-chats">
                View All Chats
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
            <CardDescription>Scheduled consultations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="p-4 rounded-lg border hover-elevate transition-all duration-300"
                  data-testid={`item-appointment-${apt.id}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold">{apt.lawyer}</p>
                      <p className="text-xs text-muted-foreground">
                        {apt.specialization}
                      </p>
                    </div>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">{apt.type}</p>
                    <p className="text-sm font-medium">{apt.date}</p>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full" data-testid="button-manage-appointments">
                Manage Appointments
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

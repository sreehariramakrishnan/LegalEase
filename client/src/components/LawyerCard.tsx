import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MapPin, Star, Trophy, MessageCircle, Video } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";

interface LawyerCardProps {
  id: string;
  name: string;
  avatar: string;
  specialization: string;
  location: string;
  rating: number;
  reviewCount: number;
  experience: number;
  hearings: number;
  eloRating: number;
  isOnline: boolean;
  status: "available" | "busy" | "offline";
  whatsapp?: string;
  onBook?: () => void;
  onClick?: () => void;
}

export function LawyerCard({
  id,
  name,
  avatar,
  specialization,
  location,
  rating,
  reviewCount,
  experience,
  hearings,
  eloRating,
  isOnline,
  status,
  whatsapp,
  onBook,
  onClick,
}: LawyerCardProps) {
  const statusColors = {
    available: "status-online",
    busy: "status-busy",
    offline: "status-offline",
  };

  const statusLabels = {
    available: "Available",
    busy: "Busy",
    offline: "Offline",
  };

  return (
    <Card className="hover-elevate transition-all duration-300 cursor-pointer" onClick={onClick} data-testid={`card-lawyer-${id}`}>
      <CardContent className="p-6">
        <div className="flex gap-4">
          <div className="relative">
            <Avatar className="h-20 w-20">
              <AvatarImage src={avatar} alt={name} />
              <AvatarFallback>{name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            {isOnline && (
              <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-background ${statusColors[status]}`} />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <h3 className="font-semibold text-lg" data-testid={`text-lawyer-name-${id}`}>{name}</h3>
                <Badge variant="secondary" className="mt-1 bg-chart-2/10 text-chart-2 border-0">
                  {specialization}
                </Badge>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <Star className="h-4 w-4 fill-chart-2 text-chart-2" />
                <span className="font-semibold" data-testid={`text-lawyer-rating-${id}`}>{rating.toFixed(1)}</span>
                <span className="text-muted-foreground">({reviewCount})</span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
              <MapPin className="h-3.5 w-3.5" />
              <span>{location}</span>
              <span className="mx-2">•</span>
              <span className={statusColors[status]}>{statusLabels[status]}</span>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
              <div>
                <div className="text-muted-foreground">Experience</div>
                <div className="font-semibold">{experience} years</div>
              </div>
              <div>
                <div className="text-muted-foreground">Hearings</div>
                <div className="font-semibold">{hearings}</div>
              </div>
              <div>
                <div className="text-muted-foreground flex items-center gap-1">
                  <Trophy className="h-3.5 w-3.5" />
                  ELO
                </div>
                <div className="font-semibold text-chart-2">{eloRating}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onBook?.();
                }}
                data-testid={`button-book-${id}`}
              >
                <Video className="h-4 w-4 mr-2" />
                Book Consultation
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log('Chat initiated with', name);
                }}
                data-testid={`button-chat-${id}`}
              >
                <MessageCircle className="h-4 w-4" />
              </Button>
              {whatsapp && (
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-500/20"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(`https://wa.me/${whatsapp}`, '_blank');
                  }}
                  data-testid={`button-whatsapp-${id}`}
                >
                  <SiWhatsapp className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

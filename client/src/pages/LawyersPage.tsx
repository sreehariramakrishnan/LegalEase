import { LawyerCard } from "@/components/LawyerCard";
import { BookingModal } from "@/components/BookingModal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Search, Filter } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { LawyerProfile } from "@shared/schema";

interface LawyerWithUser extends LawyerProfile {
  user: {
    firstName?: string | null;
    lastName?: string | null;
    profileImageUrl?: string | null;
  };
}

export default function LawyersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecializations, setSelectedSpecializations] = useState<string[]>([]);
  const [bookingLawyer, setBookingLawyer] = useState<{ id: string; name: string } | null>(null);

  const { data: lawyers = [], isLoading } = useQuery<LawyerWithUser[]>({
    queryKey: ["/api/lawyer-profiles"],
  });

  const specializations = [
    "Corporate Law",
    "Criminal Defense",
    "Family Law",
    "Intellectual Property",
    "Tax Law",
    "Real Estate",
  ];

  const filteredLawyers = lawyers.filter((lawyer) => {
    const fullName = `${lawyer.user.firstName || ""} ${lawyer.user.lastName || ""}`;
    const matchesSearch =
      fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lawyer.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lawyer.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSpecialization =
      selectedSpecializations.length === 0 ||
      selectedSpecializations.includes(lawyer.specialization);

    return matchesSearch && matchesSpecialization;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading lawyers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Find a Lawyer</h1>
        <p className="text-muted-foreground">
          Browse verified legal professionals by specialization, location, and rating
        </p>
      </div>

      <div className="flex gap-6">
        <aside className="w-80 flex-shrink-0 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-semibold mb-3 block">
                  Specialization
                </Label>
                <div className="space-y-2">
                  {specializations.map((spec) => (
                    <div key={spec} className="flex items-center space-x-2">
                      <Checkbox
                        id={spec}
                        checked={selectedSpecializations.includes(spec)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedSpecializations([...selectedSpecializations, spec]);
                          } else {
                            setSelectedSpecializations(
                              selectedSpecializations.filter((s) => s !== spec)
                            );
                          }
                        }}
                        data-testid={`checkbox-specialization-${spec.toLowerCase().replace(/\s+/g, '-')}`}
                      />
                      <label
                        htmlFor={spec}
                        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {spec}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {selectedSpecializations.length > 0 && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setSelectedSpecializations([])}
                  data-testid="button-clear-filters"
                >
                  Clear Filters
                </Button>
              )}
            </CardContent>
          </Card>
        </aside>

        <div className="flex-1 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, specialization, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="input-search-lawyers"
            />
          </div>

          <div className="text-sm text-muted-foreground">
            Showing {filteredLawyers.length} of {lawyers.length} lawyers
          </div>

          <div className="space-y-4">
            {filteredLawyers.map((lawyer) => {
              const fullName = `${lawyer.user.firstName || ""} ${lawyer.user.lastName || ""}`.trim();
              return (
                <LawyerCard
                  key={lawyer.id}
                  id={lawyer.id}
                  name={fullName || "Unknown"}
                  avatar={lawyer.user.profileImageUrl || ""}
                  specialization={lawyer.specialization}
                  location={lawyer.location}
                  rating={parseFloat(lawyer.rating?.toString() || "0")}
                  reviewCount={lawyer.reviewCount || 0}
                  experience={lawyer.experience}
                  hearings={lawyer.hearings || 0}
                  eloRating={lawyer.eloRating || 1500}
                  isOnline={lawyer.isOnline || false}
                  status={(lawyer.status as "available" | "busy" | "offline") || "offline"}
                  whatsapp={lawyer.whatsapp || undefined}
                  onBook={() => setBookingLawyer({ id: lawyer.userId, name: fullName })}
                  onClick={() => console.log("View profile", lawyer.id)}
                />
              );
            })}
          </div>

          {filteredLawyers.length === 0 && (
            <Card className="p-12">
              <div className="text-center">
                <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">No lawyers found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or search query
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedSpecializations([]);
                  }}
                  data-testid="button-reset-search"
                >
                  Reset Search
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>

      {bookingLawyer && (
        <BookingModal
          open={!!bookingLawyer}
          onOpenChange={(open) => !open && setBookingLawyer(null)}
          lawyerId={bookingLawyer.id}
          lawyerName={bookingLawyer.name}
        />
      )}
    </div>
  );
}

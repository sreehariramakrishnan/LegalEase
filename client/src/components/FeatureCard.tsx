import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

export function FeatureCard({ title, description, icon: Icon }: FeatureCardProps) {
  return (
    <Card className="card-lift group cursor-pointer border-2 border-transparent hover:border-primary/20 hover:shadow-glow overflow-hidden" data-testid={`card-feature-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-chart-2/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <CardHeader className="relative">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-chart-2/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
          <Icon className="h-8 w-8 text-primary group-hover:text-chart-2 transition-colors" />
        </div>
        <CardTitle className="text-2xl group-hover:text-primary transition-colors">{title}</CardTitle>
        <CardDescription className="text-base leading-relaxed mt-2">{description}</CardDescription>
      </CardHeader>
    </Card>
  );
}

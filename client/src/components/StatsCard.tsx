import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
}

export function StatsCard({ title, value, icon: Icon, description }: StatsCardProps) {
  return (
    <Card className="card-lift group hover:shadow-glow border-2 border-transparent hover:border-primary/20 overflow-hidden" data-testid={`card-stats-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-chart-2/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">{title}</CardTitle>
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </CardHeader>
      <CardContent className="relative">
        <div className="text-3xl font-bold group-hover:text-primary transition-colors" data-testid={`text-stats-value-${title.toLowerCase().replace(/\s+/g, '-')}`}>{value}</div>
        {description && (
          <p className="text-sm text-muted-foreground mt-2 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-chart-2" />
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

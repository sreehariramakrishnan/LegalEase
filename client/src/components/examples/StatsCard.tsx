import { StatsCard } from "../StatsCard";
import { MessageSquare } from "lucide-react";

export default function StatsCardExample() {
  return (
    <div className="p-8 max-w-sm">
      <StatsCard
        title="Active Chats"
        value={12}
        icon={MessageSquare}
        description="3 pending responses"
      />
    </div>
  );
}

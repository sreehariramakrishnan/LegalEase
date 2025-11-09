import { FeatureCard } from "../FeatureCard";
import { MessageSquare } from "lucide-react";

export default function FeatureCardExample() {
  return (
    <div className="p-8 max-w-sm">
      <FeatureCard
        icon={MessageSquare}
        title="AI Legal Assistant"
        description="Get instant answers to your legal questions with our Gemini-powered chatbot that understands country-specific laws."
      />
    </div>
  );
}

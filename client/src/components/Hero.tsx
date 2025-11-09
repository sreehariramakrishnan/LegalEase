import { Button } from "@/components/ui/button";
import { ArrowRight, MessageSquare, Shield } from "lucide-react";
import heroImage from "@assets/generated_images/Hero_section_consultation_image_b52993da.png";

export function Hero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-chart-2/10">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-chart-2/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <div className="space-y-8 animate-slide-in-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-chart-2 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-chart-2"></span>
              </span>
              <span className="text-sm font-medium text-primary">AI-Powered Legal Platform</span>
            </div>

            <div className="space-y-6">
              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight leading-tight">
                Your AI-Powered{" "}
                <span className="text-gradient animate-gradient inline-block">
                  Legal Companion
                </span>
              </h1>
              <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed">
                Get instant legal guidance, connect with verified lawyers, and
                securely store your documents—all in your language.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="text-lg px-8 py-6 shadow-glow-gold group" 
                asChild 
                data-testid="button-get-started"
              >
                <a href="/api/login">
                  <MessageSquare className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  Start Free Chat
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8 py-6 hover:shadow-glow group" 
                asChild 
                data-testid="button-find-lawyer"
              >
                <a href="/api/login">
                  Find a Lawyer
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/20">
                <Shield className="h-5 w-5 text-green-500 animate-pulse" />
                <span className="text-sm font-medium text-green-700 dark:text-green-400">
                  256-bit Encryption
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/20">
                <div className="text-sm font-medium text-primary">
                  Available in <strong className="text-chart-2">7+ languages</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Right image */}
          <div className="relative animate-slide-in-right">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-chart-2/30 rounded-3xl blur-3xl animate-pulse-glow" />
            <div className="relative">
              <img
                src={heroImage}
                alt="Legal consultation"
                className="relative rounded-3xl shadow-2xl border-4 border-white/20 dark:border-gray-800/20 hover:scale-105 transition-transform duration-500"
              />
              {/* Floating badges */}
              <div className="absolute -top-4 -left-4 glass-strong rounded-2xl px-4 py-3 shadow-lg animate-float">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                  <span className="font-semibold text-sm">24/7 Available</span>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 glass-strong rounded-2xl px-4 py-3 shadow-lg animate-float" style={{ animationDelay: '1s' }}>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-chart-2">1000+</span>
                  <span className="text-sm text-muted-foreground">Lawyers</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
